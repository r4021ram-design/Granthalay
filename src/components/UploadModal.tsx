import React, { useState, useRef } from 'react';
import { X, Upload, FileUp, AlertCircle, Loader2 } from 'lucide-react';
import type { ScriptureLanguage } from '../../shared/types.js';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newBookId: string) => void;
  uploadFn: (formData: FormData) => Promise<{ success: boolean; book: any }>;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  uploadFn,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [language, setLanguage] = useState<ScriptureLanguage>('sa');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      const validTypes = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/webp',
        'image/tiff',
      ];
      if (!validTypes.includes(selected.type) && !selected.name.endsWith('.pdf')) {
        setErrorMessage('अमान्य प्रारूप। केवल PDF, PNG, JPG, WEBP और TIFF समर्थित हैं।');
        setFile(null);
        return;
      }
      setFile(selected);
      setErrorMessage(null);
      if (!title) {
        setTitle(selected.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('कृपया एक PDF अथवा छवि फ़ाइल चुनें।');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim() || file.name);
      formData.append('author', author.trim());
      formData.append('language', language);

      const result = await uploadFn(formData);
      setIsUploading(false);
      onUploadSuccess(result.book.id);
      onClose();
    } catch (err: any) {
      console.error(err);
      setIsUploading(false);
      setErrorMessage(err.message || 'फ़ाइल अपलोड में त्रुटि हुई।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-neutral-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/40">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-sacred-950 border border-sacred-800 flex items-center justify-center text-sacred-400">
              <Upload className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-neutral-100 font-devanagari">
              नया ग्रन्थ अथवा पूजा पुस्तक जोड़ें
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Drag & Drop File Zone */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5 font-devanagari">
              दस्तावेज़ फ़ाइल (PDF, PNG, JPG, WEBP)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                file
                  ? 'border-sacred-500 bg-sacred-950/20'
                  : 'border-neutral-700 hover:border-neutral-500 bg-neutral-950/40 hover:bg-neutral-950/80'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,image/png,image/jpeg,image/webp,image/tiff"
                className="hidden"
              />
              <FileUp className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
              {file ? (
                <div>
                  <p className="text-sm font-semibold text-sacred-300">{file.name}</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • प्रारूप स्वीकृत
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-neutral-200">
                    यहाँ क्लिक करें या फ़ाइल ड्रैग करें
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    स्कैन की गई PDF या उच्च-गुणवत्ता पृष्ठ छवियां
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Book Title */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1 font-devanagari">
              ग्रन्थ / पुस्तक का नाम (Title) *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="उदा. श्री गणपत्यथर्वशीर्षम्, श्री दुर्गा सप्तशती"
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 placeholder-neutral-500 text-sm focus:outline-none focus:border-sacred-500 font-devanagari"
              required
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1 font-devanagari">
              रचयिता / सम्पादक / परम्परा (Author / Lineage)
            </label>
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="उदा. महर्षि वेदव्यास, पारंपरिक, गीता प्रेस"
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 placeholder-neutral-500 text-sm focus:outline-none focus:border-sacred-500 font-devanagari"
            />
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1 font-devanagari">
              प्रमुख भाषा (Scripture Target Language)
            </label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value as ScriptureLanguage)}
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-100 text-sm focus:outline-none focus:border-sacred-500 font-devanagari"
            >
              <option value="sa">संस्कृतम् (Sanskrit - Vedic / Stotras)</option>
              <option value="hi">हिन्दी (Hindi - Bhashya / Aarti / Chalisa)</option>
              <option value="mixed">संस्कृत + हिन्दी मिश्रित (Mixed Scripture + Commentary)</option>
              <option value="devanagari">सामान्य देवनागरी (General Devanagari)</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-300 hover:bg-neutral-800 transition-colors"
            >
              रद्द करें (Cancel)
            </button>
            <button
              type="submit"
              disabled={isUploading || !file}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-sacred-600 hover:bg-sacred-500 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md shadow-sacred-950 transition-all font-devanagari"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>प्रक्रियाधीन... (Processing)</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>अपलोड एवं आरम्भ करें</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
