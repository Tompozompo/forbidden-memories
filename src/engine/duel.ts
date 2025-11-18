import { checkFusion } from './fusions';
import type { Card } from '../types';
import { applyEffect, type ActiveEffect } from './effects';
import { getCardEffect } from '../data/cardEffects';

// Fisher-Yates shuffle
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export interface DuelState {
  turn: 0 | 1;
  turnCount: number; // Total number of turns that have passed
  lp: [number, number];
  hands: Card[][];
  decks: Card[][];
  fields: (Card | null)[][]; // Monster zones (5 per player)
  spellTraps: (Card | null)[][]; // Spell/Trap zones (5 per player)
  graves: Card[][];
  phase: 'Draw' | 'Standby' | 'Main' | 'Battle' | 'End';
  hasSummoned: [boolean, boolean];
  hasAttacked: [boolean, boolean];
  activeEffects: ActiveEffect[]; // Active spell/trap effects
  equippedCards: Map<string, number>; // Map of "player-zone" to equipped spell card ID
}

export const initialDuel = (p0Cards: Card[], p1Cards: Card[]): DuelState => {
  // Pick 20 random cards for each player from the full pool and shuffle
  const p0Deck = shuffle(p0Cards.slice(0, 20));
  const p1Deck = shuffle(p1Cards.slice(0, 20));
  
  return {
    turn: 0,
    turnCount: 1, // Start at turn 1
    lp: [8000, 8000],
    hands: [[], []],
    decks: [p0Deck, p1Deck],
    fields: [[null, null, null, null, null], [null, null, null, null, null]],
    spellTraps: [[null, null, null, null, null], [null, null, null, null, null]],
    graves: [[], []],
    phase: 'Draw',
    hasSummoned: [false, false],
    hasAttacked: [false, false],
    activeEffects: [],
    equippedCards: new Map(),
  };
};

// quick reducer shape
type Action =
  | { type: 'DRAW'; player?: 0 | 1 }
  | { type: 'DRAW_MULTIPLE'; player: 0 | 1; count: number }
  | { type: 'PLAY'; cardId: number; pos: 'atk' | 'def' }
  | { type: 'FUSE'; matA: number; matB: number; allCards: Card[] }
  | { type: 'SUMMON'; cardId: number; position: 'atk' | 'def' }
  | { type: 'ATTACK'; attackerId: number; targetPos: number }
  | { type: 'ACTIVATE_SPELL'; cardId: number; targetZone?: number }
  | { type: 'SET_SPELL_TRAP'; cardId: number }
  | { type: 'END_TURN' };

