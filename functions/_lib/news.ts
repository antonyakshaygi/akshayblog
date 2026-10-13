export interface Env {
  DB: { prepare(query: string): any; batch(statements: any[]): Promise<any[]> };
  GEMINI_API_KEY?: string;
}

const FEEDS = [
  'https://news.google.com/rss/search?q=India+finance+markets+RBI+when:1d&hl=en-IN&gl=IN&ceid=IN:en',
  'https://news.google.com/rss/search?q=artificial+intelligence+technology+when:1d&hl=en-IN&gl=IN&ceid=IN:en',
  'https://news.google.com/rss/search?q=Indian+business+startups+technology+when:1d&hl=en-IN&gl=IN&ceid=IN:en',
  'https://feeds.bbci.co.uk/news/technology/rss.xml',
  'https://www.theverge.com/rss/index.xml',
  'https://techcrunch.com/feed/'
];
const enc = (s: string) => s.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<[^>]*>/g, '').trim();
const tag = (xml: string, name: string) => enc(xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] || '');
async function hashId(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].slice(0, 18).map(n => n.toString(16).padStart(2, '0')).join('');
}
function dateLabel(ms: number) {
  return new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ms)) + ' IST';
}
function categoryFor(title: string) {
  if (/market|stock|rbi|bank|economy|finance|rupee|sensex|nifty|inflation|bitcoin|crypto/i.test(title)) return 'financial-markets';
  if (/ai|artificial intelligence|chip|semiconductor|software|startup|google|openai|model|gpu/i.test(title)) return 'ai-deep-tech';
  return 'big-tech';
}
export async function refreshNews(env: Env) {
  const settled = await Promise.allSettled(FEEDS.map(async (feed) => {
    const response = await fetch(feed, { headers: { 'User-Agent': 'SapiexaNewsroom/1.0 (+https://akshayblog.sapiexa.com)' }, signal: AbortSignal.timeout(9000) });
    if (!response.ok) return [] as any[];
    const xml = await response.text();
    const blocks = [...xml.matchAll(/<(?:item|entry)\b[^>]*>([\s\S]*?)<\/(?:item|entry)>/gi)].slice(0, 20);
    const articles = [];
    for (const match of blocks) {
      const block = match[1];
      const title = tag(block, 'title');
      let link = tag(block, 'link');
      if (!link) link = block.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] || '';
      const pubDate = tag(block, 'pubDate') || tag(block, 'published') || tag(block, 'updated');
      const source = tag(block, 'source') || (() => { try { return new URL(link).hostname.replace(/^www\./, ''); } catch { return 'News publisher'; } })();
      if (!title || !link || !/^https?:\/\//i.test(link)) continue;
      const ts = pubDate ? Date.parse(pubDate) : Date.now();
      const timestamp = Number.isFinite(ts) ? ts : Date.now();
      const id = `rss-${await hashId(link)}`;
      const category = categoryFor(title);
      articles.push({
        id, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70), title,
        summary: `Headline collected from ${source}. Open the original publisher's report for full context and details.`,
        fullContent: [title, `Publisher: ${source}.`, `This headline was collected from a public RSS feed. Read the original report for details: ${link}`],
        category, publishedAt: dateLabel(timestamp), publishedTimestamp: timestamp, readTime: '2 min read',
        source: { name: source, domain: (() => { try { return new URL(link).hostname; } catch { return source; } })(), url: link, isVerified: false },
        marketImpact: { sentiment: 'NEUTRAL', reason: 'No market impact is inferred from the headline alone. Read the linked report for verified details.' },
        aiSeo: { keyTakeaways: [title, `Publisher: ${source}`, 'Read the original report for complete details.'], geoSummary: title, targetKeywords: ['India News', 'Technology', 'Financial Markets'], readabilityScore: 90, factChecked: false, confidenceScore: 60, jsonLdSchema: { '@context': 'https://schema.org', '@type': 'NewsArticle', headline: title, datePublished: new Date(timestamp).toISOString(), url: link } },
        isBreaking: Date.now() - timestamp < 2 * 60 * 60 * 1000, author: { name: source, role: 'Original publisher · RSS feed' }
      });
    }
    return articles;
  }));
  const incoming = settled.flatMap(r => r.status === 'fulfilled' ? r.value : []);
  const statements = incoming.map(article => env.DB.prepare('INSERT INTO news_articles (id, published_timestamp, payload) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET published_timestamp=excluded.published_timestamp, payload=excluded.payload').bind(article.id, article.publishedTimestamp, JSON.stringify(article)));
  if (statements.length) await env.DB.batch(statements);
  await env.DB.prepare("INSERT INTO app_metadata (key, value) VALUES ('last_news_refresh', ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(String(Date.now())).run();
  await env.DB.prepare('DELETE FROM news_articles WHERE published_timestamp < ?').bind(Date.now() - 30 * 24 * 60 * 60 * 1000).run();
  return incoming.length;
}
export async function getLatestNews(env: Env) {
  const result = await env.DB.prepare('SELECT payload FROM news_articles ORDER BY published_timestamp DESC LIMIT 100').all();
  return (result.results || []).map((row: any) => { try { return JSON.parse(row.payload); } catch { return null; } }).filter(Boolean);
}
export function istDateLabel(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(date);
}
export async function createEdition(env: Env) {
  const articles = await getLatestNews(env);
  const today = istDateLabel();
  const lead = articles[0];
  const placeholder = {
    id: 'no-live-headline', slug: 'no-live-headline', title: 'Waiting for current publisher headlines',
    summary: 'No headlines were available at the time this edition was generated. Try refreshing the live wire.',
    fullContent: ['No current headline was returned by the configured RSS feeds.', 'The newsroom does not invent market prices or news events.', 'Please use the live wire again after the next feed refresh.'],
    category: 'big-tech', publishedAt: 'Feed unavailable', publishedTimestamp: Date.now(), readTime: '1 min read',
    source: { name: 'Sapiexa Newsroom', domain: 'akshayblog.sapiexa.com', isVerified: false },
    marketImpact: { sentiment: 'NEUTRAL', reason: 'No market impact inferred.' },
    aiSeo: { keyTakeaways: ['No current headlines available.'], geoSummary: 'Waiting for publisher headlines.', targetKeywords: [], readabilityScore: 0, factChecked: false, confidenceScore: 0, jsonLdSchema: {} },
    author: { name: 'Sapiexa Newsroom', role: 'Editorial Desk' }
  };
  const leadArticle = lead || placeholder;
  let edition: any = {
    id: 'daily-edition-latest', volumeIssue: `DAILY EDITION · ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
    editionDate: today, publishedAt: '07:00 AM IST · Daily Edition', publishedTimestamp: Date.now(),
    leadHeadline: lead ? `THE BEST INDIA: ${String(lead.title).toUpperCase().slice(0, 105)}` : 'THE BEST INDIA: LIVE NEWSROOM',
    leadSubhead: lead ? lead.summary : 'No publisher headlines are available yet. The edition will refresh automatically.',
    leadArticle, marketSnapshot: [],
    aiAndTechTopStories: articles.filter((a: any) => a.category === 'ai-deep-tech' || a.category === 'big-tech').slice(0, 4),
    financialTopStories: articles.filter((a: any) => a.category === 'financial-markets').slice(0, 4),
    indianEconomyTopStories: articles.filter((a: any) => /india|indian|rbi|rupee|sensex|nifty/i.test(a.title)).slice(0, 4),
    editorsBriefing: { author: 'Sapiexa Newsroom', role: 'Editorial Desk', title: `Morning Intelligence Briefing — ${today}`, highlightQuote: 'Read the source. Check the facts. Make informed decisions.', paragraphs: articles.slice(0, 5).map((a: any) => `${a.title} — ${a.summary}`) },
    curatedCount: articles.length, verifiedAt7AM: true,
    headlines: articles.slice(0, 12).map((a: any) => ({ title: a.title, source: a.source?.name, url: a.source?.url, publishedAt: a.publishedAt }))
  };
  if (env.GEMINI_API_KEY && articles.length) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `Write an editorial briefing based ONLY on these supplied headlines. Do not add facts, figures, events, or claims not contained in them. Return JSON with leadHeadline, leadSubhead, editorsTitle, highlightQuote, editorsParagraphs (array of 3 paragraphs). Date: ${today}. Headlines: ${articles.slice(0, 10).map((a: any) => `${a.title} [${a.source?.name}; ${a.source?.url}]`).join('\n')}` }] }], generationConfig: { responseMimeType: 'application/json' } })
      });
      if (response.ok) {
        const data: any = await response.json();
        const raw = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('') || '{}';
        const parsed = JSON.parse(raw);
        edition = { ...edition, leadHeadline: parsed.leadHeadline || edition.leadHeadline, leadSubhead: parsed.leadSubhead || edition.leadSubhead, editorsBriefing: { ...edition.editorsBriefing, title: parsed.editorsTitle || edition.editorsBriefing.title, highlightQuote: parsed.highlightQuote || edition.editorsBriefing.highlightQuote, paragraphs: Array.isArray(parsed.editorsParagraphs) ? parsed.editorsParagraphs : edition.editorsBriefing.paragraphs } };
      }
    } catch { /* Feed-based edition remains available if AI generation fails. */ }
  }
  await env.DB.prepare("INSERT INTO newspaper_editions (id, edition_date, published_timestamp, payload) VALUES ('latest', ?, ?, ?) ON CONFLICT(id) DO UPDATE SET edition_date=excluded.edition_date, published_timestamp=excluded.published_timestamp, payload=excluded.payload").bind(today, edition.publishedTimestamp, JSON.stringify(edition)).run();
  return edition;
}
export async function getEdition(env: Env) {
  const row = await env.DB.prepare("SELECT payload FROM newspaper_editions WHERE id='latest'").first();
  if (!row?.payload) return createEdition(env);
  try {
    const edition = JSON.parse(row.payload as string);
    const currentIstTime = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    const editionIstTime = new Date(Number(edition.publishedTimestamp || 0)).toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    if (edition.editionDate !== istDateLabel() || (currentIstTime >= '07:00' && editionIstTime < '07:00')) return createEdition(env);
    return edition;
  } catch { return createEdition(env); }
}
export async function generateArticle(env: Env, topic: string, category: string) {
  if (!env.GEMINI_API_KEY) throw new Error('AI generation is not configured. Add GEMINI_API_KEY as a Cloudflare secret.');
  const prompt = `Write a clearly labeled AI-assisted news analysis, not fabricated breaking news. Do not invent quotes, sources, statistics, or claims. If current facts cannot be established, state that. Topic: ${topic || 'Latest technology and Indian financial-market developments'}. Category: ${category}. Return JSON: {"title":"","slug":"","summary":"","paragraphs":[""],"sourceName":"","sourceUrl":"","keyTakeaways":[""],"keywords":[""]}.`;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json' } }) });
  if (!response.ok) throw new Error(`Gemini API returned ${response.status}`);
  const data: any = await response.json();
  const raw = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('') || '{}';
  const parsed = JSON.parse(raw);
  const article = { id: `ai-${crypto.randomUUID()}`, slug: parsed.slug || `ai-analysis-${Date.now()}`, title: parsed.title || topic || 'Technology News Analysis', summary: parsed.summary || '', fullContent: Array.isArray(parsed.paragraphs) ? parsed.paragraphs : [], category, publishedAt: dateLabel(Date.now()), publishedTimestamp: Date.now(), readTime: '3 min read', source: { name: parsed.sourceName || 'AI-assisted analysis', domain: (() => { try { return new URL(parsed.sourceUrl).hostname; } catch { return 'akshayblog.sapiexa.com'; } })(), url: parsed.sourceUrl || '', isVerified: false }, marketImpact: { sentiment: 'NEUTRAL', reason: 'AI-assisted analysis; independently verify facts before relying on it.' }, aiSeo: { keyTakeaways: parsed.keyTakeaways || [], geoSummary: parsed.summary || '', targetKeywords: parsed.keywords || [], readabilityScore: 85, factChecked: false, confidenceScore: 50, jsonLdSchema: { '@context': 'https://schema.org', '@type': 'NewsArticle', headline: parsed.title || topic } }, isBreaking: false, author: { name: 'Sapiexa Newsroom', role: 'AI-assisted analysis' } };
  await env.DB.prepare('INSERT INTO news_articles (id, published_timestamp, payload) VALUES (?, ?, ?)').bind(article.id, article.publishedTimestamp, JSON.stringify(article)).run();
  return article;
}
