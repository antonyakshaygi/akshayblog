import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, TrendingDown, Radio, Clock, Sparkles, Printer, RefreshCw, 
  Share2, Check, ArrowRight, ExternalLink, ShieldCheck, Newspaper, 
  BarChart3, ChevronRight, Zap, Search, Bookmark, Volume2, Pause, 
  Play, MessageSquare, AlertCircle, Cpu, DollarSign, Globe, Building2,
  FileText, Copy
} from 'lucide-react';
import { NewsArticleItem, MarketTicker, ENewspaperEdition, NewsCategory } from '../types/news';


interface FinancialTechNewsPageProps {
  onOpenConsultationModal?: () => void;
  isAdminAuthenticated?: boolean;
}

export const FinancialTechNewsPage: React.FC<FinancialTechNewsPageProps> = ({
  onOpenConsultationModal,
  isAdminAuthenticated = false
}) => {
  // Navigation view inside the newsroom
  const [activeView, setActiveView] = useState<'enewspaper' | 'livewire' | 'ai-generator'>('enewspaper');
  
  // News state
  const [marketTickers, setMarketTickers] = useState<MarketTicker[]>([]);
  const [articles, setArticles] = useState<NewsArticleItem[]>([]);
  const [edition7Am, setEdition7Am] = useState<ENewspaperEdition>(() => {
    const emptyArticle: NewsArticleItem = {
      id: 'pending-news', slug: 'pending-news', title: 'Waiting for the latest publisher headlines',
      summary: 'The newsroom is connecting to live news feeds. Refresh shortly to see the latest reports.',
      fullContent: ['Live publisher headlines are being loaded.', 'No market claims are shown until a source is available.', 'Use the original publisher links for complete reports.'],
      category: 'all', publishedAt: 'Waiting for feed', publishedTimestamp: 0, readTime: '1 min read',
      source: { name: 'Sapiexa Newsroom', domain: 'akshayblog.sapiexa.com', isVerified: false },
      marketImpact: { sentiment: 'NEUTRAL', reason: 'No market impact inferred.' },
      aiSeo: { keyTakeaways: ['Waiting for live headlines.'], geoSummary: 'Waiting for live headlines.', targetKeywords: [], readabilityScore: 0, factChecked: false, confidenceScore: 0, jsonLdSchema: {} },
      author: { name: 'Sapiexa Newsroom', role: 'News Desk' }
    };
    return {
      id: 'pending-edition', editionDate: 'Awaiting live edition', volumeIssue: 'LIVE NEWSROOM',
      publishedAt: 'Waiting for scheduled edition', publishedTimestamp: 0,
      leadHeadline: 'THE BEST INDIA: LIVE NEWSROOM', leadSubhead: 'Connecting to current publisher feeds.', leadArticle: emptyArticle,
      marketSnapshot: [], aiAndTechTopStories: [], financialTopStories: [], indianEconomyTopStories: [],
      editorsBriefing: { author: 'Sapiexa Newsroom', role: 'Editorial Desk', title: 'Morning Intelligence Briefing', paragraphs: ['The latest publisher headlines will appear when the feed refresh completes.'], highlightQuote: 'Read the source. Check the facts.' },
      curatedCount: 0, verifiedAt7AM: false
    };
  });
  
  // Real-time polling & sync
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('Just now');
  const [next7AmCountdown, setNext7AmCountdown] = useState<string>('');
  
  // Search and filter
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reader modal
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsArticleItem | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  
  // AI Generator state
  const [aiCustomTopic, setAiCustomTopic] = useState('');
  const [aiTargetCategory, setAiTargetCategory] = useState<NewsCategory>('ai-deep-tech');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiGenSuccessMsg, setAiGenSuccessMsg] = useState('');

  // Audio briefing simulator
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Fetch real-time news from backend API
  const fetchRealtimeNews = async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true);
    try {
      const res = await fetch('/api/news/realtime', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.marketTickers) setMarketTickers(data.marketTickers);
        if (Array.isArray(data.articles)) setArticles(data.articles);
      }
      setLastRefreshedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch {
      // Offline or client fallback - data already initialized safely
      setLastRefreshedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } finally {
      if (showLoading) setIsRefreshing(false);
    }
  };

  // Fetch 7 AM E-Newspaper edition
  const fetch7AmEdition = async () => {
    try {
      const res = await fetch('/api/news/enewspaper', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.edition) setEdition7Am(data.edition);
      }
    } catch {}
  };

  // Initial load
  useEffect(() => {
    fetchRealtimeNews();
    fetch7AmEdition();
  }, []);

  // Real-time polling timer (every 30 seconds if enabled)
  useEffect(() => {
    if (!isAutoSyncEnabled) return;
    const interval = setInterval(() => {
      fetchRealtimeNews(false);
      fetch7AmEdition();
    }, 30000);
    return () => clearInterval(interval);
  }, [isAutoSyncEnabled]);

  // Countdown timer to next morning 7:00 AM IST
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // IST is UTC+5:30
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const istTime = new Date(utcTime + 3600000 * 5.5);
      
      const target7Am = new Date(istTime);
      target7Am.setHours(7, 0, 0, 0);
      if (istTime.getTime() >= target7Am.getTime()) {
        target7Am.setDate(target7Am.getDate() + 1);
      }
      
      const diffMs = target7Am.getTime() - istTime.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      setNext7AmCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Audio player simulation
  useEffect(() => {
    let timer: any;
    if (isPlayingAudio) {
      timer = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1;
        });
      }, 300);
    }
    return () => clearInterval(timer);
  }, [isPlayingAudio]);

  // Trigger Gemini AI generation
  const handleGenerateAiNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingAi(true);
    setAiGenSuccessMsg('');
    try {
      const res = await fetch('/api/news/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiCustomTopic.trim(),
          category: aiTargetCategory
        })
      });
      const data = await res.json();
      if (data.success && data.article) {
        setArticles(prev => [data.article, ...prev]);
        setAiGenSuccessMsg(`Published in real time: "${data.article.title}"`);
        setAiCustomTopic('');
        setActiveView('livewire');
        setSelectedNewsArticle(data.article);
      } else {
        setAiGenSuccessMsg(data.error || 'The server could not generate the analysis.');
      }
    } catch {
      setAiGenSuccessMsg('Could not generate the analysis. Check the Cloudflare Gemini secret and try again.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Re-compile 7 AM edition
  const handleRegenerate7AmEdition = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/news/regenerate-7am', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success && data.edition) {
        setEdition7Am(data.edition);
      }
    } catch {} finally {
      setIsRefreshing(false);
    }
  };

  // Copy share link
  const handleCopyLink = (slug: string) => {
    const url = `https://akshayblog.sapiexa.com/news/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  // Print broadsheet
  const handlePrintBroadsheet = () => {
    window.print();
  };

  // Filtered live wire articles
  const filteredArticles = articles.filter(art => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesQuery = searchQuery === '' || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.source.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 
        ========================================================================
        1. REAL-TIME FINANCIAL TICKER TAPE (Sticky Marquee)
        ========================================================================
      */}
      <div className="border-y border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-900/80 py-2.5 px-4 backdrop-blur-sm overflow-hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-stone-300 dark:border-stone-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              NEWS FEED LIVE
            </span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5 text-xs font-mono">
            {marketTickers.length === 0 && (
              <span className="shrink-0 text-stone-500 dark:text-stone-400">Verified live market quotes are not configured. Headlines link to their original publishers.</span>
            )}
            {marketTickers.map((ticker) => (
              <div key={ticker.symbol} className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-stone-900 dark:text-stone-100">{ticker.symbol}</span>
                <span className="text-stone-600 dark:text-stone-400">{ticker.price}</span>
                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  ticker.isPositive 
                    ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-950/60' 
                    : 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-950/60'
                }`}>
                  {ticker.isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {ticker.change}
                </span>
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0 pl-3 border-l border-stone-300 dark:border-stone-700 text-[11px] font-mono text-stone-500">
            <span>Sync: {lastRefreshedTime}</span>
            <button 
              onClick={async () => { await fetchRealtimeNews(true); await fetch7AmEdition(); }}
              className="hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
              title="Manual refresh"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        2. BROADSHEET MASTHEAD (Editorial BroSis Tech & Sapiexa Chronicle)
        ========================================================================
      */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <header className="border-b-2 border-stone-900 dark:border-stone-100 pb-5 pt-2 text-center space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-stone-500 border-b border-stone-200 dark:border-stone-800 pb-2">
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-stone-800 dark:text-stone-200">BROAD SHEET EDITION</span>
              <span>· {edition7Am.volumeIssue}</span>
            </span>
            <span className="font-semibold text-stone-900 dark:text-stone-100">{edition7Am.editionDate}</span>
            <span className="hidden sm:inline">IST TIME ZONE · CHENNAI & BENGALURU</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-amber-600 dark:text-amber-400 font-bold">
              ★ INDIA'S PREMIER FINANCIAL & TECH DAILY E-PAPER ★
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-stone-950 dark:text-stone-50 uppercase">
              The Best India
            </h1>
          </div>

          <p className="max-w-3xl mx-auto text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-serif italic">
            Daily Morning 7:00 AM E-Newspaper & Automated Real-Time Financial, AI & Tech Intelligence by BroSis Tech Tamil (@brosistech) & Sapiexa Media
          </p>

          {/* Sub-masthead action bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200 dark:border-stone-800 text-xs">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-mono text-[11px]">
              <button
                onClick={() => setActiveView('enewspaper')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeView === 'enewspaper'
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-semibold shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>The Best India (7 AM E-Paper)</span>
              </button>

              <button
                onClick={() => setActiveView('livewire')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeView === 'livewire'
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-semibold shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span>Real-Time Live Wire</span>
                <span className="px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
                  LIVE
                </span>
              </button>

              <button
                onClick={() => setActiveView('ai-generator')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeView === 'ai-generator'
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-semibold shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Newsroom & SEO</span>
              </button>
            </div>

            {/* Utility controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-500 bg-stone-50 dark:bg-stone-900/50 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>Next 7 AM Print in: <strong className="text-stone-800 dark:text-stone-200">{next7AmCountdown || '14h 12m'}</strong></span>
              </div>

              <button
                onClick={handlePrintBroadsheet}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 font-mono text-[11px] text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                title="Print or Save PDF Broadsheet"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>
            </div>
          </div>
        </header>

        {/* 
          ========================================================================
          VIEW 1: DAILY 7 AM MORNING E-NEWSPAPER (Broadsheet Print Layout)
          ========================================================================
        */}
        {activeView === 'enewspaper' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 7 AM Verification Banner with Audio Brief */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-200/70 dark:bg-amber-900/70 text-amber-900 dark:text-amber-200 font-mono text-[10px] font-bold uppercase tracking-wider">
                    THE BEST INDIA · VERIFIED 7:00 AM IST PRINT
                  </span>
                  <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                    Curated with zero fluff · Exclusively important market & tech moves
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Published daily at 07:00 AM IST. Next edition compiles overnight global closes and Indian market opening cues.
                </p>
              </div>

              {/* Audio briefing player */}
              <div className="flex items-center gap-3 bg-white dark:bg-stone-900 p-2 rounded-xl border border-stone-200 dark:border-stone-800 shrink-0">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="p-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 cursor-pointer hover:opacity-90 transition-opacity"
                  title={isPlayingAudio ? "Pause 7 AM Audio Brief" : "Listen to 7 AM Audio Brief"}
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <div className="text-xs space-y-1">
                  <div className="flex items-center justify-between gap-4 font-mono text-[10px]">
                    <span className="font-semibold text-stone-800 dark:text-stone-200">7 AM Audio Brief</span>
                    <span className="text-stone-500">{isPlayingAudio ? `${audioProgress}%` : '3:15 min'}</span>
                  </div>
                  <div className="w-28 sm:w-36 h-1 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 transition-all duration-300"
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* FRONT PAGE LEAD STORY (Massive Broadsheet Focus) */}
            <article className="border-b border-stone-300 dark:border-stone-800 pb-8 space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-stone-500">
                <span className="font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">★ FRONT PAGE LEAD</span>
                <span>·</span>
                <span>{edition7Am.leadArticle.publishedAt}</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <TrendingUp className="w-3 h-3" />
                  {edition7Am.leadArticle.marketImpact.ticker}: {edition7Am.leadArticle.marketImpact.sentiment}
                </span>
              </div>

              <h2 
                onClick={() => setSelectedNewsArticle(edition7Am.leadArticle)}
                className="font-editorial text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-tight hover:text-stone-700 dark:hover:text-stone-300 cursor-pointer transition-colors"
              >
                {edition7Am.leadArticle.title}
              </h2>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed font-serif">
                {edition7Am.leadArticle.summary}
              </p>

              {/* Broadsheet 3-column text preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
                <div className="space-y-3">
                  <p className="first-letter:text-4xl first-letter:font-editorial first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-stone-950 dark:first-letter:text-stone-50">
                    {edition7Am.leadArticle.fullContent[0]}
                  </p>
                  <p>{edition7Am.leadArticle.fullContent[1]}</p>
                </div>

                <div className="space-y-3">
                  <p>{edition7Am.leadArticle.fullContent[2]}</p>
                  {edition7Am.leadArticle.fullContent[3] && (
                    <p>{edition7Am.leadArticle.fullContent[3]}</p>
                  )}
                </div>

                {/* Lead Story Sidebar Box */}
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3 font-sans">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-900 dark:text-stone-100">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>AI SEO & GEO SUMMARY</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                    "{edition7Am.leadArticle.aiSeo.geoSummary}"
                  </p>
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-stone-500 font-semibold">Key Takeaways:</span>
                    <ul className="space-y-1 text-xs text-stone-800 dark:text-stone-200">
                      {edition7Am.leadArticle.aiSeo.keyTakeaways.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => setSelectedNewsArticle(edition7Am.leadArticle)}
                    className="w-full pt-2 flex items-center justify-between text-xs font-mono font-bold text-stone-900 dark:text-stone-100 hover:underline cursor-pointer"
                  >
                    <span>Read Complete Dispatch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>

            {/* 3-COLUMN EDITORIAL SECTION: AI/Deep Tech | Indian Economy | Global Finance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Column 1: AI & Frontier Technology */}
              <div className="space-y-4">
                <div className="border-b-2 border-stone-900 dark:border-stone-100 pb-1 flex items-center justify-between">
                  <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 uppercase tracking-tight flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>AI & Deep Tech</span>
                  </h3>
                  <span className="text-[10px] font-mono text-stone-500">PAGE 2</span>
                </div>

                <div className="space-y-5">
                  {edition7Am.aiAndTechTopStories.map((story) => (
                    <div 
                      key={story.id} 
                      onClick={() => setSelectedNewsArticle(story)}
                      className="group cursor-pointer space-y-2 border-b border-stone-100 dark:border-stone-900 pb-4 last:border-0"
                    >
                      <div className="flex items-center gap-2 text-[10px] font-mono text-stone-500">
                        <span>{story.source.name}</span>
                        <span>·</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{story.marketImpact.ticker || 'TECH'}</span>
                      </div>
                      <h4 className="font-editorial text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                        {story.title}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 font-serif">
                        {story.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Financial Markets & Dalal Street */}
              <div className="space-y-4">
                <div className="border-b-2 border-stone-900 dark:border-stone-100 pb-1 flex items-center justify-between">
                  <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 uppercase tracking-tight flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Financial Markets</span>
                  </h3>
                  <span className="text-[10px] font-mono text-stone-500">PAGE 3</span>
                </div>

                <div className="space-y-5">
                  {edition7Am.financialTopStories.map((story) => (
                    <div 
                      key={story.id}
                      onClick={() => setSelectedNewsArticle(story)}
                      className="group cursor-pointer space-y-2 border-b border-stone-100 dark:border-stone-900 pb-4 last:border-0"
                    >
                      <div className="flex items-center gap-2 text-[10px] font-mono text-stone-500">
                        <span>{story.source.name}</span>
                        <span>·</span>
                        <span className={`font-semibold ${
                          story.marketImpact.sentiment === 'BULLISH' ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-500'
                        }`}>
                          {story.marketImpact.sentiment}
                        </span>
                      </div>
                      <h4 className="font-editorial text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                        {story.title}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 font-serif">
                        {story.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Indian Startups & Consumer Tech */}
              <div className="space-y-4">
                <div className="border-b-2 border-stone-900 dark:border-stone-100 pb-1 flex items-center justify-between">
                  <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 uppercase tracking-tight flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Indian Tech & Startups</span>
                  </h3>
                  <span className="text-[10px] font-mono text-stone-500">PAGE 4</span>
                </div>

                <div className="space-y-5">
                  {edition7Am.indianEconomyTopStories.map((story) => (
                    <div 
                      key={story.id}
                      onClick={() => setSelectedNewsArticle(story)}
                      className="group cursor-pointer space-y-2 border-b border-stone-100 dark:border-stone-900 pb-4 last:border-0"
                    >
                      <div className="flex items-center gap-2 text-[10px] font-mono text-stone-500">
                        <span>{story.source.name}</span>
                        <span>·</span>
                        <span className="text-amber-600 font-semibold">{story.readTime}</span>
                      </div>
                      <h4 className="font-editorial text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                        {story.title}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 font-serif">
                        {story.summary}
                      </p>
                    </div>
                  ))}

                  {/* Quick Commerce & Retail Stat Box */}
                  <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-stone-500">7 AM Market Pulse</span>
                    <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                      Bengaluru & Chennai semiconductor corridor attracts $3.4B in private investments.
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Domestic electronics manufacturing output expanded by 28% this quarter.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* EDITOR'S NOTE / MORNING 7 AM BRIEFING BY ANTONY AKSHAY */}
            <div className="my-8 p-6 sm:p-8 rounded-2xl bg-stone-900 text-stone-100 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-stone-950 font-bold font-editorial text-lg">
                    A
                  </div>
                  <div>
                    <h4 className="font-editorial font-bold text-base text-white">
                      {edition7Am.editorsBriefing.title}
                    </h4>
                    <p className="text-[11px] font-mono text-stone-400">
                      {edition7Am.editorsBriefing.author} · {edition7Am.editorsBriefing.role}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-lg w-fit">
                  Verified 7:00 AM IST
                </span>
              </div>

              {/* Highlight Quote */}
              <blockquote className="text-sm sm:text-base font-serif italic text-amber-200/90 border-l-2 border-amber-500 pl-4 py-1">
                "{edition7Am.editorsBriefing.highlightQuote}"
              </blockquote>

              {/* Editorial Paragraphs */}
              <div className="space-y-3 text-xs sm:text-sm text-stone-300 leading-relaxed font-serif">
                {edition7Am.editorsBriefing.paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-stone-400 font-mono">
                <span>BroSis Tech Tamil (@brosistech) Intelligence Unit</span>
                <a 
                  href="https://youtube.com/@brosistech" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Watch Video Breakdown</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 
          ========================================================================
          VIEW 2: REAL-TIME LIVE WIRE FEED (Minute-by-minute News & Filter)
          ========================================================================
        */}
        {activeView === 'livewire' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Live Wire Header & Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {(['all', 'ai-deep-tech', 'financial-markets', 'indian-tech', 'big-tech'] as NewsCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs cursor-pointer transition-colors ${
                      selectedCategory === cat
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold shadow-xs'
                        : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {cat === 'all' && 'All Stories'}
                    {cat === 'ai-deep-tech' && 'AI & Silicon'}
                    {cat === 'financial-markets' && 'Markets & Macro'}
                    {cat === 'indian-tech' && 'Indian Tech'}
                    {cat === 'big-tech' && 'Big Tech'}
                  </button>
                ))}
              </div>

              {/* Search input & auto-sync toggle */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search news or tickers..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 font-mono"
                  />
                </div>

                <button
                  onClick={() => setIsAutoSyncEnabled(!isAutoSyncEnabled)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 cursor-pointer ${
                    isAutoSyncEnabled
                      ? 'border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      : 'border-stone-300 dark:border-stone-700 text-stone-500'
                  }`}
                  title="Toggle real-time auto-sync"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isAutoSyncEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                  <span className="hidden sm:inline">Auto 30s</span>
                </button>
              </div>
            </div>

            {/* Live Wire Feed List */}
            <div className="space-y-4">
              {filteredArticles.length === 0 ? (
                <div className="p-12 text-center text-stone-500 font-mono text-xs">
                  No dispatches matched your search criteria.
                </div>
              ) : (
                filteredArticles.map((article) => (
                  <article
                    key={article.id}
                    onClick={() => setSelectedNewsArticle(article)}
                    className="group p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-all cursor-pointer space-y-3 shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-stone-500">
                      <div className="flex items-center gap-2">
                        {article.isBreaking && (
                          <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 font-bold text-[10px] uppercase animate-pulse">
                            BREAKING
                          </span>
                        )}
                        <span className="font-semibold text-stone-800 dark:text-stone-200">{article.source.name}</span>
                        <span>·</span>
                        <span>{article.publishedAt}</span>
                      </div>

                      {/* Market Impact Badge */}
                      {article.marketImpact && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-stone-400">Impact:</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            article.marketImpact.sentiment === 'BULLISH'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : article.marketImpact.sentiment === 'BEARISH'
                              ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                          }`}>
                            {article.marketImpact.ticker || 'MARKET'}: {article.marketImpact.sentiment}
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-editorial text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>

                    {/* SEO Key Takeaways Pills */}
                    {article.aiSeo?.keyTakeaways && (
                      <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                        {article.aiSeo.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400">
                            • {takeaway}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between text-xs border-t border-stone-100 dark:border-stone-800 text-stone-500 font-mono">
                      <span>{article.readTime}</span>
                      <span className="flex items-center gap-1 text-stone-900 dark:text-stone-100 font-semibold group-hover:translate-x-1 transition-transform">
                        <span>Read Analysis</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        )}

        {/* 
          ========================================================================
          VIEW 3: AI NEWSROOM & SEO OPTIMIZER (Autonomous Gemini 3.8 Engine)
          ========================================================================
        */}
        {activeView === 'ai-generator' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header intro */}
            <div className="p-6 rounded-2xl bg-stone-900 text-stone-100 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Autonomous Newsroom & SEO Pipeline</span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                Gemini 3.8 Flash Real-Time News Synthesis
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                Automatically synthesize verified breaking tech, semiconductor, and Dalal Street financial developments into the live feed with Schema.org NewsArticle structured data and Generative Engine Optimization (GEO) for AI search engines.
              </p>
            </div>

            {/* Generator Form */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-6">
              <form onSubmit={handleGenerateAiNews} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-semibold text-stone-900 dark:text-stone-100">
                    Topic or Breaking Event (Leave blank for automatic real-time curation):
                  </label>
                  <input
                    type="text"
                    value={aiCustomTopic}
                    onChange={(e) => setAiCustomTopic(e.target.value)}
                    placeholder="e.g. Nvidia Blackwell volume shipments in India, Sensex hits 83,000, OpenAI multimodal agent APIs..."
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-stone-600 dark:text-stone-400">
                      Target Intelligence Category:
                    </label>
                    <select
                      value={aiTargetCategory}
                      onChange={(e) => setAiTargetCategory(e.target.value as NewsCategory)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-xs text-stone-900 dark:text-white focus:outline-none font-mono"
                    >
                      <option value="ai-deep-tech">AI & Silicon Chips</option>
                      <option value="financial-markets">Financial Markets & Macro</option>
                      <option value="indian-tech">Indian Tech & Startups</option>
                      <option value="big-tech">Big Tech (Apple, Google, MSFT)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-stone-600 dark:text-stone-400">
                      SEO & Schema Standard:
                    </label>
                    <div className="px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50 text-xs font-mono text-stone-700 dark:text-stone-300">
                      Schema.org/NewsArticle + Speakable + GEO AI Overview
                    </div>
                  </div>
                </div>

                {aiGenSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{aiGenSuccessMsg}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleRegenerate7AmEdition}
                    disabled={isRefreshing}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-mono font-medium text-stone-700 dark:text-stone-300 cursor-pointer disabled:opacity-50"
                  >
                    <span>Re-compile 7 AM Edition</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isGeneratingAi}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGeneratingAi ? 'Synthesizing with Gemini 3.8...' : 'Publish to Live Wire Now'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* SEO & Structured Data Inspector */}
            <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Real-Time SEO & Generative Engine Optimization (GEO) Audit</span>
                </h4>
                <span className="text-[11px] text-emerald-600 font-bold">Audit Score: 98/100</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-stone-600 dark:text-stone-400">
                <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Structured Schema</span>
                  <p className="font-bold text-stone-800 dark:text-stone-200">Schema.org/NewsArticle</p>
                  <p className="text-[10px]">Speakable & FinancialProduct enriched</p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">GEO Readiness</span>
                  <p className="font-bold text-stone-800 dark:text-stone-200">Perplexity & Gemini Ready</p>
                  <p className="text-[10px]">Direct answer extraction anchors</p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Fact Verification</span>
                  <p className="font-bold text-stone-800 dark:text-stone-200">Cross-Referenced</p>
                  <p className="text-[10px]">RBI, Bloomberg, and SEC disclosures</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 
        ========================================================================
        ARTICLE READER MODAL (Detailed Dispatch Reader)
        ========================================================================
      */}
      {selectedNewsArticle && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 border border-stone-200 dark:border-stone-800 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                <span className="font-bold text-stone-900 dark:text-stone-100">{selectedNewsArticle.source.name}</span>
                <span>·</span>
                <span>{selectedNewsArticle.publishedAt}</span>
              </div>
              <button
                onClick={() => setSelectedNewsArticle(null)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-lg cursor-pointer p-1"
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
                {selectedNewsArticle.title}
              </h2>

              {/* Market Impact & Sentiment Ribbon */}
              {selectedNewsArticle.marketImpact && (
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-500">Market Sentiment:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      {selectedNewsArticle.marketImpact.ticker}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedNewsArticle.marketImpact.sentiment === 'BULLISH'
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}>
                      {selectedNewsArticle.marketImpact.sentiment}
                    </span>
                  </div>
                </div>
              )}

              {/* Body paragraphs */}
              <div className="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-serif leading-relaxed pt-2">
                {selectedNewsArticle.fullContent.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {/* SEO Key Takeaways */}
              {selectedNewsArticle.aiSeo?.keyTakeaways && (
                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-2 text-xs">
                  <span className="font-mono font-bold uppercase text-amber-900 dark:text-amber-200 text-[10px]">
                    Verified Key Takeaways:
                  </span>
                  <ul className="space-y-1.5 text-stone-700 dark:text-stone-300">
                    {selectedNewsArticle.aiSeo.keyTakeaways.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <button
                onClick={() => handleCopyLink(selectedNewsArticle.slug)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-xs font-mono text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                {copiedSlug === selectedNewsArticle.slug ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Dispatch</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedNewsArticle(null)}
                className="px-4 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-mono font-semibold cursor-pointer"
              >
                Close Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
