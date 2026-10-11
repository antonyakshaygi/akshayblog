export interface MarketTicker {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  market: 'INDIAN' | 'US' | 'CRYPTO' | 'FOREX';
  volume?: string;
  high52w?: string;
}

export type NewsCategory = 
  | 'all'
  | 'ai-deep-tech' 
  | 'financial-markets' 
  | 'indian-tech' 
  | 'big-tech' 
  | 'macro-economy';

export interface MarketImpact {
  ticker?: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  changeEstimate?: string;
  reason: string;
}

export interface AiSeoMetadata {
  keyTakeaways: string[];
  geoSummary: string; // Generative Engine Optimization for AI Search / Perplexity
  targetKeywords: string[];
  readabilityScore: number;
  factChecked: boolean;
  confidenceScore: number;
  jsonLdSchema: Record<string, any>;
}

export interface NewsArticleItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  fullContent: string[];
  category: NewsCategory;
  publishedAt: string;
  publishedTimestamp: number;
  readTime: string;
  source: {
    name: string;
    domain: string;
    url?: string;
    isVerified: boolean;
  };
  marketImpact: MarketImpact;
  aiSeo: AiSeoMetadata;
  coverImage?: string;
  isBreaking?: boolean;
  isMorningLead?: boolean;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export interface ENewspaperEdition {
  id: string;
  editionDate: string;
  volumeIssue: string;
  publishedAt: string;
  publishedTimestamp: number;
  leadHeadline: string;
  leadSubhead: string;
  leadArticle: NewsArticleItem;
  marketSnapshot: MarketTicker[];
  aiAndTechTopStories: NewsArticleItem[];
  financialTopStories: NewsArticleItem[];
  indianEconomyTopStories: NewsArticleItem[];
  editorsBriefing: {
    author: string;
    role: string;
    title: string;
    paragraphs: string[];
    highlightQuote: string;
  };
  curatedCount: number;
  verifiedAt7AM: boolean;
}
