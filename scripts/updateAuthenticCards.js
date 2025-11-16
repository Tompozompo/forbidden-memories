// updateAuthenticCards.js - Replace placeholder cards with authentic FM data
// This script replaces cards 301-656 with authentic data from Yu-Gi-Oh! Forbidden Memories
import { readFileSync, writeFileSync } from 'fs';

const cards = JSON.parse(readFileSync('src/data/cards.json', 'utf-8'));

// Authentic cards from Yu-Gi-Oh! Forbidden Memories (301-656)
// These cards are based on the original PS1 game's card roster
const authenticReplacements = {
  // Cards 301-400: Regular monsters from the game
  301: { name: "Uraby", atk: 1500, def: 800, attr: "EARTH", race: "Dinosaur", level: 4 },
  302: { name: "Crawling Dragon #2", atk: 1600, def: 1200, attr: "EARTH", race: "Dinosaur", level: 5 },
  303: { name: "Red-Eyes B. Dragon", atk: 2400, def: 2000, attr: "DARK", race: "Dragon", level: 7 },
  304: { name: "Castle of Dark Illusions", atk: 920, def: 1930, attr: "DARK", race: "Fiend", level: 4 },
  305: { name: "Reaper of the Cards", atk: 1380, def: 1930, attr: "DARK", race: "Fiend", level: 5 },
  306: { name: "King of Yamimakai", atk: 2000, def: 1530, attr: "DARK", race: "Fiend", level: 5 },
  307: { name: "Barox", atk: 1380, def: 1530, attr: "DARK", race: "Fiend", level: 5 },
  308: { name: "Dark Chimera", atk: 1610, def: 1460, attr: "DARK", race: "Fiend", level: 5 },
  309: { name: "Metal Guardian", atk: 1150, def: 2150, attr: "DARK", race: "Machine", level: 5 },
  310: { name: "Catapult Turtle", atk: 1000, def: 2000, attr: "WATER", race: "Aqua", level: 5 },
  311: { name: "Gyakutenno Megami", atk: 1800, def: 2000, attr: "LIGHT", race: "Fairy", level: 6 },
  312: { name: "Mystic Horseman", atk: 1300, def: 1550, attr: "EARTH", race: "Beast", level: 4 },
  313: { name: "Rabid Horseman", atk: 2000, def: 1700, attr: "EARTH", race: "Beast-Warrior", level: 6 },
  314: { name: "Zanki", atk: 1500, def: 1700, attr: "EARTH", race: "Warrior", level: 5 },
  315: { name: "Crawling Dragon", atk: 1600, def: 1400, attr: "EARTH", race: "Dinosaur", level: 5 },
  316: { name: "Crass Clown", atk: 1350, def: 1400, attr: "DARK", race: "Fiend", level: 4 },
  317: { name: "Armored Zombie", atk: 1500, def: 0, attr: "DARK", race: "Zombie", level: 3 },
  318: { name: "Dragon Zombie", atk: 1600, def: 0, attr: "DARK", race: "Zombie", level: 3 },
  319: { name: "Clown Zombie", atk: 1350, def: 0, attr: "DARK", race: "Zombie", level: 2 },
  320: { name: "Pumpking the King of Ghosts", atk: 1800, def: 2000, attr: "DARK", race: "Zombie", level: 6 },
  321: { name: "Battle Warrior", atk: 700, def: 1000, attr: "EARTH", race: "Warrior", level: 3 },
  322: { name: "Wings of Wicked Flame", atk: 700, def: 600, attr: "FIRE", race: "Winged Beast", level: 2 },
  323: { name: "Dark Artist", atk: 600, def: 1400, attr: "DARK", race: "Fiend", level: 3 },
  324: { name: "Change Slime", atk: 400, def: 300, attr: "WATER", race: "Aqua", level: 1 },
  325: { name: "Moon Envoy", atk: 1100, def: 1000, attr: "LIGHT", race: "Warrior", level: 4 },
  326: { name: "Firegrass", atk: 700, def: 600, attr: "FIRE", race: "Plant", level: 2 },
  327: { name: "Psychic Kappa", atk: 400, def: 1000, attr: "WATER", race: "Aqua", level: 2 },
  328: { name: "Masaki the Legendary Swordsman", atk: 1100, def: 1100, attr: "EARTH", race: "Warrior", level: 4 },
  329: { name: "Dragoness the Wicked Knight", atk: 1200, def: 900, attr: "WIND", race: "Warrior", level: 3 },
  330: { name: "Bio Plant", atk: 600, def: 1300, attr: "WATER", race: "Plant", level: 3 },
  331: { name: "One-Eyed Shield Dragon", atk: 700, def: 1300, attr: "WIND", race: "Dragon", level: 3 },
  332: { name: "Cyber Soldier", atk: 1500, def: 1700, attr: "DARK", race: "Machine", level: 5 },
  333: { name: "Ooguchi", atk: 300, def: 250, attr: "EARTH", race: "Aqua", level: 1 },
  334: { name: "Swordsman from a Foreign Land", atk: 250, def: 250, attr: "EARTH", race: "Warrior", level: 1 },
  335: { name: "Emperor of the Land and Sea", atk: 800, def: 700, attr: "WATER", race: "Aqua", level: 3 },
  336: { name: "Ushi Oni", atk: 2150, def: 1950, attr: "DARK", race: "Fiend", level: 6 },
  337: { name: "Monster Eye", atk: 250, def: 350, attr: "DARK", race: "Fiend", level: 1 },
  338: { name: "Leogun", atk: 1750, def: 1550, attr: "EARTH", race: "Beast", level: 5 },
  339: { name: "Tatsunootoshigo", atk: 1350, def: 1600, attr: "WATER", race: "Dragon", level: 5 },
  340: { name: "Saber Slasher", atk: 1450, def: 1500, attr: "EARTH", race: "Warrior", level: 5 },
  341: { name: "Yaiba Robo", atk: 1000, def: 800, attr: "EARTH", race: "Machine", level: 4 },
  342: { name: "Machine King", atk: 2200, def: 2000, attr: "EARTH", race: "Machine", level: 6 },
  343: { name: "Giant Mech-Soldier", atk: 1750, def: 1900, attr: "EARTH", race: "Machine", level: 6 },
  344: { name: "Metal Dragon", atk: 1850, def: 1700, attr: "WIND", race: "Machine", level: 5 },
  345: { name: "Mechanicalchaser", atk: 1850, def: 800, attr: "DARK", race: "Machine", level: 4 },
  346: { name: "Blocker", atk: 850, def: 1800, attr: "DARK", race: "Machine", level: 4 },
  347: { name: "Giltia the D. Knight", atk: 1850, def: 1500, attr: "DARK", race: "Warrior", level: 5 },
  348: { name: "Launcher Spider", atk: 2200, def: 2500, attr: "FIRE", race: "Machine", level: 7 },
  349: { name: "Giga-Tech Wolf", atk: 1200, def: 1400, attr: "DARK", race: "Machine", level: 4 },
  350: { name: "Cyber Soldier of Darkworld", atk: 1400, def: 1200, attr: "DARK", race: "Machine", level: 4 },
  351: { name: "Fortress Whale", atk: 2350, def: 2150, attr: "WATER", race: "Fish", level: 7 },
  352: { name: "Daedalus", atk: 1850, def: 1700, attr: "WATER", race: "Fairy", level: 6 },
  353: { name: "Succubus Knight", atk: 1650, def: 1300, attr: "DARK", race: "Warrior", level: 5 },
  354: { name: "Oni Tank T-34", atk: 1400, def: 1700, attr: "DARK", race: "Machine", level: 4 },
  355: { name: "Cyber-Stein", atk: 700, def: 500, attr: "DARK", race: "Machine", level: 2 },
  356: { name: "Plate Armor", atk: 1500, def: 1300, attr: "EARTH", race: "Warrior", level: 5 },
  357: { name: "Call of the Grave", atk: 1500, def: 1600, attr: "DARK", race: "Fiend", level: 4 },
  358: { name: "Armored Starfish", atk: 850, def: 1400, attr: "WATER", race: "Aqua", level: 4 },
  359: { name: "Hourglass of Life", atk: 700, def: 600, attr: "DARK", race: "Fairy", level: 2 },
  360: { name: "Rare Fish", atk: 1500, def: 1200, attr: "WATER", race: "Fish", level: 4 },
  361: { name: "Mech Bass", atk: 1800, def: 1500, attr: "WATER", race: "Machine", level: 5 },
  362: { name: "Bolt Escargot", atk: 1400, def: 1500, attr: "WATER", race: "Aqua", level: 5 },
  363: { name: "Spiked Snail", atk: 700, def: 1300, attr: "WATER", race: "Aqua", level: 3 },
  364: { name: "King Fog", atk: 1000, def: 900, attr: "WATER", race: "Fiend", level: 3 },
  365: { name: "Crazy Fish", atk: 1600, def: 1200, attr: "WATER", race: "Fish", level: 4 },
  366: { name: "Mega Thunderball", atk: 750, def: 600, attr: "LIGHT", race: "Thunder", level: 3 },
  367: { name: "Mabarrel", atk: 1200, def: 1000, attr: "DARK", race: "Aqua", level: 4 },
  368: { name: "Corroding Shark", atk: 1100, def: 700, attr: "WATER", race: "Zombie", level: 3 },
  369: { name: "Skelengel", atk: 900, def: 400, attr: "LIGHT", race: "Fairy", level: 2 },
  370: { name: "Wow Warrior", atk: 1250, def: 900, attr: "EARTH", race: "Fish", level: 4 },
  371: { name: "Fairy Dragon", atk: 1100, def: 1200, attr: "WIND", race: "Dragon", level: 4 },
  372: { name: "Obese Marmot of Nefariousness", atk: 750, def: 800, attr: "EARTH", race: "Beast", level: 3 },
  373: { name: "Dark Elf", atk: 2000, def: 800, attr: "DARK", race: "Spellcaster", level: 4 },
  374: { name: "Winged Dragon Guardian of the Fortress", atk: 1400, def: 1200, attr: "WIND", race: "Dragon", level: 4 },
  375: { name: "Yamadron", atk: 1600, def: 1800, attr: "FIRE", race: "Dragon", level: 5 },
  376: { name: "Seiyaryu", atk: 2500, def: 2300, attr: "LIGHT", race: "Dragon", level: 7 },
  377: { name: "Tri-Horned Dragon", atk: 2850, def: 2350, attr: "DARK", race: "Dragon", level: 8 },
  378: { name: "Serpent Night Dragon", atk: 2350, def: 2400, attr: "DARK", race: "Dragon", level: 7 },
  379: { name: "Skelgon", atk: 1700, def: 1900, attr: "DARK", race: "Dragon", level: 5 },
  380: { name: "Darkfire Dragon", atk: 1500, def: 1250, attr: "DARK", race: "Dragon", level: 4 },
  381: { name: "Parrot Dragon", atk: 2000, def: 1300, attr: "WIND", race: "Dragon", level: 5 },
  382: { name: "Dark-Eyes Illusionist", atk: 0, def: 0, attr: "DARK", race: "Spellcaster", level: 2 },
  383: { name: "Toon Alligator", atk: 800, def: 1600, attr: "WATER", race: "Reptile", level: 4 },
  384: { name: "Rude Kaiser", atk: 1800, def: 1600, attr: "EARTH", race: "Beast-Warrior", level: 5 },
  385: { name: "Parry the Tactician", atk: 1200, def: 1400, attr: "EARTH", race: "Warrior", level: 4 },
  386: { name: "Sengenjin", atk: 1500, def: 1600, attr: "EARTH", race: "Warrior", level: 4 },
  387: { name: "Sasuke Samurai", atk: 800, def: 400, attr: "EARTH", race: "Warrior", level: 2 },
  388: { name: "Great Long Nose", atk: 1900, def: 1600, attr: "EARTH", race: "Beast", level: 5 },
  389: { name: "Otohime", atk: 1800, def: 2000, attr: "WATER", race: "Fairy", level: 6 },
  390: { name: "The Furious Sea King", atk: 1800, def: 1500, attr: "WATER", race: "Aqua", level: 5 },
  391: { name: "Fire Reaper", atk: 700, def: 500, attr: "FIRE", race: "Zombie", level: 2 },
  392: { name: "Hyo", atk: 800, def: 900, attr: "WATER", race: "Aqua", level: 3 },
  393: { name: "Doron", atk: 900, def: 500, attr: "WATER", race: "Fairy", level: 3 },
  394: { name: "Fiend's Hand", atk: 600, def: 600, attr: "DARK", race: "Fiend", level: 2 },
  395: { name: "Witty Phantom", atk: 1400, def: 1300, attr: "DARK", race: "Fiend", level: 4 },
  396: { name: "Souleater", atk: 1200, def: 0, attr: "DARK", race: "Zombie", level: 3 },
  397: { name: "Larvas", atk: 800, def: 1000, attr: "EARTH", race: "Beast", level: 3 },
  398: { name: "Hard Armor", atk: 300, def: 1200, attr: "EARTH", race: "Warrior", level: 3 },
  399: { name: "Fireyarou", atk: 1300, def: 1000, attr: "FIRE", race: "Pyro", level: 4 },
  400: { name: "Dryad", atk: 1200, def: 1400, attr: "EARTH", race: "Plant", level: 4 },
  
  // IMPORTANT: This file only contains the first 100 replacements (301-400).
  // It needs to be extended with cards 401-656 to complete the task.
  // Due to file size limitations, the complete data should be split or generated.
};

// Apply replacements
let replacedCount = 0;
for (let i = 0; i < cards.length; i++) {
  const card = cards[i];
  if (authenticReplacements[card.id]) {
    const replacement = authenticReplacements[card.id];
    cards[i] = {
      id: card.id,
      name: replacement.name,
      atk: replacement.atk,
      def: replacement.def,
      type: "Monster",
      attr: replacement.attr,
      race: replacement.race,
      level: replacement.level
    };
    replacedCount++;
  }
}

console.log(`✅ Replaced ${replacedCount} cards with authentic data`);
console.log(`⚠️  Note: Only cards 301-400 are included in this initial version`);
console.log(`📝 Cards 401-656 still need authentic data`);

// Save updated cards
writeFileSync('src/data/cards.json', JSON.stringify(cards, null, 2));
console.log(`\n💾 Saved to src/data/cards.json`);
