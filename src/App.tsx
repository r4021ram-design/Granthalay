import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { LibraryView } from './components/LibraryView.js';
import { VerificationWorkspace } from './components/VerificationWorkspace.js';
import { ReadingMode } from './components/ReadingMode.js';
import { SearchView } from './components/SearchView.js';
import { UploadModal } from './components/UploadModal.js';
import { AuditLogModal } from './components/AuditLogModal.js';
import { api } from './api.js';
import type { Book, BookStats } from '../shared/types.js';

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
    setSelectedBookId(bookId);
    setCurrentView('workspace');
  };

  const handleOpenReading = (bookId: string) => {
    setSelectedBookId(bookId);
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
      <main className="flex-1">
        {currentView === 'library' && (
          <LibraryView
            books={books}
            stats={stats}
            onSelectBookForVerification={handleOpenWorkspace}
            onSelectBookForReading={handleOpenReading}
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
            onBack={() => {
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
      </main>

      {/* Modals */}
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

      <AuditLogModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
      />
    </div>
  );
}
export default App;
