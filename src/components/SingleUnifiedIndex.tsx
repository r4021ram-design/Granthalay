/**
 * ============================================================================
 * 🕉️ ग्रन्थालयः - एकल स्वच्छ अनुक्रमणिका (Single Unified Master Accordion Index)
 * Zero-Clutter, Mobile-First, Deities & Scriptures Accordion Directory
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  LayoutGrid,
  List,
  X
} from 'lucide-react';
import {
  CANONICAL_DEITIES,
  getAllStotrasForDarshan,
  ScriptureItem,
  getDeityById,
  classifyStotraGenre,
  CANONICAL_STOTRA_GENRES
} from '../data/darshanTaxonomy.js';
import { DeitySvgIcon } from './DeitySvgIcons.js';

interface SingleUnifiedIndexProps {
  onSelectStotra: (stotra: ScriptureItem) => void;
  onOpenUpload?: () => void;
  stotraLayout?: 'unified' | 'grid' | 'compact';
  onLayoutChange?: (layout: 'unified' | 'grid' | 'compact') => void;
}

export const SingleUnifiedIndex: React.FC<SingleUnifiedIndexProps> = ({
  onSelectStotra,
  stotraLayout = 'unified',
  onLayoutChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDeities, setExpandedDeities] = useState<Record<string, boolean>>({
    'devi': true, // Keep primary holy Devi/Rivers darshan open by default
  });

  // Toggle single accordion
  const toggleDeity = (deityId: string) => {
    setExpandedDeities(prev => ({
      ...prev,
      [deityId]: !prev[deityId]
    }));
  };

  // Expand / Collapse all
  const toggleAll = (expand: boolean) => {
    const newState: Record<string, boolean> = {};
    for (const d of CANONICAL_DEITIES) {
      newState[d.id] = expand;
    }
    setExpandedDeities(newState);
  };

  // Fetch all stotras grouped by deity
  const deitySections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return CANONICAL_DEITIES.map(deity => {
      const stotras = getAllStotrasForDarshan(deity.id, 'all');
      
      const filtered = query
        ? stotras.filter(s => 
            s.title.toLowerCase().includes(query) ||
            (s.author && s.author.toLowerCase().includes(query)) ||
            deity.name.toLowerCase().includes(query)
          )
        : stotras;

      return {
        deity,
        stotras: filtered,
        totalCount: stotras.length,
        matchCount: filtered.length
      };
    }).filter(sec => (searchQuery ? sec.matchCount > 0 : sec.totalCount > 0));
  }, [searchQuery]);

  const totalResults = useMemo(() => {
    return deitySections.reduce((acc, curr) => acc + curr.stotras.length, 0);
  }, [deitySections]);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4">
      {/* 1. Header & Fast Search Bar */}
      <div className="bg-gradient-to-b from-[#18120C] to-[#0E0A06] border border-amber-900/40 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl select-none">🕉️</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-serifDevanagari text-amber-100 tracking-wide">
                ग्रन्थालयः — स्तोत्र अनुक्रमणिका
              </h1>
              <p className="text-xs text-amber-200/60 font-devanagari">
                समस्त पवित्र स्तोत्र, कवच, सूक्त एवं सहस्रनामों का एकल पावन संकलन
              </p>
            </div>
          </div>

          {/* Quick Controls: Expand/Collapse & Layout Switcher */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {!searchQuery && (
              <div className="flex items-center gap-1.5 text-xs font-devanagari text-neutral-400">
                <button
                  onClick={() => toggleAll(true)}
                  className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-700/50 text-neutral-300 transition-colors cursor-pointer"
                >
                  सभी खोलें
                </button>
                <button
                  onClick={() => toggleAll(false)}
                  className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-700/50 text-neutral-300 transition-colors cursor-pointer"
                >
                  सभी समेटें
                </button>
              </div>
            )}

            {onLayoutChange && (
              <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-0.5 shrink-0">
                <button
                  onClick={() => onLayoutChange('unified')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-devanagari transition-all cursor-pointer ${
                    stotraLayout === 'unified'
                      ? 'bg-amber-600 text-neutral-950 font-bold shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                  title="एकल अनुक्रमणिका"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">एकल सूची</span>
                </button>
                <button
                  onClick={() => onLayoutChange('grid')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-devanagari transition-all cursor-pointer ${
                    stotraLayout === 'grid'
                      ? 'bg-amber-600 text-neutral-950 font-bold shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                  title="ग्रिड दृश्य"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">ग्रिड</span>
                </button>
                <button
                  onClick={() => onLayoutChange('compact')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-devanagari transition-all cursor-pointer ${
                    stotraLayout === 'compact'
                      ? 'bg-amber-600 text-neutral-950 font-bold shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                  title="सघन कार्ड दृश्य"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">सघन</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Clean Responsive Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500/70 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="कोई भी स्तोत्र, देवता या रचयिता का नाम खोजें (उदा. नर्मदा, रुद्राष्टक, कनकधारा)..."
            className="w-full pl-10 pr-9 py-2.5 sm:py-3 bg-[#0A0704] border border-amber-900/50 focus:border-amber-500 rounded-xl text-sm sm:text-base text-amber-50 placeholder-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500/50 font-devanagari transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-amber-300 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search match stats */}
        {searchQuery && (
          <div className="flex items-center justify-between text-xs font-devanagari text-neutral-400 px-1">
            <span>
              खोज परिणाम: <strong className="text-amber-300">{totalResults}</strong> स्तोत्र मिले
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-amber-400 hover:underline"
            >
              खोज साफ़ करें
            </button>
          </div>
        )}
      </div>

      {/* 2. Accordion Sections for Each Dev-Mandal */}
      <div className="space-y-3">
        {deitySections.length === 0 ? (
          <div className="bg-[#120D08] border border-dashed border-amber-900/40 rounded-2xl p-10 text-center space-y-2">
            <span className="text-3xl">🪔</span>
            <p className="text-base text-amber-200 font-serifDevanagari">
              "{searchQuery}" से मेल खाता कोई स्तोत्र नहीं मिला।
            </p>
            <p className="text-xs text-neutral-400 font-devanagari">
              कृपया अन्य शब्द अथवा देवता के नाम से खोज कर देखें।
            </p>
          </div>
        ) : (
          deitySections.map(({ deity, stotras, totalCount, matchCount }) => {
            const isExpanded = searchQuery ? true : !!expandedDeities[deity.id];

            return (
              <div
                key={deity.id}
                className="bg-[#140E08] border border-amber-900/30 hover:border-amber-700/50 rounded-2xl overflow-hidden transition-all shadow-md"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => !searchQuery && toggleDeity(deity.id)}
                  className={`w-full px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 text-left transition-colors ${
                    isExpanded ? 'bg-amber-950/40 border-b border-amber-900/40' : 'hover:bg-amber-950/20'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center shrink-0 shadow-xs">
                      <DeitySvgIcon deityId={deity.id} size={18} />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-bold font-serifDevanagari text-amber-100 truncate">
                        {deity.name}
                      </h2>
                      <p className="text-[11px] text-neutral-400 font-devanagari truncate">
                        {deity.sanskritTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-900/90 text-amber-300/90 border border-amber-900/40 font-mono font-medium">
                      {searchQuery ? `${matchCount}/${totalCount}` : `${totalCount} स्तोत्र`}
                    </span>
                    {!searchQuery && (
                      <div className="w-6 h-6 rounded-lg bg-neutral-900/60 flex items-center justify-center text-amber-400">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </div>
                </button>

                {/* Stotra Items List */}
                {isExpanded && (
                  <div className="divide-y divide-amber-950/60">
                    {stotras.map((item) => {
                      const genreInfo = CANONICAL_STOTRA_GENRES.find(
                        g => g.id === (item.genre || classifyStotraGenre(item.title))
                      );

                      return (
                        <div
                          key={String(item.id)}
                          onClick={() => onSelectStotra(item)}
                          className="px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-[#1E150C] flex items-center justify-between gap-3 cursor-pointer group transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm sm:text-base font-semibold text-amber-50 group-hover:text-amber-300 font-serifDevanagari transition-colors truncate">
                                {item.title}
                              </h3>
                              {genreInfo && genreInfo.id !== 'all' && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-devanagari shrink-0 ${genreInfo.badge}`}>
                                  {genreInfo.icon} {genreInfo.name}
                                </span>
                              )}
                              {String(item.id).startsWith('supp-') && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-amber-950/80 text-amber-300 border border-amber-800/60 font-devanagari shrink-0">
                                  प्रामाणिक पाठ
                                </span>
                              )}
                            </div>

                            {item.author && (
                              <p className="text-xs text-neutral-400 font-devanagari mt-0.5 truncate">
                                रचयिता: <span className="text-amber-200/80">{item.author}</span>
                              </p>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 group-hover:bg-amber-600 border border-amber-900/50 group-hover:border-amber-400 text-amber-300 group-hover:text-neutral-950 text-xs font-semibold font-devanagari transition-all shrink-0 shadow-xs">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">पठन करें</span>
                            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 3. Footer Liturgical Blessing */}
      <div className="text-center pt-4 pb-8">
        <p className="text-xs text-amber-500/50 font-serifDevanagari">
          ॥ ॐ तत्सत् श्रीब्रह्मार्पणमस्तु ॥
        </p>
      </div>
    </div>
  );
};
