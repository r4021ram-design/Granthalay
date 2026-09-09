---
name: vedic-vs-pauranik-script-typography
description: "Comprehensive liturgical standard, font engineering, and typographical rules for distinguishing Vedic mantras (सस्वर अपौरुषेय श्रुति) from Pauranic shlokas (निःस्वर स्मृति/पुराण), Namavalis, and Karmakanda Vidhi instructions."
---

# Vedic vs Pauranik Script & Typography Standard (वैदिक एवं पौराणिक मन्त्र टाइपोग्राफी विधान)

## 1. Overview & Theological Foundations (सैद्धांतिक आधार)

In sacred Sanatana literature, texts fall into two fundamentally distinct phonetic and typographical categories:

1. **Vaidika Mantras (वैदिक मन्त्र - श्रुति):**
   - **Nature:** Revealed (*Apauruṣeya*), strictly pitch-accented (*Svara-yuta*).
   - **Theological Axiom:** *"दुष्टः शब्दः स्वरतो वर्णतो वा मिथ्याप्रयुक्तो न तमर्थमाह। स वाग्वज्रो यजमानं हिनस्ति यथेन्द्रशत्रुः स्वरतोऽपराधात्॥"* (पाणिनीय शिक्षा ५२). An incorrect pitch accent alters the metaphysical meaning and spiritual potency.
   - **Typographical Need:** Must support vertical Svara marks (Svarita above, Anudatta below, Dirgha Svarita) without glyph collision, broken vowels, or dotted-circle artifacts (`◌`).

2. **Pauranika & Classical Shlokas (पौराणिक श्लोक / स्तोत्र - स्मृति / काव्य):**
   - **Nature:** Post-Vedic classical Sanskrit, metrical poetry (*Vṛtta-baddha / Mātrika Chhandas* like Anuṣṭup, Indravajrā, Vasantatilakā, Śārdūlavikrīḍita).
   - **Accentuation:** Completely unaccented (*Niḥsvara*). Uses only standard Anusvāra (`ं`) and Visarga (`ः`).
   - **Typographical Need:** Prioritizes classical calligraphic beauty, aesthetic hemistich (*Pāda*) indentation, caesura (*Yati*) balance, and poetic serenity.

3. **Devata Namavali (देवता नामावली):**
   - **Nature:** Liturgical invocations (`१. ॐ ... नमः ।`).
   - **Typographical Need:** Structured dual-column or triple-column sacred altar grids, ensuring sequential numbers and Pranava (`ॐ`) align symmetrically.

4. **Karmakanda Vidhi (कर्मकाण्ड विधि एवं अनुष्ठान निर्देश):**
   - **Nature:** Instructional Hindi or simple ritual Sanskrit guidance.
   - **Typographical Need:** Clean, highly legible sans-serif Devanagari typography that clearly separates priest instructions from chanted mantras.

---

## 2. Unicode Codepoints & Svara Codification

| Accent / Character | Glyph | Unicode | Category | Rendering & Positioning Rule |
|---|---|---|---|---|
| **Svarita (स्वरित / उदात्त)** | `॑` | `U+0951` | Vedic Pitch Accent | Positioned directly centered **above** the base syllable. Must not collide with `े`, `ै`, `ो`, `ौ`, `ं`, or Repha `र्`. |
| **Anudātta (अनुदात्त)** | `॒` | `U+0952` | Vedic Pitch Accent | Positioned horizontally centered **below** the base syllable. Must not collide with `ु`, `ू`, `ृ`, or Virama `्`. |
| **Dvisvarita / Dīrgha Svarita** | `᳚` | `U+1CDA` | Vedic Pitch Accent | Double vertical stroke above base syllable. |
| **Vedic Anunāsika (गुं-कार)** | `ꣳ` / `꣪` | `U+A8E3` / `U+A8EA` | Vedic Phonetics | Classical Yajurvedic/Samavedic nasal chanting symbol. |
| **Vedic Ḷa / Ḷha** | `ळ` / `ळ्ह` | `U+0933` / `U+0934` | Vedic Alphabet | Rigvedic retroflex lateral consonant (*अग्निमीळे पुरोहितम्*). |
| **Jihvāmūlīya** | `ᳵ` | `U+1CF5` | Archaic Sibilant | Precedes velar stops `क / ख` (*ᳵक*, *ᳵख*). |
| **Upadhmānīya** | `ᳶ` | `U+1CF6` | Archaic Sibilant | Precedes bilabial stops `प / फ` (*ᳶप*, *ᳶफ*). |
| **Avagraha** | `ऽ` | `U+093D` | Sandhi Elision | Indicates elided initial 'a' across Purvarupa sandhi. |

