import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSaveStore } from '../store/saveStore';
import DuelBoard from '../ui/DuelBoard';
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
      />
    );
  };
  
  const handleVictory = () => {
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
    
    setShowVictory(true);
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
  
  // Temporary: Add a "Win" button for testing until DuelBoard is modified
  const handleTestWin = () => {
    handleVictory();
  };
  
  return (
    <div style={{ position: 'relative' }}>
      {/* Restoration notification */}
      {isRestored && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
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
        </div>
      )}
      
      {/* Back button */}
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '8px',
        zIndex: 10,
      }}>
        <button
          onClick={handleBackToMap}
          style={{
            padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)',
            fontSize: 'clamp(10px, 2.5vw, 14px)',
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          ← Back to Map
        </button>
      </div>
      
      {/* Temporary test win button */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        zIndex: 10,
      }}>
        <button
          onClick={handleTestWin}
          style={{
            padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)',
            fontSize: 'clamp(10px, 2.5vw, 14px)',
            backgroundColor: '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Test Win (temp)
        </button>
      </div>
      
      {/* Duel Board */}
      <DuelBoardWrapper />
      
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
          <div style={{
            fontSize: 'clamp(32px, 10vw, 48px)',
            fontWeight: 'bold',
            marginBottom: '24px',
            color: '#ffd700',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
          }}>
            VICTORY!
          </div>
          
          <div style={{
            fontSize: 'clamp(18px, 5vw, 24px)',
            marginBottom: '16px',
          }}>
            You defeated {npc.name}!
          </div>
          
          <div style={{
            fontSize: 'clamp(16px, 4vw, 20px)',
            marginBottom: '32px',
            color: '#ffd700',
          }}>
            +30 Starchips
          </div>
          
          <div style={{
            fontSize: 'clamp(12px, 3vw, 16px)',
            marginBottom: '32px',
            color: '#aaa',
          }}>
            +1 Random Card Obtained
          </div>
          
          <button
            onClick={handleContinue}
            style={{
              padding: '16px 48px',
              fontSize: 'clamp(16px, 4vw, 20px)',
              fontWeight: 'bold',
              backgroundColor: '#4caf50',
              color: '#fff',
              border: '2px solid #fff',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

export default DuelScreen;
