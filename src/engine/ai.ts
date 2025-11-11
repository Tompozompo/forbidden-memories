import type { Card } from '../types';

export type AIAction = 
  | { type: 'SUMMON'; cardId: number; position: 'atk' | 'def' }
  | { type: 'ATTACK'; attackerId: number; targetPos: number }
  | { type: 'END_TURN' }
  | null;

/**
 * Basic AI logic:
 * 1. If hand has monster → normal-summon first one (ATK position)
 * 2. If field has monster → attack opponent's lowest-ATK monster (or direct if none)
 * 3. Else just pass (END_TURN)
 */
export function getAIAction(
  hand: Card[], 
  field: (Card | null)[], 
  opponentField: (Card | null)[],
  hasSummoned?: boolean
): AIAction {
  // 1. Try to summon a monster from hand if we have an empty field slot and haven't summoned yet
  const firstMonster = hand.find(c => c.atk !== undefined && c.def !== undefined);
  const hasEmptySlot = field.some(slot => slot === null);
  
  if (firstMonster && hasEmptySlot && !hasSummoned) {
    return { type: 'SUMMON', cardId: firstMonster.id, position: 'atk' };
  }
  
  // 2. Try to attack with a monster on field
  const myMonsters = field.filter((c): c is Card => c !== null && c.atk !== undefined);
  if (myMonsters.length > 0) {
    // Pick first available attacker
    const attacker = myMonsters[0];
    
    // Find opponent monsters
    const opponentMonsters = opponentField
      .map((c, idx) => ({ card: c, pos: idx }))
      .filter((slot): slot is { card: Card; pos: number } => 
        slot.card !== null && slot.card.atk !== undefined
      );
    
    if (opponentMonsters.length > 0) {
      // Attack the lowest ATK monster
      const lowestAtkMonster = opponentMonsters.reduce((prev, curr) => 
        (curr.card.atk ?? 0) < (prev.card.atk ?? 0) ? curr : prev
      );
      return { 
        type: 'ATTACK', 
        attackerId: attacker.id, 
        targetPos: lowestAtkMonster.pos 
      };
    } else {
      // Direct attack (target position 0, but there's no monster there)
      return { 
        type: 'ATTACK', 
        attackerId: attacker.id, 
        targetPos: 0 
      };
    }
  }
  
  // 3. No moves available, just end turn
  return { type: 'END_TURN' };
}
