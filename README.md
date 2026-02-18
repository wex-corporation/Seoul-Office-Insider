Seoul Office Insider is a mobile-first static web app that follows the same codebase style as K-Chicken-Sommelier (`index.html`, `styles.css`, `data.js`, `app.js`).

## What is implemented
- Map-first discovery for Seoul Top 45 office buildings
- Free 3 data points per building (location, completion year, teaser metric)
- Building detail with paid lock states (`Overview / Architecture / Value / Rent / Community`)
- Building-thread community (QnA / Notes / Photo posts)
- Free vs Paid feature split, mock paywall and subscription state
- Explore tab with district collections, ranking, Pro compare table + delta bars
- Paywall lock summary with data counts (transaction/rent/compare)
- Community trust controls (new-user rate limit, report auto-hide, role verification request)
- Client telemetry hooks for PostHog/Sentry
- Rights/legal notice area for image-license gating

## Run
Open `index.html` directly in a browser, or run a simple local server:

```bash
cd /Users/shchoi/Documents/Seoul-Office-Insider
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Deploy (Vercel)
This repo is configured as a static SPA for Vercel.

1. Import `/Users/shchoi/Documents/Seoul-Office-Insider` into Vercel.
2. Framework preset: `Other`.
3. Build command: none.
4. Output directory: root (`.`).
5. Deploy.

Included config:
- `/Users/shchoi/Documents/Seoul-Office-Insider/vercel.json`
- SPA rewrite for non-file paths to `/index.html`
- cache revalidation headers for `index.html`, `js`, `css`

## Telemetry setup
Telemetry is optional and controlled by `/Users/shchoi/Documents/Seoul-Office-Insider/config.js`.

- `window.APP_CONFIG.telemetry.posthogToken`
- `window.APP_CONFIG.telemetry.posthogHost`
- `window.APP_CONFIG.telemetry.sentryDsn`
- `window.APP_CONFIG.telemetry.environment`
- `window.APP_CONFIG.telemetry.release`

When tokens are empty, telemetry runs in no-op mode.

## Data model
See `/Users/shchoi/Documents/Seoul-Office-Insider/data.js` for:
- Building schema + paid fields
- Community post schema
- Access matrix (Free/Paid/Admin)
- Rights notice policy state

## Handoff package
See `/Users/shchoi/Documents/Seoul-Office-Insider/docs/handoff.md`.
