import { describe, it, expect } from 'vitest';
import {
  GANESH_PUJAN_TOPICS,
  GANESH_PUJAN_FOLIOS
} from '../src/data/ganeshPujanIndex.js';
import { GITA_SECTIONS } from '../src/data/bhagavadGitaIndex.js';
import { VSN_SECTIONS } from '../src/data/vishnuSahasranamaIndex.js';

describe('Liturgical Index Integrity & Scripture Isolation', () => {
  it('should define the 11 canonical topics for Sri Ganesh Pujan Paddhati', () => {
    expect(GANESH_PUJAN_TOPICS).toHaveLength(11);

    // Verify key liturgical milestones
    const topicTitles = GANESH_PUJAN_TOPICS.map(t => t.titleHi);
    expect(topicTitles).toContain('गणेश मंत्र एवं गायत्री');
    expect(topicTitles).toContain('कलश पूजनम्');
    expect(topicTitles).toContain('षोडश मातृका पूजनम्');
    expect(topicTitles).toContain('नवग्रह मण्डल पूजनम्');
    expect(topicTitles).toContain('गणेश षोडशोपचार पूजन');
    expect(topicTitles).toContain('श्री गणेश जी की आरती');
    expect(topicTitles).toContain('अष्टविनायक अवतार पद');
    expect(topicTitles).toContain('पञ्चश्लोकी गणेश स्तुति');
    expect(topicTitles).toContain('संकटनाशन गणेश स्तोत्रम्');
    expect(topicTitles).toContain('गणपत्यथर्वशीर्ष स्तोत्रम्');
    expect(topicTitles).toContain('गणेश अष्टोत्तरशत नामावली');
  });

  it('should define all 24 folios for Sri Ganesh Pujan Paddhati within valid page range', () => {
    expect(GANESH_PUJAN_FOLIOS).toHaveLength(24);
    GANESH_PUJAN_FOLIOS.forEach((folio, index) => {
      expect(folio.pageNumber).toBe(index + 1);
      expect(folio.title).toBeTruthy();
      expect(folio.badge).toBeTruthy();
      expect(folio.category).toBeTruthy();
    });
  });

  it('should enforce strict identity isolation across scripture types', () => {
    const isGitaBook = (book: { id: string; title: string }) =>
      Boolean(book.id === 'granth-bhagavad-gita' || (book.title.includes('गीता') && !book.title.includes('सहस्रनाम')));

    const isVsnBook = (book: { id: string; title: string }) =>
      Boolean(book.id.includes('sahasranama') || book.title.includes('सहस्रनाम'));

    const isGaneshPujanBook = (book: { id: string; title: string }) =>
      Boolean(book.id === 'granth-ganesh-pujan-paddhati' || (book.title.includes('गणेश') && book.title.includes('पूजन')));

    // 1. Ganesh Pujan Paddhati test
    const ganeshBook = {
      id: 'granth-ganesh-pujan-paddhati',
      title: 'श्री गणेश पूजन पद्धति'
    };
    expect(isGaneshPujanBook(ganeshBook)).toBe(true);
    expect(isGitaBook(ganeshBook)).toBe(false);
    expect(isVsnBook(ganeshBook)).toBe(false);

    // 2. Srimad Bhagavad Gita test
    const gitaBook = {
      id: 'granth-bhagavad-gita',
      title: 'श्रीमद्भगवद्गीता'
    };
    expect(isGitaBook(gitaBook)).toBe(true);
    expect(isGaneshPujanBook(gitaBook)).toBe(false);
    expect(isVsnBook(gitaBook)).toBe(false);

    // 3. Vishnu Sahasranama test
    const vsnBook = {
      id: 'granth-vishnu-sahasranama-gita-press',
      title: 'श्रीविष्णुसहस्रनामस्तोत्रम् (हिन्दी-अनुवाद-सहित)'
    };
    expect(isVsnBook(vsnBook)).toBe(true);
    expect(isGitaBook(vsnBook)).toBe(false);
    expect(isGaneshPujanBook(vsnBook)).toBe(false);

    // 4. Other General Scriptures test (Vastu Shanti, Rudri, Atharvashirsha)
    const vastuBook = {
      id: 'granth-vastu-shanti-grihapravesha',
      title: 'वास्तु शान्ति, गृहप्रवेश एवं नींव पूजन पद्धति'
    };
    expect(isGaneshPujanBook(vastuBook)).toBe(false);
    expect(isGitaBook(vastuBook)).toBe(false);
    expect(isVsnBook(vastuBook)).toBe(false);

    const rudriBook = {
      id: 'granth-rudri',
      title: 'श्रीरुद्राष्टाध्यायी - रुद्राभिषेक मन्त्र'
    };
    expect(isGaneshPujanBook(rudriBook)).toBe(false);
    expect(isGitaBook(rudriBook)).toBe(false);
    expect(isVsnBook(rudriBook)).toBe(false);
  });

  it('should ensure distinct section titles do not cross-contaminate across scriptures', () => {
    const gitaTitles = new Set(GITA_SECTIONS.map(s => s.titleHi));
    const vsnTitles = new Set(VSN_SECTIONS.map(s => s.titleHi));
    const ganeshTitles = new Set(GANESH_PUJAN_TOPICS.map(s => s.titleHi));

    // Gita and VSN titles must have 0 overlap
    for (const title of gitaTitles) {
      expect(vsnTitles.has(title)).toBe(false);
      expect(ganeshTitles.has(title)).toBe(false);
    }
    // VSN and Ganesh titles must have 0 overlap
    for (const title of vsnTitles) {
      expect(ganeshTitles.has(title)).toBe(false);
    }
  });
});
