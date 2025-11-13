import { useNavigate } from 'react-router-dom';
import { useSaveStore } from '../store/saveStore';
import { useState } from 'react';
import cards from '../data/cards.json';
import type { Card } from '../types';

const allCards = cards as Card[];

// Define card packs with different rarities and costs
interface CardPack {
  id: string;
  name: string;
  cost: number;
  cardCount: number;
  description: string;
  color: string;
}

const CARD_PACKS: CardPack[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    cost: 50,
    cardCount: 3,
    description: 'Contains 3 random cards from the basic collection',
    color: '#2196f3',
  },
  {
    id: 'advanced',
    name: 'Advanced Pack',
    cost: 150,
    cardCount: 5,
    description: 'Contains 5 random cards with better odds',
    color: '#9c27b0',
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    cost: 300,
    cardCount: 8,
    description: 'Contains 8 random cards including rare finds',
    color: '#ff9800',
  },
];

function ShopScreen() {
  const navigate = useNavigate();
  const { starchips, ownedCards, addStarchips, addOwnedCard } = useSaveStore();
  const [lastPurchase, setLastPurchase] = useState<Card[]>([]);
  const [showRewards, setShowRewards] = useState(false);

  const handleBack = () => {
    navigate('/map');
  };

  const getRandomCards = (count: number, packId: string): Card[] => {
    const monsterCards = allCards.filter(c => c.type === 'Monster');
    const results: Card[] = [];
    
    // Different logic for different pack types
    let pool: Card[];
    
    if (packId === 'starter') {
      // Starter pack: only basic monsters (lower IDs)
      pool = monsterCards.filter(c => c.id <= 50);
    } else if (packId === 'advanced') {
      // Advanced pack: wider range
      pool = monsterCards.filter(c => c.id <= 100);
    } else {
      // Premium pack: any card
      pool = allCards;
    }
    
    for (let i = 0; i < count; i++) {
      const randomCard = pool[Math.floor(Math.random() * pool.length)];
      results.push(randomCard);
    }
    
    return results;
  };

  const handlePurchase = (pack: CardPack) => {
    if (starchips < pack.cost) {
      return; // Can't afford
    }

    // Deduct starchips
    addStarchips(-pack.cost);

    // Generate random cards
    const newCards = getRandomCards(pack.cardCount, pack.id);
    
    // Add cards to owned collection
    newCards.forEach(card => {
      addOwnedCard(card.id);
    });

    // Show rewards
    setLastPurchase(newCards);
    setShowRewards(true);
  };

  const closeRewards = () => {
    setShowRewards(false);
    setLastPurchase([]);
  };

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
          onClick={handleBack}
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
        
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#ffd700',
        }}>
          ★ {starchips} Starchips
        </div>
      </div>

      {/* Title */}
      <h1 style={{
        fontSize: 'clamp(24px, 6vw, 32px)',
        textAlign: 'center',
        marginBottom: '16px',
        textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
      }}>
        Card Shop
      </h1>

      <p style={{
        textAlign: 'center',
        color: '#aaa',
        marginBottom: '32px',
        fontSize: '14px',
      }}>
        Purchase card packs to expand your collection
      </p>

      {/* Card Packs Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        {CARD_PACKS.map((pack) => {
          const canAfford = starchips >= pack.cost;
          
          return (
            <div
              key={pack.id}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: `3px solid ${pack.color}`,
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                if (canAfford) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 4px 20px ${pack.color}66`;
                }
              }}
              onMouseLeave={(e) => {
                if (canAfford) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {/* Pack Name */}
              <h3 style={{
                fontSize: '20px',
                margin: 0,
                color: pack.color,
                textShadow: `0 0 10px ${pack.color}`,
              }}>
                {pack.name}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '14px',
                color: '#ccc',
                margin: 0,
                minHeight: '40px',
              }}>
                {pack.description}
              </p>

              {/* Card Count */}
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#fff',
              }}>
                📦 {pack.cardCount} Cards
              </div>

              {/* Cost */}
              <div style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#ffd700',
              }}>
                ★ {pack.cost} Starchips
              </div>

              {/* Purchase Button */}
              <button
                onClick={() => handlePurchase(pack)}
                disabled={!canAfford}
                style={{
                  padding: '12px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  backgroundColor: canAfford ? pack.color : '#555',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s',
                  opacity: canAfford ? 1 : 0.6,
                }}
                onMouseEnter={(e) => {
                  if (canAfford) {
                    e.currentTarget.style.backgroundColor = pack.color + 'dd';
                  }
                }}
                onMouseLeave={(e) => {
                  if (canAfford) {
                    e.currentTarget.style.backgroundColor = pack.color;
                  }
                }}
              >
                {canAfford ? 'Purchase' : 'Not enough Starchips'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Collection Stats */}
      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '8px',
        maxWidth: '600px',
        margin: '40px auto 0',
        textAlign: 'center',
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Your Collection</h3>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>
          {ownedCards.length} / {allCards.length} Cards
        </div>
        <div style={{
          marginTop: '8px',
          height: '20px',
          backgroundColor: '#333',
          borderRadius: '10px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${(ownedCards.length / allCards.length) * 100}%`,
            backgroundColor: '#4caf50',
            transition: 'width 0.3s',
          }}></div>
        </div>
      </div>

      {/* Rewards Modal */}
      {showRewards && (
        <div
          onClick={closeRewards}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#2a2a3e',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <h2 style={{
              fontSize: '24px',
              marginBottom: '20px',
              textAlign: 'center',
              color: '#ffd700',
            }}>
              🎉 Cards Obtained!
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '12px',
              marginBottom: '20px',
            }}>
              {lastPurchase.map((card, index) => (
                <div
                  key={index}
                  style={{
                    padding: '12px',
                    backgroundColor: '#1a1a2e',
                    border: '2px solid #4caf50',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    fontSize: '14px',
                  }}>
                    {card.name}
                  </div>
                  {card.type === 'Monster' && (
                    <div style={{ fontSize: '12px', color: '#aaa' }}>
                      ATK: {card.atk} / DEF: {card.def}
                    </div>
                  )}
                  <div style={{
                    fontSize: '10px',
                    color: '#888',
                    marginTop: '4px',
                  }}>
                    {card.type}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={closeRewards}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopScreen;
