import React, { useState, useEffect, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  Save,
  Clock,
  Check,
  X,
  History,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileCode,
  Loader2,
  Info,
  BookOpen,
  ExternalLink,
  Scroll,
} from 'lucide-react';
import { api } from '../api.js';
import type { Book, Page, ScripturalIssue, PageRevision, CanonicalScripture } from '../../shared/types.js';

const VEDIC_SYMBOLS = [
  { char: 'ॐ', name: 'प्रणव (Om)', desc: 'Sacred syllable Om' },
  { char: '॑', name: 'उदात्त (Udātta)', desc: 'High pitch accent (U+0951)' },
  { char: '॒', name: 'अनुदात्त (Anudātta)', desc: 'Low pitch horizontal line (U+0952)' },
  { char: '᳚', name: 'स्वरित (Svarita)', desc: 'Circumflex double vertical (U+1CDA)' },
  { char: 'ꣳ', name: 'गुं-कार (Gum-kara)', desc: 'Anunasika gum syllable (U+A8E3)' },
  { char: 'ऽ', name: 'अवग्रह (Avagraha)', desc: 'Elision of short vowel a' },
  { char: '।', name: 'पूर्ण विराम (Danda)', desc: 'Single verse bar' },
  { char: '॥', name: 'दीर्घ विराम (Double Danda)', desc: 'Double verse bar' },
  { char: 'ँ', name: 'चन्द्रबिन्दु (Candrabindu)', desc: 'Nasalization mark' },
  { char: 'ं', name: 'अनुस्वार (Anusvara)', desc: 'Pure nasal dot' },
  { char: 'ः', name: 'विसर्ग (Visarga)', desc: 'Aspirated breathing' },
  { char: '्', name: 'हलन्त (Virama)', desc: 'Vowel suppressor' },
];

interface VerificationWorkspaceProps {
  bookId: string;
  onBack: () => void;
  onReadBook: (bookId: string) => void;
}

