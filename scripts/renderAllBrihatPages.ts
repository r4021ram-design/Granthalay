import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import sharp from 'sharp';
import { createCanvas } from '@napi-rs/canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const TARGET_DIR = path.resolve(ROOT_DIR, 'storage/pages/granth-brihat-stotra-ratnakar');
const TARGET_PDF = path.resolve(TARGET_DIR, 'granth-brihat-stotra-ratnakar.pdf');
const DB_PATH = path.resolve(ROOT_DIR, 'storage/granth.db');

async function renderAll() {
  console.log('Loading PDF for rendering remaining folios...');
  const pdfBytes = fs.readFileSync(TARGET_PDF);
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js');

  const canvasFactory = {
    create(w: number, h: number) {
      const c = createCanvas(w, h);
      return { canvas: c, context: c.getContext('2d') };
    },
    reset(c: any, w: number, h: number) {
      c.canvas.width = w;
      c.canvas.height = h;
    },
    destroy(c: any) {
      c.canvas = null;
      c.context = null;
    }
  };

  const loadingTask = (pdfjs as any).getDocument({
    data: new Uint8Array(pdfBytes),
    canvasFactory,
    useSystemFonts: true,
    disableFontFace: false,
  });

  const doc = await loadingTask.promise;
  const totalPages = doc.numPages;
  console.log(`Document loaded. Total pages: ${totalPages}`);

  const db = new Database(DB_PATH);
  const updatePagePath = db.prepare(`
    UPDATE pages 
    SET original_image_path = ?, preprocessed_image_path = ?, width = ?, height = ?
    WHERE book_id = 'granth-brihat-stotra-ratnakar' AND page_number = ?
  `);

  const scale = 1.0;
  for (let p = 1; p <= totalPages; p++) {
    const outPngPath = path.join(TARGET_DIR, `page-${p}.png`);
    if (fs.existsSync(outPngPath)) {
      continue;
    }

    const page = await doc.getPage(p);
    const viewport = page.getViewport({ scale });
    const width = Math.floor(viewport.width);
    const height = Math.floor(viewport.height);

    const { canvas, context } = canvasFactory.create(width, height);
    await page.render({
      canvasContext: context,
      viewport,
      canvasFactory,
    }).promise;

    await sharp(canvas.toBuffer('image/png')).png().toFile(outPngPath);
    const relPath = `/storage/pages/granth-brihat-stotra-ratnakar/page-${p}.png`;
    updatePagePath.run(relPath, relPath, width, height, p);

    if (p % 20 === 0 || p === totalPages) {
      console.log(`Rendered page ${p} / ${totalPages}`);
    }
  }

  // Update public/data/books/granth-brihat-stotra-ratnakar.json
  const allPages = db.prepare("SELECT * FROM pages WHERE book_id = 'granth-brihat-stotra-ratnakar' ORDER BY page_number ASC").all();
  const book = db.prepare("SELECT * FROM books WHERE id = 'granth-brihat-stotra-ratnakar'").get();
  const jsonPath = path.resolve(ROOT_DIR, 'public/data/books/granth-brihat-stotra-ratnakar.json');
  fs.writeFileSync(jsonPath, JSON.stringify({ book, pages: allPages }, null, 2));

  console.log('Successfully completed all Brihat Stotra Ratnakar folios rendering & sync!');
}

renderAll().catch(err => {
  console.error('Error rendering folios:', err);
  process.exit(1);
});