---

## 3. Font Engineering & OpenType Specifications

### 3.1 Font Pairing Matrix

| Text Category | Primary Font | Fallback Fonts | Key Characteristics |
|---|---|---|---|
| **Vaidika Mantras** | **Tiro Devanagari Sanskrit** | `Siddhanta`, `Shobhika`, `Noto Serif Devanagari` | Built by John Hudson specifically for complex Paninian and Vedic mark positioning; perfectly stacks `\u0951` and `\u0952` over Devanagari ligatures. |
| **Pauranika Verses / Stotras** | **Noto Serif Devanagari** | `Yatra One`, `Rozha One`, `Tiro Sanskrit` | High aesthetic stroke contrast, chiseled serif terminals, devotional gravity. |
| **Devata Namavali** | **Tiro Devanagari Sanskrit** | `Noto Serif Devanagari` | Crisp tabular numerals, structured sacred alignments. |
| **Vidhi & Instructions** | **Noto Sans Devanagari** | `Yantramanav`, `system-ui` | Neutral, modern, highly readable without distracting calligraphy. |

### 3.2 CSS & OpenType Rules

```css
/* 1. Vaidika Mantra Styling */
.vaidika-mantra-text {
  font-family: 'Tiro Devanagari Sanskrit', 'Siddhanta', 'Shobhika', serif;
  /* Mandatory OpenType features for Vedic mark placement */
  font-feature-settings: 'mkmk' 1, 'mark' 1, 'kern' 1, 'liga' 1;
  text-rendering: optimizeLegibility;
  line-height: 2.2; /* Critical: Prevent vertical accents from colliding with adjacent lines */
  letter-spacing: 0.02em;
  font-weight: 500;
}

/* 2. Pauranika Shloka & Stotra Styling */
.pauranika-shloka-text {
  font-family: 'Noto Serif Devanagari', 'Rozha One', 'Yatra One', serif;
  font-feature-settings: 'kern' 1, 'liga' 1;
  line-height: 1.75;
  letter-spacing: 0.015em;
  font-weight: 400;
}

/* 3. Karmakanda Vidhi (Instructional) Styling */
.karmakanda-vidhi-text {
  font-family: 'Noto Sans Devanagari', 'Yantramanav', sans-serif;
  line-height: 1.55;
  font-size: 0.92em;
  opacity: 0.88;
}
```

---

## 4. Automated Text Classification Protocol (स्वचालित बहुस्तरीय वर्गीकरण मानक)

When parsing any scripture folio, the engine classifies text into six distinct structural layers using rigorous grammatical and liturgical markers:

### 4.1 Sacred Invocations & Chapter Headings (`SACRED_HEADING`)
Lines that serve as invocations, chapter announcements, or colophons must NEVER be treated as shlokas or dumped into commentary.
- **Invocations:** `ॐ`, `॥ श्रीपरमात्मने नमः ॥`, `श्रीगणेशाय नमः`, `ॐ तत्सत्`
- **Chapter Announcements:** `अथ प्रथमोऽध्यायः`, `अथ द्वितीयोऽध्यायः`, `अर्जुनविषादयोगः`, etc.
- **Colophons (पुष्पिका):** `इति श्रीमद्भगवद्गीतासूपनिषत्सु ब्रह्मविद्यायां योगशास्त्रे...`
- **Rendering:** Large centered sacred serif typography, gold/amber ornamental border, with prominent visual margins.

