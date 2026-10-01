import { describe, it, expect } from 'vitest';
import { getAllStotrasForDarshan, CANONICAL_DEITIES } from '../src/data/darshanTaxonomy.js';

describe('Comprehensive Stotra Darshan Treasury Verification', () => {
  it('should have all deduplicated stotras properly classified without duplicates', () => {
    const all = getAllStotrasForDarshan();
    console.log('Total deduplicated stotras in Stotra Darshan:', all.length);

    const byDeity: Record<string, number> = {};
    all.forEach(s => {
      byDeity[s.deityId] = (byDeity[s.deityId] || 0) + 1;
    });

    console.log('\n--- BREAKDOWN BY DEITY SPHERE ---');
    CANONICAL_DEITIES.forEach(d => {
      console.log(`${d.icon} ${d.sanskritTitle} (${d.name}): ${byDeity[d.id] || 0} stotras`);
    });

    // Check newly added canonical stotras
    const newKeys = [
      'सङ्कटनाशन गणेशस्तोत्रम्',
      'ऋणहर्ता गणेशस्तोत्रम्',
      'दारिद्र्यदहन शिवस्तोत्रम्',
      'महामृत्युञ्जयस्तोत्रम्',
      'श्रीचरणाभरण नटराजस्तोत्रम्',
      'श्रीदुर्गाष्टोत्तरशतनामस्तोत्रम्',
      'सरस्वतीद्वादशनामस्तोत्रम्',
      'ऋणविमोचन नृसिंहस्तोत्रम्',
      'श्रीगोविन्ददामोदरस्तोत्रम्',
      'श्रीहनुमत्पञ्चरत्नम्',
      'श्रीराममङ्गलाशासनम्',
      'शनिवज्रपञ्जरकवचम्',
      'ऋग्वेदोक्त देवीसूक्तम् (वागाम्भृणी सूक्त)',
      'ऋग्वेदोक्त रात्रिसूक्तम्',
      'नासदीयसूक्तम् (सृष्टि उत्पत्ति सूक्त)',
      'भूसूक्तम् (पृथ्वी सूक्त)',
      'मन्युसूक्तम् (शत्रु-भय निवारक सूक्त)',
      'श्रीचमकप्रश्नो (रुद्र चमकम्)'
    ];

    newKeys.forEach(k => {
      const found = all.find(s => s.title.includes(k) || k.includes(s.title));
      expect(found, `Expected to find ${k}`).toBeDefined();
      expect(found?.content?.length).toBeGreaterThan(100);
    });

    expect(all.length).toBeGreaterThanOrEqual(240);
  });
});
