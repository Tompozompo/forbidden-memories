import { useReducer } from 'react';
import { initialDuel, duelReducer } from '../engine/duel';

export default function DuelBoard({ p0Deck, p1Deck }: { p0Deck: number[]; p1Deck: number[] }) {
  const [state, dispatch] = useReducer(duelReducer, initialDuel(p0Deck, p1Deck));

  // ultra-simple UI: just show hand and a fuse test
  return (
    <div className="p-2">
      <div className="text-xs">LP: {state.lp[0]} vs {state.lp[1]}</div>
      <div className="text-xs">Phase: {state.phase}</div>

      {/* player hand */}
      <div className="flex gap-1 my-2">
        {state.hands[0].map((c, i) => (
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
    </div>
  );
}
