import { checkFusion } from './fusions';
import type { Card } from '../types';

// Fisher-Yates shuffle
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export interface DuelState {
  turn: 0 | 1;
  lp: [number, number];
  hands: Card[][];
  decks: Card[][];
  fields: (Card | null)[][]; // Monster zones (5 per player)
  spellTraps: (Card | null)[][]; // Spell/Trap zones (5 per player)
  graves: Card[][];
  phase: 'Draw' | 'Standby' | 'Main' | 'Battle' | 'End';
  hasSummoned: [boolean, boolean];
  hasAttacked: [boolean, boolean];
}

export const initialDuel = (p0Cards: Card[], p1Cards: Card[]): DuelState => {
  // Pick 20 random cards for each player from the full pool and shuffle
  const p0Deck = shuffle(p0Cards.slice(0, 20));
  const p1Deck = shuffle(p1Cards.slice(0, 20));
  
  return {
    turn: 0,
    lp: [8000, 8000],
    hands: [[], []],
    decks: [p0Deck, p1Deck],
    fields: [[null, null, null, null, null], [null, null, null, null, null]],
    spellTraps: [[null, null, null, null, null], [null, null, null, null, null]],
    graves: [[], []],
    phase: 'Draw',
    hasSummoned: [false, false],
    hasAttacked: [false, false],
  };
};

// quick reducer shape
type Action =
  | { type: 'DRAW'; player?: 0 | 1 }
  | { type: 'PLAY'; cardId: number; pos: 'atk' | 'def' }
  | { type: 'FUSE'; matA: number; matB: number; allCards: Card[] }
  | { type: 'SUMMON'; cardId: number; position: 'atk' | 'def' }
  | { type: 'ATTACK'; attackerId: number; targetPos: number }
  | { type: 'END_TURN' };

