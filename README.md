<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/a08c0d10-975e-48be-a5cb-8dc179630f81

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Cloudflare deployment

The current deployment target is Cloudflare Pages + Pages Functions + D1, with a scheduled Cloudflare Worker for RSS refresh and the daily 7:00 AM IST e-newspaper. Follow [`CLOUDFLARE_SETUP.md`](./CLOUDFLARE_SETUP.md) before deploying; it explains the D1 database ID, schema initialization, API secrets, GitHub Actions secrets, and safe custom-domain cutover.

