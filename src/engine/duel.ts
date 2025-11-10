import { checkFusion } from './fusions';
import type { Card } from '../types';   // we’ll add this type file next

export interface DuelState {
  turn: 0 | 1;
  lp: [number, number];
  hands: Card[][];
  fields: (Card | null)[][];
  graves: Card[][];
  phase: 'Draw' | 'Standby' | 'Main' | 'Battle' | 'End';
}

export const initialDuel = (p0Deck: number[], p1Deck: number[]): DuelState => ({
  turn: 0,
  lp: [8000, 8000],
  hands: [[], []],
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
    case 'FUSE': {
      const res = checkFusion(action.matA, action.matB);
      if (!res) return state;
      // TODO: remove materials, add res to hand, etc.
      return { ...state };
    }
    default:
      return state;
  }
}