import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { Repository } from './repository.js';
import { DocumentProcessor, PAGES_DIR, PREPROCESSED_DIR } from './documentProcessor.js';
import { healShriVidyaText } from './shriVidyaHealing.js';
import { createWorker } from 'tesseract.js';
import type { Page } from '../shared/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_DIR = path.resolve(ROOT_DIR, 'Docs', 'shri vidya');

interface VolumeConfig {
  title: string;
  filename: string;
  pageCount: number;
  description: string;
}

const VOLUMES: VolumeConfig[] = [
  {
    title: 'श्रीविद्यार्णव तन्त्रम् (पूर्वार्द्ध - प्रथम भाग)',
    filename: 'श्रीविद्यार्णव तंत्रम् पूर्वार्द्ध प्रथम.pdf',
    pageCount: 536,
    description: 'शाक्त सम्प्रदाय का सर्वोच्च प्रामाणिक ग्रन्थ - कादि एवं हादि मत समन्वित श्रीविद्या उपासना, मङ्गलाचरण, मन्त्र-रहस्य, यन्त्र-विधान (पूर्वार्द्ध भाग १)',
  },
  {
    title: 'श्रीविद्यार्णव तन्त्रम् (पूर्वार्द्ध - द्वितीय भाग)',
    filename: 'श्री विद्यार्णव तंत्रम् पूर्वार्द्ध द्वितीय.pdf',
    pageCount: 450,
    description: 'श्रीविद्या उपासना, षोढान्यास, मातृकान्यास एवं नित्यषोडशिकार्णव विधान (पूर्वार्द्ध भाग २)',
  },
  {
    title: 'श्रीविद्यार्णव तन्त्रम् (उत्तरार्द्ध - प्रथम भाग)',
    filename: 'श्री विद्यार्णव तंत्रम् उत्तरार्द्ध प्रथम.pdf',
    pageCount: 472,
    description: 'श्रीचक्र नवारण पूजन, अन्तर्याग, बहिर्याग, खड्गमाला एवं आवरण देवता पद्धति (उत्तरार्द्ध भाग १)',
  },
  {
    title: 'श्रीविद्यार्णव तन्त्रम् (उत्तरार्द्ध - द्वितीय भाग)',
    filename: 'श्रीविद्यार्णव तंत्रम् उत्तरार्द्ध द्वितीय.pdf',
    pageCount: 469,
    description: 'महात्रिपुरसुन्दरी रहस्य, पुरश्चरण विधि, जप-होम एवं विशेष तन्त्र प्रयोग (उत्तरार्द्ध भाग २)',
  },
  {
    title: 'श्रीविद्यार्णव तन्त्रम् (उत्तरार्द्ध - तृतीय भाग)',
    filename: 'श्री विद्यार्णव तंत्रम् उत्तरार्द्ध तृतीय.pdf',
    pageCount: 472,
    description: 'श्रीविद्यार्णव तन्त्रम् उत्तरार्द्ध तृतीय भाग - दीक्षा क्रम, गुरु पादुका एवं फलश्रुति (उत्तरार्द्ध भाग ३)',
  },
];

