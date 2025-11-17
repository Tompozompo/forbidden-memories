import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated, config } from '@react-spring/web';
import Card from '../ui/Card';
import cardsData from '../data/cards.json';
import type { Card as CardType } from '../types';

interface CardPackOpeningScreenProps {
  cardIds: number[];
}

function CardPackOpeningScreen({ cardIds }: CardPackOpeningScreenProps) {
  const navigate = useNavigate();
  const [currentGroupIndex, setCurrentGroupIndex] = useState(-1);
  const [currentCardInGroup, setCurrentCardInGroup] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  
  const cards: CardType[] = cardIds
    .map(id => cardsData.find(c => c.id === id))
    .filter(c => c !== undefined) as CardType[];

  // Randomly select one card to be the "rare" card (guaranteed rare)
  const [rareCardIndex] = useState(() => Math.floor(Math.random() * cards.length));

  // Group cards into 4 groups of 5
  const cardGroups = [
    cards.slice(0, 5),
    cards.slice(5, 10),
    cards.slice(10, 15),
    cards.slice(15, 20),
  ];

  // Calculate current overall card index
  const currentIndex = currentGroupIndex >= 0 && currentCardInGroup >= 0
    ? currentGroupIndex * 5 + currentCardInGroup
    : -1;

  // Auto-advance through card groups
  useEffect(() => {
    if (skipAnimation) {
      setCurrentGroupIndex(3);
      setCurrentCardInGroup(4);
      setIsComplete(true);
      return;
    }

    // Start showing first group
    if (currentGroupIndex === -1) {
      const timer = setTimeout(() => {
        setCurrentGroupIndex(0);
        setCurrentCardInGroup(0);
      }, 500);
      return () => clearTimeout(timer);
    }

    // Advance within current group
    if (currentCardInGroup < 4) {
      const timer = setTimeout(() => {
        setCurrentCardInGroup(prev => prev + 1);
      }, 600); // Show each card for 600ms
      return () => clearTimeout(timer);
    }

    // Move to next group after a pause
    if (currentCardInGroup === 4 && currentGroupIndex < 3) {
      const timer = setTimeout(() => {
        setCurrentGroupIndex(prev => prev + 1);
        setCurrentCardInGroup(0);
      }, 1200); // Pause between groups
      return () => clearTimeout(timer);
    }

    // Complete animation
    if (currentGroupIndex === 3 && currentCardInGroup === 4) {
      const timer = setTimeout(() => {
        setIsComplete(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentGroupIndex, currentCardInGroup, skipAnimation]);

  // Animation for card reveal
  const cardAnimation = useSpring({
    opacity: currentIndex >= 0 ? 1 : 0,
    transform: currentIndex >= 0 ? 'scale(1) rotateY(0deg)' : 'scale(0.5) rotateY(180deg)',
    config: config.wobbly,
  });

  // Background shimmer animation
  const shimmerAnimation = useSpring({
    from: { backgroundPosition: '0% 0%' },
    to: { backgroundPosition: '100% 100%' },
    config: { duration: 3000 },
    loop: true,
  });

  // Determine if current card is the rare card
  const isRareCard = currentIndex === rareCardIndex;

  // Get color scheme for current card
  const getCardGlow = () => {
    if (isRareCard) {
      return {
        shadowColor: 'rgba(138, 43, 226, 0.8)', // Purple glow for rare
        borderColor: '#8a2be2',
        glowIntensity: '0 0 30px rgba(138, 43, 226, 0.8), 0 0 60px rgba(138, 43, 226, 0.5)',
      };
    }
    return {
      shadowColor: 'rgba(255, 215, 0, 0.5)',
      borderColor: '#ffd700',
      glowIntensity: '0 0 20px rgba(255, 215, 0, 0.5)',
    };
  };

  const cardGlow = getCardGlow();

  const handleContinue = () => {
    navigate('/campaign-menu');
  };

  const handleSkip = () => {
    setSkipAnimation(true);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '16px',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 50%, #1a1a2e 100%)',
      backgroundSize: '200% 200%',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background effect */}
      <animated.div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
        ...shimmerAnimation,
        pointerEvents: 'none',
      }} />

      {/* Title */}
      <div style={{
        fontSize: 'clamp(20px, 6vw, 36px)',
        fontWeight: 'bold',
        marginBottom: '32px',
        textAlign: 'center',
        textShadow: isRareCard 
          ? '0 0 20px rgba(138, 43, 226, 0.8)'
          : '0 0 20px rgba(255, 215, 0, 0.8)',
        color: isRareCard ? '#ba55d3' : '#ffd700',
        zIndex: 1,
        transition: 'all 0.5s ease',
      }}>
        {isRareCard ? '✨ RARE CARD! ✨' : '🎴 STARTER DECK RECEIVED! 🎴'}
      </div>

      {/* Group indicator */}
      {currentGroupIndex >= 0 && (
        <div style={{
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#aaa',
          zIndex: 1,
        }}>
          Pack {currentGroupIndex + 1} of 4
        </div>
      )}

      {/* Card display area */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '350px',
        position: 'relative',
        zIndex: 1,
      }}>
        {currentIndex >= 0 && cards[currentIndex] && (
          <animated.div style={{
            ...cardAnimation,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}>
            {isRareCard && (
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#ba55d3',
                textShadow: '0 0 10px rgba(138, 43, 226, 0.8)',
                marginBottom: '8px',
                animation: 'pulse 1s infinite',
              }}>
                ⭐ RARE ⭐
              </div>
            )}
            <div style={{
              transform: 'scale(2.5)',
              transformOrigin: 'center',
              filter: `drop-shadow(${cardGlow.glowIntensity})`,
              transition: 'filter 0.5s ease',
            }}>
              <Card card={cards[currentIndex]} size="large" showTooltip={false} />
            </div>
          </animated.div>
        )}
      </div>

      {/* Progress indicator */}
      <div style={{
        marginTop: '32px',
        fontSize: '18px',
        fontWeight: 'bold',
        color: isRareCard ? '#ba55d3' : '#ffd700',
        zIndex: 1,
        transition: 'color 0.5s ease',
      }}>
        {currentIndex >= 0 ? `${currentIndex + 1} / ${cards.length}` : 'Opening packs...'}
      </div>

      {/* Card grid preview - 4 groups of 5 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '24px',
        padding: '16px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '8px',
        zIndex: 1,
      }}>
        {cardGroups.map((group, groupIdx) => (
          <div
            key={groupIdx}
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
            }}
          >
            {group.map((card, cardIdx) => {
              const absoluteIndex = groupIdx * 5 + cardIdx;
              const isRevealed = absoluteIndex <= currentIndex;
              const isCurrent = absoluteIndex === currentIndex;
              const isRare = absoluteIndex === rareCardIndex;

              return (
                <div
                  key={card.id}
                  style={{
                    width: '40px',
                    height: '56px',
                    borderRadius: '4px',
                    background: isRevealed
                      ? isRare
                        ? 'linear-gradient(135deg, #ba55d3 0%, #9370db 100%)'
                        : 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: isCurrent
                      ? isRare
                        ? '2px solid #ba55d3'
                        : '2px solid #ffd700'
                      : isRevealed
                      ? '2px solid #888'
                      : '2px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: isRevealed
                      ? isRare
                        ? '0 0 15px rgba(138, 43, 226, 0.6)'
                        : '0 0 10px rgba(255, 215, 0, 0.5)'
                      : 'none',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                >
                  {isRevealed && (isRare ? '⭐' : '✓')}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginTop: '32px',
        zIndex: 1,
      }}>
        {!isComplete && !skipAnimation && (
          <button
            onClick={handleSkip}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: '#666',
              color: '#fff',
              border: '2px solid #888',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.backgroundColor = '#777';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = '#666';
            }}
          >
            Skip Animation
          </button>
        )}
        
        {isComplete && (
          <button
            onClick={handleContinue}
            style={{
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: '#4caf50',
              color: '#fff',
              border: '2px solid #fff',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 0 20px rgba(76, 175, 80, 0.5)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(76, 175, 80, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.5)';
            }}
          >
            Continue to Campaign
          </button>
        )}
      </div>
    </div>
  );
}

export default CardPackOpeningScreen;
