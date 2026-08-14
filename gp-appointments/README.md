# GP appointments PWA

This folder contains a small installable web app and a Google Apps Script backend. The backend reads Universal GP confirmation/reschedule emails, creates or updates Google Calendar events, and exposes only the appointment fields needed by the app.

## 1. Create the Apps Script backend

1. Create a new standalone project at [script.google.com](https://script.google.com).
2. Copy `apps-script/Code.gs` and `apps-script/appsscript.json` into the project. In **Project settings**, enable **Show "appsscript.json" manifest file** before replacing the manifest.
3. Run `setup()` once and approve the Gmail, Calendar, and external-request permissions. It creates a random API token and a five-minute trigger (a one-minute trigger is usually unnecessary).
4. Run `getConfiguration()` and copy the token from the execution log.
5. Choose **Deploy > New deployment > Web app**. Set **Execute as** to yourself and **Who has access** to **Anyone**. Copy the `/exec` URL.

The web endpoint must be reachable without a Google sign-in because a GitHub Pages service worker cannot pass your Google session to Apps Script. Treat the long token like a password: it grants read access to appointment details and cancellation URLs. Run `rotateApiToken()` and redeploy immediately if it is exposed.

## 2. Configure and publish the PWA

Open the published `gp-appointments/` page, select **Settings**, and paste the Apps Script `/exec` URL and API token. Configuration is kept only in that browser's local storage. On iOS use **Share > Add to Home Screen**; supported desktop and Android browsers also show an install option.

The app uses JSONP rather than `fetch`, which avoids cross-origin redirect limitations in Apps Script's Content Service. The callback name is validated by the backend, and all returned values are rendered with DOM text properties rather than inserted as HTML.

## Behaviour and privacy

- The backend records processed Gmail message IDs, so re-running it does not duplicate events.
- A reschedule updates an existing record when the cancellation URL is unchanged; otherwise it creates a new appointment.
- Past appointments remain available for 30 days and are then pruned from the app data.
- The PWA caches its interface for offline use. The last successfully loaded appointment list is cached locally, including cancellation links. Do not use it on a shared device.
- Cancelling through the provider's link does not automatically delete the Calendar event. The next confirmation or reschedule email will update the list, but cancellation emails vary between providers and are not parsed.

## Manual checks

After deployment, run `processUniversalGpAppointments()` from the editor with a real confirmation email, then open the PWA and press **Refresh**. Use `getConfiguration()` to confirm the trigger and deployment settings if the list remains empty.