export function duelReducer(state: DuelState, action: Action): DuelState {
  switch (action.type) {
    case 'DRAW': {
      const player = action.player ?? state.turn;
      const deck = state.decks[player];
      if (!deck || deck.length === 0) return state; // nothing to draw
      const [card, ...rest] = deck;
      const newDecks = state.decks.map((d, i) => (i === player ? rest : d)) as [Card[], Card[]];
      const newHands = state.hands.map((h, i) => (i === player ? [...h, card] : h)) as [Card[], Card[]];
      return { ...state, decks: newDecks, hands: newHands };
    }
    case 'DRAW_MULTIPLE': {
      const player = action.player;
      const deck = state.decks[player];
      if (!deck || deck.length === 0) return state; // nothing to draw
      
      // Draw up to 'count' cards, or as many as available in the deck
      const drawCount = Math.min(action.count, deck.length);
      const drawnCards = deck.slice(0, drawCount);
      const remainingDeck = deck.slice(drawCount);
      
      const newDecks = state.decks.map((d, i) => (i === player ? remainingDeck : d)) as [Card[], Card[]];
      const newHands = state.hands.map((h, i) => (i === player ? [...h, ...drawnCards] : h)) as [Card[], Card[]];
      return { ...state, decks: newDecks, hands: newHands };
    }
    case 'FUSE': {
      const resId = checkFusion(action.matA, action.matB);
      if (!resId) return state;

      // find the result card in all available cards
      const resCard = action.allCards.find(c => c.id === resId);
      if (!resCard) return state;

      // remove materials, add result to current player's hand
      const newHands = state.hands.map((h, i) =>
        i === state.turn
          ? [...h.filter(c => c.id !== action.matA && c.id !== action.matB), resCard]
          : h
      ) as [Card[], Card[]];

      return { ...state, hands: newHands };
    }
    case 'SUMMON': {
      const player = state.turn;
      
      // Check if player has already summoned this turn
      if (state.hasSummoned[player]) {
        return state; // Reject summon if already summoned
      }
      
      const card = state.hands[player].find(c => c.id === action.cardId);
      if (!card) return state;

      // find first empty slot
      const emptySlotIndex = state.fields[player].findIndex(slot => slot === null);
      if (emptySlotIndex === -1) return state; // no empty slots

      // remove card from hand
      const newHands = state.hands.map((h, i) =>
        i === player ? h.filter(c => c.id !== action.cardId) : h
      ) as [Card[], Card[]];

      // place card on field
      const newFields = state.fields.map((f, i) =>
        i === player
          ? f.map((slot, idx) => (idx === emptySlotIndex ? card : slot))
          : f
      ) as [(Card | null)[], (Card | null)[]];

      // Set hasSummoned to true for the current player
      const newHasSummoned = state.hasSummoned.map((s, i) => 
        i === player ? true : s
      ) as [boolean, boolean];

      // switch to Battle phase after summoning
      return { ...state, hands: newHands, fields: newFields, phase: 'Battle', hasSummoned: newHasSummoned };
    }
    case 'ATTACK': {
      const player = state.turn;
      const opponent = player === 0 ? 1 : 0;
      
      // Prevent attacking on the first turn
      if (state.turnCount === 1) {
        return state; // Reject attack on first turn
      }
      
      // Check if player has already attacked this turn
      if (state.hasAttacked[player]) {
        return state; // Reject attack if already attacked
      }
      
      // find attacker on current player's field
      const attackerIdx = state.fields[player].findIndex(c => c?.id === action.attackerId);
      const attacker = state.fields[player][attackerIdx];
      if (!attacker || attacker.atk === undefined) return state;
      
      // check if target position has a monster
      const defender = state.fields[opponent][action.targetPos];
      
      // Calculate ATK with equipped spells
      let attackerAtk = attacker.atk;
      const attackerEquipKey = `${player}-${attackerIdx}`;
      const attackerEquipId = state.equippedCards.get(attackerEquipKey);
      if (attackerEquipId) {
        const equipEffect = getCardEffect(attackerEquipId);
        if (equipEffect && (equipEffect.type === 'equip_atk' || equipEffect.type === 'equip_both')) {
          attackerAtk += equipEffect.value || 0;
        }
      }
      
      let newLp = [...state.lp] as [number, number];
      let newFields = state.fields.map(f => [...f]) as [(Card | null)[], (Card | null)[]];
      let newGraves = state.graves.map(g => [...g]) as [Card[], Card[]];
      let newEquippedCards = new Map(state.equippedCards);
      let newActiveEffects = [...state.activeEffects];
      let newSpellTraps = state.spellTraps.map(s => [...s]) as [(Card | null)[], (Card | null)[]];
      
      if (defender && defender.atk !== undefined) {
        // Monster vs Monster battle (PS1 style - both take damage)
        let defenderAtk = defender.atk;
        
        // Calculate defender ATK with equipped spells
        const defenderEquipKey = `${opponent}-${action.targetPos}`;
        const defenderEquipId = state.equippedCards.get(defenderEquipKey);
        if (defenderEquipId) {
          const equipEffect = getCardEffect(defenderEquipId);
          if (equipEffect && (equipEffect.type === 'equip_atk' || equipEffect.type === 'equip_both')) {
            defenderAtk += equipEffect.value || 0;
          }
        }
        
        // Apply battle damage to both players
        newLp[player] -= defenderAtk;
        newLp[opponent] -= attackerAtk;
        
        // Destroy monsters if ATK is higher than opponent's
        if (attackerAtk < defenderAtk) {
          // Attacker destroyed
          newGraves[player].push(attacker);
          newFields[player][attackerIdx] = null;
          
          // Remove equipped card
          if (attackerEquipId) {
            newEquippedCards.delete(attackerEquipKey);
            newActiveEffects = newActiveEffects.filter(e => 
              !(e.targetPlayer === player && e.targetZone === attackerIdx)
            );
            // Send equip spell to graveyard
            const equipIdx = newSpellTraps[player].findIndex(c => c?.id === attackerEquipId);
            if (equipIdx !== -1) {
              const equipCard = newSpellTraps[player][equipIdx];
              if (equipCard) newGraves[player].push(equipCard);
              newSpellTraps[player][equipIdx] = null;
            }
          }
        }
        if (defenderAtk < attackerAtk) {
          // Defender destroyed
          newGraves[opponent].push(defender);
          newFields[opponent][action.targetPos] = null;
          
          // Remove equipped card
          if (defenderEquipId) {
            newEquippedCards.delete(defenderEquipKey);
            newActiveEffects = newActiveEffects.filter(e => 
              !(e.targetPlayer === opponent && e.targetZone === action.targetPos)
            );
            // Send equip spell to graveyard
            const equipIdx = newSpellTraps[opponent].findIndex(c => c?.id === defenderEquipId);
            if (equipIdx !== -1) {
              const equipCard = newSpellTraps[opponent][equipIdx];
              if (equipCard) newGraves[opponent].push(equipCard);
              newSpellTraps[opponent][equipIdx] = null;
            }
          }
        }
        if (attackerAtk === defenderAtk) {
          // Both destroyed
          newGraves[player].push(attacker);
          newFields[player][attackerIdx] = null;
          newGraves[opponent].push(defender);
          newFields[opponent][action.targetPos] = null;
          
          // Remove both equipped cards
          if (attackerEquipId) {
            newEquippedCards.delete(attackerEquipKey);
            newActiveEffects = newActiveEffects.filter(e => 
              !(e.targetPlayer === player && e.targetZone === attackerIdx)
            );
            const equipIdx = newSpellTraps[player].findIndex(c => c?.id === attackerEquipId);
            if (equipIdx !== -1) {
              const equipCard = newSpellTraps[player][equipIdx];
              if (equipCard) newGraves[player].push(equipCard);
              newSpellTraps[player][equipIdx] = null;
            }
          }
          if (defenderEquipId) {
            newEquippedCards.delete(defenderEquipKey);
            newActiveEffects = newActiveEffects.filter(e => 
              !(e.targetPlayer === opponent && e.targetZone === action.targetPos)
            );
            const equipIdx = newSpellTraps[opponent].findIndex(c => c?.id === defenderEquipId);
            if (equipIdx !== -1) {
              const equipCard = newSpellTraps[opponent][equipIdx];
              if (equipCard) newGraves[opponent].push(equipCard);
              newSpellTraps[opponent][equipIdx] = null;
            }
          }
        }
      } else {
        // Direct attack - reduce opponent LP by attacker's ATK (with equipment bonuses)
        newLp[opponent] -= attackerAtk;
      }
      
      // Set hasAttacked to true for the current player
      const newHasAttacked = state.hasAttacked.map((s, i) => 
        i === player ? true : s
      ) as [boolean, boolean];
      
      return { 
        ...state, 
        lp: newLp, 
        fields: newFields, 
        graves: newGraves,
        hasAttacked: newHasAttacked,
        equippedCards: newEquippedCards,
        activeEffects: newActiveEffects,
        spellTraps: newSpellTraps
      };
    }
    case 'ACTIVATE_SPELL': {
      const player = state.turn;
      const card = state.hands[player].find(c => c.id === action.cardId);
      
      if (!card || (card.type !== 'Spell' && card.type !== 'Trap')) {
        return state; // Invalid card
      }
      
      const effect = getCardEffect(card.id);
      if (!effect) {
        return state; // No effect defined
      }
      
      // Remove card from hand
      const newHands = state.hands.map((h, i) =>
        i === player ? h.filter(c => c.id !== action.cardId) : h
      ) as [Card[], Card[]];
      
      // Apply the effect
      let newState = applyEffect(state, card.id, player, undefined, action.targetZone);
      newState = { ...newState, hands: newHands };
      
      // For equip spells, keep the card in spell/trap zone
      if (effect.type.startsWith('equip_') && action.targetZone !== undefined) {
        const newSpellTraps = state.spellTraps.map(s => [...s]) as [(Card | null)[], (Card | null)[]];
        const emptySlot = newSpellTraps[player].findIndex(slot => slot === null);
        
        if (emptySlot !== -1) {
          newSpellTraps[player][emptySlot] = card;
          newState = { ...newState, spellTraps: newSpellTraps };
          
          // Track which monster this equip is attached to
          const newEquippedCards = new Map(state.equippedCards);
          newEquippedCards.set(`${player}-${action.targetZone}`, card.id);
          newState = { ...newState, equippedCards: newEquippedCards };
          
          // Add to active effects
          const newActiveEffects = [...state.activeEffects, {
            effectId: `${card.id}-${Date.now()}`,
            cardId: card.id,
            effect,
            player,
            targetPlayer: player,
            targetZone: action.targetZone,
          }];
          newState = { ...newState, activeEffects: newActiveEffects };
        }
      } else {
        // For non-equip spells, send to graveyard after activation
        const newGraves = state.graves.map((g, i) =>
          i === player ? [...g, card] : g
        ) as [Card[], Card[]];
        newState = { ...newState, graves: newGraves };
      }
      
      return newState;
    }
    case 'SET_SPELL_TRAP': {
      const player = state.turn;
      const card = state.hands[player].find(c => c.id === action.cardId);
      
      if (!card || (card.type !== 'Spell' && card.type !== 'Trap')) {
        return state; // Invalid card
      }
      
      // Find first empty slot in spell/trap zone
      const emptySlot = state.spellTraps[player].findIndex(slot => slot === null);
      if (emptySlot === -1) {
        return state; // No empty slots
      }
      
      // Remove card from hand
      const newHands = state.hands.map((h, i) =>
        i === player ? h.filter(c => c.id !== action.cardId) : h
      ) as [Card[], Card[]];
      
      // Place card in spell/trap zone
      const newSpellTraps = state.spellTraps.map(s => [...s]) as [(Card | null)[], (Card | null)[]];
      newSpellTraps[player][emptySlot] = card;
      
      // For field spells, activate immediately
      const effect = getCardEffect(card.id);
      let newState = { ...state, hands: newHands, spellTraps: newSpellTraps };
      
      if (effect && effect.type === 'field') {
        // Field spells are continuous and take effect immediately
        const newActiveEffects = [...state.activeEffects, {
          effectId: `${card.id}-${Date.now()}`,
          cardId: card.id,
          effect,
          player,
        }];
        newState = { ...newState, activeEffects: newActiveEffects };
      }
      
      return newState;
    }
    case 'END_TURN': {
      // Flip turn to the other player
      const newTurn = state.turn === 0 ? 1 : 0;
      
      // Increment turn count
      const newTurnCount = state.turnCount + 1;
      
      // Reset hasSummoned and hasAttacked for both players at turn end
      const newHasSummoned: [boolean, boolean] = [false, false];
      const newHasAttacked: [boolean, boolean] = [false, false];
      
      // Draw back to 5 cards for the new player
      const deck = state.decks[newTurn];
      const hand = state.hands[newTurn];
      const currentHandSize = hand.length;
      const targetHandSize = 5;
      
      // Calculate how many cards to draw (draw up to 5, but not more)
      const cardsToDraw = Math.max(0, targetHandSize - currentHandSize);
      const actualDrawCount = Math.min(cardsToDraw, deck.length);
      
      if (actualDrawCount === 0) {
        // No cards to draw, just flip turn
        return { ...state, turn: newTurn, turnCount: newTurnCount, phase: 'Draw', hasSummoned: newHasSummoned, hasAttacked: newHasAttacked };
      }
      
      // Draw the cards
      const drawnCards = deck.slice(0, actualDrawCount);
      const remainingDeck = deck.slice(actualDrawCount);
      const newDecks = state.decks.map((d, i) => (i === newTurn ? remainingDeck : d)) as [Card[], Card[]];
      const newHands = state.hands.map((h, i) => (i === newTurn ? [...h, ...drawnCards] : h)) as [Card[], Card[]];
      
      return { 
        ...state, 
        decks: newDecks, 
        hands: newHands, 
        turn: newTurn,
        turnCount: newTurnCount,
        phase: 'Draw',
        hasSummoned: newHasSummoned,
        hasAttacked: newHasAttacked
      };
    }
    default:
      return state;
  }
}