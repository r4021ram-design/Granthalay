import { describe, it, expect } from 'vitest';
import { identifyVerseMeter, analyzePada, splitIntoPadas } from '../src/utils/chhandasEngine';
import { deriveChaturthiMantra, extractNamavaliFromStotra, normalizeToPratipadika } from '../src/utils/namavaliEngine';

describe('Sanskrit Chhandas (Prosody) Computational Engine', () => {
  it('correctly syllabifies and identifies Anushtubh (श्लोक) for Gita 1.1', () => {
    const gitaVerse = `धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।
मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय॥`;

    const report = identifyVerseMeter(gitaVerse);
    expect(report.isStandardMeter).toBe(true);
    expect(report.meterName).toBe('Anushtubh');
    expect(report.meterNameDevanagari).toContain('अनुष्टुप्');
    expect(report.totalPadas).toBe(4);

    // Each quarter must have exactly 8 syllables
    for (const pada of report.padas) {
      expect(pada.syllableCount).toBe(8);
    }
  });

  it('correctly identifies Anushtubh for Shukla Yajurveda Mangalacharana', () => {
    const shuklaVerse = `शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम्।
प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये॥`;

    const report = identifyVerseMeter(shuklaVerse);
    expect(report.meterName).toBe('Anushtubh');
    expect(report.confidence).toBeGreaterThanOrEqual(0.7);
  });

  it('correctly detects Laghu (।) and Guru (ऽ) weights based on Pingala rules', () => {
    // 'सत्यं वद' -> 'स' is followed by 'त्य' (conjunct), so 'स' is Guru (G). 'त्यं' has anusvara, so Guru (G).
    const pada = analyzePada('सत्यं वद');
    expect(pada.syllableCount).toBe(4); // स, त्यं, व, द -> 4 syllables
    expect(pada.weightString.length).toBe(4);
    // 'त्यं' is Guru because of Anusvara
    expect(pada.syllables[1].weight).toBe('G');
  });

  it('flags anomaly when an akshara is missing (OCR corruption)', () => {
    // 7 syllables in first pada instead of 8: 'धर्मक्षेत्रे कुरुक्षे' (Dropped 'त्रे')
    const corruptedVerse = `धर्मक्षेत्रे कुरुक्षे समवेता युयुत्सवः।
मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय॥`;

    const report = identifyVerseMeter(corruptedVerse);
    const hasDiagnostic = report.diagnostics.some(d => d.includes('७ अक्षर') || d.includes('अक्षर'));
    expect(hasDiagnostic).toBe(true);
  });

  it('safely and instantly parses complex pages with numbering and dots without hanging', () => {
    const pageWithNumbersAndDots = `1. गणेशग्यास
श्रीगणेशाय नमः ॥
आचम्य प्राणायामं कृत्वा
दक्षिणहस्ते वक्रतुण्डाय नमः ।
वामहस्ते शूर्पकर्णाय नमः ।
ओष्ठे विघ्ननाशाय नमः ।`;

    const report = identifyVerseMeter(pageWithNumbersAndDots);
    expect(report.totalPadas).toBeGreaterThan(0);
    expect(report.padas.length).toBeGreaterThan(0);
  });

  it('correctly classifies title, salutation, uvacha and identifies Anushtubh meter for Page 2 (गणेशकवचम्)', () => {
    const page2Sample = `गणेशकवचम्
श्रीगणेशाय नमः
गौरीरुवाच
एषोऽतिवीर्यो देवेशो गणाध्यक्षो विनायकः ।
अरे किं कर्म कुरुषे न जाने मुनिसत्तम ॥ १ ॥`;

    const report = identifyVerseMeter(page2Sample);
    
    // Line 1: Header (गणेशकवचम्)
    expect(report.padas[0].category).toBe('header');
    expect(report.padas[0].categoryLabel).toContain('शीर्षक');

    // Line 2: Invocation (श्रीगणेशाय नमः)
    expect(report.padas[1].category).toBe('invocation');
    expect(report.padas[1].categoryLabel).toContain('नमस्कारोक्ति');

    // Line 3: Speaker (गौरीरुवाच)
    expect(report.padas[2].category).toBe('uvacha');
    expect(report.padas[2].categoryLabel).toContain('वक्ता');

    // Verse padas must be split into 8-syllable Anushtubh quarters
    const versePadas = report.padas.filter(p => p.category === 'verse');
    expect(versePadas.length).toBe(4);
    expect(versePadas[0].rawText).toContain('एषोऽतिवीर्यो देवेशो');
    expect(versePadas[0].syllableCount).toBe(8);
    expect(versePadas[1].rawText).toContain('गणाध्यक्षो विनायकः');
    expect(versePadas[1].syllableCount).toBe(8);
    expect(versePadas[2].rawText).toContain('अरे किं कर्म कुरुषे');
    expect(versePadas[2].syllableCount).toBe(8);
    expect(versePadas[3].rawText).toContain('न जाने मुनिसत्तम');
    expect(versePadas[3].syllableCount).toBe(8);

    // Meter identification must be Anushtubh with high confidence
    expect(report.meterName).toBe('Anushtubh');
    expect(report.isStandardMeter).toBe(true);
    expect(report.confidence).toBeGreaterThanOrEqual(0.7);
  });

  it('correctly handles multi-meter page with Anushtubh stotra, fused halanta (दैत्यान्बाल्येऽपि), and Shardulavikridita Dhyanam', () => {
    const canonicalPage2 = `२. गणेशकवचम्
॥ श्रीगणेशाय नमः ॥
गौर्युवाच ॥
एषोऽतिचपलो दैत्यान्बाल्येऽपि नाशयत्यहो ।
अग्रे किं कर्म कर्तेति न जाने मुनिसत्तम ॥ १ ॥
दैत्या नानाविधा दुष्टाः साधुदेवद्रुहः खलाः ।
अतोऽस्य कंठे किंचित्त्वं रक्षार्थं बद्धुमर्हसि ॥ २ ॥
मुनिरुवाच ॥
ध्यायेत् सिंहगतं विनायकममुं दिग्बाहुमाद्ये युगे
त्रेतायां तु मयूरवाहनममुं षड्बाहुकं सिद्धिदम् ।
द्वापरे तु गजाननं युगभुजं रक्तांगरागं विभुं
तुर्ये तु द्विभुजं सितांगरुचिरं सर्वार्थदं सर्वदा ॥ ३ ॥
विनायकः शिखां पातु परमात्मा परात्परः ।
अतिसुन्दरकायस्तु मस्तकं सुमहोत्कटः ॥ ४ ॥`;

    const report = identifyVerseMeter(canonicalPage2);

    // Identifies Anushtubh as dominant meter
    expect(report.meterName).toBe('Anushtubh');
    expect(report.meterNameDevanagari).toContain('अनुष्टुप् (श्लोक) — प्रधान छन्द');
    expect(report.isStandardMeter).toBe(true);
    expect(report.confidence).toBeGreaterThanOrEqual(0.85);

    // Diagnostics explicitly mentions Shardulavikridita Dhyana shloka
    const mentionsShardula = report.diagnostics.some(d => d.includes('शार्दूलविक्रीडितम्'));
    expect(mentionsShardula).toBe(true);

    // Check fused halanta word was split into two 8-syllable padas
    const p1 = report.padas.find(p => p.rawText.includes('एषोऽतिचपलो दैत्यान्'));
    const p2 = report.padas.find(p => p.rawText.includes('बाल्येऽपि नाशयत्यहो'));
    expect(p1).toBeDefined();
    expect(p1?.syllableCount).toBe(8);
    expect(p1?.localMeter).toContain('अनुष्टुप्');
    expect(p2).toBeDefined();
    expect(p2?.syllableCount).toBe(8);
    expect(p2?.localMeter).toContain('अनुष्टुप्');

    // Dhyana shloka padas must be tagged as Shardulavikridita (19 syllables)
    const dhyanaPada = report.padas.find(p => p.rawText.includes('ध्यायेत् सिंहगतं'));
    expect(dhyanaPada).toBeDefined();
    expect(dhyanaPada?.syllableCount).toBe(19);
    expect(dhyanaPada?.localMeter).toContain('शार्दूलविक्रीडितम्');
  });
});

