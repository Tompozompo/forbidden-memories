import { useEffect, useState } from 'react';
import type { Card as CardType } from '../types';
import CardComponent from './Card';
import { useSettingsStore } from '../store/settingsStore';

interface FieldZoneProps {
  player: 0 | 1;
  monsters: (CardType | null)[];
  isActive: boolean;
  onZoneClick?: (zoneIndex: number, card: CardType | null) => void;
  highlightedZone?: number | null;
  attackingZone?: number | null;
  defendingZone?: number | null;
}

export default function FieldZone({ player, monsters, isActive, onZoneClick, highlightedZone, attackingZone, defendingZone }: FieldZoneProps) {
  const [summonedCards, setSummonedCards] = useState<Set<string>>(new Set());
  const { checkerColor1, checkerColor2 } = useSettingsStore();

  useEffect(() => {
    // Track newly summoned cards for animation
    monsters.forEach((card, idx) => {
      if (card && !summonedCards.has(`${player}-${idx}-${card.id}`)) {
        setSummonedCards(prev => new Set([...prev, `${player}-${idx}-${card.id}`]));
      }
    });
  }, [monsters, player, summonedCards]);

  // Create checkered pattern background
  const getCheckerBackground = (index: number) => {
    const isEven = index % 2 === 0;
    return isEven ? checkerColor1 : checkerColor2;
  };

  return (
    <div style={{ margin: '4px 0' }}>
      <div className="field-zone">
        {monsters.map((card, idx) => {
          const isNewSummon = card && !summonedCards.has(`${player}-${idx}-${card.id}`);
          const isAttacking = attackingZone === idx;
          const isDefending = defendingZone === idx;
          
          return (
            <div
              key={idx}
              data-slot={idx}
              data-player={player}
              onClick={() => onZoneClick?.(idx, card)}
              className={`slot ${highlightedZone === idx ? 'highlighted' : ''}`}
              style={{
                borderColor: isActive ? '#4488ff' : '#444',
                backgroundColor: getCheckerBackground(idx),
                boxShadow: highlightedZone === idx ? '0 0 20px rgba(255, 215, 0, 0.8)' : undefined,
              }}
            >
              {card ? (
                <div 
                  className={`card ${isNewSummon ? 'fadeIn' : ''} ${isAttacking || isDefending ? 'shake' : ''}`}
                  style={{ 
                    margin: 0, 
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CardComponent card={card} size="small" style={{ width: '100%', height: '100%' }} />
                </div>
              ) : (
                <span style={{ color: '#666' }}>—</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
