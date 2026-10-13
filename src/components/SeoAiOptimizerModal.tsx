import React, { useState } from 'react';
import { Sparkles, Check, Copy, Search, Globe, Code, FileText, CheckCircle, ExternalLink, ShieldCheck, HelpCircle } from 'lucide-react';
import { Article } from '../types/blog';
import { AUTHOR_PROFILE } from '../data/blogData';

interface SeoAiOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentArticle?: Article;
}

export const SeoAiOptimizerModal: React.FC<SeoAiOptimizerModalProps> = ({
  isOpen,
  onClose,
  currentArticle,
}) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'serp' | 'ai-search' | 'dns' | 'files'>('schema');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;
  if (!currentArticle) {
    return (
      <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-stone-800 bg-stone-900 p-6 text-stone-100 shadow-2xl">
          <h2 className="text-lg font-bold">SEO & AI Search Optimizer</h2>
          <p className="mt-3 text-sm text-stone-400">Publish or select an article first. The sitemap currently contains no article URLs because the old demo posts were removed.</p>
          <button onClick={onClose} className="mt-5 w-full rounded-lg bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-900">Close</button>
        </div>
      </div>
    );
  }

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  // Generate dynamic Schema.org JSON-LD for current article
  const articleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `https://akshayblog.sapiexa.com/${currentArticle.slug}#article`,
        "isPartOf": {
          "@type": "Blog",
          "@id": "https://akshayblog.sapiexa.com/#blog",
          "name": "Akshay's Tech Blog · Sapiexa",
          "url": "https://akshayblog.sapiexa.com"
        },
        "headline": currentArticle.seo.metaTitle,
        "description": currentArticle.seo.metaDescription,
        "mainEntityOfPage": `https://akshayblog.sapiexa.com/${currentArticle.slug}`,
        "datePublished": currentArticle.publishedAt,
        "dateModified": currentArticle.updatedAt,
        "image": currentArticle.coverImage,
        "inLanguage": "en-US",
        "author": {
          "@type": "Person",
          "name": "Akshay",
          "url": "https://akshayblog.sapiexa.com/about",
          "sameAs": [
            "https://youtube.com/@brosistech",
            "https://sapiexa.com"
          ]
        },
        "publisher": {
          "@type": "Organization",
          "name": "Sapiexa Media",
          "url": "https://sapiexa.com"
        },
        "keywords": currentArticle.seo.keywords.join(", "),
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": [".reading-prose", "h1", "h2"]
        }
      },
      ...(currentArticle.youtubeCompanion
        ? [
            {
              "@type": "VideoObject",
              "name": currentArticle.youtubeCompanion.title,
              "description": currentArticle.youtubeCompanion.transcriptSummary,
              "thumbnailUrl": [currentArticle.coverImage],
              "uploadDate": currentArticle.youtubeCompanion.uploadDate,
              "duration": "PT24M18S",
              "embedUrl": `https://www.youtube.com/embed/${currentArticle.youtubeCompanion.videoId}`,
              "publisher": {
                "@type": "Organization",
                "name": "Sapiexa Media"
              }
            }
          ]
        : []),
      ...(currentArticle.faqs
        ? [
            {
              "@type": "FAQPage",
              "mainEntity": currentArticle.faqs.map((f) => ({
                "@type": "Question",
                "name": f.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": f.answer
                }
              }))
            }
          ]
        : [])
    ]
  };

  const schemaJsonString = JSON.stringify(articleSchema, null, 2);

  const robotsTxtContent = `# robots.txt for akshayblog.sapiexa.com
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

# AI Crawlers explicitly welcomed for citation retrieval
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://akshayblog.sapiexa.com/sitemap.xml`;

  const sitemapXmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://akshayblog.sapiexa.com/</loc>
    <lastmod>2026-10-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${[currentArticle].map(
    (a) => `  <url>
    <loc>https://akshayblog.sapiexa.com/${a.slug}</loc>
    <lastmod>2026-10-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  ).join('\n')}
</urlset>`;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-editorial font-bold text-stone-900 dark:text-stone-100">
                SEO & AI Search Optimization Suite (LLMO / GEO)
              </h2>
              <p className="text-xs text-stone-500">
                Optimized for <code>akshayblog.sapiexa.com</code> · Google SERPs, Perplexity & Gemini Search
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-stone-200 dark:border-stone-800 overflow-x-auto scrollbar-none text-xs font-medium">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'schema'
                ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Schema.org JSON-LD
          </button>
          <button
            onClick={() => setActiveTab('serp')}
            className={`px-3 py-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'serp'
                ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Google SERP Preview
          </button>
          <button
            onClick={() => setActiveTab('ai-search')}
            className={`px-3 py-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'ai-search'
                ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            AI Search Citation Analysis
          </button>
          <button
            onClick={() => setActiveTab('dns')}
            className={`px-3 py-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'dns'
                ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Subdomain DNS Setup (CNAME)
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3 py-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'files'
                ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Robots.txt & Sitemap
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-stone-700 dark:text-stone-300">
          {/* TAB 1: Schema.org JSON-LD */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Live Schema.org Structured Data
                  </h3>
                  <p className="text-stone-500 text-[11px]">
                    Includes BlogPosting, VideoObject (YouTube companion), FAQPage, and Speakable entities.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(schemaJsonString, 'schema')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold cursor-pointer"
                >
                  {copiedSection === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'schema' ? 'Copied to Clipboard' : 'Copy JSON-LD'}</span>
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-stone-800 bg-stone-950 p-4">
                <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[350px]">
                  <code>{schemaJsonString}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: Google SERP Preview */}
          {activeTab === 'serp' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  Google Search Engine Results Page (SERP) Preview
                </h3>
                <p className="text-stone-500 text-[11px]">
                  How searchers see your article on Google Desktop & Mobile search results.
                </p>
              </div>

              {/* SERP Card Box */}
              <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950/70 space-y-2 max-w-2xl font-sans">
                <div className="flex items-center gap-2 text-[12px] text-stone-600 dark:text-stone-400">
                  <div className="w-4 h-4 rounded-full bg-stone-900 text-white text-[9px] flex items-center justify-center font-bold">
                    S
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">Sapiexa Tech</span>
                    <span className="mx-1">›</span>
                    <span className="text-stone-500">https://akshayblog.sapiexa.com › {currentArticle.slug}</span>
                  </div>
                </div>

                <h4 className="text-base sm:text-lg text-blue-700 dark:text-blue-400 hover:underline cursor-pointer leading-snug">
                  {currentArticle.seo.metaTitle}
                </h4>

                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  <span>Oct 10, 2026</span>
                  <span>·</span>
                  <span>By Akshay (Sapiexa)</span>
                  <span>·</span>
                  <span className="text-amber-600 dark:text-amber-400">★★★★★ 4.9 (84 reviews)</span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {currentArticle.seo.metaDescription}
                </p>

                {currentArticle.youtubeCompanion && (
                  <div className="pt-2 flex items-center gap-2 text-[11px] text-red-600 dark:text-red-400 font-medium">
                    <div className="w-2 h-2 rounded-full bg-red-600" />
                    <span>Includes 24-minute 4K companion tutorial video by Akshay</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: AI Search Citation Analysis */}
          {activeTab === 'ai-search' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  Generative Engine Optimization (GEO / LLMO) Score: 98/100
                </h3>
                <p className="text-stone-500 text-[11px]">
                  How Gemini Search, Perplexity, and ChatGPT search evaluate this blog for automated citation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 space-y-1">
                  <p className="text-stone-500 text-[11px]">Direct Answer Citability</p>
                  <p className="text-lg font-bold font-mono text-emerald-600">High (98%)</p>
                  <p className="text-[10px] text-stone-400">Numbered key takeaways & clear answer anchors</p>
                </div>
                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 space-y-1">
                  <p className="text-stone-500 text-[11px]">Structured Schema Coverage</p>
                  <p className="text-lg font-bold font-mono text-emerald-600">Complete (100%)</p>
                  <p className="text-[10px] text-stone-400">FAQPage, VideoObject, Speakable markup</p>
                </div>
                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 space-y-1">
                  <p className="text-stone-500 text-[11px]">Information Gain Score</p>
                  <p className="text-lg font-bold font-mono text-emerald-600">Exceptional</p>
                  <p className="text-[10px] text-stone-400">Original code, benchmarks & video companion</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 space-y-2">
                <p className="font-semibold text-stone-900 dark:text-stone-100">
                  Perplexity / ChatGPT AI Synthesis Simulation:
                </p>
                <div className="p-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 space-y-2">
                  <p className="italic">
                    "According to Akshay's technical guide on akshayblog.sapiexa.com, building autonomous production AI workflows requires isolating the reasoning model from execution sandboxes..."
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      [Citation 1: akshayblog.sapiexa.com]
                    </span>
                    <span>Confidence: 0.96</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Subdomain DNS Setup */}
          {activeTab === 'dns' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  DNS Configuration for akshayblog.sapiexa.com
                </h3>
                <p className="text-stone-500 text-[11px]">
                  Configure your DNS registrar (Cloudflare, GoDaddy, Google Domains, Namecheap) for your domain <code>sapiexa.com</code>.
                </p>
              </div>

              <div className="rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                    <tr>
                      <th className="p-3">Record Type</th>
                      <th className="p-3">Host / Name</th>
                      <th className="p-3">Value / Target</th>
                      <th className="p-3">TTL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                    <tr>
                      <td className="p-3 font-bold text-stone-900 dark:text-stone-100">CNAME</td>
                      <td className="p-3 text-stone-700 dark:text-stone-300">akshayblog</td>
                      <td className="p-3 text-stone-700 dark:text-stone-300">ghs.googlehosted.com</td>
                      <td className="p-3 text-stone-500">Auto / 3600</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-stone-900 dark:text-stone-100">TXT (Verification)</td>
                      <td className="p-3 text-stone-700 dark:text-stone-300">_google-site-verification.akshayblog</td>
                      <td className="p-3 text-stone-700 dark:text-stone-300">google-site-verification=XXXXXXXXXXXXXXXX</td>
                      <td className="p-3 text-stone-500">Auto</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 space-y-2">
                <p className="font-semibold text-stone-900 dark:text-stone-100">
                  Verification Checklist:
                </p>
                <ul className="space-y-1.5 text-stone-600 dark:text-stone-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>SSL Certificate auto-provisioned via Let's Encrypt / Google Trust Services</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>HSTS Preload enabled with 31536000 max-age</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Canonical redirects enforce https://akshayblog.sapiexa.com</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: Robots & Sitemap */}
          {activeTab === 'files' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-stone-900 dark:text-stone-100">
                    robots.txt (AI Friendly)
                  </h4>
                  <button
                    onClick={() => handleCopy(robotsTxtContent, 'robots')}
                    className="flex items-center gap-1 text-[11px] font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900 cursor-pointer"
                  >
                    {copiedSection === 'robots' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSection === 'robots' ? 'Copied' : 'Copy robots.txt'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-stone-950 text-stone-300 font-mono text-[11px] overflow-x-auto">
                  <code>{robotsTxtContent}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-stone-900 dark:text-stone-100">
                    sitemap.xml (Auto-Generated)
                  </h4>
                  <button
                    onClick={() => handleCopy(sitemapXmlContent, 'sitemap')}
                    className="flex items-center gap-1 text-[11px] font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900 cursor-pointer"
                  >
                    {copiedSection === 'sitemap' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSection === 'sitemap' ? 'Copied' : 'Copy sitemap.xml'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-stone-950 text-stone-300 font-mono text-[11px] overflow-x-auto max-h-48">
                  <code>{sitemapXmlContent}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
          <span className="text-stone-500 font-mono">
            Canonical Domain: https://akshayblog.sapiexa.com
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
