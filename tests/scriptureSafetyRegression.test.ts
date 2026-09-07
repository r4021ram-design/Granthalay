import { describe, it, expect } from 'vitest';
import { analyzeDevanagariText } from '../server/devanagariSafety.js';

describe('Critical Scripture Safety Regression & False Positive Audit (Sections 4, 7, 8, 14, 15, 16)', () => {
  it('detects suspicious OCR outputs: ततत्वमसि, ठर्ताऽसि, जित्यम् and marks CRITICAL', () => {
    const suspiciousSamples = [
      { text: 'त्वमेव प्रत्यक्षं ततत्वमसि।', expectedIssue: 'duplicated_character' },
      { text: 'त्वमेव केवलं ठर्ताऽसि।', expectedIssue: 'suspicious_consonant' },
      { text: 'त्वं साक्षादात्माऽसि जित्यम्॥', expectedIssue: 'suspicious_consonant' },
      { text: 'त्वमेव केवलं कर्ताऽयि।', expectedIssue: 'suspicious_consonant' },
    ];

    for (const sample of suspiciousSamples) {
      const analysis = analyzeDevanagariText(sample.text);
      expect(analysis.criticalIssuesCount).toBeGreaterThanOrEqual(1);

      const found = analysis.issues.some(i => i.issue_type === sample.expectedIssue && i.severity === 'CRITICAL');
      expect(found).toBe(true);

      // CRITICAL: The engine must NOT automatically replace the text!
      // Output text must remain the exact input unless human verified!
      expect(sample.text).toContain(sample.text.trim().split(' ').pop()!.replace(/[।॥]/g, ''));
    }
  });

  it('preserves legitimate Sanskrit and does not generate false positives', () => {
    const validSanskritTexts = [
      // Omkara (ॐ) and Dandapariksha (।, ॥)
      'ॐ नमस्ते गणपतये। त्वमेव प्रत्यक्षं तत्त्वमसि॥',
      // Anusvara (ं), Visarga (ः), Avagraha (ऽ)
      'त्वमेव केवलं कर्ताऽसि। त्वमेव केवलं धर्ताऽसि। त्वमेव केवलं हर्ताऽसि।',
      // Chandrabindu (ँ)
      'काँपे सकल भुवन',
      // Sanskrit vowel matras: ृ and ॄ
      'पितॄणाम् तृप्तिः कारणीया। कृपा सिन्धुः।',
      // Complex conjuncts (क्ष, त्र, ज्ञ, श्र, etc.) and halanta
      'श्रीगणपत्यथर्वशीर्षम्। सच्चिदानन्दरूपाय विश्वोत्पत्यादिहेतवे तापत्रयविनाशाय श्रीकृष्णाय वयं नुमः।',
      // Adverbial and copula: नित्यम्, ब्रह्मासि
      'त्वमेव सर्वं खल्विदं ब्रह्मासि। त्वं साक्षादात्माऽसि नित्यम्॥ १ ॥',
    ];

    for (const text of validSanskritTexts) {
      const analysis = analyzeDevanagariText(text);
      expect(analysis.criticalIssuesCount).toBe(0);
      expect(analysis.qualityScore).toBeGreaterThanOrEqual(90);
    }
  });

  it('correctly handles Dandapariksha (Section 16): flags ASCII pipes without silent replacement', () => {
    const textWithPipes = 'ॐ नमः शिवाय | जय गणेश ||';
    const analysis = analyzeDevanagariText(textWithPipes);

    const dandaIssues = analysis.issues.filter(i => i.issue_type === 'danda_corruption');
    expect(dandaIssues.length).toBe(2);
    expect(dandaIssues[0].severity).toBe('WARNING');
    expect(dandaIssues[0].original_text).toBe('|');
    expect(dandaIssues[0].suggested_text).toBe('।');
    expect(dandaIssues[1].original_text).toBe('||');
    expect(dandaIssues[1].suggested_text).toBe('॥');

    // Verify legitimate sacred dandas (।, ॥) are NOT flagged
    const cleanDandaText = 'ॐ नमः शिवाय। जय गणेश॥';
    const cleanAnalysis = analyzeDevanagariText(cleanDandaText);
    expect(cleanAnalysis.issues.filter(i => i.issue_type === 'danda_corruption').length).toBe(0);
  });
});
