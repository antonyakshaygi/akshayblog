import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Clock, Eye, Heart, Share2, Bookmark, Check, 
  Youtube, ExternalLink, Play, Pause, Volume2, Sparkles, 
  Copy, HelpCircle, ChevronDown, ChevronUp, ShieldCheck, Tag
} from 'lucide-react';
import { Article, AffiliateItem } from '../types/blog';
import { INITIAL_AFFILIATE_ITEMS, INITIAL_AD_UNITS } from '../data/blogData';

interface ArticleReaderProps {
  article: Article;
  onBack: () => void;
  onOpenYouTubeHub: () => void;
  onOpenConsultationModal: () => void;
  onOpenSeoOptimizer: () => void;
  affiliateItems?: AffiliateItem[];
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({
  article,
  onBack,
  onOpenYouTubeHub,
  onOpenConsultationModal,
  onOpenSeoOptimizer,
  affiliateItems = INITIAL_AFFILIATE_ITEMS,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontSizeScale, setFontSizeScale] = useState<'normal' | 'large' | 'larger'>('normal');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(article.likes);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState(false);
  
  // Audio playback simulator
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // FAQ accordion state
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // Active YouTube timestamp
  const [activeTimestamp, setActiveTimestamp] = useState<string | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [article.id]);

  // Subtle color-changing reading progress calculation
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic color shift based on scroll percentage:
  // Starts at warm amber/terracotta (#f59e0b / 38°), glides through indigo (#6366f1 / 243°), finishes at vibrant emerald (#10b981 / 160°)
  const getProgressColor = (progress: number) => {
    if (progress < 40) {
      // Warm terracotta to amber
      return 'linear-gradient(90deg, #ea580c 0%, #f59e0b 100%)';
    } else if (progress < 80) {
      // Amber to indigo
      return 'linear-gradient(90deg, #f59e0b 0%, #6366f1 100%)';
    } else {
      // Indigo to emerald
      return 'linear-gradient(90deg, #6366f1 0%, #10b981 100%)';
    }
  };

