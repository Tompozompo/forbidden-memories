import type { Card } from '../types';

interface SpellTrapZoneProps {
  player: 0 | 1;
  cards: (Card | null)[];
  isActive: boolean;
}

export default function SpellTrapZone({ cards, isActive }: SpellTrapZoneProps) {
  return (
    <div style={{ margin: '8px 0' }}>
      <div style={{ fontSize: 'clamp(8px, 2vw, 10px)', fontWeight: 'bold', marginBottom: '4px', color: '#888' }}>
        Spell/Trap Zone
      </div>
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
        {cards.map((card, idx) => (
          <div
            key={idx}
            style={{
              flex: '1',
              maxWidth: '60px',
              height: 'clamp(30px, 8vw, 40px)',
              border: `2px solid ${isActive ? '#885500' : '#332200'}`,
              borderRadius: '4px',
              backgroundColor: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(6px, 1.5vw, 7px)',
              padding: '2px',
              minWidth: '40px',
            }}
          >
            {card ? (
              <div style={{ textAlign: 'center', color: card.type === 'Spell' ? '#2a8' : '#a52', fontSize: 'clamp(12px, 3vw, 16px)' }}>
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