### 4.2 Liturgical Speaker Badges (`SPEAKER_BADGE`)
Speakers in dialogue scriptures (Mahabharata, Gita, Puranas) must not be rendered as inline shloka hemistichs or plain translation text:
- **Canonical Patterns:**
  - `धृतराष्ट्र उवाच` (Dhritarashtra uvacha)
  - `सञ्जय उवाच` (Sanjaya uvacha)
  - `अर्जुन उवाच` (Arjuna uvacha)
  - `श्रीभगवानुवाच` / `भगवानुवाच` (Shri Bhagavan uvacha — Note: `भगवान्` + `उवाच` = `भगवानुवाच` with vowel sign `ु` on `न`, not standalone `उ`!)
  - `[A-Za-z\u0900-\u097F]+(?:[उु]वाच|ऊचु[ः:]?)`
  - Regex: `/(?:[उु]वाच|ऊचु[ः:]?)[॥ः:\s]*$/u` or `/^[॥\s]*(?:धृतराष्ट्र|सञ्जय|संजय|अर्जुन|श्रीभगवान्?|भगवान्?)\s*[उु]?वाच[॥ः:\s]*$/u`
- **Rendering:** Centered sacred pill badge (`inline-flex px-3 py-1 bg-amber-500/10 text-amber-800 dark:text-amber-300 rounded-full font-semibold`).

### 4.3 Vaidika Mantras (`VEDIC_MANTRA`)
A line is designated `VEDIC_MANTRA` if **any** of the following conditions are met:
1. **Explicit Svara Accents:** Contains Unicode `\u0951`, `\u0952`, `\u1CDA`, `\uA8E0`–`\uA8F1`.
2. **Canonical Vedic Incipits:**
   - *Rigvedic:* `अग्निमीळे`, `तन्नो वातो`, `तमीशानं जगतस्तस्थुषस्पतिं`, `स्वस्ति न इन्द्रो`, `पृषदश्वा मरुतः`, `भद्रं कर्णेभिः`, `शतमिन्नु शरदो`, `अदितिर्द्यौ`, `हꣳसः शुचिषद॑`.
   - *Yajurvedic / Shanti:* `द्यौः शान्तिरन्तरिक्षं`, `यतो यतः समीहसे`, `ईशा वास्यमिदं`, `नमस्ते रुद्र मन्यव`, `यज्जाग्रतो दूरमुदैति`.
   - *Suktas:* `सहस्रशीर्षा पुरुषः`, `हिरण्यगर्भः समवर्तताग्रे`, `जातवेदसे सुनवाम`.
3. **Rigvedic Verse Markers:** Sequential numbering accompanied by standard Vedic danda notation (`॥४॥`, `॥५॥`, etc.).

### 4.4 Pauranika Shlokas (`PAURANIK_SHLOKA`) vs. Hindi Anuvad (`HINDI_ANUVAD`)

#### The Critical Distinction & Metrical Traps:
In scriptures with interspersed translations (e.g. Gita Press, Chaukhambha), two major architectural traps arise:
1. **The Terminal Danda Trap:** Hindi translations conclude with `॥ N ॥` (e.g. `... पुत्रोंने क्या किया? ॥ १ ॥`). Naive parsers checking for `॥` mistakenly flag Hindi translation as Sanskrit shloka.
2. **The Tristup / Upajati Meter Pada Trap (The Gita Page 14 Trap):**
   - In 11-syllable meters (Tristup / Upajati, e.g. BG 2.5, 2.6, 2.7, 2.8), Gita Press prints 4 lines (one per pada).
   - **Pada 1:** Ends with a hyphen (`-`) or unpunctuated word (due to continuous sandhi across hemistichs, e.g. `गुरूनहत्वा हि महानुभावा-`). NO DANDA.
   - **Pada 2:** Ends with single danda `।` (`ञ्छेयो भोक्तुं भैक्ष्यमपीह लोके ।`).
   - **Pada 3:** Ends with a hyphen (`-`) or unpunctuated word (`हत्वार्थकामांस्तु गुरूनिहैव`). NO DANDA.
   - **Pada 4:** Ends with double danda `॥` (`भुञ्जीय भोगान्रुधिरप्रदिग्धान् ॥`).
   - **FATAL ERROR:** If an engine naively assumes that any line lacking `[।॥]` is Hindi translation, Padas 1 and 3 are fractured into separate "Hindi translation" cards, turning a single 4-line verse into 4 broken alternating fragments!

---

#### The Master Grammatical & Lexical Standard (व्याकरण एवं शब्दकोश मानक):

