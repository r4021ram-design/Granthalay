import { describe, it, expect } from 'vitest';
import { healShriVidyaText } from '../server/shriVidyaHealing.js';

describe('Sri Vidya Tantra Bija Healing Engine', () => {
  it('corrects corrupted Maya Bija (ह्रीं)', () => {
    expect(healShriVidyaText('ॐ ऐं ह़ीं क्लीं')).toBe('ॐ ऐं ह्रीं क्लीं');
    expect(healShriVidyaText('महाविपुरसुन्दरी ह्ी नमः')).toBe('महात्रिपुरसुन्दरी ह्रीं नमः');
  });

  it('corrects corrupted Lakshmi and Kamaraja Bijas (श्रीं, क्लीं)', () => {
    expect(healShriVidyaText('ॐ श़्रीं कलीं सौ:')).toBe('ॐ श्रीं क्लीं सौः');
  });

  it('heals Panchadashi Kutas', () => {
    const rawPanchadashi = 'क ए ई ल ही ह स क ह ल ही स क ल ही';
    const healed = healShriVidyaText(rawPanchadashi);
    expect(healed).toBe('क ए ई ल ह्रीं ह स क ह ल ह्रीं स क ल ह्रीं');
  });

  it('heals Anandabhairava and Navarna formulas', () => {
    expect(healShriVidyaText('हसक्षमलवरयूं नमः')).toBe('हसक्षमलवरयूँ नमः');
    expect(healShriVidyaText('सहक्षमलवरयिं नमः')).toBe('सहक्षमलवरयीं नमः');
  });

  it('heals divine names of Sri Chakra enclosures and deities', () => {
    expect(healShriVidyaText('त्रैलोक्य मोहन चक्र')).toBe('त्रैलोक्यमोहन चक्र');
    expect(healShriVidyaText('कामेश्र्वरी कामेश्र्वर')).toBe('कामेश्वरी कामेश्वर');
    expect(healShriVidyaText('सर्व संक्षोभण चक्र')).toBe('सर्वसंक्षोभण चक्र');
  });

  it('strips header page numbers and publisher noise cleanly', () => {
    const rawFolio = '(६६)\nश्रीविद्यार्णव तंत्रम्\nयो ब्रह्मा स हरिः प्रोक्तो वो हरिः स महेश्वरः।\nअर्थात जो ब्रह्मा हैं वही हरि हैं।';
    const healed = healShriVidyaText(rawFolio);
    expect(healed).not.toContain('(६६)');
    expect(healed).not.toContain('श्रीविद्यार्णव तंत्रम्');
    expect(healed).toContain('अर्थात्');
  });
});
