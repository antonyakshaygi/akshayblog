import { generateArticle, type Env } from '../../_lib/news';
export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const body: any = await request.json();
    const topic = typeof body.topic === 'string' ? body.topic.slice(0, 300) : '';
    const category = typeof body.category === 'string' ? body.category.slice(0, 60) : 'ai-deep-tech';
    const article = await generateArticle(env, topic, category);
    return Response.json({ success: true, article }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: any) { return Response.json({ success: false, error: error?.message || 'Generation failed.' }, { status: 503 }); }
};
