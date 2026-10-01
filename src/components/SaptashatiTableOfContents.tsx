import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  X,
  Search,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { SAPTASHATI_SECTIONS, SaptashatiSection } from '../data/durgaSaptashatiIndex.js';

interface SaptashatiTableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  currentPageNumber: number;
  activeSectionId?: number | null;
  onSelectSection?: (section: SaptashatiSection) => void;
  onJumpToPage: (pageNumber: number) => void;
}

export const SaptashatiTableOfContents: React.FC<SaptashatiTableOfContentsProps> = ({
  isOpen,
  onClose,
  currentPageNumber,
  activeSectionId,
  onSelectSection,
  onJumpToPage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'purvanga' | 'pradhana' | 'uttaranga'>('all');

  const filteredSections = useMemo(() => {
    return SAPTASHATI_SECTIONS.filter((sec) => {
      // Tab filter
      if (activeTab === 'purvanga' && sec.sectionType !== 'purvanga') return false;
      if (activeTab === 'pradhana' && sec.sectionType !== 'pradhana_adhyaya') return false;
      if (activeTab === 'uttaranga' && sec.sectionType !== 'uttaranga') return false;

      // Text search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        sec.titleSa.toLowerCase().includes(q) ||
        sec.titleHi.toLowerCase().includes(q) ||
        sec.nameSa.toLowerCase().includes(q) ||
        sec.nameHi.toLowerCase().includes(q) ||
        sec.description.toLowerCase().includes(q) ||
        (sec.adhyayaNumber && String(sec.adhyayaNumber).includes(q))
      );
    });
  }, [searchQuery, activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#1E110A] via-[#140A05] to-[#0A0502] border-2 border-amber-900/60 shadow-2xl shadow-black overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-amber-900/40 flex items-center justify-between bg-gradient-to-r from-amber-950/40 via-red-950/20 to-transparent">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl shadow-inner text-amber-300">
              🌺
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-bold font-serifDevanagari text-amber-200">
                  श्रीदुर्गासप्तशती अनुक्रमणिका
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 border border-red-800 text-red-200 font-semibold font-devanagari">
                  सम्पूर्ण २२ खण्ड • ७०० मन्त्र
                </span>
              </div>
              <p className="text-xs text-amber-400/80 font-devanagari mt-0.5">
                षडङ्ग-पूर्वाङ्ग, प्रधान १३ अध्याय (महाकाली-महालक्ष्मी-महासरस्वती चरित) एवं रहस्यत्रयम्
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-amber-200 hover:bg-neutral-800/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar: Search & Tabs */}
        <div className="p-4 border-b border-amber-900/30 space-y-3 bg-[#110803]/80">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="अध्याय, चरित, कवच, अर्गला, स्तुति या मन्त्र खोजें..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-950/80 border border-amber-900/40 text-amber-100 placeholder-neutral-500 text-xs sm:text-sm font-devanagari focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-devanagari font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-amber-300 border border-neutral-800'
              }`}
            >
              सम्पूर्ण सप्तशती ({SAPTASHATI_SECTIONS.length})
            </button>
            <button
              onClick={() => setActiveTab('purvanga')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-devanagari font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'purvanga'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-amber-300 border border-neutral-800'
              }`}
            >
              १. पूर्वाङ्ग विधि (६ खण्ड)
            </button>
            <button
              onClick={() => setActiveTab('pradhana')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-devanagari font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'pradhana'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-amber-300 border border-neutral-800'
              }`}
            >
              २. प्रधान १३ अध्याय (७०० मन्त्र)
            </button>
            <button
              onClick={() => setActiveTab('uttaranga')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-devanagari font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'uttaranga'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-amber-300 border border-neutral-800'
              }`}
            >
              ३. उत्तराङ्ग व रहस्यत्रय (३ खण्ड)
            </button>
          </div>
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 custom-scrollbar">
          {filteredSections.map((sec) => {
            const isCurrent = currentPageNumber === sec.startPage;
            const isAdhyaya = sec.sectionType === 'pradhana_adhyaya';

            return (
              <div
                key={sec.id}
                onClick={() => {
                  onSelectSection?.(sec);
                  onJumpToPage(sec.startPage);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                  isCurrent
                    ? 'bg-gradient-to-r from-amber-950/80 via-red-950/40 to-neutral-950 border-amber-500/80 shadow-lg shadow-amber-950/40'
                    : 'bg-neutral-950/60 border-amber-900/30 hover:border-amber-600/60 hover:bg-[#1C1008]'
                }`}
              >
                <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 mt-0.5 border ${
                    isCurrent
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 group-hover:border-amber-700/50'
                  }`}>
                    {sec.icon}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1 pr-2">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h3 className={`text-sm sm:text-base font-bold font-serifDevanagari transition-colors ${
                        isCurrent ? 'text-amber-200' : 'text-neutral-200 group-hover:text-amber-300'
                      }`}>
                        {sec.titleHi}
                      </h3>

                      {sec.charitra && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-devanagari font-semibold border ${
                          sec.charitra === 'prathama'
                            ? 'bg-purple-950 text-purple-300 border-purple-800'
                            : sec.charitra === 'madhyama'
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : 'bg-sky-950 text-sky-300 border-sky-800'
                        }`}>
                          {sec.charitra === 'prathama' ? 'प्रथम चरित (महाकाली)' : sec.charitra === 'madhyama' ? 'मध्यम चरित (महालक्ष्मी)' : 'उत्तर चरित (महासरस्वती)'}
                        </span>
                      )}

                      {sec.mantraCount && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900 text-amber-400/90 border border-neutral-800 font-mono">
                          {sec.mantraCount} मन्त्र
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-400 font-devanagari line-clamp-1 leading-relaxed">
                      {sec.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-400 group-hover:text-amber-300 group-hover:border-amber-800">
                    पत्र {sec.startPage}
                  </span>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
