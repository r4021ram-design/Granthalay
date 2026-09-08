import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Sparkles,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { GITA_SECTIONS, GitaChapter } from '../data/bhagavadGitaIndex.js';

interface GitaTableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  currentPageNumber: number;
  activeChapterId: number | null;
  onSelectChapter: (chapter: GitaChapter, focusMode: boolean) => void;
  onJumpToPage: (pageNumber: number) => void;
  onResetToFullBook: () => void;
}

export const GitaTableOfContents: React.FC<GitaTableOfContentsProps> = ({
  isOpen,
  onClose,
  currentPageNumber,
  activeChapterId,
  onSelectChapter,
  onJumpToPage,
  onResetToFullBook,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedChapterId, setExpandedChapterId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'adhyayas' | 'stotras'>('adhyayas');

  const filteredSections = useMemo(() => {
    return GITA_SECTIONS.filter((sec) => {
      // Tab filter
      if (activeTab === 'adhyayas' && sec.sectionType !== 'adhyaya') return false;
      if (activeTab === 'stotras' && sec.sectionType === 'adhyaya') return false;

      // Text query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        sec.titleSa.toLowerCase().includes(q) ||
        sec.titleHi.toLowerCase().includes(q) ||
        sec.nameSa.toLowerCase().includes(q) ||
        sec.nameHi.toLowerCase().includes(q) ||
        sec.description.toLowerCase().includes(q) ||
        (sec.chapterNumber && String(sec.chapterNumber).includes(q))
      );
    });
  }, [searchQuery, activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity animate-fadeIn">
      {/* Background Click to Dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Drawer */}
      <div className="relative z-10 w-full max-w-lg sm:max-w-xl h-full bg-[#1A1412] text-amber-100 border-l border-amber-900/50 shadow-2xl flex flex-col overflow-hidden animate-slideLeft">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-900/40 bg-gradient-to-b from-[#2A1810] to-[#1A1412] flex items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-xl text-amber-500">卐</span>
              <h2 className="text-lg sm:text-xl font-bold font-serifDevanagari text-amber-200">
                श्रीमद्भगवद्गीता • अनुक्रमणिका
              </h2>
            </div>
            <p className="text-xs text-amber-400/80 font-devanagari">
              सम्पूर्ण १८ अध्याय • ७०० श्लोक • श्रीगीता आरती
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all"
            title="अनुक्रमणिका बन्द करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Reading Scope Bar */}
        <div className="px-4 py-2.5 bg-black/40 border-b border-amber-900/30 flex items-center justify-between text-xs font-devanagari">
          <div className="flex items-center space-x-2">
            <span className="text-neutral-400">वर्तमान स्थिति:</span>
            {activeChapterId ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-600/30 border border-amber-500/50 text-amber-300 font-semibold">
                अध्याय {GITA_SECTIONS.find(s => s.id === activeChapterId)?.chapterNumber} वाचन
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold">
                सम्पूर्ण ग्रन्थ (अखण्ड पारायण)
              </span>
            )}
          </div>
          {activeChapterId && (
            <button
              onClick={() => {
                onResetToFullBook();
                onClose();
              }}
              className="text-[11px] text-amber-400 hover:text-amber-200 underline font-semibold"
            >
              सम्पूर्ण ग्रन्थ मोड ↩
            </button>
          )}
        </div>

        {/* Search Input & Filter Tabs */}
        <div className="p-3 sm:p-4 border-b border-amber-900/30 bg-black/20 space-y-2.5 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-amber-400/60 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="अध्याय नाम, विषय या श्लोक खोजें..."
              className="w-full bg-black/50 border border-amber-900/50 rounded-xl pl-9 pr-4 py-2 text-xs font-devanagari text-amber-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1.5 text-xs font-devanagari bg-black/40 p-1 rounded-xl border border-amber-900/40">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-amber-700 to-sacred-700 text-white shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>सम्पूर्ण (१८ अध्याय + आरती)</span>
            </button>
            <button
              onClick={() => setActiveTab('adhyayas')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'adhyayas'
                  ? 'bg-gradient-to-r from-amber-700 to-sacred-700 text-white shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>१८ अध्याय</span>
            </button>
            <button
              onClick={() => setActiveTab('stotras')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'stotras'
                  ? 'bg-gradient-to-r from-amber-700 to-sacred-700 text-white shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>आरती</span>
            </button>
          </div>
        </div>

        {/* Chapter List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
          {filteredSections.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 font-devanagari space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-neutral-600" />
              <p>कोई अध्याय या विषय नहीं मिला</p>
            </div>
          ) : (
            filteredSections.map((sec) => {
              const isCurrentPageInSection =
                currentPageNumber >= sec.startPage && currentPageNumber <= sec.endPage;
              const isActiveScope = activeChapterId === sec.id;
              const isExpanded = expandedChapterId === sec.id;

              return (
                <div
                  key={sec.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isActiveScope
                      ? 'bg-amber-950/40 border-amber-500/80 shadow-lg ring-1 ring-amber-500/40'
                      : isCurrentPageInSection
                      ? 'bg-black/60 border-sacred-600/70'
                      : 'bg-black/30 border-amber-950/60 hover:border-amber-800/80 hover:bg-black/50'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-3.5 sm:p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start space-x-3">
                        {/* Chapter Badge */}
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-serifDevanagari font-bold shrink-0 shadow-md ${
                            sec.sectionType === 'adhyaya'
                              ? 'bg-gradient-to-br from-amber-600 to-sacred-700 text-white border border-amber-400/40'
                              : 'bg-neutral-800 text-amber-300 border border-neutral-700'
                          }`}
                        >
                          {sec.chapterNumber ? sec.chapterNumber : 'ॐ'}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-sm sm:text-base font-serifDevanagari text-amber-100">
                              {sec.titleSa}
                            </h3>
                            {isCurrentPageInSection && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sacred-600/30 text-sacred-300 border border-sacred-500/40 font-devanagari font-semibold">
                                वर्तमान पत्र
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-amber-400/90 font-devanagari mt-0.5">
                            {sec.nameHi}
                          </p>
                        </div>
                      </div>

                      {/* Right Meta Info */}
                      <div className="text-right shrink-0">
                        {sec.shlokaCount > 0 && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-amber-300 font-devanagari block">
                            {sec.shlokaCount} श्लोक
                          </span>
                        )}
                        <span className="text-[10px] text-neutral-400 font-mono mt-1 block">
                          पत्रम् {sec.startPage}
                        </span>
                      </div>
                    </div>

                    {/* Brief description */}
                    <p className="text-[11px] text-neutral-400 font-devanagari line-clamp-2 leading-relaxed pl-11">
                      {sec.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="pt-2 pl-11 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        {/* Read this chapter only (Focus Mode) */}
                        <button
                          onClick={() => {
                            onSelectChapter(sec, true);
                            onClose();
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-devanagari font-semibold transition-all flex items-center space-x-1.5 shadow-sm active:scale-95 ${
                            isActiveScope
                              ? 'bg-amber-600 text-white font-bold'
                              : 'bg-sacred-900/60 hover:bg-sacred-800 text-amber-200 border border-sacred-700/60'
                          }`}
                          title="केवल इस अध्याय का एकाग्रचित्त वाचन करें"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                          <span>अध्याय वाचन</span>
                        </button>

                        {/* Jump in Full Mode */}
                        <button
                          onClick={() => {
                            onSelectChapter(sec, false);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-devanagari transition-all flex items-center space-x-1.5 active:scale-95"
                          title="सम्पूर्ण ग्रन्थ में इस अध्याय पर जाएँ"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                          <span>यहाँ जाएँ</span>
                        </button>
                      </div>

                      {/* Shloka Grid Accordion Toggle */}
                      {sec.shlokaCount > 0 && (
                        <button
                          onClick={() =>
                            setExpandedChapterId(isExpanded ? null : sec.id)
                          }
                          className="text-[11px] text-amber-400/90 hover:text-amber-200 font-devanagari flex items-center space-x-1 py-1 px-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <span>श्लोक सूची</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Shloka Grid */}
                  {isExpanded && sec.shlokaCount > 0 && (
                    <div className="p-3 bg-black/60 border-t border-amber-950/60 space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between text-[11px] font-devanagari text-neutral-400">
                        <span>सीधे किसी श्लोक पर जाएँ:</span>
                        <span className="font-mono text-amber-400">
                          १ - {sec.shlokaCount}
                        </span>
                      </div>
                      <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5 max-h-40 overflow-y-auto p-1 custom-scrollbar">
                        {Array.from({ length: sec.shlokaCount }, (_, idx) => idx + 1).map(
                          (verseNum) => {
                            // Estimate page within the chapter
                            const chapterSpan = sec.endPage - sec.startPage + 1;
                            const pageOffset = Math.min(
                              sec.endPage,
                              sec.startPage + Math.floor(((verseNum - 1) / sec.shlokaCount) * chapterSpan)
                            );

                            return (
                              <button
                                key={verseNum}
                                onClick={() => {
                                  onJumpToPage(pageOffset);
                                  onClose();
                                }}
                                className="py-1 px-1.5 rounded-lg bg-neutral-900/80 hover:bg-sacred-700 hover:text-white border border-neutral-800 hover:border-amber-400 text-xs font-mono text-amber-200/90 transition-all text-center"
                                title={`श्लोक ${verseNum} (पत्रम् ${pageOffset}) पर जाएँ`}
                              >
                                {verseNum}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-black/60 border-t border-amber-900/40 flex items-center justify-between text-xs font-devanagari shrink-0 text-neutral-400">
          <span className="flex items-center space-x-1.5">
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
            <span>श्रीमद्भगवद्गीता (१८ अध्याय एवं आरती)</span>
          </span>
          <button
            onClick={() => {
              onResetToFullBook();
              onClose();
            }}
            className="text-amber-300 hover:text-white font-semibold transition-colors"
          >
            अखण्ड पारायण (सभी पृष्ठ)
          </button>
        </div>
      </div>
    </div>
  );
};
