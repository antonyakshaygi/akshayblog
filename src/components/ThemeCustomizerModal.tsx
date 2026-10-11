import React from 'react';
import { Sliders, Sun, Moon, BookOpen, Check, Type, Eye } from 'lucide-react';
import { ThemeSettings } from '../types/blog';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ThemeSettings;
  updateSettings: (newSettings: Partial<ThemeSettings>) => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
  settings,
  updateSettings,
}) => {
  if (!isOpen) return null;

  const colorThemes = [
    {
      id: 'warm-paper',
      name: 'Warm Paper (Editorial)',
      description: 'Archival warm limestone & soft alabaster',
      bgClass: 'bg-[#fbf9f5] text-[#1c1917] border-stone-300',
    },
    {
      id: 'light',
      name: 'Clean Stark White',
      description: 'Contemporary gallery crisp white & deep ink',
      bgClass: 'bg-white text-stone-900 border-stone-200',
    },
    {
      id: 'dark',
      name: 'Dark Studio Slate',
      description: 'Low-fatigue dark slate for late-night reading',
      bgClass: 'bg-[#0f1115] text-[#f3f4f6] border-stone-800',
    },
  ];

  const fontSizes = [
    { id: 'sm', label: 'Compact', sample: '14px' },
    { id: 'md', label: 'Standard', sample: '16px' },
    { id: 'lg', label: 'Comfortable', sample: '18px' },
    { id: 'xl', label: 'Large Print', sample: '20px' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full p-6 space-y-6 border border-stone-200 dark:border-stone-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-stone-700 dark:text-stone-300" />
            <h3 className="text-base font-editorial font-bold text-stone-900 dark:text-stone-100">
              Customize Reading & Theme
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Color Theme Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            Palette & Background Tone
          </label>
          <div className="space-y-2">
            {colorThemes.map((t) => {
              const isSelected = settings.mode === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => updateSettings({ mode: t.id as any })}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    t.bgClass
                  } ${isSelected ? 'ring-2 ring-stone-900 dark:ring-white shadow-sm' : 'opacity-85 hover:opacity-100'}`}
                >
                  <div>
                    <p className="text-xs font-bold">{t.name}</p>
                    <p className="text-[11px] opacity-75">{t.description}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Size Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            Typographic Scale
          </label>
          <div className="grid grid-cols-4 gap-2">
            {fontSizes.map((f) => {
              const isSelected = settings.fontSize === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => updateSettings({ fontSize: f.id as any })}
                  className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-stone-900 dark:border-white bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold'
                      : 'border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs'
                  }`}
                >
                  <p className="text-xs">{f.label}</p>
                  <p className="text-[10px] opacity-60 font-mono mt-0.5">{f.sample}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reading Column Width */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            Reading Column Measure
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => updateSettings({ readingWidth: 'standard' })}
              className={`p-2.5 rounded-xl border text-center cursor-pointer ${
                settings.readingWidth === 'standard'
                  ? 'border-stone-900 dark:border-white bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold'
                  : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              Focused (65ch)
            </button>
            <button
              onClick={() => updateSettings({ readingWidth: 'relaxed' })}
              className={`p-2.5 rounded-xl border text-center cursor-pointer ${
                settings.readingWidth === 'relaxed'
                  ? 'border-stone-900 dark:border-white bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold'
                  : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              Wide (80ch)
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
