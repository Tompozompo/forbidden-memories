import { useEffect, useReducer, useRef, useState } from 'react';
import { initialDuel, duelReducer, type DuelState } from '../engine/duel';
import { getAIAction } from '../engine/ai';
import { getCardEffect } from '../data/cardEffects';
import { checkFusion } from '../engine/fusions';
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

export default function DuelBoard({ p0Deck, p1Deck, allCards, initialState, onStateChange, onVictory, onDefeat }: DuelBoardProps) {
  const [state, dispatch] = useReducer(duelReducer, initialState || initialDuel(p0Deck, p1Deck));
  const hasInitialDrawnRef = useRef(false);
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
  const [selectedSpell, setSelectedSpell] = useState<number | null>(null); // Selected spell card to activate
  const [spellTargetMode, setSpellTargetMode] = useState(false); // Waiting for spell target selection

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

  // draw a starting hand on mount (5 cards each for both players) - only for fresh duels
  useEffect(() => {
    // Skip if we have an initial state (restored duel) or if we've already drawn
    if (initialState || hasInitialDrawnRef.current) return;
    
    // Only draw if both hands are empty and decks have cards (sanity check)
    if (state.hands[0].length === 0 && state.hands[1].length === 0 && 
        state.decks[0].length >= 5 && state.decks[1].length >= 5) {
      hasInitialDrawnRef.current = true;
      // Draw 5 cards for each player all at once
      dispatch({ type: 'DRAW_MULTIPLE', player: 0, count: 5 });
      dispatch({ type: 'DRAW_MULTIPLE', player: 1, count: 5 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount

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
    const currentPlayer = state.turn;
    
    // If in spell target mode, select the target for the spell
    if (spellTargetMode && selectedSpell !== null && player === currentPlayer) {
      if (card) {
        // Activate spell with target
        dispatch({
          type: 'ACTIVATE_SPELL',
          cardId: selectedSpell,
          targetZone: zoneIndex,
        });
        setSelectedSpell(null);
        setSpellTargetMode(false);
      }
      return;
    }
    
    // Can only attack during Battle phase
    if (state.phase !== 'Battle') return;

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

  const handleCardClick = (card: Card, event?: React.MouseEvent) => {
    // If in spell target mode, cancel it when clicking a different card
    if (spellTargetMode && selectedSpell !== card.id) {
      setSpellTargetMode(false);
      setSelectedSpell(null);
    }
    
    // Only allow card selection in fuse mode
    if (!fuseMode || state.turn !== 0) {
      // Check if this is a spell/trap card
      if ((card.type === 'Spell' || card.type === 'Trap') && state.turn === 0) {
        const effect = getCardEffect(card.id);
        
        // Check if shift key is held or right-click - SET the card
        if (event && (event.shiftKey || event.button === 2)) {
          event.preventDefault();
          dispatch({
            type: 'SET_SPELL_TRAP',
            cardId: card.id,
          });
          return;
        }
        
        if (effect) {
          // Check if this is an equip spell that needs a target
          if (effect.type.startsWith('equip_')) {
            // Check if there are any monsters on field
            if (state.fields[0].some(m => m !== null)) {
              setSelectedSpell(card.id);
              setSpellTargetMode(true);
            }
          } else if (effect.type === 'field') {
            // Field spells should be SET (placed in spell/trap zone)
            dispatch({
              type: 'SET_SPELL_TRAP',
              cardId: card.id,
            });
          } else {
            // Non-equip spells can be activated directly
            dispatch({
              type: 'ACTIVATE_SPELL',
              cardId: card.id,
            });
          }
        } else {
          // No effect defined - just set it
          dispatch({
            type: 'SET_SPELL_TRAP',
            cardId: card.id,
          });
        }
      }
      return;
    }
    
    if (selectedForFusion.includes(card.id)) {
      // Deselect card
      setSelectedForFusion(selectedForFusion.filter(id => id !== card.id));
    } else {
      // Select card (no limit)
      setSelectedForFusion([...selectedForFusion, card.id]);
    }
  };

  const handleFuseClick = () => {
    if (!fuseMode) {
      // Enter fusion mode
      setFuseMode(true);
      setSelectedForFusion([]);
    } else if (selectedForFusion.length >= 2) {
      // Execute chain fusion
      setFusingCards([...selectedForFusion]);
      
      // Chain fuse: fuse first two, then fuse result with third, etc.
      const performChainFusion = (cardIds: number[], index: number = 0) => {
        if (index >= cardIds.length - 1) {
          // Done fusing
          setTimeout(() => {
            setFusingCards([]);
            setSelectedForFusion([]);
            setFuseMode(false);
          }, 600);
          return;
        }
        
        // Fuse current pair (index and index+1)
        const mat1 = cardIds[index];
        const mat2 = cardIds[index + 1];
        const resultId = checkFusion(mat1, mat2);
        
        if (!resultId) {
          // Fusion failed - just clear and exit
          setTimeout(() => {
            setFusingCards([]);
            setSelectedForFusion([]);
            setFuseMode(false);
          }, 600);
          return;
        }
        
        // Wait for animation then dispatch fusion
        setTimeout(() => {
          dispatch({ type: 'FUSE', matA: mat1, matB: mat2, allCards });
          
          // If there are more cards to fuse, replace the two fused cards with the result and continue
          if (index + 2 < cardIds.length) {
            // Create new array: cards before fusion, result, cards after fusion
            const newCardIds = [
              ...cardIds.slice(0, index),
              resultId,
              ...cardIds.slice(index + 2)
            ];
            
            // Continue chain fusion with the new array
            performChainFusion(newCardIds, index);
          } else {
            // Last fusion complete
            setTimeout(() => {
              setFusingCards([]);
              setSelectedForFusion([]);
              setFuseMode(false);
            }, 600);
          }
        }, 600);
      };
      
      performChainFusion(selectedForFusion);
    }
  };

  const handleCancelFuse = () => {
    setFuseMode(false);
    setSelectedForFusion([]);
  };

  // Get active field card background
  const getFieldBackground = () => {
    // Check if any field spell is active (check both players' spell/trap zones)
    for (let p = 0; p < 2; p++) {
      for (const card of state.spellTraps[p]) {
        if (card) {
          const effect = getCardEffect(card.id);
          if (effect?.type === 'field') {
            // Map field card IDs to backgrounds
            switch (card.id) {
              case 334: // Umi
                return 'linear-gradient(180deg, #1a4d6d 0%, #0a2540 50%, #041a30 100%)';
              case 330: // Forest
                return 'linear-gradient(180deg, #2d5016 0%, #1a3010 50%, #0f1f08 100%)';
              case 331: // Wasteland
                return 'linear-gradient(180deg, #5a4a3a 0%, #3a2a1a 50%, #2a1a0a 100%)';
              case 332: // Mountain
                return 'linear-gradient(180deg, #4a3a3a 0%, #2a1a1a 50%, #1a0a0a 100%)';
              case 335: // Yami
                return 'linear-gradient(180deg, #2a1a3a 0%, #1a0a2a 50%, #0a001a 100%)';
              default:
                return null;
            }
          }
        }
      }
    }
    return null;
  };

  const fieldBackground = getFieldBackground();

  return (
    <div style={{ 
      padding: '4px', 
      width: '100%', 
      maxWidth: '800px', 
      margin: '0 auto',
      background: fieldBackground || undefined,
      transition: 'background 0.5s ease',
    }}>
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
            Fusion Mode: Select 2+ cards from your hand ({selectedForFusion.length} selected)
          </span>
        </div>
      )}

      {/* Spell target mode banner */}
      {spellTargetMode && selectedSpell && (
        <div style={{ margin: '4px 0', padding: '6px', backgroundColor: '#1d9e74', border: '2px solid #2ac99a', borderRadius: '4px', textAlign: 'center' }}>
          <span style={{ fontSize: 'clamp(9px, 2.5vw, 12px)', fontWeight: 'bold' }}>
            Select a monster to equip the spell card
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
          equippedCards={state.equippedCards}
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
          equippedCards={state.equippedCards}
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
              const isSelectedSpell = selectedSpell === c.id;
              const isSpellOrTrap = c.type === 'Spell' || c.type === 'Trap';
              const zIndex = i; // Rightmost card has highest z-index
              
              return state.turn === 0 && !state.hasSummoned[0] && c.type === 'Monster' ? (
                <div 
                  key={i} 
                  className={isFusing ? 'flash burst' : ''}
                  style={{
                    width: 'clamp(45px, 12vw, 100px)',
                    height: 'clamp(63px, 16.8vw, 140px)',
                    display: 'inline-block',
                    zIndex,
                    cursor: fuseMode ? 'pointer' : 'grab',
                    border: isSelectedForFusion ? '3px solid #ffaa00' : 'none',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                  }}
                  onClick={(e) => handleCardClick(c, e)}
                  onContextMenu={(e) => handleCardClick(c, e)}
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
                    width: 'clamp(45px, 12vw, 100px)',
                    height: 'clamp(63px, 16.8vw, 140px)',
                    display: 'inline-block',
                    zIndex,
                    margin: 0,
                    cursor: (fuseMode || (isSpellOrTrap && state.turn === 0)) ? 'pointer' : 'default',
                    border: isSelectedForFusion ? '3px solid #ffaa00' : isSelectedSpell ? '3px solid #1d9e74' : 'none',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                  }}
                  onClick={(e) => handleCardClick(c, e)}
                  onContextMenu={(e) => handleCardClick(c, e)}
                >
                  <CardComponent card={c} size="medium" style={{ width: '100%' }} />
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
                backgroundColor: selectedForFusion.length >= 2 ? '#ff8800' : '#666',
                padding: '10px 12px', 
                fontSize: 'clamp(8px, 2vw, 11px)',
                fontWeight: 'bold',
                cursor: selectedForFusion.length >= 2 ? 'pointer' : 'not-allowed',
                borderRadius: '4px',
                border: 'none',
                color: 'white',
                flex: '1 1 auto',
                minWidth: '100px'
              }}
              onClick={handleFuseClick}
              disabled={selectedForFusion.length < 2}
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