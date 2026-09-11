import React, { useState } from 'react';
import {
  X,
  Search,
  BookOpen,
  Layers,
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import {
  GANESH_PUJAN_TOPICS,
  GANESH_PUJAN_FOLIOS,
  GaneshPujanTopic,
  GaneshPujanFolio
} from '../data/ganeshPujanIndex.js';

interface GaneshPujanTableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  currentPageNumber: number;
  onJumpToPage: (pageNumber: number) => void;
}

export const GaneshPujanTableOfContents: React.FC<GaneshPujanTableOfContentsProps> = ({
  isOpen,
  onClose,
  currentPageNumber,
  onJumpToPage,
}) => {
  const [activeTab, setActiveTab] = useState<'topics' | 'folios'>('topics');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredTopics = GANESH_PUJAN_TOPICS.filter((topic: GaneshPujanTopic) =>
    topic.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.titleSa.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFolios = GANESH_PUJAN_FOLIOS.filter((folio: GaneshPujanFolio) =>
    folio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    folio.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    folio.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(folio.pageNumber).includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn">
      {/* Backdrop Click to Dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Drawer */}
      <div className="relative z-10 w-full max-w-lg sm:max-w-xl h-full bg-[#1A1009] text-amber-100 border-l border-amber-900/60 shadow-2xl flex flex-col overflow-hidden animate-slideLeft">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-900/40 bg-gradient-to-b from-[#2D1409] to-[#1A1009] flex items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-xl text-amber-400">🐘</span>
              <h2 className="text-lg sm:text-xl font-bold font-serifDevanagari text-amber-200">
                श्री गणेश पूजन पद्धति • विषय-सूची
              </h2>
            </div>
            <p className="text-xs text-amber-400/80 font-devanagari">
              भगवान् श्रीगणेश का सम्पूर्ण षोडशोपचार पूजन विधान एवं स्तोत्र रत्नमाला
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
            title="विषय-सूची बन्द करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector & Search */}
        <div className="p-3 bg-black/40 border-b border-amber-900/30 space-y-2.5 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/10 w-full">
              <button
                onClick={() => setActiveTab('topics')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-devanagari font-bold transition-all flex items-center justify-center space-x-1.5 ${
                  activeTab === 'topics'
                    ? 'bg-gradient-to-r from-sacred-700 to-amber-700 text-white shadow'
                    : 'text-amber-200/70 hover:text-amber-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>११ मुख्य विषय</span>
              </button>
              <button
                onClick={() => setActiveTab('folios')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-devanagari font-bold transition-all flex items-center justify-center space-x-1.5 ${
                  activeTab === 'folios'
                    ? 'bg-gradient-to-r from-sacred-700 to-amber-700 text-white shadow'
                    : 'text-amber-200/70 hover:text-amber-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>सकल २४ पत्र विवरण</span>
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="विषय, मंत्र, स्तोत्र या पत्र संख्या खोजें..."
              className="w-full bg-black/50 border border-amber-900/40 rounded-xl pl-9 pr-3 py-1.5 text-xs text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-500 font-devanagari"
            />
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-4 py-2 bg-black/60 border-b border-amber-900/20 flex items-center justify-between text-xs font-devanagari shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-neutral-400">वर्तमान पत्र:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-sacred-950/90 border border-amber-500/50 text-amber-300 font-semibold font-mono">
              पत्रम् {currentPageNumber} / 24
            </span>
          </div>
          <span className="text-neutral-400 text-[11px]">
            {activeTab === 'topics' ? `${filteredTopics.length} विषय उपलब्ध` : `${filteredFolios.length} पत्र उपलब्ध`}
          </span>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 custom-scrollbar">
          {activeTab === 'topics' ? (
            filteredTopics.map((topic: GaneshPujanTopic) => {
              const isCurrent =
                currentPageNumber >= topic.startPage && currentPageNumber <= topic.endPage;

              return (
                <div
                  key={topic.id}
                  onClick={() => {
                    onJumpToPage(topic.startPage);
                    onClose();
                  }}
                  className={`group cursor-pointer rounded-2xl p-3.5 border transition-all relative overflow-hidden ${
                    isCurrent
                      ? 'bg-gradient-to-r from-sacred-950/90 via-amber-950/60 to-sacred-950/90 border-amber-500/70 shadow-lg shadow-sacred-950/50 scale-[1.01]'
                      : 'bg-black/30 hover:bg-black/50 border-amber-900/30 hover:border-amber-700/50'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-gradient-to-l from-amber-500 to-sacred-600 text-black font-bold text-[10px] font-devanagari rounded-bl-xl shadow-sm">
                      यहाँ पढ़ रहे हैं
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl mt-0.5 select-none">{topic.icon}</span>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span className="text-xs text-amber-500 font-mono font-bold">
                            {topic.topicNumber}.
                          </span>
                          <h3 className="font-bold text-sm sm:text-base font-serifDevanagari text-amber-200 group-hover:text-amber-100 transition-colors">
                            {topic.titleHi}
                          </h3>
                        </div>
                        <p className="text-[11px] text-amber-300/80 font-mono">
                          {topic.titleSa}
                        </p>
                        <p className="text-xs text-neutral-300 font-devanagari leading-relaxed">
                          {topic.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between shrink-0 self-stretch">
                      <span className="px-2 py-0.5 rounded-lg bg-amber-900/40 border border-amber-700/30 text-amber-300 text-[11px] font-mono font-semibold">
                        पृष्ठ {topic.startPage}{topic.endPage !== topic.startPage ? `-${topic.endPage}` : ''}
                      </span>
                      <ArrowRight className="w-4 h-4 text-amber-500/40 group-hover:text-amber-400 group-hover:translate-x-1 transition-all mt-auto" />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            filteredFolios.map((folio: GaneshPujanFolio) => {
              const isCurrent = currentPageNumber === folio.pageNumber;

              return (
                <div
                  key={folio.pageNumber}
                  onClick={() => {
                    onJumpToPage(folio.pageNumber);
                    onClose();
                  }}
                  className={`group cursor-pointer rounded-xl p-3 border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-sacred-950/90 to-amber-950/70 border-amber-500/70 shadow-md'
                      : 'bg-black/25 hover:bg-black/45 border-amber-900/25 hover:border-amber-700/40'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      isCurrent
                        ? 'bg-amber-500 text-black shadow'
                        : 'bg-white/5 border border-white/10 text-amber-300 group-hover:bg-white/10'
                    }`}>
                      {folio.pageNumber}
                    </span>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-900/40 border border-amber-700/30 text-amber-300 font-devanagari">
                          {folio.badge}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-devanagari">
                          {folio.category}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-devanagari text-neutral-200 group-hover:text-amber-100 font-medium truncate">
                        {folio.title}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-amber-500/40 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