  // Audio simulator timer
  useEffect(() => {
    let interval: any;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const handleLike = () => {
    if (!isLiked) {
      setLikesCount((prev) => prev + 1);
      setIsLiked(true);
    } else {
      setLikesCount((prev) => prev - 1);
      setIsLiked(false);
    }
  };

  const handleCopyDiscount = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  const handleShare = () => {
    const url = `https://akshayblog.sapiexa.com/${article.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2500);
    }
  };

  const fontClass = {
    normal: 'text-base sm:text-lg leading-relaxed',
    large: 'text-lg sm:text-xl leading-relaxed',
    larger: 'text-xl sm:text-2xl leading-loose',
  }[fontSizeScale];

  // Pick relevant affiliate item
  const relevantAffiliate: AffiliateItem | undefined = affiliateItems[0] || INITIAL_AFFILIATE_ITEMS[0];

  return (
    <div className="min-h-screen pb-20 relative">
      {/* 
        SUBTLE COLOR-CHANGING READING PROGRESS BAR
        Fixed at the very top of the viewport tracking scroll depth with smooth hue transitions
      */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-stone-200/40 dark:bg-stone-800/40 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full transition-all duration-150 ease-out"
          style={{
            width: `${scrollProgress}%`,
            background: getProgressColor(scrollProgress),
            boxShadow: scrollProgress > 5 ? '0 0 8px rgba(99, 102, 241, 0.45)' : 'none',
          }}
        />
      </div>

      {/* Sticky top reading utility rail */}
      <div className="sticky top-14 z-30 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 py-2.5 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </button>

          {/* Reading progress indicator label */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-stone-500">
            <span>Reading:</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200 tabular-nums">
              {Math.round(scrollProgress)}%
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Font size toggle */}
            <div className="flex items-center border border-stone-200 dark:border-stone-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setFontSizeScale('normal')}
                className={`px-2 py-0.5 rounded cursor-pointer ${fontSizeScale === 'normal' ? 'bg-stone-200 dark:bg-stone-800 font-bold' : 'text-stone-500'}`}
                title="Default text size"
              >
                A
              </button>
              <button
                onClick={() => setFontSizeScale('large')}
                className={`px-2 py-0.5 rounded cursor-pointer ${fontSizeScale === 'large' ? 'bg-stone-200 dark:bg-stone-800 font-bold' : 'text-stone-500'}`}
                title="Larger text size"
              >
                A+
              </button>
            </div>

            {/* Like button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isLiked
                  ? 'border-red-200 bg-red-50 text-red-600 dark:bg-red-950/40 dark:border-red-900'
                  : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-mono tabular-nums">{likesCount}</span>
            </button>

            {/* Bookmark button */}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-1.5 rounded-lg text-xs border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'border-amber-200 bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                  : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
              title="Save to Reading List"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Share link button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
            >
              {shareFeedback ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{shareFeedback ? 'Copied' : 'Share'}</span>
            </button>

            {/* AI SEO inspect shortcut */}
            <button
              onClick={onOpenSeoOptimizer}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium cursor-pointer"
              title="Inspect Schema & AI Search Optimization"
            >
              <Sparkles className="w-3 h-3 text-amber-400 dark:text-amber-600" />
              <span>SEO Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Article Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {/* Article Header */}
        <header className="space-y-4 pb-8 border-b border-stone-200 dark:border-stone-800">
          {/* Metadata strictly following zero-pill discipline */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <span className="font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-wider">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
            <span aria-hidden="true">·</span>
            <span>Published {article.publishedAt}</span>
            <span aria-hidden="true">·</span>
            <span>Updated {article.updatedAt}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-[1.18]" style={{ textWrap: 'balance' }}>
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-300 font-sans-clean leading-relaxed">
            {article.subtitle}
          </p>

          {/* Author Byline */}
          <div className="pt-3 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-11 h-11 rounded-full object-cover border border-stone-200 dark:border-stone-700"
              />
              <div>
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{article.author.name}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">{article.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400 font-mono">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {article.views.toLocaleString()} Reads
              </span>
              <span>Canonical: akshayblog.sapiexa.com</span>
            </div>
          </div>
        </header>

        {/* Audio Article Narration Player */}
        <div className="my-6 p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="w-10 h-10 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center shrink-0 cursor-pointer shadow-xs hover:scale-105 transition-transform"
              aria-label={isPlayingAudio ? 'Pause audio narration' : 'Play audio narration'}
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div>
              <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-stone-500" />
                <span>Listen to Article Audio Read-Aloud</span>
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {isPlayingAudio ? 'Synthesized playback active · 8 min summary' : 'Narration powered by Sapiexa Speech Synthesis'}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-48 flex items-center gap-2">
            <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-stone-900 dark:bg-stone-100 transition-all duration-300"
                style={{ width: `${audioProgress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-stone-500 shrink-0">{audioProgress}%</span>
          </div>
        </div>

        {/* Lead Cover Image */}
        <div className="my-8 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 aspect-16/9 bg-stone-100 dark:bg-stone-900">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* AI Search & Generative Engine Optimization (GEO) Box */}
        <section className="my-8 p-6 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Search Executive Summary & Key Takeaways</span>
            </div>
            <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
              Schema: Speakable + Article
            </span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Synthesized for search engines, LLM answer engines (Perplexity, ChatGPT Search, Google AI Overviews), and busy practitioners:
          </p>
          <ul className="space-y-2 pt-1">
            {article.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-800 dark:text-stone-200">
                <span className="font-mono text-xs text-stone-400 shrink-0 mt-0.5">0{idx + 1}.</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* YouTube Video Companion Embed (When available) */}
        {article.youtubeCompanion && (
          <section className="my-10 p-6 rounded-2xl border border-red-200/80 dark:border-red-950/60 bg-red-50/30 dark:bg-red-950/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-600" />
                <h3 className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100">
                  Companion YouTube Video Breakdown
                </h3>
              </div>
              <a
                href="https://youtube.com/@brosistech"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors cursor-pointer w-fit"
              >
                <span>Subscribe on YouTube (@brosistech)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Embedded video player container */}
            <div className="relative rounded-xl overflow-hidden aspect-16/9 bg-stone-900 border border-stone-800 shadow-md">
              <img
                src={article.youtubeCompanion.thumbnailUrl || article.coverImage}
                alt={article.youtubeCompanion.title}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-stone-950/40 flex flex-col items-center justify-center p-6 text-center text-white">
                <button
                  onClick={onOpenYouTubeHub}
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 cursor-pointer mb-3"
                  aria-label="Play YouTube Video"
                >
                  <Play className="w-7 h-7 fill-current ml-1" />
                </button>
                <p className="text-sm sm:text-base font-bold max-w-lg leading-snug">
                  {article.youtubeCompanion.title}
                </p>
                <p className="text-xs text-stone-300 mt-1 font-mono">
                  Duration: {article.youtubeCompanion.duration} · {article.youtubeCompanion.viewCount}
                </p>
              </div>
            </div>

            {/* Video Timestamps with interactive click */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Interactive Timestamps & Key Chapters:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {article.youtubeCompanion.timestamps.map((ts) => (
                  <button
                    key={ts.time}
                    onClick={() => setActiveTimestamp(ts.time)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                      activeTimestamp === ts.time
                        ? 'bg-red-100 dark:bg-red-900/50 text-red-900 dark:text-red-200 font-medium'
                        : 'bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    <span className="font-mono text-red-600 dark:text-red-400 shrink-0">{ts.time}</span>
                    <span className="truncate">{ts.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Article Body Content */}
        <div className={`space-y-6 text-stone-800 dark:text-stone-200 ${fontClass}`}>
          {article.content.map((paragraph, index) => {
            // Check if it's a code block
            if (paragraph.startsWith('```')) {
              const codeLines = paragraph.replace(/```typescript\n?|```\n?/g, '');
              return (
                <div key={index} className="my-6 rounded-xl overflow-hidden border border-stone-800 bg-stone-950 text-stone-200">
                  <div className="px-4 py-2 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400">
                    <span className="font-mono">typescript · production blueprint</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(codeLines)}
                      className="hover:text-white cursor-pointer"
                    >
                      Copy code
                    </button>
                  </div>
                  <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed">
                    <code>{codeLines}</code>
                  </pre>
                </div>
              );
            }

            // Check if it's a heading
            if (paragraph.startsWith('### ')) {
              return (
                <h2
                  key={index}
                  className="pt-6 pb-2 text-2xl sm:text-3xl font-editorial font-bold text-stone-900 dark:text-stone-100 tracking-tight"
                >
                  {paragraph.replace('### ', '')}
                </h2>
              );
            }

            // Regular paragraph with drop cap on the very first paragraph
            if (index === 0) {
              return (
                <p
                  key={index}
                  className="first-letter:text-5xl first-letter:font-editorial first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-stone-900 dark:first-letter:text-stone-100"
                >
                  {paragraph}
                </p>
              );
            }

            return <p key={index}>{paragraph}</p>;
          })}
        </div>

        {/* Embedded In-Article Affiliate Recommendation Box (in INR ₹) */}
        {relevantAffiliate && (
          <section className="my-10 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/40 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-stone-600 dark:text-stone-300" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Recommended Equipment Tested by Akshay
                </h3>
              </div>
              <span className="text-[11px] text-stone-500 font-mono">
                FTC Disclosure: Affiliate Partnership · Indian Rupees (₹)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-center">
              <div className="w-full sm:w-44 h-32 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0">
                <img
                  src={relevantAffiliate.image}
                  alt={relevantAffiliate.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                    {relevantAffiliate.name}
                  </h4>
                  <span className="font-mono text-base font-bold text-stone-900 dark:text-stone-100">
                    {relevantAffiliate.price}
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {relevantAffiliate.summary}
                </p>

                {/* Discount Code Copy Widget */}
                {relevantAffiliate.discountCode && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-stone-500">Discount Code:</span>
                    <button
                      onClick={() => handleCopyDiscount(relevantAffiliate.discountCode!, relevantAffiliate.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-xs font-mono font-semibold text-stone-900 dark:text-stone-100 cursor-pointer transition-colors"
                    >
                      <span>{relevantAffiliate.discountCode}</span>
                      {copiedCodeId === relevantAffiliate.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {copiedCodeId === relevantAffiliate.id && (
                      <span className="text-[11px] text-emerald-600 font-medium">Copied!</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <a
                href={relevantAffiliate.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center gap-1.5"
              >
                <span>Check Official Price in India</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </section>
        )}

        {/* In-Article Sponsor Ad Unit (Personal Ad in INR ₹) */}
        <section className="my-10 p-5 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 bg-stone-100/50 dark:bg-stone-900/30 text-center space-y-2">
          <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
            <span>SPONSORED PLACEMENT</span>
            <span>Ad Unit #in-article-banner (300x250)</span>
          </div>
          <div className="py-3 max-w-md mx-auto space-y-2">
            <h4 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              Need Direct Architectural Guidance or Sponsored Placements?
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Reach 128,000+ engineers, creators, and decision-makers across Sapiexa Media channels. Packages starting at ₹38,000.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenConsultationModal}
                className="px-4 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Inquire About Sponsor Rates (INR)
              </button>
            </div>
          </div>
        </section>

        {/* Structured FAQ Section (Directly mapped to Schema.org FAQPage) */}
        {article.faqs && article.faqs.length > 0 && (
          <section className="my-12 pt-8 border-t border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-stone-700 dark:text-stone-300" />
              <h3 className="text-xl font-editorial font-bold text-stone-900 dark:text-stone-100">
                Frequently Asked Questions
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              These answers are indexed with Schema.org FAQPage for rich search engine carousels and LLM responses.
            </p>

            <div className="space-y-3 pt-2">
              {article.faqs.map((faq, idx) => {
                const isOpen = expandedFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden bg-white dark:bg-stone-900"
                  >
                    <button
                      onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-medium text-sm text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Author Bio Footer Block */}
        <section className="mt-12 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 flex flex-col sm:flex-row items-center gap-5">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-16 h-16 rounded-full object-cover border border-stone-200 dark:border-stone-700 shrink-0"
          />
          <div className="space-y-2 text-center sm:text-left flex-1">
            <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Written by {article.author.name}
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {article.author.bio}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-4 pt-1 text-xs">
              <a
                href="https://youtube.com/@brosistech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:underline flex items-center gap-1"
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>BroSis Tech Tamil (@brosistech)</span>
              </a>
              <a
                href="https://sapiexa.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-600 dark:text-stone-300 hover:underline flex items-center gap-1"
              >
                <span>Sapiexa.com</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
