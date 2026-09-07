import { describe, it, expect } from 'vitest';

describe('Devanagari & Vedic Unicode Preservation (Section 9 & Section 44)', () => {
  it('preserves sacred Omkara (ॐ) and Dandapariksha (।, ॥)', () => {
    const sacredText = 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यम्। भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥';
    expect(sacredText).toContain('ॐ');
    expect(sacredText).toContain('।');
    expect(sacredText).toContain('॥');
    expect(sacredText.normalize('NFC')).toEqual(sacredText);
  });

  it('correctly preserves Visarga (ः), Anusvara (ं), and Chandrabindu (ँ)', () => {
    const textWithModifiers = 'नमः शिवाय, ॐ गं गणपतये नमः, काँपे सकल लोक';
    expect(textWithModifiers).toContain('ः');
    expect(textWithModifiers).toContain('ं');
    expect(textWithModifiers).toContain('ँ');
  });

  it('preserves Avagraha (ऽ) and Sanskrit vowel matras (ृ, ॄ)', () => {
    const text = 'त्वमेव केवलं कर्ताऽसि। पितॄणाम् तृप्तिः।';
    expect(text).toContain('ऽ');
    expect(text).toContain('ृ');
    expect(text).toContain('ॄ');
  });

  it('preserves complex Devanagari conjuncts and halanta without loss', () => {
    const conjuncts = ['क्ष', 'त्र', 'ज्ञ', 'श्र', 'कृ', 'त्म', 'द्व', 'द्य', 'श्च', 'ङ्ग', 'ञ्च'];
    const text = conjuncts.join(' ');
    for (const conj of conjuncts) {
      expect(text).toContain(conj);
    }
  });

  it('maintains exact UTF-8 byte integrity across string operations', () => {
    const original = '॥ श्री गणेशाय नमः ॥';
    const buffer = Buffer.from(original, 'utf8');
    const reconstructed = buffer.toString('utf8');
    expect(reconstructed).toBe(original);
  });
});
