import React from 'react';
import { Youtube, ExternalLink, Globe, Sparkles } from 'lucide-react';
import { AUTHOR_PROFILE } from '../data/blogData';

interface FooterProps {
  onOpenSeoOptimizer: () => void;
  onOpenDomainSetup: () => void;
  onOpenConsultationModal: () => void;
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSeoOptimizer,
  onOpenDomainSetup,
  onOpenConsultationModal,
  setActiveTab,
}) => {
  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-3">
            <h3 className="text-lg font-editorial font-bold text-stone-900 dark:text-stone-100">
              Akshay's Tech Blog
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-sm">
              The official publication of Sapiexa Media. Focused on autonomous AI engineering, high-performance creator hardware, and transparent monetization architectures.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
              <span>Primary Domain:</span>
              <a
                href="https://sapiexa.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-800 dark:text-stone-200 hover:underline flex items-center gap-1"
              >
                <span>sapiexa.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <p className="font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Sections
            </p>
            <ul className="space-y-2 text-stone-600 dark:text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('articles');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-stone-950 dark:hover:text-white cursor-pointer"
                >
                  All Articles
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('news');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-stone-950 dark:hover:text-white cursor-pointer flex items-center gap-1.5"
                >
                  <span>The Best India</span>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 px-1 py-0.2 rounded font-bold">7 AM LIVE</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('youtube');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-stone-950 dark:hover:text-white cursor-pointer"
                >
                  YouTube Videos
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('affiliates');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-stone-950 dark:hover:text-white cursor-pointer"
                >
                  Creator Gear Stack
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('monetization');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-stone-950 dark:hover:text-white cursor-pointer"
                >
                  Ad Units & Sponsors
                </button>
              </li>
            </ul>
          </div>

          {/* Technical & SEO Tools */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <p className="font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Search & Systems
            </p>
            <ul className="space-y-2 text-stone-600 dark:text-stone-400">
              <li>
                <button onClick={onOpenSeoOptimizer} className="hover:text-stone-950 dark:hover:text-white cursor-pointer flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>AI Search Optimizer</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenDomainSetup} className="hover:text-stone-950 dark:hover:text-white cursor-pointer flex items-center gap-1">
                  <Globe className="w-3 h-3 text-stone-400" />
                  <span>DNS Setup Guide</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenSeoOptimizer} className="hover:text-stone-950 dark:hover:text-white cursor-pointer">
                  Schema.org Validator
                </button>
              </li>
              <li>
                <button onClick={onOpenSeoOptimizer} className="hover:text-stone-950 dark:hover:text-white cursor-pointer">
                  XML Sitemap
                </button>
              </li>
            </ul>
          </div>

          {/* Connect & Creator Channels */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <p className="font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Creator Channels
            </p>
            <p className="text-stone-500 leading-relaxed">
              Weekly code architectures, engineering insights, and honest hardware breakdowns.
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <a
                href="https://youtube.com/@brosistech"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
              >
                <Youtube className="w-4 h-4" />
                <span>BroSis Tech Tamil</span>
              </a>
              <button
                onClick={onOpenConsultationModal}
                className="inline-flex items-center gap-1 text-stone-800 dark:text-stone-200 font-medium hover:underline text-left cursor-pointer"
              >
                <span>Direct Inquiries: {AUTHOR_PROFILE.email}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quiet Legal & Disclosures */}
        <div className="pt-8 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>
            © {new Date().getFullYear()} Akshay & Sapiexa Media. Subdomain: <code>akshayblog.sapiexa.com</code>. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span>FTC Affiliate Disclosure Enforced</span>
            <span>·</span>
            <span>Schema.org Validated</span>
            <span>·</span>
            <button onClick={onOpenDomainSetup} className="hover:underline cursor-pointer">
              CNAME Status: Configured
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