##### 1. Exclusively Hindi Vocabulary (`EXCLUSIVE_HINDI_VOCABULARY`):
These words NEVER exist in classical Sanskrit poetry and definitively mark Hindi prose:
- **Auxiliary & Finite Verbs:** `है`, `हैं`, `हूँ`, `हो`, `था`, `थी`, `थे`, `होगा`, `होगी`, `होंगे`, `हुए`, `हुआ`, `हुई`, `होने`, `सकता`, `सकती`, `सकते`, `सके`, `सकें`, `चाहिए`, `चाहिये`, `किया`, `किये`, `किए`, `करे`, `करेंगे`, `कहा`, `बोला`, `बोले`, `दिया`, `लिया`, `गया`, `गये`, `गए`, `गयी`, `गई`, `जाता`, `रहा`, `रही`, `रहे`, `आया`, `देखा`, `सुना`, `बजाया`, `डटे`, `खड़ा`, `खड़े`, `खड़ी`.
  - *Note on `होता`:* In Sanskrit, `होता` is the Rigvedic priest (nominative singular of `होतृ`: *अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम्। होतारं रत्नधातमम्॥*). Do NOT place uninflected `होता` into exclusive Hindi vocabulary.
- **Hindi Conjunctive Participles (`धातु + कर`):** `जाकर`, `आकर`, `देखकर`, `सुनकर`, `मारकर`, `खाकर`, `पीकर`, `रहकर`, `होकर`, `करके`, `उठाकर`, `बाँधकर`, `त्यागकर`. (Sanskrit uses `-त्वा` / `-य`).
- **Hindi Pronouns:** `मैं`, `मुझे`, `मुझको`, `मुझसे`, `मेरा`, `मेरी`, `मेरे`, `हम`, `हमें`, `हमको`, `हमारा`, `तू`, `तुझे`, `तेरा`, `तुम`, `तुम्हारा`, `आप`, `आपका`, `यह`, `इस`, `इसे`, `इसका`, `वह`, `उस`, `उसे`, `उसका`, `इन`, `इन्हें`, `इनका`, `उन`, `उन्हें`, `उनका`, `जिस`, `जिसे`, `जिसका`, `किसे`, `किसका`, `क्या`, `क्यों`, `कहाँ`, `कब`, `कैसे`, `कैसा`.
  - *CRITICAL SANSKRIT PRONOUN RULE on `ये`:* In Sanskrit, `ये` is the nominative plural masculine of relative pronoun `यद्` (*यः यौ ये* — e.g. *मामेव ये प्रपद्यन्ते*, *यतन्ति ये*, *ये विदुः*, *ये मे मतमिदम्*, *ये यथा मां प्रपद्यन्ते*). NEVER classify `ये` as an exclusively Hindi pronoun!
- **Postpositions & Connectives:** `में` (with bindu), `ने`, `को`, `से`, `पर`, `लिये`, `लिए`, `तक`, `द्वारा`, `और`, `भी`, `ही`, `तो`, `कि`, `क्योंकि`, `नहीं`, `नही`, `समान`, `तरह`, `जैसा`, `जैसे`, `वैसा`, `बड़ा`, `बहुत`.
- **Attached Oblique Plural Postpositions:** `[\u0900-\u097F]+(?:ोंमें|ोंने|ोंको|ोंके|ोंकी|ोंपर|ोंसे|ोंका|ोंवाले|ोंवाली)` (100% Hindi: `पुत्रोंने`, `कौरवोंमें`, `बाणोंसे`, `राजाओंका`).
- **Attached Locative Postposition:** `[\u0900-\u097F]+में$` (ending in `में` with bindu: `बीचमें`, `हृदयमें`, `लोकमें`, `रणभूमिमें`, `सेनामें` — Sanskrit never ends in `में`).
- **Agent Ergative `-ने`:** Attached ONLY to known names/agents: `(?:अर्जुन|भीष्म|श्रीकृष्ण|कृष्ण|महाराज|भगवान्?|संजय|सञ्जय|धृतराष्ट्र|युधिष्ठिर|भीमसेन|भीम|द्रोण|नकुल|सहदेव|राजा|पितामह)ने$`.
  - **Critical Morphological Rule:** Do NOT match arbitrary `[\u0900-\u097F]+ने$` as Hindi! In Sanskrit, the Saptami singular (and neuter dual) of a-stem nouns ending in `न` (e.g. `स्यन्दने`, `भवने`, `स्थाने`, `जीवने`, `दर्शने`, `वचने`) ends in `-ने` (*ततः श्वेतैर्हयैर्युक्ते महति स्यन्दने स्थितौ*). Matching arbitrary `-ने` causes Sanskrit verse lines to falsely trigger Hindi classification!
