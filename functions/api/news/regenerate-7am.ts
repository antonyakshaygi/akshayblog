import { createEdition, refreshNews, type Env } from '../../_lib/news';
export const onRequestPost = async ({ env }: { env: Env }) => {
  try {
    await refreshNews(env).catch(() => 0);
    const edition = await createEdition(env);
    return Response.json({ success: true, edition }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ success: false, error: 'Could not regenerate the newspaper.' }, { status: 503 });
  }
};
