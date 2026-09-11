import React from 'react';
import {
  X,
  Bookmark,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { VSN_SECTIONS, VsnSection } from '../data/vishnuSahasranamaIndex.js';

interface VsnTableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  currentPageNumber: number;
  onJumpToPage: (pageNumber: number) => void;
}

export const VsnTableOfContents: React.FC<VsnTableOfContentsProps> = ({
  isOpen,
  onClose,
  currentPageNumber,
  onJumpToPage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm transition-opacity animate-fadeIn">
      {/* Background Click to Dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Drawer */}
      <div className="relative z-10 w-full max-w-lg sm:max-w-xl h-full bg-[#181310] text-amber-100 border-l border-amber-900/60 shadow-2xl flex flex-col overflow-hidden animate-slideLeft">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-900/40 bg-gradient-to-b from-[#2A160D] to-[#181310] flex items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-xl text-amber-400">☸</span>
              <h2 className="text-lg sm:text-xl font-bold font-serifDevanagari text-amber-200">
                श्रीविष्णुसहस्रनामस्तोत्रम् • विषय-सूची
              </h2>
            </div>
            <p className="text-xs text-amber-400/80 font-devanagari">
              महाभारत अनुशासनपर्व • १००० दिव्य नाम (सार्थ हिन्दी-अनुवाद-सहित)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all"
            title="विषय-सूची बन्द करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Position Status Bar */}
        <div className="px-4 py-2.5 bg-black/50 border-b border-amber-900/30 flex items-center justify-between text-xs font-devanagari">
          <div className="flex items-center space-x-2">
            <span className="text-neutral-400">वर्तमान पत्र:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-sacred-950/80 border border-sacred-500/50 text-sacred-300 font-semibold font-mono">
              पत्रम् {currentPageNumber} / 97
            </span>
          </div>
          <span className="text-neutral-500 text-[11px]">कुल ६ पावन विभाग</span>
        </div>

        {/* Section List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 custom-scrollbar">
          {VSN_SECTIONS.map((sec: VsnSection) => {
            const isCurrent =
              currentPageNumber >= sec.startPage && currentPageNumber <= sec.endPage;

            return (
              <div
                key={sec.id}
                onClick={() => {
                  onJumpToPage(sec.startPage);
                  onClose();
                }}
                className={`group cursor-pointer rounded-2xl p-4 border transition-all relative overflow-hidden ${
                  isCurrent
                    ? 'bg-gradient-to-r from-sacred-950/80 via-amber-950/40 to-sacred-950/80 border-amber-500/60 shadow-lg shadow-sacred-950/40 scale-[1.01]'
                    : 'bg-black/30 hover:bg-black/50 border-amber-900/30 hover:border-amber-700/50'
                }`}
              >
                {/* Active Section Ribbon */}
                {isCurrent && (
                  <div className="absolute top-0 right-0 px-3 py-0.5 bg-gradient-to-l from-amber-500 to-sacred-600 text-black font-bold text-[10px] font-devanagari rounded-bl-xl shadow-sm">
                    यहाँ पढ़ रहे हैं
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3.5">
                    <span className="text-2xl mt-0.5 select-none">{sec.icon}</span>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h3 className="font-bold text-sm sm:text-base font-serifDevanagari text-amber-200 group-hover:text-amber-100 transition-colors">
                          {sec.titleHi}
                        </h3>
                      </div>
                      <p className="text-xs text-amber-400/90 font-medium font-devanagari">
                        {sec.titleSa}
                      </p>
                      <p className="text-[11px] text-neutral-400 font-devanagari leading-relaxed">
                        {sec.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 pt-1">
                    <span className="text-xs font-mono font-bold text-amber-400/90 bg-black/40 px-2.5 py-1 rounded-lg border border-amber-900/40 group-hover:border-amber-600/50 transition-colors flex items-center space-x-1">
                      <span>पत्र {sec.startPage}</span>
                      {sec.startPage !== sec.endPage && <span>–{sec.endPage}</span>}
                    </span>
                    <span className="mt-2 text-neutral-500 group-hover:text-amber-300 transition-colors">
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-amber-900/40 bg-black/40 text-center text-xs text-neutral-400 font-devanagari">
          ॐ नमो भगवते वासुदेवाय • सार्थ सानुवाद पाण्डुलिपि पाठ
        </div>
      </div>
    </div>
  );
};
