import { useEffect, useReducer, useRef, useState } from 'react';
import { initialDuel, duelReducer } from '../engine/duel';
import { getAIAction } from '../engine/ai';
import type { Card } from '../types';
import FieldZone from './FieldZone';
import DraggableCard from './DraggableCard';

export default function DuelBoard({ p0Deck, p1Deck, allCards }: { p0Deck: Card[]; p1Deck: Card[]; allCards: Card[] }) {
  const [state, dispatch] = useReducer(duelReducer, initialDuel(p0Deck, p1Deck));
  const initialDrawDone = useRef(false);
  const aiTimeoutRef = useRef<number | null>(null);
  const [selectedAttacker, setSelectedAttacker] = useState<{ cardId: number; playerIdx: number } | null>(null);
  const [attackPreview, setAttackPreview] = useState<{ damage: number; targetPos: number; isDirect: boolean } | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [aiReady, setAIReady] = useState(true); // Controls when AI can make next move

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

  // AI turn loop - auto-queue AI moves when it's player 1's turn
  useEffect(() => {
    if (state.turn !== 1) {
      setIsAIThinking(false);
      setAIReady(true);
      // Clear timeout when turn changes away from AI
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
      }
      return;
    }
    
    // Don't start a new timeout if one is already running or AI is not ready
    if (aiTimeoutRef.current || !aiReady) return;
    
    // Start AI thinking
    setIsAIThinking(true);
    setAIReady(false);
    
    // Schedule AI move after 1 second
    aiTimeoutRef.current = setTimeout(() => {
      const aiAction = getAIAction(state.hands[1], state.fields[1], state.fields[0]);
      
      if (aiAction) {
        dispatch(aiAction);
        
        // Set ready flag after cooldown to allow next action
        setTimeout(() => {
          setAIReady(true);
        }, 500); // 500ms cooldown before next action can start
      } else {
        setIsAIThinking(false);
        setAIReady(true);
      }
      
      aiTimeoutRef.current = null;
    }, 1000);
  }, [state.turn, state.phase, state.fields[1].filter(c => c !== null).length, aiReady]);

  const handleCardDrop = (card: Card, target: HTMLElement | null) => {
    if (!target) return;
    
    // check if dropped on a field zone slot
    const slot = target.closest('[data-slot]') as HTMLElement;
    const player = slot?.dataset?.player;
    
    // only allow dropping on current player's field
    if (player !== undefined && Number(player) === state.turn) {
      dispatch({ type: 'SUMMON', cardId: card.id, position: 'atk' });
    }
  };

  const handleFieldZoneClick = (player: 0 | 1, zoneIndex: number, card: Card | null) => {
    // Can only attack during Battle phase
    if (state.phase !== 'Battle') return;

    const currentPlayer = state.turn;
    
    if (player === currentPlayer) {
      // Clicking own monster - select as attacker
      if (card) {
        setSelectedAttacker({ cardId: card.id, playerIdx: player });
        setAttackPreview(null);
      }
    } else {
      // Clicking opponent's field - set as target if we have an attacker selected
      if (selectedAttacker && selectedAttacker.playerIdx === currentPlayer) {
        const attacker = state.fields[currentPlayer].find(c => c?.id === selectedAttacker.cardId);
        if (attacker && attacker.atk !== undefined) {
          const isDirect = !card;
          const damage = attacker.atk;
          setAttackPreview({ damage, targetPos: zoneIndex, isDirect });
        }
      }
    }
  };

  const confirmAttack = () => {
    if (!selectedAttacker || !attackPreview) return;
    
    dispatch({
      type: 'ATTACK',
      attackerId: selectedAttacker.cardId,
      targetPos: attackPreview.targetPos,
    });
    
    // Reset selection
    setSelectedAttacker(null);
    setAttackPreview(null);
  };

  const cancelAttack = () => {
    setSelectedAttacker(null);
    setAttackPreview(null);
  };

  return (
    <div className="p-2">
      <div className="text-xs">LP: {state.lp[0]} vs {state.lp[1]}</div>
      <div className="text-xs">Phase: {state.phase}</div>
      <div className="text-xs">Current Turn: Player {state.turn}</div>

      {/* AI thinking banner */}
      {isAIThinking && (
        <div className="my-2 p-2 bg-blue-100 border border-blue-300 rounded text-center">
          <span className="text-sm font-semibold">Rex is thinking...</span>
        </div>
      )}

      {/* Player 1 Field (opponent on top) */}
      <FieldZone 
        player={1} 
        monsters={state.fields[1]} 
        isActive={state.turn === 1}
        onZoneClick={(idx, card) => handleFieldZoneClick(1, idx, card)}
        highlightedZone={attackPreview && state.turn === 0 ? attackPreview.targetPos : null}
      />

      {/* player 1 hand */}
      <div className="mt-2">
        <div className="text-xs font-bold">
          Player 1 Hand ({state.hands[1].length} cards)
          {state.hasSummoned[1] && <span className="text-gray-500 ml-2">(already summoned)</span>}
        </div>
        <div className="flex gap-1 my-2">
          {state.hands[1].map((c: Card, i) => (
            state.turn === 1 && !state.hasSummoned[1] ? (
              <DraggableCard 
                key={i} 
                card={c} 
                onDragEnd={(target) => handleCardDrop(c, target)}
              />
            ) : (
              <button key={i} className="border px-2 py-1 text-xs bg-gray-100">{c.name}</button>
            )
          ))}
        </div>
      </div>

      {/* Player 0 Field */}
      <FieldZone 
        player={0} 
        monsters={state.fields[0]} 
        isActive={state.turn === 0}
        onZoneClick={(idx, card) => handleFieldZoneClick(0, idx, card)}
        highlightedZone={attackPreview && state.turn === 1 ? attackPreview.targetPos : null}
      />

      {/* player 0 hand */}
      <div className="mt-2">
        <div className="text-xs font-bold">
          Player 0 Hand ({state.hands[0].length} cards)
          {state.hasSummoned[0] && <span className="text-gray-500 ml-2">(already summoned)</span>}
        </div>
        <div className="flex gap-1 my-2">
          {state.hands[0].map((c: Card, i) => (
            state.turn === 0 && !state.hasSummoned[0] ? (
              <DraggableCard 
                key={i} 
                card={c} 
                onDragEnd={(target) => handleCardDrop(c, target)}
              />
            ) : (
              <button key={i} className="border px-2 py-1 text-xs bg-gray-100">{c.name}</button>
            )
          ))}
        </div>
      </div>

      {/* Attack confirmation UI */}
      {attackPreview && selectedAttacker && (
        <div className="mt-4 p-3 bg-yellow-100 border-2 border-yellow-500 rounded">
          <div className="text-sm font-bold mb-2">
            {attackPreview.isDirect 
              ? `Direct Attack: ${attackPreview.damage} → ${state.lp[state.turn === 0 ? 1 : 0]} LP`
              : `Battle: ${attackPreview.damage} ATK vs Enemy Monster`
            }
          </div>
          <div className="flex gap-2">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded font-bold"
              onClick={confirmAttack}
            >
              Confirm Attack
            </button>
            <button
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={cancelAttack}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
        <button
          className="border px-2 py-1 text-xs ml-2 bg-blue-500 text-white"
          onClick={() => dispatch({ type: 'END_TURN' })}
          disabled={state.turn !== 0}
        >
          End Turn
        </button>
      </div>
    </div>
  );
}