export interface YouTubeCompanion {
  videoId: string;
  title: string;
  duration: string;
  uploadDate: string;
  viewCount: string;
  thumbnailUrl?: string;
  transcriptSummary: string;
  timestamps: Array<{ time: string; title: string }>;
}

export interface StructuredFaq {
  question: string;
  answer: string;
}

export interface AffiliateItem {
  id: string;
  name: string;
  brand: string;
  category: 'hardware' | 'software' | 'audio' | 'workspace';
  price: string;
  originalPrice?: string;
  discountCode?: string;
  discountPercent?: string;
  affiliateUrl: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  image?: string;
  pros: string[];
  cons: string[];
  summary: string;
  clicks: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string[];
  category: 'AI & Engineering' | 'Creator Hardware' | 'Monetization' | 'Architecture';
  tags: string[];
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  youtubeCompanion?: YouTubeCompanion;
  affiliateItems?: AffiliateItem[];
  faqs?: StructuredFaq[];
  keyTakeaways: string[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl: string;
    aiSearchScore: number;
  };
  views: number;
  likes: number;
  bookmarked?: boolean;
}

export interface AdUnit {
  id: string;
  name: string;
  placement: 'header-leaderboard' | 'in-article-banner' | 'sidebar-sticky' | 'footer-banner';
  size: '728x90' | '300x250' | '300x600' | 'fluid';
  type: 'adsense' | 'personal-sponsor' | 'affiliate-feature';
  status: 'active' | 'paused';
  impressions: number;
  clicks: number;
  estimatedRevenue: string;
  advertiserName: string;
  targetUrl: string;
  headline: string;
  description: string;
  ctaText: string;
}

export interface ThemeSettings {
  mode: 'warm-paper' | 'dark' | 'light';
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  accentColor: 'terracotta' | 'indigo' | 'emerald' | 'amber' | 'neutral';
  readingWidth: 'standard' | 'relaxed';
}
