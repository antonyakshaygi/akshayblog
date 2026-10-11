/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ArticleCard } from './components/ArticleCard';
import { ArticleReader } from './components/ArticleReader';
import { YouTubeHub } from './components/YouTubeHub';
import { AffiliateGearHub } from './components/AffiliateGearHub';
import { MonetizationAdManager } from './components/MonetizationAdManager';
import { SeoAiOptimizerModal } from './components/SeoAiOptimizerModal';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { DomainSetupModal } from './components/DomainSetupModal';
import { ConsultationModal } from './components/ConsultationModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Footer } from './components/Footer';

import { INITIAL_ARTICLES, INITIAL_AD_UNITS, INITIAL_AFFILIATE_ITEMS, AUTHOR_PROFILE } from './data/blogData';
import { Article, ThemeSettings, AffiliateItem, AdUnit } from './types/blog';
import { Sparkles, Mail, Check, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('articles');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // OWNER AUTHENTICATION STATE (Restricts editing strictly to Akshay)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('akshay_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  const [adminPasscode, setAdminPasscode] = useState<string>(() => {
    try {
      return localStorage.getItem('akshay_admin_passcode') || 'akshay2026';
    } catch {
      return 'akshay2026';
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // DYNAMIC STATE WITH LOCALSTORAGE PERSISTENCE
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem('akshay_blog_articles_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        const hasIpad = parsed.some((a: any) => a.id === 'article-ipad-11');
        if (!hasIpad) {
          const merged = [INITIAL_ARTICLES[0], ...parsed];
          localStorage.setItem('akshay_blog_articles_v2', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
      return INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });

  const [affiliateItems, setAffiliateItems] = useState<AffiliateItem[]>(() => {
    try {
      const saved = localStorage.getItem('akshay_blog_affiliates_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        const hasIpadAff = parsed.some((item: any) => item.id === 'aff-ipad-11');
        if (!hasIpadAff) {
          const merged = [INITIAL_AFFILIATE_ITEMS[0], ...parsed];
          localStorage.setItem('akshay_blog_affiliates_v2', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
      return INITIAL_AFFILIATE_ITEMS;
    } catch {
      return INITIAL_AFFILIATE_ITEMS;
    }
  });

  const [adUnits, setAdUnits] = useState<AdUnit[]>(() => {
    try {
      const saved = localStorage.getItem('akshay_blog_ads_v2');
      return saved ? JSON.parse(saved) : INITIAL_AD_UNITS;
    } catch {
      return INITIAL_AD_UNITS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('akshay_blog_articles_v2', JSON.stringify(articles));
    } catch {}
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem('akshay_blog_affiliates_v2', JSON.stringify(affiliateItems));
    } catch {}
  }, [affiliateItems]);

  useEffect(() => {
    try {
      localStorage.setItem('akshay_blog_ads_v2', JSON.stringify(adUnits));
    } catch {}
  }, [adUnits]);

  // Modals state
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Newsletter subscribe state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Theme settings state
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    mode: 'warm-paper',
    fontSize: 'md',
    accentColor: 'terracotta',
    readingWidth: 'standard',
  });

  // Apply theme settings to body and HTML root
  useEffect(() => {
    document.body.setAttribute('data-theme', themeSettings.mode);
    const root = document.documentElement;
    if (themeSettings.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeSettings.mode]);

  const updateThemeSettings = (newSettings: Partial<ThemeSettings>) => {
    setThemeSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleSignOut = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('akshay_admin_session');
    } catch {}
  };

  const handleOpenAdmin = () => {
    setEditingArticleId(null);
    if (isAdminAuthenticated) {
      setIsAdminModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticleId(article.id);
    if (isAdminAuthenticated) {
      setIsAdminModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleResetToDefaults = () => {
    if (!isAdminAuthenticated) return;
    setArticles(INITIAL_ARTICLES);
    setAffiliateItems(INITIAL_AFFILIATE_ITEMS);
    setAdUnits(INITIAL_AD_UNITS);
    try {
      localStorage.removeItem('akshay_blog_articles_v2');
      localStorage.removeItem('akshay_blog_affiliates_v2');
      localStorage.removeItem('akshay_blog_ads_v2');
    } catch {}
  };

  const categories = ['All', 'AI & Engineering', 'Creator Hardware', 'Monetization', 'Architecture'];

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'All' || article.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [articles, searchQuery, selectedCategory]);

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToArticles = () => {
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSuccess(false);
    }, 4000);
  };

  // Top leaderboard ad unit (if active)
  const headerAdUnit = adUnits.find(
    (u) => u.placement === 'header-leaderboard' && u.status === 'active'
  );

  return (
    <div className="min-h-screen flex flex-col transition-colors selection:bg-stone-300 dark:selection:bg-stone-700">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedArticle(null);
        }}
        onOpenThemeCustomizer={() => setIsThemeModalOpen(true)}
        onOpenSeoOptimizer={() => setIsSeoModalOpen(true)}
        onOpenDomainSetup={() => setIsDomainModalOpen(true)}
        onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
        onOpenAdminPanel={handleOpenAdmin}
        isAdminAuthenticated={isAdminAuthenticated}
        onSignOut={handleSignOut}
      />

      {/* Optional Top Header Leaderboard Ad Banner (Tastefully rendered) */}
      {headerAdUnit && (
        <div className="bg-stone-100 dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-800 py-2.5 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                Partner Sponsor
              </span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                {headerAdUnit.headline}
              </span>
            </div>
            <a
              href={headerAdUnit.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors shrink-0"
            >
              {headerAdUnit.ctaText}
            </a>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1">
        {selectedArticle ? (
          /* Single Article Reader View with Subtle Color-Changing Progress Bar */
          <ArticleReader
            article={selectedArticle}
            onBack={handleBackToArticles}
            onOpenYouTubeHub={() => {
              setSelectedArticle(null);
              setActiveTab('youtube');
            }}
            onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
            onOpenSeoOptimizer={() => setIsSeoModalOpen(true)}
            affiliateItems={affiliateItems}
            isAdminAuthenticated={isAdminAuthenticated}
            onEditArticle={handleEditArticle}
          />
        ) : (
          /* Multi-tab Main View */
          <>
            {activeTab === 'articles' && (
              <>
                <HeroSection
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  categories={categories}
                  onOpenYouTubeHub={() => setActiveTab('youtube')}
                  onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
                />

                {/* Article Feed Section */}
                <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
                  <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-editorial font-bold text-stone-900 dark:text-stone-100">
                        {selectedCategory === 'All' ? 'Latest Publications & Deep Dives' : selectedCategory}
                      </h2>
                      <p className="text-xs text-stone-500 font-mono mt-0.5">
                        Showing {filteredArticles.length} article{filteredArticles.length === 1 ? '' : 's'} on akshayblog.sapiexa.com
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* ONLY SHOW COMPOSE BUTTON IF LOGGED IN AS AKSHAY */}
                      {isAdminAuthenticated && (
                        <button
                          onClick={() => setIsAdminModalOpen(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-xs font-semibold text-emerald-800 dark:text-emerald-300 cursor-pointer"
                        >
                          <span>+ Compose Article</span>
                        </button>
                      )}

                      <button
                        onClick={() => setIsSeoModalOpen(true)}
                        className="hidden sm:flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Schema & SEO Validated</span>
                      </button>
                    </div>
                  </div>

                  {filteredArticles.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <p className="text-lg font-editorial text-stone-600 dark:text-stone-400">
                        No articles match "{searchQuery}"
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('All');
                        }}
                        className="px-4 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold cursor-pointer"
                      >
                        Reset Search Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                      {filteredArticles.map((article, idx) => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          onSelectArticle={handleSelectArticle}
                          featured={idx === 0 && selectedCategory === 'All' && !searchQuery}
                          isAdminAuthenticated={isAdminAuthenticated}
                          onEditArticle={handleEditArticle}
                        />
                      ))}
                    </div>
                  )}

                  {/* Newsletter & Free Developer Playbook Incentive */}
                  <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/40 p-8 sm:p-10 space-y-4 text-center max-w-3xl mx-auto shadow-xs">
                    <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
                      Weekly Creator Architecture Dispatch
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900 dark:text-stone-100">
                      Get Akshay's Private AI & BroSis Tech Creator Stack
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
                      Zero spam. Weekly engineering teardowns, unreleased YouTube companion code repositories, and exclusive affiliate discounts in Indian Rupees straight to your inbox.
                    </p>

                    {newsletterSuccess ? (
                      <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 max-w-md mx-auto">
                        <Check className="w-4 h-4" />
                        <span>Welcome aboard! Check your inbox for the 2026 Solo Creator Blueprint.</span>
                      </div>
                    ) : (
                      <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
                        <input
                          type="email"
                          required
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          placeholder="Your email (e.g. dev@company.com)"
                          className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400"
                        />
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors shrink-0 cursor-pointer shadow-sm"
                        >
                          Subscribe Free
                        </button>
                      </form>
                    )}
                    <p className="text-[11px] text-stone-400">
                      Join 14,800+ engineers subscribed to the Sapiexa weekly newsletter. Unsubscribe anytime.
                    </p>
                  </div>
                </section>
              </>
            )}

            {activeTab === 'youtube' && (
              <YouTubeHub
                onSelectArticle={handleSelectArticle}
                onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
              />
            )}

            {activeTab === 'affiliates' && (
              <AffiliateGearHub
                onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
                items={affiliateItems}
                setItems={setAffiliateItems}
                isAdminAuthenticated={isAdminAuthenticated}
                onOpenAdminLogin={handleOpenAdmin}
              />
            )}

            {activeTab === 'monetization' && (
              <MonetizationAdManager
                onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
                adUnits={adUnits}
                setAdUnits={setAdUnits}
                isAdminAuthenticated={isAdminAuthenticated}
                onOpenAdminLogin={handleOpenAdmin}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        settings={themeSettings}
        updateSettings={updateThemeSettings}
      />

      <SeoAiOptimizerModal
        isOpen={isSeoModalOpen}
        onClose={() => setIsSeoModalOpen(false)}
        currentArticle={selectedArticle || articles[0] || INITIAL_ARTICLES[0]}
      />

      <DomainSetupModal
        isOpen={isDomainModalOpen}
        onClose={() => setIsDomainModalOpen(false)}
      />

      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />

      {/* Owner Login Modal (Protected by Master Passcode) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsAdminAuthenticated(true);
          setIsAdminModalOpen(true);
        }}
        correctPasscode={adminPasscode}
      />

      {/* Admin Panel Modal (Accessible Only When Authenticated) */}
      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          setEditingArticleId(null);
        }}
        articles={articles}
        setArticles={setArticles}
        affiliateItems={affiliateItems}
        setAffiliateItems={setAffiliateItems}
        adUnits={adUnits}
        setAdUnits={setAdUnits}
        onResetToDefaults={handleResetToDefaults}
        adminPasscode={adminPasscode}
        setAdminPasscode={setAdminPasscode}
        onSignOut={handleSignOut}
        initialArticleIdToEdit={editingArticleId}
      />

      {/* Footer */}
      <Footer
        onOpenSeoOptimizer={() => setIsSeoModalOpen(true)}
        onOpenDomainSetup={() => setIsDomainModalOpen(true)}
        onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedArticle(null);
        }}
      />
    </div>
  );
}
