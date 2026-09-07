import { describe, it, expect } from 'vitest';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { analyzeDevanagariText } from '../server/devanagariSafety.js';
import { classifyBlockType } from '../server/ocrService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXTURES_DIR = path.join(__dirname, 'fixtures');
if (!fs.existsSync(FIXTURES_DIR)) {
  fs.mkdirSync(FIXTURES_DIR, { recursive: true });
}

describe('Golden Test Dataset (Section 45 & Section 46)', () => {
  const sampleAtharvashirsha = [
    '॥ श्रीगणेशाय नमः ॥',
    '॥ अथ श्रीगणपत्यथर्वशीर्षम् ॥',
    'ॐ नमस्ते गणपतये।',
    'त्वमेव प्रत्यक्षं तत्त्वमसि।',
    'त्वमेव केवलं कर्ताऽसि।',
    'त्वमेव केवलं धर्ताऽसि।',
    'त्वमेव केवलं हर्ताऽसि।',
    'त्वमेव सर्वं खल्विदं ब्रह्मासि।',
    'त्वं साक्षादात्माऽसि नित्यम्॥ १ ॥',
  ].join('\n');

  it('generates pristine synthetic test fixture image for scripture testing', async () => {
    const fixtureImagePath = path.join(FIXTURES_DIR, 'sample_atharvashirsha.png');

    // Create an SVG with Devanagari text rendered crisply on parchment background
    const svgText = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#FAF5E8"/>
        <rect x="20" y="20" width="760" height="560" fill="none" stroke="#C2410C" stroke-width="2"/>
        <text x="400" y="80" font-family="Noto Serif Devanagari, sans-serif" font-size="28" font-weight="bold" fill="#7C2D12" text-anchor="middle">॥ श्रीगणेशाय नमः ॥</text>
        <text x="400" y="130" font-family="Noto Serif Devanagari, sans-serif" font-size="24" font-weight="bold" fill="#9A3412" text-anchor="middle">॥ अथ श्रीगणपत्यथर्वशीर्षम् ॥</text>
        <text x="400" y="200" font-family="Noto Sans Devanagari, sans-serif" font-size="22" fill="#292524" text-anchor="middle">ॐ नमस्ते गणपतये।</text>
        <text x="400" y="250" font-family="Noto Sans Devanagari, sans-serif" font-size="22" fill="#292524" text-anchor="middle">त्वमेव प्रत्यक्षं तत्त्वमसि।</text>
        <text x="400" y="300" font-family="Noto Sans Devanagari, sans-serif" font-size="22" fill="#292524" text-anchor="middle">त्वमेव केवलं कर्ताऽसि।</text>
        <text x="400" y="350" font-family="Noto Sans Devanagari, sans-serif" font-size="22" fill="#292524" text-anchor="middle">त्वमेव केवलं धर्ताऽसि।</text>
        <text x="400" y="400" font-family="Noto Sans Devanagari, sans-serif" font-size="22" fill="#292524" text-anchor="middle">त्वमेव केवलं हर्ताऽसि।</text>
        <text x="400" y="450" font-family="Noto Sans Devanagari, sans-serif" font-size="22" fill="#292524" text-anchor="middle">त्वमेव सर्वं खल्विदं ब्रह्मासि।</text>
        <text x="400" y="500" font-family="Noto Sans Devanagari, sans-serif" font-size="22" fill="#292524" text-anchor="middle">त्वं साक्षादात्माऽसि नित्यम्॥ १ ॥</text>
      </svg>
    `;

    await sharp(Buffer.from(svgText))
      .png()
      .toFile(fixtureImagePath);

    expect(fs.existsSync(fixtureImagePath)).toBe(true);
    const meta = await sharp(fixtureImagePath).metadata();
    expect(meta.width).toBe(800);
    expect(meta.height).toBe(600);
  });

  it('validates golden scripture text structure and classification', () => {
    expect(classifyBlockType('॥ अथ श्रीगणपत्यथर्वशीर्षम् ॥')).toBe('title');
    expect(classifyBlockType('ॐ नमस्ते गणपतये।')).toBe('mantra');
    expect(classifyBlockType('त्वमेव प्रत्यक्षं तत्त्वमसि॥ १ ॥')).toBe('shloka');
  });

  it('validates golden scripture text has 0 critical safety issues', () => {
    const analysis = analyzeDevanagariText(sampleAtharvashirsha);
    expect(analysis.criticalIssuesCount).toBe(0);
    expect(analysis.advisoryLanguage).toBe('sa');
    expect(analysis.qualityScore).toBe(100);
  });
});
