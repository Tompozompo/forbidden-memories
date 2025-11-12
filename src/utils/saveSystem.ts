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
  ownedCards: Array.from({ length: 20 }, (_, i) => i + 1), // Start with first 20 cards
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
