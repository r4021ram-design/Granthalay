import { getAllStotrasForDarshan, CANONICAL_DEITIES } from '../src/data/darshanTaxonomy.js';

const allStotras = getAllStotrasForDarshan();

const genres = {
  kavacha: (t: string) => t.includes('कवच'),
  panchaka: (t: string) => t.includes('पञ्चक') || t.includes('पञ्चरत्न') || t.includes('पंचक'),
  hridaya: (t: string) => t.includes('हृदय'),
  ashtaka: (t: string) => t.includes('अष्टक'),
  ashtottara: (t: string) => t.includes('अष्टोत्तर') || t.includes('शतनाम') || t.includes('१०८'),
  sahasranama: (t: string) => t.includes('सहस्रनाम') || t.includes('१०००')
};

console.log('=== CURRENT STATUS IN GRANTHALAY ===');
for (const deity of CANONICAL_DEITIES) {
  const deityStotras = allStotras.filter(s => s.deityId === deity.id);
  console.log(`\n### देवता: ${deity.name} (${deity.id}) - कुल: ${deityStotras.length}`);
  
  const kavachas = deityStotras.filter(s => s.genre === 'kavacha' || s.title.includes('कवच'));
  const panchakas = deityStotras.filter(s => s.genre === 'panchaka' || s.title.includes('पञ्चक') || s.title.includes('पञ्चरत्न') || s.title.includes('पंचक'));
  const hridayas = deityStotras.filter(s => s.genre === 'hridaya' || s.title.includes('हृदय'));
  const ashtakas = deityStotras.filter(s => s.genre === 'ashtaka' || s.title.includes('अष्टक'));
  const ashtottaras = deityStotras.filter(s => s.title.includes('अष्टोत्तर') || s.title.includes('१०८') || s.title.includes('शतनाम'));
  const sahasranamas = deityStotras.filter(s => s.title.includes('सहस्रनाम') || s.title.includes('१०००'));

  console.log(`  - कवच (${kavachas.length}): ${kavachas.map(s => s.title).join(', ') || 'NONE'}`);
  console.log(`  - पञ्चक (${panchakas.length}): ${panchakas.map(s => s.title).join(', ') || 'NONE'}`);
  console.log(`  - हृदयम् (${hridayas.length}): ${hridayas.map(s => s.title).join(', ') || 'NONE'}`);
  console.log(`  - अष्टकम् (${ashtakas.length}): ${ashtakas.map(s => s.title).join(', ') || 'NONE'}`);
  console.log(`  - अष्टोत्तरशतनाम (${ashtottaras.length}): ${ashtottaras.map(s => s.title).join(', ') || 'NONE'}`);
  console.log(`  - सहस्रनाम (${sahasranamas.length}): ${sahasranamas.map(s => s.title).join(', ') || 'NONE'}`);
}
