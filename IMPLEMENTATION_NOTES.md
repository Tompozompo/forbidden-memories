# Guardian Star System - Implementation Notes

## Current Card Attribute Distribution

Analysis of the current 722-card database:

| Attribute | Count | Percentage |
|-----------|-------|------------|
| EARTH     | 215   | 34.8%      |
| DARK      | 148   | 24.0%      |
| WATER     | 108   | 17.5%      |
| LIGHT     | 56    | 9.1%       |
| WIND      | 38    | 6.1%       |
| FIRE      | 35    | 5.7%       |
| None      | 21    | 3.4%       |
| **Total Monsters** | **621** | **100%** |

**Note:** 21 cards have no attribute (likely Spell/Trap or data issues to fix)

---

## Type Mapping Strategy

### Direct Attribute Mapping (Recommended for MVP)

```typescript
function getCardElementType(card: Card): ElementType | null {
  switch (card.attr) {
    case 'FIRE': return 'Fire';
    case 'WATER': return 'Water';
    case 'EARTH': return 'Earth';
    case 'WIND': return 'Wind';
    case 'LIGHT': return 'Light';
    case 'DARK': return 'Dark';
    default: return null; // No type for Spells/Traps
  }
}
```

### Type Effectiveness Lookup Table

```typescript
type ElementType = 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Light' | 'Dark';

// Returns multiplier: 1.5 for advantage, 0.7 for disadvantage, 1.0 for neutral
function getTypeEffectiveness(attackerType: ElementType, defenderType: ElementType): number {
  const advantages: Record<ElementType, ElementType[]> = {
    Fire: ['Wind', 'Earth'],      // Fire melts earth, consumes wind/oxygen
    Water: ['Fire'],                // Water extinguishes fire
    Earth: ['Thunder', 'Wind'],    // Earth grounds electricity, blocks wind
    Wind: ['Earth', 'Water'],      // Wind erodes earth, creates waves
    Light: ['Dark'],                // Light banishes darkness
    Dark: ['Light'],                // Darkness swallows light
  };
  
  const disadvantages: Record<ElementType, ElementType[]> = {
    Fire: ['Water', 'Earth'],
    Water: ['Wind'],
    Earth: ['Water'],
    Wind: ['Fire', 'Earth'],
    Light: ['Dark'],
    Dark: ['Light'],
  };
  
  if (advantages[attackerType]?.includes(defenderType)) {
    return 1.5; // +50% damage bonus
  } else if (disadvantages[attackerType]?.includes(defenderType)) {
    return 0.7; // -30% damage reduction
  }
  
  return 1.0; // Neutral
}
```

---

## Battle Calculation Integration

### Current Damage Calculation (Simplified)

```typescript
// In engine/duel.ts - ATTACK action
const attackerCard = state.fields[state.turn][attackerZone];
const defenderCard = state.fields[opponent][targetPos];

const damage = attackerCard.atk - defenderCard.def;
// Apply damage to LP if positive
```

### With Type Effectiveness

```typescript
// Enhanced version
const attackerCard = state.fields[state.turn][attackerZone];
const defenderCard = state.fields[opponent][targetPos];

const attackerType = getCardElementType(attackerCard);
const defenderType = getCardElementType(defenderCard);

let effectiveAtk = attackerCard.atk;
let effectiveDef = defenderCard.def;

if (attackerType && defenderType) {
  const effectiveness = getTypeEffectiveness(attackerType, defenderType);
  
  // Apply bonus to ATK
  effectiveAtk = Math.floor(attackerCard.atk * effectiveness);
  
  // OR apply as flat bonus (original FM style)
  // const bonus = effectiveness > 1 ? 400 : effectiveness < 1 ? -200 : 0;
  // effectiveAtk = attackerCard.atk + bonus;
}

const damage = effectiveAtk - effectiveDef;
```

---

## Data Structure Changes

### Type 1: Add to Card Interface (Minimal)

```typescript
// src/types.ts
export interface Card {
  id: number;
  name: string;
  atk?: number;
  def?: number;
  type: "Monster" | "Spell" | "Trap";
  attr?: "EARTH" | "WATER" | "FIRE" | "WIND" | "LIGHT" | "DARK";
  race?: string;
  level?: number;
  text?: string;
  // No new field needed - use attr directly!
}
```

**Pros:** Zero data migration needed
**Cons:** Cannot add secondary types later

### Type 2: Add Optional Element Field

```typescript
// src/types.ts
export type ElementType = "Fire" | "Water" | "Earth" | "Wind" | "Light" | "Dark";

export interface Card {
  id: number;
  name: string;
  atk?: number;
  def?: number;
  type: "Monster" | "Spell" | "Trap";
  attr?: "EARTH" | "WATER" | "FIRE" | "WIND" | "LIGHT" | "DARK";
  race?: string;
  level?: number;
  text?: string;
  elementType?: ElementType; // Auto-calculated from attr if not set
}
```

