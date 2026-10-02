import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SAPTASHATI_SECTIONS } from '../src/data/durgaSaptashatiIndex.js';
import { SAPTASHATI_AUDIO_TRACKS } from '../src/data/durgaSaptashatiAudio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('श्रीदुर्गासप्तशती (चण्डीपाठ) Liturgical Integrity & Verification Suite', () => {
  it('should have exactly 28 dedicated liturgical sections covering Purvanga, 13 Pradhana Adhyayas, and Uttaranga', () => {
    expect(SAPTASHATI_SECTIONS.length).toBe(28);

    // Verify Purvanga sections (1 to 8: Sankalpa, Kavacha, Argala, Kilaka, Vaidika Ratri, Tantrika Ratri, Atharvashirsha, Navarna)
    const purvanga = SAPTASHATI_SECTIONS.filter(s => s.sectionType === 'purvanga');
    expect(purvanga.length).toBe(8);
    expect(purvanga.map(p => p.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);

    // Verify Pradhana 13 Adhyayas (9 to 21)
    const pradhana = SAPTASHATI_SECTIONS.filter(s => s.sectionType === 'pradhana_adhyaya');
    expect(pradhana.length).toBe(13);
    for (let i = 1; i <= 13; i++) {
      const ch = pradhana.find(c => c.adhyayaNumber === i);
      expect(ch).toBeDefined();
      expect(ch?.id).toBe(8 + i);
    }

    // Verify Uttaranga sections (22 to 28: Vaidika Devisuktam, Tantrika Devisuktam, Pradhanika, Vaikritika, Murti, Kunjika, Kshamapana)
    const uttaranga = SAPTASHATI_SECTIONS.filter(s => s.sectionType === 'uttaranga');
    expect(uttaranga.length).toBe(7);
    expect(uttaranga.map(u => u.id)).toEqual([22, 23, 24, 25, 26, 27, 28]);
  });

  it('should have continuous and valid page numbers across all 28 sections', () => {
    for (let i = 0; i < SAPTASHATI_SECTIONS.length; i++) {
      const sec = SAPTASHATI_SECTIONS[i];
      expect(sec.startPage).toBe(i + 1);
      expect(sec.endPage).toBe(i + 1);
      expect(sec.titleHi).toBeTruthy();
      expect(sec.nameSa).toBeTruthy();
      expect(sec.icon).toBeTruthy();
      // Verify audio track exists for every section
      expect(SAPTASHATI_AUDIO_TRACKS[sec.startPage]).toBeDefined();
      expect(SAPTASHATI_AUDIO_TRACKS[sec.startPage].audioUrl).toBeTruthy();
    }
  });

  it('should have the complete book JSON on disk with valid Devanagari Sanskrit content', () => {
    const bookJsonPath = path.join(ROOT_DIR, 'public', 'data', 'books', 'granth-durga-saptashati.json');
    expect(fs.existsSync(bookJsonPath)).toBe(true);

    const data = JSON.parse(fs.readFileSync(bookJsonPath, 'utf-8'));
    expect(data.book).toBeDefined();
    expect(data.book.id).toBe('granth-durga-saptashati');
    expect(data.book.title).toContain('श्रीदुर्गासप्तशती');
    expect(data.book.page_count).toBe(28);
    expect(data.pages.length).toBe(28);

    // Verify Purvanga contains crucial mantras (Devi Kavacham, Argala, Kilaka)
    const kavachaPage = data.pages[1]; // Page 2: Kavacham
    expect(kavachaPage.verified_text).toContain('देव्याः कवचम्');
    expect(kavachaPage.verified_text).toContain('प्रथमं शैलपुत्री च द्वितीयं ब्रह्मचारिणी');

    const argalaPage = data.pages[2]; // Page 3: Argala
    expect(argalaPage.verified_text).toContain('अर्गलास्तोत्रम्');
    expect(argalaPage.verified_text).toContain('जयन्ती मङ्गला काली भद्रकाली कपालिनी');

    const kilakaPage = data.pages[3]; // Page 4: Kilaka
    expect(kilakaPage.verified_text).toContain('कीलकस्तोत्रम्');

    // Page 5: Vaidika Ratrisuktam
    const vaidikaRatriPage = data.pages[4];
    expect(vaidikaRatriPage.verified_text).toContain('वेदोक्तं रात्रिसूक्तम्');
    expect(vaidikaRatriPage.verified_text).toContain('रात्री');

    // Page 6: Tantrika Ratrisuktam
    const tantrikaRatriPage = data.pages[5];
    expect(tantrikaRatriPage.verified_text).toContain('तन्त्रोक्तं रात्रिसूक्तम्');
    expect(tantrikaRatriPage.verified_text).toContain('विश्वेश्वरीं जगद्धात्रीं');

    // Page 7: Devyatharvashirsham
    const atharvaPage = data.pages[6];
    expect(atharvaPage.verified_text).toContain('देव्यथर्वशीर्षम्');
    expect(atharvaPage.verified_text).toContain('सर्वे वै देवा देवीमुपतस्थुः');

    // Page 8: Navarna Mantra Vidhi
    const navarnaPage = data.pages[7];
    expect(navarnaPage.verified_text).toContain('श्रीनवार्णमन्त्रविधिः');

    // Verify Chapter 1 contains Mahakali Dhyanam and Madhu-Kaitabha Vadha (Page 9)
    const ch1Page = data.pages[8];
    expect(ch1Page.verified_text).toContain('प्रथमोऽध्यायः');
    expect(ch1Page.verified_text).toContain('मधुकैटभवध');

    // Verify Chapter 4 contains Shakradaya Stuti (Page 12)
    const ch4Page = data.pages[11];
    expect(ch4Page.verified_text).toContain('चतुर्थोऽध्यायः');
    expect(ch4Page.verified_text).toContain('शक्रादयः सुरगणा निहतेऽतिवीर्ये');

    // Verify Chapter 5 contains Aparajita Stuti (Page 13)
    const ch5Page = data.pages[12];
    expect(ch5Page.verified_text).toContain('पञ्चमोऽध्यायः');
    expect(ch5Page.verified_text).toContain('या देवी सर्वभूतेषु');

    // Verify Chapter 11 contains Narayani Stuti (Page 19)
    const ch11Page = data.pages[18];
    expect(ch11Page.verified_text).toContain('नारायणीस्तुतिर्नामैकादशोऽध्यायः');
    expect(ch11Page.verified_text).toContain('सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके');

    // Page 22: Vaidika Devisuktam
    const vaidikaDeviPage = data.pages[21];
    expect(vaidikaDeviPage.verified_text).toContain('वेदोक्तं देवीसूक्तम्');
    expect(vaidikaDeviPage.verified_text).toContain('वागाम्भृणी');

    // Page 23: Tantrika Devisuktam
    const tantrikaDeviPage = data.pages[22];
    expect(tantrikaDeviPage.verified_text).toContain('तन्त्रोक्तं देवीसूक्तम्');
    expect(tantrikaDeviPage.verified_text).toContain('नमो देव्यै महादेव्यै शिवायै सततं नमः');

    // Page 24: Pradhanika Rahasyam
    const pradhanikaPage = data.pages[23];
    expect(pradhanikaPage.verified_text).toContain('प्राधानिकं रहस्यम्');

    // Page 25: Vaikritika Rahasyam
    const vaikritikaPage = data.pages[24];
    expect(vaikritikaPage.verified_text).toContain('वैकृतिकं रहस्यम्');

    // Page 26: Murti Rahasyam
    const murtiPage = data.pages[25];
    expect(murtiPage.verified_text).toContain('मूर्तिरहस्यम्');

    // Page 27: Siddha Kunjika
    const kunjikaPage = data.pages[26];
    expect(kunjikaPage.verified_text).toContain('सिद्धकुञ्जिकास्तोत्रम्');
    expect(kunjikaPage.verified_text).toContain('ऐङ्कारी सृष्टिरूपायै ह्रीङ्कारी प्रतिपालिका');

    // Page 28: Aparadha Kshamapana
    const kshamaPage = data.pages[27];
    expect(kshamaPage.verified_text).toContain('देव्यपराधक्षमापनस्तोत्रम्');
    expect(kshamaPage.verified_text).toContain('अपराधसहस्राणि क्रियन्तेऽहर्निशं मया');
  });

  it('should ensure catalog books.json includes Sri Durga Saptashati with 28 pages', () => {
    const catalogPath = path.join(ROOT_DIR, 'public', 'data', 'books.json');
    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
    const entry = catalog.find((b: any) => b.id === 'granth-durga-saptashati');
    expect(entry).toBeDefined();
    expect(entry.title).toContain('श्रीदुर्गासप्तशती');
    expect(entry.page_count).toBe(28);
  });
});
