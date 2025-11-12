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
    <div style={{ margin: '10px 0' }}>
      <div style={{ fontSize: 'clamp(8px, 2vw, 10px)', fontWeight: 'bold', marginBottom: '4px', color: '#888' }}>
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
                  title={card.name}
                  style={{ 
                    margin: 0, 
                    width: '100%',
                    height: '100%'
                  }}
                >
                  <div className="card-content" style={{ 
                    fontSize: 'clamp(6px, 1.5vw, 7px)', 
                    backgroundColor: '#2a2a2a',
                    border: '1px solid #555',
                    borderRadius: '3px',
                    textAlign: 'center',
                  }}>
                    <div className="card-name" style={{ fontSize: 'clamp(7px, 1.8vw, 8px)' }}>{card.name}</div>
                    {card.attr && <div className="card-sub" style={{ fontSize: 'clamp(5px, 1.2vw, 6px)' }}>[{card.attr}]</div>}
                    <div className="card-stats" style={{ fontSize: 'clamp(6px, 1.5vw, 7px)' }}>
                      <span>ATK {card.atk ?? 0}</span>
                      <span>DEF {card.def ?? 0}</span>
                    </div>
                    {card.level && <div style={{ fontSize: 'clamp(5px, 1.2vw, 6px)', color: '#ffa' }}>★{card.level}</div>}
                  </div>
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