**Pros:** Allows manual override for special cards
**Cons:** Requires updating card data (or auto-calculate on load)

### Type 3: Dual-Type System

```typescript
export interface Card {
  // ... existing fields
  elementTypes?: [ElementType] | [ElementType, ElementType]; // 1 or 2 types
}
```

**Pros:** Maximum flexibility
**Cons:** Complex balance, requires assigning 1400+ type pairs

---

## UI Mockup Considerations

### Card Display

```
┌─────────────────────┐
│ Blue-Eyes White     │ 🔥 Fire
│ Dragon              │ 💧 Water
│                     │
│    [Dragon Art]     │
│                     │
│ ATK: 3000          │
│ DEF: 2500          │
│ ✨ LIGHT            │ ← Existing attribute
└─────────────────────┘
```

### Battle Screen Type Indicator

```
Your Monster          Enemy Monster
Blue-Eyes White    vs Dark Magician
✨ Light               🌑 Dark

Type Advantage: +400 ATK!
3000 → 3400 ATK
```

### Deck Builder Filter

```
[All Types ▼]
  - Fire 🔥 (35 cards)
  - Water 💧 (108 cards)
  - Earth 🌍 (215 cards)
  - Wind 🌪️ (38 cards)
  - Light ✨ (56 cards)
  - Dark 🌑 (148 cards)
```

---

## Testing Checklist

- [ ] Type effectiveness calculation works correctly
- [ ] Battle damage applies type bonuses
- [ ] All monsters have valid element types
- [ ] Spells/Traps handle null types gracefully
- [ ] UI displays type indicators
- [ ] Deck builder filters by type
- [ ] Type matchup guide accessible in-game
- [ ] Type bonuses don't break balance (playtest)

---

## Migration Path (If We Add elementType Field)

```typescript
// scripts/addElementTypes.ts
import cards from '../src/data/cards.json';
import fs from 'fs';

const typeMap = {
  'FIRE': 'Fire',
  'WATER': 'Water',
  'EARTH': 'Earth',
  'WIND': 'Wind',
  'LIGHT': 'Light',
  'DARK': 'Dark',
};

const updatedCards = cards.map(card => {
  if (card.type !== 'Monster' || !card.attr) {
    return card; // Skip spells/traps
  }
  
  return {
    ...card,
    elementType: typeMap[card.attr],
  };
});

fs.writeFileSync(
  './src/data/cards.json',
  JSON.stringify(updatedCards, null, 2)
);
```

---

## Balance Considerations

### Option A: Percentage Bonus (Pokémon Style)
- Advantage: 1.5x damage (50% boost)
- Disadvantage: 0.67x damage (33% reduction)
- **Feel:** More dramatic swings, type matters a LOT

### Option B: Flat Bonus (Original FM Style)
- Advantage: +400 ATK/DEF
- Disadvantage: -200 ATK/DEF
- **Feel:** Noticeable but not overwhelming, low-level cards still viable

### Option C: Scaled Bonus (Hybrid)
- Advantage: +20% ATK (min 200, max 600)
- Disadvantage: -10% ATK (min 100, max 300)
- **Feel:** Scales with card power, balanced across all levels

**Recommendation:** Start with Option B (flat bonus) for simplicity and authenticity to original game. Adjust based on playtesting.

---

## Performance Notes

- Type effectiveness lookup is O(1) with hash map
- No performance impact on card rendering
- Battle calculation adds ~3-5 operations per attack (negligible)
- Card data size increase: 0 bytes (if using attr) or ~10KB (if adding elementType field)

---

## Accessibility Considerations

- Use color + icon + text for type indicators (not just color)
- Provide colorblind-friendly palette
- Include text descriptions of type matchups
- Allow disabling type bonuses in settings (for classic mode)

---

## Future Enhancements

### Phase 2: Special Type Interactions
- Burn damage for Fire types
- Healing for Water types
- Defensive bonuses for Earth types

### Phase 3: Type-Specific Cards
- "Fire Support" spells that boost all Fire monsters
- "Anti-Dark" traps that destroy Dark monsters
- Type-locked fusion materials

### Phase 4: Type Evolution
- Cards that change type when fused
- Field spells that convert all monsters to specific type
- Duelists with type specializations

---

## Open Questions

1. Should type bonuses stack with equip spell bonuses?
2. Do type bonuses apply to DEF when defending?
3. Should direct attacks get type bonuses?
4. Do type bonuses apply before or after other modifiers?
5. Should we show opponent's types during deck preview?

---

## Conclusion

The implementation can be as simple or complex as desired:

**Minimal:** Use existing `attr` field + simple lookup table (1 day of work)
**Standard:** Add `elementType` field + migration script + UI indicators (3 days)
**Full:** Dual-type system + special interactions + animations (1-2 weeks)

Recommend starting with **Standard** approach for best balance of depth and simplicity.
