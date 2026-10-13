export interface Env {
  DB: { prepare(query: string): any; batch(statements: any[]): Promise<any[]> };
  GEMINI_API_KEY?: string;
}

// One model configuration is shared by article generation and the daily edition.
const GEMINI_MODEL = 'gemini-3.8-flash';

const FEEDS = [
  'https://news.google.com/rss/search?q=India+finance+markets+RBI+when:1d&hl=en-IN&gl=IN&ceid=IN:en',
  'https://news.google.com/rss/search?q=artificial+intelligence+technology+when:1d&hl=en-IN&gl=IN&ceid=IN:en',
  'https://news.google.com/rss/search?q=Indian+business+startups+technology+when:1d&hl=en-IN&gl=IN&ceid=IN:en',
  'https://feeds.bbci.co.uk/news/technology/rss.xml',
  'https://www.theverge.com/rss/index.xml',
  'https://techcrunch.com/feed/'
];

const enc = (s: string) => s
  .replace(/<!\[CDATA\[|\]\]>/g, '')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#(\d+);/g, (_m, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_m, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const rawTag = (xml: string, name: string) =>
  xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] || '';
const tag = (xml: string, name: string) => enc(rawTag(xml, name));

function paragraphsFrom(raw: string): string[] {
  if (!raw) return [];
  const chunks = raw.replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|div|li)>/gi, '\n')
    .split(/\n+/).map(enc).filter(Boolean);
  const text = enc(raw).slice(0, 4500);
  if (chunks.length > 1) return chunks.slice(0, 6).map(p => p.slice(0, 1200));
  if (!text) return [];
  if (text.length <= 650) return [text];
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const result: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if (current && (current + ' ' + sentence).length > 650) {
      result.push(current.trim());
      current = sentence.trim();
    } else current = `${current} ${sentence}`.trim();
  }
  if (current) result.push(current);
  return result.slice(0, 6);
}

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

/**
 * Ingest publisher RSS descriptions/content when available. Most feeds provide
 * a brief excerpt, not the full article; the UI should link to the publisher
 * for the complete original report.
 */
export async function refreshNews(env: Env) {
  const settled = await Promise.allSettled(FEEDS.map(async feed => {
    const response = await fetch(feed, {
      headers: { 'User-Agent': 'SapiexaNewsroom/1.0 (+https://akshayblog.sapiexa.com)' },
      signal: AbortSignal.timeout(9000)
    });
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
      const source = tag(block, 'source') || (() => {
        try { return new URL(link).hostname.replace(/^www\./, ''); }
        catch { return 'News publisher'; }
      })();
      if (!title || !link || !/^https?:\/\//i.test(link)) continue;

      const parsedDate = pubDate ? Date.parse(pubDate) : Date.now();
      const timestamp = Number.isFinite(parsedDate) ? parsedDate : Date.now();
      const id = `rss-${await hashId(link)}`;
      const category = categoryFor(title);

      // Prefer content:encoded, then description, then summary.
      const rawExcerpt = rawTag(block, 'content:encoded') || rawTag(block, 'description') || rawTag(block, 'summary');
      const bodyParagraphs = paragraphsFrom(rawExcerpt);
      const summaryText = bodyParagraphs.join(' ');
      const summary = summaryText
        ? (summaryText.length > 360 ? `${summaryText.slice(0, 357).trimEnd()}…` : summaryText)
        : `The feed supplied this headline but no summary. Open the original publisher's report for the complete story.`;
      const fullContent = bodyParagraphs.length ? bodyParagraphs : [
        `The publisher's RSS feed did not include a news summary for “${title}”.`,
        `Open the original publisher's report to read the full story: ${link}`
      ];

      articles.push({
        id,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70),
        title, summary, fullContent, category,
        publishedAt: dateLabel(timestamp), publishedTimestamp: timestamp,
        readTime: summaryText.length > 900 ? '3 min read' : '1 min read',
        source: {
          name: source,
          domain: (() => { try { return new URL(link).hostname; } catch { return source; } })(),
          url: link, isVerified: false
        },
        marketImpact: {
          sentiment: 'NEUTRAL',
          reason: 'No market impact is inferred from the headline alone. Read the linked report for verified details.'
        },
        aiSeo: {
          keyTakeaways: [title, ...(summaryText ? [summary] : []), `Publisher: ${source}`, 'Read the original report for complete details.'].slice(0, 4),
          geoSummary: summary,
          targetKeywords: ['India News', 'Technology', 'Financial Markets'],
          readabilityScore: 90, factChecked: false, confidenceScore: 60,
          jsonLdSchema: {
            '@context': 'https://schema.org', '@type': 'NewsArticle',
            headline: title, datePublished: new Date(timestamp).toISOString(), url: link
          }
        },
        isBreaking: Date.now() - timestamp < 2 * 60 * 60 * 1000,
        author: { name: source, role: 'Original publisher · RSS feed' }
      });
    }
    return articles;
  }));

  const incoming = settled.flatMap(r => r.status === 'fulfilled' ? r.value : []);
  const statements = incoming.map(article =>
    env.DB.prepare('INSERT INTO news_articles (id, published_timestamp, payload) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET published_timestamp=excluded.published_timestamp, payload=excluded.payload')
      .bind(article.id, article.publishedTimestamp, JSON.stringify(article))
  );
  if (statements.length) await env.DB.batch(statements);
  await env.DB.prepare("INSERT INTO app_metadata (key, value) VALUES ('last_news_refresh', ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value")
    .bind(String(Date.now())).run();
  await env.DB.prepare('DELETE FROM news_articles WHERE published_timestamp < ?')
    .bind(Date.now() - 30 * 24 * 60 * 60 * 1000).run();
  return incoming.length;
}

