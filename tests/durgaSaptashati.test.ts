import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SAPTASHATI_SECTIONS } from '../src/data/durgaSaptashatiIndex.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('श्रीदुर्गासप्तशती (चण्डीपाठ) Liturgical Integrity & Verification Suite', () => {
  it('should have exactly 22 liturgical sections covering Purvanga, 13 Pradhana Adhyayas, and Uttaranga', () => {
    expect(SAPTASHATI_SECTIONS.length).toBe(22);

    // Verify Purvanga sections (1 to 6)
    const purvanga = SAPTASHATI_SECTIONS.filter(s => s.sectionType === 'purvanga');
    expect(purvanga.length).toBe(6);
    expect(purvanga.map(p => p.id)).toEqual([1, 2, 3, 4, 5, 6]);

    // Verify Pradhana 13 Adhyayas (7 to 19)
    const pradhana = SAPTASHATI_SECTIONS.filter(s => s.sectionType === 'pradhana_adhyaya');
    expect(pradhana.length).toBe(13);
    for (let i = 1; i <= 13; i++) {
      const ch = pradhana.find(c => c.adhyayaNumber === i);
      expect(ch).toBeDefined();
      expect(ch?.id).toBe(6 + i);
    }

    // Verify Uttaranga sections (20 to 22)
    const uttaranga = SAPTASHATI_SECTIONS.filter(s => s.sectionType === 'uttaranga');
    expect(uttaranga.length).toBe(3);
    expect(uttaranga.map(u => u.id)).toEqual([20, 21, 22]);
  });

  it('should have continuous and valid page numbers across all 22 sections', () => {
    for (let i = 0; i < SAPTASHATI_SECTIONS.length; i++) {
      const sec = SAPTASHATI_SECTIONS[i];
      expect(sec.startPage).toBe(i + 1);
      expect(sec.endPage).toBe(i + 1);
      expect(sec.titleHi).toBeTruthy();
      expect(sec.nameSa).toBeTruthy();
      expect(sec.icon).toBeTruthy();
    }
  });

  it('should have the complete book JSON on disk with valid Devanagari Sanskrit content', () => {
    const bookJsonPath = path.join(ROOT_DIR, 'public', 'data', 'books', 'granth-durga-saptashati.json');
    expect(fs.existsSync(bookJsonPath)).toBe(true);

    const data = JSON.parse(fs.readFileSync(bookJsonPath, 'utf-8'));
    expect(data.book).toBeDefined();
    expect(data.book.id).toBe('granth-durga-saptashati');
    expect(data.book.title).toContain('श्रीदुर्गासप्तशती');
    expect(data.book.page_count).toBe(22);
    expect(data.pages.length).toBe(22);

    // Verify Purvanga contains crucial mantras (Devi Kavacham, Argala, Kilaka)
    const kavachaPage = data.pages[1]; // Page 2: Kavacham
    expect(kavachaPage.verified_text).toContain('देव्याः कवचम्');
    expect(kavachaPage.verified_text).toContain('प्रथमं शैलपुत्री च द्वितीयं ब्रह्मचारिणी');

    const argalaPage = data.pages[2]; // Page 3: Argala
    expect(argalaPage.verified_text).toContain('अर्गलास्तोत्रम्');
    expect(argalaPage.verified_text).toContain('जयन्ती मङ्गला काली भद्रकाली कपालिनी');

    const kilakaPage = data.pages[3]; // Page 4: Kilaka
    expect(kilakaPage.verified_text).toContain('कीलकस्तोत्रम्');

    // Verify Chapter 1 contains Mahakali Dhyanam and Madhu-Kaitabha Vadha
    const ch1Page = data.pages[6];
    expect(ch1Page.verified_text).toContain('प्रथमोऽध्यायः');
    expect(ch1Page.verified_text).toContain('मधुकैटभवध');

    // Verify Chapter 4 contains Shakradaya Stuti
    const ch4Page = data.pages[9];
    expect(ch4Page.verified_text).toContain('चतुर्थोऽध्यायः');
    expect(ch4Page.verified_text).toContain('शक्रादयः सुरगणा निहतेऽतिवीर्ये');

    // Verify Chapter 5 contains Aparajita Stuti (Ya Devi Sarvabhuteshu)
    const ch5Page = data.pages[10];
    expect(ch5Page.verified_text).toContain('पञ्चमोऽध्यायः');
    expect(ch5Page.verified_text).toContain('या देवी सर्वभूतेषु मातृरूपेण संस्थिता');

    // Verify Chapter 11 contains Narayani Stuti
    const ch11Page = data.pages[16];
    expect(ch11Page.verified_text).toContain('नारायणीस्तुतिर्नामैकादशोऽध्यायः');
    expect(ch11Page.verified_text).toContain('सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके');

    // Verify Uttaranga contains Rahasya Trayam, Siddha Kunjika Stotram, and Aparadha Kshamapana
    const rahasyaPage = data.pages[20]; // Page 21: Rahasya Trayam
    expect(rahasyaPage.verified_text).toContain('रहस्यत्रयम्');
    expect(rahasyaPage.verified_text).toContain('प्राधानिकं रहस्यम्');

    const kunjikaPage = data.pages[21]; // Page 22: Siddha Kunjika & Kshamapana
    expect(kunjikaPage.verified_text).toContain('सिद्धकुञ्जिकास्तोत्रम्');
    expect(kunjikaPage.verified_text).toContain('ऐङ्कारी सृष्टिरूपायै ह्रीङ्कारी प्रतिपालिका');
    expect(kunjikaPage.verified_text).toContain('देव्यपराधक्षमापनस्तोत्रम्');
    expect(kunjikaPage.verified_text).toContain('अपराधसहस्राणि क्रियन्तेऽहर्निशं मया');
  });

  it('should ensure catalog books.json includes Sri Durga Saptashati', () => {
    const catalogPath = path.join(ROOT_DIR, 'public', 'data', 'books.json');
    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
    const entry = catalog.find((b: any) => b.id === 'granth-durga-saptashati');
    expect(entry).toBeDefined();
    expect(entry.title).toContain('श्रीदुर्गासप्तशती');
    expect(entry.page_count).toBe(22);
  });
});
