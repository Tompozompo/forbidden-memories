/**
 * AnimatedCard - Enhanced card component with smooth animations
 * Wraps the base Card component with animation capabilities
 */

import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { useState, useEffect } from 'react';
import type { Card as CardType } from '../types';
import Card from './Card';
import { 
  SPRING_CONFIGS, 
  CARD_ANIMATIONS, 
  DEFAULT_CARD_STATE,
} from '../engine/animations';

interface AnimatedCardProps {
  card: CardType;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  style?: React.CSSProperties;
  showTooltip?: boolean;
  
  // Animation props
  animationType?: 'draw' | 'summon' | 'set' | 'flip' | 'destroy' | 'attack' | 'select' | 'hover' | 'fuse' | null;
  faceDown?: boolean;
  selected?: boolean;
  hoverable?: boolean;
  draggable?: boolean;
  
  // Event handlers
  onClick?: () => void;
  onDragEnd?: (target: HTMLElement | null) => void;
  onAnimationComplete?: () => void;
}

export default function AnimatedCard({
  card,
  size = 'medium',
  className = '',
  style = {},
  showTooltip = true,
  animationType = null,
  faceDown = false,
  selected = false,
  hoverable = true,
  draggable = false,
  onClick,
  onDragEnd,
  onAnimationComplete,
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get animation config based on type
  const getAnimationConfig = () => {
    if (animationType && CARD_ANIMATIONS[animationType]) {
      return CARD_ANIMATIONS[animationType];
    }
    
    // Hover animation
    if (isHovered && hoverable) {
      return CARD_ANIMATIONS.hover;
    }
    
    // Selected animation
    if (selected) {
      return CARD_ANIMATIONS.select;
    }
    
    // Face down rotation
    if (faceDown) {
      return {
        from: DEFAULT_CARD_STATE,
        to: { ...DEFAULT_CARD_STATE, rotation: 180 },
      };
    }
    
    return {
      from: DEFAULT_CARD_STATE,
      to: DEFAULT_CARD_STATE,
    };
  };

  const animConfig = getAnimationConfig();
  
  // Spring animation
  const [springProps, api] = useSpring(() => ({
    from: animConfig.from,
    to: animConfig.to,
    config: animationType === 'attack' ? SPRING_CONFIGS.bouncy :
           animationType === 'destroy' ? SPRING_CONFIGS.dramatic :
           animationType === 'summon' || animationType === 'draw' ? SPRING_CONFIGS.smooth :
           animationType === 'fuse' ? SPRING_CONFIGS.dramatic :
           SPRING_CONFIGS.gentle,
    onRest: () => {
      if (onAnimationComplete) onAnimationComplete();
    },
  }));

  // Update animation when props change
  useEffect(() => {
    const config = getAnimationConfig();
    api.start({
      from: config.from,
      to: config.to,
      config: animationType === 'attack' ? SPRING_CONFIGS.bouncy :
             animationType === 'destroy' ? SPRING_CONFIGS.dramatic :
             animationType === 'summon' || animationType === 'draw' ? SPRING_CONFIGS.smooth :
             animationType === 'fuse' ? SPRING_CONFIGS.dramatic :
             SPRING_CONFIGS.gentle,
      reset: animationType !== null && animationType !== 'hover' && animationType !== 'select',
    });
    
    if (animationType !== null) {
      // Animation key would be used for forced re-renders if needed
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationType, selected, isHovered, faceDown]);

  // Drag gesture handling
  const [{ x: dragX, y: dragY }, dragApi] = useSpring(() => ({ x: 0, y: 0 }));
  
  const bind = useDrag(
    ({ down, movement: [mx, my], event }) => {
      if (!draggable) return;
      
      dragApi.start({ x: down ? mx : 0, y: down ? my : 0, immediate: down });
      
      if (!down && onDragEnd) {
        // Drag ended - check what's underneath
        const target = event.target as HTMLElement;
        const clientX = (event as any).clientX ?? (event as any).changedTouches?.[0]?.clientX ?? 0;
        const clientY = (event as any).clientY ?? (event as any).changedTouches?.[0]?.clientY ?? 0;
        
        // Temporarily hide to get element underneath
        target.style.pointerEvents = 'none';
        const elementBelow = document.elementFromPoint(clientX, clientY);
        target.style.pointerEvents = '';
        
        onDragEnd(elementBelow as HTMLElement);
      }
    },
    {
      from: () => [dragX.get(), dragY.get()],
    }
  );

  const handleClick = () => {
    if (onClick && !draggable) {
      onClick();
    }
  };

  const handleMouseEnter = () => {
    if (hoverable && !draggable) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (hoverable) {
      setIsHovered(false);
    }
  };

  return (
    <animated.div
      {...(draggable ? bind() : {})}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        ...style,
        width: '100%',
        height: '100%',
        transform: springProps.scale.to((s) => 
          `translate(${springProps.x.get() + dragX.get()}px, ${springProps.y.get() + dragY.get()}px) 
           scale(${s}) 
           rotate(${springProps.rotation.get()}deg)`
        ),
        opacity: springProps.opacity,
        zIndex: springProps.zIndex,
        cursor: draggable ? 'grab' : onClick ? 'pointer' : 'default',
        touchAction: draggable ? 'none' : 'auto',
        transition: 'filter 0.2s',
        filter: selected ? 'brightness(1.2) drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))' : 'none',
      }}
    >
      <Card 
        card={card} 
        size={size} 
        showTooltip={showTooltip && !faceDown}
        style={{
          width: '100%',
          transform: faceDown ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.3s',
        }}
      />
      
      {/* Face-down card back */}
      {faceDown && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            border: '2px solid #533483',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          <div
            style={{
              fontSize: size === 'small' ? '16px' : size === 'medium' ? '24px' : '32px',
              color: '#533483',
              opacity: 0.3,
            }}
          >
            🃏
          </div>
        </div>
      )}
    </animated.div>
  );
}