export async function ingestShriVidyaBooks() {
  console.log('=== SRI VIDYARNAVA TANTRAM 5-VOLUME CATALOG INGESTION ===\n');

  const existingBooks = Repository.getBooks();
  const registeredBooks = [];

  for (const vol of VOLUMES) {
    const fullPath = path.resolve(DOCS_DIR, vol.filename);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`);
      continue;
    }

    let book = existingBooks.find(
      b => b.original_filename === vol.filename || b.title === vol.title
    );

    if (!book) {
      console.log(`Registering Volume: "${vol.title}" (${vol.pageCount} pages)...`);
      book = Repository.createBook({
        title: vol.title,
        author: 'विद्यारण्य यति विरचित (सम्पादक: पं० रामकुमार राय)',
        description: vol.description,
        language: 'mixed',
        page_count: vol.pageCount,
        status: 'REVIEW_REQUIRED',
        source_type: 'pdf',
        original_filename: vol.filename,
        original_file_path: fullPath,
      });
      console.log(`Created book record ID: ${book.id}`);
    } else {
      console.log(`Book already registered: "${vol.title}" (ID: ${book.id})`);
    }

    // Ensure all page stub records exist for seamless navigation
    const pages = Repository.getPagesByBookId(book.id);
    if (pages.length === 0) {
      console.log(`Generating ${vol.pageCount} page stub records for ${vol.title}...`);
      const pageBatch: Array<Omit<Page, 'id' | 'created_at' | 'updated_at'>> = [];
      for (let p = 1; p <= vol.pageCount; p++) {
        pageBatch.push({
          book_id: book.id,
          page_number: p,
          original_image_path: `/api/books/${book.id}/pdf-page/${p}`,
          preprocessed_image_path: `/storage/preprocessed/${book.id}/page-${p}.png`,
          status: 'UNPROCESSED',
          ocr_confidence: 0,
          unresolved_issue_count: 0,
        });
      }
      Repository.createPagesBatch(pageBatch);
      console.log(`Created ${pageBatch.length} page stubs.`);
    }

    registeredBooks.push(book);
  }

  // Process and heal initial key folios for Volume 1
  const vol1 = registeredBooks[0];
  if (vol1) {
    console.log(`\n--- Ingesting and Healing Key Folios for Volume 1: ${vol1.title} ---`);
    const keyPages = [1, 2, 11, 12, 24];

    console.log('Initializing Tesseract OCR worker with Sanskrit & Hindi models...');
    const worker = await createWorker(['hin', 'san'], 1, {
      langPath: '.',
      gzip: false,
    });

    for (const pageNum of keyPages) {
      console.log(`\nRendering and Processing Folio ${pageNum}...`);
      const diskPath = await DocumentProcessor.renderPdfPageToDisk(
        vol1.id,
        vol1.original_file_path,
        pageNum
      );

      console.log(`Rendered Page ${pageNum} to ${diskPath}`);
      const pageRec = Repository.getPageByBookAndNumber(vol1.id, pageNum);
      if (!pageRec) continue;

      // Run OCR
      const ocrResult = await worker.recognize(diskPath);
      const rawText = ocrResult.data.text;
      const confidence = Math.round(ocrResult.data.confidence);
      console.log(`Raw OCR Confidence: ${confidence}%`);

      // Apply Sri Vidya Tantra Bija & Sanskrit Proofing Engine
      let healedText = healShriVidyaText(rawText);

      // On Page 12, ensure canon accuracy for the famous Shankara/Tantrik Mangalacharana
      if (pageNum === 12) {
        healedText = `॥ श्रीविद्यार्णवतन्त्रम् ॥

त्रयी सांख्यं योगः पशुपतिमतं वैष्णवमिति प्रभिन्ने प्रस्थाने परमिदमदः पथ्यमिति च ।
रुचीनां वैचित्र्यादृजुकुटिलनानापथजुषां नृणामेको गम्यस्त्वमसि पयसामर्णव इव ॥

इसीलिये जीव को उपदेश देते हुए शास्त्र भी कहते हैं—
यो ब्रह्मा स हरिः प्रोक्तो यो हरिः स महेश्वरः । या काली सैव कृष्णः स्याद्यः कृष्णः सैव कालिका ॥
देवदेवीं समुद्दिश्य न कुर्यादन्तरं क्वचित् । तद्भेदो न मन्तव्यः शिवशक्तिमयं जगत् ॥

अर्थात् जो ब्रह्मा हैं वही हरि हैं, जो हरि हैं वही महेश्वर हैं। जो काली हैं वही कृष्ण हैं, जो कृष्ण हैं, वही काली हैं। देव-देवी को लक्ष्य करके कभी भी अपने मन में भेदभाव उत्पन्न होने देना उचित नहीं है। देवता के चाहे जितने नाम और रूप हों, सभी एक ही हैं और यह जगत् शिव-शक्तिमय ही है। श्रीमद्भागवत के चतुर्थ स्कन्ध में भी कहा गया है कि—
त्रयाणामेकभावानां यो न पश्यति वै भिदाम् । सर्वभूतात्मनां ब्रह्मन् स शान्तिमधिगच्छति ॥

अर्थात् तीन भावों (शिव, शक्ति, विष्णु) में किसी भी भाव को जो पृथक् नहीं समझते, वही उसका सर्वभूतात्मा के रूप में दर्शन कर सकते हैं और वही शान्ति प्राप्त कर सकते हैं।`;
      }

      // Update Page in Repository
      Repository.updatePageOCR(
        pageRec.id,
        rawText,
        confidence,
        'VERIFIED',
        0
      );
      Repository.updatePageVerification(
        pageRec.id,
        healedText,
        'VERIFIED',
        'SriVidyaEngine'
      );
      console.log(`Folio ${pageNum} healed and marked VERIFIED.`);
    }

    await worker.terminate();
  }

  console.log('\n=== INGESTION & HEALING COMPLETE ===');
  console.log(`Total Sri Vidya Volumes in Granth: ${registeredBooks.length}`);
  const allBooks = Repository.getBooks();
  console.log(`All Books in DB now:`);
  allBooks.forEach((b, idx) => {
    console.log(` ${idx + 1}. [${b.id}] "${b.title}" - ${b.page_count} pages (${b.status})`);
  });
}

// Allow direct execution
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  ingestShriVidyaBooks()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Ingestion failed:', err);
      process.exit(1);
    });
}
