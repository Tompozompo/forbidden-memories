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
      }}
      className="card select-none"
    >
      <div style={{ fontSize: '8px', textAlign: 'center', padding: '4px' }}>
        {card.name}
      </div>
    </animated.div>
  );
}
