import React from 'react';
import { X, ZoomIn, ZoomOut, Type, Split, Check, Sparkles, Moon, Sun, Scroll } from 'lucide-react';

export type ReadingTheme = 'bhojpatra' | 'golden-birch' | 'dark-slate' | 'ivory-white';
export type ScriptureFont = 'harmonized' | 'tiro' | 'yatra' | 'rozha' | 'notoSerif' | 'notoSans';

interface ReaderSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  fontFamily: ScriptureFont;
  setFontFamily: (font: ScriptureFont) => void;
  readingTheme: ReadingTheme;
  setReadingTheme: (theme: ReadingTheme) => void;
  isPadachhedaMode: boolean;
  setIsPadachhedaMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const FONTS: Array<{ id: ScriptureFont; label: string; desc: string; sample: string }> = [
  { id: 'yatra', label: 'काष्ठ पाण्डुलिपि', desc: 'Yatra One (पारम्परिक काष्ठ फलक)', sample: 'ॐ गं गणपतये' },
  { id: 'tiro', label: 'पारंपरिक पोथी', desc: 'Tiro Devanagari (हस्तलिखित पोथी)', sample: 'ॐ नमः शिवाय' },
  { id: 'rozha', label: 'राजसी मन्दिर', desc: 'Rozha One (शिलालेख व मन्दिर शैली)', sample: 'ॐ नमो नारायणाय' },
  { id: 'harmonized', label: 'शास्त्र सम्मत', desc: 'वैदिक + पौराणिक संयुक्त शैली', sample: 'हिरण्यवर्णां हरिणीं' },
  { id: 'notoSerif', label: 'शास्त्रीय सेरिफ़', desc: 'Noto Serif (स्पष्ट पठनीय)', sample: 'सच्चिदानन्दरूपाय' },
  { id: 'notoSans', label: 'सुगम देवनागरी', desc: 'Noto Sans (आधुनिक स्वच्छ)', sample: 'सर्वमङ्गलमाङ्गल्ये' },
];

const THEMES: Array<{ id: ReadingTheme; label: string; icon: string; bgClass: string; textClass: string }> = [
  { id: 'bhojpatra', label: 'भोजपत्र', icon: '📜', bgClass: 'bg-[#F5ECD4]', textClass: 'text-[#1C120C]' },
  { id: 'golden-birch', label: 'स्वर्णिम', icon: '✨', bgClass: 'bg-[#EED9A7]', textClass: 'text-[#110A05]' },
  { id: 'dark-slate', label: 'रात्रि गर्भगृह', icon: '🌙', bgClass: 'bg-[#141210]', textClass: 'text-white' },
  { id: 'ivory-white', label: 'धवल पत्र', icon: '🏛️', bgClass: 'bg-[#FCFAF4]', textClass: 'text-[#110A05]' },
];

export const ReaderSettingsSheet: React.FC<ReaderSettingsSheetProps> = ({
  isOpen,
  onClose,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  readingTheme,
  setReadingTheme,
  isPadachhedaMode,
  setIsPadachhedaMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs cursor-pointer"
        onClick={onClose}
      />

      {/* Sheet Container */}
      <div
        onClick={e => e.stopPropagation()}
        className="relative z-10 w-full sm:max-w-lg bg-[#160E08] text-amber-100 rounded-t-3xl sm:rounded-3xl border-t-2 sm:border border-amber-600/70 shadow-2xl p-5 pb-safe max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 space-y-5"
      >
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-neutral-700/80 rounded-full mx-auto sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">⚙️</span>
            <div>
              <h3 className="font-bold font-serifDevanagari text-base text-amber-200">
                पठन विन्यास (Reader Settings)
              </h3>
              <p className="text-[11px] text-neutral-400 font-devanagari">
                फॉन्ट, आकार, पाण्डुलिपि पृष्ठ एवं पदच्छेद अनुकूलन
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="बन्द करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Font Size Controller */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-devanagari">
            <span className="font-bold text-amber-300">अक्षर आकार (Font Size)</span>
            <span className="font-mono text-white bg-neutral-900 px-2.5 py-0.5 rounded-lg border border-neutral-800 font-bold">
              {fontSize}px
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 bg-neutral-900/90 p-2 rounded-2xl border border-neutral-800">
            <button
              onClick={() => setFontSize(prev => Math.max(16, prev - 2))}
              className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center space-x-1.5 transition-all active:scale-95 cursor-pointer min-h-[44px]"
              title="छोटा करें"
            >
              <ZoomOut className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-devanagari">छोटा (A-)</span>
            </button>

            {/* Quick preset buttons */}
            <div className="flex items-center gap-1">
              {[18, 22, 26, 30].map(size => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`w-9 h-9 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    fontSize === size
                      ? 'bg-amber-600 text-neutral-950 ring-2 ring-amber-400'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <button
              onClick={() => setFontSize(prev => Math.min(36, prev + 2))}
              className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center space-x-1.5 transition-all active:scale-95 cursor-pointer min-h-[44px]"
              title="बड़ा करें"
            >
              <ZoomIn className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-devanagari">बड़ा (A+)</span>
            </button>
          </div>
        </div>

        {/* 2. Reading Theme */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-amber-300 font-devanagari block">
            पाण्डुलिपि शैली (Manuscript Theme)
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {THEMES.map(t => {
              const isSelected = readingTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setReadingTheme(t.id)}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer min-h-[50px] ${
                    isSelected
                      ? 'border-amber-500 bg-amber-950/40 ring-1 ring-amber-400 shadow-md'
                      : 'border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800/80 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-lg select-none">{t.icon}</span>
                    <span className="text-xs font-devanagari font-bold">{t.label}</span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border border-neutral-700 flex items-center justify-center ${t.bgClass}`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Font Family Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-amber-300 font-devanagari block">
            पवित्र लिपि फॉन्ट (Devanagari Font Style)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FONTS.map(f => {
              const isSelected = fontFamily === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFontFamily(f.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer min-h-[48px] flex items-center justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-950/40 ring-1 ring-amber-400'
                      : 'border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800/80'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="text-xs font-bold text-amber-100 font-devanagari">
                      {f.label}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate font-devanagari">
                      {f.desc}
                    </div>
                  </div>
                  <span className="text-xs font-serifDevanagari text-amber-300/80 shrink-0">
                    {f.sample}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Padachheda Mode Toggle */}
        <div className="bg-neutral-900/90 p-3.5 rounded-2xl border border-neutral-800 flex items-center justify-between">
          <div className="space-y-0.5 max-w-[75%]">
            <div className="flex items-center space-x-1.5">
              <Split className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold font-devanagari text-amber-200">
                शास्त्रीय पदच्छेद मोड (Padachheda)
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-devanagari leading-snug">
              सन्धि-विच्छेद द्वारा प्रत्येक पद को अलग-अलग व स्पष्ट प्रदर्शित करता है।
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsPadachhedaMode(prev => !prev)}
            className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer flex items-center ${
              isPadachhedaMode ? 'bg-amber-600 justify-end' : 'bg-neutral-700 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform" />
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 text-neutral-950 font-bold font-devanagari text-sm shadow-xl hover:from-amber-500 hover:to-amber-600 active:scale-98 transition-all cursor-pointer min-h-[48px]"
        >
          स्वीकार करें एवं पाठ पढ़ें
        </button>
      </div>
    </div>
  );
};
