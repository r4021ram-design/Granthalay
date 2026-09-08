import { describe, it, expect } from 'vitest';
import {
  isSankalpaText,
  parseSankalpa,
  isViniyogaText,
  parseViniyoga,
  isNyasaText,
  parseNyasa,
  isUpacharaText,
  parseUpachara,
  isVidhiInstruction,
  parseKarmakandaSegment,
  PANCHOPOCHARA_MATRIX,
  SHODASHOPOCHARA_MATRIX,
  RAJOPOCHARA_ITEMS,
  VISHESHOPOCHARA_ITEMS,
} from '../src/utils/karmakandaParser';

describe('Karmakanda Liturgical Parser & Structural Engine', () => {
  // 1. सङ्कल्प विज्ञान (Anatomy of Sankalpa)
  describe('Sankalpa Anatomy', () => {
    const canonicalSankalpa = `
      ॐ तत्सत्। अद्य ब्रह्मणो द्वितीये परार्धे, श्वेतवाराहकल्पे, वैवस्वतमन्वन्तरे, अष्टाविंशतितमे कलियुगे, कलिप्रथमचरणे,
      जम्बूद्वीपे, भारतवर्षे, आर्यावर्तैकदेशे, काशी नगरे, आनन्दवनक्षेत्रे,
      क्रोधी नाम संवत्सरे, उत्तरायणे, वसन्त ऋतौ, चैत्र मासे, शुक्ल पक्षे, पञ्चमी तिथौ, भानु वासरे,
      काश्यप गोत्रोत्पन्नः रामशर्मा यजमानः,
      मम सकल-दुरित-क्षयपूर्वकम्, धर्मार्थकाममोक्ष-सिद्धये, श्रीगणेश प्रीत्यर्थम् पूजनमहं करिष्ये।
      दाहिने हाथ में जल, गन्ध, अक्षत, पुष्प और दक्षिणा लेकर ताम्रपात्र में छोड़ें।
    `;

    it('should accurately detect Sankalpa text', () => {
      expect(isSankalpaText(canonicalSankalpa)).toBe(true);
      expect(isSankalpaText('ॐ नमः शिवाय')).toBe(false);
    });

    it('should parse temporal, spatial, panchang, and doer variables', () => {
      const parsed = parseSankalpa(canonicalSankalpa);
      expect(parsed.temporal).toContain('द्वितीये परार्धे');
      expect(parsed.temporal).toContain('श्वेतवाराह कल्प');
      expect(parsed.temporal).toContain('वैवस्वत मन्वन्तर');

      expect(parsed.spatial).toContain('जम्बूद्वीप');
      expect(parsed.spatial).toContain('भारतवर्ष');

      expect(parsed.panchanga?.samvatsara).toBe('क्रोधी');
      expect(parsed.panchanga?.ayana).toBe('उत्तरायणे');
      expect(parsed.panchanga?.ritu).toBe('वसन्त');
      expect(parsed.panchanga?.masa).toBe('चैत्र');
      expect(parsed.panchanga?.paksha).toBe('शुक्ल');
      expect(parsed.panchanga?.tithi).toBe('पञ्चमी');
      expect(parsed.panchanga?.vara).toBe('भानु');

      expect(parsed.doer?.gotra).toContain('काश्यप');
      expect(parsed.doer?.name).toBe('राम');

      expect(parsed.resolution).toContain('करिष्ये');
      expect(parsed.actionInstruction).toContain('जल');
      expect(parsed.variables.length).toBeGreaterThanOrEqual(4);
    });
  });

  // २. विनियोग विज्ञान (Anatomy of Viniyoga)
  describe('Viniyoga Anatomy', () => {
    const canonicalViniyoga = `
      अस्य श्रीमहागणपति मन्त्रस्य भृगु ऋषिः, अनुष्टुप् छन्दः, महागणपतिर्देवता,
      गं बीजं, शक्तिः स्वाहा, कीलकं वक्रतुण्डाय, मम सकल विघ्न निवारणार्थे जपे विनियोगः।
    `;

    it('should detect Viniyoga text', () => {
      expect(isViniyogaText(canonicalViniyoga)).toBe(true);
      expect(isViniyogaText('गजाननं भूतगणादिसेवितम्')).toBe(false);
    });

    it('should parse 5 primary components with anatomical touch points', () => {
      const parsed = parseViniyoga(canonicalViniyoga);
      expect(parsed.components.length).toBeGreaterThanOrEqual(5);

      const rishi = parsed.components.find(c => c.label.includes('ऋषि'));
      expect(rishi).toBeDefined();
      expect(rishi?.touchPoint).toContain('शिरसि');

      const chhandas = parsed.components.find(c => c.label.includes('छन्द'));
      expect(chhandas).toBeDefined();
      expect(chhandas?.name).toBe('अनुष्टुप्');
      expect(chhandas?.touchPoint).toContain('मुखे');

      const devata = parsed.components.find(c => c.label.includes('देवता'));
      expect(devata).toBeDefined();
      expect(devata?.touchPoint).toContain('हृदये');

      const prayojana = parsed.components.find(c => c.label.includes('विनियोग'));
      expect(prayojana).toBeDefined();
      expect(prayojana?.touchPoint).toContain('जल-त्याग');
    });
  });

  // ३. न्यास विधान (Anatomy of Nyasa)
  describe('Nyasa Anatomy', () => {
    const karanyasaText = `
      ॐ ह्रां अङ्गुष्ठाभ्यां नमः।
      ॐ ह्रीं तर्जनीभ्यां नमः।
      ॐ ह्रूं मध्यमाभ्यां नमः।
      ॐ ह्रैं अनामिकाभ्यां नमः।
      ॐ ह्रौं कनिष्ठिकाभ्यां नमः।
      ॐ ह्रः करतलकरपृष्ठाभ्यां नमः।
    `;

    const shadanganyasaText = `
      ॐ ह्रां हृदयाय नमः।
      ॐ ह्रीं शिरसे स्वाहा।
      ॐ ह्रूं शिखायै वषट्।
      ॐ ह्रैं कवचाय हुम्।
      ॐ ह्रौं नेत्रत्रयाय वौषट्।
      ॐ ह्रः अस्त्राय फट्।
    `;

    it('should detect Karanyasa and Shadanganyasa texts', () => {
      expect(isNyasaText(karanyasaText)).toBe(true);
      expect(isNyasaText(shadanganyasaText)).toBe(true);
      expect(isNyasaText('वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ')).toBe(false);
    });

    it('should parse Karanyasa steps with finger instructions', () => {
      const parsed = parseNyasa(karanyasaText);
      expect(parsed.nyasaType).toBe('karanyasa');
      expect(parsed.steps.length).toBe(6);
      expect(parsed.steps[0].angam).toContain('अङ्गुष्ठ');
      expect(parsed.steps[0].gestureTarget).toContain('अँगूठे');
      expect(parsed.steps[5].angam).toContain('करतल');
    });

    it('should parse Shadanganyasa steps with body protection targets', () => {
      const parsed = parseNyasa(shadanganyasaText);
      expect(parsed.nyasaType).toBe('shadanganyasa');
      expect(parsed.steps.length).toBe(6);
      expect(parsed.steps[0].gestureTarget).toContain('हृदय');
      expect(parsed.steps[1].gestureTarget).toContain('सिर');
      expect(parsed.steps[5].angam).toContain('अस्त्र');
      expect(parsed.steps[5].gestureTarget).toContain('तालिका');
    });
  });

  // ४. उपचार चक्र (Panchopachara, Shodashopachara, Rajopachara, Visheshopachara)
  describe('Upachara Matrix', () => {
    it('should verify Panchopachara 5 Mahabhutas', () => {
      expect(PANCHOPOCHARA_MATRIX.length).toBe(6);
      expect(PANCHOPOCHARA_MATRIX[0].bija).toBe('लं');
      expect(PANCHOPOCHARA_MATRIX[0].tattva).toBe('पृथ्वी तत्त्व');
      expect(PANCHOPOCHARA_MATRIX[1].bija).toBe('हं');
      expect(PANCHOPOCHARA_MATRIX[2].bija).toBe('यं');
      expect(PANCHOPOCHARA_MATRIX[3].bija).toBe('रं');
      expect(PANCHOPOCHARA_MATRIX[4].bija).toBe('वं');
    });

    it('should verify Shodashopachara 16 offerings', () => {
      expect(SHODASHOPOCHARA_MATRIX.length).toBe(16);
      expect(SHODASHOPOCHARA_MATRIX[0].name).toBe('आवाहनम्');
      expect(SHODASHOPOCHARA_MATRIX[15].name).toContain('क्षमा');
    });

    it('should verify Rajopachara offerings', () => {
      expect(RAJOPOCHARA_ITEMS.length).toBeGreaterThanOrEqual(8);
      const chhatra = RAJOPOCHARA_ITEMS.find(r => r.key === 'छत्र');
      expect(chhatra).toBeDefined();
      expect(chhatra?.icon).toBe('☂️');
    });

    it('should verify Visheshopachara offerings', () => {
      expect(VISHESHOPOCHARA_ITEMS.length).toBeGreaterThanOrEqual(6);
      const madhu = VISHESHOPOCHARA_ITEMS.find(v => v.key === 'मधुपर्क');
      expect(madhu).toBeDefined();
      expect(madhu?.icon).toBe('🍯');
    });

    it('should parse Panchopachara line accurately', () => {
      const line = 'लं पृथिव्यात्मने गन्धं समर्पयामि।';
      expect(isUpacharaText(line)).toBe(true);
      const items = parseUpachara(line);
      expect(items.length).toBeGreaterThanOrEqual(1);
      expect(items[0].bija).toBe('लं');
      expect(items[0].name).toContain('गन्ध');
    });

    it('should parse Rajopachara line accurately', () => {
      const line = 'ॐ चामरयुगलं समर्पयामि, छत्रं समर्पयामि।';
      expect(isUpacharaText(line)).toBe(true);
      const items = parseUpachara(line);
      expect(items.some(i => i.tier === 'rajopachara')).toBe(true);
    });
  });

  // ५. विधि-निर्देश भाषाई संकेत
  describe('Vidhi Instruction Signatures', () => {
    it('should detect priest action instructions', () => {
      expect(isVidhiInstruction('दाहिने हाथ में जल लेकर ताम्रपात्र में छोड़ें।')).toBe(true);
      expect(isVidhiInstruction('अनामिका अँगुली से चन्दन का तिलक लगावें।')).toBe(true);
      expect(isVidhiInstruction('घण्टा बजाते हुए धूप दिखावें।')).toBe(true);
      expect(isVidhiInstruction('साष्टाङ्ग दण्डवत् प्रणाम करें।')).toBe(true);
      expect(isVidhiInstruction('ॐ नमो भगवते वासुदेवाय')).toBe(false);
    });
  });

  // ६. सेग्मेंट डिस्पैचर
  describe('Segment Classifier', () => {
    it('should classify various liturgical segments correctly', () => {
      const s1 = parseKarmakandaSegment('अद्य ब्रह्मणो द्वितीये परार्धे... पूजनमहं करिष्ये');
      expect(s1.type).toBe('SANKALPA');

      const s2 = parseKarmakandaSegment('अस्य श्रीमहागणपति मन्त्रस्य भृगु ऋषिः... विनियोगः');
      expect(s2.type).toBe('VINIYOGA');

      const s3 = parseKarmakandaSegment('ॐ ह्रां अङ्गुष्ठाभ्यां नमः। ॐ ह्रीं तर्जनीभ्यां नमः।');
      expect(s3.type).toBe('NYASA');

      const s4 = parseKarmakandaSegment('लं पृथिव्यात्मने गन्धं समर्पयामि');
      expect(s4.type).toBe('PANCHOPOCHARA');

      const s5 = parseKarmakandaSegment('हाथ में अक्षत लेकर देवता के चरणों में छोड़ें।');
      expect(s5.type).toBe('VIDHI_INSTRUCTION');
    });
  });
});
