import { Article, AdUnit, AffiliateItem } from '../types/blog';

// Imported generated assets
import heroImage from '../assets/images/hero_akshay_creator_1791698320547.jpg';
import aiDevImage from '../assets/images/article_ai_dev_1791698333800.jpg';
import creatorGearImage from '../assets/images/article_creator_gear_1791698346422.jpg';
import monetizationImage from '../assets/images/article_monetization_1791698359767.jpg';
import ipad11Image from '../assets/images/article_ipad_11_review_1791711245210.jpg';

export const AUTHOR_PROFILE = {
  name: 'Akshay',
  role: 'Founder & Tech Creator · BroSis Tech Tamil',
  brand: 'Sapiexa Media',
  domain: 'akshayblog.sapiexa.com',
  parentDomain: 'sapiexa.com',
  email: 'antonyakshay7@gmail.com',
  avatar: heroImage,
  bio: 'Host of BroSis Tech Tamil (@brosistech) & engineer at Sapiexa. Building autonomous software, reviewing creator hardware, and sharing transparent monetization frameworks.',
  socials: {
    youtube: 'https://youtube.com/@brosistech',
    youtubeHandle: '@brosistech',
    channelName: 'BroSis Tech Tamil',
    twitter: 'https://twitter.com/akshay_sapiexa',
    github: 'https://github.com/akshay',
  }
};

// Existing affiliate demo listings intentionally removed; do not seed old products.
export const INITIAL_AFFILIATE_ITEMS: AffiliateItem[] = [];

export const INITIAL_AD_UNITS: AdUnit[] = [
  {
    id: 'ad-header-leaderboard',
    name: 'Top Header Leaderboard (728x90)',
    placement: 'header-leaderboard',
    size: '728x90',
    type: 'personal-sponsor',
    status: 'active',
    impressions: 48920,
    clicks: 892,
    estimatedRevenue: '₹42,500',
    advertiserName: 'CloudScale Edge Hosting India',
    targetUrl: 'https://akshayblog.sapiexa.com/sponsor/cloudscale',
    headline: 'Deploy Autonomous Micro-Apps in 60 Seconds with CloudScale Edge',
    description: 'Instant Mumbai & global CDN, zero-config serverless PostgreSQL, and ₹15,000 free developer credits.',
    ctaText: 'Claim ₹15,000 Credits'
  },
  {
    id: 'ad-in-article-banner',
    name: 'In-Article Responsive Sponsor Slot',
    placement: 'in-article-banner',
    size: '300x250',
    type: 'personal-sponsor',
    status: 'active',
    impressions: 34100,
    clicks: 720,
    estimatedRevenue: '₹32,000',
    advertiserName: 'Sapiexa 1-on-1 Consultation',
    targetUrl: 'https://akshayblog.sapiexa.com/sponsor/consultation',
    headline: 'Book a 1-on-1 AI Architecture Strategy Session with Akshay',
    description: 'Personalized code reviews, YouTube creator growth blueprints, and monetization roadmaps.',
    ctaText: 'View Availability'
  },
  {
    id: 'ad-sidebar-sticky',
    name: 'Sidebar Sticky Ad (300x600)',
    placement: 'sidebar-sticky',
    size: '300x600',
    type: 'adsense',
    status: 'active',
    impressions: 51200,
    clicks: 1140,
    estimatedRevenue: '₹48,200',
    advertiserName: 'Google AdSense Network',
    targetUrl: 'https://google.com/adsense',
    headline: 'Optimized Responsive Ad Unit',
    description: 'Contextual high-CPM developer & creator advertisements served via Google AdSense auto-placement.',
    ctaText: 'Learn More'
  }
];

// Existing blog demo posts intentionally removed; new articles must be created explicitly.
export const INITIAL_ARTICLES: Article[] = [];

export const YOUTUBE_FEATURED_VIDEOS = [
  {
    id: 'yt-1',
    title: 'Building Autonomous AI Workflows from Scratch (Full Architecture)',
    duration: '24:18',
    views: '48,200',
    uploadDate: '3 days ago',
    thumbnail: aiDevImage,
    description: 'Learn how to connect reasoning models to typed databases and Cloud Run containers without hallucinations.',
    tags: ['AI Workflows', 'TypeScript', 'Cloud Run'],
    url: 'https://youtube.com/@brosistech'
  },
  {
    id: 'yt-2',
    title: 'Desk Tour 2026: The Ultimate Software Engineer & Creator Workstation',
    duration: '18:42',
    views: '76,400',
    uploadDate: '1 week ago',
    thumbnail: creatorGearImage,
    description: 'A deep dive into the Sony A7 IV camera rig, Shure SM7B audio chain, and custom mechanical keyboard.',
    tags: ['Desk Setup', 'Hardware', 'Audio'],
    url: 'https://youtube.com/@brosistech'
  },
  {
    id: 'yt-3',
    title: 'Transparent Creator Income: How I Made ₹11,80,000 Last Month in India',
    duration: '21:05',
    views: '62,800',
    uploadDate: '2 weeks ago',
    thumbnail: monetizationImage,
    description: 'Full revenue breakdown covering YouTube AdSense, software affiliate links, and brand partnerships in INR.',
    tags: ['Monetization', 'Affiliates', 'Business'],
    url: 'https://youtube.com/@brosistech'
  },
  {
    id: 'yt-4',
    title: 'React 19 + Edge Computing: Building High-Traffic Web Apps',
    duration: '16:30',
    views: '34,100',
    uploadDate: '3 weeks ago',
    thumbnail: heroImage,
    description: 'Benchmarking server components, edge caching, and Core Web Vitals for optimal user retention.',
    tags: ['React 19', 'Web Dev', 'Performance'],
    url: 'https://youtube.com/@brosistech'
  }
];