describe('Namavali & Archana Extraction Engine', () => {
  it('correctly inflects masculine nominal stems to Chaturthi singular', () => {
    expect(deriveChaturthiMantra('राम', 'm').mantra).toBe('ॐ रामाय नमः।');
    expect(deriveChaturthiMantra('शिव', 'm').mantra).toBe('ॐ शिवाय नमः।');
    expect(deriveChaturthiMantra('हरि', 'm').mantra).toBe('ॐ हरये नमः।');
    expect(deriveChaturthiMantra('विष्णु', 'm').mantra).toBe('ॐ विष्णवे नमः।');
    expect(deriveChaturthiMantra('शम्भु', 'm').mantra).toBe('ॐ शम्भवे नमः।');
    expect(deriveChaturthiMantra('धातृ', 'm').mantra).toBe('ॐ धात्रे नमः।');
  });

  it('correctly inflects feminine nominal stems to Chaturthi singular', () => {
    expect(deriveChaturthiMantra('दुर्गा', 'f').mantra).toBe('ॐ दुर्गायै नमः।');
    expect(deriveChaturthiMantra('उमा', 'f').mantra).toBe('ॐ उमायै नमः।');
    expect(deriveChaturthiMantra('लक्ष्मी', 'f').mantra).toBe('ॐ लक्ष्म्यै नमः।');
    expect(deriveChaturthiMantra('गौरी', 'f').mantra).toBe('ॐ गौर्यै नमः।');
    expect(deriveChaturthiMantra('पार्वती', 'f').mantra).toBe('ॐ पार्वत्यै नमः।');
  });

  it('handles canonical Vedic and Pāṇinian special rules', () => {
    // 'विश्व' is Sarvanama -> 'विश्वस्मै' (न कि विश्वाय)
    expect(deriveChaturthiMantra('विश्व', 'm').mantra).toBe('ॐ विश्वस्मै नमः।');
    expect(deriveChaturthiMantra('सर्व', 'm').mantra).toBe('ॐ सर्वस्मै नमः।');

    // मत्/वत् stems -> भगवते, हनुमते
    expect(deriveChaturthiMantra('भगवत्', 'm').mantra).toBe('ॐ भगवते नमः।');
    expect(deriveChaturthiMantra('हनुमत्', 'm').mantra).toBe('ॐ हनुमते नमः।');

    // इन्-प्रत्ययान्त -> शार्ङ्गिणे, चक्रिणे, योगिने
    expect(deriveChaturthiMantra('शार्ङ्गिन्', 'm').mantra).toBe('ॐ शार्ङ्गिणे नमः।');
    expect(deriveChaturthiMantra('योगिन्', 'm').mantra).toBe('ॐ योगिने नमः।');

    // अस्-अन्त -> वेधसे, चन्द्रमसे
    expect(deriveChaturthiMantra('वेधस्', 'm').mantra).toBe('ॐ वेधसे नमः।');
  });

  it('normalizes surface words with Visarga or Anusvara to base stems', () => {
    expect(normalizeToPratipadika('रामः')).toBe('राम');
    expect(normalizeToPratipadika('विष्णुः')).toBe('विष्णु');
    expect(normalizeToPratipadika('शङ्करम्')).toBe('शङ्कर');
    expect(normalizeToPratipadika('शिवं')).toBe('शिव');
  });

  it('extracts candidate namavali from Stotra verses while filtering stopwords', () => {
    const stotraSample = `विश्वं विष्णुर्वषट्कारो भूतभव्यभवत्प्रभुः।
भूतकृद्भूतभृद्भावो भूतात्मा भूतभावनः॥`;

    const entries = extractNamavaliFromStotra(stotraSample, 'm');
    expect(entries.length).toBeGreaterThanOrEqual(4);
    
    const mantras = entries.map(e => e.mantra);
    expect(mantras).toContain('ॐ विश्वस्मै नमः।');
    expect(mantras).toContain('ॐ विष्णवे नमः।');
    expect(mantras).toContain('ॐ वषट्काराय नमः।');
  });
});
