import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import {
  BRIHAT_CATEGORIES,
  BRIHAT_STOTRAS,
  BrihatStotraItem
} from '../data/brihatStotraRatnakarIndex.js';

interface BrihatStotraTableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  currentPageNumber: number; // 1-based PDF page number
  onJumpToPage: (pageNumber: number) => void;
}

export const BrihatStotraTableOfContents: React.FC<BrihatStotraTableOfContentsProps> = ({
  isOpen,
  onClose,
  currentPageNumber,
  onJumpToPage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter stotras by category & search query
  const filteredStotras = useMemo(() => {
    return BRIHAT_STOTRAS.filter((item: BrihatStotraItem) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        String(item.stotraNumber).includes(q) ||
        String(item.bookPage).includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Determine current active stotra based on page
  const currentStotra = useMemo(() => {
    // Find the latest stotra whose pdfPage <= currentPageNumber
    const matching = BRIHAT_STOTRAS.filter(s => s.pdfPage <= currentPageNumber);
    return matching.length > 0 ? matching[matching.length - 1] : null;
  }, [currentPageNumber]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-lg sm:max-w-2xl h-full bg-[#1A1009] text-amber-100 border-l border-amber-900/60 shadow-2xl flex flex-col overflow-hidden animate-slideLeft">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-900/40 bg-gradient-to-b from-[#2D1409] to-[#1A1009] flex items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-2xl text-amber-400">📖</span>
              <h2 className="text-lg sm:text-xl font-bold font-serifDevanagari text-amber-200">
                बृहत्स्तोत्ररत्नाकरः • २२४ स्तोत्र अनुक्रमणिका
              </h2>
            </div>
            <p className="text-xs text-amber-400/80 font-devanagari">
              सचित्र पारम्परिक महास्तोत्र संग्रह • प्रामाणिक पाठ
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
            title="अनुक्रमणिका बन्द करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Stotra Notice if Reading */}
        {currentStotra && (
          <div className="px-4 py-2 bg-sacred-950/80 border-b border-sacred-800/40 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2 text-xs text-sacred-200 font-devanagari">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>वर्तमान स्तोत्र:</span>
              <strong className="text-amber-300">
                #{currentStotra.stotraNumber} {currentStotra.title}
              </strong>
              <span className="text-neutral-400 text-[11px]">(पृष्ठ {currentStotra.bookPage})</span>
            </div>
            <button
              onClick={() => onJumpToPage(currentStotra.pdfPage)}
              className="text-[11px] text-amber-300 hover:underline flex items-center gap-1 font-devanagari cursor-pointer"
            >
              <span>प्रारम्भ पर जाएँ</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Search & Category Tabs */}
        <div className="p-3 bg-black/40 border-b border-amber-900/30 space-y-2.5 shrink-0">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/70" />
            <input
              type="text"
              placeholder="स्तोत्र का नाम, संख्या या पृष्ठ खोजें (उदा. 'रामरक्षा', 'दामोदर', 'शिव')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-black/50 border border-amber-900/40 rounded-xl text-xs font-devanagari text-amber-100 placeholder:text-amber-500/50 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills (Horizontal Scroll) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-amber-900/40">
            {BRIHAT_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-devanagari transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-sacred-700 to-amber-700 text-white shadow-md border border-amber-500/50 font-semibold'
                      : 'bg-white/5 hover:bg-white/10 text-amber-200/70 hover:text-amber-100 border border-white/5'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-70">({cat.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stotra Items List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 divide-y divide-white/5">
          {filteredStotras.length === 0 ? (
            <div className="p-8 text-center text-neutral-400 font-devanagari space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-amber-500/40" />
              <p className="text-sm">कोई स्तोत्र प्राप्त नहीं हुआ</p>
              <p className="text-xs text-neutral-500">कृपया अन्य खोज शब्द या श्रेणी का चयन करें</p>
            </div>
          ) : (
            filteredStotras.map((item) => {
              const isCurrent = currentStotra?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onJumpToPage(item.pdfPage);
                    onClose();
                  }}
                  className={`pt-2 first:pt-0 group p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-950/50'
                      : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/5 hover:border-amber-900/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {/* Number Badge */}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                        isCurrent
                          ? 'bg-amber-500 text-black shadow'
                          : 'bg-amber-900/30 text-amber-300 border border-amber-700/30 group-hover:border-amber-500/50'
                      }`}
                    >
                      {item.stotraNumber}
                    </div>

                    {/* Stotra Details */}
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4
                          className={`text-sm font-devanagari font-medium truncate ${
                            isCurrent
                              ? 'text-amber-200 font-bold'
                              : 'text-neutral-200 group-hover:text-amber-200'
                          }`}
                        >
                          {item.title}
                        </h4>
                        {isCurrent && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-neutral-400 font-devanagari mt-0.5">
                        <span className="text-amber-500/80">
                          {BRIHAT_CATEGORIES.find(c => c.id === item.category)?.icon}{' '}
                          {BRIHAT_CATEGORIES.find(c => c.id === item.category)?.name}
                        </span>
                        <span>•</span>
                        <span>पुस्तक पृष्ठ: {item.bookPage}</span>
                        <span>•</span>
                        <span className="text-neutral-500">फोलियो: {item.pdfPage}</span>
                      </div>
                    </div>
                  </div>

                  {/* Jump Action */}
                  <div className="shrink-0 pl-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onJumpToPage(item.pdfPage);
                        onClose();
                      }}
                      className="p-1.5 rounded-lg bg-white/5 group-hover:bg-amber-500/20 text-neutral-400 group-hover:text-amber-200 transition-all"
                      title="इस स्तोत्र पर जाएँ"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-black/60 border-t border-amber-900/40 flex items-center justify-between text-xs text-amber-300/70 font-devanagari shrink-0">
          <span>कुल २२४ स्तोत्र • २८४ पाण्डुलिपि फोलियो</span>
          <span className="text-[11px] text-neutral-400">पारम्परिक ऋषि-प्रणीत वाङ्मय</span>
        </div>
      </div>
    </div>
  );
};
