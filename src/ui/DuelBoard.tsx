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
  const safetyTimeoutRef = useRef<number | null>(null);

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
      // Clear timeouts when turn changes away from AI
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
      }
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = null;
      }
      return;
    }
    
    // Don't start a new timeout if one is already running or AI is not ready
    if (aiTimeoutRef.current || !aiReady) return;
    
    // Start AI thinking
    setIsAIThinking(true);
    setAIReady(false);
    
    // 5-second safety timeout - force end turn if AI gets stuck
    safetyTimeoutRef.current = setTimeout(() => {
      console.warn('AI safety timeout triggered - forcing END_TURN');
      setIsAIThinking(false);
      dispatch({ type: 'END_TURN' });
      setAIReady(true);
      aiTimeoutRef.current = null;
      safetyTimeoutRef.current = null;
    }, 5000);
    
    // Schedule AI move after 1 second
    aiTimeoutRef.current = setTimeout(() => {
      aiTimeoutRef.current = null; // Clear immediately so effect can run again
      
      try {
        const aiAction = getAIAction(state.hands[1], state.fields[1], state.fields[0], state.hasSummoned[1]);
        
        if (aiAction) {
          dispatch(aiAction);
          
          // If action was END_TURN, clear thinking state immediately
          if (aiAction.type === 'END_TURN') {
            setIsAIThinking(false);
            setAIReady(true);
            if (safetyTimeoutRef.current) {
              clearTimeout(safetyTimeoutRef.current);
              safetyTimeoutRef.current = null;
            }
          } else {
            // For SUMMON or ATTACK, wait a bit then allow next action
            setTimeout(() => {
              setAIReady(true);
            }, 500);
          }
        } else {
          // No action - shouldn't happen, but end turn as safety
          setIsAIThinking(false);
          setAIReady(true);
          dispatch({ type: 'END_TURN' });
          if (safetyTimeoutRef.current) {
            clearTimeout(safetyTimeoutRef.current);
            safetyTimeoutRef.current = null;
          }
        }
      } catch (error) {
        console.error('AI action error:', error);
        // On error, force end turn
        setIsAIThinking(false);
        setAIReady(true);
        dispatch({ type: 'END_TURN' });
        if (safetyTimeoutRef.current) {
          clearTimeout(safetyTimeoutRef.current);
          safetyTimeoutRef.current = null;
        }
      }
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
    <div style={{ padding: '8px' }}>
      <div style={{ fontSize: '12px' }}>LP: {state.lp[0]} vs {state.lp[1]}</div>
      <div style={{ fontSize: '12px' }}>Phase: {state.phase}</div>
      <div style={{ fontSize: '12px' }}>Current Turn: Player {state.turn}</div>

      {/* AI thinking banner */}
      {isAIThinking && (
        <div style={{ margin: '8px 0', padding: '8px', backgroundColor: '#2196f3', border: '2px solid #4488ff', borderRadius: '5px', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Rex is thinking...</span>
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
      <div style={{ marginTop: '8px' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
          Player 1 Hand ({state.hands[1].length} cards)
          {state.hasSummoned[1] && <span style={{ color: '#888', marginLeft: '8px' }}>(already summoned)</span>}
        </div>
        <div style={{ display: 'flex', gap: '4px', margin: '8px 0' }}>
          {state.hands[1].map((c: Card, i) => (
            state.turn === 1 && !state.hasSummoned[1] ? (
              <DraggableCard 
                key={i} 
                card={c} 
                onDragEnd={(target) => handleCardDrop(c, target)}
              />
            ) : (
              <button key={i} style={{ fontSize: '8px', padding: '4px 8px' }}>{c.name}</button>
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
      <div style={{ marginTop: '8px' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
          Player 0 Hand ({state.hands[0].length} cards)
          {state.hasSummoned[0] && <span style={{ color: '#888', marginLeft: '8px' }}>(already summoned)</span>}
        </div>
        <div style={{ display: 'flex', gap: '4px', margin: '8px 0' }}>
          {state.hands[0].map((c: Card, i) => (
            state.turn === 0 && !state.hasSummoned[0] ? (
              <DraggableCard 
                key={i} 
                card={c} 
                onDragEnd={(target) => handleCardDrop(c, target)}
              />
            ) : (
              <button key={i} style={{ fontSize: '8px', padding: '4px 8px' }}>{c.name}</button>
            )
          ))}
        </div>
      </div>

      {/* Attack confirmation UI */}
      {attackPreview && selectedAttacker && (
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#ff8800', border: '2px solid #ffaa00', borderRadius: '5px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
            {attackPreview.isDirect 
              ? `Direct Attack: ${attackPreview.damage} → ${state.lp[state.turn === 0 ? 1 : 0]} LP`
              : `Battle: ${attackPreview.damage} ATK vs Enemy Monster`
            }
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{ backgroundColor: '#cc0000', padding: '8px 16px', fontWeight: 'bold' }}
              onClick={confirmAttack}
            >
              Confirm Attack
            </button>
            <button
              onClick={cancelAttack}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* fusion test button - try fusing first two cards if possible */}
      <button
        style={{ backgroundColor: '#2196f3', padding: '8px 12px' }}
        onClick={() => {
          if (state.hands[0].length >= 2) {
            dispatch({ type: 'FUSE', matA: state.hands[0][0].id, matB: state.hands[0][1].id, allCards });
          }
        }}
      >
        Fuse First 2 Cards
      </button>

      {/* manual draw button for testing */}
      <div style={{ marginTop: '8px' }}>
        <button
          style={{ padding: '8px', fontSize: '10px' }}
          onClick={() => dispatch({ type: 'DRAW' })}
        >
          Draw
        </button>
        <button
          style={{ marginLeft: '8px', backgroundColor: '#2196f3', padding: '8px', fontSize: '10px' }}
          onClick={() => dispatch({ type: 'END_TURN' })}
          disabled={state.turn !== 0}
        >
          End Turn
        </button>
      </div>
    </div>
  );
}