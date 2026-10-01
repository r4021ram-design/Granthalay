import React, { useState } from 'react';
import { X, Sparkles, Plus, BookOpen, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import {
  CANONICAL_DARSHANS,
  CANONICAL_DEITIES,
  DarshanId,
  saveCustomStotra,
  ScriptureItem,
} from '../data/darshanTaxonomy.js';

interface SingleIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newItem: ScriptureItem) => void;
}

export const SingleIngestionModal: React.FC<SingleIngestionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [darshanId, setDarshanId] = useState<DarshanId>('stotra');
  const [deityId, setDeityId] = useState<string>('shiva');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) {
      setError('कृपया स्तोत्र अथवा पाठ का नाम प्रविष्ट करें।');
      return;
    }
    if (!content.trim()) {
      setError('कृपया संस्कृत श्लोक पाठ प्रविष्ट करें।');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const saved = saveCustomStotra({
        darshanId,
        deityId,
        title: title.trim(),
        author: author.trim() || undefined,
        content: content.trim(),
      });

      onSuccess(saved);
      // Reset form
      setTitle('');
      setAuthor('');
      setContent('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'पाठ सहेजने में त्रुटि हुई।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-amber-900/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🕉️</span>
            <div>
              <h2 className="text-lg font-serif font-bold text-amber-100 flex items-center gap-2">
                नवीन स्तोत्र / पाठ संकलन
              </h2>
              <p className="text-xs text-neutral-400">
                सीधे अपने अभीष्ट दर्शन एवं देवता के वर्ग में नया पाठ जोड़ें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-950/60 border border-red-800/80 rounded-lg text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Darshan Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              १. दर्शन खण्ड चुनें
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CANONICAL_DARSHANS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDarshanId(d.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    darshanId === d.id
                      ? 'bg-amber-950/80 border-amber-500 text-amber-200 font-semibold shadow-inner'
                      : 'bg-neutral-950/50 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <span className="text-xl mb-1">{d.icon}</span>
                  <span className="text-xs font-devanagari">{d.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Deity Selector (if Stotra Darshan) */}
          {darshanId === 'stotra' && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                २. आराध्य देवता / इष्ट चुनें
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
                {CANONICAL_DEITIES.map((deity) => (
                  <button
                    key={deity.id}
                    type="button"
                    onClick={() => setDeityId(deity.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                      deityId === deity.id
                        ? 'bg-amber-900/40 border-amber-500 text-amber-200'
                        : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <span className="text-lg">{deity.icon}</span>
                    <span className="text-xs font-devanagari font-medium">{deity.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Title & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                स्तोत्र / पाठ का नाम <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="उदा. श्रीरुद्राष्टकम्, कनकधारा..."
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-neutral-100 text-sm focus:outline-none focus:border-amber-500 font-devanagari"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                रचयिता / उद्गम (वैकल्पिक)
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="उदा. महर्षि वेदव्यास, तुलसीदास..."
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-neutral-100 text-sm focus:outline-none focus:border-amber-500 font-devanagari"
              />
            </div>
          </div>

          {/* 4. Shloka Textarea (OCR or Text Paste) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                संस्कृत श्लोक पाठ (OCR अथवा टेक्स्ट) <span className="text-red-400">*</span>
              </label>
              <span className="text-[11px] text-neutral-500">देवनागरी शुद्ध वर्ण</span>
            </div>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="यहाँ अपने श्लोक अथवा स्तोत्र का पाठ पेस्ट करें...
उदा.
नमामीशमीशान निर्वाणरूपं विभुं व्यापकं ब्रह्मवेदस्वरूपम् ।
निजं निर्गुणं निर्विकल्पं निरीहं चिदाकाशमाकाशवासं भजेऽहम् ॥ १ ॥"
              className="w-full p-3.5 bg-neutral-950 border border-neutral-700 rounded-xl text-neutral-100 text-sm font-devanagari leading-relaxed focus:outline-none focus:border-amber-500 resize-none font-mono"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-800 bg-neutral-950/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            रद्द करें
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-semibold text-sm shadow-lg shadow-amber-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>संग्रह में सुरक्षित करें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
