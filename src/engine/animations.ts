/**
 * Animation System - Central management for all game animations
 * Provides reusable spring configs and animation utilities
 */

import type { SpringConfig } from '@react-spring/web';

// Animation presets for different game actions
export const SPRING_CONFIGS = {
  // Fast, snappy animations for UI feedback
  snappy: { tension: 300, friction: 25 } as SpringConfig,
  
  // Smooth, elegant animations for cards
  smooth: { tension: 200, friction: 30 } as SpringConfig,
  
  // Bouncy animations for dramatic effects
  bouncy: { tension: 280, friction: 20 } as SpringConfig,
  
  // Slow, deliberate animations for important events
  dramatic: { tension: 120, friction: 20 } as SpringConfig,
  
  // Stiff, immediate animations for instant feedback
  stiff: { tension: 500, friction: 40 } as SpringConfig,
  
  // Gentle animations for subtle effects
  gentle: { tension: 150, friction: 35 } as SpringConfig,
} as const;

// Animation duration constants (in milliseconds)
export const ANIMATION_DURATIONS = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 600,
  dramatic: 1000,
} as const;

// Common easing functions
export const EASINGS = {
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutBounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    else return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
} as const;

// Card animation states
export interface CardAnimationState {
  scale: number;
  rotation: number;
  x: number;
  y: number;
  opacity: number;
  zIndex: number;
}

export const DEFAULT_CARD_STATE: CardAnimationState = {
  scale: 1,
  rotation: 0,
  x: 0,
  y: 0,
  opacity: 1,
  zIndex: 1,
};

// Animation presets for common card actions
export const CARD_ANIMATIONS = {
  // Card being drawn from deck
  draw: {
    from: { scale: 0.5, rotation: 0, x: 0, y: -100, opacity: 0, zIndex: 10 },
    to: { scale: 1, rotation: 0, x: 0, y: 0, opacity: 1, zIndex: 1 },
  },
  
  // Card being summoned to field
  summon: {
    from: { scale: 0.8, rotation: 15, x: 0, y: 50, opacity: 0, zIndex: 10 },
    to: { scale: 1, rotation: 0, x: 0, y: 0, opacity: 1, zIndex: 1 },
  },
  
  // Card being set face-down
  set: {
    from: { scale: 1, rotation: 0, x: 0, y: 0, opacity: 1, zIndex: 1 },
    to: { scale: 1, rotation: 180, x: 0, y: 0, opacity: 1, zIndex: 1 },
  },
  
  // Card flip (face-down to face-up)
  flip: {
    from: { scale: 1, rotation: 180, x: 0, y: 0, opacity: 1, zIndex: 1 },
    to: { scale: 1, rotation: 360, x: 0, y: 0, opacity: 1, zIndex: 1 },
  },
  
  // Card being destroyed
  destroy: {
    from: { scale: 1, rotation: 0, x: 0, y: 0, opacity: 1, zIndex: 1 },
    to: { scale: 0.5, rotation: 45, x: 0, y: 100, opacity: 0, zIndex: 0 },
  },
  
  // Card attacking
  attack: {
    from: { scale: 1, rotation: 0, x: 0, y: 0, opacity: 1, zIndex: 1 },
    to: { scale: 1.2, rotation: -5, x: 0, y: -20, opacity: 1, zIndex: 100 },
  },
  
  // Card being selected
  select: {
    from: { scale: 1, rotation: 0, x: 0, y: 0, opacity: 1, zIndex: 1 },
    to: { scale: 1.1, rotation: 0, x: 0, y: -15, opacity: 1, zIndex: 50 },
  },
  
  // Card hover state
  hover: {
    from: { scale: 1, rotation: 0, x: 0, y: 0, opacity: 1, zIndex: 1 },
    to: { scale: 1.05, rotation: 0, x: 0, y: -8, opacity: 1, zIndex: 10 },
  },
  
  // Fusion animation (cards combining)
  fuse: {
    from: { scale: 1, rotation: 0, x: 0, y: 0, opacity: 1, zIndex: 1 },
    to: { scale: 0.3, rotation: 720, x: 0, y: 0, opacity: 0, zIndex: 100 },
  },
};

// Battle animation sequences
export interface BattleAnimationPhase {
  duration: number;
  attacker: Partial<CardAnimationState>;
  defender?: Partial<CardAnimationState>;
}

