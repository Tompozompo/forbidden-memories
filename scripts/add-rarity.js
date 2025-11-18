#!/usr/bin/env node

/**
 * Script to add rarity field to cards.json based on starchip costs from ogmonsters file
 * 
 * Rarity mapping:
 * - Common: 10-100 starchips
 * - Rare: 101-500 starchips  
 * - Super Rare: 501-2000 starchips
 * - Ultra Rare: 2000+ or 999,999 (special/event cards)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the ogmonsters file
const ogmonstersPath = path.join(__dirname, '../ogmonsters');
const ogmonstersData = fs.readFileSync(ogmonstersPath, 'utf-8');

// Read the cards.json file
const cardsPath = path.join(__dirname, '../src/data/cards.json');
const cardsData = JSON.parse(fs.readFileSync(cardsPath, 'utf-8'));

// Parse ogmonsters file to extract card ID and starchip cost
const costMap = new Map();

ogmonstersData.split('\n').forEach(line => {
  if (!line.trim()) return;
  
  // Format: 001	Blue-eyes White Dragon	Monster	Dragon	8	3000	2500	89631139	999,999
  // The last column is the starchip cost
  const parts = line.split('\t');
  if (parts.length >= 9) {
    const id = parseInt(parts[0], 10);
    const costStr = parts[8].replace(/,/g, ''); // Remove commas
    const cost = parseInt(costStr, 10);
    
    if (!isNaN(id) && !isNaN(cost)) {
      costMap.set(id, cost);
    }
  }
});

console.log(`Parsed ${costMap.size} cards from ogmonsters file`);

// Function to determine rarity based on starchip cost
function getRarity(cost) {
  if (cost >= 999999) {
    return "Ultra Rare";
  } else if (cost >= 2000) {
    return "Ultra Rare";
  } else if (cost >= 501) {
    return "Super Rare";
  } else if (cost >= 101) {
    return "Rare";
  } else {
    return "Common";
  }
}

// Add rarity to each card
let updatedCount = 0;
let noDataCount = 0;

cardsData.forEach(card => {
  const cost = costMap.get(card.id);
  
  if (cost !== undefined) {
    card.rarity = getRarity(cost);
    updatedCount++;
  } else {
    // For cards without cost data, use a default based on type
    if (card.type === 'Spell' || card.type === 'Trap') {
      card.rarity = "Rare"; // Default for spells/traps
    } else {
      card.rarity = "Common"; // Default for monsters without data
    }
    noDataCount++;
  }
});

console.log(`Updated ${updatedCount} cards with rarity from ogmonsters data`);
console.log(`Assigned default rarity to ${noDataCount} cards without data`);

// Count cards by rarity
const rarityCounts = {
  "Common": 0,
  "Rare": 0,
  "Super Rare": 0,
  "Ultra Rare": 0
};

cardsData.forEach(card => {
  rarityCounts[card.rarity]++;
});

console.log('\nRarity distribution:');
console.log(`  Common: ${rarityCounts.Common}`);
console.log(`  Rare: ${rarityCounts.Rare}`);
console.log(`  Super Rare: ${rarityCounts["Super Rare"]}`);
console.log(`  Ultra Rare: ${rarityCounts["Ultra Rare"]}`);

// Write updated cards.json
fs.writeFileSync(cardsPath, JSON.stringify(cardsData, null, 2));

console.log('\nSuccessfully updated cards.json with rarity data');
