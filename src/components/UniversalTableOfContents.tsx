import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  BookOpen,
  ArrowRight,
  ListOrdered,
  FileText
} from 'lucide-react';
import type { Book, Page } from '../../shared/types.js';

interface UniversalTableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  pages: Page[];
  currentPageNumber: number;
  onJumpToPage: (pageNumber: number) => void;
}

interface ParsedTocItem {
  id: string;
  index: number;
  title: string;
  targetPage: number;
}

export const UniversalTableOfContents: React.FC<UniversalTableOfContentsProps> = ({
  isOpen,
  onClose,
  book,
  pages,
  currentPageNumber,
  onJumpToPage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewTab, setViewTab] = useState<'index' | 'pages'>('index');

  // Extract page summaries / titles
  const pageEntries = useMemo(() => {
    return pages.map(p => {
      const text = p.verified_text || p.ocr_text || '';
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      // Look for heading line with brackets or danda
      let title = `पत्र संख्या ${p.page_number}`;
      for (const line of lines.slice(0, 5)) {
        if (line.startsWith('॥') && line.endsWith('॥') && line.length > 4) {
          title = line.replace(/^[॥\s]+|[॥\s]+$/g, '').trim();
          break;
        } else if (line.startsWith('【') && line.includes('】')) {
          title = line.replace(/^[【\s]+|[】\s]+$/g, '').trim();
          break;
        } else if (line.startsWith('•') || line.startsWith('▪')) {
          title = line.replace(/^[•▪\s]+/, '').trim();
          break;
        }
      }
      return {
        pageNumber: p.page_number,
        title,
        preview: lines.slice(0, 3).join(' ')
      };
    });
  }, [pages]);

  // Parse any printed table of contents on Page 1 or 2
  const parsedTocItems = useMemo<ParsedTocItem[]>(() => {
    const items: ParsedTocItem[] = [];
    const firstPagesText = pages.slice(0, 2).map(p => p.verified_text || p.ocr_text || '').join('\n');
    const lines = firstPagesText.split('\n').map(l => l.trim()).filter(Boolean);

    // Regex patterns for Indian scriptures TOC:
    // e.g.: "1. गृहप्रवेश मुहूर्त विचारणीय — 02" or "१. कलश पूजनम् (पृष्ठ ७)" or "३. षोडश मातृका पूजनम् — ९"
    const tocLineRegex = /^([०-९\d]+)[\.\s\-]+(.+?)(?:[\s—–\-]+(?:पृष्ठ\s*)?([०-९\d]+)|\((?:पृष्ठ\s*)?([०-९\d]+)\))$/;

    // Convert devanagari numerals to arabic
    const devToNum = (s: string) => {
      return parseInt(
        s.replace(/[०-९]/g, d => String('०१२३४५६७८९'.indexOf(d))),
        10
      );
    };

    let idx = 1;
    for (const line of lines) {
      const match = line.match(tocLineRegex);
      if (match) {
        const itemNum = devToNum(match[1]) || idx;
        const itemTitle = match[2].trim();
        const rawPage = match[3] || match[4];
        const pageNum = rawPage ? devToNum(rawPage) : itemNum;

        items.push({
          id: `toc-${idx}`,
          index: itemNum,
          title: itemTitle,
          targetPage: Math.min(Math.max(1, pageNum), pages.length)
        });
        idx++;
      }
    }
    return items;
  }, [pages]);

  if (!isOpen) return null;

  const hasPrintedToc = parsedTocItems.length > 0;
  const activeTabEffective = hasPrintedToc ? viewTab : 'pages';

  const filteredItems = parsedTocItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(item.index).includes(searchQuery) ||
    String(item.targetPage).includes(searchQuery)
  );

  const filteredPages = pageEntries.filter(entry =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(entry.pageNumber).includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-lg sm:max-w-xl h-full bg-[#181310] text-amber-100 border-l border-amber-900/60 shadow-2xl flex flex-col overflow-hidden animate-slideLeft">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-900/40 bg-gradient-to-b from-[#2D170D] to-[#181310] flex items-center justify-between shrink-0">
          <div className="space-y-0.5 max-w-[80%]">
            <div className="flex items-center space-x-2">
              <span className="text-xl text-amber-400">📖</span>
              <h2 className="text-base sm:text-lg font-bold font-serifDevanagari text-amber-200 truncate">
                {book.title}
              </h2>
            </div>
            <p className="text-xs text-amber-400/80 font-devanagari truncate">
              {book.author ? `रचयिता: ${book.author}` : 'पावन शास्त्र विषय-सूची एवं पत्र क्रम'}
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

        {/* Tab & Search */}
        <div className="p-3 bg-black/40 border-b border-amber-900/30 space-y-2.5 shrink-0">
          {hasPrintedToc && (
            <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/10 w-full">
              <button
                onClick={() => setViewTab('index')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-devanagari font-bold transition-all flex items-center justify-center space-x-1.5 ${
                  viewTab === 'index'
                    ? 'bg-gradient-to-r from-sacred-700 to-amber-700 text-white shadow'
                    : 'text-amber-200/70 hover:text-amber-100'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>विषय-सूची ({parsedTocItems.length})</span>
              </button>
              <button
                onClick={() => setViewTab('pages')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-devanagari font-bold transition-all flex items-center justify-center space-x-1.5 ${
                  viewTab === 'pages'
                    ? 'bg-gradient-to-r from-sacred-700 to-amber-700 text-white shadow'
                    : 'text-amber-200/70 hover:text-amber-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>समस्त पत्र ({pages.length})</span>
              </button>
            </div>
          )}

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="विषय, शीर्षक या पत्र संख्या खोजें..."
              className="w-full bg-black/50 border border-amber-900/40 rounded-xl pl-9 pr-3 py-1.5 text-xs text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-500 font-devanagari"
            />
          </div>
        </div>

        {/* Status */}
        <div className="px-4 py-2 bg-black/60 border-b border-amber-900/20 flex items-center justify-between text-xs font-devanagari shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-neutral-400">वर्तमान स्थिति:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-sacred-950/90 border border-amber-500/50 text-amber-300 font-semibold font-mono">
              पत्रम् {currentPageNumber} / {pages.length}
            </span>
          </div>
          <span className="text-neutral-400 text-[11px]">
            {activeTabEffective === 'index' ? `${filteredItems.length} विषय` : `${filteredPages.length} पत्र`}
          </span>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 custom-scrollbar">
          {activeTabEffective === 'index' ? (
            filteredItems.length > 0 ? (
              filteredItems.map(item => {
                const isCurrent = currentPageNumber === item.targetPage;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onJumpToPage(item.targetPage);
                      onClose();
                    }}
                    className={`group cursor-pointer rounded-xl p-3 border transition-all flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-gradient-to-r from-sacred-950/90 to-amber-950/70 border-amber-500/70 shadow-md'
                        : 'bg-black/25 hover:bg-black/45 border-amber-900/25 hover:border-amber-700/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                        isCurrent
                          ? 'bg-amber-500 text-black shadow'
                          : 'bg-white/5 border border-white/10 text-amber-300 group-hover:bg-white/10'
                      }`}>
                        {item.index}
                      </span>
                      <span className="text-xs sm:text-sm font-devanagari text-neutral-200 group-hover:text-amber-100 font-medium truncate">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-md bg-amber-900/40 border border-amber-700/30 text-amber-300 text-[11px] font-mono font-semibold">
                        पत्र {item.targetPage}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-500/40 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-neutral-400 font-devanagari space-y-2">
                <BookOpen className="w-8 h-8 mx-auto text-amber-500/30" />
                <p>कोई विषय नहीं मिला।</p>
              </div>
            )
          ) : (
            filteredPages.map(page => {
              const isCurrent = currentPageNumber === page.pageNumber;
              return (
                <div
                  key={page.pageNumber}
                  onClick={() => {
                    onJumpToPage(page.pageNumber);
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
                      {page.pageNumber}
                    </span>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs sm:text-sm font-devanagari text-neutral-200 group-hover:text-amber-100 font-medium truncate">
                        {page.title}
                      </p>
                      {page.preview && (
                        <p className="text-[11px] text-neutral-400 font-devanagari truncate">
                          {page.preview}
                        </p>
                      )}
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
