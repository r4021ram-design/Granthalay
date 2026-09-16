import { describe, it, expect } from 'vitest';
import {
  BRIHAT_CATEGORIES,
  BRIHAT_STOTRAS,
  BRIHAT_TOTAL_PAGES
} from '../src/data/brihatStotraRatnakarIndex.js';
import Database from 'better-sqlite3';
import fs from 'fs';

describe('बृहत्स्तोत्ररत्नाकरः (सचित्र २२४ स्तोत्र संग्रह) — Liturgical Index & Folio Taxonomy', () => {
  it('contains exactly 224 canonical stotras', () => {
    expect(BRIHAT_STOTRAS.length).toBe(224);
  });

  it('has sequential stotra numbers from 1 to 224 without gaps or duplicates', () => {
    const numbers = BRIHAT_STOTRAS.map(s => s.stotraNumber);
    const uniqueNumbers = new Set(numbers);
    expect(uniqueNumbers.size).toBe(224);
    for (let i = 1; i <= 224; i++) {
      expect(uniqueNumbers.has(i)).toBe(true);
    }
  });

  it('has valid page mappings within the 284-page volume', () => {
    expect(BRIHAT_TOTAL_PAGES).toBe(284);
    for (const stotra of BRIHAT_STOTRAS) {
      expect(stotra.bookPage).toBeGreaterThanOrEqual(7);
      expect(stotra.bookPage).toBeLessThanOrEqual(290);
      expect(stotra.pdfPage).toBeGreaterThanOrEqual(1);
      expect(stotra.pdfPage).toBeLessThanOrEqual(BRIHAT_TOTAL_PAGES);
    }
  });

  it('covers all 13 canonical liturgical categories with matching counts', () => {
    // 13 specific categories (excluding 'all')
    const specificCategories = BRIHAT_CATEGORIES.filter(c => c.id !== 'all');
    expect(specificCategories.length).toBe(13);

    const categorySum = specificCategories.reduce((acc, c) => acc + c.count, 0);
    expect(categorySum).toBe(224);

    for (const cat of specificCategories) {
      const actualCount = BRIHAT_STOTRAS.filter(s => s.category === cat.id).length;
      expect(actualCount).toBe(cat.count);
    }
  });

  it('verifies famous key stotras are precisely mapped to their historical folios', () => {
    // 1. Ganesh Kavach (Book page 8, Folio 2)
    const ganeshKavach = BRIHAT_STOTRAS.find(s => s.stotraNumber === 2);
    expect(ganeshKavach?.title).toBe('गणेशकवचम्');
    expect(ganeshKavach?.bookPage).toBe(8);
    expect(ganeshKavach?.pdfPage).toBe(2);

    // 2. Shiva Mahimna (Book page 76, Folio 70)
    const shivaMahimna = BRIHAT_STOTRAS.find(s => s.stotraNumber === 41);
    expect(shivaMahimna?.title).toBe('शिवमहिम्नः स्तोत्रम्');
    expect(shivaMahimna?.bookPage).toBe(76);

    // 3. Ramaraksha (Book page 185, Folio 179)
    const ramaraksha = BRIHAT_STOTRAS.find(s => s.stotraNumber === 122);
    expect(ramaraksha?.title).toContain('रामरक्षास्तोत्रम्');
    expect(ramaraksha?.bookPage).toBe(185);

    // 4. Damodarashtaka (Book page 223, Folio 217)
    const damodara = BRIHAT_STOTRAS.find(s => s.stotraNumber === 158);
    expect(damodara?.title).toContain('दामोदरस्तोत्रम्');
    expect(damodara?.bookPage).toBe(223);

    // 5. Charpat Panjarika / Bhaja Govindam (Book page 245, Folio 239)
    const bhajaGovindam = BRIHAT_STOTRAS.find(s => s.stotraNumber === 183);
    expect(bhajaGovindam?.title).toContain('चर्पटपञ्जरिका');
    expect(bhajaGovindam?.bookPage).toBe(245);
  });

  it('verifies SQLite DB registration and page integrity', () => {
    if (!fs.existsSync('storage/granth.db')) return;
    const db = new Database('storage/granth.db');
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get('granth-brihat-stotra-ratnakar') as any;
    expect(book).toBeDefined();
    expect(book.title).toContain('बृहत्स्तोत्ररत्नाकरः');
    expect(book.page_count).toBe(284);

    const pages = db.prepare('SELECT count(*) as c FROM pages WHERE book_id = ?').get('granth-brihat-stotra-ratnakar') as any;
    expect(pages.c).toBe(284);
  });
});
