import { useEffect, useState } from 'react';
import type { Card as CardType } from '../types';
import CardComponent from './Card';
import { useSettingsStore } from '../store/settingsStore';
import { getCardEffect } from '../data/cardEffects';

interface FieldZoneProps {
  player: 0 | 1;
  monsters: (CardType | null)[];
  isActive: boolean;
  onZoneClick?: (zoneIndex: number, card: CardType | null) => void;
  highlightedZone?: number | null;
  attackingZone?: number | null;
  defendingZone?: number | null;
  equippedCards?: Map<string, number>; // Map of "player-zone" to equipped spell card ID
}

export default function FieldZone({ player, monsters, isActive, onZoneClick, highlightedZone, attackingZone, defendingZone, equippedCards }: FieldZoneProps) {
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
  
  // Get equipped card bonus for a zone
  const getEquipBonus = (zoneIdx: number): { atk: number; def: number } => {
    if (!equippedCards) return { atk: 0, def: 0 };
    
    const equipKey = `${player}-${zoneIdx}`;
    const equipId = equippedCards.get(equipKey);
    if (!equipId) return { atk: 0, def: 0 };
    
    const effect = getCardEffect(equipId);
    if (!effect) return { atk: 0, def: 0 };
    
    const bonus = { atk: 0, def: 0 };
    if (effect.type === 'equip_atk' || effect.type === 'equip_both') {
      bonus.atk = effect.value || 0;
    }
    if (effect.type === 'equip_def' || effect.type === 'equip_both') {
      bonus.def = effect.value || 0;
    }
    return bonus;
  };

  return (
    <div style={{ margin: '4px 0' }}>
      <div className="field-zone">
        {monsters.map((card, idx) => {
          const isNewSummon = card && !summonedCards.has(`${player}-${idx}-${card.id}`);
          const isAttacking = attackingZone === idx;
          const isDefending = defendingZone === idx;
          const equipBonus = getEquipBonus(idx);
          const hasEquip = equipBonus.atk > 0 || equipBonus.def > 0;
          
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
                position: 'relative',
              }}
            >
              {card ? (
                <>
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
                    <CardComponent card={card} size="small" style={{ width: '100%' }} />
                  </div>
                  {hasEquip && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        background: 'linear-gradient(135deg, #1d9e74 0%, #16805e 100%)',
                        color: '#fff',
                        fontSize: '8px',
                        fontWeight: 'bold',
                        padding: '1px 3px',
                        borderRadius: '3px',
                        border: '1px solid #0d5e44',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.5)',
                        pointerEvents: 'none',
                      }}
                      title={`ATK +${equipBonus.atk}${equipBonus.def > 0 ? ` / DEF +${equipBonus.def}` : ''}`}
                    >
                      🎴
                    </div>
                  )}
                </>
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
