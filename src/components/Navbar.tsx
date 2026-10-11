import React, { useState } from 'react';
import { Sparkles, Sliders, Menu, X, Youtube, ExternalLink, Globe, Shield } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenThemeCustomizer: () => void;
  onOpenSeoOptimizer: () => void;
  onOpenDomainSetup: () => void;
  onOpenConsultationModal: () => void;
  onOpenAdminPanel: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenThemeCustomizer,
  onOpenSeoOptimizer,
  onOpenDomainSetup,
  onOpenConsultationModal,
  onOpenAdminPanel,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'articles', label: 'Articles' },
    { id: 'youtube', label: 'YouTube Hub' },
    { id: 'affiliates', label: 'Gear & Affiliates' },
    { id: 'monetization', label: 'Ad & Sponsor Manager' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      {/* Top micro-announcement bar for subdomain status */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="font-mono text-[11px] text-stone-300">akshayblog.sapiexa.com</span>
            <span className="text-stone-500 hidden sm:inline">·</span>
            <span className="text-stone-400 hidden sm:inline">Official Tech Blog & Creator Hub of Sapiexa</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
            <button
              onClick={onOpenAdminPanel}
              className="text-stone-200 hover:text-white transition-colors flex items-center gap-1 cursor-pointer bg-stone-800 hover:bg-stone-700 px-2 py-0.5 rounded font-medium"
              title="Open Admin Studio: Create & Edit Articles, Manage Affiliates"
            >
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>Admin Studio</span>
            </button>
            <button
              onClick={onOpenDomainSetup}
              className="text-stone-300 hover:text-white transition-colors hidden sm:flex items-center gap-1 cursor-pointer"
              title="View DNS CNAME Configuration for akshayblog.sapiexa.com"
            >
              <Globe className="w-3 h-3 text-stone-400" />
              <span>DNS Setup</span>
            </button>
            <button
              onClick={onOpenSeoOptimizer}
              className="text-stone-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>SEO Diagnostic</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar adhering to the Top Bar Contract (3 zones separated by gap-8) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            setActiveTab('articles');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-left group cursor-pointer"
        >
          <span className="text-lg sm:text-xl font-editorial font-bold tracking-tight text-stone-900 dark:text-stone-100 whitespace-nowrap shrink-0 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors">
            Akshay's Tech Blog
          </span>
          <span className="block text-[11px] font-sans-clean text-stone-500 dark:text-stone-400">
            Sapiexa Media & Engineering
          </span>
        </button>

        {/* Zone 2: 4-5 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-300">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`whitespace-nowrap shrink-0 transition-colors relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-stone-950 dark:text-white font-semibold'
                    : 'hover:text-stone-950 dark:hover:text-white text-stone-600 dark:text-stone-400'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 dark:bg-white rounded-full" />
                )}
              </button>
            );
          })}
          <a
            href="https://youtube.com/@brosistech"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 whitespace-nowrap shrink-0 transition-colors"
          >
            <Youtube className="w-4 h-4 text-red-600" />
            <span>BroSis Tech (@brosistech)</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenAdminPanel}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
            title="Open Admin Studio: Create & Edit Articles"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Admin Studio</span>
          </button>

          <button
            onClick={onOpenThemeCustomizer}
            className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title="Customize Theme & Reading Mode"
            aria-label="Theme settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
          
          <button
            onClick={onOpenConsultationModal}
            className="px-3.5 py-2 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            Work with Akshay
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 px-3 rounded-lg text-sm font-medium ${
                activeTab === link.id
                  ? 'bg-stone-100 dark:bg-stone-900 text-stone-950 dark:text-white'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenAdminPanel();
                setMobileMenuOpen(false);
              }}
              className="text-left text-sm py-2 px-3 text-stone-900 dark:text-stone-100 font-semibold flex items-center gap-2 bg-stone-100 dark:bg-stone-900 rounded-lg"
            >
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Admin Studio (Create & Edit Content)</span>
            </button>
            <button
              onClick={() => {
                onOpenSeoOptimizer();
                setMobileMenuOpen(false);
              }}
              className="text-left text-sm py-2 px-3 text-stone-600 dark:text-stone-300 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Search & SEO Diagnostic</span>
            </button>
            <button
              onClick={() => {
                onOpenDomainSetup();
                setMobileMenuOpen(false);
              }}
              className="text-left text-sm py-2 px-3 text-stone-600 dark:text-stone-300 flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-stone-400" />
              <span>Domain DNS Configuration (akshayblog.sapiexa.com)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
