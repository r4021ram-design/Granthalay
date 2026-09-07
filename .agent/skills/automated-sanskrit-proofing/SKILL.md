---
name: automated-sanskrit-proofing
description: Comprehensive standard, rules, and algorithmic engine for automated proofreading, OCR post-processing, conjunct healing, Vedic accent preservation, and liturgical normalization of Sanskrit, Vedic, and Hindi scriptures.
---

# Automated Sanskrit Proofreading & Scripture Normalization Engine

## 1. Overview & Theoretical Foundation

This skill defines the gold standard for automated and assisted proofreading of digitized Sanskrit, Vedic, and Hindi scriptures. It integrates computational linguistics, Paninian grammar, and classical typographical standards from three international Sanskrit authorities:
1. **SanskritWeb (Ulrich Stiehl)**: Comprehensive Devanagari ligature matrix (800+ ligatures) and Vedic accent (Svara) codification.
2. **University of Hyderabad (UoHyd) Sanskrit Computational Linguistics Corpus**: Paninian Sandhi rules (सन्धि), Padachheda (पदच्छेद) segmentation, and morpho-syntactic normalization.
3. **Lalitaalaalitah**: Authentic classical Stotra prosody, Chhandas (छन्द), and devotional text proofing.

When digitizing scriptures from scanned manuscripts, lithographs, or PDFs, raw OCR engines (Tesseract, Cloud Vision) inevitably generate systematic errors in complex Sanskrit conjuncts (संयुक्ताक्षर), Vedic accents, liturgical symbols, and formatting. This engine heals, proofreads, and verifies sacred texts with absolute source fidelity.

---

## 2. Ulrich Stiehl's SanskritWeb Vedic Svara & Ligature Standards

### 2.1 Vedic Accents (वैदिक स्वर-विधान)

In Vedic recitation (Ṛgveda, Yajurveda, Sāmaveda, Atharvaveda), pitch accents convey grammatical and theological meaning. Raw OCR often misreads accents as stray scratches, apostrophes, quotation marks, or commas.

| Vedic Svara | Unicode Codepoint | Visual Form | Typographical Name | OCR Misread Pattern | Canonical Correction Rule |
|---|---|---|---|---|---|
| **Anudātta (अनुदात्त)** | `\u0952` (`॒`) | `क॒` (Horizontal bar below) | COMBINING DEVANAGARI STRESS SIGN ANUDATTA | `क_`, `क -`, `क_`, underline artifacts | Restore `\u0952` attached to preceding base syllable |
| **Svarita (स्वरित)** | `\u0951` (`॑`) | `क॑` (Vertical line above) | COMBINING DEVANAGARI STRESS SIGN UDATTA | `क'`, `क"`, `क|`, `क’`, `क’` | Restore `\u0951` directly above preceding vowel/syllable |
| **Dvisvarita / Dīrgha Svarita (द्विस्वरित)** | `\u1CDA` / `\u0951\u0951` | `क᳚` (Double vertical stroke above) | VEDIC TONE DOUBLE SVARITA | `क''`, `क""` | Map to `\u1CDA` or normalized double svarita |
| **Avagraha (अवग्रह)** | `\u093D` (`ऽ`) | `सोऽहम्` | DEVANAGARI SIGN AVAGRAHA | `सो'हम्`, `सो5हम्`, `सो ह्म्`, `सोहम्` | Restore `ऽ` (`\u093D`) across Purvarupa sandhi |
| **Jihvāmūlīya (जिह्वामूलीय)** | `\u1CF5` (`ᳵ`) | `ᳵक`, `ᳵख` | VEDIC SIGN JIHVAMULIYA | `(क`, `Xक`, `ःक` | Archaic voiceless velar spirant before `क/ख` |
| **Upadhmānīya (उपध्मानीय)** | `\u1CF6` (`ᳶ`) | `ᳶप`, `ᳶफ` | VEDIC SIGN UPADHMANIYA | `(प`, `Xप`, `ःप` | Archaic voiceless bilabial spirant before `प/फ` |
| **Vedic Anusvāra (गुं / गूँ)** | `\u0901` (`ँ`) / `\uA8E0`–`\uA8F1` | `य॒ज्ञं᳐` / `ॐ॒` | COMBINING DEVANAGARI SIGN CANDRABINDU VIRAMA | Dropped or rendered as simple `ं` | Preserved in Vedic chants (e.g. *अ॒ग्निमी॑ळे पु॒रोहि॑तं य॒ज्ञस्य॑*) |

