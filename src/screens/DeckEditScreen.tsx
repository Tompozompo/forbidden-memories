import { useNavigate } from 'react-router-dom';
import { useSaveStore } from '../store/saveStore';
import cards from '../data/cards.json';
import type { Card } from '../types';
import { useState, useEffect } from 'react';

const allCards = cards as Card[];

function DeckEditScreen() {
  const navigate = useNavigate();
  const { currentDeck, ownedCards, saveGame } = useSaveStore();
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
    .filter(Boolean) as Card[];

  const filteredCards = ownedCardObjects.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (cardId: number, slotIndex: number) => {
    const newDeck = [...deck];
    newDeck[slotIndex] = cardId;
    setDeck(newDeck);
  };

  const handleSlotClick = (slotIndex: number) => {
    // Remove card from slot on click
    const newDeck = [...deck];
    newDeck[slotIndex] = null;
    setDeck(newDeck);
  };

  const handleSave = () => {
    const validDeck = deck.filter((id): id is number => id !== null);
    saveGame({ currentDeck: validDeck });
    navigate('/map');
  };

  const handleCancel = () => {
    navigate('/map');
  };

  const isValidDeck = deck.filter(id => id !== null).length === 20;

  return (
    <div style={{
      minHeight: '100vh',
      padding: '16px',
      background: 'linear-gradient(to bottom, #2a2a3e, #1a1a2e)',
      color: '#fff',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <button
          onClick={handleCancel}
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
          ← Back
        </button>
        
        <h1 style={{
          fontSize: 'clamp(20px, 6vw, 28px)',
          margin: 0,
        }}>
          Deck Editor
        </h1>
        
        <div style={{ width: '80px' }}></div>
      </div>

      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Left column: Owned cards */}
        <div style={{
          flex: '1',
          minWidth: '280px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          padding: '16px',
          borderRadius: '8px',
        }}>
          <h2 style={{
            fontSize: '18px',
            marginBottom: '8px',
            marginTop: 0,
          }}>
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
              marginBottom: '12px',
              border: '1px solid #555',
              borderRadius: '4px',
              backgroundColor: '#1a1a2e',
              color: '#fff',
              fontSize: '14px',
            }}
          />
          
          <div style={{
            maxHeight: '500px',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '8px',
          }}>
            {filteredCards.map((card) => {
              // Check if card is already in deck
              const usedSlots = deck.map((id, idx) => id === card.id ? idx : -1).filter(idx => idx !== -1);
              const availableSlot = deck.findIndex(id => id === null);
              
              return (
                <div
                  key={card.id}
                  onClick={() => availableSlot !== -1 && handleCardClick(card.id, availableSlot)}
                  style={{
                    padding: '8px',
                    backgroundColor: availableSlot !== -1 ? '#2196f3' : '#555',
                    border: '2px solid #fff',
                    borderRadius: '4px',
                    cursor: availableSlot !== -1 ? 'pointer' : 'not-allowed',
                    opacity: availableSlot !== -1 ? 1 : 0.6,
                    fontSize: '10px',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (availableSlot !== -1) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (availableSlot !== -1) {
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{card.name}</div>
                  {card.type === 'Monster' && (
                    <div style={{ fontSize: '9px' }}>
                      ATK: {card.atk ?? '?'} / DEF: {card.def ?? '?'}
                    </div>
                  )}
                  {usedSlots.length > 0 && (
                    <div style={{ fontSize: '8px', color: '#ffd700', marginTop: '2px' }}>
                      In deck ({usedSlots.length}x)
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Deck slots */}
        <div style={{
          flex: '1',
          minWidth: '280px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          padding: '16px',
          borderRadius: '8px',
        }}>
          <h2 style={{
            fontSize: '18px',
            marginBottom: '8px',
            marginTop: 0,
          }}>
            Deck ({deck.filter(id => id !== null).length}/20)
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '8px',
            marginBottom: '16px',
          }}>
            {deck.map((cardId, index) => {
              const card = cardId ? allCards.find(c => c.id === cardId) : null;
              return (
                <div
                  key={index}
                  onClick={() => cardId && handleSlotClick(index)}
                  style={{
                    border: '2px solid',
                    borderColor: card ? '#4caf50' : '#555',
                    borderRadius: '4px',
                    padding: '8px',
                    minHeight: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: card ? 'rgba(76, 175, 80, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                    cursor: card ? 'pointer' : 'default',
                    textAlign: 'center',
                    fontSize: '10px',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (card) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (card) {
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {card ? (
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{card.name}</div>
                      {card.type === 'Monster' && (
                        <div style={{ fontSize: '9px' }}>
                          {card.atk}/{card.def}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: '#888' }}>Slot {index + 1}</span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={handleSave}
              disabled={!isValidDeck}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '12px 24px',
                backgroundColor: isValidDeck ? '#4caf50' : '#666',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isValidDeck ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.2s',
              }}
            >
              {isValidDeck ? 'Save Deck' : `Need ${20 - deck.filter(id => id !== null).length} more cards`}
            </button>
            
            <button
              onClick={handleCancel}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '12px 24px',
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer',
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

export default DeckEditScreen;
