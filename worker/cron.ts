import { createEdition, refreshNews, type Env } from '../functions/_lib/news';
export default {
  async scheduled(event: { cron: string }, env: Env, ctx: { waitUntil(promise: Promise<unknown>): void }) {
    ctx.waitUntil((async () => {
      await refreshNews(env).catch(() => 0);
      if (event.cron === '30 1 * * *') await createEdition(env);
    })());
  }
};
