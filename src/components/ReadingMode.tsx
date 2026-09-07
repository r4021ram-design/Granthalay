import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Type,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  Scroll,
  Image as ImageIcon,
  Sparkles,
  Sliders,
  ZoomIn,
  ZoomOut,
  Split
} from 'lucide-react';
import { api } from '../api.js';
import { devanagariToIast } from '../utils/transliteration.js';
import { generatePadachheda } from '../utils/padachheda.js';
import type { Book, Page } from '../../shared/types.js';

interface ReadingModeProps {
  bookId: string;
  onBack: () => void;
  onOpenVerification: (bookId: string) => void;
}

type ReadingTheme = 'bhojpatra' | 'golden-birch' | 'dark-slate' | 'ivory-white';
type ScriptureFont = 'tiro' | 'yatra' | 'rozha' | 'notoSerif' | 'notoSans';
type LineHeightOption = 'compact' | 'normal' | 'relaxed';

export const ReadingMode: React.FC<ReadingModeProps> = ({
  bookId,
  onBack,
  onOpenVerification,
}) => {
  const [book, setBook] = useState<Book | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(22);
  const [lineHeight, setLineHeight] = useState<LineHeightOption>('compact');
  const [fontFamily, setFontFamily] = useState<ScriptureFont>('tiro');
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>('bhojpatra');
  const [scriptMode, setScriptMode] = useState<'devanagari' | 'iast'>('devanagari');
  const [viewMode, setViewMode] = useState<'text' | 'split' | 'scan'>('text');
  const [isPadachhedaMode, setIsPadachhedaMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadBook() {
      try {
        setIsLoading(true);
        const data = await api.getBook(bookId);
        setBook(data.book);
        setPages(data.pages);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    }
    loadBook();
  }, [bookId]);

  if (isLoading || !book) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-sacred-500/20 border-t-sacred-500 animate-spin" />
        <p className="text-sm text-sacred-300 font-devanagari animate-pulse">पावन ग्रन्थ एवं भोजपत्र पाण्डुलिपि लोड हो रही है...</p>
      </div>
    );
  }

  const currentPage = pages[currentPageIndex];

  const getLineHeightClass = () => {
    switch (lineHeight) {
      case 'relaxed': return 'leading-[1.9]';
      case 'normal': return 'leading-[1.6]';
      case 'compact':
      default: return 'leading-[1.38]';
    }
  };

  const getFontFamilyStyle = (): React.CSSProperties => {
    if (scriptMode === 'iast') {
      return { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' };
    }
    switch (fontFamily) {
      case 'tiro':
        return { fontFamily: '"Tiro Devanagari Sanskrit", "Noto Serif Devanagari", serif' };
      case 'yatra':
        return { fontFamily: '"Yatra One", "Noto Serif Devanagari", cursive, serif' };
      case 'rozha':
        return { fontFamily: '"Rozha One", "Noto Serif Devanagari", serif' };
      case 'notoSerif':
        return { fontFamily: '"Noto Serif Devanagari", serif' };
      case 'notoSans':
      default:
        return { fontFamily: '"Noto Sans Devanagari", "Yantramanav", sans-serif' };
    }
  };

  // Outer container theme
  const getOuterThemeClass = () => {
    switch (readingTheme) {
      case 'bhojpatra':
        return 'bg-[#21130B] text-[#2B1810]';
      case 'golden-birch':
        return 'bg-[#2C180B] text-[#341B0E]';
      case 'dark-slate':
        return 'bg-[#0F0D0B] text-[#F5E6CC]';
      case 'ivory-white':
        return 'bg-[#EAE4D8] text-[#1E1B18]';
    }
  };

  // Manuscript sheet styling with authentic Bhojpatra textures
  const getPothiSheetStyle = () => {
    switch (readingTheme) {
      case 'bhojpatra':
        return {
          backgroundColor: '#F5ECD4',
          backgroundImage: `
            radial-gradient(ellipse at top left, rgba(255, 253, 245, 0.8) 0%, transparent 60%),
            radial-gradient(ellipse at bottom right, rgba(200, 165, 110, 0.45) 0%, transparent 65%),
            repeating-linear-gradient(0deg, transparent, transparent 38px, rgba(130, 75, 25, 0.05) 39px, transparent 41px),
            repeating-linear-gradient(90deg, transparent, transparent 200px, rgba(160, 95, 45, 0.035) 201px, transparent 203px)
          `,
          color: '#2A170E',
          borderColor: '#8C2D19',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.7), inset 0 0 70px rgba(130, 75, 25, 0.18)',
        };
      case 'golden-birch':
        return {
          backgroundColor: '#EED9A7',
          backgroundImage: `
            radial-gradient(ellipse at top right, rgba(255, 248, 220, 0.8) 0%, transparent 60%),
            radial-gradient(ellipse at bottom left, rgba(185, 140, 80, 0.5) 0%, transparent 70%),
            repeating-linear-gradient(0deg, transparent, transparent 32px, rgba(110, 60, 15, 0.06) 33px, transparent 35px)
          `,
          color: '#261307',
          borderColor: '#9E3A1A',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.7), inset 0 0 70px rgba(120, 65, 15, 0.22)',
        };
      case 'dark-slate':
        return {
          backgroundColor: '#181310',
          backgroundImage: `
            radial-gradient(ellipse at top center, rgba(60, 35, 18, 0.4) 0%, transparent 70%),
            repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(230, 160, 80, 0.02) 41px, transparent 42px)
          `,
          color: '#F4E4C6',
          borderColor: '#C25A2A',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), inset 0 0 80px rgba(0, 0, 0, 0.8)',
        };
      case 'ivory-white':
        return {
          backgroundColor: '#FCFAF4',
          backgroundImage: 'none',
          color: '#1A1815',
          borderColor: '#9E3A1A',
          boxShadow: '0 20px 45px -10px rgba(0,0,0,0.2), inset 0 0 40px rgba(0, 0, 0, 0.04)',
        };
    }
  };

  // Clean and normalize scripture text (rejoining orphan matras to prevent dotted circles, fixing font anomalies)
  const sanitizeScriptureText = (text: string): string => {
    if (!text) return '';
    let s = text;

    // 1. Kruti-Dev legacy font fixes (where 'र्' was exported for 'त' and 'व' for chhoti 'i' matra)
    s = s.replace(/र्\s*ौर/gu, 'तौर');
    s = s.replace(/\bर्ौर\b/gu, 'तौर');
    s = s.replace(/र्\s*ीन/gu, 'तीन');
    s = s.replace(/\bर्ीन\b/gu, 'तीन');
    s = s.replace(/र्\s*था/gu, 'तथा');
    s = s.replace(/\bर्था\b/gu, 'तथा');
    s = s.replace(/र्\s*क\b/gu, 'तक');
    s = s.replace(/\bबार्\b/gu, 'बात');
    s = s.replace(/हो\s*र्\s*ो|हो\s*र्ो|\bहोर\b/gu, 'हो तो');
    s = s.replace(/हो\s*र्\s*([ाेी])/gu, 'होत$1');
    s = s.replace(/कह\s*र्\s*([ाेी])/gu, 'कहत$1');
    s = s.replace(/कर\s*र्\s*([ाेी])/gu, 'करत$1');
    s = s.replace(/सक\s*र्\s*([ाेी])/gu, 'सकत$1');
    s = s.replace(/जा\s*र्\s*([ाेी])/gu, 'जात$1');
    s = s.replace(/दे\s*र्\s*([ाेी])/gu, 'देत$1');
    s = s.replace(/रह\s*र्\s*([ाेी])/gu, 'रहत$1');
    s = s.replace(/वमल\s*र्\s*([ाेी])/gu, 'मिलत$1');
    s = s.replace(/सिंकेर्/gu, 'संकेत');

    s = s.replace(/उवचर्\s*है|उवचर्है/gu, 'उचित है');
    s = s.replace(/उवचर्/gu, 'उचित');
    s = s.replace(/नूर्\s*न|नूर्न|नुर्न/gu, 'नूतन');
    s = s.replace(/जीर्\s*त|जीर्त|जीत़|जीिय/gu, 'जीर्ण');
    s = s.replace(/जीर्\s*ातवद|जीर्ातवद|जीरतवद/gu, 'जीर्णोद्धार आदि');
    s = s.replace(/वकन्\s*र्\s*ु|वकन्र्ु|वकन्त\s*ु|वकन्त/gu, 'किन्तु');
    s = s.replace(/वकिंवचर्\s*आचायों|वकिंवचर्आचायों|वकिंवचर्ाचार्यो/gu, 'किंचित् आचार्यों');
    s = s.replace(/वकिंवचर्\s*मर्\s*से|वकिंवचर्मर्से/gu, 'किंचित् मत से');
    s = s.replace(/वकिंवचर्/gu, 'किंचित्');
    s = s.replace(/सपू\s*वत|सपूवत/gu, 'सपूर्व');
    s = s.replace(/अपू\s*वत|अपूवत/gu, 'अपूर्व');
    s = s.replace(/पू\s*वत|पूवत/gu, 'पूर्व');
    s = s.replace(/पररभाषा/gu, 'परिभाषा');
    s = s.replace(/ववचारिीय|विचारिीय|विचाररीय/gu, 'विचारणीय');
    s = s.replace(/आपार्\s*कावलक|आपार्कावलक|आपार्कालवक/gu, 'आपातकालिक');
    s = s.replace(/कारर्ों|काररों/gu, 'कारणों');
    s = s.replace(/रावशयों/gu, 'राशियों');
    s = s.replace(/कावर्तक/gu, 'कार्तिक');
    s = s.replace(/मागतशीषत/gu, 'मार्गशीर्ष');
    s = s.replace(/श्र\s*ावर्\b/gu, 'श्रावण');
    s = s.replace(/ियमास/gu, 'क्षयमास');
    s = s.replace(/अवधकमास/gu, 'अधिकमास');
    s = s.replace(/सवतदा/gu, 'सर्वदा');
    s = s.replace(/विज\s*र्\s*हैं|विजतर्हैं|विजतर्|वितर्/gu, 'वर्जित हैं');
    s = s.replace(/प्र\s*शथर्\s*है|प्र\s*शथर्/gu, 'प्रशस्त है');
    s = s.replace(/कृष्र्\s*पि|कृष्र्पि/gu, 'कृष्ण पक्ष');
    s = s.replace(/शुक्ल\s*पि/gu, 'शुक्ल पक्ष');
    s = s.replace(/ग्र\s*ाह्य|ग्ह्य/gu, 'ग्राह्य');
    s = s.replace(/वतवथ|वर्यथ/gu, 'तिथि');
    s = s.replace(/द्वार\s*वदशानुसार|द्व\s*ारवदशानुसार|द्रवदशानुसार/gu, 'द्वार-दिशानुसार');
    s = s.replace(/पूर्\s*ात|पूर्ात|पूर्त/gu, 'पूर्णा');
    s = s.replace(/पिंचमी/gu, 'पञ्चमी');
    s = s.replace(/पूवर्\s*त\s*मा|पूवर्तमा|पूवर्त\s*मा/gu, 'पूर्णिमा');
    s = s.replace(/दविर्\s*ायर्|दविर्ायर्|दविरयर्|दविरायर्/gu, 'दक्षिणायन');
    s = s.replace(/दविर्\s*द्व\s*ार|दक्षिण\s*द्वारार/gu, 'दक्षिण द्वार');
    s = s.replace(/दविर्\s*द्व|दविर्द्व/gu, 'दक्षिण द्वार');
    s = s.replace(/दविर्/gu, 'दक्षिण');
    s = s.replace(/पविम/gu, 'पश्चिम');
    s = s.replace(/प्र\s*वर्\s*पदा|प्रवर्पदा/gu, 'प्रतिपदा');
    s = s.replace(/वद्व\s*र्\s*ीया|वद्वर्ीया|वद्वर्या/gu, 'द्वितीया');
    s = s.replace(/र्ृ\s*र्\s*ीया|र्ृर्ीया|र्ृरया/gu, 'तृतीया');
    s = s.replace(/द्व\s*ा\s*दशी|द्दशी/gu, 'द्वादशी');
    s = s.replace(/अष्ट\s*मी/gu, 'अष्टमी');
    s = s.replace(/त्र\s*योदशी/gu, 'त्रयोदशी');
    s = s.replace(/\bद्र\b/gu, 'द्वार');
    s = s.replace(/किंचित्\s*आचार्यों|किंचित्आचार्यों/gu, 'किंचित् आचार्यों');
    s = s.replace(/किंचित्\s*मत|किंचित्मत/gu, 'किंचित् मत');
    s = s.replace(/विजतर्\s*हैं|विजतर्हैं|वितर्\s*हैं/gu, 'वर्जित हैं');
    s = s.replace(/नुर्नगृहे|नूर्नगृहे/gu, 'नूतन गृहे');
    s = s.replace(/वमथुन/gu, 'मिथुन');
    s = s.replace(/वकसी/gu, 'किसी');
    s = s.replace(/श्रावर्\b/gu, 'श्रावण');
    s = s.replace(/शुक्ल\s*पि/gu, 'शुक्ल पक्ष');
    s = s.replace(/र्क\s*ही/gu, 'तक ही');
    s = s.replace(/वर्वथ|वतवथ/gu, 'तिथि');
    s = s.replace(/मु\s*\.\s*वच\s*\./gu, 'मु. चि.');
    s = s.replace(/जीिे\s*गृहे/gu, 'जीर्णे गृहे');
    s = s.replace(/श्रावविकेवप/gu, 'श्रावणिकेऽपि');
    s = s.replace(/वक्षप्त/gu, 'क्षिप्र');

    // 2. Fix orphan matras and spaces before combining marks (eliminates dotted circles ◌)
    s = s.replace(/([क-ह]़?)\s+([ािीुूृेैोौँंः])/gu, '$1$2');
    s = s.replace(/\s+([ािीुूृेैोौँंः])/gu, '$1');
    s = s.replace(/\u094D\s+/gu, '\u094D');

    // 3. Spaced words
    s = s.replace(/गृह\s*प्र\s*वेश/gu, 'गृहप्रवेश');
    s = s.replace(/वा\s*स्\s*तु|वा\s*स्तु/gu, 'वास्तु');
    s = s.replace(/शा\s*व\s*न्त|शावन्त|शावन्र्/gu, 'शान्ति');
    s = s.replace(/नीं\s*व/gu, 'नींव');
    s = s.replace(/पू\s*ज\s*न\s*म्/gu, 'पूजनम्');
    s = s.replace(/पू\s*ज\s*न/gu, 'पूजन');
    s = s.replace(/पु\s*रु\s*ष/gu, 'पुरुष');
    s = s.replace(/पु\s*रा\s*ण/gu, 'पुराण');
    s = s.replace(/प्र\s*वे\s*श|प्र\s*वेश/gu, 'प्रवेश');
    s = s.replace(/प्र\s*कार/gu, 'प्रकार');
    s = s.replace(/प्र\s*कट/gu, 'प्रकट');
    s = s.replace(/प्र\s*ारम्\s*भ/gu, 'प्रारम्भ');
    s = s.replace(/सम्\s*बन्\s*ध/gu, 'सम्बन्ध');
    s = s.replace(/मु\s*हूर्\s*त|मुहूतय/gu, 'मुहूर्त');
    s = s.replace(/युद्ध\s*ावद|युद्वद/gu, 'युद्धादि');
    s = s.replace(/उत्त\s*रायर्\s*सूयत|उत्त\s*रायर्सूयत/gu, 'उत्तरायण सूर्य');
    s = s.replace(/उत्त\s*रायर्\s*वा|उत्त\s*रायर्वा/gu, 'उत्तरायण वा');
    s = s.replace(/उत्त\s*रायर्/gu, 'उत्तरायण');
    s = s.replace(/सूयत|सूयय/gu, 'सूर्य');
    s = s.replace(/वथथवर्\s*में|वथथवर्में/gu, 'स्थिति में');
    s = s.replace(/वथथवर्|वथथवर्य/gu, 'स्थिति');
    s = s.replace(/वथथर/gu, 'स्थिर');
    s = s.replace(/रोवहर्ी/gu, 'रोहिणी');

    // Vastu Mandala corrections
    s = s.replace(/ललए/gu, 'लिए');
    s = s.replace(/लवधान/gu, 'विधान');
    s = s.replace(/लवलहत/gu, 'विहित');
    s = s.replace(/आलद/gu, 'आदि');
    s = s.replace(/लतलक/gu, 'तिलक');
    s = s.replace(/लपण्ड/gu, 'पिण्ड');
    s = s.replace(/िारदा/gu, 'शारदा');
    s = s.replace(/नैर्\s*ऋत्\s*य/gu, 'नैर्ऋत्य');

    // Convert 'वव' to 'वि' prefix
    s = s.replace(/वव([क-ह])/gu, 'वि$1');

    // Remove any stray dotted circle characters
    s = s.replace(/[\u25CC\u25CB]/gu, '');
    return s;
  };

  // Render text with sacred Devanagari styling
  const renderFormattedScripture = (rawText: string) => {
    const cleaned = sanitizeScriptureText(rawText);
    const lines = cleaned.split('\n');

    return (
      <div className="space-y-1 sm:space-y-1.5">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-2.5 sm:h-3" />;
          }

          // Sacred Section Headings like 【 शान्ति पाठः 】, 【 विनियोगः 】, 【 ध्यानम् 】
          if (trimmed.startsWith('【') && trimmed.endsWith('】')) {
            return (
              <div key={idx} className="my-3 sm:my-3.5 text-center select-none">
                <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full border border-[#8C2D19]/40 bg-[#8C2D19]/10 text-[#8C2D19] dark:text-sacred-300 font-bold tracking-wider text-xs sm:text-sm font-serifDevanagari shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-sacred-600" />
                  <span>{trimmed.replace(/【|】/g, '')}</span>
                  <Sparkles className="w-3.5 h-3.5 text-sacred-600" />
                </div>
              </div>
            );
          }

          // Subheadings or invocation lines like ॥ श्रीगणेशाय नमः ॥
          if (trimmed.startsWith('॥') && trimmed.endsWith('॥') && trimmed.length < 50) {
            return (
              <div
                key={idx}
                className="text-center font-bold tracking-wide my-2 sm:my-2.5 text-[#7A2814] dark:text-sacred-400 font-serifDevanagari"
                style={{ fontSize: `${Math.round(fontSize * 1.12)}px` }}
              >
                {trimmed}
              </div>
            );
          }

          // Regular shloka or mantra line
          let targetLine = trimmed;
          if (isPadachhedaMode) {
            targetLine = generatePadachheda(trimmed).padachheda;
          }
          let displayText = scriptMode === 'iast' ? devanagariToIast(targetLine) : targetLine;

          return (
            <p
              key={idx}
              className={`text-center tracking-wide ${getLineHeightClass()} sanskrit-text transition-all ${
                isPadachhedaMode ? 'padachheda-mode-container' : ''
              }`}
              style={{
                fontSize: `${fontSize}px`,
                ...getFontFamilyStyle(),
              }}
            >
              {isPadachhedaMode && scriptMode === 'devanagari' ? (
                displayText.split(/([ -]+)/).map((part, pIdx) => {
                  if (part === '-') {
                    return <span key={pIdx} className="padachheda-delimiter">-</span>;
                  }
                  if (part.trim()) {
                    return <span key={pIdx} className="padachheda-split-word">{part}</span>;
                  }
                  return part;
                })
              ) : (
                displayText
              )}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${getOuterThemeClass()} flex flex-col justify-between`}>
      {/* Top Reading Controls Header */}
      <header className="sticky top-0 z-40 border-b border-black/20 bg-black/40 backdrop-blur-md px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-neutral-100 shadow-lg">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-devanagari">ग्रन्थालय</span>
          </button>

          <div>
            <h1 className="font-bold text-sm sm:text-base font-serifDevanagari truncate max-w-xs sm:max-w-md text-amber-200">
              {book.title}
            </h1>
            <p className="text-[11px] text-neutral-400 font-devanagari flex items-center space-x-2">
              <span>दृष्टा / रचयिता: <strong>{book.author || 'पारंपरिक महर्षि'}</strong></span>
              <span>•</span>
              <span>पत्र {currentPage ? currentPage.page_number : 0} / {pages.length}</span>
            </p>
          </div>
        </div>

        {/* Customization Toolbar */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* View Mode (Text vs Split vs Scan) */}
          <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/15">
            <button
              onClick={() => setViewMode('text')}
              className={`px-2.5 py-1 rounded-lg transition-all font-devanagari flex items-center space-x-1 ${
                viewMode === 'text' ? 'bg-sacred-600 text-white shadow-md font-bold' : 'text-neutral-300 hover:text-white'
              }`}
              title="भोजपत्र पाठ्य मोड"
            >
              <BookOpen className="w-3 h-3" />
              <span>पाठ</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-lg transition-all font-devanagari flex items-center space-x-1 ${
                viewMode === 'split' ? 'bg-sacred-600 text-white shadow-md font-bold' : 'text-neutral-300 hover:text-white'
              }`}
              title="मूल पाण्डुलिपि व पाठ साथ-साथ"
            >
              <span>उभय</span>
            </button>
            <button
              onClick={() => setViewMode('scan')}
              className={`px-2.5 py-1 rounded-lg transition-all font-devanagari flex items-center space-x-1 ${
                viewMode === 'scan' ? 'bg-sacred-600 text-white shadow-md font-bold' : 'text-neutral-300 hover:text-white'
              }`}
              title="मूल पोथी पाण्डुलिपि दर्शन"
            >
              <ImageIcon className="w-3 h-3" />
              <span>पोथी स्कैन</span>
            </button>
          </div>

          {/* Font Selector */}
          <select
            value={fontFamily}
            onChange={e => setFontFamily(e.target.value as ScriptureFont)}
            className="bg-neutral-900 border border-neutral-700 text-amber-200 rounded-xl px-2.5 py-1.5 text-xs font-devanagari focus:outline-none focus:border-sacred-500 cursor-pointer shadow-inner"
            title="पवित्र संस्कृत लिपि फॉन्ट चुनें"
          >
            <option value="tiro">📜 पारंपरिक पोथी (Tiro Sanskrit)</option>
            <option value="yatra">🪶 काष्ठ पाण्डुलिपि (Yatra One)</option>
            <option value="rozha">🛕 राजसी मन्दिर शैली (Rozha One)</option>
            <option value="notoSerif">📖 शास्त्रीय सेरिफ़ (Noto Serif)</option>
            <option value="notoSans">🔤 सुगम देवनागरी (Noto Sans)</option>
          </select>

          {/* Font Size Buttons */}
          <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/15">
            <button
              onClick={() => setFontSize(prev => Math.max(16, prev - 2))}
              className="p-1 rounded hover:bg-white/15 font-bold text-neutral-300 hover:text-white"
              title="फॉन्ट छोटा करें"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-amber-300 font-bold">{fontSize}</span>
            <button
              onClick={() => setFontSize(prev => Math.min(36, prev + 2))}
              className="p-1 rounded hover:bg-white/15 font-bold text-neutral-300 hover:text-white"
              title="फॉन्ट बड़ा करें"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Line Height Selector (पंक्ति अन्तर) */}
          <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/15 text-[11px] font-devanagari">
            <button
              onClick={() => setLineHeight('compact')}
              className={`px-2 py-1 rounded-lg transition-all ${
                lineHeight === 'compact' ? 'bg-sacred-600 text-white font-bold shadow' : 'text-neutral-300 hover:text-white'
              }`}
              title="सघन पंक्ति दूरी (Compact row spacing)"
            >
              सघन
            </button>
            <button
              onClick={() => setLineHeight('normal')}
              className={`px-2 py-1 rounded-lg transition-all ${
                lineHeight === 'normal' ? 'bg-sacred-600 text-white font-bold shadow' : 'text-neutral-300 hover:text-white'
              }`}
              title="मध्यम पंक्ति दूरी (Normal row spacing)"
            >
              मध्यम
            </button>
            <button
              onClick={() => setLineHeight('relaxed')}
              className={`px-2 py-1 rounded-lg transition-all ${
                lineHeight === 'relaxed' ? 'bg-sacred-600 text-white font-bold shadow' : 'text-neutral-300 hover:text-white'
              }`}
              title="विस्तृत पंक्ति दूरी (Relaxed row spacing)"
            >
              विस्तृत
            </button>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/15">
            <button
              onClick={() => setReadingTheme('bhojpatra')}
              className={`px-2 py-1 rounded-lg text-xs font-devanagari transition-all flex items-center space-x-1 ${
                readingTheme === 'bhojpatra' ? 'bg-amber-600 text-white font-bold shadow' : 'text-neutral-300 hover:text-white'
              }`}
              title="प्राकृतिक हिमालयी भोजपत्र शैली"
            >
              <Scroll className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">भोजपत्र</span>
            </button>
            <button
              onClick={() => setReadingTheme('golden-birch')}
              className={`px-2 py-1 rounded-lg text-xs font-devanagari transition-all flex items-center space-x-1 ${
                readingTheme === 'golden-birch' ? 'bg-amber-700 text-white font-bold shadow' : 'text-neutral-300 hover:text-white'
              }`}
              title="स्वर्णिम भूर्जपत्र शैली"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">स्वर्ण</span>
            </button>
            <button
              onClick={() => setReadingTheme('dark-slate')}
              className={`p-1.5 rounded-lg transition-all ${
                readingTheme === 'dark-slate' ? 'bg-neutral-800 text-amber-300 shadow' : 'text-neutral-400 hover:text-white'
              }`}
              title="रात्रि गर्भगृह (Dark Mode)"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setReadingTheme('ivory-white')}
              className={`p-1.5 rounded-lg transition-all ${
                readingTheme === 'ivory-white' ? 'bg-neutral-200 text-neutral-900 shadow' : 'text-neutral-400 hover:text-white'
              }`}
              title="शुभ्र ग्रन्थ (Ivory White)"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Script Mode Toggle */}
          <button
            onClick={() => setScriptMode(scriptMode === 'devanagari' ? 'iast' : 'devanagari')}
            className={`px-2.5 py-1 rounded-xl border text-xs font-semibold transition-all ${
              scriptMode === 'devanagari'
                ? 'bg-sacred-800/80 border-sacred-600 text-sacred-200'
                : 'bg-neutral-800 border-neutral-700 text-sky-300 font-mono'
            }`}
            title="देवनागरी / IAST रोमनीकरण बदलें"
          >
            {scriptMode === 'devanagari' ? 'देवनागरी' : 'IAST Roman'}
          </button>

          {/* Padachheda (Word-Split) Toggle */}
          <button
            onClick={() => setIsPadachhedaMode(!isPadachhedaMode)}
            className={`px-3 py-1 rounded-xl border text-xs font-semibold transition-all flex items-center space-x-1.5 font-devanagari shadow-sm ${
              isPadachhedaMode
                ? 'bg-gradient-to-r from-amber-600 to-sacred-600 border-amber-400 text-white shadow-md font-bold scale-[1.02]'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-amber-200'
            }`}
            title="पाणिनीय पदच्छेद: समस्त पदों एवं संधियों को अलग-अलग देखने हेतु (UoHyd Standard)"
          >
            <Split className="w-3.5 h-3.5" />
            <span>{isPadachhedaMode ? 'पदच्छेद (विभक्त शब्द)' : 'पदच्छेद'}</span>
          </button>

          {/* Quick Verify Button */}
          <button
            onClick={() => onOpenVerification(book.id)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sacred-600 to-amber-600 hover:from-sacred-500 hover:to-amber-500 text-white text-xs font-bold shadow-md shadow-sacred-950 transition-all active:scale-95 font-devanagari"
            title="सत्यापन कार्यपीठ में खोलें"
          >
            सत्यापन
          </button>
        </div>
      </header>

      {/* Main Reading Container */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-10 w-full flex-grow flex flex-col items-center justify-center">
        {viewMode === 'scan' ? (
          /* Pure Manuscript Scan View */
          <div className="w-full max-w-4xl bg-neutral-900/60 p-4 sm:p-6 rounded-3xl border border-neutral-800 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between text-xs font-devanagari text-neutral-300 border-b border-neutral-800 pb-3">
              <span className="flex items-center space-x-1.5 text-amber-400 font-semibold">
                <Scroll className="w-4 h-4" />
                <span>मूल भोजपत्र पाण्डुलिपि स्कैन (Original Bhojpatra Scan)</span>
              </span>
              <span className="font-mono text-neutral-400">
                पत्रम् {currentPage?.page_number} / {pages.length}
              </span>
            </div>
            {currentPage?.original_image_path ? (
              <div className="relative overflow-hidden rounded-2xl border-4 border-[#8C2D19] shadow-2xl bg-black">
                <img
                  src={currentPage.original_image_path}
                  alt={`Manuscript page ${currentPage.page_number}`}
                  className="w-full h-auto max-h-[75vh] object-contain mx-auto"
                />
              </div>
            ) : (
              <p className="text-neutral-500 py-12">स्कैन छवि उपलब्ध नहीं है</p>
            )}
          </div>
        ) : viewMode === 'split' ? (
          /* Split View: Scan on Left, Typeset Bhojpatra on Right */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-start">
            {/* Left: Original Scan */}
            <div className="bg-neutral-900/80 p-4 rounded-3xl border border-neutral-800 shadow-xl space-y-3">
              <p className="text-xs font-devanagari text-amber-400 font-bold flex items-center space-x-1">
                <Scroll className="w-3.5 h-3.5" />
                <span>मूल पाण्डुलिपि स्कैन</span>
              </p>
              {currentPage?.original_image_path && (
                <div className="rounded-2xl overflow-hidden border-2 border-[#8C2D19]/60 shadow-lg">
                  <img
                    src={currentPage.original_image_path}
                    alt={`Scan ${currentPage.page_number}`}
                    className="w-full h-auto object-contain max-h-[70vh]"
                  />
                </div>
              )}
            </div>

            {/* Right: Typeset Bhojpatra Sheet */}
            <div
              style={getPothiSheetStyle()}
              className="pothi-manuscript-border rounded-3xl p-6 sm:p-8 transition-all relative overflow-hidden"
            >
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-[#8C2D19] opacity-70 text-xs select-none">❖</div>
              <div className="absolute top-2 right-2 text-[#8C2D19] opacity-70 text-xs select-none">❖</div>
              <div className="absolute bottom-2 left-2 text-[#8C2D19] opacity-70 text-xs select-none">❖</div>
              <div className="absolute bottom-2 right-2 text-[#8C2D19] opacity-70 text-xs select-none">❖</div>

              {/* Header Title */}
              <div className="text-center pb-4 border-b border-[#8C2D19]/30 mb-6">
                <p className="text-xl font-bold font-serifDevanagari text-[#8C2D19] dark:text-sacred-400">
                  {book.title}
                </p>
                <p className="text-xs opacity-75 font-devanagari mt-0.5">
                  पत्रम् {currentPage?.page_number} / {pages.length}
                </p>
                {isPadachhedaMode && (
                  <div className="mt-2">
                    <span className="inline-flex items-center space-x-1.5 text-[11px] px-2.5 py-0.5 rounded-full bg-amber-600/15 border border-amber-600/40 text-amber-900 dark:text-amber-200 font-semibold animate-pulse">
                      <Split className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>पदच्छेद दर्शन सक्रिय</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Formatted Text */}
              {currentPage && renderFormattedScripture(currentPage.verified_text || currentPage.ocr_text || '')}
            </div>
          </div>
        ) : (
          /* Pure Bhojpatra Manuscript Folio (Pothi View) */
          <div
            style={getPothiSheetStyle()}
            className="pothi-manuscript-border rounded-3xl p-5 sm:p-8 w-full max-w-3xl transition-all relative overflow-hidden my-3"
          >
            {/* Sacred Corner Rosettes */}
            <div className="absolute top-3.5 left-3.5 w-6 h-6 rounded-full border border-[#8C2D19] bg-[#C44D25]/20 flex items-center justify-center text-[10px] text-[#8C2D19] font-bold select-none">
              卐
            </div>
            <div className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full border border-[#8C2D19] bg-[#C44D25]/20 flex items-center justify-center text-[10px] text-[#8C2D19] font-bold select-none">
              卐
            </div>
            <div className="absolute bottom-3.5 left-3.5 w-6 h-6 rounded-full border border-[#8C2D19] bg-[#C44D25]/20 flex items-center justify-center text-[10px] text-[#8C2D19] font-bold select-none">
              卐
            </div>
            <div className="absolute bottom-3.5 right-3.5 w-6 h-6 rounded-full border border-[#8C2D19] bg-[#C44D25]/20 flex items-center justify-center text-[10px] text-[#8C2D19] font-bold select-none">
              卐
            </div>

            {/* Sacred Folio Header */}
            <div className="text-center space-y-1.5 select-none mb-4 pb-3 border-b border-dashed border-[#8C2D19]/40">
              <div className="text-2xl sm:text-3xl tracking-widest font-serifDevanagari text-[#8C2D19] dark:text-sacred-400 font-bold">
                ॐ
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serifDevanagari text-[#7A2814] dark:text-sacred-300 tracking-wide">
                {book.title}
              </h2>
              {book.author && (
                <p className="text-xs font-devanagari opacity-80">
                  दृष्टा ऋषि / रचयिता: <strong className="text-[#8C2D19] dark:text-sacred-400">{book.author}</strong>
                </p>
              )}
            </div>

            {/* Verification & Padachheda Status Banner */}
            {currentPage && (
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <span className="flex items-center space-x-1.5 text-xs px-3 py-0.5 rounded-full bg-[#8C2D19]/10 border border-[#8C2D19]/30 text-[#8C2D19] dark:text-sacred-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>पत्रम् {currentPage.page_number} • SanskritDocuments &amp; UoHyd प्रामाणिक पाठ</span>
                </span>
                {isPadachhedaMode && (
                  <span className="flex items-center space-x-1.5 text-xs px-3 py-0.5 rounded-full bg-amber-600/15 border border-amber-600/40 text-amber-900 dark:text-amber-200 font-semibold animate-pulse">
                    <Split className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>पदच्छेद सक्रिय (UoHyd Sandhi-Split)</span>
                  </span>
                )}
              </div>
            )}

            {/* Core Scripture Body */}
            {currentPage ? (
              renderFormattedScripture(currentPage.verified_text || currentPage.ocr_text || '')
            ) : (
              <p className="text-center opacity-60">कोई पृष्ठ नहीं मिला।</p>
            )}

            {/* Pothi Manuscript Footer Seal */}
            <div className="text-center pt-4 mt-4 border-t border-dashed border-[#8C2D19]/40 select-none space-y-1">
              <p className="text-sm font-serifDevanagari font-bold text-[#8C2D19] dark:text-sacred-400 tracking-wider">
                ॥ पत्रम् {currentPageIndex + 1} / {pages.length} • सनातन प्रामाणिक भोजपत्र पाण्डुलिपि ॥
              </p>
              <p className="text-[10px] opacity-70 font-devanagari">
                अक्षर-सत्यता एवं वैदिक स्वर-सुरक्षा सहित डिजिटाइज़्ड
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom Navigation Bar */}
      <footer className="sticky bottom-0 z-40 border-t border-black/20 bg-black/50 backdrop-blur-md px-4 py-3 flex items-center justify-between max-w-xl mx-auto rounded-t-2xl shadow-2xl w-full">
        <button
          onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
          disabled={currentPageIndex === 0}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed font-medium text-xs text-white transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="font-devanagari font-semibold">पूर्व पृष्ठ</span>
        </button>

        <div className="text-xs font-serifDevanagari font-bold text-amber-300 flex items-center space-x-2">
          <span>पत्रम्</span>
          <span className="font-mono bg-black/40 px-2 py-0.5 rounded border border-white/15">
            {currentPageIndex + 1} / {pages.length}
          </span>
        </div>

        <button
          onClick={() => setCurrentPageIndex(prev => Math.min(pages.length - 1, prev + 1))}
          disabled={currentPageIndex === pages.length - 1}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed font-medium text-xs text-white transition-all active:scale-95"
        >
          <span className="font-devanagari font-semibold">अग्रिम पृष्ठ</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