### 2.2 SanskritWeb 800+ Devanagari Ligature Matrix (संयुक्ताक्षर)

Devanagari scripts from classical presses (Nirnaya Sagar Press, Motilal Banarsidass, Gita Press) utilize specialized ligatures. Modern OCR engines decompose them or substitute incorrect phonetic approximations:

1. **Ha-Conjuncts (ह-कार संयुक्ताक्षर):**
   - `ह्` + `ण` = **`ह्ण`** (e.g. *अपराह्ण* — OCR often renders `अपरान्ह` or `अपराहण`)
   - `ह्` + `न` = **`ह्न`** (e.g. *वह्नि*, *जह्नु* — OCR often renders `वहिन`, `वहनी`, `वहनि`)
   - `ह्` + `म` = **`ह्म`** (e.g. *ब्रह्म*, *ब्राह्मण* — OCR renders `ब्रम्ह`, `ब्रम`, `ब्रह्म`)
   - `ह्` + `य` = **`ह्य`** (e.g. *सह्य*, *गृह्य* — OCR renders `सहय`, `साह्य`, `ग्राह्म` ➔ `ग्राह्य`)
   - `ह्` + `ल` = **`ह्ल`** (e.g. *प्रह्लाद*, *आह्लाद* — OCR renders `प्रल्हाद`, `प्रहलाद`)
   - `ह्` + `व` = **`ह्व`** (e.g. *आह्वान*, *जिह्वा* — OCR renders `आहवान`, `जिव्हा`)
   - `ह्` + `ऋ` = **`हृ`** (e.g. *हृदय*, `हृषीकेश` — OCR renders `ह्रदय`, `हदिय`, `हिदय`)

2. **Guttural Nasal Conjuncts (ङ्-कार संयुक्ताक्षर):**
   - `ङ्` + `क` = **`ङ्क`** (e.g. *अङ्क* — OCR often renders `अंक`, `अड.्क`, `अङ् क`)
   - `ङ्` + `ख` = **`ङ्ख`** (e.g. *शङ्ख* — OCR renders `शंख`, `शङख`, `शड.्ख`)
   - `ङ्` + `ग` = **`ङ्ग`** (e.g. *गङ्गा*, *मङ्गळ* — OCR renders `गंगा`, `गङगा`, `गंग`)
   - `ङ्` + `घ` = **`ङ्घ`** (e.g. *सङ्घ* — OCR renders `संघ`, `सङघ`)

3. **Palatal Conjuncts (ञ् / श् संयुक्ताक्षर):**
   - `ञ्` + `च` = **`ञ्च`** (e.g. *पञ्च* — OCR renders `पांच`, `पन्च`, `पंच`)
   - `ञ्` + `छ` = **`ञ्छ`** (e.g. *वाञ्छा* — OCR renders `वांछा`, `वाच्छा`)
   - `ञ्` + `ज` = **`ञ्ज`** (e.g. *कुञ्ज* — OCR renders `कुंज`, `कुन्ज`)
   - `श्` + `च` = **`श्च`** (e.g. *निश्चय*, *कश्चित्* — OCR renders `निश्‍चय`, `कस्चित्`)
   - `श्` + `न` = **`श्न`** (e.g. *प्रश्न* — OCR renders `प्रस्न`, `प्रशन`)
   - `श्` + `र` = **`श्र`** (e.g. *श्री*, *विश्राम* — OCR renders `स्री`, `श्री`)
   - `श्` + `व` = **`श्व`** (e.g. *विश्व*, *अश्व* — OCR renders `विस्व`, `अस्व`, `विश्चैवेदाः` ➔ `विश्ववेदाः`)

4. **Lingual / Retroflex Conjuncts (ष् / ट् / ठ् / ड् संयुक्ताक्षर):**
   - `ष्` + `ट` = **`ष्ट`** (e.g. *कष्ट*, *दृष्ट* — OCR renders `कस्ट`, `द्रष्ट`)
   - `ष्` + `ठ` = **`ष्ठ`** (e.g. *श्रेष्ठ*, *प्रतिष्ठा* — OCR renders `श्रेष्ट`, `प्रतिस्टा`)
   - `ष्` + `ण` = **`ष्ण`** (e.g. *कृष्ण*, *विष्णु* — OCR renders `क्रिसन`, `विसनु`)
   - `द्` + `द` = **`द्द`** (e.g. *उद्देश्य* — OCR renders `उद्देश`, `उद्रेश`)
   - `द्` + `ध` = **`द्ध`** (e.g. *शुद्ध*, *सिद्धि* — OCR renders `सुद्ध`, `सिद्वि`)
   - `द्` + `भ` = **`द्भ`** (e.g. *अद्भुत* — OCR renders `अदभुत`, `अद्भुत`)
   - `द्` + `व` = **`द्व`** (e.g. *द्वार*, *द्वन्द्व* — OCR renders `द्रार`, `द्रदरामय`, `द्वन्द्र`)

