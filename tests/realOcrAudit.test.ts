import { describe, it, expect } from 'vitest';
import { createWorker } from 'tesseract.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Real Tesseract OCR Audit', () => {
  it('loads local traineddata and performs real OCR on fixture', async () => {
    const fixturePath = path.join(__dirname, 'fixtures', 'sample_atharvashirsha.png');
    expect(fs.existsSync(fixturePath)).toBe(true);

    const worker = await createWorker('san+hin', 1, {
      langPath: rootDir,
      gzip: false,
    });

    try {
      const res = await worker.recognize(fixturePath);
      console.log('Real OCR Output:\n', res.data.text);
      console.log('Real OCR Confidence:', res.data.confidence);
      expect(res.data.text.length).toBeGreaterThan(0);

      const { analyzeDevanagariText } = await import('../server/devanagariSafety.js');
      const analysis = analyzeDevanagariText(res.data.text);
      console.log('Analysis issues:', JSON.stringify(analysis.issues, null, 2));
      console.log('Critical count:', analysis.criticalIssuesCount);
      console.log('Total issues:', analysis.totalIssuesCount);
    } finally {
      await worker.terminate();
    }
  }, 30000);
});
