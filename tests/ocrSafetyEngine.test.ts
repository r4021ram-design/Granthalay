import { describe, it, expect } from 'vitest';
import { analyzeDevanagariText } from '../server/devanagariSafety.js';

describe('Devanagari Phonetic & Scriptural Safety Engine (Section 11 & Section 30)', () => {
  it('flags corrupted ASCII pipe symbols used as Dandapariksha', () => {
    const textWithPipes = 'ॐ नमः शिवाय | जय गणेश ||';
    const analysis = analyzeDevanagariText(textWithPipes);

    const dandaIssues = analysis.issues.filter(i => i.issue_type === 'danda_corruption');
    expect(dandaIssues.length).toBeGreaterThanOrEqual(2);
    expect(dandaIssues[0].suggested_text).toBe('।');
    expect(dandaIssues[1].suggested_text).toBe('॥');
  });

  it('detects accidental Latin characters inside Devanagari words', () => {
    const corruptedText = 'नमस्ते gणपतये';
    const analysis = analyzeDevanagariText(corruptedText);

    const latinIssues = analysis.issues.filter(i => i.issue_type === 'latin_character');
    expect(latinIssues.length).toBeGreaterThan(0);
    expect(latinIssues[0].severity).toBe('CRITICAL');
  });

  it('detects dangling matras without preceding consonant', () => {
    const danglingText = ' ाम नमस्ते';
    const analysis = analyzeDevanagariText(danglingText);

    const matraIssues = analysis.issues.filter(i => i.issue_type === 'missing_matra');
    expect(matraIssues.length).toBeGreaterThan(0);
    expect(matraIssues[0].severity).toBe('CRITICAL');
  });

  it('detects suspicious consonant confusions (e.g. ठर्ताऽसि, जित्यम्)', () => {
    const text = 'त्वमेव केवलं ठर्ताऽसि जित्यम्';
    const analysis = analyzeDevanagariText(text);

    const consonantIssues = analysis.issues.filter(i => i.issue_type === 'suspicious_consonant');
    expect(consonantIssues.length).toBeGreaterThanOrEqual(2);
    expect(consonantIssues[0].severity).toBe('CRITICAL');
  });

  it('accurately identifies Sanskrit vs Hindi advisory language', () => {
    const sanskritSample = 'ॐ नमस्ते गणपतये। त्वमेव प्रत्यक्षं तत्त्वमसि। त्वमेव केवलं कर्ताऽसि।';
    const hindiSample = 'भगवान गणेश की पूजा करने से सभी विघ्न दूर होते हैं और सुख की प्राप्ति होती है।';

    const sanskritAnalysis = analyzeDevanagariText(sanskritSample);
    const hindiAnalysis = analyzeDevanagariText(hindiSample);

    expect(sanskritAnalysis.advisoryLanguage).toBe('sa');
    expect(hindiAnalysis.advisoryLanguage).toBe('hi');
  });

  it('preserves clean text without false critical errors', () => {
    const cleanText = 'ॐ श्री गणेशाय नमः॥\nसच्चिदानन्दरूपाय विश्वोत्पत्यादिहेतवे।\nतापत्रयविनाशाय श्रीकृष्णाय वयं नुमः॥';
    const analysis = analyzeDevanagariText(cleanText);

    expect(analysis.criticalIssuesCount).toBe(0);
    expect(analysis.qualityScore).toBeGreaterThanOrEqual(90);
  });
});
