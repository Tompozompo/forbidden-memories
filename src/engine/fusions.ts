import fusions from '../data/fusions.json';
import cardsData from '../data/cards.json';
import type { Card } from '../types';

// Cast imported cards to proper type
const cards = cardsData as Card[];

// Build specific fusion lookup table
const specificFusionMap = new Map<string, number>();
for (const { materials, result } of fusions) {
  const key = materials.sort((a, b) => a - b).join('-');
  specificFusionMap.set(key, result);
}

// Type compatibility for general fusions (same type usually produces stronger version)
const raceCompatibility: Record<string, string[]> = {
  'Dragon': ['Dragon', 'Dinosaur', 'Reptile'],
  'Spellcaster': ['Spellcaster', 'Fairy'],
  'Warrior': ['Warrior', 'Beast-Warrior'],
  'Fiend': ['Fiend', 'Zombie'],
  'Beast': ['Beast', 'Beast-Warrior'],
  'Aqua': ['Aqua', 'Fish', 'Sea Serpent'],
  'Pyro': ['Pyro', 'Dinosaur'],
  'Thunder': ['Thunder', 'Machine'],
  'Machine': ['Machine', 'Thunder'],
  'Plant': ['Plant', 'Insect'],
};

// Attribute strength chart (for general fusions)
const attributeStrength: Record<string, number> = {
  'LIGHT': 5,
  'DARK': 5,
  'FIRE': 4,
  'WATER': 4,
  'EARTH': 3,
  'WIND': 3,
};

/**
 * Main fusion function - checks specific fusions first, then falls back to general fusion
 */
export function checkFusion(a: number, b: number): number | null {
  // 1. Check for specific fusion in the fusion table
  const specificResult = checkSpecificFusion(a, b);
  if (specificResult !== null) {
    return specificResult;
  }

  // 2. Fall back to general fusion rules
  return checkGeneralFusion(a, b);
}

/**
 * Check the specific fusion table
 */
function checkSpecificFusion(a: number, b: number): number | null {
  const key = [a, b].sort((a, b) => a - b).join('-');
  return specificFusionMap.get(key) ?? null;
}

/**
 * General fusion rules based on the original game mechanics
 * Returns a fusion result based on type, attribute, and level compatibility
 */
function checkGeneralFusion(a: number, b: number): number | null {
  const cardA = cards.find((c: Card) => c.id === a);
  const cardB = cards.find((c: Card) => c.id === b);

  // Can only fuse monsters
  if (!cardA || !cardB || cardA.type !== 'Monster' || cardB.type !== 'Monster') {
    return null;
  }

  // Calculate target stats for the fusion result
  const avgAtk = Math.floor(((cardA.atk || 0) + (cardB.atk || 0)) / 2);
  const avgDef = Math.floor(((cardA.def || 0) + (cardB.def || 0)) / 2);
  const avgLevel = Math.round(((cardA.level || 4) + (cardB.level || 4)) / 2);

  // Determine preferred race and attribute
  const preferredRace = determinePreferredRace(cardA, cardB);
  const preferredAttr = determinePreferredAttribute(cardA, cardB);

  // Find a suitable fusion result from the card pool
  return findBestGeneralFusion(avgAtk, avgDef, avgLevel, preferredRace, preferredAttr);
}

/**
 * Determine which race should be preferred for the fusion
 */
function determinePreferredRace(cardA: Card, cardB: Card): string | undefined {
  const raceA = cardA.race;
  const raceB = cardB.race;

  // Same race = keep it
  if (raceA === raceB) {
    return raceA;
  }

  // Check if races are compatible
  if (raceA && raceB) {
    const compatA = raceCompatibility[raceA] || [];
    const compatB = raceCompatibility[raceB] || [];
    
    if (compatA.includes(raceB)) {
      return raceA;
    }
    if (compatB.includes(raceA)) {
      return raceB;
    }
  }

  // Prefer the stronger race (based on level)
  return (cardA.level || 0) >= (cardB.level || 0) ? raceA : raceB;
}

/**
 * Determine which attribute should be preferred for the fusion
 */
function determinePreferredAttribute(cardA: Card, cardB: Card): string | undefined {
  const attrA = cardA.attr;
  const attrB = cardB.attr;

  // Same attribute = keep it
  if (attrA === attrB) {
    return attrA;
  }

  // Prefer the "stronger" attribute
  const strengthA = attributeStrength[attrA || ''] || 0;
  const strengthB = attributeStrength[attrB || ''] || 0;

  if (strengthA > strengthB) {
    return attrA;
  } else if (strengthB > strengthA) {
    return attrB;
  }

  // If tied, prefer based on level
  return (cardA.level || 0) >= (cardB.level || 0) ? attrA : attrB;
}

/**
 * Find the best matching card from the pool for general fusion
 * Looks for a card with similar stats, race, and attribute
 */
function findBestGeneralFusion(
  targetAtk: number,
  targetDef: number,
  targetLevel: number,
  preferredRace: string | undefined,
  preferredAttr: string | undefined
): number | null {
  const monsterCards = cards.filter((c: Card) => c.type === 'Monster');

  // Calculate score for each potential result
  const scoredCards = monsterCards.map((card: Card) => {
    let score = 0;

    // Stat similarity (important)
    const atkDiff = Math.abs((card.atk || 0) - targetAtk);
    const defDiff = Math.abs((card.def || 0) - targetDef);
    score -= (atkDiff + defDiff) / 100; // Lower diff = higher score

    // Level similarity
    const levelDiff = Math.abs((card.level || 4) - targetLevel);
    score -= levelDiff * 5;

    // Race match (bonus)
    if (card.race === preferredRace) {
      score += 20;
    }

    // Attribute match (bonus)
    if (card.attr === preferredAttr) {
      score += 15;
    }

    // Prefer cards with ATK >= targetAtk (slightly favor upgrades)
    if ((card.atk || 0) >= targetAtk) {
      score += 5;
    }

    return { card, score };
  });

  // Sort by score and pick the best
  scoredCards.sort((a, b) => b.score - a.score);

  // Return the top match if it has a positive score
  const best = scoredCards[0];
  if (best && best.score > -50) {
    return best.card.id;
  }

  // Fallback to a weak monster if no good match
  return findWeakFallbackMonster();
}

/**
 * Fallback - return a weak monster (used when fusion is unfavorable)
 */
function findWeakFallbackMonster(): number {
  // Return a low-level, low-ATK monster as fallback
  const weakMonsters = cards.filter(
    (c: Card) => c.type === 'Monster' && (c.atk || 0) <= 500 && (c.level || 0) <= 2
  );

  if (weakMonsters.length > 0) {
    // Pick a random weak monster
    return weakMonsters[Math.floor(Math.random() * weakMonsters.length)].id;
  }

  // Ultimate fallback - return the first monster card
  const firstMonster = cards.find((c: Card) => c.type === 'Monster');
  return firstMonster?.id || 1;
}
