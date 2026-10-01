import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar.js';
import { api } from './api.js';
import type { Book, BookStats } from '../shared/types.js';
import { findStotraById, type ScriptureItem } from './data/darshanTaxonomy.js';

// Dynamic code-splitting for heavy views & modals
const LibraryView = lazy(() => import('./components/LibraryView.js').then(m => ({ default: m.LibraryView })));
const VerificationWorkspace = lazy(() => import('./components/VerificationWorkspace.js').then(m => ({ default: m.VerificationWorkspace })));
const ReadingMode = lazy(() => import('./components/ReadingMode.js').then(m => ({ default: m.ReadingMode })));
const SearchView = lazy(() => import('./components/SearchView.js').then(m => ({ default: m.SearchView })));
const UploadModal = lazy(() => import('./components/UploadModal.js').then(m => ({ default: m.UploadModal })));
const AuditLogModal = lazy(() => import('./components/AuditLogModal.js').then(m => ({ default: m.AuditLogModal })));

const ViewLoadingFallback = () => (
  <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center p-8 text-neutral-400">
    <div className="w-12 h-12 rounded-full border-2 border-sacred-500/20 border-t-sacred-500 animate-spin flex items-center justify-center mb-4">
      <span className="text-sacred-500 text-sm font-serif select-none">ॐ</span>
    </div>
    <div className="text-xs tracking-widest font-serif text-sacred-400/80 uppercase animate-pulse">
      शास्त्रपाठ संयोजनम्...
    </div>
  </div>
);

