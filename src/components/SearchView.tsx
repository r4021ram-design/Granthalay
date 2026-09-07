import React, { useState } from 'react';
import { Search, BookOpen, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../api.js';
import type { SearchResult } from '../../shared/types.js';

interface SearchViewProps {
  onSelectResult: (bookId: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onSelectResult }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setIsSearching(true);
      const res = await api.search(query.trim());
      setResults(res.results);
      setIsSearching(false);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header & Search Bar */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-neutral-100 font-devanagari">
          🔍 समस्त शास्त्र एवं मन्त्र अन्वेषण
        </h1>
        <p className="text-xs text-neutral-400">
          डिजिटाइज़्ड पूजा पुस्तकों, स्तोत्रों और मन्त्रों में सटीक देवनागरी खोज
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="खोजें: जैसे 'गणपतये', 'शिव', 'गायत्री', 'तत्त्वमसि'..."
          className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-neutral-900 border border-neutral-700 text-neutral-100 placeholder-neutral-500 text-sm focus:outline-none focus:border-sacred-500 font-devanagari shadow-lg shadow-black/40"
        />
        <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl bg-sacred-600 hover:bg-sacred-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all font-devanagari"
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'खोजें'}
        </button>
      </form>

      {/* Quick query chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-400 font-devanagari">
        <span>सुझाव:</span>
        {['ॐ', 'गणेश', 'शिवाय', 'मन्त्र', 'स्तोत्र', 'अथर्वशीर्ष'].map(chip => (
          <button
            key={chip}
            type="button"
            onClick={() => {
              setQuery(chip);
              api.search(chip).then(r => {
                setResults(r.results);
                setHasSearched(true);
              });
            }}
            className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Search Results */}
      {isSearching && (
        <div className="py-12 text-center text-neutral-400">
          <Loader2 className="w-8 h-8 mx-auto text-sacred-500 animate-spin mb-2" />
          <p className="text-xs font-devanagari">ग्रन्थों में खोज की जा रही है...</p>
        </div>
      )}

      {!isSearching && hasSearched && results.length === 0 && (
        <div className="py-12 text-center text-neutral-500 bg-neutral-900/40 rounded-2xl border border-neutral-800">
          <p className="text-sm font-devanagari">
            "{query}" के लिए कोई परिणाम नहीं मिला। कृपया वर्तनी अथवा मात्राओं की जाँच करें।
          </p>
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs text-neutral-400 flex items-center justify-between">
            <span><strong>{results.length}</strong> परिणाम मिले</span>
            <span>खोज: "{query}"</span>
          </div>

          {results.map((res, idx) => (
            <div
              key={`${res.page_id}-${idx}`}
              onClick={() => onSelectResult(res.book_id)}
              className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-sacred-700/80 cursor-pointer transition-all space-y-2 group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-sacred-400" />
                  <span className="font-bold text-sm text-neutral-200 group-hover:text-sacred-300 transition-colors font-devanagari">
                    {res.book_title}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
                    पृष्ठ संख्या {res.page_number}
                  </span>
                </div>

                {res.is_verified ? (
                  <span className="flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>प्रमाणित (Verified)</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800">
                    <AlertCircle className="w-3 h-3" />
                    <span>समीक्षाधीन (In Review)</span>
                  </span>
                )}
              </div>

              {/* Snippet */}
              <p className="text-sm text-neutral-300 font-devanagari pl-6 border-l-2 border-sacred-600/60 leading-relaxed">
                {res.surrounding_context}
              </p>

              <div className="flex justify-end pt-1">
                <span className="text-xs text-sacred-400 group-hover:underline flex items-center space-x-1 font-devanagari">
                  <span>कार्यपीठ में खोलें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
