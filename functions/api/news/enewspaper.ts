import { getEdition, type Env } from '../../_lib/news';
export const onRequestGet = async ({ env }: { env: Env }) => {
  try { const edition = await getEdition(env); return Response.json({ success: true, edition, timestamp: Date.now() }, { headers: { 'Cache-Control': 'no-store' } }); }
  catch { return Response.json({ success: false, error: 'Newspaper edition is temporarily unavailable.' }, { status: 503 }); }
};
