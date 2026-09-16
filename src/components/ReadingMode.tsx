import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Type,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
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
  Split,
  Layers
} from 'lucide-react';
import { api } from '../api.js';
import { devanagariToIast } from '../utils/transliteration.js';
import { generatePadachheda } from '../utils/padachheda.js';
import {
  groupScriptureFolio,
  getScriptureBlockConfig,
  ScriptureBlockType,
  parseGitaFolio,
} from '../utils/scriptureTypography.js';
import {
  KarmakandaSegmentRenderer,
} from './KarmakandaCards.js';
import { parseKarmakandaSegment } from '../utils/karmakandaParser.js';
import { GitaTableOfContents } from './GitaTableOfContents.js';
import { VsnTableOfContents } from './VsnTableOfContents.js';
import { GaneshPujanTableOfContents } from './GaneshPujanTableOfContents.js';
import { BrihatStotraTableOfContents } from './BrihatStotraTableOfContents.js';
import { UniversalTableOfContents } from './UniversalTableOfContents.js';
import { GITA_SECTIONS, GitaChapter } from '../data/bhagavadGitaIndex.js';
import { VSN_SECTIONS, VsnSection } from '../data/vishnuSahasranamaIndex.js';
import { BRIHAT_STOTRAS, BRIHAT_CATEGORIES, BrihatStotraItem } from '../data/brihatStotraRatnakarIndex.js';
import type { Book, Page } from '../../shared/types.js';

interface ReadingModeProps {
  bookId: string;
  onBack: () => void;
  onOpenVerification: (bookId: string) => void;
}

