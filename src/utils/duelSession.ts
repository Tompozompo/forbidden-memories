/**
 * DuelSession - Manages sessionStorage persistence for active duel state
 * This allows restoring a duel if the page is accidentally refreshed
 */

import type { DuelState } from '../engine/duel';

const DUEL_SESSION_KEY = 'fm-active-duel';

export interface DuelSessionData {
  state: DuelState;
  npcId: number;
  timestamp: number;
}

/**
 * Save active duel state to sessionStorage
 */
export function saveDuelSession(state: DuelState, npcId: number): void {
  try {
    const sessionData: DuelSessionData = {
      state,
      npcId,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(DUEL_SESSION_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Error saving duel session:', error);
  }
}

/**
 * Load active duel state from sessionStorage
 */
export function loadDuelSession(): DuelSessionData | null {
  try {
    const stored = sessionStorage.getItem(DUEL_SESSION_KEY);
    if (!stored) {
      return null;
    }
    
    const parsed = JSON.parse(stored) as DuelSessionData;
    
    // Validate the session data
    if (!parsed.state || typeof parsed.npcId !== 'number') {
      clearDuelSession();
      return null;
    }
    
    // Check if session is not too old (e.g., within 24 hours)
    const age = Date.now() - parsed.timestamp;
    const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
    if (age > MAX_AGE) {
      clearDuelSession();
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Error loading duel session:', error);
    clearDuelSession();
    return null;
  }
}

/**
 * Clear active duel session
 */
export function clearDuelSession(): void {
  try {
    sessionStorage.removeItem(DUEL_SESSION_KEY);
  } catch (error) {
    console.error('Error clearing duel session:', error);
  }
}

/**
 * Check if an active duel session exists
 */
export function hasDuelSession(): boolean {
  try {
    return sessionStorage.getItem(DUEL_SESSION_KEY) !== null;
  } catch {
    return false;
  }
}
