/**
 * SaveSystem - Manages localStorage persistence for game progress
 */

export interface GameSave {
  starchips: number;
  beatenIds: number[];
  currentDeck: number[];
  ownedCards: number[];
}

const SAVE_KEY = 'fm-save-v1';

/**
 * Pool of weak monsters for random starting deck
 * Includes level 1-4 monsters with ATK <= 1500, similar to original game
 */
const STARTER_MONSTER_POOL = [
  2,   // Mystical Elf
  3,   // Hitotsu-me Giant
  4,   // Baby Dragon
  5,   // Ryu-kishin
  6,   // Feral Imp
  8,   // Mushroom Man
  9,   // Shadow Specter
  10,  // Blackland Fire Dragon
  13,  // Tyhone
  16,  // Time Wizard
  23,  // The Wicked Worm Beast
  24,  // Skull Servant
  25,  // Horn Imp
  27,  // Beaver Warrior
  28,  // Rock Ogre Grotto #1
  29,  // Mountain Warrior
  30,  // Zombie Warrior
  31,  // Koumori Dragon
  34,  // Saggi the Dark Clown
  36,  // The Snake Hair
  40,  // Dragon Piper
  41,  // Celtic Guardian
  43,  // Karbonala Warrior
  45,  // Oscillo Hero #2
  46,  // Griffore
  47,  // Torike
  48,  // Sangan
  49,  // Big Insect
  50,  // Basic Insect
  53,  // Killer Needle
  55,  // Giant Flea
  58,  // Kuriboh
  59,  // Mammoth Graveyard
  61,  // Wolf
  65,  // Silver Fang
  66,  // Kojikocy
  70,  // Fiend Kraken
  71,  // Jellyfish
  74,  // Giant Soldier of Stone
  75,  // Man-eating Plant
  76,  // Krokodilus
  77,  // Grappler
  78,  // Axe Raider
  80,  // Uraby
  81,  // Crawling Dragon #2
  83,  // Castle of Dark Illusions
  95,  // Crass Clown
  96,  // Armored Zombie
  97,  // Dragon Zombie
  98,  // Clown Zombie
  100, // Battle Warrior
];

/**
 * Pool of basic equip/spell cards for starting deck
 * Similar to original game which included some magic cards
 */
const STARTER_SPELL_POOL = [
  301, // Legendary Sword
  302, // Sword of Dark Destruction
  303, // Dark Energy
  307, // Elf's Light
  308, // Beast Fangs
  309, // Steel Shell
  311, // Black Pendant
  312, // Silver Bow and Arrow
  315, // Dragon Treasure
  316, // Electro-whip
];

/**
 * Generate a random starting deck similar to the original game
 * Draws 20 cards from a pool of weak monsters and some equip spells
 */
function generateRandomStarterDeck(): number[] {
  const deck: number[] = [];
  
  // Create a combined pool with more monsters than spells (weighted)
  // Original game had roughly 3-5 spells in starting deck
  const combinedPool = [
    ...STARTER_MONSTER_POOL,
    ...STARTER_MONSTER_POOL, // Double the monsters for weighting
    ...STARTER_SPELL_POOL,
  ];
  
  // Shuffle the pool using Fisher-Yates algorithm
  const shuffled = [...combinedPool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Take first 20 unique cards
  const seen = new Set<number>();
  for (const cardId of shuffled) {
    if (!seen.has(cardId)) {
      deck.push(cardId);
      seen.add(cardId);
      if (deck.length === 20) break;
    }
  }
  
  return deck;
}

/**
 * Create a new default save with randomized starting deck
 */
function createDefaultSave(): GameSave {
  return {
    starchips: 0,
    beatenIds: [],
    currentDeck: [],
    // Starting deck randomized like the original game
    ownedCards: generateRandomStarterDeck(),
  };
}

/**
 * Load save data from localStorage
 */
export function loadSave(): GameSave {
  try {
    const stored = localStorage.getItem(SAVE_KEY);
    if (!stored) {
      return createDefaultSave();
    }
    
    const parsed = JSON.parse(stored);
    const defaultSave = createDefaultSave();
    
    // Validate and merge with defaults
    return {
      starchips: typeof parsed.starchips === 'number' ? parsed.starchips : defaultSave.starchips,
      beatenIds: Array.isArray(parsed.beatenIds) ? parsed.beatenIds : defaultSave.beatenIds,
      currentDeck: Array.isArray(parsed.currentDeck) ? parsed.currentDeck : defaultSave.currentDeck,
      ownedCards: Array.isArray(parsed.ownedCards) ? parsed.ownedCards : defaultSave.ownedCards,
    };
  } catch (error) {
    console.error('Error loading save:', error);
    return createDefaultSave();
  }
}

/**
 * Save game data to localStorage (patch partial updates)
 */
export function saveSave(patch: Partial<GameSave>): void {
  try {
    const current = loadSave();
    const updated = { ...current, ...patch };
    localStorage.setItem(SAVE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving game:', error);
  }
}

/**
 * Reset save data to defaults
 */
export function resetSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (error) {
    console.error('Error resetting save:', error);
  }
}

/**
 * Check if a save exists
 */
export function hasSave(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}
