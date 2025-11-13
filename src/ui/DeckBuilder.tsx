import { useState, useEffect } from 'react';
import { useDeckStore } from '../store/deckStore';
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';
import type { Card as CardType } from '../types';
import Card from './Card';

interface DeckBuilderProps {
  allCards: CardType[];
  onReturnToDuel: () => void;
}

function DraggableOwnedCard({ card, onDragEnd }: { card: CardType; onDragEnd: (target: HTMLElement | null) => void }) {
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
  
  const bind = useDrag(
    ({ down, movement: [mx, my], event }) => {
      api.start({ x: down ? mx : 0, y: down ? my : 0, immediate: down });
      
      if (!down) {
        const clientX = (event as any).clientX ?? (event as any).changedTouches?.[0]?.clientX ?? 0;
        const clientY = (event as any).clientY ?? (event as any).changedTouches?.[0]?.clientY ?? 0;
        const target = document.elementFromPoint(clientX, clientY);
        onDragEnd(target as HTMLElement);
      }
    },
    { from: () => [x.get(), y.get()] }
  );

  return (
    <animated.div
      {...bind()}
      style={{ x, y, touchAction: 'none', cursor: 'grab' }}
      className="card select-none"
    >
      <Card card={card} size="small" />
    </animated.div>
  );
}

export default function DeckBuilder({ allCards, onReturnToDuel }: DeckBuilderProps) {
  const { currentDeck, ownedCards, setCurrentDeck, saveDeckToLocalStorage } = useDeckStore();
  const [deck, setDeck] = useState<(number | null)[]>(Array(20).fill(null));
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize deck from store
  useEffect(() => {
    const newDeck = Array(20).fill(null);
    currentDeck.forEach((cardId, index) => {
      if (index < 20) {
        newDeck[index] = cardId;
      }
    });
    setDeck(newDeck);
  }, [currentDeck]);

  const ownedCardObjects = ownedCards
    .map(id => allCards.find(c => c.id === id))
    .filter(Boolean) as CardType[];

  const filteredCards = ownedCardObjects.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardDrop = (cardId: number, target: HTMLElement | null) => {
    if (!target) return;
    
    const slot = target.closest('[data-deck-slot]') as HTMLElement;
    if (slot) {
      const slotIndex = parseInt(slot.dataset.deckSlot || '-1');
      if (slotIndex >= 0 && slotIndex < 20) {
        const newDeck = [...deck];
        newDeck[slotIndex] = cardId;
        setDeck(newDeck);
      }
    }
  };

  const handleSlotClick = (slotIndex: number) => {
    // Remove card from slot on click
    const newDeck = [...deck];
    newDeck[slotIndex] = null;
    setDeck(newDeck);
  };

  const handleSave = () => {
    const validDeck = deck.filter((id): id is number => id !== null);
    setCurrentDeck(validDeck);
    saveDeckToLocalStorage();
    onReturnToDuel();
  };

  const isValidDeck = deck.filter(id => id !== null).length === 20;

  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Deck Builder</h1>
      
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {/* Left column: Owned cards */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>
            Owned Cards ({ownedCardObjects.length})
          </h2>
          
          <input
            type="text"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          
          <div
            style={{
              maxHeight: '500px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            {filteredCards.map((card) => (
              <DraggableOwnedCard
                key={card.id}
                card={card}
                onDragEnd={(target) => handleCardDrop(card.id, target)}
              />
            ))}
          </div>
        </div>

        {/* Right column: Deck slots */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>
            Deck ({deck.filter(id => id !== null).length}/20)
          </h2>
          
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              marginBottom: '16px'
            }}
          >
            {deck.map((cardId, index) => {
              const card = cardId ? allCards.find(c => c.id === cardId) : null;
              return (
                <div
                  key={index}
                  data-deck-slot={index}
                  onClick={() => cardId && handleSlotClick(index)}
                  style={{
                    border: '2px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: card ? '#e8f5e9' : '#f5f5f5',
                    cursor: card ? 'pointer' : 'default',
                    textAlign: 'center'
                  }}
                >
                  {card ? (
                    <Card card={card} size="small" />
                  ) : (
                    <span style={{ color: '#999' }}>Slot {index + 1}</span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleSave}
              disabled={!isValidDeck}
              style={{
                padding: '12px 24px',
                backgroundColor: isValidDeck ? '#4caf50' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isValidDeck ? 'pointer' : 'not-allowed',
                flex: 1
              }}
            >
              Save Deck
            </button>
            
            <button
              onClick={onReturnToDuel}
              style={{
                padding: '12px 24px',
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
