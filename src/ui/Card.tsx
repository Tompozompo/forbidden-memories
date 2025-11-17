import { useState, useEffect, useRef } from 'react';
import type { Card as CardType } from '../types';
import { getCardText } from '../data/cardEffects';

interface CardProps {
  card: CardType;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  style?: React.CSSProperties;
  showTooltip?: boolean;
}

// Attribute color mapping
const ATTR_COLORS: Record<string, string> = {
  EARTH: '#8B4513',
  WATER: '#4169E1',
  FIRE: '#FF4500',
  WIND: '#32CD32',
  LIGHT: '#FFD700',
  DARK: '#9370DB',
};

// Attribute symbols
const ATTR_SYMBOLS: Record<string, string> = {
  EARTH: '🪨',
  WATER: '💧',
  FIRE: '🔥',
  WIND: '💨',
  LIGHT: '☀️',
  DARK: '🌙',
};

// Type/Race symbols
const RACE_SYMBOLS: Record<string, string> = {
  Warrior: '⚔️',
  Beast: '🦁',
  'Beast-Warrior': '🐺',
  Dragon: '🐉',
  Spellcaster: '🪄',
  Zombie: '💀',
  Machine: '⚙️',
  Aqua: '🌊',
  Pyro: '🔥',
  Rock: '🗿',
  Insect: '🐛',
  Plant: '🌿',
  Reptile: '🦎',
  Fiend: '👿',
  Dinosaur: '🦖',
  Fish: '🐟',
  Thunder: '⚡',
  'Winged Beast': '🦅',
  'Sea Serpent': '🐍',
  Fairy: '🧚',
  Angel: '👼',
};

