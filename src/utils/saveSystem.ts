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

const DEFAULT_SAVE: GameSave = {
  starchips: 0,
  beatenIds: [],
  currentDeck: [],
  // Starting deck based on original game - mix of weak monsters
  ownedCards: [
    9,   // Shadow Specter
    24,  // Skull Servant
    58,  // Kuriboh
    8,   // Mushroom Man
    5,   // Ryu-kishin
    50,  // Basic Insect
    105, // Tomozaurus
    9,   // Shadow Specter (duplicate)
    24,  // Skull Servant (duplicate)
    29,  // Mountain Warrior
    123, // Dark Plant
    130, // Weather Control
    137, // Mystery Hand
    192, // Key Mace
    202, // Air Marmot of Nefariousness
    207, // Droll Bird
    210, // Hinotama Soul
    211, // Kaminarikozou
    212, // Meotoko
    237, // Haniwa
  ],
};

/**
 * Load save data from localStorage
 */
export function loadSave(): GameSave {
  try {
    const stored = localStorage.getItem(SAVE_KEY);
    if (!stored) {
      return { ...DEFAULT_SAVE };
    }
    
    const parsed = JSON.parse(stored);
    
    // Validate and merge with defaults
    return {
      starchips: typeof parsed.starchips === 'number' ? parsed.starchips : DEFAULT_SAVE.starchips,
      beatenIds: Array.isArray(parsed.beatenIds) ? parsed.beatenIds : DEFAULT_SAVE.beatenIds,
      currentDeck: Array.isArray(parsed.currentDeck) ? parsed.currentDeck : DEFAULT_SAVE.currentDeck,
      ownedCards: Array.isArray(parsed.ownedCards) ? parsed.ownedCards : DEFAULT_SAVE.ownedCards,
    };
  } catch (error) {
    console.error('Error loading save:', error);
    return { ...DEFAULT_SAVE };
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
