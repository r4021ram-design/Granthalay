import React from 'react';
import { BookOpen, Search, Moon, Sun, Scroll, Sparkles, Flame } from 'lucide-react';

interface MobileBottomNavProps {
  currentView: 'library' | 'workspace' | 'reader' | 'search';
  setCurrentView: (view: 'library' | 'workspace' | 'reader' | 'search') => void;
  activeDarshan?: string;
  onSelectDarshan?: (darshan: 'stotra' | 'pujavidhi' | 'tantra' | 'veda-purana') => void;
  theme: 'dark' | 'light' | 'sepia';
  setTheme: (theme: 'dark' | 'light' | 'sepia') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  setCurrentView,
  activeDarshan = 'stotra',
  onSelectDarshan,
  theme,
  setTheme,
}) => {
  // If in Reader mode, the reader has its own dedicated liturgical page footer
  if (currentView === 'reader') {
    return null;
  }

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('sepia');
    else if (theme === 'sepia') setTheme('light');
    else setTheme('dark');
  };

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon className="w-5 h-5 text-amber-400" />;
    if (theme === 'sepia') return <Scroll className="w-5 h-5 text-amber-700" />;
    return <Sun className="w-5 h-5 text-amber-500" />;
  };

  const getThemeLabel = () => {
    if (theme === 'dark') return 'डार्क';
    if (theme === 'sepia') return 'भोजपत्र';
    return 'लाइट';
  };

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800/80 shadow-2xl pb-safe transition-all"
    >
      <div className="grid grid-cols-5 items-center justify-around px-1 py-1.5 text-center">
        {/* 1. ग्रन्थालय (All Library) */}
        <button
          type="button"
          onClick={() => {
            setCurrentView('library');
          }}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
            currentView === 'library' && activeDarshan !== 'stotra' && activeDarshan !== 'pujavidhi'
              ? 'text-amber-400 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <BookOpen className="w-5 h-5 mb-0.5" />
            {currentView === 'library' && activeDarshan !== 'stotra' && activeDarshan !== 'pujavidhi' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
            )}
          </div>
          <span className="text-[10px] font-devanagari tracking-tight">ग्रन्थालय</span>
        </button>

        {/* 2. स्तोत्र दर्शन */}
        <button
          type="button"
          onClick={() => {
            setCurrentView('library');
            if (onSelectDarshan) onSelectDarshan('stotra');
          }}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
            currentView === 'library' && activeDarshan === 'stotra'
              ? 'text-amber-400 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <span className="text-base leading-none mb-0.5 block select-none">🕉️</span>
            {currentView === 'library' && activeDarshan === 'stotra' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
            )}
          </div>
          <span className="text-[10px] font-devanagari tracking-tight">स्तोत्र</span>
        </button>

        {/* 3. पूजाविधि दर्शन */}
        <button
          type="button"
          onClick={() => {
            setCurrentView('library');
            if (onSelectDarshan) onSelectDarshan('pujavidhi');
          }}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
            currentView === 'library' && activeDarshan === 'pujavidhi'
              ? 'text-amber-400 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <span className="text-base leading-none mb-0.5 block select-none">🪔</span>
            {currentView === 'library' && activeDarshan === 'pujavidhi' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
            )}
          </div>
          <span className="text-[10px] font-devanagari tracking-tight">पूजाविधि</span>
        </button>

        {/* 4. खोजें (Search) */}
        <button
          type="button"
          onClick={() => setCurrentView('search')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
            currentView === 'search'
              ? 'text-amber-400 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <Search className="w-5 h-5 mb-0.5" />
            {currentView === 'search' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
            )}
          </div>
          <span className="text-[10px] font-devanagari tracking-tight">खोजें</span>
        </button>

        {/* 5. थीम चक्र (Theme Cycle) */}
        <button
          type="button"
          onClick={cycleTheme}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-neutral-400 hover:text-neutral-200 transition-all cursor-pointer min-h-[48px]"
          title="थीम बदलें"
        >
          {getThemeIcon()}
          <span className="text-[10px] font-devanagari tracking-tight">{getThemeLabel()}</span>
        </button>
      </div>
    </nav>
  );
};
