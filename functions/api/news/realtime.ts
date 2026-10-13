import { getLatestNews, refreshNews, type Env } from '../../_lib/news';
export const onRequestGet = async ({ env, waitUntil }: { env: Env; waitUntil: (promise: Promise<unknown>) => void }) => {
  try {
    const row = await env.DB.prepare("SELECT value FROM app_metadata WHERE key='last_news_refresh'").first();
    const last = Number(row?.value || 0);
    if (last === 0) await refreshNews(env).catch(() => 0);
    else if (Date.now() - last > 5 * 60 * 1000) waitUntil(refreshNews(env).catch(() => 0));
    const articles = await getLatestNews(env);
    return Response.json({ success: true, timestamp: Date.now(), marketTickers: [], articles, totalCount: articles.length, next7AmEditionIn: next7amMillis() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return Response.json({ success: false, error: 'News service is temporarily unavailable.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } }); }
};
function next7amMillis() { const now = new Date(); const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })); const target = new Date(ist); target.setHours(7, 0, 0, 0); if (ist >= target) target.setDate(target.getDate() + 1); return target.getTime() - ist.getTime(); }
