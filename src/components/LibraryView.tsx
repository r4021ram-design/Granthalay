import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  FileText,
  Download,
  Eye,
  Sparkles,
  Upload,
  Search,
  Filter,
  LayoutGrid,
  List,
  ArrowRight,
} from 'lucide-react';
import { HinduGranthalayLogo } from './HinduGranthalayLogo.js';
import type { Book, BookStats } from '../../shared/types.js';
import {
  CANONICAL_DARSHANS,
  CANONICAL_DEITIES,
  CANONICAL_STOTRA_GENRES,
  DarshanId,
  getAllStotrasForDarshan,
  getDeityById,
  ScriptureItem,
  StotraGenreId,
  classifyStotraGenre,
} from '../data/darshanTaxonomy.js';
import { DeitySvgIcon } from './DeitySvgIcons.js';

interface LibraryViewProps {
  books: Book[];
  stats: BookStats | null;
  onSelectBookForVerification: (bookId: string) => void;
  onSelectBookForReading: (bookId: string, initialPage?: number, initialStotraId?: number | string) => void;
  onSelectCustomStotra?: (item: ScriptureItem) => void;
  onDeleteBook: (bookId: string) => void;
  onOpenUpload: () => void;
  onExport: (bookId: string, format: 'txt' | 'docx' | 'pdf') => void;
}

