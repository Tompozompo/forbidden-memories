import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSaveStore } from '../store/saveStore';
import { useDeckStore } from '../store/deckStore';
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
  
  const { currentDeck } = useDeckStore();
  const { addStarchips, addBeatenId, addOwnedCard } = useSaveStore();
  
  const [showVictory, setShowVictory] = useState(false);
  
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
    return <DuelBoard p0Deck={p0Cards} p1Deck={p1Cards} allCards={allCards} />;
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
  
  const handleContinue = () => {
    navigate('/map');
  };
  
  const handleBackToMap = () => {
    navigate('/map');
  };
  
  // Temporary: Add a "Win" button for testing until DuelBoard is modified
  const handleTestWin = () => {
    handleVictory();
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
            padding: '8px 16px',
            fontSize: '14px',
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
            padding: '8px 16px',
            fontSize: '14px',
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
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '24px',
            color: '#ffd700',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
          }}>
            VICTORY!
          </div>
          
          <div style={{
            fontSize: '24px',
            marginBottom: '16px',
          }}>
            You defeated {npc.name}!
          </div>
          
          <div style={{
            fontSize: '20px',
            marginBottom: '32px',
            color: '#ffd700',
          }}>
            +30 Starchips
          </div>
          
          <div style={{
            fontSize: '16px',
            marginBottom: '32px',
            color: '#aaa',
          }}>
            +1 Random Card Obtained
          </div>
          
          <button
            onClick={handleContinue}
            style={{
              padding: '16px 48px',
              fontSize: '20px',
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
