import { useRef } from 'react';
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';
import type { Card } from '../types';

interface DraggableCardProps {
  card: Card;
  onDragEnd: (target: HTMLElement | null) => void;
}

export default function DraggableCard({ card, onDragEnd }: DraggableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useDrag(
    ({ down, movement: [mx, my], event }) => {
      api.start({ x: down ? mx : 0, y: down ? my : 0, immediate: down });
      
      if (!down) {
        // drag ended - check what's underneath
        // Hide the card temporarily to check what's underneath
        if (cardRef.current) {
          cardRef.current.style.pointerEvents = 'none';
        }
        
        const clientX = (event as any).clientX ?? (event as any).changedTouches?.[0]?.clientX ?? 0;
        const clientY = (event as any).clientY ?? (event as any).changedTouches?.[0]?.clientY ?? 0;
        const target = document.elementFromPoint(clientX, clientY);
        
        // Restore pointer events
        if (cardRef.current) {
          cardRef.current.style.pointerEvents = '';
        }
        
        onDragEnd(target as HTMLElement);
      }
    },
    {
      from: () => [x.get(), y.get()],
    }
  );

  return (
    <animated.div
      ref={cardRef}
      {...bind()}
      style={{
        x,
        y,
        touchAction: 'none',
        cursor: 'grab',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
      }}
      className="card select-none"
      title={card.name} // Show full name on hover
    >
      <div className="card-content" style={{ 
        backgroundColor: card.type === 'Monster' ? '#2a2a2a' : card.type === 'Spell' ? '#1a3a2a' : '#3a1a1a',
        border: '1px solid #555',
        borderRadius: '3px',
        textAlign: 'center',
      }}>
        <div className="card-name" style={{ fontSize: 'clamp(7px, 1.8vw, 8px)' }}>{card.name}</div>
        {card.type === 'Monster' && (
          <>
            <div className="card-sub" style={{ fontSize: 'clamp(5px, 1.2vw, 6px)' }}>
              {card.attr && `[${card.attr}]`} {card.race && `${card.race}`}
            </div>
            <div className="card-stats" style={{ fontSize: 'clamp(6px, 1.5vw, 7px)' }}>
              <span>ATK {card.atk ?? 0}</span>
              <span>DEF {card.def ?? 0}</span>
            </div>
            {card.level && <div style={{ fontSize: 'clamp(5px, 1.2vw, 6px)', color: '#ffa' }}>★{card.level}</div>}
          </>
        )}
        {(card.type === 'Spell' || card.type === 'Trap') && (
          <div style={{ fontSize: 'clamp(5px, 1.2vw, 6px)', color: card.type === 'Spell' ? '#2a8' : '#a52', fontWeight: 'bold' }}>
            {card.type}
          </div>
        )}
      </div>
    </animated.div>
  );
}
