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

## 4. Automated Text Classification Protocol (स्वचालित वर्गीकरण मानक)

When parsing any scripture folio, the engine classifies every line using algorithmic markers:

### 4.1 Vedic Mantra Heuristics
A line is designated `VEDIC_MANTRA` if **any** of the following conditions are met:
1. **Explicit Svara Accents:** Contains Unicode `\u0951`, `\u0952`, `\u1CDA`, `\uA8E0`–`\uA8F1`.
2. **Canonical Vedic Incipits:**
   - *Rigvedic:* `अग्निमीळे`, `तन्नो वातो`, `तमीशानं जगतस्तस्थुषस्पतिं`, `स्वस्ति न इन्द्रो`, `पृषदश्वा मरुतः`, `भद्रं कर्णेभिः`, `शतमिन्नु शरदो`, `अदितिर्द्यौ`, `हꣳसः शुचिषद॑`.
   - *Yajurvedic / Shanti:* `द्यौः शान्तिरन्तरिक्षं`, `यतो यतः समीहसे`, `ईशा वास्यमिदं`, `नमस्ते रुद्र मन्यव`, `यज्जाग्रतो दूरमुदैति`.
   - *Suktas:* `सहस्रशीर्षा पुरुषः`, `हिरण्यगर्भः समवर्तताग्रे`, `जातवेदसे सुनवाम`.
3. **Rigvedic Verse Markers:** Sequential numbering accompanied by standard Vedic danda notation (`॥४॥`, `॥५॥`, etc.).

### 4.2 Pauranika Shloka Heuristics
A line is designated `PAURANIK_SHLOKA` if:
1. Contains metrical shloka endings: `॥ १ ॥`, `॥ २ ॥`, etc.
2. Contains traditional puranic markers: `उवाच`, `ध्यायेत्`, `प्रसन्नवदनं`, `सुमुखश्चैकदन्तश्च`, `द्वादशैतानि नामानि`, `यः पठेच्छृणुयादपि`, `सर्वमङ्गलमाङ्गल्ये`.
3. Does **not** contain Vedic pitch accents.

### 4.3 Namavali Heuristics
A line is designated `NAMAVALI` if:
1. Matches numbered deity format: `^[१-९०-9]+\.\s*ॐ?\s*.+नम[ः:]?\s*[।॥]?$` (e.g. `१. ॐ श्रीमन्महागणाधिपतये नमः ।`).

### 4.4 Vidhi Instruction Heuristics
A line is designated `VIDHI_INSTRUCTION` if:
1. Starts with bullet (`•`, `▪`, `*`) followed by liturgical action verbs in Hindi: `करें`, `रखें`, `आवाहन करें`, `छोड़ें`, `अर्पण करें`, `हाथ में लेकर`, `तिलक लगावें`.

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
