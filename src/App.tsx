import { useState, useEffect } from 'react';
import DuelBoard from './ui/DuelBoard';
import DeckBuilder from './ui/DeckBuilder';
import { useDeckStore } from './store/deckStore';
import cards from './data/cards.json';
import npcs from './data/npcs.json';
import type { Card } from './types';

type Tab = 'Duel' | 'Deck';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Duel');
  const { currentDeck, loadFromLocalStorage } = useDeckStore();
  
  // Load deck from localStorage on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);
  
  // Get all cards
  const allCards = cards as Card[];
  
  // Player 0 deck - use currentDeck from store, or fallback to first 20 cards
  const p0CardIds = currentDeck.length === 20 ? currentDeck : allCards.slice(0, 20).map(c => c.id);
  const p0Cards = p0CardIds.map(id => allCards.find(c => c.id === id)).filter(Boolean) as Card[];
  
  // Get NPC deck (Rookie Rex) - use all cards for the full pool
  const npc = npcs[0];
  const p1Cards = npc.deck.map(id => allCards.find(c => c.id === id)).filter(Boolean) as Card[];
  
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };
  
  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Forbidden Memories - MVP</h1>
      
      {/* Tab Navigation */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button
          onClick={() => handleTabChange('Duel')}
          style={{
            backgroundColor: activeTab === 'Duel' ? '#2196f3' : undefined,
          }}
        >
          Duel
        </button>
        <button
          onClick={() => handleTabChange('Deck')}
          style={{
            backgroundColor: activeTab === 'Deck' ? '#2196f3' : undefined,
          }}
        >
          Deck
        </button>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'Duel' && (
        <div className="tab-content">
          <DuelBoard p0Deck={p0Cards} p1Deck={p1Cards} allCards={allCards} />
        </div>
      )}
      
      {activeTab === 'Deck' && (
        <div className="tab-content">
          <DeckBuilder 
            allCards={allCards} 
            onReturnToDuel={() => handleTabChange('Duel')} 
          />
        </div>
      )}
    </div>
  );
}

export default App;