export const BATTLE_ANIMATIONS = {
  // Direct attack (no defender)
  directAttack: [
    { duration: 200, attacker: { scale: 1.2, y: -30, rotation: -10 } },
    { duration: 300, attacker: { scale: 1.4, y: -100, rotation: 0, opacity: 0.8 } },
    { duration: 200, attacker: { scale: 1, y: 0, rotation: 0, opacity: 1 } },
  ] as BattleAnimationPhase[],
  
  // Normal battle (attacker vs defender)
  normalBattle: [
    // Wind up
    { duration: 200, attacker: { scale: 1.2, y: -20, rotation: -15 }, defender: { scale: 1.1 } },
    // Clash
    { duration: 150, attacker: { scale: 1.3, y: -10, rotation: 5, x: 20 }, defender: { scale: 1.2, x: -20 } },
    // Impact
    { duration: 100, attacker: { scale: 1.1, opacity: 0.9 }, defender: { scale: 0.9, opacity: 0.9 } },
    // Return
    { duration: 200, attacker: { scale: 1, y: 0, rotation: 0, x: 0, opacity: 1 }, defender: { scale: 1, x: 0, opacity: 1 } },
  ] as BattleAnimationPhase[],
};

// Particle effect configurations
export interface ParticleConfig {
  count: number;
  colors: string[];
  lifetime: number;
  velocity: { min: number; max: number };
  spread: number;
  gravity: number;
}

export const PARTICLE_EFFECTS = {
  // Damage particles (red/orange)
  damage: {
    count: 15,
    colors: ['#ff4444', '#ff8844', '#ffaa44'],
    lifetime: 800,
    velocity: { min: 50, max: 150 },
    spread: 180,
    gravity: 200,
  } as ParticleConfig,
  
  // Healing particles (green/white)
  heal: {
    count: 12,
    colors: ['#44ff44', '#88ff88', '#ffffff'],
    lifetime: 1000,
    velocity: { min: 30, max: 100 },
    spread: 120,
    gravity: -100,
  } as ParticleConfig,
  
  // Destruction particles (dark/fire)
  destroy: {
    count: 20,
    colors: ['#ff2222', '#882222', '#444444'],
    lifetime: 1200,
    velocity: { min: 80, max: 200 },
    spread: 360,
    gravity: 150,
  } as ParticleConfig,
  
  // Fusion particles (gold/purple)
  fusion: {
    count: 30,
    colors: ['#ffd700', '#ff00ff', '#00ffff'],
    lifetime: 1500,
    velocity: { min: 100, max: 250 },
    spread: 360,
    gravity: 0,
  } as ParticleConfig,
  
  // Summon particles (blue/white)
  summon: {
    count: 18,
    colors: ['#4488ff', '#88bbff', '#ffffff'],
    lifetime: 1000,
    velocity: { min: 60, max: 120 },
    spread: 360,
    gravity: 50,
  } as ParticleConfig,
};

// Screen transition effects
export interface ScreenTransition {
  type: 'fade' | 'slide' | 'zoom' | 'blur';
  duration: number;
  easing: keyof typeof EASINGS;
}

export const SCREEN_TRANSITIONS = {
  fade: { type: 'fade' as const, duration: 300, easing: 'easeInOutCubic' as const },
  slideLeft: { type: 'slide' as const, duration: 400, easing: 'easeOutCubic' as const },
  slideRight: { type: 'slide' as const, duration: 400, easing: 'easeOutCubic' as const },
  zoom: { type: 'zoom' as const, duration: 500, easing: 'easeInOutCubic' as const },
  blur: { type: 'blur' as const, duration: 350, easing: 'easeInOutCubic' as const },
} as const;

// Utility function to create staggered animations
export function createStaggeredDelay(index: number, baseDelay: number = 0, staggerMs: number = 50): number {
  return baseDelay + (index * staggerMs);
}

// Utility function to interpolate between animation states
export function interpolateState(
  from: Partial<CardAnimationState>,
  to: Partial<CardAnimationState>,
  progress: number
): CardAnimationState {
  const result = { ...DEFAULT_CARD_STATE };
  
  for (const key of Object.keys(to) as (keyof CardAnimationState)[]) {
    const fromVal = from[key] ?? DEFAULT_CARD_STATE[key];
    const toVal = to[key] ?? DEFAULT_CARD_STATE[key];
    result[key] = fromVal + (toVal - fromVal) * progress;
  }
  
  return result;
}

// Queue system for managing sequential animations
export class AnimationQueue {
  private queue: Array<() => Promise<void>> = [];
  private running = false;

  add(animation: () => Promise<void>): void {
    this.queue.push(animation);
    if (!this.running) {
      this.process();
    }
  }

  private async process(): Promise<void> {
    this.running = true;
    
    while (this.queue.length > 0) {
      const animation = this.queue.shift();
      if (animation) {
        await animation();
      }
    }
    
    this.running = false;
  }

  clear(): void {
    this.queue = [];
    this.running = false;
  }
}
