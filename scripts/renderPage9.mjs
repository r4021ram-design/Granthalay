import fs from 'fs';
import path from 'path';
import { createCanvas } from '@napi-rs/canvas';

const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js');

async function renderPage9() {
  const filePath = 'Docs/Brihat Stotra Ratnakar Illustrated - Khemraj Publishers.pdf';
  const pdfBytes = fs.readFileSync(filePath);

  const canvasFactory = {
    create(w, h) {
      const c = createCanvas(w, h);
      return { canvas: c, context: c.getContext('2d') };
    },
    reset(c, w, h) {
      c.canvas.width = w;
      c.canvas.height = h;
    },
    destroy(c) {
      c.canvas = null;
      c.context = null;
    }
  };

  const doc = await pdfjs.getDocument({
    data: new Uint8Array(pdfBytes),
    canvasFactory,
    useSystemFonts: true,
    disableFontFace: false,
  }).promise;

  const page = await doc.getPage(9);
  const viewport = page.getViewport({ scale: 2.5 });
  const width = Math.floor(viewport.width);
  const height = Math.floor(viewport.height);
  const { canvas, context } = canvasFactory.create(width, height);

  await page.render({
    canvasContext: context,
    viewport,
    canvasFactory,
  }).promise;

  const imgBuf = canvas.toBuffer('image/png');
  fs.writeFileSync('storage/page9_highres.png', imgBuf);
  console.log('Saved storage/page9_highres.png successfully!');
}

renderPage9().catch(console.error);