---

## 3. UoHyd Paninian Sandhi & Padachheda Engine Standards

The Department of Sanskrit Studies, University of Hyderabad (UoHyd) establishes computational models for Paninian Sandhi (सन्धि) and Padachheda (पदच्छेद).

### 3.1 Paninian Sandhi Classification & Healing Rules

1. **Svara Sandhi (स्वर सन्धि):**
   - **Savarna Dīrgha (सकः सवर्णे दीर्घः):** `अ/आ + अ/आ` ➔ `आ`; `इ/ई + इ/ई` ➔ `ई`; `उ/ऊ + उ/ऊ` ➔ `ऊ`; `ऋ + ऋ` ➔ `ॠ`.
     - *OCR Repair:* Fix spurious shortened vowels in mantras (e.g. `हरीः` ➔ `हरिः`, `नुतन` ➔ `नूतन`, `ववकास` ➔ `विकास`).
   - **Guṇa Sandhi (आद्गुणः):** `अ/आ + इ/ई` ➔ `ए`; `अ/आ + उ/ऊ` ➔ `ओ`; `अ/आ + ऋ` ➔ `अर्`.
     - *OCR Repair:* `सूर्योदय` (not `सूर्य्योदय` or `सूर्यउदय`).
   - **Vṛddhi Sandhi (वृद्धिरेचि):** `अ/आ + ए/ऐ` ➔ `ऐ`; `अ/आ + ओ/औ` ➔ `औ`.
     - *OCR Repair:* `एकैकम्` (not `एकएकम्`), `तथैव` (not `तथाएव`).
   - **Yaṇ Sandhi (इको यणचि):** `इ/ई` + असमान स्वर ➔ `य्`; `उ/ऊ` + असमान स्वर ➔ `व्`; `ऋ` + असमान स्वर ➔ `र्`.
     - *OCR Repair:* `इत्यादि` (not `इतीआदि`), `स्वस्ति` (not `सुअस्ति`).
   - **Pūrvarūpa Sandhi (एङः पदान्तादति):** `ए/ओ + अ` ➔ `एऽ/ओऽ` (indicated by Avagraha `ऽ`).
     - *OCR Repair:* When OCR omits the avagraha (`गतोपि` ➔ `गतोऽपि`, `सोहम्` ➔ `सोऽहम्`, `श्रावणिकेपि` ➔ `श्रावणिकेऽपि`).

2. **Visarga Sandhi (विसर्ग सन्धि):**
   - **Sattva (विसर्जनीयस्य सः):** Visarga before `च्/छ्` ➔ `श्`; before `ट्/ठ्` ➔ `ष्`; before `त्/थ्` ➔ `स्`.
     - *Examples:* `कः + चित्` = `कश्चित्`; `धनुः + टङ्कारः` = `धनुष्टङ्कारः`; `नमः + ते` = `नमस्ते`.
   - **Utva (अतो रोरप्लुतादप्लुते):** `अः + अ` ➔ `ओऽ`; `अः + हश्` (voiced consonants) ➔ `ओ`.
     - *Examples:* `शिवः + अहम्` = `शिवोऽहम्`; `मनः + हरः` = `मनोहरः`.
   - **Ropa / Rutva (ससजुषो रुः):** Visarga becomes `र्` after any vowel other than `अ/आ`.
     - *Examples:* `मुनिः + अयम्` = `मुनिरयम्`; `हरिः + ॐ` = `हरिर्यथा`.
   - **Visarga Lopa (भोभगोअघोअपूर्वस्य योऽशि):** Visarga dropped before vowels or voiced consonants.
     - *Examples:* `देवाः + आगताः` = `देवा आगताः`.

3. **Vyañjana Sandhi (व्यञ्जन सन्धि):**
   - **Schutva (स्तोः श्चुना श्चुः):** `स्/त्-वर्ग` + `श्/च्-वर्ग` ➔ `श्/च्-वर्ग`. (e.g. `सत् + चित्` = `सच्चित्`).
   - **Jaśtva (झलां जशोऽन्ते):** Stop consonants become voiced non-aspirates (e.g. `वाक् + ईशः` = `वागीशः`, `जगत् + ईशः` = `जगदीशः`).
   - **Anunāsika (यरोऽनुनासिकेऽनुनासिको वा):** `सत् + मतिः` = `सन्मतिः`; `वाक् + मयम्` = `वाङ्मयम्`.