type ReadingTheme = 'bhojpatra' | 'golden-birch' | 'dark-slate' | 'ivory-white';
type ScriptureFont = 'harmonized' | 'tiro' | 'yatra' | 'rozha' | 'notoSerif' | 'notoSans';
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
  const [lineHeight] = useState<LineHeightOption>('compact');
  const [fontFamily, setFontFamily] = useState<ScriptureFont>('harmonized');
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>('bhojpatra');
  const [scriptMode, setScriptMode] = useState<'devanagari' | 'iast'>('devanagari');
  const [viewMode] = useState<'text'>('text');
  const [isPadachhedaMode, setIsPadachhedaMode] = useState<boolean>(false);
  const [isKarmakandaMode, setIsKarmakandaMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [jumpPageInput, setJumpPageInput] = useState<string>('1');
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);
  const [activeChapterScope, setActiveChapterScope] = useState<GitaChapter | null>(null);
  const [activeStotraScope, setActiveStotraScope] = useState<BrihatStotraItem | null>(null);
  const [isHeaderHidden, setIsHeaderHidden] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const isGitaBook = Boolean(book?.id === 'granth-bhagavad-gita' || (book?.title?.includes('गीता') && !book?.title?.includes('सहस्रनाम')));
  const isVsnBook = Boolean(book?.id?.includes('sahasranama') || book?.title?.includes('सहस्रनाम'));
  const isGaneshPujanBook = Boolean(book?.id === 'granth-ganesh-pujan-paddhati' || (book?.title?.includes('गणेश') && book?.title?.includes('पूजन')));
  const isBrihatStotraBook = Boolean(book?.id === 'granth-brihat-stotra-ratnakar' || book?.title?.includes('बृहत्स्तोत्ररत्नाकर'));
  const isDarkSlate = readingTheme === 'dark-slate';

  // Native Fullscreen API sync
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(err => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen?.().catch(err => {
        console.warn('Exit fullscreen failed:', err);
      });
    }
  };

  // Keyboard hotkeys for immersive reading: F (fullscreen), H (hide/show top bar), Escape (exit hide)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setIsHeaderHidden(prev => !prev);
      } else if (e.key === 'Escape' && isHeaderHidden) {
        setIsHeaderHidden(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHeaderHidden]);

  // Derive current chapter from current page strictly for Gita books
  const currentChapter = useMemo(() => {
    if (!isGitaBook) return null;
    if (activeChapterScope) return activeChapterScope;
    const pageNum = currentPageIndex + 1;
    return GITA_SECTIONS.find(s => pageNum >= s.startPage && pageNum <= s.endPage) || null;
  }, [isGitaBook, activeChapterScope, currentPageIndex]);

  // Derive current VSN liturgical section from current page
  const currentVsnSection = useMemo(() => {
    if (!isVsnBook) return null;
    const pageNum = currentPageIndex + 1;
    return VSN_SECTIONS.find(s => pageNum >= s.startPage && pageNum <= s.endPage) || null;
  }, [isVsnBook, currentPageIndex]);

  // Derive current Brihat Stotra from activeStotraScope or current page
  const currentBrihatStotra = useMemo(() => {
    if (!isBrihatStotraBook) return null;
    if (activeStotraScope) return activeStotraScope;
    const pageNum = currentPageIndex + 1;
    const matching = BRIHAT_STOTRAS.filter(s => s.pdfPage <= pageNum);
    return matching.length > 0 ? matching[matching.length - 1] : null;
  }, [isBrihatStotraBook, activeStotraScope, currentPageIndex]);

  // Derive page range and navigation for the active stotra
  const stotraRange = useMemo(() => {
    if (!activeStotraScope) return null;
    const index = BRIHAT_STOTRAS.findIndex(s => s.id === activeStotraScope.id);
    const startPage = activeStotraScope.pdfPage;
    const nextStotra = index >= 0 && index < BRIHAT_STOTRAS.length - 1 ? BRIHAT_STOTRAS[index + 1] : null;
    const endPage = nextStotra
      ? (nextStotra.pdfPage > startPage ? nextStotra.pdfPage - 1 : startPage)
      : pages.length;
    const totalPages = Math.max(1, endPage - startPage + 1);
    const prevStotra = index > 0 ? BRIHAT_STOTRAS[index - 1] : null;
    return { startPage, endPage, totalPages, index, nextStotra, prevStotra };
  }, [activeStotraScope, pages.length]);

  // Isolate stotra text so every stotra starts on a fresh page without mixing previous/next stotras
  const getStotraIsolatedText = useCallback((rawText: string, stotra: BrihatStotraItem, pageNum: number): string => {
    if (!rawText) return '';
    let text = rawText;

    const stotraIdx = BRIHAT_STOTRAS.findIndex(s => s.id === stotra.id);
    const nextStotra = stotraIdx >= 0 && stotraIdx < BRIHAT_STOTRAS.length - 1 ? BRIHAT_STOTRAS[stotraIdx + 1] : null;

    // Clean title for matching (handles ending anusvara, visarga, virama, or spaces, and parenthesized numbers like (२))
    const cleanTitle = stotra.title
      .replace(/\s*\([०-९0-9]+\)/g, '')
      .replace(/[म्ंः\s]+$/u, '')
      .trim();

    // 1. If this is the START page of the active stotra, slice from the start of this stotra
    if (pageNum === stotra.pdfPage) {
      let titleIndex = text.indexOf(stotra.title);
      if (titleIndex === -1 && cleanTitle.length >= 4) {
        titleIndex = text.indexOf(cleanTitle);
      }

      if (titleIndex !== -1) {
        // Find beginning of the line containing the stotra title
        const lineStart = text.lastIndexOf('\n', titleIndex);
        text = text.substring(lineStart === -1 ? 0 : lineStart + 1).trim();
      }
    }

    // 2. If next stotra starts on this SAME page (e.g. this is the end page of active stotra)
    if (nextStotra && pageNum === nextStotra.pdfPage) {
      const nextCleanTitle = nextStotra.title
        .replace(/\s*\([०-९0-9]+\)/g, '')
        .replace(/[म्ंः\s]+$/u, '')
        .trim();
      let nextTitleIndex = text.indexOf(nextStotra.title);
      if (nextTitleIndex === -1 && nextCleanTitle.length >= 4) {
        nextTitleIndex = text.indexOf(nextCleanTitle);
      }

      if (nextTitleIndex !== -1) {
        // Slice right before the next stotra line
        const lineStart = text.lastIndexOf('\n', nextTitleIndex);
        text = text.substring(0, lineStart === -1 ? nextTitleIndex : lineStart).trim();
      }
    }

    return text;
  }, []);

  useEffect(() => {
    if (activeStotraScope) {
      const stotraFolio = currentPageIndex + 1 - activeStotraScope.pdfPage + 1;
      setJumpPageInput(String(Math.max(1, stotraFolio)));
    } else if (activeChapterScope) {
      const chapterFolio = currentPageIndex + 1 - activeChapterScope.startPage + 1;
      setJumpPageInput(String(chapterFolio));
    } else {
      setJumpPageInput(String(currentPageIndex + 1));
    }
  }, [currentPageIndex, activeChapterScope, activeStotraScope]);

  // Auto-initialize activeStotraScope when Brihat Stotra Ratnakar is loaded so every stotra starts on its fresh page
  const hasInitializedStotraScope = useRef(false);
  useEffect(() => {
    if (isBrihatStotraBook && !hasInitializedStotraScope.current && currentBrihatStotra) {
      hasInitializedStotraScope.current = true;
      setActiveStotraScope(currentBrihatStotra);
    }
  }, [isBrihatStotraBook, currentBrihatStotra]);

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

  const getFontFamilyStyle = (blockType?: ScriptureBlockType): React.CSSProperties => {
    if (scriptMode === 'iast') {
      return { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' };
    }
    if (fontFamily === 'harmonized' && blockType) {
      const config = getScriptureBlockConfig(blockType);
      return { fontFamily: config.fontFamily };
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
        return { fontFamily: '"Noto Sans Devanagari", "Yantramanav", sans-serif' };
      case 'harmonized':
      default:
        return { fontFamily: '"Tiro Devanagari Sanskrit", "Noto Serif Devanagari", serif' };
    }
  };

  // Outer container theme
  const getOuterThemeClass = () => {
    switch (readingTheme) {
      case 'bhojpatra':
        return 'bg-[#21130B] text-[#1C120C]';
      case 'golden-birch':
        return 'bg-[#2C180B] text-[#110A05]';
      case 'dark-slate':
        return 'bg-[#0B0908] text-white';
      case 'ivory-white':
        return 'bg-[#EAE4D8] text-[#110A05]';
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
          color: '#1C120C',
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
          color: '#110A05',
          borderColor: '#9E3A1A',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.7), inset 0 0 70px rgba(120, 65, 15, 0.22)',
        };
      case 'dark-slate':
        return {
          backgroundColor: '#141210',
          backgroundImage: `
            radial-gradient(ellipse at top center, rgba(60, 35, 18, 0.4) 0%, transparent 70%),
            repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(230, 160, 80, 0.02) 41px, transparent 42px)
          `,
          color: '#FFFFFF',
          borderColor: '#8C2D19',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), inset 0 0 80px rgba(0, 0, 0, 0.8)',
        };
      case 'ivory-white':
        return {
          backgroundColor: '#FCFAF4',
          backgroundImage: 'none',
          color: '#110A05',
          borderColor: '#9E3A1A',
          boxShadow: '0 20px 45px -10px rgba(0,0,0,0.2), inset 0 0 40px rgba(0, 0, 0, 0.04)',
        };
    }
  };

  // Clean and normalize scripture text (rejoining orphan matras to prevent dotted circles, fixing font anomalies)
  const sanitizeScriptureText = (text: string): string => {
    if (!text) return '';
    let s = text;

    // Strip duplicate scripture preamble headers if present
    s = s.replace(/^\s*॥\s*बृहत्स्तोत्ररत्नाकरः\s*॥\s*(?:\n*【[^】]+】\s*)?/u, '');

    // Common Sanskrit OCR Ligature & Conjunct Healing
    s = s.replace(/श्नीगेशाय/gu, 'श्रीगणेशाय');
    s = s.replace(/श्रीगुरुभ्यो\s*नसः/gu, 'श्रीगुरुभ्यो नमः');
    s = s.replace(/पसिुरवदनो/gu, 'सिन्दूरवदनो');
    s = s.replace(/यत्यादयंकजस्मरणम्/gu, 'यत्पादपङ्कजस्मरणम्');
    s = s.replace(/राशील्लाशयति/gu, 'राशीन्नाशयति');
    s = s.replace(/सुमुखश्चेकदंतश्च/gu, 'सुमुखश्चैकदन्तश्च');
    s = s.replace(/संबोदरश्च/gu, 'लम्बोदरश्च');
    s = s.replace(/धूख्रकेतु्गणाध्यक्चो/gu, 'धूम्रकेतुर्गणाध्यक्षो');
    s = s.replace(/पडेच्छणुखादपि/gu, 'पठेच्छृणुयादपि');
    s = s.replace(/हादशेतानि/gu, 'द्वादशैतानि');
    s = s.replace(/स्वंविष्नोषशांतये/gu, 'सर्वविघ्नोपशान्तये');
    s = s.replace(/शशिवर्णं\s*चतुभुजम्/gu, 'शशिवर्णं चतुर्भुजम्');
    s = s.replace(/नमो\s*वे\s*ब्रह्मनिधये/gu, 'नमो वै ब्रह्मनिधये');
    s = s.replace(/द्वि्ाहुरपरो/gu, 'द्विबाहुरपरो');
    s = s.replace(/अचतुवंदनो/gu, 'अचतुर्वदनो');
    s = s.replace(/प्राणायामं\s*हृत्वा/gu, 'प्राणायामं कृत्वा');
    s = s.replace(/शूषंकर्णाय/gu, 'शूर्पकर्णाय');
    s = s.replace(/विध्नशाय/gu, 'विघ्ननाशाय');
    s = s.replace(/चितामणये/gu, 'चिन्तामणये');
    s = s.replace(/आशापुरकाय/gu, 'आशापूरकाय');
    s = s.replace(/धूं\s*स्रकंतवे|धू\s*स्रकंतवे/gu, 'धूम्रकेतवे');
    s = s.replace(/वानबाहौ/gu, 'वामबाहौ');
    s = s.replace(/गौयुंवाच/gu, 'गौर्युवाच');
    s = s.replace(/क्म॑कर्तेति/gu, 'कर्म कर्तेति');
    s = s.replace(/सयूरवाहनमम्‌ं|सयूरवाहनममुं/gu, 'मयूरवाहनममुं');
    s = s.replace(/दिग्बाहुमाये/gu, 'दिग्बाहुमाद्ये');
    s = s.replace(/ध्रूयुगं/gu, 'भ्रूयुगं');
    s = s.replace(/भालचंगरस्तु/gu, 'भालचन्द्रस्तु');
    s = s.replace(/पाशपणिस्तु/gu, 'पाशपाणिस्तु');
    s = s.replace(/चितिता्थंदः/gu, 'चिन्तिताथप्रदः');
    s = s.replace(/गणंजयः/gu, 'गणञ्जयः');
    s = s.replace(/विष्नहरः/gu, 'विघ्नहरः');
    s = s.replace(/क्षप्रप्रसादनो/gu, 'क्षिप्रप्रसादनो');
    s = s.replace(/जआशाप्रपुरकः/gu, 'आशाप्रपूरकः');
    s = s.replace(/सर्वागाणि/gu, 'सर्वाङ्गानि');
    s = s.replace(/राक्तसासुर/gu, 'राक्षसासुर');
    s = s.replace(/निविष्नेन/gu, 'निर्विघ्नेन');
    s = s.replace(/भरणोच्चाटनाकर्ष/gu, 'मारणोच्चाटनाकर्ष');
    s = s.replace(/विच्नेशवीर्याणि/gu, 'विघ्नेशवीर्याणि');
    s = s.replace(/बंदीजन्मागिधकंः/gu, 'वन्दिजन्मागधकैः');
    s = s.replace(/शरुत्वा/gu, 'श्रुत्वा');

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

    // Fix spaces before virama (e.g. क ् -> क्) without touching whitespace after virama
    s = s.replace(/\s+\u094D/gu, '\u094D');
    s = s.replace(/अ\s*ों/gu, 'ओं');
    s = s.replace(/अों/gu, 'ओं');
    s = s.replace(/अ\s*ो/gu, 'ओ');
    s = s.replace(/अ\s*ौ/gu, 'औ');
    s = s.replace(/अ\s*ै/gu, 'ऐ');
    s = s.replace(/अ\s*े/gu, 'ए');
    s = s.replace(/अ\s*ा/gu, 'आ');
    s = s.replace(/अ\s*ी/gu, 'ई');
    s = s.replace(/अ\s*ि/gu, 'इ');
    s = s.replace(/अ\s*ू/gu, 'ऊ');
    s = s.replace(/अ\s*ु/gu, 'उ');
    s = s.replace(/अ\s*ृ/gu, 'ऋ');
    s = s.replace(/आ\s*ों/gu, 'ओं');
    s = s.replace(/आ\s*ें/gu, 'ओं');
    s = s.replace(/ृृ/gu, 'ॄ');
    s = s.replace(/पितृृनथ/gu, 'पितॄनथ');
    s = s.replace(/पितृृन्/gu, 'पितॄन्');
    s = s.replace(/भ[˝\u02DD]ातृृन्/gu, 'भ्रातॄन्');
    s = s.replace(/भ[˝\u02DD]ातॄन्/gu, 'भ्रातॄन्');
    s = s.replace(/भ[˝\u02DD]ा/gu, 'भ्रा');
    s = s.replace(/भ[˝\u02DD]म/gu, 'भ्रम');
    s = s.replace(/([क-ह])[˝\u02DD]/gu, '$1्र');
    s = s.replace(/[˝\u02DD]/gu, '्र');
    s = s.replace(/दृष्ट्वाेमं/gu, 'दृष्ट्वेमं');
    s = s.replace(/([क-ह])ाो/gu, '$1ो');
    s = s.replace(/([क-ह])ाौ/gu, '$1ौ');
    // Chanakya legacy font ligatures & OCR healing
    s = s.replace(/उÀलंघान/gu, 'उल्लङ्घन');
    s = s.replace(/उÀलंघन/gu, 'उल्लङ्घन');
    s = s.replace(/बिÀाकुल/gu, 'बिल्कुल');
    s = s.replace(/मि\^ी/gu, 'मिट्टी');
    s = s.replace(/ख\^े/gu, 'खट्टे');
    s = s.replace(/चि_े/gu, 'चिट्ठे');
    s = s.replace(/लड़Âँगा/gu, 'लड़ूँगा');
    s = s.replace(/कीÏत/gu, 'कीर्तिं');
    s = s.replace(/अकीÏत/gu, 'अकीर्तिं');
    s = s.replace(/बढ∏/gu, 'बढ़');
    s = s.replace(/जड़∏/gu, 'जड़');
    s = s.replace(/∏/gu, '');

    // ® fixes
    s = s.replace(/बु®द्ध/gu, 'बुद्धिं');
    s = s.replace(/सि®द्ध/gu, 'सिद्धिं');
    s = s.replace(/प्रकृ®त/gu, 'प्रकृतिं');
    s = s.replace(/अ®हसा/gu, 'अहिंसा');
    s = s.replace(/शा®न्त/gu, 'शान्तिं');
    s = s.replace(/ग®त/gu, 'गतिं');
    s = s.replace(/दुर्ग®त/gu, 'दुर्गतिं');
    s = s.replace(/रा®त्र/gu, 'रात्रिं');
    s = s.replace(/आवृ®त्त/gu, 'आवृत्तिं');
    s = s.replace(/प्रवृ®त्त/gu, 'प्रवृत्तिं');
    s = s.replace(/निवृ®त्त/gu, 'निवृत्तिं');
    s = s.replace(/भ®क्त/gu, 'भक्तिं');
    s = s.replace(/®/gu, '•');

    // ˆ (U+02C6) -> ह्ण
    s = s.replace(/गृˆ/gu, 'गृह्ण');
    s = s.replace(/निगृˆ/gu, 'निगृह्ण');
    s = s.replace(/ˆ/gu, 'ह्ण');

    // ´ (U+00B4) -> ऋ
    s = s.replace(/´क्साम/gu, 'ऋक्साम');
    s = s.replace(/´ग्यवेद/gu, 'ऋग्वेद');
    s = s.replace(/देव´णरूप/gu, 'देवऋणरूप');
    s = s.replace(/´षि/gu, 'ऋषि');
    s = s.replace(/´तु/gu, 'ऋतु');
    s = s.replace(/´तेऽपि/gu, 'ऋतेऽपि');
    s = s.replace(/´/gu, 'ऋ');

    // ‰ (U+2030) -> ु
    s = s.replace(/द्रष्ट‰/gu, 'द्रष्टु');
    s = s.replace(/प्रवेष्ट‰/gu, 'प्रवेष्टुं');
    s = s.replace(/श्र‰/gu, 'श्रु');
    s = s.replace(/क्षणभङ्‰र/gu, 'क्षणभङ्गुर');
    s = s.replace(/‰/gu, 'ु');

    // @ -> ञ्च
    s = s.replace(/@/gu, 'ञ्च');

    // % -> त्न
    s = s.replace(/([\u0900-\u097F])%([\u0900-\u097F])/gu, '$1त्न$2');
    s = s.replace(/प्रय%/gu, 'प्रयत्न');
    s = s.replace(/असप%/gu, 'असपत्न');
    s = s.replace(/प%ी/gu, 'पत्नी');
    s = s.replace(/य%/gu, 'यत्न');

    // À -> ल्
    s = s.replace(/À/gu, 'ल्');

    // ^ alone -> •
    s = s.replace(/\^/gu, '•');

    // Common OCR spelling fixes in Gita
    s = s.replace(/मामाश्रिात्य/gu, 'मामाश्रित्य');
    s = s.replace(/भावमाश्रिाताः/gu, 'भावमाश्रिताः');
    s = s.replace(/चर्तुवधा/gu, 'चतुर्विधा');
    s = s.replace(/साधियज्ञां/gu, 'साधियज्ञं');
    s = s.replace(/अधियज्ञाके/gu, 'अधियज्ञके');
    s = s.replace(/श्रीमानोंके घारमें/gu, 'श्रीमानोंके घरमें');
    s = s.replace(/आर्कषत किया/gu, 'आकर्षित किया');
    s = s.replace(/छ्ूटनेके/gu, 'छूटनेके');
    s = s.replace(/सुघाोष/gu, 'सुघोष');
    s = s.replace(/नरसिंघो/gu, 'नरसिंघे');
    s = s.replace(/उच्चा\s*स्वर/gu, 'उच्च स्वर');

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

    // Gita OCR & Kruti-Dev/Chanakya legacy font healing
    s = s.replace(/Âँ/gu, 'ूँ');
    s = s.replace(/Â/gu, 'ू');
    s = s.replace(/सङ्ख्यये/gu, 'सङ्ख्ये');
    s = s.replace(/भोगान्रुधिरप्रदिग्यधान्/gu, 'भोगान्रुधिरप्रदिग्धान्');
    s = s.replace(/अस्वग्यर्यमर्कीतकरमर्जुन/gu, 'अस्वर्ग्यमकीर्तिकरमर्जुन');
    s = s.replace(/त्वय्ययुपपद्यते/gu, 'त्वय्युपपद्यते');
    s = s.replace(/कMँगा|कmँगा/gu, 'करूँगा');
    s = s.replace(/अश्राु/gu, 'अश्रु');
    s = s.replace(/श्राुत्वा/gu, 'श्रुत्वा');
    s = s.replace(/श्ृणोति/gu, 'शृणोति');
    s = s.replace(/श्ृणु/gu, 'शृणु');
    s = s.replace(/साङ्ख्यये/gu, 'साङ्ख्ये');

    // Chanakya unmapped Latin character and ligature healing
    s = s.replace(/K/gu, '्य');
    s = s.replace(/F/gu, 'स्न');
    s = s.replace(/V/gu, 'ङ्क');
    s = s.replace(/d/gu, 'स्र');
    s = s.replace(/u/gu, 'ह्व');
    s = s.replace(/g/gu, 'द्द');
    s = s.replace(/O/gu, 'ह्र');
    s = s.replace(/G/gu, 'त्र');
    s = s.replace(/Y/gu, 'ङ्घ');
    s = s.replace(/P/gu, 'क्क');
    s = s.replace(/t/gu, 'ह्ला');
    s = s.replace(/जाqवी/gu, 'जाह्नवी');
    s = s.replace(/विq/gu, 'वह्नि');
    s = s.replace(/q/gu, 'ह्न');
    s = s.replace(/Mँ/gu, 'रूँ');
    s = s.replace(/कMँ/gu, 'करूँ');
    s = s.replace(/M/gu, 'रू');
    s = s.replace(/तैNर्त/gu, 'तैर्हृत');
    s = s.replace(/N/gu, 'र्हृ');

    // Chanakya unmapped character and ligature healing
    s = s.replace(/मि्रय/gu, 'म्रिय');
    s = s.replace(/गृˆाति|गृ्णाति|गृ\s*ˆ\s*ाति/gu, 'गृह्णाति');
    s = s.replace(/निगृˆामि|निगृ्णामि|निगृ\s*ˆ\s*ामि/gu, 'निगृह्णामि');
    s = s.replace(/गृˆन्|गृ्णन्|गृ\s*ˆ\s*न्/gu, 'गृह्णन्');
    s = s.replace(/ˆ/gu, 'ह्ण');
    s = s.replace(/À/gu, 'ल्');
    s = s.replace(/´/gu, 'ऋ');
    s = s.replace(/शा®न्त/gu, 'शान्ति');
    s = s.replace(/संसि®द्ध/gu, 'संसिद्धि');
    s = s.replace(/सि®द्ध/gu, 'सिद्धि');
    s = s.replace(/बु®द्ध/gu, 'बुद्धि');
    s = s.replace(/प्रवृ®त्त/gu, 'प्रवृत्ति');
    s = s.replace(/निवृ®त्त/gu, 'निवृत्ति');
    s = s.replace(/आवृ®त्त/gu, 'आवृत्ति');
    s = s.replace(/प्रकृ®त/gu, 'प्रकृति');
    s = s.replace(/भ®क्त/gu, 'भक्ति');
    s = s.replace(/दुर्ग®त/gu, 'दुर्गति');
    s = s.replace(/ग®त/gu, 'गति');
    s = s.replace(/रा®त्र/gu, 'रात्रि');
    s = s.replace(/अ®हसा/gu, 'अहिंसा');
    s = s.replace(/®/gu, 'ि');
    s = s.replace(/बढ∏ने|बढ़∏ने/gu, 'बढ़ने');
    s = s.replace(/बढ∏ाने|बढ़∏ाने/gu, 'बढ़ाने');
    s = s.replace(/जड़∏ें/gu, 'जड़ें');
    s = s.replace(/∏/gu, '');
    s = s.replace(/सVÀप/gu, 'संकल्प');
    s = s.replace(/VÀ/gu, 'ङ्कल्प');
    s = s.replace(/सVार/gu, 'सङ्कार');
    s = s.replace(/मोVार/gu, 'मोङ्कार');
    s = s.replace(/पवित्रमोVार/gu, 'पवित्रमोंकार');

    // Remove any stray dotted circle characters
    s = s.replace(/[\u25CC\u25CB]/gu, '');
    return s;
  };

  // Render text with sacred Devanagari styling
  const renderFormattedScripture = (rawText: string) => {
    const cleaned = sanitizeScriptureText(rawText);
    const units = groupScriptureFolio(cleaned);

    const formatLineText = (lineText: string) => {
      let targetLine = lineText;
      if (isPadachhedaMode) {
        targetLine = generatePadachheda(lineText).padachheda;
      }
      const displayText = scriptMode === 'iast' ? devanagariToIast(targetLine) : targetLine;

      if (isPadachhedaMode && scriptMode === 'devanagari') {
        return displayText.split(/([ -]+)/).map((part, pIdx) => {
          if (part === '-') {
            return <span key={pIdx} className="padachheda-delimiter">-</span>;
          }
          if (part.trim()) {
            return <span key={pIdx} className="padachheda-split-word">{part}</span>;
          }
          return part;
        });
      }
      return displayText;
    };

    const isKarmakandaPaddhati =
      book.id.includes('paddhati') ||
      book.id.includes('karmakanda') ||
      book.title.includes('पद्धति') ||
      book.title.includes('विधान');

    const isDualLayer =
      !isKarmakandaPaddhati &&
      (isGitaBook ||
        isVsnBook ||
        (book.language === 'mixed' && (book.title.includes('अनुवाद') || book.title.includes('टीका'))) ||
        book.title.includes('अनुवाद'));
    const isDarkSlate = readingTheme === 'dark-slate';

    // High-contrast, distinctly separated dual-layer layout for Srimad Bhagavad Gita, Vishnu Sahasranama & bilingual scriptures
    if (isDualLayer) {
      // For Vishnu Sahasranama Cover (Page 1), show consecrated title page rather than OCR cover illustration noise
      if (isVsnBook && currentPageIndex === 0) {
        return (
          <div className="py-6 sm:py-12 text-center space-y-6 select-none">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#8C2D19]/10 border-2 border-[#8C2D19]/40 flex items-center justify-center text-4xl shadow-inner text-[#8C2D19]">
              ☸
            </div>
            <div className="space-y-2">
              <p className="text-xs tracking-widest text-[#8C2D19] font-bold uppercase font-devanagari">
                ॥ श्रीहरिः ॥
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold font-serifDevanagari text-[#7A1505]">
                श्रीविष्णुसहस्रनामस्तोत्रम्
              </h2>
              <p className="text-sm font-devanagari text-[#8C2D19] font-semibold">
                (सार्थ सानुवाद — प्रत्येक नाम के सरल हिन्दी अर्थ सहित)
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#8C2D19]/[0.06] border border-[#8C2D19]/25 text-xs text-[#2A170E] space-y-2 font-devanagari leading-relaxed text-center">
              <p className="font-bold text-[#8C2D19]">
                महाभारत अनुशासनपर्व • प्रामाणिक सानुवाद पाठ
              </p>
              <p>
                भगवान् श्रीविष्णु के 1000 परम पवित्र दिव्य नामों का पावन स्तोत्र, जिसे पितामह भीष्म ने शरशय्या पर स्थित होकर धर्मराज युधिष्ठिर को उपदेश दिया था।
              </p>
            </div>

            <button
              onClick={() => setCurrentPageIndex(1)}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#8C2D19] to-[#C44D25] text-white font-bold text-sm font-devanagari shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all inline-flex items-center space-x-2 cursor-pointer"
            >
              <span>मङ्गलाचरण एवं स्तोत्र प्रारम्भ करें</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        );
      }

      // Pre-process bilingual text: separate speaker tags and verse end dandas from adjacent Hindi translation lines
      let preparedText = cleaned;
      preparedText = preparedText.replace(/स्तोत्रम्यस्य/gu, 'स्तोत्रम्\n\nयस्य');
      preparedText = preparedText.replace(/(अथ\s+श्रीविष्णुसहस्रनाम(?:स्तोत्र[म्‌]?)?)\s*(यस्य\s+)/gu, '$1\n\n$2');
      preparedText = preparedText.replace(/([।॥])\s*([॥\s]*(?:धृतराष्ट्र|सञ्जय|संजय|अर्जुन|श्रीभगवान्?|भगवान्?|भीष्म|युधिष्ठिर|वैशम्पायन)\s*[उु]?वाच[॥ः:\s]*)/gu, '$1\n\n$2\n\n');
      preparedText = preparedText.replace(/([॥\s]*(?:धृतराष्ट्र|सञ्जय|संजय|अर्जुन|श्रीभगवान्?|भगवान्?|भीष्म|युधिष्ठिर|वैशम्पायन)\s*[उु]?वाच[॥ः:\s]*)\s*([^\n])/gu, '$1\n\n$2');
      preparedText = preparedText.replace(/\)\s*([०-९\d]+)\s*[।॥]/gu, '॥ $1 ॥\n\n');
      preparedText = preparedText.replace(/(॥(?:\s*[०-९\d\-]+\s*॥)?)\s*([^\s\d०-९।॥])/gu, '$1\n\n$2');
      preparedText = preparedText.replace(/([।॥]\s*[०-९\d\-]+\s*[।॥])\s*([^\s])/gu, '$1\n\n$2');
      preparedText = preparedText.replace(/([।॥])\s*(नमः\s+समस्तभूताना)/gu, '$1\n\n$2');

      const rawBlocks = parseGitaFolio(preparedText);

      // Pair consecutive SHLOKA and ANUVAD blocks into unified inline verse units (with Kulaka support)
      interface PairedLiturgicalUnit {
        kind: 'HEADING' | 'SPEAKER' | 'VERSE_PAIR' | 'ANUVAD_ONLY';
        heading?: string;
        speaker?: string;
        shlokaVerses?: string[][];
        anuvadText?: string;
      }

      const pairedUnits: PairedLiturgicalUnit[] = [];
      for (let i = 0; i < rawBlocks.length; i++) {
        const cur = rawBlocks[i];
        if (cur.type === 'HEADING') {
          pairedUnits.push({ kind: 'HEADING', heading: cur.text });
        } else if (cur.type === 'SPEAKER') {
          pairedUnits.push({ kind: 'SPEAKER', speaker: cur.speaker });
        } else if (cur.type === 'SHLOKA') {
          // Look ahead: collect all consecutive SHLOKAs in case of a multi-shloka Kulaka (e.g. 10, 11, 12)
          const shlokaVerses: string[][] = [cur.lines];
          let j = i + 1;
          while (j < rawBlocks.length && rawBlocks[j].type === 'SHLOKA') {
            shlokaVerses.push(rawBlocks[j].lines);
            j++;
          }
          const nextBlock = j < rawBlocks.length ? rawBlocks[j] : null;
          if (nextBlock && nextBlock.type === 'ANUVAD') {
            pairedUnits.push({
              kind: 'VERSE_PAIR',
              shlokaVerses,
              anuvadText: nextBlock.lines.join(' '),
            });
            i = j; // consumed up to and including anuvad
          } else {
            pairedUnits.push({
              kind: 'VERSE_PAIR',
              shlokaVerses,
            });
            i = j - 1;
          }
        } else if (cur.type === 'ANUVAD') {
          pairedUnits.push({
            kind: 'ANUVAD_ONLY',
            anuvadText: cur.lines.join(' '),
          });
        }
      }

      return (
        <div className="space-y-4 py-1">
          {pairedUnits.map((u, uIdx) => {
            if (u.kind === 'HEADING') {
              return (
                <div key={uIdx} className="my-3 sm:my-4 text-center select-none">
                  <span className={`font-serifDevanagari font-bold text-base sm:text-lg tracking-wider ${
                    isDarkSlate ? 'text-white font-bold' : 'text-[#8C2D19]'
                  }`}>
                    {formatLineText(u.heading || '')}
                  </span>
                </div>
              );
            }

            if (u.kind === 'SPEAKER') {
              return (
                <div key={uIdx} className="my-3 text-center select-none">
                  <span
                    className={`inline-flex items-center space-x-2 px-4 py-1 rounded-full border font-serifDevanagari font-bold text-sm tracking-widest shadow-xs ${
                      isDarkSlate
                        ? 'border-neutral-700 bg-neutral-900/80 text-white'
                        : 'border-[#8C2D19]/40 bg-[#8C2D19]/10 text-[#8C2D19]'
                    }`}
                  >
                    <span className={isDarkSlate ? 'text-rose-400' : 'text-[#C44D25]'}>॥</span>
                    <span>{formatLineText(u.speaker || '')}</span>
                    <span className={isDarkSlate ? 'text-rose-400' : 'text-[#C44D25]'}>॥</span>
                  </span>
                </div>
              );
            }

            if (u.kind === 'VERSE_PAIR') {
              return (
                <div
                  key={uIdx}
                  className={`my-3.5 px-4 sm:px-6 py-4 rounded-2xl border select-text shadow-xs transition-all ${
                    isDarkSlate
                      ? 'bg-neutral-900/70 border-neutral-800'
                      : 'bg-[#8C2D19]/[0.035] border-[#8C2D19]/25 hover:border-[#8C2D19]/40'
                  }`}
                >
                  {/* Sanskrit Shloka(s) */}
                  <div className="text-center space-y-3 select-text">
                    {(u.shlokaVerses || []).map((verseLines, vIdx) => (
                      <div key={vIdx} className="space-y-1">
                        {verseLines
                          .filter(l => Boolean(l.trim()) && !/^[।॥\s]+$/.test(l.trim()))
                          .map((sLine, sIdx) => (
                            <p
                              key={sIdx}
                              className={`font-tiro font-bold text-center tracking-normal leading-[2.2] select-text ${
                                isDarkSlate ? 'text-white' : 'text-[#7A1505]'
                              } ${isPadachhedaMode ? 'padachheda-mode-container' : ''}`}
                              style={{
                                fontSize: `${Math.round(fontSize * 1.05)}px`,
                                ...getFontFamilyStyle('PAURANIK_SHLOKA'),
                              }}
                            >
                              {formatLineText(sLine)}
                            </p>
                          ))}
                      </div>
                    ))}
                  </div>

                  {/* Subtle Ornamental Divider and Inline Hindi Anuvad */}
                  {u.anuvadText && (
                    <>
                      <div className="my-3.5 flex items-center justify-center select-none opacity-40">
                        <div className={`h-[1px] w-16 sm:w-28 ${isDarkSlate ? 'bg-neutral-700' : 'bg-[#8C2D19]'}`} />
                        <span className={`mx-2 text-xs ${isDarkSlate ? 'text-rose-400' : 'text-[#8C2D19]'}`}>❖</span>
                        <div className={`h-[1px] w-16 sm:w-28 ${isDarkSlate ? 'bg-neutral-700' : 'bg-[#8C2D19]'}`} />
                      </div>
                      <p
                        className={`font-devanagari font-normal text-left sm:text-justify leading-[1.9] select-text px-1 sm:px-2 ${
                          isDarkSlate ? 'text-[#F8FAFC]' : 'text-[#1C120C]'
                        }`}
                        style={{
                          fontSize: `${fontSize}px`,
                          ...getFontFamilyStyle('REGULAR_TEXT'),
                        }}
                      >
                        {formatLineText(u.anuvadText)}
                      </p>
                    </>
                  )}
                </div>
              );
            }

            if (u.kind === 'ANUVAD_ONLY') {
              return (
                <div
                  key={uIdx}
                  className={`my-3 px-4 sm:px-5 py-3 rounded-xl border-l-3 text-left select-text ${
                    isDarkSlate
                      ? 'bg-white/[0.03] border-sacred-500/60 text-[#F8FAFC]'
                      : 'bg-black/[0.025] border-[#8C2D19]/60 text-[#1C120C]'
                  }`}
                >
                  <p
                    className="font-devanagari font-normal leading-[1.9] select-text"
                    style={{
                      fontSize: `${fontSize}px`,
                      ...getFontFamilyStyle('REGULAR_TEXT'),
                    }}
                  >
                    {formatLineText(u.anuvadText || '')}
                  </p>
                </div>
              );
            }

            return null;
          })}
        </div>
      );
    }

    return (
      <div className="space-y-1 sm:space-y-1.5">
        {units.map((unit, idx) => {
          if (unit.kind === 'namavali_grid') {
            return (
              <div
                key={idx}
                className="my-3 sm:my-4 p-3.5 sm:p-4 rounded-2xl bg-[#8C2D19]/[0.05] border border-[#8C2D19]/20 shadow-xs"
              >
                <div className={`text-center text-xs font-devanagari font-bold uppercase tracking-widest mb-3 flex items-center justify-center space-x-2 ${
                  isDarkSlate ? 'text-white' : 'text-[#661203]'
                }`}>
                  <span>🙏</span>
                  <span>प्रधान देवता नमस्कार नामावली</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8C2D19]/10 text-[#661203] dark:text-white font-semibold">
                    {unit.items.length} देवता
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  {unit.items.map((item, nIdx) => (
                    <div
                      key={nIdx}
                      className="px-3.5 py-2 rounded-xl bg-white/60 dark:bg-black/25 border border-[#8C2D19]/15 flex items-center hover:bg-white/90 dark:hover:bg-black/45 transition-colors shadow-2xs"
                    >
                      <span
                        className={`font-tiro font-semibold text-xs sm:text-sm select-text ${
                          isDarkSlate ? 'text-white' : 'text-[#110A05]'
                        }`}
                        style={{ ...getFontFamilyStyle('NAMAVALI') }}
                      >
                        {formatLineText(item)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          const trimmed = unit.line;

          // Sacred Section Headings like 【 शान्ति पाठः 】, 【 विनियोगः 】, 【 ध्यानम् 】
          if (unit.type === 'SECTION_HEADING' || (trimmed.startsWith('【') && trimmed.endsWith('】'))) {
            return (
              <div key={idx} className="my-4 text-center select-none">
                <span className={`font-serifDevanagari font-bold text-sm sm:text-base tracking-wider ${
                  isDarkSlate ? 'text-white font-bold' : 'text-[#661203]'
                }`}>
                  {trimmed}
                </span>
              </div>
            );
          }

          // Subheadings or invocation lines like ॥ श्रीगणेशाय नमः ॥ (excluding isolated verse numbers like ॥ १३ ॥)
          if (unit.type === 'INVOCATION_HEADING' || (trimmed.startsWith('॥') && trimmed.endsWith('॥') && trimmed.length < 50 && !/[०-९\d]/.test(trimmed))) {
            return (
              <div
                key={idx}
                className={`text-center font-bold tracking-wide my-3 font-serifDevanagari select-none ${
                  isDarkSlate ? 'text-rose-400' : 'text-[#4A0D02]'
                }`}
                style={{
                  fontSize: `${Math.round(fontSize * 1.18)}px`,
                  ...getFontFamilyStyle('INVOCATION_HEADING'),
                }}
              >
                {trimmed}
              </div>
            );
          }

          // Ritual Step Headers (e.g. • पवित्रीकरणम्: or • सप्तधान्य प्रक्षेप (भूमि पर सप्तधान्य रखें):)
          if (unit.type === 'RITUAL_STEP_HEADER') {
            const rawHeader = trimmed.replace(/^[•▪\*]\s*/, '').replace(/[:—–\s]*$/, '');
            const parenMatch = rawHeader.match(/^([^(]+?)\s*\(([^)]+)\)$/);
            const stepTitle = parenMatch ? parenMatch[1].trim() : rawHeader;
            const stepHint = parenMatch ? parenMatch[2].trim() : null;

            return (
              <div key={idx} className="my-3 sm:my-3.5 select-none">
                <div className={`mx-auto max-w-xl px-4 py-1.5 rounded-2xl flex flex-wrap items-center justify-center gap-2 border shadow-2xs ${
                  isDarkSlate
                    ? 'bg-neutral-900 border-neutral-700 text-white'
                    : 'bg-[#8C2D19]/[0.06] border-[#8C2D19]/25 text-[#4A0D02]'
                }`}>
                  <div className="flex items-center space-x-1.5 font-bold font-serifDevanagari text-sm sm:text-base tracking-wide text-[#4A0D02] dark:text-white">
                    <span className="text-[#8C2D19] dark:text-rose-400 text-xs">🪔</span>
                    <span>{stepTitle}</span>
                  </div>
                  {stepHint && (
                    <span className={`text-[11px] sm:text-xs font-devanagari px-2.5 py-0.5 rounded-full font-medium italic ${
                      isDarkSlate
                        ? 'bg-black/50 text-neutral-200'
                        : 'bg-[#8C2D19]/10 text-[#661203]'
                    }`}>
                      💧 {stepHint}
                    </span>
                  )}
                </div>
              </div>
            );
          }

          // Upachara Samarpana Mantras: Rendered as clean, normal sacred text without artificial label
          if (unit.type === 'SAMARPANA_MANTRA') {
            const cleanMantra = trimmed.replace(/^[•▪\*]\s*/, '');
            return (
              <p
                key={idx}
                className={`text-center tracking-normal leading-[1.9] select-text my-1 sm:my-1.5 font-medium ${
                  isDarkSlate ? 'text-white' : 'text-[#8C2D19]'
                } ${isPadachhedaMode ? 'padachheda-mode-container' : ''}`}
                style={{
                  fontSize: `${fontSize}px`,
                  ...getFontFamilyStyle('PAURANIK_SHLOKA'),
                }}
              >
                {formatLineText(cleanMantra)}
              </p>
            );
          }

          // Karmakanda Segments (Viniyoga, Sankalpa, Nyasa, Upachara)
          const karmakanda = parseKarmakandaSegment(trimmed);

          // If interactive ritual mode is toggled on, show detailed interactive cards
          if (isKarmakandaMode && karmakanda.type !== 'REGULAR' && karmakanda.type !== 'MANTRA') {
            return (
              <div key={idx} className="my-2 select-text">
                <KarmakandaSegmentRenderer segment={karmakanda} />
              </div>
            );
          }

          // In standard Reading Mode (ग्रन्थ पाठ): Render pure, authentic book typography
          if (karmakanda.type === 'VINIYOGA' && karmakanda.viniyogaData) {
            const v = karmakanda.viniyogaData;
            return (
              <div key={idx} className="my-3 text-center select-text">
                <p
                  className={`font-tiro font-semibold text-center leading-relaxed select-text ${
                    isDarkSlate ? 'text-white' : 'text-[#110A05]'
                  }`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {formatLineText(v.fullText)}
                </p>
                <div className={`mt-1 text-xs font-devanagari flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 ${
                  isDarkSlate ? 'text-neutral-200' : 'text-[#661203]'
                }`}>
                  <span>(ऋषि: <strong>{v.rishi?.name || 'गणक'}</strong> [{v.rishi?.touchPoint || 'शिरसि'}]</span>
                  <span>• छन्द: <strong>{v.chhandas?.name || 'निचृद्गायत्री'}</strong> [{v.chhandas?.touchPoint || 'मुखे'}]</span>
                  <span>• देवता: <strong>{v.devata?.name || 'श्रीमहागणपति'}</strong> [{v.devata?.touchPoint || 'हृदये'}]</span>
                  {v.bija && <span>• बीज: <strong>{v.bija.name}</strong></span>}
                  {v.shakti && <span>• शक्ति: <strong>{v.shakti.name}</strong></span>}
                  {v.kilaka && <span>• कीलक: <strong>{v.kilaka.name}</strong></span>}
                  <span>• विनियोग: <strong>जल-त्याग</strong>)</span>
                </div>
              </div>
            );
          }

          if ((karmakanda.type === 'SANKALPA' && karmakanda.sankalpaData) || unit.type === 'SANKALPA') {
            const s = karmakanda.sankalpaData;
            const fullSankalpa = s ? s.fullText : trimmed;
            return (
              <div key={idx} className="my-3.5 mx-auto max-w-2xl p-4 rounded-2xl bg-black/[0.04] dark:bg-neutral-900/80 border border-neutral-700/60 shadow-xs select-text text-center">
                <div className="flex items-center justify-center space-x-1.5 mb-2 text-xs font-bold font-devanagari tracking-widest text-[#661203] dark:text-white">
                  <span>🧭</span>
                  <span>महा-सङ्कल्प विधान</span>
                </div>
                <p
                  className={`font-tiro text-center leading-relaxed select-text ${
                    isDarkSlate ? 'text-white' : 'text-[#110A05]'
                  }`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {formatLineText(fullSankalpa)}
                </p>
                {s?.actionInstruction && (
                  <p className={`mt-2 text-xs sm:text-sm font-devanagari italic ${
                    isDarkSlate ? 'text-neutral-200' : 'text-[#661203]'
                  }`}>
                    (💧 {s.actionInstruction})
                  </p>
                )}
              </div>
            );
          }

          // Vaidika Mantras: DARK / Deep Jet Black Sacred Ink (सस्वर/वैदिक मन्त्र - गम्भीर कृष्ण वर्ण)
          if (unit.type === 'VEDIC_MANTRA') {
            return (
              <p
                key={idx}
                className={`text-center tracking-wide font-feature-settings-vedic transition-all leading-[2.2] select-text my-1 sm:my-1.5 font-semibold ${
                  isDarkSlate ? 'text-white font-bold' : 'text-[#0A0502]'
                } ${isPadachhedaMode ? 'padachheda-mode-container' : ''}`}
                style={{
                  fontSize: `${fontSize}px`,
                  ...getFontFamilyStyle('VEDIC_MANTRA'),
                }}
              >
                {formatLineText(trimmed.replace(/^[•▪\*]\s*/, ''))}
              </p>
            );
          }

          // Pauranika Shlokas & Stotras: Sacred Terracotta Maroon in light mode, Pure Crisp White in dark mode
          if (unit.type === 'PAURANIK_SHLOKA') {
            return (
              <p
                key={idx}
                className={`text-center tracking-normal leading-[1.9] select-text my-1 sm:my-1.5 font-medium ${
                  isDarkSlate ? 'text-white font-bold' : 'text-[#8C2D19]'
                } ${isPadachhedaMode ? 'padachheda-mode-container' : ''}`}
                style={{
                  fontSize: `${fontSize}px`,
                  ...getFontFamilyStyle('PAURANIK_SHLOKA'),
                }}
              >
                {formatLineText(trimmed.replace(/^[•▪\*]\s*/, ''))}
              </p>
            );
          }

          // Karmakanda Vidhi Instructions: Traditional parenthetical liturgical red/italic
          if (unit.type === 'VIDHI_INSTRUCTION') {
            const cleanVidhi = trimmed.replace(/^\(\s*/, '').replace(/\s*\)[;:]?$/, '').replace(/^[•▪\*]\s*/, '');
            return (
              <div key={idx} className="my-2 mx-auto max-w-xl px-4 py-1.5 rounded-xl bg-[#8C2D19]/[0.05] dark:bg-neutral-900 border-l-3 border-[#8C2D19]/60 text-center select-text">
                <p className={`font-devanagari text-xs sm:text-sm font-medium italic ${
                  isDarkSlate ? 'text-neutral-200' : 'text-[#661203]'
                }`}>
                  📜 {formatLineText(cleanVidhi)}
                </p>
              </div>
            );
          }

          // Regular text
          return (
            <p
              key={idx}
              className={`text-center tracking-wide ${getLineHeightClass()} sanskrit-text transition-all ${
                isDarkSlate ? 'text-white' : 'text-[#1C120C]'
              } ${isPadachhedaMode ? 'padachheda-mode-container' : ''}`}
              style={{
                fontSize: `${fontSize}px`,
                ...getFontFamilyStyle('REGULAR_TEXT'),
              }}
            >
              {formatLineText(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${getOuterThemeClass()} flex flex-col justify-between relative`}>
      {/* Floating Pill when Top Bar is Hidden */}
      {isHeaderHidden && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center space-x-2 bg-neutral-950/95 backdrop-blur-md border border-neutral-700 shadow-2xl rounded-full px-4 py-1.5 text-neutral-100 text-xs font-devanagari">
            <button
              onClick={() => setIsHeaderHidden(false)}
              className="flex items-center space-x-1.5 hover:text-white font-bold transition-all cursor-pointer"
              title="शीर्ष बार पुनः दिखाएं (H या Esc)"
            >
              <Eye className="w-4 h-4 text-sacred-400 animate-pulse" />
              <span>शीर्ष बार दिखाएं</span>
              <span className="text-[10px] text-neutral-400 font-mono">(H)</span>
            </button>
            <span className="text-neutral-600">|</span>
            <button
              onClick={toggleFullscreen}
              className="flex items-center space-x-1 hover:text-white transition-all cursor-pointer"
              title="पूर्ण स्क्रीन बदलें (F)"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-sacred-400" /> : <Maximize2 className="w-3.5 h-3.5 text-sacred-400" />}
              <span>{isFullscreen ? 'स्क्रीन सामान्य' : 'पूर्ण स्क्रीन'}</span>
              <span className="text-[10px] text-neutral-400 font-mono">(F)</span>
            </button>
            <span className="text-neutral-600">|</span>
            <button
              onClick={() => setIsTocOpen(true)}
              className="flex items-center space-x-1 hover:text-white transition-all cursor-pointer"
              title="अनुक्रमणिका खोलें"
            >
              <Layers className="w-3.5 h-3.5 text-sacred-400" />
              <span>अनुक्रमणिका</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Reading Controls Header */}
      {!isHeaderHidden && (
        <header className="sticky top-0 z-40 border-b border-black/30 bg-neutral-950/90 backdrop-blur-md px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-neutral-100 shadow-lg">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-devanagari">ग्रन्थालय</span>
          </button>

          {/* Table of Contents Trigger */}
          <button
            onClick={() => setIsTocOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sacred-800 hover:bg-sacred-700 text-white font-devanagari text-xs font-bold border border-sacred-600/50 shadow-md transition-all active:scale-95 cursor-pointer"
            title={isGitaBook ? "श्रीमद्भगवद्गीता अनुक्रमणिका एवं अध्याय सूची खोलें" : isVsnBook ? "श्रीविष्णुसहस्रनाम विषय-सूची खोलें" : "अनुक्रमणिका खोलें"}
          >
            <Layers className="w-3.5 h-3.5 text-sacred-300" />
            <span>अनुक्रमणिका</span>
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-bold text-sm sm:text-base font-serifDevanagari text-white flex items-center gap-2">
                <span>{book.title.replace(/\s*\([^)]*गीताप्रेस[^)]*\)/gi, '').trim()}</span>
                {isGitaBook && currentChapter && (
                  <>
                    <span className="text-neutral-500 font-serif text-sm">•</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-sacred-950/80 border border-sacred-700 text-white text-xs sm:text-sm font-devanagari font-bold shadow-xs">
                      {currentChapter.sectionType === 'adhyaya' && currentChapter.chapterNumber ? (
                        <span>अध्याय {currentChapter.chapterNumber} : {currentChapter.nameSa}</span>
                      ) : (
                        <span>{currentChapter.titleSa}</span>
                      )}
                    </span>
                  </>
                )}
                {isVsnBook && currentVsnSection && (
                  <>
                    <span className="text-neutral-500 font-serif text-sm">•</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-sacred-950/80 border border-sacred-700 text-white text-xs sm:text-sm font-devanagari font-bold shadow-xs">
                      <span>{currentVsnSection.icon} {currentVsnSection.titleHi}</span>
                    </span>
                  </>
                )}
                {isBrihatStotraBook && currentBrihatStotra && (
                  <>
                    <span className="text-neutral-500 font-serif text-sm">•</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-sacred-950/80 border border-sacred-700 text-white text-xs sm:text-sm font-devanagari font-bold shadow-xs">
                      <span>📖 #{currentBrihatStotra.stotraNumber} {currentBrihatStotra.title}</span>
                    </span>
                  </>
                )}
              </h1>
            </div>
            <p className="text-[11px] text-neutral-400 font-devanagari flex items-center space-x-2 mt-0.5">
              <span>दृष्टा / रचयिता: <strong>{book.author || 'पारंपरिक महर्षि'}</strong></span>
              <span>•</span>
              {isGitaBook && currentChapter ? (
                <span className="text-neutral-200 font-medium">
                  अध्याय पत्र {currentPageIndex + 1 - currentChapter.startPage + 1} / {currentChapter.endPage - currentChapter.startPage + 1}
                  <span className="text-neutral-500 font-mono ml-1.5">(सकल पत्र {currentPage ? currentPage.page_number : 0} / {pages.length})</span>
                </span>
              ) : isVsnBook && currentVsnSection ? (
                <span className="text-neutral-200 font-medium">
                  {currentVsnSection.nameHi}
                  <span className="text-neutral-500 font-mono ml-1.5">(पत्र {currentPage ? currentPage.page_number : 0} / {pages.length})</span>
                </span>
              ) : isBrihatStotraBook && currentBrihatStotra ? (
                <span className="text-neutral-200 font-medium">
                  स्तोत्र #{currentBrihatStotra.stotraNumber} {currentBrihatStotra.title} (मूल पृष्ठ {currentBrihatStotra.bookPage})
                  <span className="text-neutral-500 font-mono ml-1.5">(पत्र {currentPage ? currentPage.page_number : 0} / {pages.length})</span>
                </span>
              ) : (
                <span>पत्र {currentPage ? currentPage.page_number : 0} / {pages.length}</span>
              )}
            </p>
          </div>
        </div>

        {/* Customization Toolbar */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* View Mode (Only 'पाठ' shown as required) */}
          <div className="flex items-center bg-sacred-700 text-white rounded-xl px-2.5 py-1 font-devanagari font-bold space-x-1.5 shadow-xs border border-sacred-500/50">
            <BookOpen className="w-3.5 h-3.5" />
            <span>पाठ</span>
          </div>

          {/* Font Selector */}
          <select
            value={fontFamily}
            onChange={e => setFontFamily(e.target.value as ScriptureFont)}
            className="bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-xl px-2.5 py-1.5 text-xs font-devanagari focus:outline-none focus:border-sacred-500 cursor-pointer shadow-inner"
            title="पवित्र संस्कृत लिपि फॉन्ट चुनें"
          >
            <option value="harmonized">⚜️ शास्त्र सम्मत (वैदिक + पौराणिक द्वैध)</option>
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
            <span className="text-[11px] font-mono px-2 text-white font-bold">{fontSize}</span>
            <button
              onClick={() => setFontSize(prev => Math.min(36, prev + 2))}
              className="p-1 rounded hover:bg-white/15 font-bold text-neutral-300 hover:text-white"
              title="फॉन्ट बड़ा करें"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Spacing (Only 'सघन' shown as required) */}
          <div className="flex items-center bg-sacred-700 text-white rounded-xl px-2.5 py-1 font-devanagari font-bold text-xs shadow-xs border border-sacred-500/50" title="सघन पंक्ति दूरी (Compact row spacing)">
            <span>सघन</span>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/15">
            <button
              onClick={() => setReadingTheme('bhojpatra')}
              className={`px-2 py-1 rounded-lg text-xs font-devanagari transition-all flex items-center space-x-1 ${
                readingTheme === 'bhojpatra' ? 'bg-sacred-700 text-white font-bold shadow' : 'text-neutral-300 hover:text-white'
              }`}
              title="प्राकृतिक हिमालयी भोजपत्र शैली"
            >
              <Scroll className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">भोजपत्र</span>
            </button>
            <button
              onClick={() => setReadingTheme('golden-birch')}
              className={`px-2 py-1 rounded-lg text-xs font-devanagari transition-all flex items-center space-x-1 ${
                readingTheme === 'golden-birch' ? 'bg-neutral-800 text-white font-bold shadow' : 'text-neutral-300 hover:text-white'
              }`}
              title="स्वर्णिम भूर्जपत्र शैली"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">स्वर्ण</span>
            </button>
            <button
              onClick={() => setReadingTheme('dark-slate')}
              className={`p-1.5 rounded-lg transition-all ${
                readingTheme === 'dark-slate' ? 'bg-neutral-800 text-white font-bold shadow' : 'text-neutral-400 hover:text-white'
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
                ? 'bg-sacred-800/80 border-sacred-600 text-white font-bold'
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
                ? 'bg-sacred-700 border-sacred-500 text-white shadow-md font-bold scale-[1.02]'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-neutral-200'
            }`}
            title="पाणिनीय पदच्छेद: समस्त पदों एवं संधियों को अलग-अलग देखने हेतु (UoHyd Standard)"
          >
            <Split className="w-3.5 h-3.5" />
            <span>{isPadachhedaMode ? 'पदच्छेद (विभक्त शब्द)' : 'पदच्छेद'}</span>
          </button>

          {/* Karmakanda Ritual Action Toggle */}
          <button
            onClick={() => setIsKarmakandaMode(!isKarmakandaMode)}
            className={`px-3 py-1 rounded-xl border text-xs font-semibold transition-all flex items-center space-x-1.5 font-devanagari shadow-sm ${
              isKarmakandaMode
                ? 'bg-sacred-700 border-sacred-500 text-white shadow-md font-bold'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-neutral-300'
            }`}
            title="कर्मकाण्ड विधि निर्देश, सङ्कल्प, विनियोग, न्यास एवं उपचार चक्र दर्शन"
          >
            <span>🪔</span>
            <span>{isKarmakandaMode ? 'क्रिया-कार्ड सक्रिय' : 'क्रिया-कार्ड'}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className={`px-2.5 py-1 rounded-xl border text-xs font-semibold transition-all flex items-center space-x-1 cursor-pointer ${
              isFullscreen
                ? 'bg-sacred-700 border-sacred-500 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-neutral-200'
            }`}
            title="पूर्ण स्क्रीन (Fullscreen - F)"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'सामान्य' : 'पूर्ण स्क्रीन'}</span>
          </button>

          {/* Hide Top Bar / Focus Mode */}
          <button
            onClick={() => setIsHeaderHidden(true)}
            className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-neutral-200 hover:text-white transition-all flex items-center space-x-1 cursor-pointer"
            title="शीर्ष बार छिपाएं / स्वाध्याय मोड (H)"
          >
            <EyeOff className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline font-devanagari">बार छिपाएं</span>
          </button>
        </div>
      </header>
      )}

      {/* Main Reading Container (Text / Path Mode Only) */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 w-full flex-grow flex flex-col items-center justify-center">
        <div
          style={getPothiSheetStyle()}
          className="pothi-manuscript-border rounded-3xl p-5 sm:p-8 w-full transition-all relative overflow-hidden my-2"
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

          {/* Padachheda Status Banner if active */}
          {currentPage && isPadachhedaMode && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
              <span className="flex items-center space-x-1.5 text-xs px-3 py-0.5 rounded-full bg-sacred-950 border border-sacred-700 text-white font-semibold shadow-sm">
                <Split className="w-3.5 h-3.5 text-sacred-400" />
                <span>पदच्छेद सक्रिय (Padachheda Mode)</span>
              </span>
            </div>
          )}

          {/* Core Scripture Body */}
          {currentPage ? (
            (currentPage.verified_text || currentPage.ocr_text) ? (
              renderFormattedScripture(
                activeStotraScope && isBrihatStotraBook
                  ? getStotraIsolatedText(currentPage.verified_text || currentPage.ocr_text || '', activeStotraScope, currentPageIndex + 1)
                  : (currentPage.verified_text || currentPage.ocr_text || '')
              )
            ) : (
              <div className="text-center py-8 px-4 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#8C2D19]/10 border border-[#8C2D19]/30 flex items-center justify-center text-[#8C2D19] dark:text-neutral-200">
                  <Scroll className="w-6 h-6" />
                </div>
                <p className="font-serifDevanagari text-base sm:text-lg text-[#8C2D19] dark:text-white font-bold">
                  यह पृष्ठ (पत्रम् {currentPage.page_number}) अभी पाठ-सत्यापन अवस्था में है
                </p>
                <p className="text-xs font-devanagari opacity-75 max-w-md mx-auto">
                  पाठ का शोधन एवं शास्त्रीय पदच्छेद प्रगति पर है।
                </p>
              </div>
            )
          ) : (
            <p className="text-center opacity-60">कोई पृष्ठ नहीं मिला।</p>
          )}

          {/* Stotra Quick Navigator (Previous / Next Stotra) */}
          {isBrihatStotraBook && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-4 mt-6 border-t border-[#8C2D19]/20">
              {(() => {
                const currentIndex = BRIHAT_STOTRAS.findIndex(s => s.pdfPage === currentBrihatStotra?.pdfPage);
                const prevStotra = currentIndex > 0 ? BRIHAT_STOTRAS[currentIndex - 1] : null;
                const nextStotra = currentIndex >= 0 && currentIndex < BRIHAT_STOTRAS.length - 1 ? BRIHAT_STOTRAS[currentIndex + 1] : null;
                return (
                  <>
                    {prevStotra ? (
                      <button
                        onClick={() => {
                          if (activeStotraScope) setActiveStotraScope(prevStotra);
                          setCurrentPageIndex(prevStotra.pdfPage - 1);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#8C2D19]/10 hover:bg-[#8C2D19]/20 text-[#8C2D19] dark:text-neutral-200 border border-[#8C2D19]/30 text-xs font-devanagari flex items-center space-x-1 transition-all cursor-pointer"
                        title={`पिछला स्तोत्र (${prevStotra.title})`}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>#{prevStotra.stotraNumber} {prevStotra.title}</span>
                      </button>
                    ) : <div />}

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsTocOpen(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-sacred-800 hover:bg-sacred-700 text-white border border-sacred-600 text-xs font-devanagari font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-sacred-300" />
                        <span>२२४ स्तोत्र सूची</span>
                      </button>
                    </div>

                    {nextStotra ? (
                      <button
                        onClick={() => {
                          if (activeStotraScope) setActiveStotraScope(nextStotra);
                          setCurrentPageIndex(nextStotra.pdfPage - 1);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#8C2D19]/10 hover:bg-[#8C2D19]/20 text-[#8C2D19] dark:text-neutral-200 border border-[#8C2D19]/30 text-xs font-devanagari flex items-center space-x-1 transition-all cursor-pointer"
                        title={`अगला स्तोत्र (${nextStotra.title})`}
                      >
                        <span>#{nextStotra.stotraNumber} {nextStotra.title}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : <div />}
                  </>
                );
              })()}
            </div>
          )}

          {/* Pothi Manuscript Folio Number */}
          <div className="text-center pt-3 mt-4 border-t border-dashed border-[#8C2D19]/30 select-none">
            <p className="text-sm font-serifDevanagari font-bold text-[#8C2D19] dark:text-white tracking-wider">
              ॥ पत्रम् {currentPageIndex + 1} / {pages.length} ॥
            </p>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Navigation Bar */}
      <footer className="sticky bottom-0 z-40 border-t border-black/20 bg-black/70 backdrop-blur-md px-4 py-3 flex items-center justify-between max-w-2xl mx-auto rounded-t-2xl shadow-2xl w-full">
        <button
          onClick={() => {
            if (activeStotraScope && stotraRange && currentPageIndex <= stotraRange.startPage - 1) {
              if (stotraRange.prevStotra) {
                setActiveStotraScope(stotraRange.prevStotra);
                setCurrentPageIndex(stotraRange.prevStotra.pdfPage - 1);
              }
              return;
            }
            if (activeChapterScope && currentPageIndex <= activeChapterScope.startPage - 1) {
              const prevChap = GITA_SECTIONS.find(s => s.id === activeChapterScope.id - 1);
              if (prevChap) {
                setActiveChapterScope(prevChap);
                setCurrentPageIndex(prevChap.endPage - 1);
              }
              return;
            }
            setCurrentPageIndex(prev => Math.max(0, prev - 1));
          }}
          disabled={
            activeStotraScope
              ? (activeStotraScope.id === 1 && currentPageIndex <= 0)
              : activeChapterScope
              ? (activeChapterScope.id === 1 && currentPageIndex <= 0)
              : currentPageIndex === 0
          }
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed font-medium text-xs text-white transition-all active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="font-devanagari font-semibold hidden sm:inline">
            {activeStotraScope && stotraRange && currentPageIndex <= stotraRange.startPage - 1
              ? 'पूर्व स्तोत्र'
              : activeChapterScope && currentPageIndex <= activeChapterScope.startPage - 1
              ? 'पूर्व अध्याय'
              : 'पूर्व पृष्ठ'}
          </span>
        </button>

        {/* Direct Page Jump Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const p = parseInt(jumpPageInput, 10);
            if (!isNaN(p)) {
              if (activeStotraScope && stotraRange) {
                if (p >= 1 && p <= stotraRange.totalPages) {
                  setCurrentPageIndex(activeStotraScope.pdfPage - 1 + (p - 1));
                } else if (p >= 1 && p <= pages.length) {
                  setCurrentPageIndex(p - 1);
                }
              } else if (activeChapterScope) {
                const chapterPageCount = activeChapterScope.endPage - activeChapterScope.startPage + 1;
                if (p >= 1 && p <= chapterPageCount) {
                  setCurrentPageIndex(activeChapterScope.startPage - 1 + (p - 1));
                } else if (p >= 1 && p <= pages.length) {
                  setCurrentPageIndex(p - 1);
                }
              } else if (p >= 1 && p <= pages.length) {
                setCurrentPageIndex(p - 1);
              }
            }
          }}
          className="flex items-center space-x-1.5 text-xs font-serifDevanagari"
        >
          <span className="text-white font-bold hidden sm:inline">
            {activeStotraScope ? 'स्तोत्र पत्र' : activeChapterScope ? 'अध्याय पत्र' : 'पत्रम्'}
          </span>
          <input
            type="number"
            min="1"
            max={
              activeStotraScope && stotraRange
                ? stotraRange.totalPages
                : activeChapterScope
                ? (activeChapterScope.endPage - activeChapterScope.startPage + 1)
                : pages.length
            }
            value={jumpPageInput}
            onChange={(e) => setJumpPageInput(e.target.value)}
            className="w-14 text-center font-mono bg-black/80 text-white px-1 py-1 rounded-lg border border-neutral-700 text-xs focus:outline-none focus:border-sacred-500 font-bold"
          />
          <span className="text-neutral-400 font-mono">
            / {activeStotraScope && stotraRange ? stotraRange.totalPages : activeChapterScope ? (activeChapterScope.endPage - activeChapterScope.startPage + 1) : pages.length}
          </span>
          {(activeStotraScope || activeChapterScope) && (
            <span className="text-neutral-500 text-[10px] font-mono hidden md:inline ml-1" title="सम्पूर्ण ग्रन्थ पत्र संख्या">
              (सकल {currentPageIndex + 1}/{pages.length})
            </span>
          )}
          <button
            type="submit"
            className="px-2.5 py-1 rounded-lg bg-sacred-700 hover:bg-sacred-600 text-white text-[11px] font-devanagari font-semibold transition-colors shadow cursor-pointer"
          >
            जाएँ
          </button>
        </form>

        <button
          onClick={() => {
            if (activeStotraScope && stotraRange && currentPageIndex >= stotraRange.endPage - 1) {
              if (stotraRange.nextStotra) {
                setActiveStotraScope(stotraRange.nextStotra);
                setCurrentPageIndex(stotraRange.nextStotra.pdfPage - 1);
              }
              return;
            }
            if (activeChapterScope && currentPageIndex >= activeChapterScope.endPage - 1) {
              const nextChap = GITA_SECTIONS.find(s => s.id === activeChapterScope.id + 1);
              if (nextChap) {
                setActiveChapterScope(nextChap);
                setCurrentPageIndex(nextChap.startPage - 1);
              }
              return;
            }
            setCurrentPageIndex(prev => Math.min(pages.length - 1, prev + 1));
          }}
          disabled={
            activeStotraScope
              ? (!stotraRange?.nextStotra && currentPageIndex >= pages.length - 1)
              : activeChapterScope
              ? (activeChapterScope.id === GITA_SECTIONS.length && currentPageIndex >= pages.length - 1)
              : currentPageIndex === pages.length - 1
          }
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed font-medium text-xs text-white transition-all active:scale-95 cursor-pointer"
        >
          <span className="font-devanagari font-semibold hidden sm:inline">
            {activeStotraScope && stotraRange && currentPageIndex >= stotraRange.endPage - 1
              ? 'अग्रिम स्तोत्र'
              : activeChapterScope && currentPageIndex >= activeChapterScope.endPage - 1
              ? 'अग्रिम अध्याय'
              : 'अग्रिम पृष्ठ'}
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>

      {/* Table of Contents Drawers: Gita vs Vishnu Sahasranama vs Ganesh Pujan vs Universal */}
      {isGitaBook ? (
        <GitaTableOfContents
          isOpen={isTocOpen}
          onClose={() => setIsTocOpen(false)}
          currentPageNumber={currentPageIndex + 1}
          activeChapterId={activeChapterScope ? activeChapterScope.id : null}
          onSelectChapter={(chap, focusMode) => {
            if (focusMode) {
              setActiveChapterScope(chap);
            } else {
              setActiveChapterScope(null);
            }
            setCurrentPageIndex(chap.startPage - 1);
          }}
          onJumpToPage={(pageNum) => {
            setCurrentPageIndex(pageNum - 1);
          }}
          onResetToFullBook={() => {
            setActiveChapterScope(null);
          }}
        />
      ) : isVsnBook ? (
        <VsnTableOfContents
          isOpen={isTocOpen}
          onClose={() => setIsTocOpen(false)}
          currentPageNumber={currentPageIndex + 1}
          onJumpToPage={(pageNum) => {
            setCurrentPageIndex(pageNum - 1);
          }}
        />
      ) : isGaneshPujanBook ? (
        <GaneshPujanTableOfContents
          isOpen={isTocOpen}
          onClose={() => setIsTocOpen(false)}
          currentPageNumber={currentPageIndex + 1}
          onJumpToPage={(pageNum) => {
            setCurrentPageIndex(pageNum - 1);
          }}
        />
      ) : isBrihatStotraBook ? (
        <BrihatStotraTableOfContents
          isOpen={isTocOpen}
          onClose={() => setIsTocOpen(false)}
          currentPageNumber={currentPageIndex + 1}
          onJumpToPage={(pageNum) => {
            setActiveStotraScope(null);
            setCurrentPageIndex(pageNum - 1);
          }}
          onSelectStotra={(stotra) => {
            setActiveStotraScope(stotra);
            setCurrentPageIndex(stotra.pdfPage - 1);
          }}
        />
      ) : (
        <UniversalTableOfContents
          isOpen={isTocOpen}
          onClose={() => setIsTocOpen(false)}
          book={book}
          pages={pages}
          currentPageNumber={currentPageIndex + 1}
          onJumpToPage={(pageNum) => {
            setCurrentPageIndex(pageNum - 1);
          }}
        />
      )}
    </div>
  );
};
