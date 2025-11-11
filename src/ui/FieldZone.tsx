import type { Card } from '../types';

interface FieldZoneProps {
  player: 0 | 1;
  monsters: (Card | null)[];
  isActive: boolean;
}

export default function FieldZone({ player, monsters, isActive }: FieldZoneProps) {
  return (
    <div className="my-4">
      <div className="text-xs font-bold mb-2">
        Player {player} Field {isActive ? '(Your Turn)' : ''}
      </div>
      <div className="flex gap-2">
        {monsters.map((card, idx) => (
          <div
            key={idx}
            data-slot={idx}
            data-player={player}
            className={`
              w-16 h-20 border-2 rounded flex items-center justify-center text-xs
              ${isActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'}
              ${card ? 'bg-green-100 border-green-500' : ''}
            `}
            style={{ minWidth: '64px' }}
          >
            {card ? (
              <div className="text-center px-1">
                <div className="font-bold text-[10px] leading-tight">{card.name}</div>
                <div className="text-[9px]">ATK {card.atk ?? 0}</div>
              </div>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
