import type { Card as CardType } from '../types';
import AnimatedCard from './AnimatedCard';

interface DraggableCardProps {
  card: CardType;
  onDragEnd: (target: HTMLElement | null) => void;
  faceDown?: boolean;
}

export default function DraggableCard({ card, onDragEnd, faceDown = false }: DraggableCardProps) {
  return (
    <div
      className="card select-none"
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <AnimatedCard 
        card={card} 
        size="small" 
        style={{ width: '100%' }}
        draggable={true}
        onDragEnd={onDragEnd}
        faceDown={faceDown}
        hoverable={true}
      />
    </div>
  );
}
