/**
 * Particle System - Handles visual particle effects for game events
 */

import { useEffect, useState } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import type { ParticleConfig } from '../engine/animations';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  lifetime: number;
  size: number;
}

interface ParticleSystemProps {
  active: boolean;
  x: number;
  y: number;
  config: ParticleConfig;
  onComplete?: () => void;
}

export function ParticleSystem({ active, x, y, config: particleConfig, onComplete }: ParticleSystemProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    // Generate particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleConfig.count; i++) {
      const angle = (Math.random() * particleConfig.spread - particleConfig.spread / 2) * (Math.PI / 180);
      const speed = particleConfig.velocity.min + Math.random() * (particleConfig.velocity.max - particleConfig.velocity.min);
      
      newParticles.push({
        id: i,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)],
        lifetime: particleConfig.lifetime,
        size: 3 + Math.random() * 4,
      });
    }
    
    setParticles(newParticles);

    // Clean up after lifetime
    const timeout = setTimeout(() => {
      setParticles([]);
      if (onComplete) onComplete();
    }, particleConfig.lifetime);

    return () => clearTimeout(timeout);
  }, [active, particleConfig, onComplete]);

  if (!active || particles.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {particles.map((particle) => (
        <ParticleElement
          key={particle.id}
          particle={particle}
          gravity={particleConfig.gravity}
        />
      ))}
    </div>
  );
}

interface ParticleElementProps {
  particle: Particle;
  gravity: number;
}

function ParticleElement({ particle, gravity }: ParticleElementProps) {
  const props = useSpring({
    from: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
    },
    to: {
      x: particle.vx * (particle.lifetime / 1000),
      y: particle.vy * (particle.lifetime / 1000) + 0.5 * gravity * Math.pow(particle.lifetime / 1000, 2),
      opacity: 0,
      scale: 0.3,
    },
    config: { duration: particle.lifetime },
  });

  return (
    <animated.div
      style={{
        position: 'absolute',
        width: particle.size,
        height: particle.size,
        borderRadius: '50%',
        backgroundColor: particle.color,
        boxShadow: `0 0 ${particle.size}px ${particle.color}`,
        transform: props.x.to((x) => `translate(${x}px, ${props.y.get()}px) scale(${props.scale.get()})`),
        opacity: props.opacity,
      }}
    />
  );
}

// Damage number display component
interface DamageNumberProps {
  value: number;
  x: number;
  y: number;
  isHeal?: boolean;
  onComplete?: () => void;
}

export function DamageNumber({ value, x, y, isHeal = false, onComplete }: DamageNumberProps) {
  const props = useSpring({
    from: { y: 0, opacity: 1, scale: 0.5 },
    to: { y: -60, opacity: 0, scale: 1.5 },
    config: config.slow,
    onRest: onComplete,
  });

  return (
    <animated.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: props.y.to((yVal) => `translate(-50%, ${yVal}px) scale(${props.scale.get()})`),
        opacity: props.opacity,
        color: isHeal ? '#44ff44' : '#ff4444',
        fontSize: '24px',
        fontWeight: 'bold',
        textShadow: isHeal 
          ? '0 0 10px #44ff44, 0 0 20px #44ff44, 2px 2px 4px rgba(0,0,0,0.8)'
          : '0 0 10px #ff4444, 0 0 20px #ff4444, 2px 2px 4px rgba(0,0,0,0.8)',
        pointerEvents: 'none',
        zIndex: 1001,
        whiteSpace: 'nowrap',
      }}
    >
      {isHeal ? '+' : '-'}{Math.abs(value)}
    </animated.div>
  );
}

// Flash effect overlay
interface FlashEffectProps {
  active: boolean;
  color?: string;
  duration?: number;
  onComplete?: () => void;
}

export function FlashEffect({ active, color = '#ffffff', duration = 200, onComplete }: FlashEffectProps) {
  const props = useSpring({
    from: { opacity: active ? 0.7 : 0 },
    to: { opacity: 0 },
    config: { duration },
    onRest: onComplete,
  });

  if (!active) return null;

  return (
    <animated.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: color,
        opacity: props.opacity,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}

// Shake effect wrapper
interface ShakeWrapperProps {
  shake: boolean;
  intensity?: number;
  duration?: number;
  children: React.ReactNode;
}

export function ShakeWrapper({ shake, intensity = 10, duration = 300, children }: ShakeWrapperProps) {
  const [shakeCount, setShakeCount] = useState(0);
  
  useEffect(() => {
    if (shake) {
      setShakeCount((c) => c + 1);
    }
  }, [shake]);

  const props = useSpring({
    from: { x: 0 },
    to: shake 
      ? [
          { x: intensity },
          { x: -intensity },
          { x: intensity / 2 },
          { x: -intensity / 2 },
          { x: 0 },
        ]
      : { x: 0 },
    config: { duration: duration / 5 },
    reset: shake,
    key: shakeCount,
  });

  return (
    <animated.div
      style={{
        transform: props.x.to((x) => `translateX(${x}px)`),
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </animated.div>
  );
}

// Glow effect for special cards/zones
interface GlowEffectProps {
  active: boolean;
  color?: string;
  intensity?: number;
  children: React.ReactNode;
}

export function GlowEffect({ active, color = '#ffd700', intensity = 20, children }: GlowEffectProps) {
  const props = useSpring({
    from: { glow: 0 },
    to: { glow: active ? 1 : 0 },
    config: config.slow,
  });

  return (
    <animated.div
      style={{
        filter: props.glow.to((g) => `drop-shadow(0 0 ${g * intensity}px ${color})`),
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </animated.div>
  );
}
