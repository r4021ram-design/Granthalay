import { getAllStotrasForDarshan, CANONICAL_DEITIES } from '../src/data/darshanTaxonomy.js';

const all = getAllStotrasForDarshan();

const patterns = {
  kavacha: (t: string) => t.includes('कवच'),
  panchaka: (t: string) => /पञ्चक|पंचक|पञ्चरत्न/.test(t),
  hridaya: (t: string) => t.includes('हृदय'),
  ashtaka: (t: string) => /ष्टक/.test(t),
  ashtottara: (t: string) => /अष्टोत्तर|शतनाम|१०८/.test(t),
  sahasranama: (t: string) => /सहस्रनाम|१०००/.test(t),
};

console.log('TOTAL STOTRAS IN APP:', all.length);

for (const deity of CANONICAL_DEITIES) {
  const dStotras = all.filter(s => s.deityId === deity.id);
  console.log(`\n========================================`);
  console.log(`DEITY: ${deity.name} (${deity.id}) - Total: ${dStotras.length}`);
  console.log(`========================================`);
  
  for (const [key, fn] of Object.entries(patterns)) {
    const matched = dStotras.filter(s => fn(s.title));
    console.log(`  [${key.toUpperCase()}] (${matched.length}):`);
    if (matched.length > 0) {
      matched.forEach(m => console.log(`    - ${m.title}`));
    } else {
      console.log(`    - [NONE]`);
    }
  }
}