export function duelReducer(state: DuelState, action: Action): DuelState {
  switch (action.type) {
    case 'DRAW': {
      const player = action.player ?? state.turn;
      const deck = state.decks[player];
      if (!deck || deck.length === 0) return state; // nothing to draw
      const [card, ...rest] = deck;
      const newDecks = state.decks.map((d, i) => (i === player ? rest : d)) as [Card[], Card[]];
      const newHands = state.hands.map((h, i) => (i === player ? [...h, card] : h)) as [Card[], Card[]];
      return { ...state, decks: newDecks, hands: newHands };
    }
    case 'FUSE': {
      const resId = checkFusion(action.matA, action.matB);
      if (!resId) return state;

      // find the result card in all available cards
      const resCard = action.allCards.find(c => c.id === resId);
      if (!resCard) return state;

      // remove materials, add result to current player's hand
      const newHands = state.hands.map((h, i) =>
        i === state.turn
          ? [...h.filter(c => c.id !== action.matA && c.id !== action.matB), resCard]
          : h
      ) as [Card[], Card[]];

      return { ...state, hands: newHands };
    }
    case 'SUMMON': {
      const player = state.turn;
      
      // Check if player has already summoned this turn
      if (state.hasSummoned[player]) {
        return state; // Reject summon if already summoned
      }
      
      const card = state.hands[player].find(c => c.id === action.cardId);
      if (!card) return state;

      // find first empty slot
      const emptySlotIndex = state.fields[player].findIndex(slot => slot === null);
      if (emptySlotIndex === -1) return state; // no empty slots

      // remove card from hand
      const newHands = state.hands.map((h, i) =>
        i === player ? h.filter(c => c.id !== action.cardId) : h
      ) as [Card[], Card[]];

      // place card on field
      const newFields = state.fields.map((f, i) =>
        i === player
          ? f.map((slot, idx) => (idx === emptySlotIndex ? card : slot))
          : f
      ) as [(Card | null)[], (Card | null)[]];

      // Set hasSummoned to true for the current player
      const newHasSummoned = state.hasSummoned.map((s, i) => 
        i === player ? true : s
      ) as [boolean, boolean];

      // switch to Battle phase after summoning
      return { ...state, hands: newHands, fields: newFields, phase: 'Battle', hasSummoned: newHasSummoned };
    }
    case 'ATTACK': {
      const player = state.turn;
      const opponent = player === 0 ? 1 : 0;
      
      // Check if player has already attacked this turn
      if (state.hasAttacked[player]) {
        return state; // Reject attack if already attacked
      }
      
      // find attacker on current player's field
      const attacker = state.fields[player].find(c => c?.id === action.attackerId);
      if (!attacker || !attacker.atk) return state;
      
      // check if target position has a monster
      const defender = state.fields[opponent][action.targetPos];
      
      let newLp = [...state.lp] as [number, number];
      let newFields = state.fields.map(f => [...f]) as [(Card | null)[], (Card | null)[]];
      let newGraves = state.graves.map(g => [...g]) as [Card[], Card[]];
      
      if (defender && defender.atk !== undefined) {
        // Monster vs Monster battle (PS1 style - both take damage)
        const attackerAtk = attacker.atk;
        const defenderAtk = defender.atk;
        
        // Apply battle damage to both players
        newLp[player] -= defenderAtk;
        newLp[opponent] -= attackerAtk;
        
        // Destroy monsters if ATK is higher than opponent's
        if (attackerAtk < defenderAtk) {
          // Attacker destroyed
          const attackerIdx = newFields[player].findIndex(c => c?.id === action.attackerId);
          if (attackerIdx !== -1) {
            newGraves[player].push(attacker);
            newFields[player][attackerIdx] = null;
          }
        }
        if (defenderAtk < attackerAtk) {
          // Defender destroyed
          newGraves[opponent].push(defender);
          newFields[opponent][action.targetPos] = null;
        }
        if (attackerAtk === defenderAtk) {
          // Both destroyed
          const attackerIdx = newFields[player].findIndex(c => c?.id === action.attackerId);
          if (attackerIdx !== -1) {
            newGraves[player].push(attacker);
            newFields[player][attackerIdx] = null;
          }
          newGraves[opponent].push(defender);
          newFields[opponent][action.targetPos] = null;
        }
      } else {
        // Direct attack - reduce opponent LP by attacker's ATK
        newLp[opponent] -= attacker.atk;
      }
      
      // Set hasAttacked to true for the current player
      const newHasAttacked = state.hasAttacked.map((s, i) => 
        i === player ? true : s
      ) as [boolean, boolean];
      
      return { 
        ...state, 
        lp: newLp, 
        fields: newFields, 
        graves: newGraves,
        hasAttacked: newHasAttacked
      };
    }
    case 'END_TURN': {
      // Flip turn to the other player
      const newTurn = state.turn === 0 ? 1 : 0;
      
      // Reset hasSummoned and hasAttacked for both players at turn end
      const newHasSummoned: [boolean, boolean] = [false, false];
      const newHasAttacked: [boolean, boolean] = [false, false];
      
      // Draw 1 card for the new player
      const deck = state.decks[newTurn];
      if (!deck || deck.length === 0) {
        // No card to draw, just flip turn
        return { ...state, turn: newTurn, phase: 'Draw', hasSummoned: newHasSummoned, hasAttacked: newHasAttacked };
      }
      
      const [card, ...rest] = deck;
      const newDecks = state.decks.map((d, i) => (i === newTurn ? rest : d)) as [Card[], Card[]];
      const newHands = state.hands.map((h, i) => (i === newTurn ? [...h, card] : h)) as [Card[], Card[]];
      
      return { 
        ...state, 
        decks: newDecks, 
        hands: newHands, 
        turn: newTurn, 
        phase: 'Draw',
        hasSummoned: newHasSummoned,
        hasAttacked: newHasAttacked
      };
    }
    default:
      return state;
  }
}