import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Trash2,
  Eye,
  Edit3,
  Calendar,
  Layers,
  Sparkles,
  Upload,
  Search,
  Filter,
  Flame,
  Sun,
  Shield,
  Scroll,
} from 'lucide-react';
import type { Book, BookStats } from '../../shared/types.js';

interface LibraryViewProps {
  books: Book[];
  stats: BookStats | null;
  onSelectBookForVerification: (bookId: string) => void;
  onSelectBookForReading: (bookId: string) => void;
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
  onDeleteBook,
  onOpenUpload,
  onExport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDeity, setSelectedDeity] = useState<string>('all');
  const [exportDropdown, setExportDropdown] = useState<string | null>(null);

  const getDeityTheme = (title: string, desc: string): DeityTheme => {
    const combined = `${title} ${desc}`.toLowerCase();
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
    if (combined.includes('लक्ष्मी') || combined.includes('दुर्गा') || combined.includes('चण्डी') || combined.includes('कुञ्जिका') || combined.includes('सप्तशती')) {
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
    if (combined.includes('ग्रह') || combined.includes('नवग्रह') || combined.includes('पद्धति')) {
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

  // Filtered Books
  const filteredBooks = useMemo(() => {
    return books.filter(b => {
      const matchSearch =
        searchTerm.trim() === '' ||
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'upanishad' && b.title.includes('उपनिषत्')) ||
        (selectedCategory === 'sukta' && (b.title.includes('सूक्तम्') || b.title.includes('सूक्त'))) ||
        (selectedCategory === 'ashtaka' && (b.title.includes('अष्टक') || b.description.includes('अष्टक'))) ||
        (selectedCategory === 'stotra' && (b.title.includes('स्तोत्र') || b.title.includes('चालीसा') || b.title.includes('लहरी') || b.title.includes('गीतम्') || b.title.includes('अष्टक'))) ||
        (selectedCategory === 'shastra' && (b.title.includes('भाषापरिच्छेद') || b.title.includes('सुभाषित') || b.description.includes('दर्शन') || b.description.includes('नीति'))) ||
        (selectedCategory === 'puja_vidhi' && (b.title.includes('पद्धति') || b.title.includes('पूजा') || b.title.includes('रुद्राष्टाध्यायी'))) ||
        (selectedCategory === 'gita' && b.title.includes('गीता'));

      const deityTheme = getDeityTheme(b.title, b.description);
      const matchDeity =
        selectedDeity === 'all' ||
        (selectedDeity === 'ganesha' && deityTheme.name.includes('गणेश')) ||
        (selectedDeity === 'vastu' && deityTheme.name.includes('वास्तु')) ||
        (selectedDeity === 'shiva' && (deityTheme.name.includes('शिव') || deityTheme.name.includes('शङ्कर'))) ||
        (selectedDeity === 'devi' && (deityTheme.name.includes('दुर्गा') || deityTheme.name.includes('लक्ष्मी'))) ||
        (selectedDeity === 'krishna' && (deityTheme.name.includes('कृष्ण') || deityTheme.name.includes('हरि') || deityTheme.name.includes('विष्णु'))) ||
        (selectedDeity === 'darshana' && (deityTheme.name.includes('दर्शन') || deityTheme.name.includes('सुभाषित') || deityTheme.name.includes('शास्त्र'))) ||
        (selectedDeity === 'surya' && deityTheme.name.includes('सूर्य')) ||
        (selectedDeity === 'hanuman' && deityTheme.name.includes('हनुमान')) ||
        (selectedDeity === 'navagraha' && deityTheme.name.includes('नवग्रह'));

      return matchSearch && matchCategory && matchDeity;
    });
  }, [books, searchTerm, selectedCategory, selectedDeity]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header & Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sacred-950 via-neutral-900 to-maroon-950 border border-sacred-800/60 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 opacity-10 text-[180px] select-none pointer-events-none font-serifDevanagari text-sacred-400">
          ॐ
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sacred-950 border border-sacred-700/80 text-sacred-300 text-xs font-semibold tracking-wide font-devanagari">
              <Sparkles className="w-3.5 h-3.5" />
              <span>सत्यापित सनातन शास्त्र भण्डार • SanskritDocuments.org Standard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-100 font-serifDevanagari tracking-wide">
              सनातन प्रामाणिक पूजा ग्रन्थालय
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 font-devanagari leading-relaxed">
              सत्यापित वैदिक सूक्त, उपनिषद्, स्तोत्र, पूजापद्धति एवं नित्य कर्मकाण्ड मन्त्र संग्रह — मूल पाण्डुलिपि एवं अक्षर-सत्यता के साथ।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onOpenUpload}
              className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sacred-600 via-sacred-500 to-amber-600 hover:from-sacred-500 hover:to-amber-500 text-white font-bold shadow-xl shadow-sacred-950/80 border border-sacred-300/40 transition-all hover:scale-[1.03] active:scale-[0.98] font-devanagari text-sm"
            >
              <Upload className="w-4 h-4" />
              <span>नया ग्रन्थ / PDF जोड़ें</span>
            </button>
          </div>
        </div>

        {/* Quick Grantha Count Strip */}
        <div className="mt-6 pt-6 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-devanagari text-neutral-300">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span><strong>{books.length}</strong> पावन ग्रन्थ उपलब्ध</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-sacred-400" />
            <span><strong>{stats?.total_pages || 0}</strong> मन्त्र पृष्ठ</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span><strong>{stats?.verification_percentage || 0}%</strong> अक्षर शुद्धता प्रमाणित</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>वैदिक सस्वर पाठ समर्थित</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-4 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="ग्रन्थ, ऋषि, देवता या मन्त्र खोजें..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 text-neutral-100 placeholder-neutral-500 border border-neutral-800 rounded-xl text-xs font-devanagari focus:outline-none focus:border-sacred-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 text-xs font-devanagari">
            {[
              { id: 'all', label: 'सभी ग्रन्थ' },
              { id: 'upanishad', label: 'उपनिषद्' },
              { id: 'sukta', label: 'सूक्तम्' },
              { id: 'ashtaka', label: 'अष्टकम्' },
              { id: 'stotra', label: 'स्तोत्र एवं स्तुति' },
              { id: 'shastra', label: 'दर्शन व सुभाषित' },
              { id: 'puja_vidhi', label: 'पूजापद्धति' },
              { id: 'gita', label: 'गीता' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-sacred-600 text-white shadow-md'
                    : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Deity Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-neutral-800/80 text-[11px] font-devanagari">
          <span className="text-neutral-500 font-semibold flex items-center space-x-1 shrink-0">
            <Filter className="w-3 h-3" />
            <span>देवता / विषय:</span>
          </span>
          {[
            { id: 'all', label: 'सभी देव व विषय' },
            { id: 'ganesha', label: 'श्रीगणेश 🐘' },
            { id: 'vastu', label: 'वास्तु पुरुष 🏛️' },
            { id: 'shiva', label: 'देवाधिदेव शिव 🔱' },
            { id: 'krishna', label: 'श्रीकृष्ण / श्रीहरि 🦚' },
            { id: 'devi', label: 'भगवती दुर्गा / लक्ष्मी 🪷' },
            { id: 'darshana', label: 'दर्शन व नीति ⚖️' },
            { id: 'surya', label: 'भगवान् सूर्यदेव ☀️' },
            { id: 'hanuman', label: 'श्रीहनुमान 🚩' },
            { id: 'navagraha', label: 'नवग्रह मण्डल 🪐' },
          ].map(chip => (
            <button
              key={chip.id}
              onClick={() => setSelectedDeity(chip.id)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all border ${
                selectedDeity === chip.id
                  ? 'bg-sacred-950 text-sacred-300 border-sacred-700 font-bold'
                  : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="bg-neutral-900/40 border border-dashed border-neutral-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-sacred-950/60 border border-sacred-800 mx-auto flex items-center justify-center text-sacred-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-neutral-200 font-devanagari">
            कोई ग्रन्थ इस फ़िल्टर में नहीं मिला
          </h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto font-devanagari">
            कृपया अन्य श्रेणी चुनें अथवा नया ग्रन्थ PDF अपलोड करें।
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedDeity('all');
            }}
            className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-200 text-xs hover:bg-neutral-700 font-devanagari"
          >
            फ़िल्टर रीसेट करें
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredBooks.map(book => {
            const deity = getDeityTheme(book.title, book.description);
            const lang = getLanguageLabel(book.language);
            const verifiedCount = book.verified_pages || 0;
            const progressPct = book.page_count > 0 ? Math.round((verifiedCount / book.page_count) * 100) : 100;

            return (
              <div
                key={book.id}
                className={`bg-gradient-to-b ${deity.gradient} border ${deity.border} rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden`}
              >
                {/* Background Sacred Glyph Watermark */}
                <div className="absolute top-2 right-3 text-5xl opacity-15 select-none pointer-events-none transition-transform group-hover:scale-125">
                  {deity.glyph}
                </div>

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

                  {/* Sacred Mantra Header */}
                  <p className="text-[11px] text-sacred-400/90 font-serifDevanagari tracking-wider mb-1">
                    {deity.mantra}
                  </p>

                  {/* Grantha Title */}
                  <h3 className="text-lg font-bold text-neutral-100 font-serifDevanagari line-clamp-2 leading-snug group-hover:text-sacred-300 transition-colors">
                    {book.title}
                  </h3>

                  {/* Author / Rishi */}
                  <p className="text-xs text-neutral-400 mt-1 font-devanagari flex items-center space-x-1">
                    <span className="text-neutral-500">दृष्टा / रचयिता:</span>
                    <span className="text-neutral-300 font-medium">{book.author || 'पारंपरिक महर्षि'}</span>
                  </p>

                  {/* Grantha Description */}
                  {book.description && (
                    <p className="text-xs text-neutral-400/90 mt-2.5 font-devanagari line-clamp-2 leading-relaxed bg-neutral-950/40 p-2 rounded-xl border border-neutral-800/60">
                      {book.description}
                    </p>
                  )}

                  {/* Verification Status & Progress Strip */}
                  <div className="mt-4 p-3 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs text-neutral-400 font-devanagari">
                      <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>पूर्ण प्रमाणित (Verified)</span>
                      </span>
                      <span className="font-mono text-neutral-200">
                        {book.page_count} पृष्ठ ({progressPct}%)
                      </span>
                    </div>

                    <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-sacred-500 to-emerald-400 h-1.5 rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-500 font-devanagari pt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(book.created_at).toLocaleDateString('hi-IN')}</span>
                      </span>
                      <span className="text-sacred-400/80 font-medium">
                        ✓ विनियोग • न्यास • ध्यानम्
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSelectBookForReading(book.id)}
                      className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-sacred-600 hover:bg-sacred-500 text-white text-xs font-bold shadow-md shadow-sacred-950 transition-all font-devanagari active:scale-95"
                      title="स्वच्छ सुपाठ्य ग्रन्थ पठन मोड"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>पठन मोड (Read)</span>
                    </button>

                    <button
                      onClick={() => onSelectBookForVerification(book.id)}
                      className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-all font-devanagari"
                      title="मूल स्कैन एवं पाठ सत्यापन कार्यपीठ"
                    >
                      <Shield className="w-3.5 h-3.5 text-sacred-400" />
                      <span>सत्यापन</span>
                    </button>
                  </div>

                  {/* Export & Delete Dropdown */}
                  <div className="flex items-center space-x-1 relative">
                    <div className="relative">
                      <button
                        onClick={() => setExportDropdown(exportDropdown === book.id ? null : book.id)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800 transition-colors"
                        title="ग्रन्थ निर्यात (Export)"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {exportDropdown === book.id && (
                        <div className="absolute right-0 bottom-full mb-2 w-52 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl py-2 z-30 font-devanagari animate-in fade-in zoom-in-95">
                          <div className="px-3 py-1 text-[11px] font-semibold text-sacred-400 border-b border-neutral-800">
                            निर्यात प्रारूप चुनें:
                          </div>
                          <button
                            onClick={() => {
                              onExport(book.id, 'txt');
                              setExportDropdown(null);
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-800 flex items-center space-x-2"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-400" />
                            <span>Plain Text (Unicode UTF-8)</span>
                          </button>
                          <button
                            onClick={() => {
                              onExport(book.id, 'docx');
                              setExportDropdown(null);
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-800 flex items-center space-x-2"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-400" />
                            <span>Word Document (.DOCX)</span>
                          </button>
                          <button
                            onClick={() => {
                              onExport(book.id, 'pdf');
                              setExportDropdown(null);
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-800 flex items-center space-x-2"
                          >
                            <Download className="w-3.5 h-3.5 text-red-400" />
                            <span>Preservation PDF (सस्वर)</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`क्या आप सचमुच "${book.title}" को हटाना चाहते हैं?`)) {
                          onDeleteBook(book.id);
                        }
                      }}
                      className="p-2 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-neutral-800 border border-neutral-800 transition-colors"
                      title="ग्रन्थ हटाएं"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
