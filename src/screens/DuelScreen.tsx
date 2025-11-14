import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSaveStore } from '../store/saveStore';
import DuelBoard from '../ui/DuelBoard';
import npcs from '../data/npcs.json';
import cards from '../data/cards.json';
import type { Card } from '../types';

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
  const [showDefeat, setShowDefeat] = useState(false);
  
  const allCards = cards as Card[];
  const allNpcs = npcs as NPC[];
  const npc = allNpcs.find(n => n.id === npcId) || allNpcs[0];
  
  // Player 0 deck - use currentDeck from store, or fallback to first 20 cards
  const p0CardIds = currentDeck.length === 20 ? currentDeck : allCards.slice(0, 20).map(c => c.id);
  const p0Cards = p0CardIds.map(id => allCards.find(c => c.id === id)).filter(Boolean) as Card[];
  
  // NPC deck
  const p1Cards = npc.deck.map(id => allCards.find(c => c.id === id)).filter(Boolean) as Card[];
  
  // Create a modified DuelBoard that detects victory
  const DuelBoardWrapper = () => {
    return (
      <DuelBoard 
        p0Deck={p0Cards} 
        p1Deck={p1Cards} 
        allCards={allCards}
        onVictory={handleVictory}
        onDefeat={handleDefeat}
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
    
    setShowVictory(true);
  };
  
  const handleDefeat = () => {
    // Show defeat screen
    setShowDefeat(true);
  };
  
  const handleContinue = () => {
    navigate('/map');
  };
  
  const handleBackToMap = () => {
    navigate('/map');
  };
  
  return (
    <div style={{ position: 'relative' }}>
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
          <div style={{
            fontSize: 'clamp(32px, 10vw, 48px)',
            fontWeight: 'bold',
            marginBottom: '24px',
            color: '#ff4444',
            textShadow: '0 0 20px rgba(255, 68, 68, 0.5)',
          }}>
            DEFEAT
          </div>
          
          <div style={{
            fontSize: 'clamp(18px, 5vw, 24px)',
            marginBottom: '32px',
          }}>
            {npc.name} has won the duel!
          </div>
          
          <button
            onClick={handleContinue}
            style={{
              padding: '16px 48px',
              fontSize: 'clamp(16px, 4vw, 20px)',
              fontWeight: 'bold',
              backgroundColor: '#666',
              color: '#fff',
              border: '2px solid #fff',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Return to Map
          </button>
        </div>
      )}
    </div>
  );
}

export default DuelScreen;
