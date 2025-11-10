// genFusions.js – phone-friendly, zero deps
import { readFileSync, writeFileSync } from 'fs';

const cards = JSON.parse(readFileSync('src/data/cards.json', 'utf-8'));
const OUT = 'src/data/fusions.json';
const results = [];

for (let i = 0; i < cards.length; i++) {
  const a = cards[i];
  if (a.type !== 'Monster') continue;
  for (let j = i + 1; j < cards.length; j++) {
    const b = cards[j];
    if (b.type !== 'Monster') continue;

    // PS1-style logic
    const sameAttr = a.attr === b.attr;
    const sameRace = a.race === b.race;
    if (!sameAttr && !sameRace) continue;

    const avgLevel = Math.round((a.level + b.level) / 2);
    const candidates = cards.filter(c =>
      c.type === 'Monster' &&
      c.level >= avgLevel &&
      c.level <= avgLevel + 2 &&
      (c.attr === a.attr || c.attr === b.attr)
    );

    if (candidates.length) {
      const pick = candidates.sort((x, y) => y.atk - x.atk)[0]; // highest ATK
      results.push({ materials: [a.id, b.id], result: pick.id });
    }
  }
}

writeFileSync(OUT, JSON.stringify(results, null, 2));
console.log(`✅ ${results.length} fusions written to ${OUT}`);