/**
 * ============================================================================
 * 🕉️ ग्रन्थालयः - श्लोकार्थ एवं पाणिनीय व्याकरण पॉपओवर
 * (Shloka Meaning & Paninian Vyakarana Floating Popover)
 * Strictly follows AGENTS.md: Compact, high-contrast, zero-clutter, NO yellow fonts.
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import { analyzeShlokaLinguistics } from '../utils/paninianLinguisticEngine.js';

interface ShlokaMeaningPopoverProps {
  selectedText: string;
  selectionRect: DOMRect | null;
  shlokaNumber?: number;
  stotraId?: string;
  onClose: () => void;
}

export const ShlokaMeaningPopover: React.FC<ShlokaMeaningPopoverProps> = ({
  selectedText,
  selectionRect,
  shlokaNumber,
  stotraId,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'meaning' | 'grammar'>('meaning');
  const [copied, setCopied] = useState(false);
  const [isPinnedToSide, setIsPinnedToSide] = useState<boolean>(false);

  const data = useMemo(() => {
    return analyzeShlokaLinguistics(selectedText, stotraId, shlokaNumber);
  }, [selectedText, stotraId, shlokaNumber]);

  if (!selectionRect || !selectedText) return null;

  // Calculate dynamic floating position
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 768;

  const navbarHeight = 64;
  const bottomBarHeight = 64;

  const popoverWidth = Math.min(520, viewportWidth - 32);

  // Horizontal position: center on selection, clamp to screen borders
  let left = selectionRect.left + selectionRect.width / 2 - popoverWidth / 2;
  if (left < 16) left = 16;
  if (left + popoverWidth > viewportWidth - 16) left = viewportWidth - popoverWidth - 16;

  // Vertical position: calculate space above and below selection
  const spaceAbove = selectionRect.top - navbarHeight;
  const spaceBelow = viewportHeight - bottomBarHeight - selectionRect.bottom;

  // Decide placement: prefer below unless space below is too cramped (< 300px) and space above is larger
  const placeAbove = spaceBelow < 300 && spaceAbove > spaceBelow;

  let calculatedTop: number;
  let calculatedMaxHeight: number;

  if (placeAbove) {
    calculatedMaxHeight = Math.min(500, Math.max(240, spaceAbove - 16));
    calculatedTop = Math.max(navbarHeight + 8, selectionRect.top - calculatedMaxHeight - 8);
  } else {
    calculatedTop = selectionRect.bottom + 8;
    calculatedMaxHeight = Math.min(500, Math.max(240, spaceBelow - 16));
  }

  const handleCopy = () => {
    const textToCopy = `॥ श्लोकः ॥\n${data.shlokaText}\n\n॥ सरलार्थः ॥\n${data.hindiMeaning}\n\n॥ अन्वयः ॥\n${data.dandanvaya}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerStyle: React.CSSProperties = isPinnedToSide
    ? {
        position: 'fixed',
        top: `${navbarHeight + 8}px`,
        right: '16px',
        width: `${Math.min(460, viewportWidth - 32)}px`,
        maxHeight: `${viewportHeight - navbarHeight - bottomBarHeight - 16}px`,
        zIndex: 50,
      }
    : {
        position: 'fixed',
        left: `${left}px`,
        top: `${calculatedTop}px`,
        width: `${popoverWidth}px`,
        maxHeight: `${calculatedMaxHeight}px`,
        zIndex: 50,
      };

  return (
    <div
      className="transition-all duration-200 ease-out"
      style={containerStyle}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-[#0D0B0A] text-slate-100 rounded-xl border border-stone-800 shadow-2xl backdrop-blur-md overflow-hidden flex flex-col h-full max-h-[inherit]">
        {/* Header Bar */}
        <div className="px-4 py-2.5 bg-[#171311] border-b border-stone-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[#8C2D19] dark:text-rose-400 font-bold text-base">🕉️</span>
            <span className="font-serif text-sm tracking-wide font-semibold text-slate-100">
              श्लोकार्थ एवं व्याकरण विमर्श
            </span>
            {data.shlokaNumber && (
              <span className="text-xs px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono">
                श्लोक {data.shlokaNumber}
              </span>
            )}
            {data.chhandas?.name && (
              <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-900/60 font-serif">
                {data.chhandas.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setIsPinnedToSide(!isPinnedToSide)}
              title={isPinnedToSide ? 'तैरता हुआ रखें' : 'पार्श्व में पिन करें'}
              className={`text-xs px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                isPinnedToSide
                  ? 'bg-rose-900/60 text-rose-200 border border-rose-700/60'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300'
              }`}
            >
              {isPinnedToSide ? '📌 पिन कृतम्' : '📌 पार्श्व'}
            </button>
            <button
              onClick={handleCopy}
              title="श्लोक व अर्थ कॉपी करें"
              className="text-xs px-2.5 py-1 rounded bg-stone-800/80 hover:bg-stone-700 text-stone-200 transition-colors flex items-center gap-1"
            >
              {copied ? '✓ कॉपी कृतम्' : '📋 कॉपी'}
            </button>
            <button
              onClick={onClose}
              title="बन्द करें (Esc)"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-800 bg-[#120F0D]">
          <button
            onClick={() => setActiveTab('meaning')}
            className={`flex-1 py-2 px-4 text-xs font-medium text-center transition-all ${
              activeTab === 'meaning'
                ? 'text-white border-b-2 border-[#8C2D19] bg-stone-900/50'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            📜 सरल हिन्दी भावार्थ
          </button>
          <button
            onClick={() => setActiveTab('grammar')}
            className={`flex-1 py-2 px-4 text-xs font-medium text-center transition-all ${
              activeTab === 'grammar'
                ? 'text-white border-b-2 border-[#8C2D19] bg-stone-900/50'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            🔍 पाणिनीय व्याकरण दीपिका
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-stone-700">
          {/* Quoted Sanskrit Text */}
          <div className="p-3 bg-stone-900/70 border-l-2 border-[#8C2D19] rounded-r-lg font-serif text-sm sm:text-base text-stone-200 tracking-wide">
            {data.shlokaText}
          </div>

          {activeTab === 'meaning' ? (
            /* TAB 1: Bhavartha */
            <div className="space-y-4">
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-stone-400 mb-1.5 flex items-center gap-1.5">
                  <span>📖</span> हिन्दी भावार्थ
                </h4>
                <div className="p-3 bg-[#14100E] border border-stone-800/80 rounded-lg text-stone-100 font-sans text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {data.hindiMeaning}
                </div>
              </div>

              {data.dandanvaya && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-stone-400 mb-1 flex items-center gap-1.5">
                    <span>📜</span> दण्डान्वय (गद्य क्रम)
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-300 font-serif italic bg-stone-900/40 p-2.5 rounded border border-stone-800/50">
                    {data.dandanvaya}
                  </p>
                </div>
              )}

              {data.sourceReference && (
                <div className="pt-2 text-[11px] text-stone-400 flex items-center gap-1 border-t border-stone-800/60">
                  <span className="font-semibold text-stone-300">शास्त्र सन्दर्भ:</span> {data.sourceReference}
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: Paninian Vyakarana Analysis */
            <div className="space-y-4">
              {/* Padaccheda */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-stone-400 mb-1 flex items-center gap-1.5">
                  <span>🌿</span> १. पदच्छेद (संधि-विच्छेद)
                </h4>
                <div className="p-2.5 bg-stone-900/60 border border-stone-800 rounded font-serif text-xs sm:text-sm text-stone-200">
                  {data.padaccheda}
                </div>
              </div>

              {/* Samasa Vigraha */}
              {data.samasaList && data.samasaList.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-stone-400 mb-1.5 flex items-center gap-1.5">
                    <span>⚜️</span> २. समास एवं विग्रह
                  </h4>
                  <div className="space-y-2">
                    {data.samasaList.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-[#14100E] border border-stone-800 rounded text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-rose-300 text-sm">{s.compoundWord}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-stone-800 text-stone-300 font-medium">
                            {s.samasaType}
                          </span>
                        </div>
                        <p className="text-stone-300 font-serif italic text-xs">
                          विग्रह: {s.vigraha}
                        </p>
                        <p className="text-stone-400 text-[11px]">
                          अर्थ: {s.meaningHindi}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subanta & Tinganta Analysis */}
              {data.padaList && data.padaList.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-stone-400 mb-1.5 flex items-center gap-1.5">
                    <span>📿</span> ३. पद-परिचय (सुबन्त / तिङन्त / अव्यय)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {data.padaList.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-stone-900/60 border border-stone-800/80 rounded text-xs space-y-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-stone-100">{p.word}</span>
                          <span className="text-[10px] text-stone-400">
                            {p.grammaticalType.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-300">{p.details}</p>
                        {p.karakaOrPrayoga && (
                          <p className="text-[10px] text-rose-300/90">{p.karakaOrPrayoga}</p>
                        )}
                        {p.sutraRef && (
                          <p className="text-[10px] text-stone-400 font-mono italic">
                            सूत्र: {p.sutraRef}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chhandas & Metrical Analysis */}
              {data.chhandas && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-stone-400 mb-1.5 flex items-center gap-1.5">
                    <span>🎵</span> ४. छन्द एवं मात्रा विमर्श
                  </h4>
                  <div className="p-3 bg-[#14100E] border border-stone-800 rounded space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-semibold text-white">
                        {data.chhandas.name}
                      </span>
                      <span className="text-stone-400 font-mono text-[11px]">
                        मात्रा: {data.chhandas.totalMatras} | अक्षर: {data.chhandas.totalAksharas}
                      </span>
                    </div>
                    <div className="bg-stone-950 p-2 rounded font-mono text-center tracking-widest text-rose-200 border border-stone-800/60">
                      {data.chhandas.syllableWeight}
                    </div>
                    <p className="text-stone-300 text-[11px]">
                      {data.chhandas.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
