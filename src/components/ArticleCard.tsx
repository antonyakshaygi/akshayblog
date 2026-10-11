import React from 'react';
import { Youtube, Clock, Eye, Heart, ArrowUpRight, Check, Tag } from 'lucide-react';
import { Article } from '../types/blog';

interface ArticleCardProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  featured?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelectArticle,
  featured = false,
}) => {
  return (
    <article
      onClick={() => onSelectArticle(article)}
      className={`group cursor-pointer flex flex-col justify-between rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900/50 hover:border-stone-400 dark:hover:border-stone-700 transition-all duration-200 overflow-hidden ${
        featured ? 'lg:col-span-2' : ''
      }`}
    >
      <div>
        {/* Cover Image Container */}
        <div className={`relative overflow-hidden bg-stone-100 dark:bg-stone-900 ${featured ? 'aspect-16/9 max-h-[380px]' : 'aspect-16/10'}`}>
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            referrerPolicy="no-referrer"
            loading="lazy"
          />

          {/* Clean overlay indicators */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {article.youtubeCompanion && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-medium tracking-tight">
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <span>Video Companion</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Content Area */}
        <div className="p-5 sm:p-6 space-y-3">
          {/* Zero-Pill Metadata Discipline */}
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <span className="font-medium text-stone-800 dark:text-stone-200">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
            <span aria-hidden="true">·</span>
            <span>{article.publishedAt}</span>
          </div>

          {/* Title */}
          <h2 className={`font-editorial font-bold text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors leading-tight ${
            featured ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-lg sm:text-xl'
          }`}>
            {article.title}
          </h2>

          {/* Subtitle / Excerpt */}
          <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>

          {/* Tags as clean unboxed text with # prefix or subtle typographic separator */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-stone-500 dark:text-stone-400">
            {article.tags.slice(0, 3).map((tag, idx) => (
              <span key={tag} className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer bar of card with author and action */}
      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <div className="flex items-center gap-2">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="font-medium text-stone-800 dark:text-stone-200">{article.author.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-mono tabular-nums">
            <Eye className="w-3.5 h-3.5" />
            {article.views.toLocaleString()}
          </span>
          <span className="flex items-center gap-1 text-stone-900 dark:text-stone-100 font-medium group-hover:translate-x-0.5 transition-transform">
            <span>Read</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
