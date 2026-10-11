import React, { useState } from 'react';
import { DollarSign, BarChart3, Settings, Play, Check, Copy, ExternalLink, Mail, ShieldAlert, Sparkles, Plus, Lock, ShieldCheck } from 'lucide-react';
import { INITIAL_AD_UNITS, AUTHOR_PROFILE } from '../data/blogData';
import { AdUnit } from '../types/blog';

interface MonetizationAdManagerProps {
  onOpenConsultationModal: () => void;
  adUnits?: AdUnit[];
  setAdUnits?: React.Dispatch<React.SetStateAction<AdUnit[]>>;
  isAdminAuthenticated?: boolean;
  onOpenAdminLogin?: () => void;
}

export const MonetizationAdManager: React.FC<MonetizationAdManagerProps> = ({
  onOpenConsultationModal,
  adUnits: propsAdUnits,
  setAdUnits: propsSetAdUnits,
  isAdminAuthenticated = false,
  onOpenAdminLogin,
}) => {
  const [localAdUnits, setLocalAdUnits] = useState<AdUnit[]>(INITIAL_AD_UNITS);
  const adUnits = propsAdUnits || localAdUnits;
  const setAdUnits = propsSetAdUnits || setLocalAdUnits;
  const [activeTab, setActiveTab] = useState<'units' | 'adsense' | 'rate-card'>('units');
  const [copiedCodeUnitId, setCopiedCodeUnitId] = useState<string | null>(null);

  const toggleAdStatus = (id: string) => {
    if (!isAdminAuthenticated) {
      if (onOpenAdminLogin) onOpenAdminLogin();
      return;
    }
    setAdUnits((prev) =>
      prev.map((unit) =>
        unit.id === id
          ? { ...unit, status: unit.status === 'active' ? 'paused' : 'active' }
          : unit
      )
    );
  };

  const toggleAdType = (id: string) => {
    if (!isAdminAuthenticated) {
      if (onOpenAdminLogin) onOpenAdminLogin();
      return;
    }
    setAdUnits((prev) =>
      prev.map((unit) =>
        unit.id === id
          ? {
              ...unit,
              type: unit.type === 'adsense' ? 'personal-sponsor' : 'adsense',
              advertiserName: unit.type === 'adsense' ? 'Personal Sponsor Partner' : 'Google AdSense Network',
            }
          : unit
      )
    );
  };

  const handleCopyAdSenseSnippet = (unit: AdUnit) => {
    const code = `<!-- Google AdSense Unit: ${unit.name} on akshayblog.sapiexa.com -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXX"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;
    navigator.clipboard.writeText(code);
    setCopiedCodeUnitId(unit.id);
    setTimeout(() => setCopiedCodeUnitId(null), 2500);
  };

  const totalImpressions = adUnits.reduce((acc, u) => acc + u.impressions, 0);
  const totalClicks = adUnits.reduce((acc, u) => acc + u.clicks, 0);
  const averageCtr = ((totalClicks / (totalImpressions || 1)) * 100).toFixed(2);

  return (
    <section className="py-8 max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Monetization & Ad Infrastructure · akshayblog.sapiexa.com</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Ad Units, AdSense & Personal Sponsorships
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-2xl">
            Manage banner placements, toggle between Google AdSense auto-units and direct high-ticket personal sponsor banners, and view conversion metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenConsultationModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs sm:text-sm font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Book Sponsor Placement</span>
          </button>
        </div>
      </div>

      {/* Monetization KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60">
          <p className="text-xs text-stone-500">Ad Impressions (30d)</p>
          <p className="text-2xl font-editorial font-bold text-stone-900 dark:text-stone-100 mt-1 font-mono tabular-nums">
            {totalImpressions.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">↑ 24% vs prior month</p>
        </div>

        <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60">
          <p className="text-xs text-stone-500">Total Ad Clicks</p>
          <p className="text-2xl font-editorial font-bold text-stone-900 dark:text-stone-100 mt-1 font-mono tabular-nums">
            {totalClicks.toLocaleString()}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Direct partner referrals</p>
        </div>

        <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60">
          <p className="text-xs text-stone-500">Average Ad CTR</p>
          <p className="text-2xl font-editorial font-bold text-stone-900 dark:text-stone-100 mt-1 font-mono tabular-nums">
            {averageCtr}%
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Tech niche baseline: 0.8%</p>
        </div>

        <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60">
          <p className="text-xs text-stone-500">Estimated Monthly Ad Gross</p>
          <p className="text-2xl font-editorial font-bold text-stone-900 dark:text-stone-100 mt-1 font-mono tabular-nums">
            ₹1,22,700
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Excluding YouTube & Affiliates (INR)</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('units')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'units'
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Active Ad Slots & Placements ({adUnits.length})
        </button>
        <button
          onClick={() => setActiveTab('adsense')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'adsense'
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Google AdSense Code Generator
        </button>
        <button
          onClick={() => setActiveTab('rate-card')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'rate-card'
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Sponsorship Media Kit & Rate Card
        </button>
      </div>

      {/* TAB 1: Ad Units List */}
      {activeTab === 'units' && (
        <div className="space-y-6">
          <div className="space-y-4">
            {adUnits.map((unit) => (
              <div
                key={unit.id}
                className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-6 space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                      <span>Placement: {unit.placement}</span>
                      <span>·</span>
                      <span>Dimensions: {unit.size}</span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-1">
                      {unit.name}
                    </h3>
                  </div>

                  {/* Status & Type Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAdType(unit.id)}
                      className={`px-3 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isAdminAuthenticated
                          ? 'border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                          : 'border-stone-200 dark:border-stone-800 text-stone-500 bg-stone-50/50 dark:bg-stone-900/30'
                      }`}
                      title={isAdminAuthenticated ? 'Click to toggle ad mode' : 'Locked: Owner authentication required to change ad mode'}
                    >
                      {!isAdminAuthenticated && <Lock className="w-3 h-3 text-stone-400" />}
                      <span>Mode: <span className="font-semibold capitalize">{unit.type}</span></span>
                    </button>
                    <button
                      onClick={() => toggleAdStatus(unit.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        unit.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-400'
                      }`}
                      title={isAdminAuthenticated ? 'Click to pause/activate ad slot' : 'Locked: Owner authentication required to toggle status'}
                    >
                      {!isAdminAuthenticated && <Lock className="w-3 h-3 opacity-60" />}
                      <span>{unit.status === 'active' ? '● Active' : '○ Paused'}</span>
                    </button>
                  </div>
                </div>

                {/* Live Preview of the Ad Slot */}
                <div className="p-4 rounded-lg border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950/40">
                  <p className="text-[10px] font-mono text-stone-400 mb-2 uppercase">
                    Live Display Simulation ({unit.size})
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-stone-900 text-white">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-amber-400 font-mono">
                        {unit.type === 'adsense' ? 'Google Sponsored Unit' : 'Partner Spotlight'}
                      </span>
                      <h4 className="text-sm font-bold mt-0.5">{unit.headline}</h4>
                      <p className="text-xs text-stone-300 mt-1">{unit.description}</p>
                    </div>
                    <a
                      href={unit.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded bg-white text-stone-900 text-xs font-semibold hover:bg-stone-200 transition-colors shrink-0 text-center"
                    >
                      {unit.ctaText}
                    </a>
                  </div>
                </div>

                {/* Metrics Footer */}
                <div className="flex items-center justify-between text-xs text-stone-500 font-mono pt-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-4">
                    <span>{unit.impressions.toLocaleString()} Impressions</span>
                    <span>·</span>
                    <span>{unit.clicks} Clicks</span>
                    <span>·</span>
                    <span>Est: {unit.estimatedRevenue}</span>
                  </div>
                  <button
                    onClick={() => handleCopyAdSenseSnippet(unit)}
                    className="flex items-center gap-1 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                  >
                    {copiedCodeUnitId === unit.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied Snippet</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Ad Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Google AdSense Setup Guide */}
      {activeTab === 'adsense' && (
        <div className="space-y-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-6">
          <div className="space-y-2">
            <h3 className="text-lg font-editorial font-bold text-stone-900 dark:text-stone-100">
              Google AdSense Setup on akshayblog.sapiexa.com
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              To activate live Google AdSense on your subdomain, follow these 3 steps:
            </p>
          </div>

          <div className="space-y-4 text-xs text-stone-700 dark:text-stone-300">
            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 space-y-1">
              <p className="font-semibold text-stone-900 dark:text-stone-100">
                Step 1: Add akshayblog.sapiexa.com in AdSense Dashboard
              </p>
              <p className="text-stone-500">
                Log into Google AdSense &gt; Sites &gt; Add Site &gt; Enter <code>https://akshayblog.sapiexa.com</code> (or primary domain <code>sapiexa.com</code>).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 space-y-2">
              <p className="font-semibold text-stone-900 dark:text-stone-100">
                Step 2: Embed the AdSense Verification Script in <code>&lt;head&gt;</code>
              </p>
              <div className="relative">
                <pre className="p-3 rounded-lg bg-stone-950 text-stone-200 font-mono text-[11px] overflow-x-auto">
                  <code>{`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossorigin="anonymous"></script>`}</code>
                </pre>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 space-y-2">
              <p className="font-semibold text-stone-900 dark:text-stone-100">
                Step 3: Setup <code>ads.txt</code> on sapiexa.com
              </p>
              <p className="text-stone-500">
                Ensure <code>https://sapiexa.com/ads.txt</code> contains your publisher record:
              </p>
              <pre className="p-2.5 rounded bg-stone-950 text-stone-200 font-mono text-[11px]">
                <code>google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Sponsorship Media Kit & Rate Card */}
      {activeTab === 'rate-card' && (
        <div className="space-y-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-6 sm:p-8">
          <div className="space-y-2">
            <h3 className="text-xl font-editorial font-bold text-stone-900 dark:text-stone-100">
              Akshay & Sapiexa Media 2026 Rate Card
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              For tech companies, developer tools, and consumer electronics brands seeking direct promotion to 128,000+ active engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 space-y-3">
              <span className="text-xs font-mono uppercase text-stone-500">Package A</span>
              <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">Dedicated YouTube Video</h4>
              <p className="text-2xl font-editorial font-bold text-stone-900 dark:text-stone-100">₹2,10,000</p>
              <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1.5">
                <li>✓ Full 15-20 min in-depth walkthrough</li>
                <li>✓ Permanent video description link</li>
                <li>✓ Companion article on akshayblog.sapiexa.com</li>
                <li>✓ Pinned comment promotion</li>
              </ul>
              <button
                onClick={onOpenConsultationModal}
                className="w-full mt-3 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold cursor-pointer"
              >
                Book Package
              </button>
            </div>

            <div className="p-5 rounded-xl border-2 border-stone-900 dark:border-stone-100 bg-white dark:bg-stone-900 space-y-3 relative shadow-md">
              <span className="text-xs font-mono uppercase text-amber-600 font-bold">Most Popular</span>
              <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">60-90s Video Integration</h4>
              <p className="text-2xl font-editorial font-bold text-stone-900 dark:text-stone-100">₹98,000</p>
              <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1.5">
                <li>✓ Mid-roll organic host read by Akshay</li>
                <li>✓ Featured banner in companion article</li>
                <li>✓ Discount code copy widget</li>
                <li>✓ 30-day analytics report</li>
              </ul>
              <button
                onClick={onOpenConsultationModal}
                className="w-full mt-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
              >
                Book Integration
              </button>
            </div>

            <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 space-y-3">
              <span className="text-xs font-mono uppercase text-stone-500">Package C</span>
              <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">Monthly Blog Banner Slot</h4>
              <p className="text-2xl font-editorial font-bold text-stone-900 dark:text-stone-100">₹38,000 / month</p>
              <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1.5">
                <li>✓ Sitewide Top Header or Sidebar ad</li>
                <li>✓ 45,000+ monthly tech readers</li>
                <li>✓ Custom referral URL & tracking</li>
                <li>✓ DoFollow backlink in sponsor section</li>
              </ul>
              <button
                onClick={onOpenConsultationModal}
                className="w-full mt-3 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold cursor-pointer"
              >
                Reserve Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