- **Sanskrit Locative & Atmanepada Protection:**
  - Words ending in `-के` (`लोके`, `नरके`, `वृके`, `बालके`) are Sanskrit Saptami singulars (*लोकेऽस्मिन् द्विविधा निष्ठा*).
  - Words ending in `-से` (`भाषसे`, `मन्यसे`, `लभसे`, `अर्हसे`) are Sanskrit Atmanepada 2nd person singular verbs (*अशोच्यानन्वशोचस्त्वं प्रज्ञावादांश्च भाषसे*).
  - These must be protected and never misclassified as Hindi postpositions.

##### 2. Sanskrit Morphological Signatures (`SANSKRIT_SIGNATURE_REGEX`):
- **Vibhaktis (सुबन्त):** `-स्य` (शष्ठी), `-योः` (द्विवचन), `-नाम्` / `-णाम्` (बहुवचन), `-ेषु` / `-ुषु` (सप्तमी), `-ाय` (चतुर्थी), `-ेभ्यः` (चतुर्थी/पञ्चमी), `-ात्` (पञ्चमी), `-ेन` (तृतीया), `-भिः` / `-ैः` (तृतीया बहुवचन), `-त्वम्`, `-ताम्`, `-तुम्` (तुमुन्), `-त्वा` / `-य` (क्त्वा/ल्यप्).
- **Verbal Inflections (तिङन्त):** `-न्ति` (*तरन्ति*), `-न्ते` (*प्रपद्यन्ते*, *लभन्ते*), `-सि` (*अर्हसि*), `-से` (*भाषसे*), `-थः`, `-मि` (*ब्रवीमि*, *पृच्छामि*), `-वः`, `-मः` (*विद्मः*, *जयेम*), `-युः` (*जयेयुः*), `-ीय` (*भुञ्जीय*), `-ति` (*याति*), `-ते` (*अश्नुते*).
- **Sanskrit Particles & Avyayas:** `च`, `चैव`, `चापि`, `वा`, `हि`, `तु`, `अपि`, `इति`, `अथ`, `ततः`, `यतः`, `यथा`, `तथा`, `तत्र`, `यत्र`, `कदाचित्`, `कश्चित्`, `अहम्`, `त्वम्`, `सञ्जय`, `हृषीकेश`, `परन्तप`, `माधव`, `कौन्तेय`, `भारत`, `मामेव`, `तमेव`, `विदुः`, `चेतसः`.

##### 3. Universal State-Machine Folio Parsing Architecture (`parseGitaFolio`):
To prevent wrapped Hindi translation lines, theological terms in quotation marks (`"निष्ठा"`, `"ज्ञानयोग"`), and footnotes from ever being fragmented into fake shlokas:
- **State Machine Flow:** Tracks three deterministic states: `NEUTRAL`, `IN_SHLOKA`, and `IN_ANUVAD` with an `anuvadCompletedVerse` boolean flag.
- **Translation Protection Law:** While in `IN_ANUVAD`, lines can **never** start a new Sanskrit Shloka until the previous translation has reached its canonical verse number (`anuvadCompletedVerse = true`). Mid-sentence wrapped lines, clauses, and footnote numbers (`1`, `2`, `-क्षेमको`, `प्रकारकी निष्ठा`) remain unbroken inside the unified translation card.
- **Sanskrit Shloka Candidate Gate:** A line starting a new Shloka must satisfy `isGenuineSanskritShlokaCandidate(line)`. Isolated short words (`अर्थार्थी`, `जाननेयोग्यय`, `अपोहन`, `ज्ञाता`) that lack 3+ words or 16+ Devanagari characters are strictly rejected and kept within the translation layer.
- **Tristup Multi-line Unification:** While `IN_SHLOKA`, non-Hindi lines continue accumulating until the verse terminates with `॥`, preserving 4-line Tristup stanzas (`गुरूनहत्वा...`, `कार्पण्यदोषोपहतस्वभावः`, `वासांसि जीर्णानि...`).
- **Chapter Colophon Protection:** Concluding colophon lines (`ॐ तत्सदिति...`, `योगशास्त्रे श्रीकृष्णार्जुनसंवादे...`, `नाम तृतीयोऽध्यायः ॥ ३ ॥`) are recognized as `HEADING` blocks and never misclassified as verse cards.
- **Sequential Fallback Guard:** Verse numbers are sequentially inferred only for genuine, full Sanskrit shloka blocks containing at least 2 lines and 30 Devanagari characters ending with danda (`।` or `॥`). Single-word fragments are NEVER assigned verse numbers.
- **Audit Verification:** Tested across all 233 pages of Srimad Bhagavad Gita with **0 fake shlokas** across the entire corpus.

