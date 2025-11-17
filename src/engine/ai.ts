import type { Card } from '../types';

export type AIAction = 
  | { type: 'SUMMON'; cardId: number; position: 'atk' | 'def' }
  | { type: 'ATTACK'; attackerId: number; targetPos: number }
  | { type: 'END_TURN' }
  | null;

/**
 * Improved AI logic:
 * 1. TODO: Check for fusion opportunities (not yet implemented)
 * 2. Summon the strongest available monster
 * 3. Attack strategically (direct attack if stronger, otherwise target weakest)
 * 4. TODO: Consider spell/trap cards in future iterations
 */
export function getAIAction(
  hand: Card[], 
  field: (Card | null)[], 
  opponentField: (Card | null)[],
  hasSummoned?: boolean,
  hasAttacked?: boolean
): AIAction {
  // TODO: Phase 1 - Check for fusion opportunities
  // When fusion is implemented, check if we can fuse two cards in hand
  // to create a stronger monster. This should be prioritized before summoning.
  
  // 1. Try to summon the strongest monster from hand if we have an empty field slot and haven't summoned yet
  const monsters = hand.filter(c => c.atk !== undefined && c.def !== undefined);
  const hasEmptySlot = field.some(slot => slot === null);
  
  if (monsters.length > 0 && hasEmptySlot && !hasSummoned) {
    // Find the strongest monster (highest ATK, tie-break by DEF)
    const strongestMonster = monsters.reduce((prev, curr) => {
      const prevAtk = prev.atk ?? 0;
      const currAtk = curr.atk ?? 0;
      if (currAtk > prevAtk) return curr;
      if (currAtk === prevAtk && (curr.def ?? 0) > (prev.def ?? 0)) return curr;
      return prev;
    });
    
    return { type: 'SUMMON', cardId: strongestMonster.id, position: 'atk' };
  }
  
  // 2. Attack strategically with the strongest monster on field
  const myMonsters = field.filter((c): c is Card => c !== null && c.atk !== undefined);
  if (myMonsters.length > 0 && !hasAttacked) {
    // Pick the strongest attacker (highest ATK)
    const attacker = myMonsters.reduce((prev, curr) => 
      (curr.atk ?? 0) > (prev.atk ?? 0) ? curr : prev
    );
    
    // Find opponent monsters
    const opponentMonsters = opponentField
      .map((c, idx) => ({ card: c, pos: idx }))
      .filter((slot): slot is { card: Card; pos: number } => 
        slot.card !== null && slot.card.atk !== undefined
      );
    
    if (opponentMonsters.length > 0) {
      // Strategy: Attack the weakest monster we can destroy, or go direct if we can't beat any
      const weakestOpponent = opponentMonsters.reduce((prev, curr) => 
        (curr.card.atk ?? 0) < (prev.card.atk ?? 0) ? curr : prev
      );
      
      // If we can beat at least one monster, attack the weakest one
      // Otherwise, direct attack (will take damage but deal damage too)
      if ((attacker.atk ?? 0) > (weakestOpponent.card.atk ?? 0)) {
        return { 
          type: 'ATTACK', 
          attackerId: attacker.id, 
          targetPos: weakestOpponent.pos 
        };
      } else {
        // Can't beat any monsters favorably, but still attack to deal damage
        // In PS1 style, both players take damage, so this is still strategic
        return { 
          type: 'ATTACK', 
          attackerId: attacker.id, 
          targetPos: weakestOpponent.pos 
        };
      }
    } else {
      // No opponent monsters - direct attack
      return { 
        type: 'ATTACK', 
        attackerId: attacker.id, 
        targetPos: 0 
      };
    }
  }
  
  // 3. TODO: Consider spell/trap cards
  // In future iterations, AI should:
  // - Activate equip spells on strongest monsters
  // - Use field spells when beneficial
  // - Set/activate trap cards strategically
  
  // No moves available, end turn
  return { type: 'END_TURN' };
}