export function App() {
  // Initialize from URL params or default to Brihat Stotra Ratnakar
  const getInitialState = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const book = params.get('book') || params.get('bookId');
      const view = params.get('view') as 'library' | 'workspace' | 'reader' | 'search' | null;
      if (book) {
        return {
          bookId: book,
          view: (view && ['library', 'workspace', 'reader', 'search'].includes(view)) ? view : 'reader'
        };
      }
      if (view === 'library') {
        return { bookId: null, view: 'library' as const };
      }
      if (view && ['workspace', 'reader', 'search'].includes(view)) {
        return { bookId: 'granth-brihat-stotra-ratnakar', view };
      }
    }
    // Default directly to Brihat Stotra Ratnakar
    return {
      bookId: 'granth-brihat-stotra-ratnakar',
      view: 'reader' as const
    };
  };

  const initial = getInitialState();
  const [currentView, setCurrentView] = useState<'library' | 'workspace' | 'reader' | 'search'>(initial.view);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(initial.bookId);
  const [selectedCustomStotra, setSelectedCustomStotra] = useState<ScriptureItem | null>(() => {
    if (initial.bookId && (initial.bookId.startsWith('supp-') || initial.bookId.startsWith('custom-'))) {
      return findStotraById(initial.bookId) || null;
    }
    return null;
  });
  const [initialPage, setInitialPage] = useState<number | undefined>(undefined);
  const [initialStotraId, setInitialStotraId] = useState<number | string | undefined>(undefined);
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<BookStats | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light' | 'sepia'>('dark');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Synchronize state with URL search params for deep linking and seamless navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (selectedBookId && currentView !== 'library') {
        url.searchParams.set('book', selectedBookId);
        url.searchParams.set('view', currentView);
      } else {
        url.searchParams.delete('book');
        if (currentView === 'library') {
          url.searchParams.set('view', 'library');
        } else {
          url.searchParams.set('view', currentView);
        }
      }
      window.history.replaceState({}, '', url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : ''));
    }
  }, [selectedBookId, currentView]);

  // Sync theme to root DOM
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-sepia');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'sepia') {
      root.classList.add('theme-sepia');
    }
  }, [theme]);

  // Load books and stats
  const refreshData = async () => {
    try {
      const [fetchedBooks, fetchedStats] = await Promise.all([
        api.getBooks(),
        api.getStats(),
      ]);
      setBooks(fetchedBooks);
      setStats(fetchedStats);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenWorkspace = (bookId: string) => {
    setSelectedCustomStotra(null);
    setSelectedBookId(bookId);
    setCurrentView('workspace');
  };

  const handleOpenReading = (bookId: string, page?: number, stotraId?: number | string) => {
    setSelectedCustomStotra(null);
    setSelectedBookId(bookId);
    setInitialPage(page);
    setInitialStotraId(stotraId);
    setCurrentView('reader');
  };

  const handleOpenCustomStotra = (customItem: ScriptureItem) => {
    setSelectedCustomStotra(customItem);
    setSelectedBookId(String(customItem.id));
    setInitialPage(1);
    setInitialStotraId(undefined);
    setCurrentView('reader');
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      await api.deleteBook(bookId);
      showNotification('ग्रन्थ सफलतापूर्वक हटा दिया गया।', 'success');
      refreshData();
    } catch (err: any) {
      showNotification(`हटाने में विफल: ${err.message}`, 'error');
    }
  };

  const handleExport = async (bookId: string, format: 'txt' | 'docx' | 'pdf') => {
    try {
      showNotification(`निर्यात तैयार किया जा रहा है (${format.toUpperCase()})...`, 'info');
      const downloadUrl = await api.exportBook(bookId, format);
      // Trigger browser download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showNotification(`निर्यात फ़ाइल डाउनलोड हो गई।`, 'success');
      refreshData();
    } catch (err: any) {
      showNotification(`निर्यात विफल: ${err.message}`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-sacred-600 selection:text-white">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-5 duration-200">
          <div className={`px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium border flex items-center space-x-2 ${
            notification.type === 'success'
              ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
              : notification.type === 'error'
              ? 'bg-red-950 text-red-300 border-red-700'
              : 'bg-neutral-900 text-sacred-300 border-sacred-800'
          }`}>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Primary Navigation Navbar */}
      {currentView !== 'reader' && (
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          stats={stats}
          theme={theme}
          setTheme={setTheme}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenAudit={() => setIsAuditOpen(true)}
        />
      )}

      {/* View Switcher */}
      <main className="flex-1 flex flex-col">
        <Suspense fallback={<ViewLoadingFallback />}>
          {currentView === 'library' && (
            <LibraryView
              books={books}
              stats={stats}
              onSelectBookForVerification={handleOpenWorkspace}
              onSelectBookForReading={handleOpenReading}
              onSelectCustomStotra={handleOpenCustomStotra}
              onDeleteBook={handleDeleteBook}
              onOpenUpload={() => setIsUploadOpen(true)}
              onExport={handleExport}
            />
          )}

          {currentView === 'workspace' && selectedBookId && (
            <VerificationWorkspace
              bookId={selectedBookId}
              onBack={() => {
                setCurrentView('library');
                refreshData();
              }}
              onReadBook={handleOpenReading}
            />
          )}

          {currentView === 'reader' && selectedBookId && (
            <ReadingMode
              bookId={selectedBookId}
              initialPage={initialPage}
              initialStotraId={initialStotraId}
              customStotra={selectedCustomStotra}
              onBack={() => {
                setSelectedCustomStotra(null);
                setCurrentView('library');
                refreshData();
              }}
              onOpenVerification={handleOpenWorkspace}
            />
          )}

          {currentView === 'search' && (
            <SearchView
              onSelectResult={bookId => {
                setSelectedBookId(bookId);
                setCurrentView('workspace');
              }}
            />
          )}
        </Suspense>
      </main>

      {/* Modals */}
      <Suspense fallback={null}>
        {isUploadOpen && (
          <UploadModal
            isOpen={isUploadOpen}
            onClose={() => setIsUploadOpen(false)}
            onUploadSuccess={newBookId => {
              showNotification('ग्रन्थ सफलतापूर्वक अपलोड हुआ एवं पृष्ठ तैयार किए गए।', 'success');
              refreshData();
              handleOpenWorkspace(newBookId);
            }}
            uploadFn={api.uploadBook}
          />
        )}

        {isAuditOpen && (
          <AuditLogModal
            isOpen={isAuditOpen}
            onClose={() => setIsAuditOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
}
export default App;
