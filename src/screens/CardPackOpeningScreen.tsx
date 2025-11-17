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
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  
  const cards: CardType[] = cardIds
    .map(id => cardsData.find(c => c.id === id))
    .filter(c => c !== undefined) as CardType[];

  // Auto-advance through cards
  useEffect(() => {
    if (skipAnimation) {
      setCurrentIndex(cards.length - 1);
      setIsComplete(true);
      return;
    }

    if (currentIndex < cards.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 800); // Show each card for 800ms
      return () => clearTimeout(timer);
    } else if (currentIndex === cards.length - 1) {
      const timer = setTimeout(() => {
        setIsComplete(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, cards.length, skipAnimation]);

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
        textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
        color: '#ffd700',
        zIndex: 1,
      }}>
        🎴 STARTER DECK RECEIVED! 🎴
      </div>

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
            <div style={{
              transform: 'scale(2.5)',
              transformOrigin: 'center',
              filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))',
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
        color: '#ffd700',
        zIndex: 1,
      }}>
        {currentIndex >= 0 ? `${currentIndex + 1} / ${cards.length}` : 'Opening pack...'}
      </div>

      {/* Card grid preview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
        gap: '8px',
        maxWidth: '600px',
        width: '100%',
        marginTop: '24px',
        padding: '16px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '8px',
        zIndex: 1,
      }}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            style={{
              width: '40px',
              height: '56px',
              borderRadius: '4px',
              background: index <= currentIndex
                ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              border: index === currentIndex
                ? '2px solid #ffd700'
                : index < currentIndex
                ? '2px solid #888'
                : '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: index <= currentIndex
                ? '0 0 10px rgba(255, 215, 0, 0.5)'
                : 'none',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}
          >
            {index <= currentIndex && '✓'}
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
