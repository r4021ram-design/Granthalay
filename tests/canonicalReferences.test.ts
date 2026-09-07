import { describe, it, expect } from 'vitest';
import {
  CANONICAL_SCRIPTURES,
  getCanonicalScripturesList,
  getCanonicalScriptureById,
  matchCanonicalScripture,
} from '../server/canonicalReferences.js';
import { devanagariToIast } from '../src/utils/transliteration.js';

describe('SanskritDocuments Canonical Reference Bank', () => {
  it('should list all loaded canonical scriptures with authentic metadata', () => {
    const list = getCanonicalScripturesList();
    expect(list.length).toBeGreaterThanOrEqual(5);

    const ids = list.map(s => s.id);
    expect(ids).toContain('atharvashirsha');
    expect(ids).toContain('purushasuktam');
    expect(ids).toContain('shrisuktam');
    expect(ids).toContain('shivatandava');
    expect(ids).toContain('adityahridayam');

    list.forEach(item => {
      expect(item.sanskrit_documents_url).toContain('sanskritdocuments.org');
      expect(item.title_sa).toBeDefined();
      expect(item.title_iast).toBeDefined();
    });
  });

  it('should fetch Ganapati Atharvashirsha with complete canonical verses and Vedic accents', () => {
    const atharva = getCanonicalScriptureById('atharvashirsha');
    expect(atharva).toBeDefined();
    expect(atharva?.id).toBe('atharvashirsha');
    expect(atharva?.sanskrit_documents_url).toBe('https://sanskritdocuments.org/doc_ganesha/atharva.html');

    // Shanti Mantra present
    expect(atharva?.shanti_patha).toContain('भद्रं कर्णेभिः');

    // First verse: Upaniṣad opening
    const verse1 = atharva?.verses[0];
    expect(verse1?.devanagari).toContain('ॐ नमस्ते गणपतये');
    expect(verse1?.devanagari).toContain('तत्त्वमसि');
    expect(verse1?.iast).toContain('namaste gaṇapataye');
    expect(verse1?.meaning_hi).toBeDefined();

    // Check mula text contains foundational mahavakya
    expect(atharva?.mula_text).toContain('सर्वं खल्विदं ब्रह्मासि');
  });

  it('should accurately match Ganapati Atharvashirsha from OCR snippet text', () => {
    const snippet = `
      ॐ नमस्ते गणपतये । त्वमेव प्रत्यक्षं तत्त्वमसि ।
      त्वमेव केवलं कर्ताऽसि । त्वमेव केवलं धर्ताऽसि ।
      त्वमेव केवलं हर्ताऽसि । त्वमेव सर्वं खल्विदं ब्रह्मासि ।
    `;
    const match = matchCanonicalScripture(snippet);
    expect(match.matched).toBe(true);
    expect(match.scriptureId).toBe('atharvashirsha');
    expect(match.title_sa).toContain('थर्वशीर्ष');
    expect(match.confidence).toBeGreaterThanOrEqual(90);
  });

  it('should accurately match Purusha Suktam from Vedic hymn snippet', () => {
    const snippet = `
      ॐ सहस्रशीर्षा पुरुषः सहस्राक्षः सहस्रपात् ।
      स भूमिं विश्वतो वृत्वात्यतिष्ठद्दशाङ्गुलम् ॥
    `;
    const match = matchCanonicalScripture(snippet);
    expect(match.matched).toBe(true);
    expect(match.scriptureId).toBe('purushasuktam');
  });

  it('should accurately match Shri Suktam snippet', () => {
    const snippet = `
      ॐ हिरण्यवर्णां हरिणीं सुवर्णरजतस्रजाम् ।
      चन्द्रां हिरण्मयीं लक्ष्मीं जातवेदो म आवह ॥
    `;
    const match = matchCanonicalScripture(snippet);
    expect(match.matched).toBe(true);
    expect(match.scriptureId).toBe('shrisuktam');
  });

  it('should return matched: false for unrelated text', () => {
    const unrelatedText = 'यह एक साधारण आधुनिक हिन्दी वाक्य है जिसका किसी वैदिक सूक्त से सम्बन्ध नहीं है।';
    const match = matchCanonicalScripture(unrelatedText);
    expect(match.matched).toBe(false);
  });
});

describe('Devanagari to IAST Transliteration Engine', () => {
  it('should correctly transliterate sacred Pranava and basic Sanskrit words', () => {
    expect(devanagariToIast('ॐ')).toBe('oṃ');
    expect(devanagariToIast('नमस्ते')).toBe('namaste');
    expect(devanagariToIast('गणपतये')).toBe('gaṇapataye');
    expect(devanagariToIast('प्रत्यक्षम्')).toBe('pratyakṣam');
    expect(devanagariToIast('तत्त्वमसि')).toBe('tattvamasi');
  });

  it('should preserve punctuation, Dandas, and Avagraha in IAST', () => {
    const dev = 'त्वमेव केवलं धर्ताऽसि ।';
    const iast = devanagariToIast(dev);
    expect(iast).toContain("dhartā'si");
    expect(iast).toContain('|');
  });

  it('should preserve Vedic accents with standardized notation', () => {
    const withAccent = 'दे॒वाः'; // contains anudātta \u0952
    const result = devanagariToIast(withAccent);
    expect(result).toBe('de_vāḥ');
  });
});
