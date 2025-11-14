import { useEffect, useReducer, useRef, useState } from 'react';
import { initialDuel, duelReducer, type DuelState } from '../engine/duel';
import { getAIAction } from '../engine/ai';
import type { Card } from '../types';
import FieldZone from './FieldZone';
import SpellTrapZone from './SpellTrapZone';
import DraggableCard from './DraggableCard';
import CardComponent from './Card';

interface DuelBoardProps {
  p0Deck: Card[];
  p1Deck: Card[];
  allCards: Card[];
  initialState?: DuelState;
  onStateChange?: (state: DuelState) => void;
  onVictory?: () => void;
  onDefeat?: () => void;
}

export default function DuelBoard({ p0Deck, p1Deck, allCards, initialState, onStateChange }: DuelBoardProps) {
  const [state, dispatch] = useReducer(duelReducer, initialState || initialDuel(p0Deck, p1Deck));
  const initialDrawDone = useRef(false);
  const aiTimeoutRef = useRef<number | null>(null);
  const [selectedAttacker, setSelectedAttacker] = useState<{ cardId: number; playerIdx: number } | null>(null);
  const [attackPreview, setAttackPreview] = useState<{ damage: number; targetPos: number; isDirect: boolean } | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [aiReady, setAIReady] = useState(true); // Controls when AI can make next move
  const safetyTimeoutRef = useRef<number | null>(null);
  const turnEndedRef = useRef(false); // Track if END_TURN was already dispatched
  const [attackingZone, setAttackingZone] = useState<{ player: number; zone: number } | null>(null);
  const [defendingZone, setDefendingZone] = useState<{ player: number; zone: number } | null>(null);
  const [fusingCards, setFusingCards] = useState<number[]>([]);
  const [selectedForFusion, setSelectedForFusion] = useState<number[]>([]); // Track cards selected for fusion
  const [fuseMode, setFuseMode] = useState(false); // Track if we're in fusion selection mode
  const gameOverTriggered = useRef(false); // Prevent multiple game-over triggers

  // Check for victory/defeat conditions
  useEffect(() => {
    if (gameOverTriggered.current) return;
    
    // Player 0 (user) loses
    if (state.lp[0] <= 0) {
      gameOverTriggered.current = true;
      if (onDefeat) {
        // Small delay to let the UI update
        setTimeout(() => onDefeat(), 500);
      }
    }
    
    // Player 1 (opponent) loses
    if (state.lp[1] <= 0) {
      gameOverTriggered.current = true;
      if (onVictory) {
        // Small delay to let the UI update
        setTimeout(() => onVictory(), 500);
      }
    }
  }, [state.lp, onVictory, onDefeat]);

  // Notify parent of state changes (skip initial mount)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (onStateChange) {
      onStateChange(state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]); // Only depend on state, not onStateChange to avoid infinite loops

  // draw a starting hand on mount (5 cards each for both players) - only if no initial state provided
  useEffect(() => {
    if (initialDrawDone.current || initialState) return;
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
      turnEndedRef.current = false; // Reset the flag when it's not AI's turn
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
    
    // Only create safety timeout if it doesn't exist yet (first action of the turn)
    if (!safetyTimeoutRef.current) {
      safetyTimeoutRef.current = setTimeout(() => {
        // Only force END_TURN if turn hasn't already ended
        if (!turnEndedRef.current) {
          console.warn('AI safety timeout triggered - forcing END_TURN');
          turnEndedRef.current = true;
          setIsAIThinking(false);
          dispatch({ type: 'END_TURN' });
          setAIReady(true);
        }
        aiTimeoutRef.current = null;
        safetyTimeoutRef.current = null;
      }, 5000);
    }
    
    // Schedule AI move after 1 second
    aiTimeoutRef.current = setTimeout(() => {
      aiTimeoutRef.current = null; // Clear immediately so effect can run again
      
      try {
        const aiAction = getAIAction(state.hands[1], state.fields[1], state.fields[0], state.hasSummoned[1], state.hasAttacked[1]);
        
        if (aiAction) {
          dispatch(aiAction);
          
           // If action was END_TURN, clear thinking state immediately
          if (aiAction.type === 'END_TURN') {
            turnEndedRef.current = true; // Mark that turn has ended
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
    
    // Find attacker zone
    const currentPlayer = selectedAttacker.playerIdx;
    const attackerZone = state.fields[currentPlayer].findIndex(c => c?.id === selectedAttacker.cardId);
    const targetPlayer = currentPlayer === 0 ? 1 : 0;
    
    // Trigger attack animations
    setAttackingZone({ player: currentPlayer, zone: attackerZone });
    setDefendingZone({ player: targetPlayer, zone: attackPreview.targetPos });
    
    // Clear animations after they complete
    setTimeout(() => {
      setAttackingZone(null);
      setDefendingZone(null);
    }, 300);
    
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

  const handleCardClick = (cardId: number) => {
    // Only allow card selection in fuse mode
    if (!fuseMode || state.turn !== 0) return;
    
    if (selectedForFusion.includes(cardId)) {
      // Deselect card
      setSelectedForFusion(selectedForFusion.filter(id => id !== cardId));
    } else if (selectedForFusion.length < 2) {
      // Select card (max 2)
      setSelectedForFusion([...selectedForFusion, cardId]);
    }
  };

  const handleFuseClick = () => {
    if (!fuseMode) {
      // Enter fusion mode
      setFuseMode(true);
      setSelectedForFusion([]);
    } else if (selectedForFusion.length === 2) {
      // Execute fusion
      setFusingCards([...selectedForFusion]);
      
      // Wait for animation before dispatching
      setTimeout(() => {
        dispatch({ type: 'FUSE', matA: selectedForFusion[0], matB: selectedForFusion[1], allCards });
        setFusingCards([]);
        setSelectedForFusion([]);
        setFuseMode(false);
      }, 600);
    }
  };

  const handleCancelFuse = () => {
    setFuseMode(false);
    setSelectedForFusion([]);
  };


  return (
    <div style={{ padding: '4px', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header Info - Yu-Gi-Oh Style */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '8px',
        padding: '8px 12px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '8px',
        border: '2px solid #0f3460',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      }}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
          <div style={{ 
            fontSize: 'clamp(8px, 2vw, 10px)',
            color: '#aaa',
            marginBottom: '2px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Your LP
          </div>
          <div style={{ 
            fontSize: 'clamp(16px, 4vw, 24px)',
            fontWeight: 'bold',
            color: state.lp[0] <= 2000 ? '#ff4444' : state.lp[0] <= 4000 ? '#ffaa00' : '#00ff88',
            textShadow: state.lp[0] <= 2000 ? '0 0 10px rgba(255, 68, 68, 0.5)' : '0 0 10px rgba(0, 255, 136, 0.3)',
            fontFamily: 'monospace',
          }}>
            {state.lp[0]}
          </div>
        </div>
        
        <div style={{ 
          fontSize: 'clamp(9px, 2.2vw, 12px)',
          color: '#888',
          padding: '4px 8px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '4px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          {state.phase}
        </div>
        
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}>
          <div style={{ 
            fontSize: 'clamp(8px, 2vw, 10px)',
            color: '#aaa',
            marginBottom: '2px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Opponent LP
          </div>
          <div style={{ 
            fontSize: 'clamp(16px, 4vw, 24px)',
            fontWeight: 'bold',
            color: state.lp[1] <= 2000 ? '#ff4444' : state.lp[1] <= 4000 ? '#ffaa00' : '#ff6b6b',
            textShadow: state.lp[1] <= 2000 ? '0 0 10px rgba(255, 68, 68, 0.5)' : '0 0 10px rgba(255, 107, 107, 0.3)',
            fontFamily: 'monospace',
          }}>
            {state.lp[1]}
          </div>
        </div>
      </div>

      {/* AI thinking banner */}
      {isAIThinking && (
        <div style={{ margin: '4px 0', padding: '6px', backgroundColor: '#2196f3', border: '2px solid #4488ff', borderRadius: '4px', textAlign: 'center' }}>
          <span style={{ fontSize: 'clamp(9px, 2.5vw, 12px)', fontWeight: 'bold' }}>Rex is thinking...</span>
        </div>
      )}

      {/* Fusion mode banner */}
      {fuseMode && (
        <div style={{ margin: '4px 0', padding: '6px', backgroundColor: '#ff8800', border: '2px solid #ffaa00', borderRadius: '4px', textAlign: 'center' }}>
          <span style={{ fontSize: 'clamp(9px, 2.5vw, 12px)', fontWeight: 'bold' }}>
            Fusion Mode: Select 2 cards from your hand ({selectedForFusion.length}/2 selected)
          </span>
        </div>
      )}

      {/* First turn attack restriction banner */}
      {state.turnCount === 1 && state.phase === 'Battle' && state.turn === 0 && (
        <div style={{ margin: '4px 0', padding: '6px', backgroundColor: '#cc0000', border: '2px solid #ff4444', borderRadius: '4px', textAlign: 'center' }}>
          <span style={{ fontSize: 'clamp(9px, 2.5vw, 12px)', fontWeight: 'bold' }}>Cannot attack on the first turn!</span>
        </div>
      )}

      {/* ========== OPPONENT SIDE (Player 1) ========== */}
      <div style={{ 
        padding: 'clamp(6px, 2vw, 12px)', 
        backgroundColor: '#0a0a0a', 
        borderRadius: '8px',
        marginBottom: '8px',
        border: state.turn === 1 ? '2px solid #ff4444' : '2px solid #333'
      }}>
        {/* Opponent Hand - HIDDEN */}
        <div style={{ marginBottom: '4px' }}>
          <div style={{ fontSize: 'clamp(8px, 2vw, 11px)', fontWeight: 'bold', marginBottom: '4px', color: '#888' }}>
            Opponent Hand ({state.hands[1].length} cards)
          </div>
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {state.hands[1].map((_, i) => (
              <div
                key={i}
                style={{
                  width: 'clamp(35px, 10vw, 50px)',
                  height: 'clamp(49px, 14vw, 70px)',
                  backgroundColor: '#4a2a2a',
                  border: '2px solid #666',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'clamp(14px, 4vw, 20px)'
                }}
              >
                🂠
              </div>
            ))}
          </div>
        </div>

        {/* Opponent Spell/Trap Zone (Behind/Above Monster Zone) */}
        <SpellTrapZone 
          player={1} 
          cards={state.spellTraps[1]} 
          isActive={state.turn === 1}
        />

        {/* Opponent Monster Field */}
        <FieldZone 
          player={1} 
          monsters={state.fields[1]} 
          isActive={state.turn === 1}
          onZoneClick={(idx, card) => handleFieldZoneClick(1, idx, card)}
          highlightedZone={attackPreview && state.turn === 0 ? attackPreview.targetPos : null}
          attackingZone={attackingZone?.player === 1 ? attackingZone.zone : null}
          defendingZone={defendingZone?.player === 1 ? defendingZone.zone : null}
        />
      </div>

      {/* ========== PLAYER SIDE (Player 0) ========== */}
      <div style={{ 
        padding: 'clamp(6px, 2vw, 12px)', 
        backgroundColor: '#0a0a0a', 
        borderRadius: '8px',
        border: state.turn === 0 ? '2px solid #4444ff' : '2px solid #333'
      }}>
        {/* Player Monster Field */}
        <FieldZone 
          player={0} 
          monsters={state.fields[0]} 
          isActive={state.turn === 0}
          onZoneClick={(idx, card) => handleFieldZoneClick(0, idx, card)}
          highlightedZone={attackPreview && state.turn === 1 ? attackPreview.targetPos : null}
          attackingZone={attackingZone?.player === 0 ? attackingZone.zone : null}
          defendingZone={defendingZone?.player === 0 ? defendingZone.zone : null}
        />

        {/* Player Spell/Trap Zone (Behind/Below Monster Zone) */}
        <SpellTrapZone 
          player={0} 
          cards={state.spellTraps[0]} 
          isActive={state.turn === 0}
        />

        {/* Player Hand */}
        <div style={{ marginTop: '8px' }}>
          <div style={{ fontSize: 'clamp(8px, 2vw, 11px)', fontWeight: 'bold', marginBottom: '4px' }}>
            Your Hand ({state.hands[0].length} cards)
            {state.hasSummoned[0] && <span style={{ color: '#888', marginLeft: '8px' }}>(summoned)</span>}
            {state.hasAttacked[0] && <span style={{ color: '#888', marginLeft: '8px' }}>(attacked)</span>}
          </div>
          <div className="hand">
            {state.hands[0].map((c: Card, i) => {
              const isFusing = fusingCards.includes(c.id);
              const isSelectedForFusion = selectedForFusion.includes(c.id);
              const zIndex = i; // Rightmost card has highest z-index
              
              return state.turn === 0 && !state.hasSummoned[0] ? (
                <div 
                  key={i} 
                  className={isFusing ? 'flash burst' : ''}
                  style={{
                    width: 'clamp(60px, 15vw, 80px)',
                    height: 'clamp(84px, 21vw, 112px)',
                    display: 'inline-block',
                    zIndex,
                    cursor: fuseMode ? 'pointer' : 'grab',
                    border: isSelectedForFusion ? '3px solid #ffaa00' : 'none',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                  }}
                  onClick={() => handleCardClick(c.id)}
                >
                  <DraggableCard 
                    card={c} 
                    onDragEnd={(target) => handleCardDrop(c, target)}
                  />
                </div>
              ) : (
                <div
                  key={i}
                  className="card"
                  style={{
                    width: 'clamp(60px, 15vw, 80px)',
                    height: 'clamp(84px, 21vw, 112px)',
                    display: 'inline-block',
                    zIndex,
                    margin: 0,
                    cursor: fuseMode && state.turn === 0 ? 'pointer' : 'default',
                    border: isSelectedForFusion ? '3px solid #ffaa00' : 'none',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                  }}
                  onClick={() => handleCardClick(c.id)}
                >
                  <CardComponent card={c} size="small" style={{ width: '100%', height: '100%' }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Attack confirmation UI */}
      {attackPreview && selectedAttacker && (
        <div style={{ 
          marginTop: '8px', 
          padding: '8px', 
          backgroundColor: '#ff8800', 
          border: '2px solid #ffaa00', 
          borderRadius: '8px',
          width: '100%',
          maxWidth: '800px',
          margin: '8px auto'
        }}>
          <div style={{ fontSize: 'clamp(9px, 2.5vw, 12px)', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>
            {attackPreview.isDirect 
              ? `Direct Attack: ${attackPreview.damage} damage → ${state.lp[state.turn === 0 ? 1 : 0] - attackPreview.damage} LP`
              : `Battle: ${attackPreview.damage} ATK vs Enemy Monster`
            }
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              style={{ backgroundColor: '#cc0000', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer', fontSize: 'clamp(9px, 2.5vw, 11px)' }}
              onClick={confirmAttack}
            >
              Confirm Attack
            </button>
            <button
              style={{ padding: '8px 16px', cursor: 'pointer', fontSize: 'clamp(9px, 2.5vw, 11px)' }}
              onClick={cancelAttack}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div style={{ 
        marginTop: '8px', 
        padding: '8px', 
        display: 'flex', 
        gap: '6px', 
        justifyContent: 'center',
        width: '100%',
        maxWidth: '800px',
        margin: '8px auto',
        flexWrap: 'wrap'
      }}>
        {!fuseMode ? (
          <button
            style={{ 
              backgroundColor: '#2196f3', 
              padding: '10px 12px', 
              fontSize: 'clamp(8px, 2vw, 11px)',
              fontWeight: 'bold',
              cursor: state.turn === 0 && state.hands[0].length >= 2 ? 'pointer' : 'not-allowed',
              borderRadius: '4px',
              border: 'none',
              color: 'white',
              flex: '1 1 auto',
              minWidth: '100px',
              opacity: state.turn === 0 && state.hands[0].length >= 2 ? 1 : 0.5,
            }}
            onClick={handleFuseClick}
            disabled={state.turn !== 0 || state.hands[0].length < 2}
          >
            🔮 Fuse
          </button>
        ) : (
          <>
            <button
              style={{ 
                backgroundColor: selectedForFusion.length === 2 ? '#ff8800' : '#666',
                padding: '10px 12px', 
                fontSize: 'clamp(8px, 2vw, 11px)',
                fontWeight: 'bold',
                cursor: selectedForFusion.length === 2 ? 'pointer' : 'not-allowed',
                borderRadius: '4px',
                border: 'none',
                color: 'white',
                flex: '1 1 auto',
                minWidth: '100px'
              }}
              onClick={handleFuseClick}
              disabled={selectedForFusion.length !== 2}
            >
              ⚡ Confirm Fusion
            </button>
            <button
              style={{ 
                backgroundColor: '#cc0000',
                padding: '10px 12px', 
                fontSize: 'clamp(8px, 2vw, 11px)',
                cursor: 'pointer',
                borderRadius: '4px',
                border: 'none',
                color: 'white',
                flex: '0 1 auto',
                minWidth: '80px'
              }}
              onClick={handleCancelFuse}
            >
              ✖ Cancel
            </button>
          </>
        )}
        <button
          style={{ 
            backgroundColor: state.turn === 0 ? '#22aa22' : '#666', 
            padding: '10px 12px', 
            fontSize: 'clamp(8px, 2vw, 11px)',
            fontWeight: 'bold',
            cursor: state.turn === 0 ? 'pointer' : 'not-allowed',
            borderRadius: '4px',
            border: 'none',
            color: 'white',
            flex: '0 1 auto',
            minWidth: '100px'
          }}
          onClick={() => dispatch({ type: 'END_TURN' })}
          disabled={state.turn !== 0}
        >
          ⏭️ End Turn
        </button>
      </div>
    </div>
  );
}