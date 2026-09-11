import fs from 'fs';
import path from 'path';
import { createCanvas } from '@napi-rs/canvas';
import { createWorker } from 'tesseract.js';

const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js');

async function extractFullIndex() {
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

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(pdfBytes),
    canvasFactory,
    useSystemFonts: true,
    disableFontFace: false,
  });
  const doc = await loadingTask.promise;

  const worker = await createWorker(['san', 'hin'], 1, {
    cachePath: path.resolve('storage/tessdata'),
  });

  const indexTexts = {};
  for (const pNum of [5, 6, 7, 8]) {
    const page = await doc.getPage(pNum);
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
    const ocrResult = await worker.recognize(imgBuf);
    indexTexts[pNum] = ocrResult.data.text;
    console.log(`=== Page ${pNum} ===`);
    console.log(ocrResult.data.text);
  }

  fs.writeFileSync('storage/brihat_index_ocr.json', JSON.stringify(indexTexts, null, 2));
  await worker.terminate();
}

extractFullIndex().catch(e => console.error(e));
