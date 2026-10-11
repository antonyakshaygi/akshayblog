import { Article, AdUnit, AffiliateItem } from '../types/blog';

// Imported generated assets
import heroImage from '../assets/images/hero_akshay_creator_1791698320547.jpg';
import aiDevImage from '../assets/images/article_ai_dev_1791698333800.jpg';
import creatorGearImage from '../assets/images/article_creator_gear_1791698346422.jpg';
import monetizationImage from '../assets/images/article_monetization_1791698359767.jpg';

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
    subscribers: '128K+',
    monthlyViews: '1.4M+'
  }
};

export const INITIAL_AFFILIATE_ITEMS: AffiliateItem[] = [
  {
    id: 'aff-sony-camera',
    name: 'Sony Alpha A7 IV Full-Frame Camera',
    brand: 'Sony India',
    category: 'hardware',
    price: '₹2,14,990',
    originalPrice: '₹2,29,990',
    discountCode: 'AKSHAYSONY',
    discountPercent: '₹15,000 OFF',
    affiliateUrl: 'https://akshayblog.sapiexa.com/ref/sony-a7iv',
    rating: 4.9,
    reviewsCount: 1420,
    badge: 'Akshay Daily Driver',
    image: creatorGearImage,
    pros: [
      'Stunning 33MP sensor with 10-bit 4:2:2 4K video recording',
      'Class-leading real-time eye autofocus for solo tech creators',
      'Clean HDMI output directly into Elgato Cam Link 4K'
    ],
    cons: [
      'Slight 1.5x crop when recording in 4K 60fps',
      'Menus require initial configuration time'
    ],
    summary: 'The primary camera behind every 4K video on BroSis Tech Tamil (@brosistech). Razor sharp focus and unmatched color science for tech studio recordings.',
    clicks: 842
  },
  {
    id: 'aff-shure-sm7b',
    name: 'Shure SM7B Cardioid Studio Microphone',
    brand: 'Shure',
    category: 'audio',
    price: '₹34,990',
    originalPrice: '₹39,500',
    discountCode: 'SAPIEXAAUDIO',
    discountPercent: '₹4,510 OFF',
    affiliateUrl: 'https://akshayblog.sapiexa.com/ref/shure-sm7b',
    rating: 4.95,
    reviewsCount: 3890,
    badge: 'Studio Standard',
    image: creatorGearImage,
    pros: [
      'Legendary radio-broadcast warmth and vocal presence',
      'Built-in electromagnetic shielding eliminates PC & inverter hum',
      'Rejects off-axis room echo and mechanical keyboard clicks'
    ],
    cons: [
      'Low output gain: Requires Cloudlifter CL-1 or high-gain audio interface'
    ],
    summary: 'The gold standard microphone used on every podcast, code breakdown, and voiceover produced at Sapiexa.',
    clicks: 1205
  },
  {
    id: 'aff-cursor-pro',
    name: 'Cursor AI Intelligent Code Editor',
    brand: 'Anysphere',
    category: 'software',
    price: '₹1,699/month',
    originalPrice: '₹1,999/month',
    discountCode: 'AKSHAYDEV',
    discountPercent: '20% OFF',
    affiliateUrl: 'https://akshayblog.sapiexa.com/ref/cursor-ai',
    rating: 4.9,
    reviewsCount: 890,
    badge: 'Essential AI Dev Tool',
    image: aiDevImage,
    pros: [
      'Multi-file codebase indexing and agentic prompt execution',
      'Understands complex full-stack repos in seconds',
      '10x faster refactoring and TypeScript bug resolution'
    ],
    cons: [
      'Requires subscription for unlimited Opus and Claude 3.5 queries'
    ],
    summary: 'How I ship client projects and YouTube open-source code in hours instead of days. An indispensable engineering co-pilot.',
    clicks: 2130
  },
  {
    id: 'aff-keychron-q1',
    name: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    brand: 'Keychron India',
    category: 'workspace',
    price: '₹16,499',
    originalPrice: '₹18,999',
    discountCode: 'SAPIEXAKEYS',
    discountPercent: '₹2,500 OFF',
    affiliateUrl: 'https://akshayblog.sapiexa.com/ref/keychron-q1',
    rating: 4.8,
    reviewsCount: 740,
    badge: 'Creator Ergonomics',
    image: creatorGearImage,
    pros: [
      'CNC aluminum body with double-gasket acoustic dampening',
      'Hot-swappable switches with Bluetooth 5.1 & Type-C',
      'Programmable rotary encoder knob for timeline scrubbing'
    ],
    cons: [
      'Heavy solid metal frame not intended for frequent travel'
    ],
    summary: 'Custom tuned tactile switches paired with a satisfying deep acoustic profile for 10-hour coding and editing marathons.',
    clicks: 650
  }
];

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

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'article-1',
    slug: 'autonomous-ai-workflows-2026',
    title: 'Building Autonomous Full-Stack AI Workflows in 2026: From Prompt to Cloud Run',
    subtitle: 'A practical blueprint for software engineers orchestrating LLM tool calling, persistent state, and serverless deployment.',
    excerpt: 'How we build end-to-end autonomous applications that execute real database migrations, compile without human intervention, and scale to thousands of concurrent users.',
    coverImage: aiDevImage,
    category: 'AI & Engineering',
    tags: ['Artificial Intelligence', 'TypeScript', 'Full-Stack', 'Cloud Run', 'Architecture'],
    readTime: '8 min read',
    publishedAt: 'October 8, 2026',
    updatedAt: 'October 10, 2026',
    author: {
      name: 'Akshay',
      role: 'Tech Lead @ Sapiexa',
      avatar: heroImage,
      bio: 'Software architect, YouTuber, and founder of Sapiexa Media.'
    },
    youtubeCompanion: {
      videoId: 'ai-workflows-demo-2026',
      title: 'Full Video Tutorial: Building Autonomous AI Workflows Live with Akshay',
      duration: '24:18',
      uploadDate: '2026-10-07',
      viewCount: '48.2K views',
      thumbnailUrl: aiDevImage,
      transcriptSummary: 'In this complete walkthrough, Akshay demonstrates how to wire tool-calling models with Express TypeScript backend, setup secure client headers, and deploy containerized apps to Google Cloud Run with zero cold-start latency.',
      timestamps: [
        { time: '00:00', title: 'Architecture Overview & Flow Diagram' },
        { time: '04:15', title: 'Configuring Gemini 2.5/3.0 Tool Declarations' },
        { time: '11:30', title: 'Handling State & Database Idempotency' },
        { time: '18:45', title: 'Automated CI/CD Deployment to Cloud Run' },
        { time: '22:10', title: 'Real-world Performance & Cost Benchmark' }
      ]
    },
    keyTakeaways: [
      'Separation of reasoning and execution layers prevents hallucination cascades in production AI systems.',
      'Always implement strict JSON schemas with Zod or TypeScript interfaces rather than relying on unstructured text prompts.',
      'Server-side proxy routes protect sensitive API tokens while preventing CORS bottlenecks in containerized environments.',
      'Tool declarations must be atomic, idempotent, and include explicit error recovery boundaries.'
    ],
    faqs: [
      {
        question: 'What models are best suited for multi-turn autonomous tool execution?',
        answer: 'Modern reasoning models such as Gemini 2.5 Flash and Claude 3.5 Sonnet provide the lowest latency-to-accuracy ratio for structured tool-calling in web applications.'
      },
      {
        question: 'How do you secure API secrets in customer-facing web apps?',
        answer: 'Never expose API keys in client-side bundles. Always proxy requests through a Node.js/Express backend service running in an authenticated container.'
      },
      {
        question: 'Is serverless Cloud Run cost-effective for solo creators and dev blogs in India?',
        answer: 'Yes, Google Cloud Run offers scale-to-zero capabilities with a generous free tier of 2 million requests per month, making it exceptionally economical for technical blogs with minimal hosting costs.'
      }
    ],
    content: [
      'The transition from chat-based interfaces to truly autonomous workflow orchestrators is the single most significant architectural paradigm shift in modern web development.',
      'Over the past year at Sapiexa, we redesigned our core application stack to treat generative models not as text conversationalists, but as deterministic function orchestrators capable of querying typed databases, compiling frontends, and self-correcting syntax anomalies in real time.',
      '### The Three Core Layers of a Robust AI Architecture',
      'When engineering an autonomous system, you must enforce a strict separation between three domains:\n1. **The Reasoning Engine**: The model interpreting goals and emitting structured tool calls.\n2. **The Execution Sandbox**: The isolated runtime environment executing bash scripts, file mutations, or SQL queries.\n3. **The State Verifier**: An automated test or compilation gate that validates the output before declaring the task complete.',
      '```typescript\n// Example: Declarative Tool Calling Contract in TypeScript\nexport const databaseMigrationTool = {\n  name: "apply_database_migration",\n  description: "Applies idempotent schema migration to Postgres",\n  parameters: {\n    type: "OBJECT",\n    properties: {\n      migrationVersion: { type: "STRING" },\n      dryRun: { type: "BOOLEAN" }\n    },\n    required: ["migrationVersion"]\n  }\n};\n```',
      '### Eliminating Hallucination through Verification Loops',
      'The cardinal sin of AI automation is blind trust. If a model generates code or config files, never deploy immediately. Instead, trigger an automated `compile_applet` or syntax linter. If errors occur, feed the exact compiler stdout back into the model context window. In our benchmarks, 88% of syntax discrepancies are resolved on the first auto-correction turn.',
      'Check out the companion YouTube video above where I walk through the full code repository line by line.'
    ],
    seo: {
      metaTitle: 'Building Autonomous Full-Stack AI Workflows (2026 Blueprint) | Akshay',
      metaDescription: 'Step-by-step technical guide to architecting autonomous LLM tool calling, TypeScript verification, and Cloud Run deployment. Includes companion video & code.',
      keywords: ['Autonomous AI', 'TypeScript', 'Tool Calling', 'Cloud Run', 'Sapiexa Media', 'Akshay Blog'],
      canonicalUrl: 'https://akshayblog.sapiexa.com/autonomous-ai-workflows-2026',
      aiSearchScore: 98
    },
    views: 14200,
    likes: 894
  },
  {
    id: 'article-2',
    slug: 'creator-studio-desk-setup-2026',
    title: 'My 2026 Creator Studio Setup: The Gear That Actually Makes Money',
    subtitle: 'An unfiltered breakdown of the cameras, microphones, lighting, and mechanical keyboards powering BroSis Tech Tamil (@brosistech).',
    excerpt: 'After 3 years of tech YouTube creation and millions of views, here is the exact studio workstation setup, along with transparent affiliate links and discounts in Indian Rupees.',
    coverImage: creatorGearImage,
    category: 'Creator Hardware',
    tags: ['Desk Setup', 'Creator Hardware', 'Studio Gear', 'Audio', 'Affiliate'],
    readTime: '6 min read',
    publishedAt: 'October 4, 2026',
    updatedAt: 'October 9, 2026',
    author: {
      name: 'Akshay',
      role: 'Tech Creator & Founder',
      avatar: heroImage,
      bio: 'Software engineer and tech reviewer at Sapiexa.'
    },
    youtubeCompanion: {
      videoId: 'studio-desk-tour-2026',
      title: 'Desk Tour 2026: The Ultimate Engineer & Creator Workstation',
      duration: '18:42',
      uploadDate: '2026-10-02',
      viewCount: '76.4K views',
      thumbnailUrl: creatorGearImage,
      transcriptSummary: 'A cinematic desk tour revealing Akshay’s wire management techniques, monitor calibration, microphone processing chain, and mechanical keyboard modifications.',
      timestamps: [
        { time: '00:00', title: 'Why Minimalist Ergonomics Matter for High Output' },
        { time: '03:20', title: 'Camera & Overhead Rig: Sony A7 IV Setup' },
        { time: '07:50', title: 'Audio Chain: Shure SM7B + Preamp Settings' },
        { time: '12:15', title: 'Custom Mechanical Keyboard & Desk Accessories' },
        { time: '16:00', title: 'Full Cost Breakdown & ROI Analysis' }
      ]
    },
    keyTakeaways: [
      'Audio quality accounts for 70% of audience retention on technical YouTube channels.',
      'A dedicated boom arm with integrated cable channels prevents desk clutter and reduces vibration transfer.',
      'Natural side-lighting supplemented by a high-CRI softbox delivers flattering video without harsh facial glare.',
      'Always invest in equipment that saves post-production editing time (e.g. clean in-camera profiles, hardware limiters).'
    ],
    faqs: [
      {
        question: 'Do beginner creators in India need a full-frame camera like the Sony A7 IV?',
        answer: 'Not necessarily. A modern smartphone or an entry-level mirrorless camera (under ₹60,000) with good lighting is sufficient. Upgrade to full-frame once your channel generates steady monthly revenue.'
      },
      {
        question: 'Why choose the Shure SM7B over a USB condenser mic in Indian apartments?',
        answer: 'Dynamic microphones like the SM7B excel in untreated home offices because they reject ambient traffic noise, ceiling fan hum, and room reverb far better than sensitive condensers.'
      }
    ],
    content: [
      'When I began creating videos for Sapiexa in 2023, I made the classic amateur error: buying flashy RGB gadgets rather than dialing in core ergonomic fundamentals.',
      'Over the past 36 months, I refined my studio into a production machine designed for one purpose: enabling frictionless creation so I can record, edit, and publish technical breakdowns in a single afternoon.',
      '### 1. The Visual Core: Sony A7 IV with 24-70mm f/2.8 GM II (₹2,14,990)',
      'Your camera is your direct eye-contact bridge with your audience. The Sony A7 IV delivers uncompressed 10-bit color, allowing me to grade skin tones quickly without banding. Mounted on an Elgato Master Mount, it occupies zero desk real estate.',
      '### 2. Audio That Retains Viewers: Shure SM7B (₹34,990)',
      'Bad audio will make a viewer click off faster than 720p video. The Shure SM7B paired with a high-gain preamp gives that velvety broadcast tone that listeners find calming during 20-minute code walkthroughs.',
      '### 3. Tactile Feedback: Keychron Q1 Pro (₹16,499)',
      'As a developer who types 10,000 words of code and script every week, keyboard ergonomics directly impact wrist longevity. The double-gasket dampening provides crisp tactile response without finger fatigue.',
      '### Transparent Affiliate Disclosure',
      'All links below are affiliate links. If you purchase through them using our codes, you get exclusive discounts in INR and you help support free open-source software guides at Sapiexa.'
    ],
    seo: {
      metaTitle: 'Akshay’s 2026 Tech Creator Studio Desk Tour & Gear Guide | Sapiexa',
      metaDescription: 'Complete list of cameras, microphones, lighting, and mechanical keyboards used by Akshay for YouTube and engineering. Honest reviews & discount codes in INR.',
      keywords: ['Studio Desk Tour', 'Sony A7IV India', 'Shure SM7B', 'Tech Creator Setup', 'Sapiexa Gear'],
      canonicalUrl: 'https://akshayblog.sapiexa.com/creator-studio-desk-setup-2026',
      aiSearchScore: 96
    },
    views: 28900,
    likes: 1840
  },
  {
    id: 'article-3',
    slug: 'diversified-monetization-affiliate-playbook',
    title: 'How I Built ₹11,80,000/Month in Diversified Revenue via YouTube & Affiliate Systems',
    subtitle: 'The transparent financial playbook of a solo tech creator: AdSense, direct sponsorships, affiliate conversion funnels, and consulting.',
    excerpt: 'A zero-fluff financial breakdown of monthly creator earnings across 4 revenue streams in INR, with exact conversion metrics and sponsorship rate cards.',
    coverImage: monetizationImage,
    category: 'Monetization',
    tags: ['Affiliate Marketing', 'Creator Economy', 'YouTube Revenue', 'Sponsorships', 'Business'],
    readTime: '9 min read',
    publishedAt: 'September 28, 2026',
    updatedAt: 'October 6, 2026',
    author: {
      name: 'Akshay',
      role: 'Founder @ Sapiexa',
      avatar: heroImage,
      bio: 'Creator and engineer sharing open financial reports.'
    },
    youtubeCompanion: {
      videoId: 'creator-revenue-report-2026',
      title: 'Transparent Revenue Report: How Much My Tech Channel Made in 2026 (INR Breakdown)',
      duration: '21:05',
      uploadDate: '2026-09-26',
      viewCount: '62.8K views',
      thumbnailUrl: monetizationImage,
      transcriptSummary: 'Akshay shares screen recordings of his Google AdSense dashboard, Stripe/Razorpay payouts, Amazon & software affiliate reports, and outlines how to structure brand sponsorships.',
      timestamps: [
        { time: '00:00', title: 'Why Relying Only on YouTube AdSense is Risky' },
        { time: '04:10', title: 'Stream 1: YouTube AdSense (₹3,15,000/mo)' },
        { time: '08:30', title: 'Stream 2: High-Ticket Software Affiliates (₹4,30,000/mo)' },
        { time: '13:40', title: 'Stream 3: Direct Brand Sponsorships (₹2,95,000/mo)' },
        { time: '17:50', title: 'Stream 4: 1-on-1 Consulting & Custom Dev (₹1,40,000/mo)' }
      ]
    },
    keyTakeaways: [
      'Tech YouTube CPMs for global & Indian tech audiences range from ₹1,500–₹2,900 per 1K views, significantly higher than general entertainment niches.',
      'Recurring software affiliate commissions (SaaS tools) provide steady baseline revenue during months with fewer video uploads.',
      'Personal blog posts on akshayblog.sapiexa.com with optimized schema markup generate organic search traffic that converts at 3x higher rates than social feeds.',
      'Always disclose affiliate links clearly in accordance with regulatory guidelines to build long-term subscriber trust.'
    ],
    faqs: [
      {
        question: 'What is the highest converting affiliate category for tech creators?',
        answer: 'Developer tools and AI subscriptions (e.g. IDEs, cloud hosting, AI APIs) convert best because viewers immediately experience measurable productivity gains.'
      },
      {
        question: 'How do you pitch brands for direct video integrations?',
        answer: 'Send a concise 1-page media kit highlighting audience demographics, average 30-day view counts, and previous sponsor click-through rates rather than vanity follower counts.'
      }
    ],
    content: [
      'One of the greatest fallacies in the creator economy is that you need 1,000,000 subscribers to make a sustainable multi-lakh monthly income.',
      'In reality, specialized technical audiences in software engineering, AI, and developer tools have unusually high purchasing power and business intent. With 128,000 subscribers and 45,000 monthly blog visitors at `akshayblog.sapiexa.com`, our ecosystem generated **₹11,80,000 last month** across four distinct revenue streams.',
      '### Monthly Breakdown in Indian Rupees (Last 30 Days)',
      '1. **Software & Hardware Affiliates**: ₹4,30,000 (36.4%)\n2. **YouTube & Blog AdSense**: ₹3,15,000 (26.7%)\n3. **Direct Brand Video Sponsorships**: ₹2,95,000 (25.0%)\n4. **1-on-1 Architecture Strategy Consultations**: ₹1,40,000 (11.9%)',
      '### The Power of High-Intent Blog Articles',
      'While YouTube videos drive awareness and discovery, articles hosted on your own domain (such as `akshayblog.sapiexa.com`) capture high-intent search queries where readers are actively evaluating tools with buying intent.',
      'By pairing our articles with Schema.org Product markup, interactive discount code copy widgets, and structured comparisons, our average click-through-to-conversion rate exceeds 4.8%.'
    ],
    seo: {
      metaTitle: 'How I Built ₹11.8 Lakh/Mo with YouTube & Affiliate Marketing | Akshay',
      metaDescription: 'Transparent revenue report and monetization blueprint in INR from Akshay. Learn how to combine tech YouTube, affiliate funnels, and direct sponsorships.',
      keywords: ['Affiliate Marketing Playbook', 'YouTube Income Report INR', 'Tech Creator Revenue India', 'Sapiexa Media'],
      canonicalUrl: 'https://akshayblog.sapiexa.com/diversified-monetization-affiliate-playbook',
      aiSearchScore: 97
    },
    views: 34100,
    likes: 2450
  },
  {
    id: 'article-4',
    slug: 'next-gen-react-19-edge-architecture',
    title: 'React 19 & Next-Gen Edge Runtimes: Architectural Blueprint for Technical Blogs',
    subtitle: 'Why edge caching, zero-runtime CSS, and strict schema validation yield sub-100ms Largest Contentful Paint worldwide.',
    excerpt: 'Detailed performance benchmarks, Core Web Vitals optimization techniques, and structured data implementation for lightning-fast web publications.',
    coverImage: heroImage,
    category: 'Architecture',
    tags: ['React 19', 'Performance', 'Web Vitals', 'Edge Computing', 'SEO'],
    readTime: '7 min read',
    publishedAt: 'September 19, 2026',
    updatedAt: 'October 3, 2026',
    author: {
      name: 'Akshay',
      role: 'Full-Stack Engineer',
      avatar: heroImage,
      bio: 'Systems builder focusing on low-latency web interfaces.'
    },
    keyTakeaways: [
      'Edge CDN caching eliminates TTFB bottlenecks for Indian and global readers regardless of physical origin server distance.',
      'Zero-pill metadata and typographic hierarchy significantly reduce DOM node counts and improve render speeds.',
      'Preconnecting to critical Google Fonts resources prevents cumulative layout shift during initial paint.',
      'Valid JSON-LD schema markup enables rich snippet cards on Google SERPs without slowing down client hydration.'
    ],
    faqs: [
      {
        question: 'Does server-side rendering improve SEO over static pre-rendering for blogs?',
        answer: 'Static generation at edge with stale-while-revalidate caching provides the fastest possible time-to-first-byte while ensuring search engine crawlers always receive clean, complete HTML.'
      }
    ],
    content: [
      'Speed is not just a user experience feature; it is a direct search ranking factor and conversion multiplier.',
      'When building `akshayblog.sapiexa.com`, our objective was simple: deliver instantaneous page transitions, flawless Core Web Vitals, and effortless crawlability for both traditional search engines and emerging AI answer engines.',
      '### The Edge Delivery Stack',
      'By running on modern edge infrastructure with React 19 and Tailwind CSS v4, our asset bundle sizes remain compact and our Largest Contentful Paint averages under 420 milliseconds across Indian and international networks.',
      'Check out our live SEO and AI Search inspector in the top bar to inspect our exact JSON-LD payloads and meta tags in real time.'
    ],
    seo: {
      metaTitle: 'React 19 Edge Architecture for High-Traffic Tech Blogs | Akshay',
      metaDescription: 'Optimize Core Web Vitals, edge caching, and JSON-LD structured data for sub-100ms load times and top search engine rankings.',
      keywords: ['React 19', 'Edge Architecture', 'Web Vitals', 'Core Web Vitals', 'SEO Optimization'],
      canonicalUrl: 'https://akshayblog.sapiexa.com/next-gen-react-19-edge-architecture',
      aiSearchScore: 99
    },
    views: 19800,
    likes: 1210
  }
];

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
