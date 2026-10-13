import React from 'react';
import { Search, Youtube, Play, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { AUTHOR_PROFILE } from '../data/blogData';
import heroImage from '../assets/images/hero_akshay_creator_1791698320547.jpg';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  onOpenYouTubeHub: () => void;
  onOpenConsultationModal: () => void;
  onOpenNewsPage?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  onOpenYouTubeHub,
  onOpenConsultationModal,
  onOpenNewsPage,
}) => {
  return (
    <section className="relative pt-6 pb-12 border-b border-stone-200/80 dark:border-stone-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main 2-column editorial hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Editorial Headline & Identity */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="space-y-3">
              {/* Clean unboxed text kicker */}
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                <span>Domain</span>
                <span aria-hidden="true">·</span>
                <span className="text-stone-800 dark:text-stone-200 font-semibold">akshayblog.sapiexa.com</span>
                <span aria-hidden="true">·</span>
                <span>By Akshay</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
                Engineering Autonomous AI & Modern Creator Economics
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl">
                The flagship publication of Akshay & Sapiexa Media. In-depth technical architecture breakdowns, production AI systems, curated creator hardware, and transparent monetization playbooks.
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {onOpenNewsPage && (
                <button
                  onClick={onOpenNewsPage}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-stone-900 text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>The Best India (7 AM E-Paper)</span>
                </button>
              )}

              <button
                onClick={onOpenYouTubeHub}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium transition-colors shadow-sm cursor-pointer"
              >
                <Youtube className="w-4 h-4" />
                <span>BroSis Tech Tamil</span>
              </button>

              <button
                onClick={onOpenConsultationModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-600 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                <span>Sponsor & Ad Placements</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
                        </div>


          {/* Right Column: Studio Anchor Visual */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm aspect-16/10 sm:aspect-16/9 lg:aspect-auto lg:h-full min-h-[300px]">
              <img
                src={heroImage}
                alt="Akshay in modern tech creator studio recording content"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                <div className="flex items-center justify-between text-xs text-stone-300">
                  <span className="font-medium">Sapiexa Media Production Desk</span>
                  <span className="font-mono text-[11px]">4K 60fps HDR</span>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  Behind the scenes of weekly software engineering breakdowns & affiliate gear reviews.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar Section */}
        <div className="mt-10 pt-8 border-t border-stone-200/70 dark:border-stone-800/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search box with working input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, gear, code..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 transition-shadow"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