export default function Card({ card, size = 'medium', className = '', style = {}, showTooltip = true }: CardProps) {
  const [showText, setShowText] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isMonster = card.type === 'Monster';
  const isSpell = card.type === 'Spell';
  const isTrap = card.type === 'Trap';
  
  // Get card effect text
  const cardText = (isSpell || isTrap) ? getCardText(card.id) : (card.text || '');
  const hasText = !!cardText;

  // Handle touch device detection and tooltip toggle
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isTouchDevice) {
      setIsTouchDevice(true);
    }
    if (hasText && showTooltip) {
      e.preventDefault(); // Prevent accidental scrolling while tapping
      setShowText(prev => !prev); // Toggle tooltip on tap
    }
  };

  // Close tooltip when clicking outside on touch devices
  useEffect(() => {
    if (!isTouchDevice || !showText) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowText(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isTouchDevice, showText]);

  // Size-based styling - using max-width to maintain aspect ratio
  const sizes = {
    small: {
      maxWidth: '60px',
      fontSize: '6px',
      nameFontSize: '7px',
      statsFontSize: '6px',
      padding: '2px',
    },
    medium: {
      maxWidth: '100px',
      fontSize: '8px',
      nameFontSize: '10px',
      statsFontSize: '9px',
      padding: '4px',
    },
    large: {
      maxWidth: '150px',
      fontSize: '12px',
      nameFontSize: '14px',
      statsFontSize: '12px',
      padding: '6px',
    },
  };

  const sizeStyle = sizes[size];

  // Card frame color based on type
  const getFrameColor = () => {
    if (isMonster) return '#d4af37'; // Gold
    if (isSpell) return '#1d9e74'; // Green
    if (isTrap) return '#bc5a84'; // Purple/Pink
    return '#888';
  };

  const getCardBg = () => {
    if (isMonster) return 'linear-gradient(to bottom, #f5e6d3 0%, #e8d4b8 100%)';
    if (isSpell) return 'linear-gradient(to bottom, #d4f1e8 0%, #b8e6d5 100%)';
    if (isTrap) return 'linear-gradient(to bottom, #f5d4e8 0%, #e8b8d5 100%)';
    return '#f0f0f0';
  };

  const attrColor = card.attr ? ATTR_COLORS[card.attr] : '#888';
  const attrSymbol = card.attr ? ATTR_SYMBOLS[card.attr] : '';
  const raceSymbol = card.race ? RACE_SYMBOLS[card.race] : '';

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        width: '100%',
        maxWidth: sizeStyle.maxWidth,
        aspectRatio: '5 / 7',
        background: getCardBg(),
        border: `2px solid ${getFrameColor()}`,
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        padding: sizeStyle.padding,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
        cursor: hasText && showTooltip ? 'pointer' : 'default',
        ...style,
      }}
      onMouseEnter={() => !isTouchDevice && hasText && showTooltip && setShowText(true)}
      onMouseLeave={() => !isTouchDevice && hasText && showTooltip && setShowText(false)}
      onTouchStart={handleTouchStart}
    >
      {/* Tooltip for card text */}
      {showText && hasText && showTooltip && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: '#fff',
            padding: '10px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            maxWidth: '300px',
            width: 'max-content',
            minWidth: '200px',
            textAlign: 'left',
            marginTop: '8px',
            lineHeight: '1.4',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {card.name}
          </div>
          <div>
            {cardText}
          </div>
        </div>
      )}
      
      {/* Header: Name and Attribute */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2px',
          background: 'rgba(0,0,0,0.1)',
          padding: '1px 2px',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            fontSize: sizeStyle.nameFontSize,
            fontWeight: 'bold',
            color: '#000',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            minWidth: 0,
          }}
          title={card.name}
        >
          {card.name}
        </div>
        {isMonster && card.attr && (
          <div
            style={{
              fontSize: sizeStyle.fontSize,
              marginLeft: '2px',
              backgroundColor: attrColor,
              borderRadius: '50%',
              width: `calc(${sizeStyle.fontSize} * 1.5)`,
              height: `calc(${sizeStyle.fontSize} * 1.5)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(0,0,0,0.2)',
              flexShrink: 0,
            }}
            title={card.attr}
          >
            {attrSymbol}
          </div>
        )}
      </div>

      {/* Image Placeholder Area */}
      <div
        style={{
          flex: 1,
          background: isMonster
            ? 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)'
            : isSpell
            ? 'linear-gradient(135deg, #1a3a2a 0%, #0a2a1a 100%)'
            : 'linear-gradient(135deg, #3a1a1a 0%, #2a0a0a 100%)',
          border: '1px solid rgba(0,0,0,0.3)',
          borderRadius: '2px',
          marginBottom: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#555',
          fontSize: sizeStyle.fontSize,
        }}
      >
        {/* Placeholder for future card artwork */}
      </div>

      {/* Type/Race Info */}
      {isMonster && (
        <div
          style={{
            fontSize: sizeStyle.fontSize,
            color: '#333',
            background: 'rgba(0,0,0,0.05)',
            padding: '1px 2px',
            borderRadius: '2px',
            marginBottom: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}
        >
          <span style={{ fontWeight: 'bold', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {raceSymbol} {card.race}
          </span>
          {card.level && (
            <span style={{ 
              color: '#ffa500', 
              fontWeight: 'bold',
              marginLeft: '2px',
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'clip',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              maxWidth: '50%',
            }}>
              {'★'.repeat(Math.min(card.level, 12))}
            </span>
          )}
        </div>
      )}

      {/* Spell/Trap Type */}
      {(isSpell || isTrap) && (
        <div
          style={{
            fontSize: sizeStyle.fontSize,
            color: isSpell ? '#1d9e74' : '#bc5a84',
            fontWeight: 'bold',
            textAlign: 'center',
            background: 'rgba(0,0,0,0.05)',
            padding: '1px 2px',
            borderRadius: '2px',
            marginBottom: '2px',
          }}
        >
          {isSpell && '🎴 '}{isTrap && '🪤 '}{card.type}
        </div>
      )}

      {/* ATK/DEF Stats */}
      {isMonster && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            fontSize: sizeStyle.statsFontSize,
            fontWeight: 'bold',
            color: '#000',
            background: 'rgba(0,0,0,0.1)',
            padding: '1px 2px',
            borderRadius: '2px',
          }}
        >
          <span style={{ color: '#c41e3a' }}>ATK/{card.atk ?? 0}</span>
          <span style={{ color: '#0e4da4' }}>DEF/{card.def ?? 0}</span>
        </div>
      )}
    </div>
  );
}
