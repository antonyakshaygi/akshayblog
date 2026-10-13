# Cloudflare Pages + Functions + D1 + Cron setup

This repository is prepared for Cloudflare Pages (React/Vite frontend and `/api/*` Pages Functions), Cloudflare D1 (persistent news and e-newspaper records), and a separate scheduled Worker (feed refresh and 7:00 AM IST edition).

## 1. Create Cloudflare resources

1. In Cloudflare, create a Pages project named `akshay-s-tech-blog`.
2. Create a D1 database named `akshay-s-tech-blog-db`.
3. Copy its database ID into both `wrangler.toml` and `wrangler.cron.toml`, replacing `REPLACE_WITH_D1_DATABASE_ID`.
4. Apply the schema: `npx wrangler d1 execute akshay-s-tech-blog-db --remote --file=./schema.sql`.
5. Add GitHub repository Actions secrets named `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. The token needs Cloudflare Pages edit, Workers edit, and D1 edit permissions for this account.
6. Add the Gemini key as a Worker secret: `npx wrangler secret put GEMINI_API_KEY --config wrangler.cron.toml`. The secret is optional; feed-based news and a headline-based e-newspaper still work without it. Never put the key in `VITE_*` variables or frontend source.

## 2. First deployment

After filling in the D1 database ID and GitHub secrets, run:

```sh
npm install --legacy-peer-deps
npm run build
npx wrangler pages deploy dist --project-name=akshay-s-tech-blog --branch=main
npx wrangler deploy --config wrangler.cron.toml
```

The GitHub Actions workflow performs these deployments on pushes to `main` or `master`.

## 3. Connect the custom domain safely

First test the generated `*.pages.dev` URL and the API routes. Confirm that `/api/news/realtime` returns headlines, `/api/news/enewspaper` returns an edition, and a manual refresh succeeds. Only then attach `akshayblog.sapiexa.com` in the Cloudflare Pages project's Custom domains section and verify its DNS/TLS status. Do not delete the old hosting DNS record until the Cloudflare deployment passes those checks.

## 4. Scheduled jobs

The Cron Worker runs every 15 minutes to refresh RSS sources and at `01:30 UTC` daily (`07:00 Asia/Kolkata`) to save the daily edition to D1. The API also refreshes feeds on demand if the last successful refresh is older than five minutes. Sources include Google News RSS queries, BBC Technology RSS, The Verge RSS, and TechCrunch RSS. Feed results are headlines with links to publishers; the site does not fabricate stock prices.

## 5. API routes

- `GET /api/news/realtime` — current saved publisher headlines, last refresh metadata, and next 7 AM countdown.
- `GET /api/news/enewspaper` — saved daily edition.
- `POST /api/news/generate` — AI-assisted analysis; requires `GEMINI_API_KEY`.
- `POST /api/news/regenerate-7am` — refresh and rebuild the daily edition.

## Notes

- Blog and affiliate lists start empty. A one-time browser-storage migration clears legacy post lists so old demo posts do not reappear automatically; new posts created afterward can still be saved in that browser.
- Dark mode is enforced site-wide. The theme panel only offers typography and reading-width controls.
- The API deliberately returns an empty market-ticker list until a real licensed/verified quote provider is configured; it does not simulate price movements.
- The scheduled worker and Pages Functions share the same D1 database. Run the D1 schema step once before the first deployment.
