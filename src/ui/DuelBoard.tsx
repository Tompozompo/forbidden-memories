import { useEffect, useReducer } from 'react';
import { initialDuel, duelReducer } from '../engine/duel';
import type { Card } from '../types';

export default function DuelBoard({ p0Deck, p1Deck }: { p0Deck: Card[]; p1Deck: Card[] }) {
  const [state, dispatch] = useReducer(duelReducer, initialDuel(p0Deck, p1Deck));

  // draw a starting hand on mount (5 cards each by default)
  useEffect(() => {
    // draw 5 times for starting hand (simple approach)
    for (let i = 0; i < 5; i++) {
      dispatch({ type: 'DRAW' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-2">
      <div className="text-xs">LP: {state.lp[0]} vs {state.lp[1]}</div>
      <div className="text-xs">Phase: {state.phase}</div>

      {/* player hand */}
      <div className="flex gap-1 my-2">
        {state.hands[0].map((c: Card, i) => (
          <button key={i} className="border px-2 py-1 text-xs">{c.name}</button>
        ))}
      </div>

      {/* fake fuse test */}
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded"
        onClick={() => dispatch({ type: 'FUSE', matA: 1, matB: 2 })}
      >
        Test Fuse 1+2
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