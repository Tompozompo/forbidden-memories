import { checkFusion } from './fusions';
import type { Card } from '../types';

export interface DuelState {
  turn: 0 | 1;
  lp: [number, number];
  hands: Card[][];
  decks: Card[][];
  fields: (Card | null)[][];
  graves: Card[][];
  phase: 'Draw' | 'Standby' | 'Main' | 'Battle' | 'End';
}

export const initialDuel = (p0Cards: Card[], p1Cards: Card[]): DuelState => ({
  turn: 0,
  lp: [8000, 8000],
  hands: [[], []],
  decks: [p0Cards, p1Cards],
  fields: [[null, null, null, null, null], [null, null, null, null, null]],
  graves: [[], []],
  phase: 'Draw',
});

// quick reducer shape
type Action =
  | { type: 'DRAW' }
  | { type: 'PLAY'; cardId: number; pos: 'atk' | 'def' }
  | { type: 'FUSE'; matA: number; matB: number };

export function duelReducer(state: DuelState, action: Action): DuelState {
  switch (action.type) {
    case 'DRAW': {
      const deck = state.decks[state.turn];
      if (!deck || deck.length === 0) return state; // nothing to draw
      const [card, ...rest] = deck;
      const newDecks = state.decks.map((d, i) => (i === state.turn ? rest : d)) as [Card[], Card[]];
      const newHands = state.hands.map((h, i) => (i === state.turn ? [...h, card] : h)) as [Card[], Card[]];
      return { ...state, decks: newDecks, hands: newHands };
    }
    case 'FUSE': {
      const resId = checkFusion(action.matA, action.matB);
      if (!resId) return state;

      // find the result card in the combined pool
      const pool = [...state.decks[0], ...state.decks[1], ...state.hands[0], ...state.hands[1]];
      const resCard = pool.find(c => c.id === resId);
      if (!resCard) return state;

      // remove materials, add result to current player's hand
      const newHands = state.hands.map((h, i) =>
        i === state.turn
          ? [...h.filter(c => c.id !== action.matA && c.id !== action.matB), resCard]
          : h
      ) as [Card[], Card[]];

      return { ...state, hands: newHands };
    }
    default:
      return state;
  }
}