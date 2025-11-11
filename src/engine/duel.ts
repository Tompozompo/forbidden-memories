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
  fields: (Card | null)[][];
  graves: Card[][];
  phase: 'Draw' | 'Standby' | 'Main' | 'Battle' | 'End';
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
    graves: [[], []],
    phase: 'Draw',
  };
};

// quick reducer shape
type Action =
  | { type: 'DRAW'; player?: 0 | 1 }
  | { type: 'PLAY'; cardId: number; pos: 'atk' | 'def' }
  | { type: 'FUSE'; matA: number; matB: number; allCards: Card[] }
  | { type: 'SUMMON'; cardId: number; position: 'atk' | 'def' };

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

      // switch to Battle phase after summoning
      return { ...state, hands: newHands, fields: newFields, phase: 'Battle' };
    }
    default:
      return state;
  }
}