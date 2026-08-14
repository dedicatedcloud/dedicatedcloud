const CONFIG = Object.freeze({
  confirmedLabel: 'GP Appointment Confirmed',
  rescheduledLabel: 'GP Appointment Rescheduled',
  storeKey: 'GP_APPOINTMENTS',
  processedKey: 'GP_PROCESSED_MESSAGES',
  tokenKey: 'GP_API_TOKEN',
  durationMinutes: 15,
  historyDays: 30
});

function setup() {
  const properties = PropertiesService.getScriptProperties();
  if (!properties.getProperty(CONFIG.tokenKey)) {
    properties.setProperty(CONFIG.tokenKey, Utilities.getUuid() + Utilities.getUuid());
  }

  ScriptApp.getProjectTriggers()
    .filter(trigger => trigger.getHandlerFunction() === 'processUniversalGpAppointments')
    .forEach(trigger => ScriptApp.deleteTrigger(trigger));
  ScriptApp.newTrigger('processUniversalGpAppointments').timeBased().everyMinutes(5).create();

  GmailApp.getUserLabelByName(CONFIG.confirmedLabel) || GmailApp.createLabel(CONFIG.confirmedLabel);
  GmailApp.getUserLabelByName(CONFIG.rescheduledLabel) || GmailApp.createLabel(CONFIG.rescheduledLabel);
  console.log(JSON.stringify(getConfiguration(), null, 2));
}

function getConfiguration() {
  return {
    apiToken: PropertiesService.getScriptProperties().getProperty(CONFIG.tokenKey),
    triggerInstalled: ScriptApp.getProjectTriggers()
      .some(trigger => trigger.getHandlerFunction() === 'processUniversalGpAppointments')
  };
}

function rotateApiToken() {
  const token = Utilities.getUuid() + Utilities.getUuid();
  PropertiesService.getScriptProperties().setProperty(CONFIG.tokenKey, token);
  console.log('New API token: ' + token);
  return token;
}

function doGet(event) {
  const parameters = (event && event.parameter) || {};
  const callback = parameters.callback || '';
  const expectedToken = PropertiesService.getScriptProperties().getProperty(CONFIG.tokenKey);
  const authorized = expectedToken && parameters.token === expectedToken;
  const payload = authorized
    ? { ok: true, appointments: readAppointments_(), generatedAt: new Date().toISOString() }
    : { ok: false, error: 'Unauthorized' };

  if (callback && /^[A-Za-z_$][0-9A-Za-z_$\.]{0,80}$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + JSON.stringify(payload) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function processUniversalGpAppointments() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;

  try {
    const confirmedLabel = GmailApp.getUserLabelByName(CONFIG.confirmedLabel) || GmailApp.createLabel(CONFIG.confirmedLabel);
    const rescheduledLabel = GmailApp.getUserLabelByName(CONFIG.rescheduledLabel) || GmailApp.createLabel(CONFIG.rescheduledLabel);
    const processed = new Set(readJsonProperty_(CONFIG.processedKey, []));
    const appointments = readAppointments_();
    const threads = GmailApp.search('in:anywhere newer_than:1y (subject:"appointment has been confirmed" OR subject:"appointment has been rescheduled")', 0, 100);

    threads.forEach(thread => {
      thread.getMessages().forEach(message => {
        if (processed.has(message.getId())) return;
        const subject = message.getSubject().toLowerCase();
        if (!subject.includes('appointment has been confirmed') && !subject.includes('appointment has been rescheduled')) return;

        const parsed = parseAppointment_(message.getBody());
        if (!parsed) return;
        const existingIndex = appointments.findIndex(item => item.key === parsed.key);
        const existing = existingIndex >= 0 ? appointments[existingIndex] : null;
        const event = upsertCalendarEvent_(parsed, existing);
        parsed.calendarEventId = event.getId();
        parsed.updatedAt = new Date().toISOString();

        if (existingIndex >= 0) appointments[existingIndex] = parsed;
        else appointments.push(parsed);

        processed.add(message.getId());
        message.markRead();
        thread.addLabel(subject.includes('rescheduled') ? rescheduledLabel : confirmedLabel);
      });
    });

    const cutoff = Date.now() - CONFIG.historyDays * 86400000;
    const retained = appointments.filter(item => new Date(item.end).getTime() >= cutoff);
    writeJsonProperty_(CONFIG.storeKey, retained);
    writeJsonProperty_(CONFIG.processedKey, Array.from(processed).slice(-500));
  } finally {
    lock.releaseLock();
  }
}

function parseAppointment_(html) {
  const date = field_(html, 'Date');
  const time = field_(html, 'Time');
  if (!date || !time) return null;

  const clinician = field_(html, 'With') || 'Clinician';
  const where = field_(html, 'Where');
  const address = field_(html, 'Address');
  const digital = field_(html, 'Digital Appointment');
  const linkMatch = html.match(/<a\s[^>]*href=["']([^"']+)["'][^>]*>\s*change or cancel your appointment\s*<\/a>/i);
  const cancelUrl = linkMatch ? decodeHtml_(linkMatch[1].trim()) : '';
  const dateText = date.replace(/^.*?,\s*/, '');
  const start = new Date(dateText + ' ' + time);
  if (isNaN(start.getTime())) return null;

  const location = digital ? 'Digital appointment' : [where, address].filter(Boolean).join(', ');
  return {
    key: cancelUrl || [dateText, time, clinician].join('|').toLowerCase(),
    title: 'GP Appointment with ' + clinician,
    clinician: clinician,
    start: start.toISOString(),
    end: new Date(start.getTime() + CONFIG.durationMinutes * 60000).toISOString(),
    location: location,
    details: digital || [where && 'Where: ' + where, address && 'Address: ' + address].filter(Boolean).join('\n'),
    cancelUrl: cancelUrl
  };
}

function field_(html, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = html.match(new RegExp('<th[^>]*>\\s*' + escaped + ':?\\s*</th>\\s*<td[^>]*>([\\s\\S]*?)</td>', 'i'));
  return match ? decodeHtml_(match[1].replace(/<br\s*\/?\s*>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()) : '';
}

function decodeHtml_(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function upsertCalendarEvent_(appointment, existing) {
  const calendar = CalendarApp.getDefaultCalendar();
  let event = existing && existing.calendarEventId ? calendar.getEventById(existing.calendarEventId) : null;
  const options = { description: appointment.details, location: appointment.location };
  if (!event) {
    event = calendar.createEvent(appointment.title, new Date(appointment.start), new Date(appointment.end), options);
    event.addPopupReminder(1440);
    event.addPopupReminder(60);
  } else {
    event.setTitle(appointment.title).setTime(new Date(appointment.start), new Date(appointment.end));
    event.setDescription(appointment.details).setLocation(appointment.location);
  }
  return event;
}

function readAppointments_() {
  return readJsonProperty_(CONFIG.storeKey, []).sort((a, b) => new Date(a.start) - new Date(b.start));
}

function readJsonProperty_(key, fallback) {
  const value = PropertiesService.getScriptProperties().getProperty(key);
  if (!value) return fallback;
  try { return JSON.parse(value); } catch (error) { return fallback; }
}

function writeJsonProperty_(key, value) {
  PropertiesService.getScriptProperties().setProperty(key, JSON.stringify(value));
}