interface DeityTheme {
  name: string;
  gradient: string;
  border: string;
  badge: string;
  glyph: string;
  mantra: string;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  books,
  stats,
  onSelectBookForVerification,
  onSelectBookForReading,
  onSelectCustomStotra,
  onDeleteBook,
  onOpenUpload,
  onExport,
}) => {
  const [activeDarshan, setActiveDarshan] = useState<DarshanId | 'all'>('stotra');
  const [stotraDeity, setStotraDeity] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<StotraGenreId>('all');
  const [stotraSearch, setStotraSearch] = useState('');
  const [stotraLayout, setStotraLayout] = useState<'grid' | 'compact'>('grid');
  const [refreshKey] = useState(0);

  // General Library Filter states (for 'all' or specific non-stotra darshans)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDeity, setSelectedDeity] = useState<string>('all');
  const [exportDropdown, setExportDropdown] = useState<string | null>(null);

  // Dynamic counts for each stotra genre under the currently selected deity
  const genreCounts = useMemo(() => {
    const baseForDeity = getAllStotrasForDarshan(stotraDeity, 'all');
    const counts: Record<string, number> = { all: baseForDeity.length };
    for (const g of CANONICAL_STOTRA_GENRES) {
      if (g.id !== 'all') {
        counts[g.id] = baseForDeity.filter(
          (item) => (item.genre || classifyStotraGenre(item.title)) === g.id
        ).length;
      }
    }
    return counts;
  }, [stotraDeity, refreshKey]);

  // Stotras List derived for Stotra Darshan
  const stotrasList = useMemo(() => {
    const all = getAllStotrasForDarshan(stotraDeity, selectedGenre);
    if (!stotraSearch.trim()) return all;
    const q = stotraSearch.trim().toLowerCase();
    return all.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.author && s.author.toLowerCase().includes(q))
    );
  }, [stotraDeity, selectedGenre, stotraSearch, refreshKey]);

  const getDeityTheme = (title: string, desc: string): DeityTheme => {
    const combined = `${title} ${desc}`.toLowerCase();
    if (combined.includes('स्तोत्ररत्नाकर') || combined.includes('स्तोत्र संग्रह') || combined.includes('२२४ स्तोत्र')) {
      return {
        name: 'स्तोत्र दर्शन (सर्वदेव स्तुति)',
        gradient: 'from-amber-950/95 via-orange-950/70 to-neutral-900',
        border: 'border-amber-600/70 hover:border-amber-400',
        badge: 'bg-amber-950 text-amber-300 border-amber-800',
        glyph: '🕉️',
        mantra: '॥ स जयति सिन्दूरवदनो देवो यत्पादपङ्कजस्मरणम् ॥',
      };
    }
    if (combined.includes('वास्तु') || combined.includes('गृहप्रवेश') || combined.includes('नींव')) {
      return {
        name: 'वास्तु पुरुष / गृह',
        gradient: 'from-amber-950/90 via-emerald-950/60 to-neutral-900',
        border: 'border-amber-700/60 hover:border-emerald-600',
        badge: 'bg-emerald-950 text-emerald-300 border-emerald-800',
        glyph: '🏛️',
        mantra: '॥ ॐ वास्तोष्पते प्रतिजानीह्यस्मान् ॥',
      };
    }
    if (combined.includes('गणेश') || combined.includes('गणपति') || combined.includes('atharva')) {
      return {
        name: 'श्रीगणेश',
        gradient: 'from-orange-950/90 via-amber-950/60 to-neutral-900',
        border: 'border-orange-800/60 hover:border-orange-600',
        badge: 'bg-orange-950 text-orange-400 border-orange-800',
        glyph: '🐘',
        mantra: '॥ ॐ गं गणपतये नमः ॥',
      };
    }
    if (combined.includes('रुद्र') || combined.includes('शिव') || combined.includes('ताण्डव') || combined.includes('शम्भु') || combined.includes('शङ्कर') || combined.includes('शंकर')) {
      return {
        name: 'महादेव शिव',
        gradient: 'from-sky-950/90 via-indigo-950/60 to-neutral-900',
        border: 'border-sky-800/60 hover:border-sky-500',
        badge: 'bg-sky-950 text-sky-300 border-sky-800',
        glyph: '🔱',
        mantra: '॥ ॐ नमः शिवाय ॥',
      };
    }
    if (combined.includes('सप्तशती') || combined.includes('चण्डीपाठ') || combined.includes('देवी माहात्म्यम्')) {
      return {
        name: 'भगवती जगदम्बा (दुर्गासप्तशती)',
        gradient: 'from-rose-950/95 via-red-950/75 to-neutral-900',
        border: 'border-rose-600/70 hover:border-amber-400',
        badge: 'bg-rose-950 text-rose-300 border-rose-800',
        glyph: '🔱',
        mantra: '॥ ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे ॥',
      };
    }
    if (combined.includes('लक्ष्मी') || combined.includes('दुर्गा') || combined.includes('चण्डी') || combined.includes('कुञ्जिका')) {
      return {
        name: 'भगवती दुर्गा / लक्ष्मी',
        gradient: 'from-rose-950/90 via-red-950/60 to-neutral-900',
        border: 'border-rose-800/60 hover:border-rose-500',
        badge: 'bg-rose-950 text-rose-300 border-rose-800',
        glyph: '🪷',
        mantra: '॥ ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः ॥',
      };
    }
    if (combined.includes('पुरुष') || combined.includes('गीता') || combined.includes('कृष्ण') || combined.includes('विष्णु') || combined.includes('नारायण') || combined.includes('गोपिका') || combined.includes('लहरी')) {
      return {
        name: 'श्रीकृष्ण / श्रीहरि',
        gradient: 'from-amber-950/90 via-yellow-950/60 to-neutral-900',
        border: 'border-amber-700/60 hover:border-amber-500',
        badge: 'bg-amber-950 text-amber-300 border-amber-800',
        glyph: '🦚',
        mantra: '॥ ॐ नमो भगवते वासुदेवाय ॥',
      };
    }
    if (combined.includes('भाषापरिच्छेद') || combined.includes('न्याय') || combined.includes('दर्शन') || combined.includes('कारिका')) {
      return {
        name: 'न्याय-दर्शन शास्त्र',
        gradient: 'from-cyan-950/90 via-slate-950/60 to-neutral-900',
        border: 'border-cyan-800/60 hover:border-cyan-500',
        badge: 'bg-cyan-950 text-cyan-300 border-cyan-800',
        glyph: '⚖️',
        mantra: '॥ प्रमाणैरर्थपरीक्षणं न्यायः ॥',
      };
    }
    if (combined.includes('सुभाषित') || combined.includes('नीति') || combined.includes('विनोदिनी')) {
      return {
        name: 'सुभाषित रत्नमाला',
        gradient: 'from-emerald-950/90 via-teal-950/60 to-neutral-900',
        border: 'border-emerald-800/60 hover:border-emerald-500',
        badge: 'bg-emerald-950 text-emerald-300 border-emerald-800',
        glyph: '💎',
        mantra: '॥ सुभाषितं हारि विशुद्धमुत्तमम् ॥',
      };
    }
    if (combined.includes('सूर्य') || combined.includes('आदित्य') || combined.includes('भास्कर')) {
      return {
        name: 'भगवान् सूर्यनारायण',
        gradient: 'from-yellow-950/90 via-orange-950/60 to-neutral-900',
        border: 'border-yellow-700/60 hover:border-yellow-500',
        badge: 'bg-yellow-950 text-yellow-300 border-yellow-800',
        glyph: '☀️',
        mantra: '॥ ॐ घृणिः सूर्याय नमः ॥',
      };
    }
    if (combined.includes('हनुमान') || combined.includes('चालीसा') || combined.includes('बजरंग')) {
      return {
        name: 'श्रीहनुमान जी',
        gradient: 'from-red-950/90 via-orange-950/60 to-neutral-900',
        border: 'border-red-700/60 hover:border-red-500',
        badge: 'bg-red-950 text-red-300 border-red-800',
        glyph: '🚩',
        mantra: '॥ ॐ हनुमते नमः ॥',
      };
    }
    if (combined.includes('विद्यार्णव') || combined.includes('श्रीविद्या') || combined.includes('तन्त्र') || combined.includes('तंत्र') || combined.includes('त्रिपुरसुन्दरी') || combined.includes('ललिता') || combined.includes('कादि') || combined.includes('हादि')) {
      return {
        name: 'श्रीविद्या / शाक्त तन्त्र',
        gradient: 'from-rose-950/95 via-fuchsia-950/70 to-neutral-900',
        border: 'border-fuchsia-700/60 hover:border-rose-400',
        badge: 'bg-fuchsia-950 text-rose-300 border-fuchsia-800',
        glyph: '🌺',
        mantra: '॥ ॐ ऐं ह्रीं श्रीं त्रिपुरसुन्दर्यै नमः ॥',
      };
    }
    if (combined.includes('ग्रह') || combined.includes('नवग्रह') || combined.includes('ग्रहशान्ति')) {
      return {
        name: 'नवग्रह मण्डल',
        gradient: 'from-purple-950/90 via-indigo-950/60 to-neutral-900',
        border: 'border-purple-800/60 hover:border-purple-500',
        badge: 'bg-purple-950 text-purple-300 border-purple-800',
        glyph: '🪐',
        mantra: '॥ ॐ नवग्रहेभ्यो नमः ॥',
      };
    }
    return {
      name: 'वैदिक शास्त्र',
      gradient: 'from-neutral-900 via-neutral-950 to-neutral-900',
      border: 'border-neutral-800 hover:border-neutral-700',
      badge: 'bg-neutral-800 text-neutral-300 border-neutral-700',
      glyph: '📖',
      mantra: '॥ ॐ तत्सत् ॥',
    };
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case 'sa':
        return { text: 'संस्कृतम्', color: 'bg-amber-950 text-amber-300 border-amber-800' };
      case 'hi':
        return { text: 'हिन्दी', color: 'bg-orange-950 text-orange-300 border-orange-800' };
      case 'mixed':
        return { text: 'संस्कृत-हिन्दी', color: 'bg-emerald-950 text-emerald-300 border-emerald-800' };
      default:
        return { text: 'देवनागरी', color: 'bg-blue-950 text-blue-300 border-blue-800' };
    }
  };

  // Filtered Books for Non-Stotra Darshans or 'All'
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      // Exclude test fixture books
      const isTestBook =
        b.title.toLowerCase().includes('test') ||
        b.title.includes('परीक्षण') ||
        b.author === 'Author' ||
        b.description === 'Desc';
      if (isTestBook) return false;

      // Filter by active Darshan
      if (activeDarshan === 'pujavidhi') {
        const isPuja =
          b.title.includes('पूजा') ||
          b.title.includes('पद्धति') ||
          b.title.includes('वास्तु') ||
          b.title.includes('विधान') ||
          b.title.includes('रुद्राष्टाध्यायी') ||
          b.title.includes('सप्तशती') ||
          b.title.includes('चण्डी');
        if (!isPuja) return false;
      } else if (activeDarshan === 'tantra') {
        const isTantra =
          b.title.includes('तन्त्र') ||
          b.title.includes('तंत्र') ||
          b.title.includes('विद्यार्णव') ||
          b.title.includes('शाक्त') ||
          b.title.includes('श्रीविद्या') ||
          b.title.includes('सप्तशती') ||
          b.title.includes('कुञ्जिका');
        if (!isTantra) return false;
      } else if (activeDarshan === 'veda-purana') {
        const isVedaPurana =
          b.title.includes('गीता') ||
          b.title.includes('उपनिषद्') ||
          b.title.includes('संहिता') ||
          b.title.includes('पुराण') ||
          b.title.includes('सहस्रनाम') ||
          b.title.includes('सप्तशती') ||
          b.title.includes('चण्डी');
        if (!isVedaPurana) return false;
      }

      const matchSearch =
        searchTerm.trim() === '' ||
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchSearch;
    });
  }, [books, activeDarshan, searchTerm]);

  const sanitizeDescription = (desc: string): string => {
    if (!desc) return '';
    return desc
      .replace(/\(SanskritDocuments\.org[^)]*\)/gi, '')
      .replace(/SanskritDocuments\.org/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Canonical Darshan Selector Toolbar (Zero Clutter Minimalist Tabs) */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {CANONICAL_DARSHANS.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setActiveDarshan(d.id);
                setSearchTerm('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-devanagari transition-all whitespace-nowrap cursor-pointer ${
                activeDarshan === d.id
                  ? 'bg-amber-600 text-neutral-950 font-bold shadow-lg shadow-amber-950/40 scale-[1.02]'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
              }`}
            >
              <span className="text-base">{d.icon}</span>
              <span>{d.name}</span>
            </button>
          ))}
          <button
            onClick={() => setActiveDarshan('all')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-devanagari transition-all whitespace-nowrap cursor-pointer ${
              activeDarshan === 'all'
                ? 'bg-neutral-700 text-white font-bold'
                : 'bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 border border-neutral-800'
            }`}
          >
            <span>📖</span>
            <span>सम्पूर्ण ग्रन्थ</span>
          </button>
        </div>
      </div>

      {/* 2. STOTRA DARSHAN VIEW (Pure Deity First - Absolutely Zero Publisher Branding) */}
      {activeDarshan === 'stotra' && (
        <div className="space-y-6">
          {/* Sacred Stotra Darshan Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C0A04] via-[#120602] to-[#0D0401] border border-amber-600/30 p-6 sm:p-8 shadow-2xl text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/40 text-amber-300 text-xs font-devanagari">
              <span>🕉️</span>
              <span>विशुद्ध देवतोपासना एवं पावन स्तुति पीठ</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-100 font-serifDevanagari tracking-wide drop-shadow-md">
              स्तोत्र दर्शन
            </h1>
            <p className="text-xs sm:text-sm text-sacred-400/90 font-serifDevanagari tracking-wider italic">
              ॥ यस्य स्मरणमात्रेण जन्मसंसारबन्धनात् । विमुच्यते नमस्तस्मै विष्णवे प्रभविष्णवे ॥
            </p>
            <p className="text-xs text-amber-200/70 font-devanagari max-w-xl mx-auto">
              समस्त आराध्य देवी-देवताओं के प्रामाणिक स्तोत्र, कवच, सहस्रनाम एवं अष्टक — किसी प्रकाशक के बिना, विशुद्ध देव-आराधना हेतु।
            </p>
          </div>

          {/* Deity Selector Filter Pills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-devanagari px-1">
              <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                <span>🔱</span>
                <span>देवता चुनें:</span>
              </span>
              <span className="font-mono text-amber-300/80">{stotrasList.length} स्तोत्र उपलब्ध</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-800">
              <button
                onClick={() => setStotraDeity('all')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-devanagari whitespace-nowrap transition-all border cursor-pointer ${
                  stotraDeity === 'all'
                    ? 'bg-amber-600 text-neutral-950 font-bold border-amber-500 shadow-md'
                    : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <DeitySvgIcon deityId="all" size={17} />
                <span>समस्त देवता</span>
              </button>
              {CANONICAL_DEITIES.map((deity) => (
                <button
                  key={deity.id}
                  onClick={() => setStotraDeity(deity.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-devanagari whitespace-nowrap transition-all border cursor-pointer ${
                    stotraDeity === deity.id
                      ? `${deity.badge} font-bold ring-2 ring-amber-500/50 shadow-md`
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <DeitySvgIcon deityId={deity.id} size={17} />
                  <span>{deity.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Liturgical Genre Filter Pills (कवच, अष्टकम्, पञ्चकम्, मानसपूजा, शतनाम/सहस्रनाम, हृदयम्, स्तोत्र) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-devanagari px-1">
              <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                <span>🪷</span>
                <span>स्तोत्र विधा / प्रकार:</span>
              </span>
              <span className="text-[11px] text-neutral-400">
                {selectedGenre === 'all'
                  ? 'समस्त विधाएँ प्रदर्शित'
                  : CANONICAL_STOTRA_GENRES.find((g) => g.id === selectedGenre)?.name}
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-neutral-800">
              {CANONICAL_STOTRA_GENRES.map((genre) => {
                const count = genreCounts[genre.id] || 0;
                const isSelected = selectedGenre === genre.id;
                return (
                  <button
                    key={genre.id}
                    onClick={() => setSelectedGenre(genre.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-devanagari whitespace-nowrap transition-all border cursor-pointer ${
                      isSelected
                        ? `${genre.badge} font-bold ring-2 ring-amber-500/60 shadow-md scale-[1.02]`
                        : count === 0
                        ? 'bg-neutral-900/40 text-neutral-500 border-neutral-800/60 opacity-60'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-neutral-100'
                    }`}
                  >
                    <span>{genre.icon}</span>
                    <span>{genre.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected
                          ? 'bg-amber-400/20 text-amber-200'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stotra Search & Layout Toggle Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={stotraSearch}
                onChange={(e) => setStotraSearch(e.target.value)}
                placeholder="स्तोत्र का नाम खोजें (उदा. 'रुद्राष्टकम्', 'शिवमहिम्नः', 'कनकधारा', 'विष्णुसहस्रनाम')..."
                className="w-full pl-10 pr-10 py-3 bg-neutral-950 text-neutral-100 placeholder-neutral-500 border border-neutral-800 rounded-2xl text-xs sm:text-sm font-devanagari focus:outline-none focus:border-amber-500 shadow-inner"
              />
              {stotraSearch && (
                <button
                  onClick={() => setStotraSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1 shrink-0 self-end sm:self-auto">
              <button
                onClick={() => setStotraLayout('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-devanagari transition-all cursor-pointer ${
                  stotraLayout === 'grid'
                    ? 'bg-amber-600 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="ग्रिड दृश्य (Grid View)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ग्रिड</span>
              </button>
              <button
                onClick={() => setStotraLayout('compact')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-devanagari transition-all cursor-pointer ${
                  stotraLayout === 'compact'
                    ? 'bg-amber-600 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="सघन सूची (Compact List View)"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">सघन सूची</span>
              </button>
            </div>
          </div>

          {/* Mahagrantha Highlight: Srimad Durga Saptashati */}
          {(stotraDeity === 'devi' || stotraDeity === 'all') && !stotraSearch.trim() && selectedGenre === 'all' && (
            <div
              onClick={() => onSelectBookForReading('granth-durga-saptashati', 1)}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/90 via-red-950/70 to-neutral-900 border-2 border-rose-600/60 hover:border-amber-400 p-5 sm:p-6 shadow-2xl transition-all duration-300 hover:scale-[1.01] cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-900/40 border border-rose-500/40 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                    🔱
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-700/60 text-[11px] font-devanagari font-bold">
                        महाग्रन्थ पारायण
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/60 text-[11px] font-devanagari font-bold">
                        ७०० मन्त्र • १३ अध्याय
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 text-[11px] font-devanagari font-bold">
                        पूर्वाङ्ग व उत्तराङ्ग सहित
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-serifDevanagari text-white group-hover:text-amber-200 transition-colors">
                      श्रीदुर्गासप्तशती (चण्डीपाठ / देवी माहात्म्यम्)
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 font-devanagari">
                      मार्कण्डेयपुराणान्तर्गत सम्पूर्ण ७०० मन्त्र, त्रिमूर्ति-चरित्र, कवच, अर्गला, कीलक, रात्रिसूक्त, नवार्ण मन्त्र, देव्यपराधक्षमापन एवं सिद्धकुञ्जिकास्तोत्रम्।
                    </p>
                  </div>
                </div>
                <div className="self-end sm:self-center shrink-0">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 group-hover:bg-rose-500 text-white font-devanagari font-bold text-xs sm:text-sm shadow-lg group-hover:scale-105 transition-all">
                    <span>सम्पूर्ण पाठ खोलें</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stotras Content */}
          {stotrasList.length === 0 ? (
            <div className="bg-neutral-900/40 border border-dashed border-neutral-800 rounded-3xl p-12 text-center space-y-3">
              <span className="text-3xl">🪔</span>
              <p className="text-sm text-neutral-300 font-devanagari">
                कोई स्तोत्र नहीं मिला।
              </p>
            </div>
          ) : stotraLayout === 'grid' ? (
            /* 1. Grid View: Sacred Pothi Tiles */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stotrasList.map((item) => {
                const deity = getDeityById(item.deityId);
                const genreInfo = CANONICAL_STOTRA_GENRES.find(
                  (g) => g.id === (item.genre || classifyStotraGenre(item.title))
                );
                const handleRead = () => {
                  if (item.isCustom && onSelectCustomStotra) {
                    onSelectCustomStotra(item);
                  } else {
                    onSelectBookForReading(
                      'granth-brihat-stotra-ratnakar',
                      item.pdfPage || 1,
                      item.id
                    );
                  }
                };

                return (
                  <div
                    key={String(item.id)}
                    onClick={handleRead}
                    className="p-5 rounded-2xl bg-gradient-to-b from-[#18120B] via-[#120D07] to-[#0A0704] border border-amber-900/40 hover:border-amber-500/80 hover:bg-[#1A130C] transition-all duration-200 flex flex-col justify-between group shadow-lg hover:shadow-2xl hover:shadow-amber-950/40 hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                  >
                    {/* Corner Sacred Gradient */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-600/10 to-transparent pointer-events-none rounded-bl-3xl" />

                    <div>
                      {/* Top Meta: Deity, Genre & Folio */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 font-medium flex items-center gap-1.5 font-devanagari shadow-xs">
                            <DeitySvgIcon deityId={item.deityId} size={15} />
                            <span>{deity?.name || 'स्तोत्र'}</span>
                          </span>
                          {genreInfo && genreInfo.id !== 'all' && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-devanagari flex items-center gap-1 ${genreInfo.badge}`}>
                              <span>{genreInfo.icon}</span>
                              <span>{genreInfo.name}</span>
                            </span>
                          )}
                        </div>
                        {String(item.id).startsWith('supp-') ? (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/70 font-devanagari font-semibold">
                            📜 प्रामाणिक पाठ
                          </span>
                        ) : item.isCustom ? (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-devanagari font-semibold">
                            ✨ स्वनिर्मित
                          </span>
                        ) : (
                          <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1 shrink-0">
                            <BookOpen className="w-3 h-3 text-amber-500/70" />
                            <span>पत्र {item.pdfPage || item.bookPage || 1}</span>
                          </span>
                        )}
                      </div>

                      {/* Stotra Title */}
                      <h3 className="text-lg sm:text-xl font-bold text-amber-50 font-serifDevanagari group-hover:text-amber-300 transition-colors leading-snug tracking-wide">
                        {item.title}
                      </h3>

                      {item.author && (
                        <p className="text-xs text-neutral-400 mt-1.5 font-devanagari flex items-center gap-1">
                          <span className="text-neutral-500">रचयिता:</span>
                          <span className="text-amber-200/80">{item.author}</span>
                        </p>
                      )}
                    </div>

                    {/* Bottom Action Indicator */}
                    <div className="mt-5 pt-3 border-t border-amber-950/80 flex items-center justify-between">
                      <span className="text-xs text-amber-600/70 font-serifDevanagari">
                        ॥ शास्त्रोक्त पाठ ॥
                      </span>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 group-hover:bg-amber-600 border border-amber-800/50 group-hover:border-amber-400 text-amber-300 group-hover:text-neutral-950 text-xs font-semibold font-devanagari transition-all shadow-sm">
                        <Eye className="w-3.5 h-3.5" />
                        <span>पठन करें</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* 2. Compact List View: Swift Parayana Anukramanika */
            <div className="bg-neutral-950/80 border border-amber-900/30 rounded-2xl divide-y divide-neutral-900 overflow-hidden shadow-xl">
              {stotrasList.map((item, idx) => {
                const deity = getDeityById(item.deityId);
                const genreInfo = CANONICAL_STOTRA_GENRES.find(
                  (g) => g.id === (item.genre || classifyStotraGenre(item.title))
                );
                const handleRead = () => {
                  if (item.isCustom && onSelectCustomStotra) {
                    onSelectCustomStotra(item);
                  } else {
                    onSelectBookForReading(
                      'granth-brihat-stotra-ratnakar',
                      item.pdfPage || 1,
                      item.id
                    );
                  }
                };

                return (
                  <div
                    key={String(item.id)}
                    onClick={handleRead}
                    className="p-3 sm:px-5 hover:bg-neutral-900/90 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono text-neutral-500 w-7 text-right shrink-0">
                        #{idx + 1}
                      </span>
                      <DeitySvgIcon deityId={item.deityId} size={19} className="shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-amber-100 font-serifDevanagari group-hover:text-amber-300 truncate">
                            {item.title}
                          </h4>
                          {genreInfo && genreInfo.id !== 'all' && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-md border font-devanagari shrink-0 hidden sm:inline-flex items-center gap-1 ${genreInfo.badge}`}>
                              <span>{genreInfo.icon}</span>
                              <span>{genreInfo.sanskritName}</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-400 font-devanagari">
                          {deity?.name || 'स्तोत्र'}
                          {item.author ? ` • ${item.author}` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-neutral-400">
                        {String(item.id).startsWith('supp-') ? '📜 प्रामाणिक' : `पत्र ${item.pdfPage || item.bookPage || 1}`}
                      </span>
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-neutral-900 group-hover:bg-amber-600 border border-neutral-800 group-hover:border-amber-400 text-neutral-300 group-hover:text-neutral-950 text-xs font-devanagari font-medium transition-all">
                        <span>पढ़ें</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. NON-STOTRA DARSHANS & ALL BOOKS GRID */}
      {activeDarshan !== 'stotra' && (
        <div className="space-y-6">
          {/* Darshan Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1208] via-[#100C06] to-[#0A0804] border border-amber-700/30 p-6 sm:p-8 shadow-2xl text-center space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-100 font-serifDevanagari">
              {activeDarshan === 'pujavidhi' && 'पूजाविधि दर्शन'}
              {activeDarshan === 'tantra' && 'तन्त्र दर्शन'}
              {activeDarshan === 'veda-purana' && 'वेद-पुराण दर्शन'}
              {activeDarshan === 'all' && 'सम्पूर्ण शास्त्र ग्रन्थालय'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-devanagari max-w-xl mx-auto">
              {activeDarshan === 'pujavidhi' && 'नित्यकर्म, सन्ध्यावन्दन, पंचोपचार, षोडशोपचार पूजा एवं अभिषेक विधान।'}
              {activeDarshan === 'tantra' && 'आगम, महाविद्या, श्रीविद्या, यन्त्र-उपासना एवं मन्त्र-न्यास शास्त्र।'}
              {activeDarshan === 'veda-purana' && 'श्रुति, उपनिषदः, श्रीमद्भगवद्गीता, महाभारत एवं पुराण।'}
              {activeDarshan === 'all' && 'ग्रन्थालय के समस्त पावन ग्रन्थ एवं पाण्डुलिपियाँ।'}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ग्रन्थ, ऋषि या मन्त्र खोजें..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 text-neutral-100 placeholder-neutral-500 border border-neutral-800 rounded-xl text-xs sm:text-sm font-devanagari focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Books Grid */}
          {filteredBooks.length === 0 ? (
            <div className="bg-neutral-900/40 border border-dashed border-neutral-800 rounded-3xl p-12 text-center space-y-3">
              <span className="text-3xl">📖</span>
              <p className="text-sm text-neutral-300 font-devanagari">
                इस वर्ग में कोई ग्रन्थ नहीं मिला।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredBooks.map((book) => {
                const deity = getDeityTheme(book.title, book.description);
                const lang = getLanguageLabel(book.language);

                // Clean display title without publisher or book names
                const displayTitle = book.id === 'granth-brihat-stotra-ratnakar'
                  ? 'स्तोत्र दर्शन • सर्वदेव स्तुति संग्रह'
                  : book.title.replace(/\s*\([^)]*गीताप्रेस[^)]*\)/gi, '').trim();

                return (
                  <div
                    key={book.id}
                    className={`bg-gradient-to-b ${deity.gradient} border ${deity.border} rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden`}
                  >
                    <div>
                      {/* Top Bar: Deity Badge & Language */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold flex items-center space-x-1 ${deity.badge}`}>
                          <span>{deity.glyph}</span>
                          <span>{deity.name}</span>
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${lang.color}`}>
                          {lang.text}
                        </span>
                      </div>

                      {/* Grantha Title */}
                      <h3 className="text-lg font-bold text-neutral-100 font-serifDevanagari line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors">
                        {displayTitle}
                      </h3>

                      {/* Author / Rishi */}
                      <p className="text-xs text-neutral-400 mt-1 font-devanagari flex items-center space-x-1">
                        <span className="text-neutral-500">दृष्टा / रचयिता:</span>
                        <span className="text-neutral-300 font-medium">{book.author || 'पारंपरिक महर्षि'}</span>
                      </p>

                      {/* Description */}
                      {book.description && (
                        <p className="text-xs text-neutral-400/90 mt-2.5 font-devanagari line-clamp-3 leading-relaxed bg-neutral-950/40 p-2.5 rounded-xl border border-neutral-800/60">
                          {sanitizeDescription(book.description)}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 font-devanagari px-1">
                        <span className="flex items-center space-x-1.5 font-mono text-amber-300/80">
                          <BookOpen className="w-3 h-3 text-amber-400" />
                          <span>{book.page_count} पत्र</span>
                        </span>
                        <span className="text-amber-400/80 font-medium">
                          ✓ प्रामाणिक पाठ
                        </span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectBookForReading(book.id)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sacred-600 to-amber-600 hover:from-sacred-500 hover:to-amber-500 text-white text-xs font-bold shadow-md shadow-sacred-950 transition-all font-devanagari active:scale-95 cursor-pointer"
                        title="पावन ग्रन्थ पठन प्रारम्भ करें"
                      >
                        <Eye className="w-4 h-4" />
                        <span>पठन मोड (Read)</span>
                      </button>

                      {/* Export Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setExportDropdown(exportDropdown === book.id ? null : book.id)}
                          className="p-2.5 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 bg-neutral-900 border border-neutral-700/80 transition-all cursor-pointer"
                          title="ग्रन्थ निर्यात (Export)"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {exportDropdown === book.id && (
                          <div className="absolute right-0 bottom-full mb-2 w-52 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl py-2 z-30 font-devanagari animate-in fade-in zoom-in-95">
                            <div className="px-3 py-1 text-[11px] font-semibold text-amber-400 border-b border-neutral-800">
                              निर्यात प्रारूप चुनें:
                            </div>
                            <button
                              onClick={() => {
                                onExport(book.id, 'txt');
                                setExportDropdown(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-800 flex items-center space-x-2 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-amber-400" />
                              <span>Plain Text (Unicode UTF-8)</span>
                            </button>
                            <button
                              onClick={() => {
                                onExport(book.id, 'docx');
                                setExportDropdown(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-800 flex items-center space-x-2 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-400" />
                              <span>Word Document (.DOCX)</span>
                            </button>
                            <button
                              onClick={() => {
                                onExport(book.id, 'pdf');
                                setExportDropdown(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-800 flex items-center space-x-2 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-red-400" />
                              <span>Preservation PDF (सस्वर)</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
