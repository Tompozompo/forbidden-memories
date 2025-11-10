import type { Card } from '../types';

/**
 * Basic AI stub - just normal-summons the first monster in hand every turn
 */
export function getAIAction(hand: Card[]): { type: 'PLAY'; cardId: number; pos: 'atk' } | null {
  // Find first monster card in hand (type: "Monster")
  const firstMonster = hand.find(c => c.atk !== undefined && c.def !== undefined);
  
  if (firstMonster) {
    return { type: 'PLAY', cardId: firstMonster.id, pos: 'atk' };
  }
  
  return null;
}
