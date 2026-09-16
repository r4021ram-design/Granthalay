# Workspace Rules & Environment Constraints

## Critical Tooling Constraint: Browser Subagent Disabled
- **NEVER use the `browser_subagent` tool** in this workspace.
- **Reason**: Playwright driver installation consistently fails with a `404 Not Found` from `https://playwright.azureedge.net/builds/driver/playwright-*-win32_x64.zip` in this Windows environment. Calling `browser_subagent` always causes a breakdown and wastes time.
- **Verification Alternatives**:
  1. Automated testing via Vitest: `npm test` or `npx vitest run <test-path>`.
  2. Build & TypeScript compilation: `npm run build` (`tsc -b && vite build`).
  3. Server / API verification: direct requests via curl / node scripts if needed.
  4. Prompt the user to inspect the running app directly at `http://localhost:5173` in their own browser.

## Core Mandate: Sanskrit Fidelity & Authentic Reading Experience
- **उद्देश्य**: यह ग्रन्थालय किसी प्रदर्शन (superficial display) के लिए नहीं, बल्कि गम्भीर नित्य पठन, पारायण एवं स्वाध्याय के लिए बनाया जा रहा है।
- **सर्वोच्च प्राथमिकता (Priority #1)**:
  1. **Vedic & Puranic Sanskrit Phonetics, Grammar, Words & Shlokas**:
     - वर्णोच्चारण (Phonetics) एवं वैदिक स्वर (उदात्त, अनुदात्त, स्वरित) 100% शुद्ध होने चाहिए।
     - सन्धि, पदच्छेद, हलन्त, विसर्ग, अनुस्वार एवं छन्द-व्याकरण पूर्णतः शास्त्रसम्मत एवं शुद्ध होना चाहिए।
- **Reading Mode UI Rules**:
  1. **केवल 'पाठ' (Text Mode Only)**: पठन मोड में केवल शुद्ध 'पाठ' ही प्रदर्शित होगा (उभय एवं पोथी स्कैन हटाकर केवल पाठ्य सामग्री पर ध्यान केन्द्रित रहेगा)।
  2. **केवल 'सघन' (Compact Spacing Only)**: पंक्ति दूरी में केवल 'सघन' (Compact) ही प्रयुक्त होगी ताकि श्लोकों का प्रवाह न टूटे।
  3. **पीले (Yellow/Amber) फॉन्ट का पूर्ण निषेध**: पाठ (Scripture text) में पीला या हल्का एम्बर रंग कदापि प्रयुक्त न हो। केवल उच्च-कन्ट्रास्ट गहरा कृष्ण वर्ण (#1C120C, #0A0502), परम्परागत रक्त-वर्ण (#8C2D19, #7A1505) या डार्क मोड में स्पष्ट दूधिया श्वेत (#FFFFFF, #F8FAFC) ही प्रयुक्त होगा ताकि आँखों पर ज़ोर न पड़े और अक्षर स्पष्ट दिखें।
