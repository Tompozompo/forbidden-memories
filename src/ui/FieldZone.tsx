import { useEffect, useState } from 'react';
import type { Card } from '../types';

interface FieldZoneProps {
  player: 0 | 1;
  monsters: (Card | null)[];
  isActive: boolean;
  onZoneClick?: (zoneIndex: number, card: Card | null) => void;
  highlightedZone?: number | null;
  attackingZone?: number | null;
  defendingZone?: number | null;
}

export default function FieldZone({ player, monsters, isActive, onZoneClick, highlightedZone, attackingZone, defendingZone }: FieldZoneProps) {
  const [summonedCards, setSummonedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Track newly summoned cards for animation
    monsters.forEach((card, idx) => {
      if (card && !summonedCards.has(`${player}-${idx}-${card.id}`)) {
        setSummonedCards(prev => new Set([...prev, `${player}-${idx}-${card.id}`]));
      }
    });
  }, [monsters, player, summonedCards]);

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '8px', color: '#888' }}>
        Monster Zone
      </div>
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
                boxShadow: highlightedZone === idx ? '0 0 20px rgba(255, 215, 0, 0.8)' : undefined,
              }}
            >
              {card ? (
                <div 
                  className={`card ${isNewSummon ? 'fadeIn' : ''} ${isAttacking || isDefending ? 'shake' : ''}`}
                  style={{ 
                    margin: 0, 
                    fontSize: '7px', 
                    textAlign: 'center', 
                    padding: '4px',
                    backgroundColor: '#2a2a2a',
                    border: '1px solid #555',
                    borderRadius: '3px'
                  }}
                >
                  <div style={{ fontWeight: 'bold', lineHeight: '1.2', fontSize: '8px' }}>{card.name}</div>
                  {card.attr && <div style={{ fontSize: '6px', color: '#aaa' }}>[{card.attr}]</div>}
                  <div style={{ fontSize: '7px', marginTop: '2px', display: 'flex', justifyContent: 'space-around' }}>
                    <span style={{ fontWeight: 'bold' }}>ATK {card.atk ?? 0}</span>
                    <span>DEF {card.def ?? 0}</span>
                  </div>
                  {card.level && <div style={{ fontSize: '6px', color: '#ffa' }}>★{card.level}</div>}
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
