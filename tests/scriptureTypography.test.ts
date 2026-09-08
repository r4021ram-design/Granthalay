import { describe, it, expect } from 'vitest';
import {
  classifyScriptureLine,
  getScriptureBlockConfig,
  groupScriptureFolio,
} from '../src/utils/scriptureTypography.js';

describe('Scripture Typography & Classification Standard', () => {
  describe('classifyScriptureLine', () => {
    it('accurately identifies Vaidika Mantras by Svara accents or canonical incipits', () => {
      // With explicit Svara accents
      const accentedVedic = 'अ॒ग्निमी॑ळे पु॒रोहि॑तं य॒ज्ञस्य॑ दे॒वमृ॒त्विज॑म्';
      expect(classifyScriptureLine(accentedVedic)).toBe('VEDIC_MANTRA');

      // Canonical Shanti Path mantras (Rigveda & Yajurveda)
      const shantiMantra = 'द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिरापः शान्तिरोषधयः शान्तिः ।';
      expect(classifyScriptureLine(shantiMantra)).toBe('VEDIC_MANTRA');

      const swastiMantra = 'स्वस्ति न इन्द्रो वृद्धश्रवाः स्वस्ति नः पूषा विश्ववेदाः ।';
      expect(classifyScriptureLine(swastiMantra)).toBe('VEDIC_MANTRA');

      const bhadramMantra = 'भद्रं कर्णेभिः शृणुयाम देवा भद्रं पश्येमाक्षभिर्यजत्राः ।';
      expect(classifyScriptureLine(bhadramMantra)).toBe('VEDIC_MANTRA');
    });

    it('accurately identifies Pauranika Shlokas and Stotras', () => {
      const ganeshaDhyana = 'शुक्लाम्बरधरं देवं शशिवर्णं चतुर्भुजम् । प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये ॥';
      expect(classifyScriptureLine(ganeshaDhyana)).toBe('PAURANIK_SHLOKA');

      const dwadashaNama = 'सुमुखश्चैकदन्तश्च कपिलो गजकर्णकः । लम्बोदरश्च विकटो विघ्ननाशो विनायकः ॥';
      expect(classifyScriptureLine(dwadashaNama)).toBe('PAURANIK_SHLOKA');

      const stotraEnding = 'द्वादशैतानि नामानि यः पठेच्छृणुयादपि ॥';
      expect(classifyScriptureLine(stotraEnding)).toBe('PAURANIK_SHLOKA');
    });

    it('accurately identifies Devata Namavali items', () => {
      expect(classifyScriptureLine('१. ॐ श्रीमन्महागणाधिपतये नमः ।')).toBe('NAMAVALI');
      expect(classifyScriptureLine('६. ॐ वास्तुदेवताभ्यो नमः ।')).toBe('NAMAVALI');
      expect(classifyScriptureLine('१४. ॐ एतत्कर्मप्रधानदेवताभ्यो नमः ।')).toBe('NAMAVALI');
      expect(classifyScriptureLine('2. इष्ट देवताभ्यो नमः')).toBe('NAMAVALI');
    });

    it('accurately identifies Karmakanda Vidhi instructions', () => {
      const vidhi1 = '• ऊपर लिखे देवताओं का पंचोपचार या षोडशोपचार से पूजा करें ।';
      expect(classifyScriptureLine(vidhi1)).toBe('VIDHI_INSTRUCTION');

      const vidhi2 = 'एक मिट्टी के प्याले में चावल भर कर उसपर हल्दी से अष्टदल बनाकर रखें ।';
      expect(classifyScriptureLine(vidhi2)).toBe('VIDHI_INSTRUCTION');
    });

    it('accurately identifies Sacred Section Headings and Invocations', () => {
      expect(classifyScriptureLine('【 प्रधान देवता नमस्कार 】')).toBe('SECTION_HEADING');
      expect(classifyScriptureLine('【 शान्ति पाठः 】')).toBe('SECTION_HEADING');
      expect(classifyScriptureLine('॥ श्रीगणेशाय नमः ॥')).toBe('INVOCATION_HEADING');
    });
  });

  describe('groupScriptureFolio', () => {
    it('groups contiguous Namavali lines into a single namavali_grid unit', () => {
      const sampleFolio = [
        '【 प्रधान देवता नमस्कार 】',
        '१. ॐ श्रीमन्महागणाधिपतये नमः ।',
        '२. ॐ इष्टदेवताभ्यो नमः ।',
        '३. ॐ कुलदेवताभ्यो नमः ।',
        '४. ॐ ग्रामदेवताभ्यो नमः ।',
        '• सुमुखश्चैकदन्तश्च कपिलो गजकर्णकः ।',
      ].join('\n');

      const units = groupScriptureFolio(sampleFolio);
      expect(units.length).toBe(3);
      expect(units[0]).toEqual({ kind: 'single', line: '【 प्रधान देवता नमस्कार 】', type: 'SECTION_HEADING' });
      expect(units[1].kind).toBe('namavali_grid');
      if (units[1].kind === 'namavali_grid') {
        expect(units[1].items.length).toBe(4);
        expect(units[1].items[0]).toBe('१. ॐ श्रीमन्महागणाधिपतये नमः ।');
      }
      expect(units[2].kind).toBe('single');
      if (units[2].kind === 'single') {
        expect(units[2].type).toBe('PAURANIK_SHLOKA');
      }
    });
  });

  describe('getScriptureBlockConfig', () => {
    it('provides Tiro Sanskrit with loose leading for Vaidika Mantras', () => {
      const config = getScriptureBlockConfig('VEDIC_MANTRA');
      expect(config.fontFamily).toContain('Tiro Devanagari Sanskrit');
      expect(config.lineHeightClass).toContain('leading-[2.2]');
      expect(config.badgeLabel).toBe('वैदिक सस्वर मन्त्र');
    });

    it('provides Noto Serif for Pauranika Shlokas', () => {
      const config = getScriptureBlockConfig('PAURANIK_SHLOKA');
      expect(config.fontFamily).toContain('Noto Serif Devanagari');
      expect(config.lineHeightClass).toContain('leading-[1.8]');
      expect(config.badgeLabel).toBe('पौराणिक स्तोत्र / ध्यान');
    });

    it('provides Noto Sans for Vidhi Instructions', () => {
      const config = getScriptureBlockConfig('VIDHI_INSTRUCTION');
      expect(config.fontFamily).toContain('Noto Sans Devanagari');
      expect(config.badgeLabel).toBe('विधि निर्देश');
    });
  });
});
