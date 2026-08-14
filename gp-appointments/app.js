const storage = {
  endpoint: 'gpAppointmentsEndpoint', token: 'gpAppointmentsToken', cache: 'gpAppointmentsCache'
};
const elements = {
  list: document.querySelector('#appointment-list'), next: document.querySelector('#next-appointment'),
  status: document.querySelector('#status'), dialog: document.querySelector('#settings-dialog'),
  endpoint: document.querySelector('#endpoint'), token: document.querySelector('#token')
};
const dateFormat = new Intl.DateTimeFormat(undefined, { weekday:'long', day:'numeric', month:'long' });
const timeFormat = new Intl.DateTimeFormat(undefined, { hour:'2-digit', minute:'2-digit' });

function setStatus(message) { elements.status.textContent = message; }
function configured() { return Boolean(localStorage.getItem(storage.endpoint) && localStorage.getItem(storage.token)); }

function loadAppointments() {
  if (!configured()) { elements.dialog.showModal(); return; }
  setStatus('Refreshing appointments…');
  const callback = '__gpAppointments_' + Date.now();
  const script = document.createElement('script');
  const timer = setTimeout(() => finish(new Error('The service did not respond.')), 15000);
  let finished = false;
  function finish(error, payload) {
    if (finished) return; finished = true; clearTimeout(timer); script.remove(); delete window[callback];
    if (error || !payload || !payload.ok) { setStatus((error && error.message) || (payload && payload.error) || 'Unable to load appointments.'); showCached(); return; }
    localStorage.setItem(storage.cache, JSON.stringify(payload.appointments)); render(payload.appointments);
    setStatus('Updated ' + new Date(payload.generatedAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }));
  }
  window[callback] = payload => finish(null, payload);
  script.onerror = () => finish(new Error('Could not connect to Apps Script.'));
  const endpoint = localStorage.getItem(storage.endpoint).replace(/\/+$/, '');
  script.src = endpoint + '?token=' + encodeURIComponent(localStorage.getItem(storage.token)) + '&callback=' + callback;
  document.head.append(script);
}

function showCached() {
  try { const cached = JSON.parse(localStorage.getItem(storage.cache)); if (Array.isArray(cached)) render(cached); } catch (error) { localStorage.removeItem(storage.cache); }
}

function render(items) {
  const upcoming = items.filter(item => new Date(item.end) >= new Date());
  elements.list.replaceChildren();
  upcoming.forEach(item => elements.list.append(createCard(item)));
  if (!upcoming.length) elements.list.append(Object.assign(document.createElement('p'), { className:'status', textContent:'No upcoming appointments.' }));
  renderNext(upcoming[0]);
}

function createCard(item) {
  const card = document.querySelector('#appointment-template').content.firstElementChild.cloneNode(true);
  const date = new Date(item.start);
  card.querySelector('.day').textContent = date.getDate();
  card.querySelector('.month').textContent = date.toLocaleDateString(undefined, { month:'short' });
  card.querySelector('.time').textContent = timeFormat.format(date);
  card.querySelector('h3').textContent = item.title;
  card.querySelector('.location').textContent = item.location || 'Location to be confirmed';
  const link = card.querySelector('.cancel-link');
  if (safeUrl(item.cancelUrl)) link.href = item.cancelUrl; else link.remove();
  return card;
}

function renderNext(item) {
  elements.next.replaceChildren();
  if (!item) { elements.next.append(Object.assign(document.createElement('p'), { className:'muted', textContent:'Nothing scheduled.' })); return; }
  const date = new Date(item.start);
  const title = Object.assign(document.createElement('h2'), { textContent:dateFormat.format(date) + ' at ' + timeFormat.format(date) });
  const meta = Object.assign(document.createElement('p'), { className:'meta', textContent:item.title + (item.location ? ' · ' + item.location : '') });
  elements.next.append(title, meta);
  if (safeUrl(item.cancelUrl)) { const link = Object.assign(document.createElement('a'), { className:'cancel-link', href:item.cancelUrl, textContent:'Change or cancel', target:'_blank', rel:'noopener noreferrer' }); elements.next.append(link); }
}

function safeUrl(value) { try { return new URL(value).protocol === 'https:'; } catch (error) { return false; } }

document.querySelector('#settings-button').addEventListener('click', () => { elements.endpoint.value = localStorage.getItem(storage.endpoint) || ''; elements.token.value = localStorage.getItem(storage.token) || ''; elements.dialog.showModal(); });
document.querySelector('#refresh-button').addEventListener('click', loadAppointments);
document.querySelector('#settings-form').addEventListener('submit', event => {
  if (event.submitter.value !== 'save') return;
  event.preventDefault(); localStorage.setItem(storage.endpoint, elements.endpoint.value.trim()); localStorage.setItem(storage.token, elements.token.value.trim()); elements.dialog.close(); loadAppointments();
});
document.querySelector('#clear-button').addEventListener('click', () => { Object.values(storage).forEach(key => localStorage.removeItem(key)); elements.dialog.close(); location.reload(); });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js'));
showCached(); loadAppointments();