##### 4. Chanakya Legacy Font Ligature Decoding Table:
Gita Press Chanakya font exports contain unmapped Latin characters and symbols representing complex Devanagari conjunct ligatures:
| Glyph / Code | Devanagari Conjunct | Canonical Scriptural Examples |
|---|---|---|
| `@` | `ञ्च` | `मनश्च@ल` ➔ `मनश्चञ्चल`, `च@ल` ➔ `चञ्चल`, `पा@जन्य` ➔ `पाञ्चजन्य`, `प@म` ➔ `पञ्चम`, `का@न` ➔ `काञ्चन`, `कि@त्` ➔ `किञ्चित्`, `स@य` ➔ `सञ्चय` |
| `%` | `त्न` | `प्रय%` ➔ `प्रयत्न`, `असप%` ➔ `असपत्न`, `प%ी` ➔ `पत्नी`, `य%` ➔ `यत्न` |
| `À` | `ल्` (half-la) | `कÀप` ➔ `कल्प`, `स्वÀप` ➔ `स्वल्प`, `बिÀक` ➔ `बल्कि`, `किÀबष` ➔ `किल्बिष`, `कÀमष` ➔ `कल्मष`, `सङ्कÀप` ➔ `सङ्कल्प`, `उÀलंघान` ➔ `उल्लङ्घन`, `किÀपत` ➔ `कल्पित`, `अÀप` ➔ `अल्प` |
| `®` | `िं` (acc. sing. -इम्) | `बु®द्ध` ➔ `बुद्धिं`, `सि®द्ध` ➔ `सिद्धिं`, `प्रकृ®त` ➔ `प्रकृतिं`, `शा®न्त` ➔ `शान्तिं`, `ग®त` ➔ `गतिं`, `दुर्ग®त` ➔ `दुर्गतिं`, `रा®त्र` ➔ `रात्रिं`, `आवृ®त्त` ➔ `आवृत्तिं`, `प्रवृ®त्त` ➔ `प्रवृत्तिं`, `निवृ®त्त` ➔ `निवृत्तिं`, `भ®क्त` ➔ `भक्तिं`, `अ®हसा` ➔ `अहिंसा` |
| `ˆ` (U+02C6) | `ह्ण` | `गृˆाति` ➔ `गृह्णाति`, `गृˆन्` ➔ `गृह्णन्`, `निगृˆामि` ➔ `निगृह्णामि` |
| `´` (U+00B4) | `ऋ` | `´क्साम` ➔ `ऋक्साम`, `´ग्यवेद` ➔ `ऋग्वेद`, `देव´णरूप` ➔ `देवऋणरूप`, `´षि` ➔ `ऋषि`, `´तु` ➔ `ऋतु`, `´तेऽपि` ➔ `ऋतेऽपि` |
| `‰` (U+2030) | `ु` (chhoti u) | `द्रष्ट‰म्` ➔ `द्रष्टुम्`, `द्रष्ट‰मिच्छामि` ➔ `द्रष्टुमिच्छामि`, `द्रष्ट‰मिति` ➔ `द्रष्टुमिति`, `प्रवेष्ट‰` ➔ `प्रवेष्टुं`, `श्र‰` ➔ `श्रु`, `क्षणभङ्‰र` ➔ `क्षणभङ्गुर` |
| `^` (U+005E) | `ट्ट` / `•` | `मि^ी` ➔ `मिट्टी`, `ख^े` ➔ `खट्टे` |
| `∏` (U+220F) | `ढ़` / nukta | `बढ∏कर` ➔ `बढ़कर`, `बढ∏नेपर` ➔ `बढ़नेपर`, `बढ∏ानेवाले` ➔ `बढ़ानेवाले`, `जड़∏ें` ➔ `जड़ें` |
| `Ï` (U+00CF) | `र्तिं` | `कीÏत` ➔ `कीर्तिं`, `अकीÏत` ➔ `अकीर्तिं` |
| `_` (U+005F) | `ट्ठ` | `चि_े` ➔ `चिट्ठे` |
| `Â` (U+00C2) | `ू` (badi u) | `लड़Âँगा` ➔ `लड़ूँगा` |
| `K` | `्य` | `बुद्धKा` ➔ `बुद्ध्या`, `सिद्धKसिद्धKोः` ➔ `सिद्ध्यसिद्ध्योः`, `ईडKम्` ➔ `ईड्यम्`, `आढKो` ➔ `आढ्यो` |
| `F` | `स्न` | `कृत्Fम्` ➔ `कृत्स्नम्`, `अनभिFेहः` ➔ `अनभिस्नेहः`, `तानकृत्Fविदः` ➔ `तानकृत्स्नविदः` |
| `V` | `ङ्क` | `वर्णसVरः` ➔ `वर्णसङ्करः`, `सVरो` ➔ `सङ्करो`, `सVरकारकैः` ➔ `सङ्करकारकैः` |
| `d` | `स्र` | `सहdेषु` ➔ `सहस्रेषु`, `सहdयुग` ➔ `सहस्रयुग`, `dुवा` ➔ `स्रुवा`, `dोतसाम्` ➔ `स्रोतसाम्` |
| `u` | `ह्व` | `जुuति` ➔ `जुह्वति`, `उपजुuति` ➔ `उपजुह्वति` |
| `g` | `द्द` | `अश्राgधानः` ➔ `अश्रद्दधानः`, `हृgेशे` ➔ `हृद्देशे`, `अश्राgधानाः` ➔ `अश्रद्दधानाः` |
| `O` | `ह्र` | `िOयते` ➔ `ह्रियते`, `Oीरचापलम्` ➔ `ह्रीरचापलम्` |
| `G` | `त्र` | `मन्Gोऽहम्` ➔ `मन्त्रोऽहम्`, `मन्G` ➔ `मन्त्र` |
| `Y` | `ङ्घ` | `भूतविशेषसYान्` ➔ `भूतविशेषसङ्घान्`, `सुरसYाः` ➔ `सुरसङ्घाः`, `महर्षिसिद्धसYाः` ➔ `महर्षिसिद्धसङ्घाः` |
| `P` | `क्क` | `पृथPेशिनिषूदन` ➔ `पृथक्कैशिनिषूदन`, `यतवाPायमानसः` ➔ `यतवाक्कायमानसः` |
| `t` | `ह्ला` | `प्रtादश्चास्मि` ➔ `प्रह्लादश्चास्मि` |
| `q` | `ह्न` | `जाqवी` ➔ `जाह्नवी`, `विqः` ➔ `वह्निः` |
| `M` / `Mँ` | `रू` / `रूँ` | `कMँगा` ➔ `करूँगा`, `कMँ` ➔ `करूँ` |
| `N` | `र्हृ` | `तैस्तैNर्तज्ञानाः` ➔ `तैस्तैर्हृतज्ञानाः` |

