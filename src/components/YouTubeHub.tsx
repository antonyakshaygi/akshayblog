import React, { useState } from 'react';
import { Youtube, Play, ExternalLink, Clock, Eye, CheckCircle, ArrowRight, Share2, Sparkles } from 'lucide-react';
import { YOUTUBE_FEATURED_VIDEOS, AUTHOR_PROFILE } from '../data/blogData';
import { Article } from '../types/blog';

interface YouTubeHubProps {
  onSelectArticle: (article: Article) => void;
  onOpenConsultationModal: () => void;
}

export const YouTubeHub: React.FC<YouTubeHubProps> = ({
  onSelectArticle,
  onOpenConsultationModal,
}) => {
  const [selectedVideo, setSelectedVideo] = useState(YOUTUBE_FEATURED_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-8 max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-red-600 dark:text-red-400">
            <Youtube className="w-4 h-4" />
            <span>Official YouTube Channel · BroSis Tech Tamil (@brosistech)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Engineering, Tech Reviews & Tamil Tutorials
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-2xl">
            Every tech and software breakdown on BroSis Tech Tamil (@brosistech) is paired with full source code, Indian pricing benchmarks, and transparent gear recommendations here on akshayblog.sapiexa.com.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://youtube.com/@brosistech"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <Youtube className="w-4 h-4 fill-current" />
            <span>Subscribe on YouTube</span>
          </a>
          <button
            onClick={onOpenConsultationModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 hover:border-stone-400 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <span>Sponsor Video</span>
          </button>
        </div>
      </div>

      {/* Featured Video Cinema Spotlight */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Video Player Display Container */}
          <div className="lg:col-span-8 relative aspect-16/9 bg-stone-950 flex items-center justify-center">
            {isPlaying ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-white bg-stone-900">
                <Youtube className="w-16 h-16 text-red-600 animate-pulse mb-3" />
                <h3 className="text-lg font-bold">{selectedVideo.title}</h3>
                <p className="text-xs text-stone-400 mt-2 max-w-md">
                  Simulating high-definition 4K playback. In production, this embeds the direct YouTube video player.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-xs text-white cursor-pointer"
                  >
                    Pause Video
                  </button>
                  <a
                    href="https://youtube.com/@brosistech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-xs text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>Watch on YouTube App</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={selectedVideo.thumbnail}
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-stone-950/30 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform cursor-pointer"
                    aria-label="Play video"
                  >
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 bg-stone-900/90 text-white text-[11px] font-mono px-2 py-0.5 rounded">
                  {selectedVideo.duration}
                </div>
              </>
            )}
          </div>

          {/* Video Metadata & Companion Links */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                <span>{selectedVideo.views} views</span>
                <span>·</span>
                <span>{selectedVideo.uploadDate}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-editorial font-bold text-stone-900 dark:text-stone-100 leading-snug">
                {selectedVideo.title}
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {selectedVideo.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedVideo.tags.map((tag) => (
                  <span key={tag} className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
              <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">Companion Written Article</p>
              <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">No companion article is published yet. New articles added by the editor will appear in the Articles section.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-editorial font-bold text-stone-900 dark:text-stone-100">
          Recent Channel Uploads & Tutorials
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {YOUTUBE_FEATURED_VIDEOS.map((video) => {
            const isSelected = selectedVideo.id === video.id;
            return (
              <div
                key={video.id}
                onClick={() => {
                  setSelectedVideo(video);
                  setIsPlaying(false);
                }}
                className={`group cursor-pointer rounded-xl border p-3 flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-red-500 bg-red-50/20 dark:bg-red-950/20 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 hover:border-stone-400'
                }`}
              >
                <div>
                  <div className="relative rounded-lg overflow-hidden aspect-16/9 bg-stone-100 dark:bg-stone-800 mb-2.5">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                    />
                    <div className="absolute bottom-1.5 right-1.5 bg-stone-900/90 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                      {video.duration}
                    </div>
                  </div>

                  <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                    {video.title}
                  </h4>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono pt-3 mt-2 border-t border-stone-100 dark:border-stone-800/80">
                  <span>{video.views} views</span>
                  <span>{video.uploadDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
