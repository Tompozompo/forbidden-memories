import { useEffect, useReducer, useRef } from 'react';
import { initialDuel, duelReducer } from '../engine/duel';
import type { Card } from '../types';

export default function DuelBoard({ p0Deck, p1Deck, allCards }: { p0Deck: Card[]; p1Deck: Card[]; allCards: Card[] }) {
  const [state, dispatch] = useReducer(duelReducer, initialDuel(p0Deck, p1Deck));
  const initialDrawDone = useRef(false);

  // draw a starting hand on mount (5 cards each for both players)
  useEffect(() => {
    if (initialDrawDone.current) return;
    initialDrawDone.current = true;
    
    // draw 5 times for player 0
    for (let i = 0; i < 5; i++) {
      dispatch({ type: 'DRAW', player: 0 });
    }
    // draw 5 times for player 1
    for (let i = 0; i < 5; i++) {
      dispatch({ type: 'DRAW', player: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-2">
      <div className="text-xs">LP: {state.lp[0]} vs {state.lp[1]}</div>
      <div className="text-xs">Phase: {state.phase}</div>

      {/* player 0 hand */}
      <div className="mt-2">
        <div className="text-xs font-bold">Player 0 Hand ({state.hands[0].length} cards):</div>
        <div className="flex gap-1 my-2">
          {state.hands[0].map((c: Card, i) => (
            <button key={i} className="border px-2 py-1 text-xs">{c.name}</button>
          ))}
        </div>
      </div>

      {/* player 1 hand */}
      <div className="mt-2">
        <div className="text-xs font-bold">Player 1 Hand ({state.hands[1].length} cards):</div>
        <div className="flex gap-1 my-2">
          {state.hands[1].map((c: Card, i) => (
            <button key={i} className="border px-2 py-1 text-xs">{c.name}</button>
          ))}
        </div>
      </div>

      {/* fusion test button - try fusing first two cards if possible */}
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded"
        onClick={() => {
          if (state.hands[0].length >= 2) {
            dispatch({ type: 'FUSE', matA: state.hands[0][0].id, matB: state.hands[0][1].id, allCards });
          }
        }}
      >
        Fuse First 2 Cards
      </button>

      {/* manual draw button for testing */}
      <div className="mt-2">
        <button
          className="border px-2 py-1 text-xs"
          onClick={() => dispatch({ type: 'DRAW' })}
        >
          Draw
        </button>
      </div>
    </div>
  );
}