export async function getLatestNews(env: Env) {
  const result = await env.DB.prepare('SELECT payload FROM news_articles ORDER BY published_timestamp DESC LIMIT 100').all();
  return (result.results || []).map((row: any) => {
    try { return JSON.parse(row.payload); } catch { return null; }
  }).filter(Boolean);
}

export function istDateLabel(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  }).format(date);
}

async function callGemini(env: Env, prompt: string) {
  if (!env.GEMINI_API_KEY) throw new Error('AI generation is not configured. Add GEMINI_API_KEY as a Cloudflare secret.');
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    }
  );
  if (!response.ok) {
    const details = await response.text();
    console.error('Gemini API error:', response.status, details.slice(0, 1000));
    throw new Error(`Gemini API returned ${response.status}: ${details.slice(0, 500)}`);
  }
  const data: any = await response.json();
  const raw = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('') || '{}';
  try { return JSON.parse(raw); }
  catch { throw new Error('Gemini returned invalid JSON. Please try again.'); }
}

export async function createEdition(env: Env) {
  const articles = await getLatestNews(env);
  const today = istDateLabel();
  const lead = articles[0];
  const placeholder = {
    id: 'no-live-headline', slug: 'no-live-headline',
    title: 'Waiting for current publisher headlines',
    summary: 'No headlines were available at the time this edition was generated. Try refreshing the live wire.',
    fullContent: [
      'No current headline was returned by the configured RSS feeds.',
      'The newsroom does not invent market prices or news events.',
      'Please use the live wire again after the next feed refresh.'
    ],
    category: 'big-tech', publishedAt: 'Feed unavailable', publishedTimestamp: Date.now(),
    readTime: '1 min read',
    source: { name: 'Sapiexa Newsroom', domain: 'akshayblog.sapiexa.com', isVerified: false },
    marketImpact: { sentiment: 'NEUTRAL', reason: 'No market impact inferred.' },
    aiSeo: {
      keyTakeaways: ['No current headlines available.'], geoSummary: 'Waiting for publisher headlines.',
      targetKeywords: [], readabilityScore: 0, factChecked: false, confidenceScore: 0, jsonLdSchema: {}
    },
    author: { name: 'Sapiexa Newsroom', role: 'Editorial Desk' }
  };
  const leadArticle = lead || placeholder;
  let edition: any = {
    id: 'daily-edition-latest',
    volumeIssue: `DAILY EDITION · ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
    editionDate: today, publishedAt: '07:00 AM IST · Daily Edition', publishedTimestamp: Date.now(),
    leadHeadline: lead ? `THE BEST INDIA: ${String(lead.title).toUpperCase().slice(0, 105)}` : 'THE BEST INDIA: LIVE NEWSROOM',
    leadSubhead: lead ? lead.summary : 'No publisher headlines are available yet. The edition will refresh automatically.',
    leadArticle, marketSnapshot: [],
    aiAndTechTopStories: articles.filter((a: any) => a.category === 'ai-deep-tech' || a.category === 'big-tech').slice(0, 4),
    financialTopStories: articles.filter((a: any) => a.category === 'financial-markets').slice(0, 4),
    indianEconomyTopStories: articles.filter((a: any) => /india|indian|rbi|rupee|sensex|nifty/i.test(a.title)).slice(0, 4),
    editorsBriefing: {
      author: 'Sapiexa Newsroom', role: 'Editorial Desk',
      title: `Morning Intelligence Briefing — ${today}`,
      highlightQuote: 'Read the source. Check the facts. Make informed decisions.',
      paragraphs: articles.slice(0, 5).map((a: any) => `${a.title} — ${a.summary}`)
    },
    curatedCount: articles.length, verifiedAt7AM: true,
    headlines: articles.slice(0, 12).map((a: any) => ({
      title: a.title, source: a.source?.name, url: a.source?.url, publishedAt: a.publishedAt
    }))
  };

  if (env.GEMINI_API_KEY && articles.length) {
    try {
      const sourceMaterial = articles.slice(0, 10).map((a: any) =>
        `Headline: ${a.title}\nPublisher: ${a.source?.name || 'Unknown'}\nSummary: ${a.summary}\nURL: ${a.source?.url || ''}`
      ).join('\n\n');
      const parsed = await callGemini(env,
        `Write a concise daily editorial briefing based ONLY on the publisher headlines and summaries below. Do not invent facts, numbers, quotes, causes, or events. Clearly distinguish uncertainty. Return JSON with leadHeadline, leadSubhead, editorsTitle, highlightQuote, editorsParagraphs (array of 3 paragraphs). Date: ${today}.\n\nSOURCE MATERIAL:\n${sourceMaterial}`
      );
      edition = {
        ...edition,
        leadHeadline: parsed.leadHeadline || edition.leadHeadline,
        leadSubhead: parsed.leadSubhead || edition.leadSubhead,
        editorsBriefing: {
          ...edition.editorsBriefing,
          title: parsed.editorsTitle || edition.editorsBriefing.title,
          highlightQuote: parsed.highlightQuote || edition.editorsBriefing.highlightQuote,
          paragraphs: Array.isArray(parsed.editorsParagraphs) ? parsed.editorsParagraphs : edition.editorsBriefing.paragraphs
        }
      };
    } catch (error) {
      console.error('Daily edition AI briefing failed:', error);
      // Keep the RSS-based edition working even if Gemini is unavailable.
    }
  }

  await env.DB.prepare("INSERT INTO newspaper_editions (id, edition_date, published_timestamp, payload) VALUES ('latest', ?, ?, ?) ON CONFLICT(id) DO UPDATE SET edition_date=excluded.edition_date, published_timestamp=excluded.published_timestamp, payload=excluded.payload")
    .bind(today, edition.publishedTimestamp, JSON.stringify(edition)).run();
  return edition;
}

export async function getEdition(env: Env) {
  const row = await env.DB.prepare("SELECT payload FROM newspaper_editions WHERE id='latest'").first();
  if (!row?.payload) return createEdition(env);
  try {
    const edition = JSON.parse(row.payload as string);
    const currentIstTime = new Date().toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    });
    const editionIstTime = new Date(Number(edition.publishedTimestamp || 0)).toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    });
    if (edition.editionDate !== istDateLabel() || (currentIstTime >= '07:00' && editionIstTime < '07:00')) return createEdition(env);
    return edition;
  } catch {
    return createEdition(env);
  }
}

export async function generateArticle(env: Env, topic: string, category: string) {
  const prompt = `Write a useful AI-assisted news analysis as a brief article of 4 to 6 paragraphs, with a clear summary and 3 to 5 key takeaways. Do NOT pretend that an analysis is verified breaking news. Do not invent quotes, sources, statistics, dates, or events. If the prompt provides no source material, say that current facts must be verified with primary sources. Topic: ${topic || 'Latest technology and Indian financial-market developments'}. Category: ${category}. Return JSON: {"title":"","slug":"","summary":"","paragraphs":[""],"sourceName":"","sourceUrl":"","keyTakeaways":[""],"keywords":[""]}. If no source URL is supplied, leave sourceUrl empty and do not invent one.`;
  const parsed = await callGemini(env, prompt);
  const now = Date.now();
  const title = parsed.title || topic || 'Technology News Analysis';
  const summary = parsed.summary || 'AI-assisted analysis. Verify current facts with original sources before relying on this report.';
  const paragraphs = Array.isArray(parsed.paragraphs) && parsed.paragraphs.length
    ? parsed.paragraphs
    : [summary, 'This is AI-assisted analysis, not independently verified breaking news.'];

  const article = {
    id: `ai-${crypto.randomUUID()}`,
    slug: parsed.slug || `ai-analysis-${now}`,
    title, summary, fullContent: paragraphs, category,
    publishedAt: dateLabel(now), publishedTimestamp: now, readTime: '3 min read',
    source: {
      name: parsed.sourceName || 'AI-assisted analysis',
      domain: (() => { try { return new URL(parsed.sourceUrl).hostname; } catch { return 'akshayblog.sapiexa.com'; } })(),
      url: parsed.sourceUrl || '', isVerified: false
    },
    marketImpact: {
      sentiment: 'NEUTRAL',
      reason: 'AI-assisted analysis; independently verify facts before relying on it.'
    },
    aiSeo: {
      keyTakeaways: Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways : [],
      geoSummary: summary,
      targetKeywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      readabilityScore: 85, factChecked: false, confidenceScore: 50,
      jsonLdSchema: { '@context': 'https://schema.org', '@type': 'NewsArticle', headline: title }
    },
    isBreaking: false,
    author: { name: 'Sapiexa Newsroom', role: 'AI-assisted analysis' }
  };

  await env.DB.prepare('INSERT INTO news_articles (id, published_timestamp, payload) VALUES (?, ?, ?)')
    .bind(article.id, article.publishedTimestamp, JSON.stringify(article)).run();
  return article;
}