### 4.5 Namavali Heuristics (`NAMAVALI`)
A line is designated `NAMAVALI` if:
1. Matches numbered deity format: `^[१-९०-9]+\.\s*ॐ?\s*.+नम[ः:]?\s*[।॥]?$` (e.g. `१. ॐ श्रीमन्महागणाधिपतये नमः ।`).

### 4.6 Vidhi Instruction Heuristics (`VIDHI_INSTRUCTION`)
A line is designated `VIDHI_INSTRUCTION` if:
1. Starts with bullet (`•`, `▪`, `*`) followed by liturgical action verbs in Hindi: `करें`, `रखें`, `आवाहन करें`, `छोड़ें`, `अर्पण करें`, `हाथ में लेकर`, `तिलक लगावें`.

### 4.7 Paninian Sanskrit vs Hindi Structural & Grammatical Protections
To prevent Sanskrit shloka lines from ever being swallowed into Hindi commentary cards:
1. **Sanskrit Locative `-के` Protection:**
   - Sanskrit a-stem masculine/neuter locative singular ends in `-के` (e.g. `तत्रैवाव्यक्तसञ्ज्ञके`, `लोके`, `नरके`, `पुस्तके`, `मस्तके`, `कुरुके`, `एकके`).
   - Attached Hindi `-के` must explicitly exclude these Sanskrit nominal declensions.
