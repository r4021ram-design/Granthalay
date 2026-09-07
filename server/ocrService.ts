import { createWorker } from 'tesseract.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import type { OCRBlockInfo, OCRLineInfo, OCRWordInfo, SectionType } from '../shared/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

export interface OCRResult {
  text: string;
  confidence: number;
  blocks: OCRBlockInfo[];
  provider: string;
  language: string;
}

export interface OCRProvider {
  id: string;
  name: string;
  isAvailable(): Promise<boolean>;
  processImage(imagePath: string, language?: string): Promise<OCRResult>;
}

// Helper to map scripture language code to Tesseract traineddata identifiers
export function mapToTesseractLanguage(lang?: string): string {
  if (!lang) return 'san+hin';
  switch (lang.toLowerCase()) {
    case 'sa':
    case 'san':
    case 'sanskrit':
      return 'san';
    case 'hi':
    case 'hin':
    case 'hindi':
      return 'hin';
    case 'mixed':
    case 'devanagari':
    default:
      return 'san+hin';
  }
}

// Helper to classify Devanagari blocks based on patterns
export function classifyBlockType(text: string): SectionType {
  const trimmed = text.trim();
  if (!trimmed) return 'main_text';

  if (/^(\d+|[०-९]+)$/.test(trimmed)) {
    return 'page_number';
  }
  if (/^[॥।]*\s*(?:अथ|श्री|ॐ)?.*(?:स्तोत्र|माहात्म्य|कवच|सहस्रनाम|थर्वशीर्ष|अथर्वशीर्ष|चालीसा|आरती|सूक्त|उपनिषत्|महिम्न)/u.test(trimmed)) {
    return 'title';
  }
  if (/^(अथ\s+.*अध्याय|अध्याय\s+[०-९0-9]+)/.test(trimmed)) {
    return 'chapter';
  }
  if (/^(अस्य\s+.*मन्त्रस्य|विनियोग|ॐ\s+अस्य\s+श्री)/.test(trimmed)) {
    return 'viniyoga';
  }
  if (/^(ध्यानम्|अथ\s+ध्यानम्|ध्यायेत्)/.test(trimmed)) {
    return 'dhyana';
  }
  if (/^(करन्यास|अङ्गन्यास|हृदयादिन्यास|न्यास)/.test(trimmed)) {
    return 'nyasa';
  }
  if (/^(कवचम्|अथ\s+कवचम्)/.test(trimmed)) {
    return 'kavacha';
  }
  if (/^(फलश्रुति|इति\s+फलश्रुति)/.test(trimmed)) {
    return 'phalashruti';
  }
  if (/^(॥\s*इति|समाप्त|सम्पूर्णम्)/.test(trimmed)) {
    return 'notes';
  }
  if (/^(अर्थ|भावार्थ|व्याख्या|टीका):?/.test(trimmed)) {
    return 'meaning';
  }
  if (/^(ॐ\s*.*|मन्त्र:?)/u.test(trimmed)) {
    return 'mantra';
  }
  if (/॥\s*[०-९0-9]+\s*॥/.test(trimmed) || /।[^\n]+॥/.test(trimmed)) {
    return 'shloka';
  }
  return 'main_text';
}

export class TesseractDevanagariProvider implements OCRProvider {
  id = 'local-tesseract';
  name = 'Local Tesseract.js (Sanskrit / Hindi)';

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async processImage(imagePath: string, language?: string): Promise<OCRResult> {
    const tessLang = mapToTesseractLanguage(language);
    const worker = await createWorker(tessLang, 1, {
      langPath: ROOT_DIR,
      gzip: false,
    });

    try {
      const ret = await worker.recognize(imagePath);
      const data = ret.data;

      const blocks: OCRBlockInfo[] = [];

      if (data.blocks && data.blocks.length > 0) {
        for (let bIdx = 0; bIdx < data.blocks.length; bIdx++) {
          const block = data.blocks[bIdx];
          const lines: OCRLineInfo[] = [];

          if (block.paragraphs) {
            for (const para of block.paragraphs) {
              if (para.lines) {
                for (const line of para.lines) {
                  const words: OCRWordInfo[] = (line.words || []).map(w => ({
                    text: w.text,
                    confidence: Math.round(w.confidence || 0),
                    bbox: w.bbox ? { x0: w.bbox.x0, y0: w.bbox.y0, x1: w.bbox.x1, y1: w.bbox.y1 } : undefined,
                  }));

                  lines.push({
                    text: line.text,
                    confidence: Math.round(line.confidence || 0),
                    bbox: line.bbox ? { x0: line.bbox.x0, y0: line.bbox.y0, x1: line.bbox.x1, y1: line.bbox.y1 } : undefined,
                    words,
                  });
                }
              }
            }
          }

          const blockText = block.text || '';
          blocks.push({
            id: `b-${bIdx}`,
            type: classifyBlockType(blockText),
            text: blockText,
            confidence: Math.round(block.confidence || 0),
            bbox: block.bbox ? { x0: block.bbox.x0, y0: block.bbox.y0, x1: block.bbox.x1, y1: block.bbox.y1 } : undefined,
            lines,
          });
        }
      } else {
        // Fallback to single block if blocks not parsed
        blocks.push({
          id: 'b-0',
          type: classifyBlockType(data.text),
          text: data.text,
          confidence: Math.round(data.confidence || 0),
        });
      }

      return {
        text: data.text,
        confidence: Math.round(data.confidence || 0),
        blocks,
        provider: this.name,
        language: tessLang,
      };
    } finally {
      await worker.terminate();
    }
  }
}

class OCRServiceRegistry {
  private providers: Map<string, OCRProvider> = new Map();
  private defaultProviderId: string = 'local-tesseract';

  constructor() {
    this.register(new TesseractDevanagariProvider());
  }

  register(provider: OCRProvider): void {
    this.providers.set(provider.id, provider);
  }

  getProvider(id?: string): OCRProvider {
    const targetId = id || this.defaultProviderId;
    const provider = this.providers.get(targetId);
    if (!provider) {
      throw new Error(`OCR provider '${targetId}' is not registered. Available providers: ${Array.from(this.providers.keys()).join(', ')}`);
    }
    return provider;
  }

  listProviders(): Array<{ id: string; name: string }> {
    return Array.from(this.providers.values()).map(p => ({ id: p.id, name: p.name }));
  }
}

export const OCRService = new OCRServiceRegistry();
