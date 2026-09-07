import React from 'react';
import { BookOpen, Search, Upload, History, Moon, Sun, Scroll, ShieldCheck } from 'lucide-react';
import type { BookStats } from '../../shared/types.js';

interface NavbarProps {
  currentView: 'library' | 'workspace' | 'reader' | 'search';
  setCurrentView: (view: 'library' | 'workspace' | 'reader' | 'search') => void;
  stats: BookStats | null;
  theme: 'dark' | 'light' | 'sepia';
  setTheme: (theme: 'dark' | 'light' | 'sepia') => void;
  onOpenUpload: () => void;
  onOpenAudit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  stats,
  theme,
  setTheme,
  onOpenUpload,
  onOpenAudit,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          className="flex items-center space-x-3 cursor-pointer select-none group"
          onClick={() => setCurrentView('library')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sacred-600 to-maroon-700 flex items-center justify-center shadow-lg shadow-sacred-900/30 border border-sacred-400/40 group-hover:scale-105 transition-transform">
            <span className="text-2xl font-serifDevanagari font-bold text-amber-200">ॐ</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-wide text-neutral-100 font-devanagari">
                पूजा ग्रन्थ डिजिटाइज़र
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sacred-950 text-sacred-400 border border-sacred-800/80 font-mono font-medium">
                v1.0
              </span>
            </div>
            <p className="text-xs text-neutral-400">Puja Granth Digitizer • Sanskrit & Hindi Scripture Fidelity</p>
          </div>
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => setCurrentView('library')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === 'library'
                ? 'bg-sacred-600 text-white shadow-md shadow-sacred-900/20'
                : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline font-devanagari">ग्रंथालय</span>
            <span className="hidden md:inline text-xs text-neutral-300/80">(Library)</span>
          </button>

          <button
            onClick={() => setCurrentView('search')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === 'search'
                ? 'bg-sacred-600 text-white shadow-md shadow-sacred-900/20'
                : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline font-devanagari">खोजें</span>
            <span className="hidden md:inline text-xs text-neutral-300/80">(Search)</span>
          </button>

          <button
            onClick={onOpenAudit}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all"
            title="ऑडिट लॉग और संशोधन इतिहास (Audit Trail)"
          >
            <History className="w-4 h-4" />
            <span className="hidden lg:inline font-devanagari">इतिहास</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-sacred-600 to-maroon-600 hover:from-sacred-500 hover:to-maroon-500 text-white shadow-md shadow-sacred-950 border border-sacred-400/30 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span className="font-devanagari">नया ग्रन्थ</span>
          </button>

          {/* Theme Selector */}
          <div className="flex items-center bg-neutral-800/90 rounded-lg p-1 border border-neutral-700">
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                theme === 'dark' ? 'bg-neutral-700 text-amber-400 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Dark Mode"
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                theme === 'sepia' ? 'bg-parchment-300 text-parchment-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Parchment / Sepia Reading Mode"
            >
              <Scroll className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                theme === 'light' ? 'bg-neutral-200 text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Light Mode"
            >
              <Sun className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </div>

      {/* Global Scripture Fidelity Status Banner */}
      {stats && (
        <div className="bg-neutral-950/60 border-t border-neutral-800/60 px-4 py-1.5 text-xs text-neutral-400 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-emerald-400 space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>प्रमाणित स्रोत सत्यता (Source Authority Active)</span>
            </span>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span className="hidden sm:inline">
              कुल ग्रन्थ: <strong className="text-neutral-200">{stats.total_books}</strong>
            </span>
            <span className="hidden sm:inline">
              कुल पृष्ठ: <strong className="text-neutral-200">{stats.total_pages}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span>सत्यापन प्रगति:</span>
              <span className="font-semibold text-sacred-400">{stats.verification_percentage}%</span>
              <span className="text-neutral-500 text-[11px]">({stats.verified_pages}/{stats.total_pages})</span>
            </div>
            {stats.critical_issues > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[11px] font-medium">
                {stats.critical_issues} गंभीर समीक्षा
              </span>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
