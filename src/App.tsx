import DuelBoard from './ui/DuelBoard';
import cards from './data/cards.json';
import npcs from './data/npcs.json';
import type { Card } from './types';

function App() {
  // Get all cards
  const allCards = cards as Card[];
  
  // Player 0 gets first 20 cards, Player 1 (NPC) gets cards from NPC deck
  const p0Cards = allCards.slice(0, 20);
  
  // Get NPC deck (Rookie Rex) - use all cards for the full pool
  const npc = npcs[0];
  const p1Cards = npc.deck.map(id => allCards.find(c => c.id === id)).filter(Boolean) as Card[];
  
  return (
    <div style={{ padding: '16px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Forbidden Memories - MVP</h1>
      <DuelBoard p0Deck={p0Cards} p1Deck={p1Cards} allCards={allCards} />
    </div>
  );
}

export default App;
