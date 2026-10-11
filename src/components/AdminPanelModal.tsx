import React, { useState, useEffect } from 'react';
import { 
  Shield, FileText, Tag, DollarSign, Settings, Plus, Edit2, 
  Trash2, Check, Sparkles, Youtube, ExternalLink, Save, X, RefreshCw, Eye, EyeOff, Lock, KeyRound
} from 'lucide-react';
import { Article, AffiliateItem, AdUnit } from '../types/blog';
import { AUTHOR_PROFILE } from '../data/blogData';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  affiliateItems: AffiliateItem[];
  setAffiliateItems: React.Dispatch<React.SetStateAction<AffiliateItem[]>>;
  adUnits: AdUnit[];
  setAdUnits: React.Dispatch<React.SetStateAction<AdUnit[]>>;
  onResetToDefaults: () => void;
  adminPasscode: string;
  setAdminPasscode: (code: string) => void;
  onSignOut: () => void;
  initialArticleIdToEdit?: string | null;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  articles,
  setArticles,
  affiliateItems,
  setAffiliateItems,
  adUnits,
  setAdUnits,
  onResetToDefaults,
  adminPasscode,
  setAdminPasscode,
  onSignOut,
  initialArticleIdToEdit,
}) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'affiliates' | 'ads' | 'site'>('articles');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [newPasscode, setNewPasscode] = useState(adminPasscode);
  const [showNewPasscode, setShowNewPasscode] = useState(false);

  // ARTICLE FORM STATE
  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleSubtitle, setArticleSubtitle] = useState('');
  const [articleSlug, setArticleSlug] = useState('');
  const [articleCategory, setArticleCategory] = useState<'AI & Engineering' | 'Creator Hardware' | 'Monetization' | 'Architecture'>('AI & Engineering');
  const [articleReadTime, setArticleReadTime] = useState('7 min read');
  const [articleExcerpt, setArticleExcerpt] = useState('');
  const [articleContentText, setArticleContentText] = useState('');
  const [articleTagsText, setArticleTagsText] = useState('AI, Engineering, TypeScript');
  const [articleKeyTakeawaysText, setArticleKeyTakeawaysText] = useState('');
  const [articleYtTitle, setArticleYtTitle] = useState('');
  const [articleYtDuration, setArticleYtDuration] = useState('18:30');

  // AFFILIATE FORM STATE
  const [isEditingAffiliate, setIsEditingAffiliate] = useState(false);
  const [selectedAffiliateId, setSelectedAffiliateId] = useState<string | null>(null);
  const [affName, setAffName] = useState('');
  const [affBrand, setAffBrand] = useState('');
  const [affCategory, setAffCategory] = useState<'hardware' | 'software' | 'audio' | 'workspace'>('software');
  const [affPrice, setAffPrice] = useState('₹');
  const [affOriginalPrice, setAffOriginalPrice] = useState('');
  const [affDiscountCode, setAffDiscountCode] = useState('');
  const [affDiscountPercent, setAffDiscountPercent] = useState('');
  const [affUrl, setAffUrl] = useState('https://akshayblog.sapiexa.com/ref/');
  const [affSummary, setAffSummary] = useState('');
  const [affProsText, setAffProsText] = useState('');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // OPEN NEW ARTICLE FORM
  const handleOpenNewArticle = () => {
    setIsEditingArticle(true);
    setSelectedArticleId(null);
    setArticleTitle('');
    setArticleSubtitle('');
    setArticleSlug(`post-${Date.now()}`);
    setArticleCategory('AI & Engineering');
    setArticleReadTime('6 min read');
    setArticleExcerpt('');
    setArticleContentText('The transition to modern autonomous architectures requires separating reasoning from execution...\n\n### Core Engineering Principles\nBuilding reliable systems begins with typed contracts and deterministic validations.');
    setArticleTagsText('AI, TypeScript, Architecture, Sapiexa');
    setArticleKeyTakeawaysText('Separation of reasoning and execution prevents hallucination.\nAlways implement strict typed schemas with TypeScript.\nServerless edge deployments yield optimal latency in India.');
    setArticleYtTitle('');
    setArticleYtDuration('15:00');
  };

  // OPEN EDIT ARTICLE
  const handleOpenEditArticle = (art: Article) => {
    setIsEditingArticle(true);
    setSelectedArticleId(art.id);
    setArticleTitle(art.title);
    setArticleSubtitle(art.subtitle);
    setArticleSlug(art.slug);
    setArticleCategory(art.category);
    setArticleReadTime(art.readTime);
    setArticleExcerpt(art.excerpt);
    setArticleContentText(art.content.join('\n\n'));
    setArticleTagsText(art.tags.join(', '));
    setArticleKeyTakeawaysText(art.keyTakeaways.join('\n'));
    setArticleYtTitle(art.youtubeCompanion ? art.youtubeCompanion.title : '');
    setArticleYtDuration(art.youtubeCompanion ? art.youtubeCompanion.duration : '20:00');
  };

  useEffect(() => {
    if (isOpen && initialArticleIdToEdit) {
      const target = articles.find((a) => a.id === initialArticleIdToEdit);
      if (target) {
        handleOpenEditArticle(target);
        setActiveTab('articles');
      }
    }
  }, [isOpen, initialArticleIdToEdit, articles]);

  // SAVE ARTICLE
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle || !articleExcerpt) return;

    const tags = articleTagsText.split(',').map((t) => t.trim()).filter(Boolean);
    const takeaways = articleKeyTakeawaysText.split('\n').map((t) => t.trim()).filter(Boolean);
    const contentParagraphs = articleContentText.split('\n\n').filter(Boolean);

    if (selectedArticleId) {
      // Update existing
      setArticles((prev) =>
        prev.map((art) => {
          if (art.id !== selectedArticleId) return art;
          return {
            ...art,
            title: articleTitle,
            subtitle: articleSubtitle,
            slug: articleSlug,
            category: articleCategory,
            readTime: articleReadTime,
            excerpt: articleExcerpt,
            content: contentParagraphs,
            tags,
            keyTakeaways: takeaways,
            updatedAt: 'October 11, 2026',
            youtubeCompanion: articleYtTitle
              ? {
                  videoId: art.youtubeCompanion?.videoId || `yt-${Date.now()}`,
                  title: articleYtTitle,
                  duration: articleYtDuration,
                  uploadDate: '2026-10-10',
                  viewCount: art.youtubeCompanion?.viewCount || '12.4K views',
                  thumbnailUrl: art.coverImage,
                  transcriptSummary: articleSubtitle,
                  timestamps: art.youtubeCompanion?.timestamps || [
                    { time: '00:00', title: 'Introduction & Setup' },
                    { time: '05:30', title: 'Architecture Walkthrough' },
                  ],
                }
              : undefined,
          };
        })
      );
      showToast('Article updated successfully!');
    } else {
      // Create new
      const newArticle: Article = {
        id: `article-${Date.now()}`,
        slug: articleSlug || `post-${Date.now()}`,
        title: articleTitle,
        subtitle: articleSubtitle,
        excerpt: articleExcerpt,
        content: contentParagraphs,
        category: articleCategory,
        tags,
        readTime: articleReadTime,
        publishedAt: 'October 11, 2026',
        updatedAt: 'October 11, 2026',
        coverImage: articles[0]?.coverImage || '',
        author: {
          name: AUTHOR_PROFILE.name,
          role: 'Tech Lead @ Sapiexa',
          avatar: AUTHOR_PROFILE.avatar,
          bio: AUTHOR_PROFILE.bio,
        },
        keyTakeaways: takeaways.length > 0 ? takeaways : ['Key technical insights published by Akshay.'],
        views: 120,
        likes: 14,
        seo: {
          metaTitle: `${articleTitle} | Akshay`,
          metaDescription: articleExcerpt,
          keywords: tags,
          canonicalUrl: `https://akshayblog.sapiexa.com/${articleSlug}`,
          aiSearchScore: 98,
        },
      };
      setArticles([newArticle, ...articles]);
      showToast('New article published to akshayblog.sapiexa.com!');
    }
    setIsEditingArticle(false);
  };

  // DELETE ARTICLE
  const handleDeleteArticle = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      showToast('Article deleted.');
    }
  };

  // OPEN NEW AFFILIATE
  const handleOpenNewAffiliate = () => {
    setIsEditingAffiliate(true);
    setSelectedAffiliateId(null);
    setAffName('');
    setAffBrand('');
    setAffCategory('software');
    setAffPrice('₹');
    setAffOriginalPrice('');
    setAffDiscountCode('');
    setAffDiscountPercent('');
    setAffUrl('https://akshayblog.sapiexa.com/ref/');
    setAffSummary('');
    setAffProsText('Battle-tested in production\nHigh performance for tech creators');
  };

  // OPEN EDIT AFFILIATE
  const handleOpenEditAffiliate = (item: AffiliateItem) => {
    setIsEditingAffiliate(true);
    setSelectedAffiliateId(item.id);
    setAffName(item.name);
    setAffBrand(item.brand);
    setAffCategory(item.category);
    setAffPrice(item.price);
    setAffOriginalPrice(item.originalPrice || '');
    setAffDiscountCode(item.discountCode || '');
    setAffDiscountPercent(item.discountPercent || '');
    setAffUrl(item.affiliateUrl);
    setAffSummary(item.summary);
    setAffProsText(item.pros.join('\n'));
  };

  // SAVE AFFILIATE
  const handleSaveAffiliate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!affName || !affPrice) return;

    const pros = affProsText.split('\n').map((p) => p.trim()).filter(Boolean);

    if (selectedAffiliateId) {
      setAffAffiliateItemsUpdate: {
        setAffiliateItems((prev) =>
          prev.map((item) => {
            if (item.id !== selectedAffiliateId) return item;
            return {
              ...item,
              name: affName,
              brand: affBrand,
              category: affCategory,
              price: affPrice,
              originalPrice: affOriginalPrice || undefined,
              discountCode: affDiscountCode || undefined,
              discountPercent: affDiscountPercent || undefined,
              affiliateUrl: affUrl,
              summary: affSummary,
              pros,
            };
          })
        );
      }
      showToast('Affiliate item updated!');
    } else {
      const newItem: AffiliateItem = {
        id: `aff-${Date.now()}`,
        name: affName,
        brand: affBrand || 'Tech Partner',
        category: affCategory,
        price: affPrice,
        originalPrice: affOriginalPrice || undefined,
        discountCode: affDiscountCode || undefined,
        discountPercent: affDiscountPercent || undefined,
        affiliateUrl: affUrl,
        rating: 4.9,
        reviewsCount: 1,
        badge: 'Recommended by Akshay',
        image: affiliateItems[0]?.image || '',
        pros,
        cons: ['Limited time discount'],
        summary: affSummary || 'Curated recommendation in INR.',
        clicks: 0,
      };
      setAffiliateItems([newItem, ...affiliateItems]);
      showToast('Affiliate item created!');
    }
    setIsEditingAffiliate(false);
  };

  // DELETE AFFILIATE
  const handleDeleteAffiliate = (id: string) => {
    if (confirm('Delete this affiliate product?')) {
      setAffiliateItems((prev) => prev.filter((i) => i.id !== id));
      showToast('Affiliate item removed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-editorial font-bold text-stone-900 dark:text-stone-100">
                  Akshay's Blog Studio & Admin Control
                </h2>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                  ADMIN ACTIVE
                </span>
              </div>
              <p className="text-xs text-stone-500 font-mono">
                Full Page & Content Control · akshayblog.sapiexa.com (INR ₹ Engine)
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

        {/* Notification Toast */}
        {successToast && (
          <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between transition-all">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast(null)} className="cursor-pointer">✕</button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-stone-200 dark:border-stone-800 overflow-x-auto text-xs font-medium scrollbar-none">
          <button
            onClick={() => {
              setActiveTab('articles');
              setIsEditingArticle(false);
            }}
            className={`px-3 py-2 border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'articles'
                ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Manage Articles ({articles.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('affiliates');
              setIsEditingAffiliate(false);
            }}
            className={`px-3 py-2 border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'affiliates'
                ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Affiliate Deals (INR ₹)</span>
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`px-3 py-2 border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ads'
                ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Ad Units & Placements</span>
          </button>
          <button
            onClick={() => setActiveTab('site')}
            className={`px-3 py-2 border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'site'
                ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Site Identity & Settings</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700 dark:text-stone-300">
          {/* TAB 1: ARTICLES */}
          {activeTab === 'articles' && (
            <div>
              {isEditingArticle ? (
                /* Article Form (Create or Edit) */
                <form onSubmit={handleSaveArticle} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {selectedArticleId ? 'Edit Article Content' : 'Compose New Blog Post'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingArticle(false)}
                      className="text-stone-500 hover:text-stone-800 cursor-pointer"
                    >
                      Back to list
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium mb-1">Headline / Title</label>
                      <input
                        type="text"
                        required
                        value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}
                        placeholder="e.g. Next-Gen Full-Stack AI in India"
                        className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">URL Slug</label>
                      <input
                        type="text"
                        required
                        value={articleSlug}
                        onChange={(e) => setArticleSlug(e.target.value)}
                        placeholder="e.g. next-gen-ai-india-2026"
                        className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 font-mono text-stone-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Subtitle / Editorial Hook</label>
                    <input
                      type="text"
                      value={articleSubtitle}
                      onChange={(e) => setArticleSubtitle(e.target.value)}
                      placeholder="A comprehensive breakdown for software engineers..."
                      className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-medium mb-1">Category</label>
                      <select
                        value={articleCategory}
                        onChange={(e: any) => setArticleCategory(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                      >
                        <option value="AI & Engineering">AI & Engineering</option>
                        <option value="Creator Hardware">Creator Hardware</option>
                        <option value="Monetization">Monetization</option>
                        <option value="Architecture">Architecture</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Estimated Read Time</label>
                      <input
                        type="text"
                        value={articleReadTime}
                        onChange={(e) => setArticleReadTime(e.target.value)}
                        placeholder="e.g. 7 min read"
                        className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={articleTagsText}
                        onChange={(e) => setArticleTagsText(e.target.value)}
                        placeholder="AI, TypeScript, React"
                        className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Meta Excerpt / Short Summary</label>
                    <textarea
                      rows={2}
                      required
                      value={articleExcerpt}
                      onChange={(e) => setArticleExcerpt(e.target.value)}
                      placeholder="Brief excerpt displayed on search cards and feed..."
                      className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                    />
                  </div>

                  {/* YouTube Companion Option */}
                  <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-950 bg-red-50/30 dark:bg-red-950/20 space-y-2">
                    <div className="flex items-center gap-2 text-red-600 font-semibold">
                      <Youtube className="w-4 h-4" />
                      <span>YouTube Video Companion Integration</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] mb-1">Companion Video Title (optional)</label>
                        <input
                          type="text"
                          value={articleYtTitle}
                          onChange={(e) => setArticleYtTitle(e.target.value)}
                          placeholder="e.g. Live Walkthrough & Code Demo"
                          className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] mb-1">Video Duration</label>
                        <input
                          type="text"
                          value={articleYtDuration}
                          onChange={(e) => setArticleYtDuration(e.target.value)}
                          placeholder="e.g. 21:40"
                          className="w-full p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">
                      AI Search Key Takeaways (One per line for LLM citations)
                    </label>
                    <textarea
                      rows={3}
                      value={articleKeyTakeawaysText}
                      onChange={(e) => setArticleKeyTakeawaysText(e.target.value)}
                      placeholder="Key takeaway 1&#10;Key takeaway 2&#10;Key takeaway 3"
                      className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 font-mono text-xs text-stone-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">
                      Full Article Body Prose (Separate paragraphs with double enter)
                    </label>
                    <textarea
                      rows={8}
                      required
                      value={articleContentText}
                      onChange={(e) => setArticleContentText(e.target.value)}
                      placeholder="Write your article content here. Use ### for subheadings..."
                      className="w-full p-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 font-sans text-xs leading-relaxed text-stone-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingArticle(false)}
                      className="px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{selectedArticleId ? 'Save Modifications' : 'Publish Article'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Article Table & List */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        Published Blog Articles ({articles.length})
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Create, update, or remove publications rendered on <code>akshayblog.sapiexa.com</code>
                      </p>
                    </div>
                    <button
                      onClick={handleOpenNewArticle}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold text-xs cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Blog Post</span>
                    </button>
                  </div>

                  <div className="rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 font-medium">
                        <tr>
                          <th className="p-3">Title & Category</th>
                          <th className="p-3 hidden sm:table-cell">Published</th>
                          <th className="p-3">Reads</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 dark:border-stone-800">
                        {articles.map((art) => (
                          <tr key={art.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                            <td className="p-3">
                              <p className="font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                                {art.title}
                              </p>
                              <p className="text-[11px] text-stone-500 font-mono">
                                /{art.slug} · <span className="font-sans">{art.category}</span>
                              </p>
                            </td>
                            <td className="p-3 hidden sm:table-cell text-stone-500 font-mono text-[11px]">
                              {art.publishedAt}
                            </td>
                            <td className="p-3 font-mono text-stone-700 dark:text-stone-300 tabular-nums">
                              {art.views.toLocaleString()}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditArticle(art)}
                                  className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 cursor-pointer"
                                  title="Edit Article"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteArticle(art.id)}
                                  className="p-1.5 rounded hover:bg-red-100 text-red-600 cursor-pointer"
                                  title="Delete Article"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AFFILIATES (INR ₹) */}
          {activeTab === 'affiliates' && (
            <div>
              {isEditingAffiliate ? (
                /* Affiliate Form */
                <form onSubmit={handleSaveAffiliate} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {selectedAffiliateId ? 'Edit Affiliate Item' : 'Add New Affiliate Deal (INR ₹)'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingAffiliate(false)}
                      className="text-stone-500 hover:text-stone-800 cursor-pointer"
                    >
                      Back to list
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium mb-1">Product Name</label>
                      <input
                        type="text"
                        required
                        value={affName}
                        onChange={(e) => setAffName(e.target.value)}
                        placeholder="e.g. Sony A7 IV Camera"
                        className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Brand / Company</label>
                      <input
                        type="text"
                        value={affBrand}
                        onChange={(e) => setAffBrand(e.target.value)}
                        placeholder="e.g. Sony India"
                        className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-medium mb-1">Price in INR (₹)</label>
                      <input
                        type="text"
                        required
                        value={affPrice}
                        onChange={(e) => setAffPrice(e.target.value)}
                        placeholder="e.g. ₹34,990"
                        className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 font-mono text-stone-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Original Price (optional)</label>
                      <input
                        type="text"
                        value={affOriginalPrice}
                        onChange={(e) => setAffOriginalPrice(e.target.value)}
                        placeholder="e.g. ₹39,500"
                        className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 font-mono text-stone-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Category</label>
                      <select
                        value={affCategory}
                        onChange={(e: any) => setAffCategory(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                      >
                        <option value="hardware">Hardware & Cameras</option>
                        <option value="audio">Audio & Microphones</option>
                        <option value="software">Software & AI Tools</option>
                        <option value="workspace">Desk & Workspace</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium mb-1">Coupon / Discount Code</label>
                      <input
                        type="text"
                        value={affDiscountCode}
                        onChange={(e) => setAffDiscountCode(e.target.value)}
                        placeholder="e.g. AKSHAYDEV"
                        className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 font-mono font-bold text-stone-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Discount Tag (e.g. 20% OFF or ₹2,000 OFF)</label>
                      <input
                        type="text"
                        value={affDiscountPercent}
                        onChange={(e) => setAffDiscountPercent(e.target.value)}
                        placeholder="e.g. 20% OFF"
                        className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Partner Affiliate URL</label>
                    <input
                      type="text"
                      required
                      value={affUrl}
                      onChange={(e) => setAffUrl(e.target.value)}
                      placeholder="https://akshayblog.sapiexa.com/ref/item"
                      className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 font-mono text-stone-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Why Akshay Recommends It (Review Summary)</label>
                    <textarea
                      rows={2}
                      value={affSummary}
                      onChange={(e) => setAffSummary(e.target.value)}
                      placeholder="Explain the workflow benefits..."
                      className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Top Pros / Highlights (One per line)</label>
                    <textarea
                      rows={2}
                      value={affProsText}
                      onChange={(e) => setAffProsText(e.target.value)}
                      placeholder="Pro 1&#10;Pro 2"
                      className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 font-mono text-stone-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingAffiliate(false)}
                      className="px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold cursor-pointer"
                    >
                      Save Affiliate Item
                    </button>
                  </div>
                </form>
              ) : (
                /* Affiliate List */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        Curated Affiliate Catalog (Indian Currency ₹)
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        All items render with FTC compliance notices and interactive coupon copy widgets
                      </p>
                    </div>
                    <button
                      onClick={handleOpenNewAffiliate}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold text-xs cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Affiliate Deal</span>
                    </button>
                  </div>

                  <div className="rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 font-medium">
                        <tr>
                          <th className="p-3">Product & Brand</th>
                          <th className="p-3">Price (INR)</th>
                          <th className="p-3 hidden sm:table-cell">Coupon Code</th>
                          <th className="p-3">Clicks</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 dark:border-stone-800">
                        {affiliateItems.map((item) => (
                          <tr key={item.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                            <td className="p-3">
                              <p className="font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-stone-500 font-mono">
                                {item.brand} · <span className="capitalize">{item.category}</span>
                              </p>
                            </td>
                            <td className="p-3 font-mono font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                              {item.price}
                            </td>
                            <td className="p-3 hidden sm:table-cell font-mono text-[11px] text-emerald-600 font-bold">
                              {item.discountCode || '—'}
                            </td>
                            <td className="p-3 font-mono tabular-nums text-stone-600 dark:text-stone-300">
                              {item.clicks}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditAffiliate(item)}
                                  className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 cursor-pointer"
                                  title="Edit Item"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAffiliate(item.id)}
                                  className="p-1.5 rounded hover:bg-red-100 text-red-600 cursor-pointer"
                                  title="Delete Item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADS CONTROL */}
          {activeTab === 'ads' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Ad Placements & Monetization Controls (INR ₹)
                </h3>
                <p className="text-[11px] text-stone-500">
                  Toggle banner slots between Google AdSense and high-ticket direct sponsors
                </p>
              </div>

              <div className="space-y-3">
                {adUnits.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                          {u.name}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          {u.size}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                        Headline: "{u.headline}"
                      </p>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-stone-500 mt-1">
                        <span>Impressions: {u.impressions.toLocaleString()}</span>
                        <span>·</span>
                        <span>Clicks: {u.clicks}</span>
                        <span>·</span>
                        <span className="font-bold text-emerald-600">Revenue: {u.estimatedRevenue}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setAdUnits((prev) =>
                            prev.map((ad) =>
                              ad.id === u.id
                                ? { ...ad, type: ad.type === 'adsense' ? 'personal-sponsor' : 'adsense' }
                                : ad
                            )
                          );
                          showToast(`Switched ${u.name} to ${u.type === 'adsense' ? 'Personal Sponsor' : 'Google AdSense'}`);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-semibold cursor-pointer"
                      >
                        Mode: <span className="capitalize">{u.type}</span>
                      </button>

                      <button
                        onClick={() => {
                          setAdUnits((prev) =>
                            prev.map((ad) =>
                              ad.id === u.id
                                ? { ...ad, status: ad.status === 'active' ? 'paused' : 'active' }
                                : ad
                            )
                          );
                          showToast(`${u.name} is now ${u.status === 'active' ? 'Paused' : 'Active'}`);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-400'
                        }`}
                      >
                        {u.status === 'active' ? 'Active' : 'Paused'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SITE IDENTITY & SETTINGS */}
          {activeTab === 'site' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Global Configuration for akshayblog.sapiexa.com
                </h3>
                <p className="text-[11px] text-stone-500">
                  Manage primary domain bindings, creator social links, and currency standards
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-stone-400">Subdomain Route</span>
                  <p className="text-sm font-bold font-mono text-stone-900 dark:text-stone-100">
                    akshayblog.sapiexa.com
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Root apex domain: <code>sapiexa.com</code> (CNAME configured)
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-stone-400">Active Currency Standard</span>
                  <p className="text-sm font-bold font-mono text-emerald-600">
                    Indian Rupee (₹ - INR)
                  </p>
                  <p className="text-[11px] text-stone-500">
                    All rate cards, revenue reports & affiliate prices in ₹
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-stone-400">Creator Channel</span>
                  <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    BroSis Tech Tamil (@brosistech)
                  </p>
                  <p className="text-[11px] text-stone-500">
                    128K+ subscribers · Sapiexa Media
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-stone-400">Inquiry Router</span>
                  <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    antonyakshay7@gmail.com
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Direct recipient for 1-on-1 strategy & sponsor bookings
                  </p>
                </div>
              </div>

              {/* Master Passcode Protection Setting */}
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                        Master Owner Passkey (Restricted Strictly to Antony Akshay)
                      </h4>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      This private passkey protects the Admin Studio and ensures nobody else can edit your articles, YouTube data, or affiliate partnerships. Keep it confidential.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                  <div className="relative flex-1">
                    <input
                      type={showNewPasscode ? 'text' : 'password'}
                      value={newPasscode}
                      onChange={(e) => setNewPasscode(e.target.value)}
                      placeholder="Enter new private passkey..."
                      className="w-full pr-10 p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPasscode(!showNewPasscode)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                      title={showNewPasscode ? 'Hide passkey' : 'Show passkey'}
                    >
                      {showNewPasscode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newPasscode.trim()) return;
                      setAdminPasscode(newPasscode.trim());
                      try {
                        localStorage.setItem('akshay_admin_passcode', newPasscode.trim());
                      } catch {}
                      showToast('Owner passkey updated successfully!');
                    }}
                    className="px-4 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Update Passkey</span>
                  </button>
                </div>
              </div>

              {/* Reset to Factory Defaults */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-stone-900 dark:text-stone-100">Reset Content to Defaults</p>
                  <p className="text-[11px] text-stone-500">
                    Restores the initial high-quality articles, INR affiliate products, and ad units.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset all blog articles and affiliate items to default initial state?')) {
                      onResetToDefaults();
                      showToast('Content reset to default articles and gear.');
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg border border-red-300 dark:border-red-900 text-red-600 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Defaults</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="text-stone-500 font-mono">
              Signed in as Akshay (Owner)
            </span>
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="text-red-600 hover:underline font-semibold cursor-pointer"
            >
              Lock & Sign Out
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold cursor-pointer"
          >
            Close Studio Panel
          </button>
        </div>
      </div>
    </div>
  );
};