### 3.2 Padachheda (पदच्छेद) Engine Protocol

For students, pujaris, and liturgical practitioners, Granth supports interactive **Padachheda (पदच्छेद)** mode:
- **Compounded Shloka:** `सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥`
- **Padachheda Representation:** `सर्व-मङ्गल-माङ्गल्ये शिवे सर्व-अर्थ-साधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमः अस्तु ते ॥`
- **Rules for Padachheda Separation:**
  1. Separate samasa elements using a thin hyphen (`-`) or space.
  2. Restore underlying un-sandhied words (e.g. `नमोऽस्तु` ➔ `नमः अस्तु`, `सर्वार्थ` ➔ `सर्व-अर्थ`).
  3. Keep case endings (विभक्ति) attached to the final noun stem.

---

## 4. Master Shastra Conjunct Healing Dictionaries

### 4.1 Vedic Liturgical & Karmakanda Dictionary

| Raw OCR Distortion | Canonical Scripture Form | Category | Canonical Shastra Context |
|---|---|---|---|
| `गहस्रेश` / `गृहप्र वेश` | **`गृहप्रवेश`** | Vastushastra | Grihapravesha ceremonies |
| `कप्रिष्म` / `क्िप्त` / `वक्ष्र` | **`क्षिप्र`** | Jyotisha | Kshipra nakshatras (Ashvini, Pushya, Hasta) |
| `स्री` / `स्रीगेह` / `स्रीगेहपुत्राम` | **`स्त्री`** / **`स्त्रीगेह`** / **`स्त्रीगेहपुत्रात्म`** | Shloka | Muhurta Chintamani |
| `द्रीशेऽनले` / `िीशेऽनले` | **`दिशेऽनले`** | Shloka | Vastu Shanti Muhurta |
| `द्रदरामय` / `द्नदरामय` | **`द्वन्द्वामय`** | Shloka | Dvandvamaya (quarrel and illness) |
| `द्वन्द्र` / `द्नद्र` | **`द्वन्द्व`** | Grammar / Shloka | Dvandva |
| `द्रार` / `द्रारहोतो` | **`द्वार`** / **`द्वार हो तो`** | Vastushastra | Door orientation |
| `पुथिवी` / `पृवथवी` | **`पृथिवी`** | Vedic Mantra | Prithvi Sukta & Swasti Vachana |
| `धुताः` / `धुता` | **`धृताः`** / **`धृता`** | Vedic Mantra | *धृता मनसो...* |
| `मूदु` / `मुदु` | **`मृदु`** | Jyotisha | Mridu nakshatras (Mrigashira, Citra, Anuradha, Revati) |
| `धुवैः` / `धुव` | **`ध्रुवैः`** / **`ध्रुव`** | Jyotisha | Dhruva / Sthira nakshatras (Rohini, Uttaras) |
| `इनदरो` / `स्वस्तिन इनदरो` | **`इन्द्रो`** / **`स्वस्ति न इन्द्रो`** | Rigveda 1.89.6 | Swasti Sukta |
| `पुषा विश्चैवेदाः` | **`पूषा विश्ववेदाः`** | Rigveda 1.89.6 | Swasti Sukta |
| `नस्ताक््यो` / `तस्ताक््यो` | **`तार्क्ष्यो`** / **`नस्तार्क्ष्यो`** | Rigveda 1.89.6 | Tarkshya (Garuda) |
| `तदश्चिना` | **`तदश्विना`** | Rigveda | Ashvini Kumaras |
| `शुणुतन्` / `शृिुत` | **`शृणुतं`** | Vedic Imperative | *देवाः शृणुतं यद् भद्रम्* |
| `तमीशानन्` | **`तमीशानं`** | Vedic Mantra | *तमीशानं जगतस्तस्थुषस्पतिम्* |
| `जगतस् तस्थुषस्पतिन्` | **`जगतस्तस्थुषस्पतिं`** | Vedic Mantra | *जगतस्तस्थुषस्पतिं धियञ्जिन्वमवसे हूमहे वयं* |
| `भेषजन्` | **`भेषजं`** | Vedic Mantra | Medicine / Healing |
| `पुश्चिमातरः` | **`पृश्निमातरः`** | Rigveda | Maruts |
| `सर्वविध्न` | **`सर्वविघ्न`** | Mangalacharana | All obstacles |
| `सर्वमंगलमांगल्ये` | **`सर्वमङ्गलमाङ्गल्ये`** | Devi Mahatmya | Standard Sanskrit orthography |
| `अमंगलम` | **`अमङ्गलम्`** | Shloka | Inauspicious |
| `मंगलायतनो` | **`मङ्गलायतनो`** | Shloka | Mangalayatan |
| `सोमनार` | **`सोमवार`** | Panchanga | Monday |
| `हरीः` | **`हरिः`** | Shanti Mantra | *हरिः ॐ* |
| `गतोपि` / `श्रावणिकेपि` | **`गतोऽपि`** / **`श्रावणिकेऽपि`** | Sandhi | Avagraha restoration |
| `आहुवत` / `पीूयहबुत` | **`आहुति`** / **`पूर्णाहुति`** | Karmakanda | Purnahuti |
| `अवनन` / `बबलदान` | **`अग्नि`** / **`बलिदान`** | Karmakanda | Fire / Balidana |
| `पूष्पांजबल` | **`पुष्पांजलि`** | Karmakanda | Pushpanjali |
| `चतुः पवि योगनी` | **`चतुःषष्टि योगिनी`** | Mandala | 64 Yoginis |
| `वसो◌्र्धारा` / `वसोर् धारा` | **`वसोर्धारा`** | Karmakanda | Vasordhara |
| `दशबदनपाल` | **`दशदिग्पाल`** | Mandala | 10 Directional Guardians |
| `कुशकवण्डका` | **`कुशकण्डिका`** | Havan Vidhi | Foundation ritual of Havan |
| `सप्तस्थल` | **`सप्तघृत`** | Matrika | Sapta Ghrita Matrika |
| `प्रवेशािति्‌विधः` | **`प्रवेशस्त्रिविधः`** | Shloka | Three kinds of Grihapravesha |
| `यात्राबसाने` | **`यात्रानिवृत्तौ`** | Shloka | Muhurta Chintamani verse |
| `भयाननवेऽ` | **`भयान्नवेऽध्वगे`** | Shloka | Muhurta Chintamani verse |
| `नाऽऽवश्यमस्तादिविचारणाऽत्र` | **`नाऽऽवश्यमस्तार्कविचारणाऽत्र`** | Shloka | Muhurta Chintamani verse |
| `जीर्त` / `जीिय` | **`जीर्ण`** | Shloka | Jirna (renovated house) |
| `सपूवत` / `अपूवत` | **`सपूर्व`** / **`अपूर्व`** | Shloka | Apoorva & Sapurva Grihapravesha |
| `शावन्र्` / `शावन्त` | **`शान्ति`** | Term | Shanti |
| `पद्धवत` | **`पद्धति`** | Book Title | Paddhati |
| `वथथवर्` | **`स्थिति`** | Term | Sthiti |
| `ललए` / `लवधान` / `लवलहत` | **`लिए`** / **`विधान`** / **`विहित`** | Hindi / Sanskrit | `ि`-matra OCR shift |
| `िारदा` | **`शारदा`** | Deity | Sharada Devi |
| `नैर् ऋत् य` | **`नैर्ऋत्य`** | Direction | South-West Direction |
| `चंद्रबलं` | **`चन्द्रबलं`** | Jyotisha | Lunar strength |

