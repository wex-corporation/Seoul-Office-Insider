Seoul Office Insider is a mobile-first static web app that follows the same codebase style as K-Chicken-Sommelier (`index.html`, `styles.css`, `data.js`, `app.js`).

## What is implemented
- Map-first discovery for Seoul Top 45 office buildings
- Free 3 data points per building (location, completion year, teaser metric)
- Building detail with paid lock states (`Overview / Architecture / Value / Rent / Community`)
- Building-thread community (QnA / Notes / Photo posts)
- Free vs Paid feature split, mock paywall and subscription state
- Explore tab with district collections, ranking, and Pro compare table
- Rights/legal notice area for image-license gating

## Run
Open `index.html` directly in a browser, or run a simple local server:

```bash
cd /Users/shchoi/Documents/Seoul-Office-Insider
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Data model
See `/Users/shchoi/Documents/Seoul-Office-Insider/data.js` for:
- Building schema + paid fields
- Community post schema
- Access matrix (Free/Paid/Admin)
- Rights notice policy state

## Handoff package
See `/Users/shchoi/Documents/Seoul-Office-Insider/docs/handoff.md`.
