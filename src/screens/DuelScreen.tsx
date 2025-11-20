import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSpring, animated, config } from '@react-spring/web';
import { useSaveStore } from '../store/saveStore';
import DuelBoard from '../ui/DuelBoard';
import { FlashEffect } from '../ui/ParticleSystem';
import npcs from '../data/npcs.json';
import cards from '../data/cards.json';
import type { Card } from '../types';
import type { DuelState } from '../engine/duel';
import { saveDuelSession, loadDuelSession, clearDuelSession } from '../utils/duelSession';

interface NPC {
  id: number;
  name: string;
  deck: number[];
}

function DuelScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const npcId = parseInt(id || '1', 10);
  
  const { currentDeck, addStarchips, addBeatenId, addOwnedCard } = useSaveStore();
  
  const [showVictory, setShowVictory] = useState(false);
  const [duelState, setDuelState] = useState<DuelState | null>(null);
  const [isRestored, setIsRestored] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showVictoryFlash, setShowVictoryFlash] = useState(false);
  const [showDefeatFlash, setShowDefeatFlash] = useState(false);
  
  // Victory animation
  const victoryAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.5) rotate(-10deg)' },
    to: showVictory ? { opacity: 1, transform: 'scale(1) rotate(0deg)' } : { opacity: 0, transform: 'scale(0.5) rotate(-10deg)' },
    config: config.wobbly,
  });

  // Defeat animation
  const defeatAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(100px)' },
    to: showDefeat ? { opacity: 1, transform: 'translateY(0px)' } : { opacity: 0, transform: 'translateY(100px)' },
    config: config.slow,
  });

  // Restored notification animation
  const restoredAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: isRestored ? { opacity: 1, transform: 'scale(1)' } : { opacity: 0, transform: 'scale(0.8)' },
    config: config.wobbly,
  });
  
  const allCards = cards as Card[];
  const allNpcs = npcs as NPC[];
  const npc = allNpcs.find(n => n.id === npcId) || allNpcs[0];
  
  // Player 0 deck - use currentDeck from store, or fallback to first 20 cards
  const p0CardIds = currentDeck.length === 20 ? currentDeck : allCards.slice(0, 20).map(c => c.id);
  const p0Cards = p0CardIds.map(id => allCards.find(c => c.id === id)).filter(Boolean) as Card[];
  
  // NPC deck
  const p1Cards = npc.deck.map(id => allCards.find(c => c.id === id)).filter(Boolean) as Card[];

  // Try to restore duel session on mount
  useEffect(() => {
    const session = loadDuelSession();
    if (session && session.npcId === npcId) {
      setDuelState(session.state);
      setIsRestored(true);
      // Clear the restored flag after a few seconds
      setTimeout(() => setIsRestored(false), 3000);
    }
  }, [npcId]);

  // Save duel state whenever it changes (but not if hands are empty - means initial draw hasn't happened)
  const handleStateChange = useCallback((state: DuelState) => {
    setDuelState(state);
    // Only save if at least one player has cards in hand (initial draw has happened)
    if (state.hands[0].length > 0 || state.hands[1].length > 0) {
      saveDuelSession(state, npcId);
    }
  }, [npcId]);

  // Add beforeunload handler to warn about leaving during active duel
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only show warning if duel is still active (both players have LP > 0)
      if (duelState && duelState.lp[0] > 0 && duelState.lp[1] > 0) {
        e.preventDefault();
        // Modern browsers ignore custom messages, but we still need to set returnValue
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [duelState]);
  
  // Create a modified DuelBoard that detects victory
  const DuelBoardWrapper = () => {
    return (
      <DuelBoard 
        p0Deck={p0Cards} 
        p1Deck={p1Cards} 
        allCards={allCards}
        initialState={duelState ? duelState : undefined}
        onStateChange={handleStateChange}
        onVictory={handleVictory}
        onDefeat={handleDefeat}
      />
    );
  };
  
  const handleVictory = () => {
    // Flash effect
    setShowVictoryFlash(true);
    
    // Award rewards
    addStarchips(30);
    addBeatenId(npcId);
    
    // Award random card (simple: award card with ID = 50 + npcId for variety)
    const randomCardId = 50 + npcId;
    if (randomCardId <= allCards.length) {
      addOwnedCard(randomCardId);
    }
    
    // Clear the duel session since duel is over
    clearDuelSession();
    
    // Show victory after flash
    setTimeout(() => {
      setShowVictory(true);
    }, 500);
  };
  
  const handleDefeat = () => {
    // Flash effect
    setShowDefeatFlash(true);
    
    // Show defeat screen after flash
    setTimeout(() => {
      setShowDefeat(true);
    }, 500);
  };
  
  const handleContinue = () => {
    clearDuelSession();
    navigate('/map');
  };
  
  const handleBackToMap = () => {
    // Clear session when deliberately leaving
    clearDuelSession();
    navigate('/map');
  };
  
  return (
    <div style={{ position: 'relative' }}>
      {/* Flash effects */}
      <FlashEffect 
        active={showVictoryFlash} 
        color="#ffd700" 
        duration={400}
        onComplete={() => setShowVictoryFlash(false)}
      />
      <FlashEffect 
        active={showDefeatFlash} 
        color="#ff4444" 
        duration={400}
        onComplete={() => setShowDefeatFlash(false)}
      />
      
      {/* Restoration notification */}
      {isRestored && (
        <animated.div style={{
          ...restoredAnimation,
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: restoredAnimation.transform.to(t => `translate(-50%, -50%) ${t}`),
          backgroundColor: 'rgba(0, 150, 0, 0.95)',
          color: '#fff',
          padding: 'clamp(16px, 4vw, 24px)',
          borderRadius: '8px',
          fontSize: 'clamp(14px, 3.5vw, 18px)',
          fontWeight: 'bold',
          zIndex: 2000,
          border: '3px solid #0f0',
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
          textAlign: 'center',
        }}>
          ✓ Duel Restored!
        </animated.div>
      )}
      
      {/* Settings button */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        zIndex: 10,
      }}>
        <button
          onClick={() => setShowSettings(true)}
          style={{
            padding: 'clamp(6px, 2vw, 8px)',
            fontSize: 'clamp(16px, 4vw, 20px)',
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: 'clamp(36px, 10vw, 44px)',
            height: 'clamp(36px, 10vw, 44px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ⚙️
        </button>
      </div>
      
      {/* Duel Board */}
      <DuelBoardWrapper />
      
      {/* Settings Overlay */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          color: '#fff',
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: 'clamp(20px, 5vw, 32px)',
            borderRadius: '8px',
            border: '2px solid #444',
            maxWidth: '400px',
            width: '100%',
          }}>
            <div style={{
              fontSize: 'clamp(18px, 5vw, 24px)',
              fontWeight: 'bold',
              marginBottom: '24px',
              textAlign: 'center',
            }}>
              Duel Settings
            </div>
            
            <div style={{
              fontSize: 'clamp(12px, 3vw, 14px)',
              marginBottom: '24px',
              color: '#aaa',
              textAlign: 'center',
            }}>
              Your duel progress is automatically saved
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <button
                onClick={() => {
                  setShowSettings(false);
                  handleBackToMap();
                }}
                style={{
                  padding: '16px 24px',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: 'bold',
                  backgroundColor: '#cc6600',
                  color: '#fff',
                  border: '2px solid #ff8800',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                ← Return to Map
              </button>
              
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  padding: '16px 24px',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  backgroundColor: '#444',
                  color: '#fff',
                  border: '2px solid #666',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Resume Duel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Victory Overlay */}
      {showVictory && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          color: '#fff',
        }}>
          <animated.div style={{
            ...victoryAnimation,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <div className="glow" style={{
              fontSize: 'clamp(32px, 10vw, 48px)',
              fontWeight: 'bold',
              marginBottom: '24px',
              color: '#ffd700',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
            }}>
              VICTORY!
            </div>
            
            <div className="zoomIn" style={{
              fontSize: 'clamp(18px, 5vw, 24px)',
              marginBottom: '16px',
            }}>
              You defeated {npc.name}!
            </div>
            
            <div className="slideInFromBottom" style={{
              fontSize: 'clamp(16px, 4vw, 20px)',
              marginBottom: '32px',
              color: '#ffd700',
              animationDelay: '0.2s',
            }}>
              +30 Starchips
            </div>
            
            <div className="slideInFromBottom" style={{
              fontSize: 'clamp(12px, 3vw, 16px)',
              marginBottom: '32px',
              color: '#aaa',
              animationDelay: '0.3s',
            }}>
              +1 Random Card Obtained
            </div>
            
            <button
              onClick={handleContinue}
              className="zoomIn"
              style={{
                padding: '16px 32px',
                fontSize: 'clamp(14px, 4vw, 18px)',
                fontWeight: 'bold',
                backgroundColor: '#4caf50',
                color: '#fff',
                border: '2px solid #fff',
                borderRadius: '8px',
                cursor: 'pointer',
                animationDelay: '0.4s',
              }}
            >
              Continue
            </button>
          </animated.div>
        </div>
      )}
      
      {/* Defeat Overlay */}
      {showDefeat && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          color: '#fff',
        }}>
          <animated.div style={{
            ...defeatAnimation,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <div className="shake" style={{
              fontSize: 'clamp(32px, 10vw, 48px)',
              fontWeight: 'bold',
              marginBottom: '24px',
              color: '#ff4444',
              textShadow: '0 0 20px rgba(255, 68, 68, 0.5)',
            }}>
              DEFEAT
            </div>
            
            <div className="fadeIn" style={{
              fontSize: 'clamp(18px, 5vw, 24px)',
              marginBottom: '32px',
              animationDelay: '0.2s',
            }}>
              {npc.name} has won the duel!
            </div>
            
            <button
              onClick={handleContinue}
              className="fadeIn"
              style={{
                padding: '16px 48px',
                fontSize: 'clamp(16px, 4vw, 20px)',
                fontWeight: 'bold',
                backgroundColor: '#666',
                color: '#fff',
                border: '2px solid #fff',
                borderRadius: '8px',
                cursor: 'pointer',
                animationDelay: '0.3s',
              }}
            >
              Return to Map
            </button>
          </animated.div>
        </div>
      )}
    </div>
  );
}

export default DuelScreen;