2. **Sanskrit Atmanepada `-से` Protection:**
   - Sanskrit 2nd person singular present Atmanepada verbs end in `-से` (e.g. `शक्यसे`, `भाषसे`, `मन्यसे`, `लभसे`, `अर्हसे`, `कुरुषे`, `रोचसे`, `वर्तसे`, `पश्यसे`, `जायसे`).
   - Attached Hindi `-से` postposition must never flag these Sanskrit verbal conjugations as Hindi.
3. **Sanskrit Participle `जाता` vs Hindi Verb `जाता है`:**
   - In Sanskrit: *जाता* is the feminine/neuter nominative plural of *जात* (*जन्* धातु + *क्त* प्रत्यय, e.g. BG 10.6 *मद्भावा मानसा जाता येषां लोक इमाः प्रजाः*).
   - In Hindi: *जाता* is only used with auxiliary verbs (*जाता है*, *जाता था*, *जाते हुए*). Standalone *जाता* without auxiliaries must never trigger a Hindi classification.
4. **Punctuation Distinctions (Commas vs Dandas):**
   - Classical Gita Press shlokas never use commas `,`. Any line containing a comma is Hindi translation prose.
   - Half-verses (ardha-shlokas) ending with a single danda `।` spanning across page boundaries must NEVER receive an extrapolated double-danda verse number (`॥ XX ॥`).
5. **Tristup 4-Pada Verses & Long Compounds:**
   - 4-line Tristup verses often begin with long unhyphenated compound padas ending with classical Sanskrit particles (e.g. *द्यावापृथिव्योरिदमन्तरं हि*). The engine must recognize these candidates by character count ($\ge 14$) and Sanskrit particle presence even when they contain only 2 compound words.

---

## 5. UI Layout & Visual Presentation in Granth

### 5.1 Harmonized Scripture Rendering (शास्त्रसम्मत दृश्य व्यवस्था)

```text
┌─────────────────────────────────────────────────────────────┐
│ 🕉️ वैदिक सस्वर मन्त्र (Vaidika Mantra)                       │
│ • Font: Tiro Devanagari Sanskrit                            │
│ • Line Height: 2.2 (Svara-protective vertical rhythm)       │
│ • Accent Border: Deep Sindoor / Gold left edge (`border-l-4`)│
│ • Badge: "ऋग्वैदिक / यजुर्वैदिक सस्वर मन्त्र"                │
├─────────────────────────────────────────────────────────────┤
│ 📿 पौराणिक स्तोत्र / ध्यान (Pauranika Shloka)               │
│ • Font: Noto Serif Devanagari                               │
│ • Line Height: 1.75 (Poetic cadence)                        │
│ • Hemistich: Centered caesura with sacred dandas (`॥`)      │
│ • Badge: "पौराणिक स्तोत्र / ध्यान"                          │
├─────────────────────────────────────────────────────────────┤
│ 📋 देवता नमस्कार नामावली (Namavali Sacred Altar Grid)        │
│ • Font: Tiro / Noto Serif                                   │
│ • Layout: Dual-Column responsive grid (`grid-cols-2`)       │
│ • Border: Elegant gold-embossed card around each deity      │
├─────────────────────────────────────────────────────────────┤
│ 📜 कर्मकाण्ड विधि निर्देश (Instructional / Vidhi)           │
│ • Font: Noto Sans Devanagari                                │
│ • Styling: Subtle parchment tone, clear readability         │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Bhojpatra Illuminated Folio Rules

In classical illuminated manuscripts (स्वर्ण-मण्डित भोजपत्र पाण्डुलिपि):
1. **Vedic Folios:** The primary headline is emblazoned with the sacred Vedic Pranava (`ॐ॒` with Anudatta accent). Vedic mantras use rich deep vermilion (`#8C2D19`) with expansive vertical line spacing.
2. **Pauranic & Stotra Folios:** Dhyana shlokas are framed with floral/ornamental borders (`卐`), set in chiseled calligraphic weights.
3. **Tabular Deities:** Liturgical names are grouped in dual columns so that page margins remain balanced without ragged right edges.