export const VerificationWorkspace: React.FC<VerificationWorkspaceProps> = ({
  bookId,
  onBack,
  onReadBook,
}) => {
  const [book, setBook] = useState<Book | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [pageData, setPageData] = useState<Page | null>(null);
  const [issues, setIssues] = useState<ScripturalIssue[]>([]);
  const [revisions, setRevisions] = useState<PageRevision[]>([]);

  // Canonical Reference State
  const [canonicalList, setCanonicalList] = useState<CanonicalScripture[]>([]);
  const [selectedCanonical, setSelectedCanonical] = useState<CanonicalScripture | null>(null);
  const [matchedCanonical, setMatchedCanonical] = useState<CanonicalScripture | null>(null);

  // Text editor state
  const [editedText, setEditedText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'editor' | 'issues' | 'revisions' | 'canonical'>('editor');
  const [selectedIssueIndex, setSelectedIssueIndex] = useState<number>(-1);
  const [editorTheme, setEditorTheme] = useState<'dark' | 'bhojpatra'>('bhojpatra');
  const [editorFont, setEditorFont] = useState<'tiro' | 'yatra' | 'notoSerif' | 'devanagari'>('tiro');

  // Image viewer state
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [usePreprocessedImage, setUsePreprocessedImage] = useState<boolean>(false);

  // Process loading states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOcrRunning, setIsOcrRunning] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Load Book and Pages & Canonical References
  useEffect(() => {
    async function loadBookData() {
      try {
        setIsLoading(true);
        const [bookData, canonicalData] = await Promise.all([
          api.getBook(bookId),
          api.getCanonicalReferences().catch(() => []),
        ]);
        setBook(bookData.book);
        setPages(bookData.pages);
        if (Array.isArray(canonicalData)) {
          setCanonicalList(canonicalData as any);
          if (canonicalData.length > 0) {
            api.getCanonicalReference(canonicalData[0].id).then(setSelectedCanonical).catch(() => {});
          }
        }
        if (bookData.pages.length > 0) {
          setCurrentPageIndex(0);
          await loadSinglePage(bookData.pages[0].id);
        }
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    }
    loadBookData();
  }, [bookId]);

  // Load Single Page Details
  async function loadSinglePage(pageId: string) {
    try {
      const data = await api.getPage(pageId);
      setPageData(data.page);
      setIssues(data.issues);
      setRevisions(data.revisions);
      const initialText = data.page.verified_text || data.page.ocr_text || '';
      setEditedText(initialText);

      // Attempt matching canonical scripture from SanskritDocuments
      if (initialText.trim().length > 15) {
        api.matchCanonicalReference(initialText).then(m => {
          if (m.matched && m.scripture) {
            setMatchedCanonical(m.scripture);
            setSelectedCanonical(m.scripture);
          }
        }).catch(() => {});
      }

      // Reset image pan & zoom on page change
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setSelectedIssueIndex(-1);

      // Transition to IN_REVIEW if page was OCR_COMPLETE or REVIEW_REQUIRED
      if (data.page.status === 'OCR_COMPLETE' || data.page.status === 'REVIEW_REQUIRED') {
        const reviewRes = await api.startPageReview(pageId).catch(() => null);
        if (reviewRes?.page) {
          setPageData(reviewRes.page);
        }
      }
    } catch (err) {
      console.error('Failed to load page:', err);
    }
  }

  // Handle page navigation
  const goToPage = async (index: number) => {
    if (index >= 0 && index < pages.length) {
      setCurrentPageIndex(index);
      await loadSinglePage(pages[index].id);
    }
  };

  // Run OCR on current page
  const handleRunOCR = async () => {
    if (!pageData) return;
    try {
      setIsOcrRunning(true);
      const res = await api.runPageOCR(pageData.id);
      setPageData(res.page);
      setIssues(res.issues);
      const ocrText = res.page.verified_text || res.page.ocr_text || '';
      setEditedText(ocrText);

      // Attempt matching canonical scripture
      if (ocrText.trim().length > 15) {
        api.matchCanonicalReference(ocrText).then(m => {
          if (m.matched && m.scripture) {
            setMatchedCanonical(m.scripture);
            setSelectedCanonical(m.scripture);
          }
        }).catch(() => {});
      }

      setIsOcrRunning(false);

      // Refresh book data for progress counters
      const updatedBook = await api.getBook(bookId);
      setBook(updatedBook.book);
      setPages(updatedBook.pages);
    } catch (err: any) {
      alert(`OCR त्रुटि: ${err.message}`);
      setIsOcrRunning(false);
    }
  };

  // Insert Vedic Svara or sacred symbol at cursor position
  const insertSymbol = (symbol: string) => {
    if (!textAreaRef.current) return;
    const start = textAreaRef.current.selectionStart;
    const end = textAreaRef.current.selectionEnd;
    const text = editedText;
    const newText = text.substring(0, start) + symbol + text.substring(end);
    setEditedText(newText);
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        const pos = start + symbol.length;
        textAreaRef.current.setSelectionRange(pos, pos);
      }
    }, 0);
  };

  // Copy canonical verse to editor at cursor position
  const copyVerseToEditor = (verseText: string) => {
    if (!textAreaRef.current) {
      setEditedText(prev => (prev ? `${prev}\n\n${verseText}` : verseText));
      setActiveTab('editor');
      return;
    }
    const start = textAreaRef.current.selectionStart;
    const end = textAreaRef.current.selectionEnd;
    const text = editedText;
    const newText = text.substring(0, start) + verseText + text.substring(end);
    setEditedText(newText);
    setActiveTab('editor');
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        const pos = start + verseText.length;
        textAreaRef.current.setSelectionRange(pos, pos);
      }
    }, 0);
  };

  // Save current verification or edits
  const handleSave = async (markFullyVerified: boolean = false) => {
    if (!pageData) return;

    // UI-side critical issue pre-check
    const hasCriticalIssues = issues.some(i => i.severity === 'CRITICAL');
    if (markFullyVerified && hasCriticalIssues) {
      alert('⚠️ प्रमाणीकरण वर्जित: इस पृष्ठ पर गंभीर विसंगतियाँ (CRITICAL ISSUES) उपस्थित हैं। कृपया पहले सभी गंभीर त्रुटियों का निवारण करें।');
      setActiveTab('issues');
      return;
    }

    try {
      setIsSaving(true);
      const res = await api.verifyPage(pageData.id, {
        verifiedText: editedText,
        reason: markFullyVerified ? 'मानव द्वारा मूल स्रोत से मिलान उपरान्त प्रमाणित' : 'हस्तलिखित संशोधन',
        markFullyVerified,
      });

      setPageData(res.page);
      setIssues(res.issues);
      setRevisions(res.revisions);
      setIsSaving(false);
      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 2500);

      // Update pages array
      setPages(prev => prev.map(p => p.id === res.page.id ? res.page : p));
      const updatedBook = await api.getBook(bookId);
      setBook(updatedBook.book);
    } catch (err: any) {
      alert(`प्रमाणीकरण विफल: ${err.message}`);
      setIsSaving(false);
    }
  };

  // Keyboard shortcuts (Ctrl+S, Alt+N, Alt+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave(false);
      }
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        if (issues.length > 0) {
          const next = (selectedIssueIndex + 1) % issues.length;
          setSelectedIssueIndex(next);
          highlightIssue(issues[next]);
        }
      }
      if (e.altKey && e.key === 'p') {
        e.preventDefault();
        if (issues.length > 0) {
          const prev = selectedIssueIndex <= 0 ? issues.length - 1 : selectedIssueIndex - 1;
          setSelectedIssueIndex(prev);
          highlightIssue(issues[prev]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editedText, pageData, issues, selectedIssueIndex]);

  // Image Pan & Drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Highlight issue in textarea
  const highlightIssue = (issue: ScripturalIssue) => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(
        issue.character_offset,
        issue.character_offset + issue.length
      );
    }
  };

  // Accept an issue suggestion
  const handleAcceptSuggestion = async (issue: ScripturalIssue) => {
    const before = editedText.substring(0, issue.character_offset);
    const after = editedText.substring(issue.character_offset + issue.length);
    const newText = before + issue.suggested_text + after;
    setEditedText(newText);
    await api.resolveIssue(issue.id, 'ACCEPTED');
    setIssues(prev => prev.filter(i => i.id !== issue.id));
  };

  // Dismiss an issue
  const handleDismissIssue = async (issueId: string) => {
    await api.resolveIssue(issueId, 'REJECTED');
    setIssues(prev => prev.filter(i => i.id !== issueId));
  };

  // Rollback to a specific revision
  const handleRollback = (rev: PageRevision) => {
    if (confirm(`क्या आप संशोधन "${rev.reason}" को पुनर्स्थापित करना चाहते हैं?`)) {
      setEditedText(rev.updated_text);
    }
  };

  if (isLoading || !book || !pageData) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-sacred-500 animate-spin" />
        <p className="text-sm text-neutral-400 font-devanagari">
          कार्यपीठ लोड हो रही है... (Loading Verification Workspace)
        </p>
      </div>
    );
  }

  const getEditorFontStyle = (): React.CSSProperties => {
    switch (editorFont) {
      case 'tiro':
        return { fontFamily: '"Tiro Devanagari Sanskrit", "Noto Serif Devanagari", serif' };
      case 'yatra':
        return { fontFamily: '"Yatra One", "Noto Serif Devanagari", cursive, serif' };
      case 'notoSerif':
        return { fontFamily: '"Noto Serif Devanagari", serif' };
      case 'devanagari':
      default:
        return { fontFamily: '"Noto Sans Devanagari", "Yantramanav", sans-serif' };
    }
  };

  const currentImageSrc = usePreprocessedImage && pageData.preprocessed_image_path
    ? pageData.preprocessed_image_path
    : pageData.original_image_path;

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] overflow-hidden bg-neutral-950 text-neutral-100">
      {/* Top Workspace Header Bar */}
      <div className="h-14 px-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between shrink-0">
        {/* Left: Back & Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">ग्रंथालय</span>
          </button>

          <div>
            <h2 className="font-bold text-sm text-neutral-100 font-devanagari flex items-center space-x-2">
              <span className="truncate max-w-xs">{book.title}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sacred-950 text-sacred-400 border border-sacred-800">
                पृष्ठ {pageData.page_number} / {pages.length}
              </span>
            </h2>
          </div>
        </div>

        {/* Center: Page Navigator */}
        <div className="flex items-center space-x-2 bg-neutral-950 px-3 py-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => goToPage(currentPageIndex - 1)}
            disabled={currentPageIndex === 0}
            className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            title="पिछला पृष्ठ"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-medium text-neutral-300">
            {currentPageIndex + 1} / {pages.length}
          </span>
          <button
            onClick={() => goToPage(currentPageIndex + 1)}
            disabled={currentPageIndex === pages.length - 1}
            className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            title="अगला पृष्ठ"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Actions (OCR, Save, Verify) */}
        <div className="flex items-center space-x-2">
          {saveSuccessNotice && (
            <span className="text-xs text-emerald-400 flex items-center space-x-1 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>सहेजा गया</span>
            </span>
          )}

          <button
            onClick={handleRunOCR}
            disabled={isOcrRunning}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sacred-400 hover:text-sacred-300 text-xs font-medium border border-neutral-700 disabled:opacity-50 transition-all font-devanagari"
            title="पृष्ठ पर OCR चलाएं"
          >
            {isOcrRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>पहचान जारी...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>OCR चलाएं</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-all"
            title="संशोधन सहेजें (Ctrl+S)"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">सहेजें</span>
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition-all hover:scale-105 active:scale-95 font-devanagari"
            title="पृष्ठ को पूर्ण रूप से प्रमाणित (Verified) घोषित करें"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>प्रमाणित करें (Verify)</span>
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace (Section 13) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT PANE: ORIGINAL SOURCE IMAGE VIEWER */}
        <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-neutral-800 bg-neutral-950/60 relative overflow-hidden">
          {/* Image Toolbar */}
          <div className="h-10 px-4 bg-neutral-900/80 border-b border-neutral-800/80 flex items-center justify-between z-10 text-xs text-neutral-400">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-neutral-300 font-devanagari">
                मूल स्रोत (Authority Source Scan)
              </span>
              <button
                onClick={() => setUsePreprocessedImage(!usePreprocessedImage)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                  usePreprocessedImage
                    ? 'bg-sacred-950 text-sacred-400 border-sacred-800'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
                }`}
                title="पूर्वनिर्मित/कंट्रास्ट-वर्धित छवि देखें"
              >
                {usePreprocessedImage ? '✓ वर्धित छवि (Enhanced)' : 'मूल छवि (Raw Scan)'}
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setZoom(prev => Math.max(0.4, prev - 0.2))}
                className="p-1.5 rounded hover:bg-neutral-800 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(prev => Math.min(4, prev + 0.2))}
                className="p-1.5 rounded hover:bg-neutral-800 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setRotation(prev => (prev + 90) % 360)}
                className="p-1.5 rounded hover:bg-neutral-800 hover:text-white transition-colors ml-1"
                title="Rotate 90°"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                  setRotation(0);
                }}
                className="p-1.5 rounded hover:bg-neutral-800 hover:text-white transition-colors"
                title="Reset View"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Pan & Zoom Canvas Area */}
          <div
            ref={imageContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex-1 flex items-center justify-center p-4 overflow-hidden select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {currentImageSrc ? (
              <img
                src={currentImageSrc}
                alt={`Page ${pageData.page_number} Scan`}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                  maxWidth: '90%',
                  maxHeight: '90%',
                  objectFit: 'contain',
                }}
                className="rounded shadow-2xl pointer-events-none"
                draggable={false}
              />
            ) : (
              <div className="text-center p-8 text-neutral-500">
                <FileCode className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-devanagari">पृष्ठ छवि लोड नहीं हुई</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: EXTRACTED TEXT EDITOR & SCRIPTURAL VERIFICATION */}
        <div className="flex-1 flex flex-col bg-neutral-900/50">
          {/* Editor Tabs & Status Bar */}
          <div className="h-10 px-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between shrink-0 text-xs">
            {/* Tabs */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  activeTab === 'editor'
                    ? 'bg-sacred-600 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                सम्पादक (Scripture Editor)
              </button>

              <button
                onClick={() => setActiveTab('issues')}
                className={`px-3 py-1 rounded-lg font-medium flex items-center space-x-1.5 transition-colors ${
                  activeTab === 'issues'
                    ? 'bg-sacred-600 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>समीक्षा बिंदु ({issues.length})</span>
                {issues.some(i => i.severity === 'CRITICAL') && (
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('revisions')}
                className={`px-3 py-1 rounded-lg font-medium flex items-center space-x-1.5 transition-colors ${
                  activeTab === 'revisions'
                    ? 'bg-sacred-600 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>संशोधन इतिहास ({revisions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('canonical')}
                className={`px-3 py-1 rounded-lg font-medium flex items-center space-x-1.5 transition-colors ${
                  activeTab === 'canonical'
                    ? 'bg-sacred-600 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>SanskritDocuments संदर्भ</span>
                {matchedCanonical && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="प्रामाणिक संदर्भ मिला" />
                )}
              </button>
            </div>

            {/* Confidence & Page Status Badge */}
            <div className="flex items-center space-x-2">
              {pageData.status === 'VERIFIED' ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-medium text-[11px] flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>🔵 VERIFIED</span>
                </span>
              ) : pageData.ocr_confidence > 0 ? (
                <span className={`px-2 py-0.5 rounded-full font-medium text-[11px] border ${
                  pageData.ocr_confidence >= 85
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : pageData.ocr_confidence >= 65
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-red-950 text-red-300 border-red-800'
                }`}>
                  {pageData.ocr_confidence >= 85 ? '🟢' : '🟡'} OCR विश्वास: {pageData.ocr_confidence}%
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 text-[11px]">
                  ⚪ अपठित (Unprocessed)
                </span>
              )}
            </div>
          </div>

          {/* TAB 1: SCRIPTURE TEXT EDITOR */}
          {activeTab === 'editor' && (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      <div className={`flex-1 flex flex-col relative rounded-2xl p-4 transition-all ${
        editorTheme === 'bhojpatra'
          ? 'bg-bhojpatra border-2 border-[#8C2D19] shadow-xl text-[#2A170E]'
          : 'bg-neutral-950/80 border border-neutral-800 text-neutral-100'
      }`}>
        {/* Vedic Svara & Styling Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2.5 mb-2.5 border-b border-black/15 dark:border-neutral-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[11px] font-devanagari font-bold mr-1 flex items-center space-x-1 ${
              editorTheme === 'bhojpatra' ? 'text-[#8C2D19]' : 'text-sacred-400'
            }`}>
              <Sparkles className="w-3 h-3" />
              <span>वैदिक स्वर:</span>
            </span>
            {VEDIC_SYMBOLS.map(s => (
              <button
                key={s.char}
                type="button"
                onClick={() => insertSymbol(s.char)}
                title={`${s.name} - ${s.desc}`}
                className={`px-2 py-0.5 rounded-md text-xs font-serifDevanagari transition-all active:scale-95 border ${
                  editorTheme === 'bhojpatra'
                    ? 'bg-[#EADDC2] hover:bg-[#DFCFA8] text-[#3D2010] border-[#8C2D19]/40 font-bold'
                    : 'bg-neutral-900 hover:bg-sacred-950 hover:border-sacred-700 hover:text-sacred-300 text-neutral-200 border-neutral-800'
                }`}
              >
                {s.char}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {/* Font Selector */}
            <select
              value={editorFont}
              onChange={e => setEditorFont(e.target.value as any)}
              className={`rounded-lg px-2 py-1 text-xs font-devanagari border focus:outline-none ${
                editorTheme === 'bhojpatra'
                  ? 'bg-[#EEDCB9] border-[#8C2D19]/40 text-[#2A170E] font-bold'
                  : 'bg-neutral-900 border-neutral-700 text-amber-200'
              }`}
              title="लिपि फॉन्ट"
            >
              <option value="tiro">📜 Tiro Sanskrit</option>
              <option value="yatra">🪶 Yatra One</option>
              <option value="notoSerif">📖 Noto Serif</option>
              <option value="devanagari">🔤 Noto Sans</option>
            </select>

            {/* Bhojpatra vs Dark Toggle */}
            <button
              type="button"
              onClick={() => setEditorTheme(editorTheme === 'bhojpatra' ? 'dark' : 'bhojpatra')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-devanagari transition-all border font-bold ${
                editorTheme === 'bhojpatra'
                  ? 'bg-[#8C2D19] text-white border-[#8C2D19] shadow-sm'
                  : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
              }`}
              title="भोजपत्र / डार्क मोड बदलें"
            >
              <Scroll className="w-3 h-3" />
              <span>{editorTheme === 'bhojpatra' ? 'भोजपत्र' : 'डार्क'}</span>
            </button>
          </div>
        </div>

        <textarea
          ref={textAreaRef}
          value={editedText}
          onChange={e => setEditedText(e.target.value)}
          placeholder="यहाँ OCR द्वारा निकाला गया शास्त्र पाठ प्रदर्शित होगा। स्रोत स्कैन से मिलान कर सुधार करें..."
          style={getEditorFontStyle()}
          className={`flex-1 w-full bg-transparent resize-none focus:outline-none text-base sm:text-lg leading-relaxed tracking-wide ${
            editorTheme === 'bhojpatra'
              ? 'text-[#24130A] placeholder-amber-900/50 selection:bg-amber-400/40'
              : 'text-neutral-100 placeholder-neutral-600 selection:bg-sacred-600/40'
          }`}
          spellCheck={false}
        />

                {/* Editor Metrics Footer */}
                <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                  <div className="flex items-center space-x-4">
                    <span>वर्ण: {editedText.length}</span>
                    <span>शब्द: {editedText.trim() ? editedText.trim().split(/\s+/).length : 0}</span>
                    <span>पंक्तियाँ: {editedText.split('\n').length}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-neutral-400">
                    <span className="font-sans text-[11px]">शॉर्टकट: <kbd className="bg-neutral-800 px-1 py-0.5 rounded">Ctrl+S</kbd> सहेजें</span>
                  </div>
                </div>
              </div>

              {/* Quick Issue Bar if issues exist */}
              {issues.length > 0 && (
                <div className="mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-900/60 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      इस पृष्ठ पर <strong>{issues.length}</strong> संभावित OCR विसंगतियाँ पाई गईं।
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('issues')}
                    className="px-3 py-1 rounded bg-amber-900/60 hover:bg-amber-900 text-amber-200 font-medium transition-colors"
                  >
                    समीक्षा करें →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SCRIPTURAL ISSUE REVIEW LIST */}
          {activeTab === 'issues' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {issues.length === 0 ? (
                <div className="p-8 text-center text-neutral-400">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                  <p className="text-sm font-devanagari">कोई खुला समीक्षा बिंदु नहीं है। पाठ व्याकरणिक एवं ध्वन्यात्मक रूप से सुसंगत है।</p>
                </div>
              ) : (
                issues.map((issue, idx) => (
                  <div
                    key={issue.id}
                    className={`p-4 rounded-xl border transition-all ${
                      issue.severity === 'CRITICAL'
                        ? 'bg-red-950/20 border-red-900/60'
                        : issue.severity === 'WARNING'
                        ? 'bg-amber-950/20 border-amber-900/60'
                        : 'bg-neutral-950/60 border-neutral-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            issue.severity === 'CRITICAL'
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {issue.severity}
                          </span>
                          <span className="text-xs text-neutral-300 font-devanagari font-semibold">
                            {issue.reason}
                          </span>
                        </div>

                        {/* Character Replacement Preview */}
                        <div className="mt-2 flex items-center space-x-3 text-sm font-devanagari">
                          <span className="px-2 py-1 rounded bg-red-950/50 text-red-300 border border-red-800/80 font-mono">
                            {issue.original_text || '[अक्षर अनुपस्थित]'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                          <span className="px-2 py-1 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/80 font-mono font-bold">
                            {issue.suggested_text}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => highlightIssue(issue)}
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors"
                          title="सम्पादक में खोजें"
                        >
                          देखें
                        </button>
                        {issue.suggested_text && (
                          <button
                            onClick={() => handleAcceptSuggestion(issue)}
                            className="p-1.5 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 transition-colors"
                            title="सुझाव स्वीकार करें"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDismissIssue(issue.id)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-red-300 transition-colors"
                          title="अस्वीकार करें"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: REVISIONS TIMELINE (Section 24) */}
          {activeTab === 'revisions' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {revisions.length === 0 ? (
                <div className="p-8 text-center text-neutral-400">
                  <Clock className="w-8 h-8 mx-auto text-neutral-500 mb-2" />
                  <p className="text-sm font-devanagari">इस पृष्ठ पर अभी तक कोई संशोधन इतिहास दर्ज नहीं है।</p>
                </div>
              ) : (
                revisions.map(rev => (
                  <div key={rev.id} className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-neutral-200">{rev.author}</span>
                        <span>•</span>
                        <span>{new Date(rev.created_at).toLocaleString('hi-IN')}</span>
                      </div>
                      <button
                        onClick={() => handleRollback(rev)}
                        className="text-sacred-400 hover:text-sacred-300 font-medium"
                      >
                        पुनर्स्थापित करें (Rollback)
                      </button>
                    </div>

                    <p className="text-xs text-neutral-300 font-devanagari italic">
                      कारण: {rev.reason}
                    </p>

                    {/* Diff snippet */}
                    <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-devanagari max-h-32 overflow-y-auto">
                      <p className="text-emerald-400 font-medium">{rev.updated_text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: SANSKRITDOCUMENTS CANONICAL REFERENCE BANK */}
          {activeTab === 'canonical' && (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              {/* Scripture Selector & Meta Header */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 shrink-0 space-y-3 mb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-sacred-400" />
                    <div>
                      <h3 className="text-sm font-bold text-neutral-100 font-devanagari">
                        प्रामाणिक वैदिक संदर्भ (SanskritDocuments.org)
                      </h3>
                      <p className="text-[11px] text-neutral-400 font-devanagari">
                        स्वर एवं व्याकरण शुद्धता मिलान हेतु प्रामाणिक संदर्भ बैंक
                      </p>
                    </div>
                  </div>

                  {/* Canonical Scripture Dropdown */}
                  <select
                    value={selectedCanonical?.id || ''}
                    onChange={async (e) => {
                      const id = e.target.value;
                      if (!id) return;
                      const full = await api.getCanonicalReference(id).catch(() => null);
                      if (full) setSelectedCanonical(full);
                    }}
                    className="bg-neutral-900 text-neutral-200 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-devanagari focus:border-sacred-500 focus:outline-none"
                  >
                    {canonicalList.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.title_sa} ({c.title_iast})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCanonical && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800/80 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-sacred-950 text-sacred-300 border border-sacred-800 text-[11px] font-devanagari">
                        {selectedCanonical.category}
                      </span>
                      <span className="text-neutral-400 font-devanagari">
                        {selectedCanonical.rishi ? `ऋषि: ${selectedCanonical.rishi}` : ''} {selectedCanonical.chhandas ? `• छन्द: ${selectedCanonical.chhandas}` : ''}
                      </span>
                    </div>

                    {selectedCanonical.sanskrit_documents_url && (
                      <a
                        href={selectedCanonical.sanskrit_documents_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sacred-400 hover:text-sacred-300 text-[11px] font-medium"
                      >
                        <span>sanskritdocuments.org पर देखें</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Verses List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {selectedCanonical?.verses?.map((verse) => (
                  <div
                    key={verse.verse_number}
                    className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 transition-colors space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span className="px-2 py-0.5 rounded bg-neutral-900 font-mono text-[11px] text-sacred-400 border border-neutral-800">
                        श्लोक / मन्त्र #{verse.verse_number}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyVerseToEditor(verse.devanagari)}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium font-devanagari transition-colors"
                        title="इस मन्त्र को सम्पादक में डालें"
                      >
                        <Sparkles className="w-3 h-3 text-sacred-400" />
                        <span>सम्पादक में प्रतिलिपि करें</span>
                      </button>
                    </div>

                    {/* Devanagari text with Vedic Accents */}
                    <p className="text-base font-serifDevanagari text-neutral-100 leading-relaxed tracking-wide bg-neutral-900/60 p-3 rounded-lg border border-neutral-800/80 select-text">
                      {verse.devanagari}
                    </p>

                    {/* IAST Transliteration */}
                    {verse.iast && (
                      <p className="text-xs font-mono text-neutral-400 italic bg-neutral-900/30 px-3 py-1.5 rounded border border-neutral-800/40 select-text">
                        {verse.iast}
                      </p>
                    )}

                    {/* Meaning / Anvaya */}
                    {verse.meaning_hi && (
                      <p className="text-xs text-neutral-400 font-devanagari leading-relaxed">
                        <span className="text-sacred-400/80 font-semibold">भावार्थ: </span>
                        {verse.meaning_hi}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
