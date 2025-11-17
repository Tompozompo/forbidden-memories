import type { Card } from '../types';
import { useSettingsStore } from '../store/settingsStore';
import CardComponent from './Card';

interface SpellTrapZoneProps {
  player: 0 | 1;
  cards: (Card | null)[];
  isActive: boolean;
}

export default function SpellTrapZone({ cards, isActive }: SpellTrapZoneProps) {
  const { checkerColor1, checkerColor2 } = useSettingsStore();

  // Create checkered pattern background
  const getCheckerBackground = (index: number) => {
    const isEven = index % 2 === 0;
    return isEven ? checkerColor2 : checkerColor1; // Inverse of monster zone for visual distinction
  };

  return (
    <div style={{ margin: '4px 0' }}>
      <div className="spell-trap-zone">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="slot"
            style={{
              border: `2px solid ${isActive ? '#885500' : '#332200'}`,
              backgroundColor: getCheckerBackground(idx),
            }}
          >
            {card ? (
              <div style={{ width: '100%', height: '100%' }}>
                <CardComponent card={card} size="small" style={{ width: '100%', height: '100%' }} />
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
