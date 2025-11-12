import type { Card } from '../types';

interface SpellTrapZoneProps {
  player: 0 | 1;
  cards: (Card | null)[];
  isActive: boolean;
}

export default function SpellTrapZone({ cards, isActive }: SpellTrapZoneProps) {
  return (
    <div style={{ margin: '8px 0' }}>
      <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '4px', color: '#888' }}>
        Spell/Trap Zone
      </div>
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
        {cards.map((card, idx) => (
          <div
            key={idx}
            style={{
              width: '60px',
              height: '40px',
              border: `2px solid ${isActive ? '#885500' : '#332200'}`,
              borderRadius: '4px',
              backgroundColor: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '7px',
              padding: '2px',
            }}
          >
            {card ? (
              <div style={{ textAlign: 'center', color: card.type === 'Spell' ? '#2a8' : '#a52' }}>
                {card.type === 'Spell' ? '🔮' : '⚠️'}
              </div>
            ) : (
              <span style={{ color: '#444' }}>—</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
