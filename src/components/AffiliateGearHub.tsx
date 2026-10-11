import React, { useState } from 'react';
import { Tag, Copy, Check, ExternalLink, ShieldCheck, Plus, Sparkles, Filter, TrendingUp } from 'lucide-react';
import { INITIAL_AFFILIATE_ITEMS } from '../data/blogData';
import { AffiliateItem } from '../types/blog';

interface AffiliateGearHubProps {
  onOpenConsultationModal: () => void;
  items?: AffiliateItem[];
  setItems?: React.Dispatch<React.SetStateAction<AffiliateItem[]>>;
}

export const AffiliateGearHub: React.FC<AffiliateGearHubProps> = ({
  onOpenConsultationModal,
  items: propsItems,
  setItems: propsSetItems,
}) => {
  const [localItems, setLocalItems] = useState<AffiliateItem[]>(INITIAL_AFFILIATE_ITEMS);
  const items = propsItems || localItems;
  const setItems = propsSetItems || setLocalItems;
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New affiliate item form state
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState<'hardware' | 'software' | 'audio' | 'workspace'>('software');
  const [newSummary, setNewSummary] = useState('');

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2500);

    // Track click
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, clicks: item.clicks + 1 } : item))
    );
  };

  const handleTrackLinkClick = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, clicks: item.clicks + 1 } : item))
    );
  };

  const handleAddAffiliate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    const newItem: AffiliateItem = {
      id: `aff-${Date.now()}`,
      name: newTitle,
      brand: newBrand || 'Custom Partner',
      category: newCategory,
      price: newPrice,
      discountCode: newCode || undefined,
      discountPercent: 'Exclusive Deal',
      affiliateUrl: newUrl || 'https://akshayblog.sapiexa.com/ref/custom',
      rating: 5.0,
      reviewsCount: 1,
      badge: 'Curated by Akshay',
      image: items[0].image,
      pros: ['Vetted by Akshay for production tech workflows'],
      cons: ['Limited stock / seasonal promotion'],
      summary: newSummary || 'A high-yield productivity and creator tool endorsed by Akshay.',
      clicks: 0,
    };

    setItems([newItem, ...items]);
    setShowAddModal(false);
    // Reset form
    setNewTitle('');
    setNewBrand('');
    setNewPrice('');
    setNewCode('');
    setNewUrl('');
    setNewSummary('');
  };

  const filteredItems = categoryFilter === 'all'
    ? items
    : items.filter((i) => i.category === categoryFilter);

  const totalClicks = items.reduce((acc, curr) => acc + curr.clicks, 0);

  return (
    <section className="py-8 max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
      {/* Header and FTC disclosure */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500">
            <Tag className="w-4 h-4 text-stone-600 dark:text-stone-300" />
            <span>Curated Tech Stack & Affiliate Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Developer Hardware, Studio Gear & Software
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-2xl">
            Every product listed here is personally bought, tested, and actively utilized by Akshay in daily production at Sapiexa Media.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Affiliate Product</span>
          </button>
        </div>
      </div>

      {/* FTC Transparency Banner */}
      <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/40 flex items-start sm:items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">
              FTC Affiliate Compliance & Reader Guarantee
            </p>
            <p className="text-[11px] text-stone-500">
              We never accept paid positive reviews. Links contain tracking tags where Sapiexa may earn a commission at no additional cost to you.
            </p>
          </div>
        </div>
        <div className="text-xs font-mono text-stone-600 dark:text-stone-400">
          Total Affiliate Clicks Tracked: <span className="font-bold">{totalClicks.toLocaleString()}</span>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Equipment' },
          { id: 'hardware', label: 'Cameras & Hardware' },
          { id: 'audio', label: 'Audio & Microphones' },
          { id: 'software', label: 'Software & AI' },
          { id: 'workspace', label: 'Desk & Ergonomics' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              categoryFilter === cat.id
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 p-6 flex flex-col justify-between space-y-4 hover:border-stone-400 dark:hover:border-stone-700 transition-all shadow-xs"
          >
            <div className="space-y-4">
              {/* Product header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                    <span>{item.brand}</span>
                    <span>·</span>
                    <span className="capitalize">{item.category}</span>
                  </div>
                  <h3 className="text-lg font-editorial font-bold text-stone-900 dark:text-stone-100">
                    {item.name}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100">
                    {item.price}
                  </p>
                  {item.originalPrice && (
                    <p className="text-xs text-stone-400 line-through font-mono">
                      {item.originalPrice}
                    </p>
                  )}
                </div>
              </div>

              {/* Product Visual */}
              <div className="aspect-16/9 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {item.summary}
              </p>

              {/* Pros & Cons */}
              <div className="space-y-2 pt-1 border-t border-stone-100 dark:border-stone-800/80">
                <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">Why Akshay Recommends It:</p>
                <ul className="space-y-1 text-xs text-stone-600 dark:text-stone-400">
                  {item.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions: Discount code and Buy Link */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
              {item.discountCode && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-100 dark:bg-stone-800/60 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                    <span>Coupon:</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                      {item.discountCode}
                    </span>
                    {item.discountPercent && (
                      <span className="text-emerald-600 text-[11px] font-semibold">({item.discountPercent})</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopyCode(item.discountCode!, item.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 text-[11px] font-medium cursor-pointer"
                  >
                    {copiedCodeId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-stone-400">
                  {item.clicks} clicks recorded
                </span>
                <a
                  href={item.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleTrackLinkClick(item.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  <span>Open Partner Store</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Affiliate Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-lg w-full p-6 space-y-4 border border-stone-200 dark:border-stone-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="text-base font-editorial font-bold text-stone-900 dark:text-stone-100">
                Embed New Affiliate Product
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAffiliate} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Product / Service Name
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Supabase Pro Database Tier"
                  className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Brand / Company
                  </label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="e.g. Supabase"
                    className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Display Price
                  </label>
                  <input
                    type="text"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="e.g. ₹2,499/month"
                    className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Discount / Coupon Code
                  </label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. AKSHAYDEV"
                    className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                  >
                    <option value="software">Software & AI</option>
                    <option value="hardware">Hardware & Cameras</option>
                    <option value="audio">Audio & Sound</option>
                    <option value="workspace">Desk & Workspace</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Affiliate Target URL
                </label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://akshayblog.sapiexa.com/ref/item"
                  className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Review & Why Akshay Recommends
                </label>
                <textarea
                  rows={2}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Highlight why this product is worth purchasing..."
                  className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold cursor-pointer"
                >
                  Save & Publish Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
