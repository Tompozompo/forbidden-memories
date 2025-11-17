// Effects engine for handling spell/trap card effects
import type { Card } from '../types';
import type { DuelState } from './duel';
import { getCardEffect, type CardEffect } from '../data/cardEffects';

// Active effect on the field
export interface ActiveEffect {
  effectId: string; // Unique ID for this effect instance
  cardId: number;   // Card that created this effect
  effect: CardEffect;
  player: 0 | 1;    // Player who activated the effect
  targetPlayer?: 0 | 1; // Affected player (for equip spells)
  targetZone?: number;  // Monster zone index (for equip spells)
  turnsRemaining?: number; // For duration-based effects
}

// Apply an effect to the duel state
export function applyEffect(
  state: DuelState,
  cardId: number,
  player: 0 | 1,
  _targetPlayer?: 0 | 1,
  _targetZone?: number
): DuelState {
  const effect = getCardEffect(cardId);
  if (!effect) return state;

  let newState = { ...state };
  
  switch (effect.type) {
    case 'direct_damage': {
      if (effect.targetType === 'opponent') {
        const opponent = player === 0 ? 1 : 0;
        const newLp = [...state.lp] as [number, number];
        newLp[opponent] = Math.max(0, newLp[opponent] - (effect.value || 0));
        newState = { ...newState, lp: newLp };
      } else if (effect.targetType === 'all') {
        const newLp = [...state.lp] as [number, number];
        newLp[0] = Math.max(0, newLp[0] - (effect.value || 0));
        newLp[1] = Math.max(0, newLp[1] - (effect.value || 0));
        newState = { ...newState, lp: newLp };
      }
      break;
    }
    
    case 'heal': {
      if (effect.targetType === 'self') {
        const newLp = [...state.lp] as [number, number];
        newLp[player] = newLp[player] + (effect.value || 0);
        newState = { ...newState, lp: newLp };
      }
      break;
    }
    
    case 'destroy_all': {
      if (effect.targetType === 'opponent') {
        const opponent = player === 0 ? 1 : 0;
        const newFields = state.fields.map(f => [...f]) as [(Card | null)[], (Card | null)[]];
        const newGraves = state.graves.map(g => [...g]) as [Card[], Card[]];
        
        // Move all opponent monsters to graveyard
        newFields[opponent].forEach((card, idx) => {
          if (card) {
            newGraves[opponent].push(card);
            newFields[opponent][idx] = null;
          }
        });
        
        newState = { ...newState, fields: newFields, graves: newGraves };
      } else if (effect.targetType === 'all') {
        const newFields: [(Card | null)[], (Card | null)[]] = [
          [null, null, null, null, null],
          [null, null, null, null, null]
        ];
        const newGraves = state.graves.map(g => [...g]) as [Card[], Card[]];
        
        // Move all monsters to graveyards
        state.fields.forEach((field, playerIdx) => {
          field.forEach(card => {
            if (card) newGraves[playerIdx].push(card);
          });
        });
        
        newState = { ...newState, fields: newFields, graves: newGraves };
      }
      break;
    }
    
    case 'equip_atk':
    case 'equip_def':
    case 'equip_both': {
      // Equip spells are handled by tracking active effects
      // The actual ATK/DEF modification is applied when calculating damage
      // For now, we'll store the effect in a new activeEffects array
      // This is a simplified implementation - full implementation would need more state tracking
      break;
    }
    
    default:
      // Other effects can be implemented as needed
      break;
  }
  
  return newState;
}

// Calculate modified ATK for a monster considering active effects
export function calculateATK(
  baseATK: number,
  _card: Card,
  equippedEffects: ActiveEffect[]
): number {
  let modifiedATK = baseATK;
  
  equippedEffects.forEach(activeEffect => {
    const effect = activeEffect.effect;
    
    if (effect.type === 'equip_atk' || effect.type === 'equip_both') {
      modifiedATK += effect.value || 0;
    }
  });
  
  return modifiedATK;
}

// Calculate modified DEF for a monster considering active effects
export function calculateDEF(
  baseDEF: number,
  _card: Card,
  equippedEffects: ActiveEffect[]
): number {
  let modifiedDEF = baseDEF;
  
  equippedEffects.forEach(activeEffect => {
    const effect = activeEffect.effect;
    
    if (effect.type === 'equip_def' || effect.type === 'equip_both') {
      modifiedDEF += effect.value || 0;
    }
  });
  
  return modifiedDEF;
}

// Check if a card can be activated
export function canActivate(
  card: Card,
  state: DuelState,
  player: 0 | 1
): boolean {
  const effect = getCardEffect(card.id);
  if (!effect) return false;
  
  // Trap cards need to be set first (not implemented yet)
  if (card.type === 'Trap') {
    return false; // Simplified - traps need set/activation system
  }
  
  // Equip spells need a target monster
  if (effect.type.startsWith('equip_')) {
    return state.fields[player].some(m => m !== null);
  }
  
  // All other spells can be activated from hand
  return true;
}

// Remove an effect from active effects
export function removeEffect(
  activeEffects: ActiveEffect[],
  effectId: string
): ActiveEffect[] {
  return activeEffects.filter(e => e.effectId !== effectId);
}

// Update effect durations at end of turn
export function tickEffects(activeEffects: ActiveEffect[]): ActiveEffect[] {
  return activeEffects
    .map(effect => {
      if (effect.turnsRemaining !== undefined && effect.turnsRemaining > 0) {
        return { ...effect, turnsRemaining: effect.turnsRemaining - 1 };
      }
      return effect;
    })
    .filter(effect => {
      // Remove effects that have expired
      if (effect.turnsRemaining !== undefined) {
        return effect.turnsRemaining > 0;
      }
      return true;
    });
}