---

## 5. Algorithmic Implementation in TypeScript

The proofreading engine implements these rules using non-word-boundary Devanagari regexes (avoiding the JavaScript `\b` ASCII bug):

```typescript
export function proofreadSanskritPage(rawText: string, pageNum: number): string {
  // Never alter hand-verified folios
  if (pageNum === 1 || pageNum === 2) return rawText.trim();

  let s = rawText;

  // 1. Remove publisher, phone, foundation, and author strings strictly
  s = s.replace(/मानव\s*ववकास\s*फाउन्?डेशन\s*[-–]?\s*मुम्?\s*बई/gu, '');
  s = s.replace(/मानव\s*विकास\s*फाउ[न्ण्ड]ेशन\s*[-–]?\s*मुम्बई/gu, '');
  s = s.replace(/आचायय\s*अवखलेश\s*(विवेदी|द्विवेदी)\s*[-–]?\s*9820611270/gu, '');
  s = s.replace(/आचार्य\s*अखिलेश\s*(त्रिवेदी|द्विवेदी)\s*[-–]?\s*9820611270/gu, '');
  s = s.replace(/वैशाख\s*शुक्\s*ल\s*तृतीया\s*[-–]?\s*26\.\s*4\s*\.2020/gu, '');
  s = s.replace(/9820611270/g, '');

  // 2. Remove running headers
  s = s.replace(/^(?:`\s*)?(?:गृहप्रवेश\s*\/\s*वास्तु\s*शान्ति\s*पूजनम्[‌\s]*|जि\s*\/\s*वास्तु\s*शान्ति\s*पूजनम्[‌\s]*|॥\s*\|\s*\/\s*वास्तु\s*शान्ति\s*पूजनम्[‌\s]*)\n?/gmi, '');
  s = s.replace(/^(?:वास्तु\s*मण्डल\s*देवता\s*स्थापनम्[‌\s]*)\n?/gmi, '');

  // 3. Normalize OCR noise bullets
  s = s.replace(/^[»*°"=~]\s*/gmu, '• ');
  s = s.replace(/^०\.\s*/gmu, '• ');
  s = s.replace(/^०\s+/gmu, '• ');
  s = s.replace(/^\*\.\s*/gmu, '▪ ');
  s = s.replace(/^=\s*/gmu, '▪ ');
  s = s.replace(/^--?\s*/gmu, '▪ ');

  // 4. Remove orphan spaces before matras and Vedic accents
  // Note: Preserve Vedic accents: \u0951 (Svarita), \u0952 (Anudatta), \u1CDA (Dvisvarita)
  s = s.replace(/([क-ह]़?)\s+([ािीुूृेैोौँंः\u0951\u0952\u1CDA])/gu, '$1$2');
  s = s.replace(/\s+([ािीुूृेैोौँंः\u0951\u0952\u1CDA])/gu, '$1');
  s = s.replace(/\u094D\s+/gu, '\u094D');

  // 5. Apply Ulrich Stiehl's SanskritWeb Ligature Corrections
  // Ha-conjuncts
  s = s.replace(/ह़्न|ह\s*्न/gu, 'ह्न');
  s = s.replace(/ह़्म|ह\s*्म/gu, 'ह्म');
  s = s.replace(/ह़्य|ह\s*्य/gu, 'ह्य');
  s = s.replace(/ह़्ल|ह\s*्ल/gu, 'ह्ल');
  s = s.replace(/ह़्व|ह\s*्व/gu, 'ह्व');
  s = s.replace(/ह़ृ|ह\s*ृ/gu, 'हृ');

  // Guttural Nasal Conjuncts
  s = s.replace(/ड\.्ग|ङ्\s*ग/gu, 'ङ्ग');
  s = s.replace(/ड\.्क|ङ्\s*क/gu, 'ङ्क');
  s = s.replace(/ड\.्ख|ङ्\s*ख/gu, 'ङ्ख');
  s = s.replace(/ड\.्घ|ङ्\s*घ/gu, 'ङ्घ');

  // Retroflex Conjuncts
  s = s.replace(/ष्\s*ट/gu, 'ष्ट');
  s = s.replace(/ष्\s*ठ/gu, 'ष्ठ');
  s = s.replace(/ष्\s*ण/gu, 'ष्ण');
  s = s.replace(/द्\s*ध/gu, 'द्ध');
  s = s.replace(/द्\s*द/gu, 'द्द');
  s = s.replace(/द्\s*व/gu, 'द्व');

  // 6. Apply Canonical Shastra Dictionary Replacements
  for (const [regex, rep] of canonicalCorrections) {
    s = s.replace(regex, rep);
  }

  // 7. Strip stray dotted circles
  s = s.replace(/[\u25CC\u25CB]/gu, '');

  return s.trim();
}
```

---

## 6. Quality & Verification Protocol

A scripture page is verified **ONLY** if:
1. **Zero Commercial Noise:** Completely free of compiler names, phone numbers, and modern publication dates.
2. **Conjunct Integrity:** Complex Devanagari ligatures (`क्ष`, `ज्ञ`, `त्र`, `ह्न`, `ह्म`, `ह्य`, `द्व`, `ष्ट्र`) display with clean Unicode representation without dotted circles (`◌`).
3. **Vedic Accent Fidelity:** All Svarita (`॑`) and Anudatta (`॒`) accents stay unified with their respective vowels.
4. **Liturgical Layout:** Structural headings use traditional marks (`【 ... 】`), invocations use double dandas (`॥ ... ॥`), and bullets are clean sacred symbols (`•`, `▪`).
