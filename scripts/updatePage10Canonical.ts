import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const ROOT_DIR = path.resolve();
const DB_PATH = path.resolve(ROOT_DIR, 'storage/granth.db');
const db = new Database(DB_PATH);

const fullPage10Text = `लम्बोदराय नमः ।
वामपादे एकदंताय नमः ।
शिरसि एकदंताय नमः ।
चिबुके ब्रह्मणस्पतये नमः ।
दक्षिणनासिकायां विनायकाय नमः ।
वामनासिकायां ज्येष्ठराजाय नमः ।
दक्षिणनेत्रे विकटाय नमः ।
वामनेत्रे कपिलाय नमः ।
दक्षिणकर्णे धरणीधराय नमः ।
वामकर्णे आशापूरकाय नमः ।
नाभौ महोदराय नमः ।
हृदये धूम्रकेतवे नमः ।
ललाटे मयूरेशाय नमः ।
दक्षिणबाहौ स्वानंदवासकारकाय नमः ।
वामबाहौ सच्चित्सुखधाम्ने नमः ॥

इति गणेशन्यासः ॥

॥ श्रीगणेशाय नमः ॥

गौर्युवाच ॥

एषोऽतिचपलो दैत्यान्बाल्येऽपि नाशयत्यहो ।
अग्रे किं कर्म कर्तेति न जाने मुनिसत्तम ॥ १ ॥

दैत्या नानाविधा दुष्टाः साधुदेवद्रुहः खलाः ।
अतोऽस्य कंठे किंचित्त्वं रक्षार्थं बद्धुमर्हसि ॥ २ ॥

मुनिरुवाच ॥

ध्यायेत् सिंहगतं विनायकममुं दिग्बाहुमाद्ये युगे
त्रेतायां तु मयूरवाहनममुं षड्बाहुकं सिद्धिदम् ।
द्वापरे तु गजाननं युगभुजं रक्तांगरागं विभुं
तुर्ये तु द्विभुजं सितांगरुचिरं सर्वार्थदं सर्वदा ॥ ३ ॥

विनायकः शिखां पातु परमात्मा परात्परः ।
अतिसुन्दरकायस्तु मस्तकं सुमहोत्कटः ॥ ४ ॥

ललाटं कश्यपः पातु भ्रूयुगं तु महोदरः ।
नयने भालचंद्रस्तु गजास्यस्त्वोष्ठपल्लवौ ॥ ५ ॥

जिह्वां पातु गणक्रीडश्चिबुकं गिरिजासुतः ।
वाचं विनायकः पातु दंतान् रक्षतु दुर्मुखः ॥ ६ ॥

श्रवणौ पाशपाणिस्तु नासिकां चिंतितार्थदः ।
गणेशस्तु मुखं कंठं पातु देवो गणंजयः ॥ ७ ॥

स्कंधौ पातु गजस्कंधः स्तनौ विघ्नविनाशनः ।
हृदयं गणनायस्तु हेरंबो जठरं महान् ॥ ८ ॥

धराधरः पातु पार्श्वौ पृष्ठं विघ्नहरः शुभः ।
लिंगं गुह्यं सदा पातु वक्रतुण्डो महाबलः ॥ ९ ॥

गणक्रीडो जानुजंघे ऊरू मंगलमूर्तिमान् ।
एकदंतो महाबुद्धिः पादौ गुल्फौ सदाऽवतु ॥ १० ॥

क्षिप्रप्रसादनो बाहू पाणी आशाप्रपूरकः ।
अङ्गुलीश्च नखान्पातु पद्महस्तोऽरिनाशनः ॥ ११ ॥

सर्वाङ्गाणि मयूरेशो विश्वव्यापी सदाऽवतु ।
अनुक्तमपि यत्स्थानं धूम्रकेतुः सदाऽवतु ॥ १२ ॥

आमोदस्त्वग्रतः पातु प्रमोदः पृष्ठतोऽवतु । प्राच्यां रक्षतु`;

console.log('Updating Page 10 in database with 100% source-fidelity text...');
const updateStmt = db.prepare("UPDATE pages SET verified_text = ?, updated_at = CURRENT_TIMESTAMP WHERE book_id = 'granth-brihat-stotra-ratnakar' AND page_number = 10");
updateStmt.run(fullPage10Text);

const updatedPages = db.prepare("SELECT * FROM pages WHERE book_id = 'granth-brihat-stotra-ratnakar' ORDER BY page_number ASC").all();
const book = db.prepare("SELECT * FROM books WHERE id = 'granth-brihat-stotra-ratnakar'").get();
const jsonPath = path.resolve(ROOT_DIR, 'public/data/books/granth-brihat-stotra-ratnakar.json');
fs.writeFileSync(jsonPath, JSON.stringify({ book, pages: updatedPages }, null, 2));

console.log('Successfully updated Page 10 in database and synchronized granth-brihat-stotra-ratnakar.json!');
