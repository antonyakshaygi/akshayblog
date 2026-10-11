import React, { useState } from 'react';
import { Mail, Check, Send, Sparkles, Youtube, DollarSign, Calendar } from 'lucide-react';
import { AUTHOR_PROFILE } from '../data/blogData';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const [inquiryType, setInquiryType] = useState<'consultation' | 'youtube-sponsor' | 'blog-ad'>('consultation');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [budget, setBudget] = useState('₹40,000 - ₹90,000');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-lg w-full p-6 space-y-5 border border-stone-200 dark:border-stone-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
          <div>
            <h3 className="text-base font-editorial font-bold text-stone-900 dark:text-stone-100">
              Work with Akshay · Sapiexa Media
            </h3>
            <p className="text-xs text-stone-500">
              Direct inquiries dispatched to <code>{AUTHOR_PROFILE.email}</code>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Inquiry Dispatched Successfully!
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 max-w-sm mx-auto">
              Thank you {name || 'Partner'}. Akshay personally reviews all inquiries within 24 hours. A confirmation has been routed to <code>{AUTHOR_PROFILE.email}</code>.
            </p>
            <div className="pt-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Inquiry Type Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
              <button
                type="button"
                onClick={() => setInquiryType('consultation')}
                className={`py-1.5 px-2 rounded-lg text-center font-medium transition-colors cursor-pointer ${
                  inquiryType === 'consultation'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                1-on-1 Strategy
              </button>
              <button
                type="button"
                onClick={() => setInquiryType('youtube-sponsor')}
                className={`py-1.5 px-2 rounded-lg text-center font-medium transition-colors cursor-pointer ${
                  inquiryType === 'youtube-sponsor'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                YouTube Sponsor
              </button>
              <button
                type="button"
                onClick={() => setInquiryType('blog-ad')}
                className={`py-1.5 px-2 rounded-lg text-center font-medium transition-colors cursor-pointer ${
                  inquiryType === 'blog-ad'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                Personal Blog Ad
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Business Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Brand / Organization
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. ScaleTech AI"
                  className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Budget Allocation
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                >
                  <option value="₹35,000 - ₹50,000">₹35,000 – ₹50,000 (Blog Ad Slot)</option>
                  <option value="₹90,000 - ₹2,00,000">₹90,000 – ₹2,00,000 (Video Sponsor)</option>
                  <option value="₹2,00,000+">₹2,00,000+ (Full Campaign & Strategy)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                Project Details / Objectives
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your timeline, goals, or desired placement..."
                className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white leading-relaxed"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-stone-500 font-mono">
                Direct: {AUTHOR_PROFILE.email}
              </span>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
