/**
 * ScreenTransition - Smooth transitions between screens
 */

import { useSpring, animated, config } from '@react-spring/web';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface ScreenTransitionProps {
  children: React.ReactNode;
  transitionType?: 'fade' | 'slide' | 'zoom' | 'blur';
}

export default function ScreenTransition({ children, transitionType = 'fade' }: ScreenTransitionProps) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<'entering' | 'exiting'>('entering');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('exiting');
    }
  }, [location, displayLocation]);

  const transitions = {
    fade: {
      entering: { opacity: 1, transform: 'translateX(0px) scale(1)', filter: 'blur(0px)' },
      exiting: { opacity: 0, transform: 'translateX(0px) scale(1)', filter: 'blur(0px)' },
    },
    slide: {
      entering: { opacity: 1, transform: 'translateX(0px) scale(1)', filter: 'blur(0px)' },
      exiting: { opacity: 0, transform: 'translateX(-100px) scale(1)', filter: 'blur(0px)' },
    },
    zoom: {
      entering: { opacity: 1, transform: 'translateX(0px) scale(1)', filter: 'blur(0px)' },
      exiting: { opacity: 0, transform: 'translateX(0px) scale(0.9)', filter: 'blur(0px)' },
    },
    blur: {
      entering: { opacity: 1, transform: 'translateX(0px) scale(1)', filter: 'blur(0px)' },
      exiting: { opacity: 0, transform: 'translateX(0px) scale(1)', filter: 'blur(8px)' },
    },
  };

  const props = useSpring({
    ...transitions[transitionType][transitionStage],
    config: config.gentle,
    onRest: () => {
      if (transitionStage === 'exiting') {
        setDisplayLocation(location);
        setTransitionStage('entering');
      }
    },
  });

  return (
    <animated.div
      style={{
        ...props,
        width: '100%',
        height: '100%',
        minHeight: '100vh',
      }}
    >
      {children}
    </animated.div>
  );
}

// Staggered list animation for card grids
interface StaggeredListProps {
  children: React.ReactNode[];
  staggerMs?: number;
  animationType?: 'fade' | 'slideUp' | 'scale';
}

export function StaggeredList({ children, staggerMs = 50, animationType = 'fade' }: StaggeredListProps) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    // Reset visible items when children change
    setVisibleItems([]);
    
    // Stagger the appearance of items
    children.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, index]);
      }, index * staggerMs);
    });
  }, [children, staggerMs]);

  return (
    <>
      {children.map((child, index) => (
        <StaggeredItem
          key={index}
          index={index}
          visible={visibleItems.includes(index)}
          animationType={animationType}
        >
          {child}
        </StaggeredItem>
      ))}
    </>
  );
}

interface StaggeredItemProps {
  children: React.ReactNode;
  index: number;
  visible: boolean;
  animationType: 'fade' | 'slideUp' | 'scale';
}

function StaggeredItem({ children, visible, animationType }: StaggeredItemProps) {
  const animations = {
    fade: {
      from: { opacity: 0 },
      to: { opacity: visible ? 1 : 0 },
    },
    slideUp: {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: visible ? 1 : 0, transform: visible ? 'translateY(0px)' : 'translateY(20px)' },
    },
    scale: {
      from: { opacity: 0, transform: 'scale(0.8)' },
      to: { opacity: visible ? 1 : 0, transform: visible ? 'scale(1)' : 'scale(0.8)' },
    },
  };

  const props = useSpring({
    ...animations[animationType].to,
    from: animations[animationType].from,
    config: config.gentle,
  });

  return (
    <animated.div style={props}>
      {children}
    </animated.div>
  );
}
