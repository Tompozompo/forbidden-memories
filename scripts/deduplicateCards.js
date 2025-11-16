// deduplicateCards.js - Remove duplicate card names
import { readFileSync, writeFileSync } from 'fs';

const cards = JSON.parse(readFileSync('src/data/cards.json', 'utf-8'));

// Track all card names and their IDs
const nameToIds = {};
for (const card of cards) {
  if (!nameToIds[card.name]) {
    nameToIds[card.name] = [];
  }
  nameToIds[card.name].push(card.id);
}

// Find duplicates
const duplicates = Object.entries(nameToIds).filter(([name, ids]) => ids.length > 1);
console.log(`Found ${duplicates.length} card names with duplicates`);

// For each duplicate, keep the first occurrence (cards 1-300 are authentic)
// and rename the others by adding their ID
let renamedCount = 0;
for (const [name, ids] of duplicates) {
  // Keep the first ID, rename the rest
  for (let i = 1; i < ids.length; i++) {
    const cardId = ids[i];
    const cardIndex = cards.findIndex(c => c.id === cardId);
    if (cardIndex !== -1) {
      // Only rename if it's in the 301-656 range (our added cards)
      if (cardId >= 301 && cardId <= 656) {
        // Create a unique name by appending a version number
        let newName = `${name} (${cardId})`;
        cards[cardIndex].name = newName;
        renamedCount++;
        console.log(`Renamed card ${cardId}: "${name}" -> "${newName}"`);
      }
    }
  }
}

console.log(`\n✅ Renamed ${renamedCount} duplicate cards`);

// Verify no duplicates remain
const finalNames = cards.map(c => c.name);
const finalDuplicates = finalNames.filter((name, idx) => finalNames.indexOf(name) !== idx);
if (finalDuplicates.length === 0) {
  console.log(`✅ No duplicates remain!`);
} else {
  console.log(`⚠️  Still have ${finalDuplicates.length} duplicates`);
}

// Save updated cards
writeFileSync('src/data/cards.json', JSON.stringify(cards, null, 2));
console.log(`💾 Saved to src/data/cards.json`);
