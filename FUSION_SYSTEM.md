# Fusion System Documentation

## Overview

The fusion system in Forbidden Memories implements both **specific fusions** (from the original game's fusion table) and **general fusions** (intelligent fallback system) to ensure any two monster cards can be fused.

## How It Works

### 1. Specific Fusions (Priority)

The system first checks the `fusions.json` table for exact card pair matches. These are curated, specific fusion combinations from the original game.

- **Coverage**: 974 specific fusion combinations
- **Cards Covered**: 100 unique cards appear in the fusion table
- **Example**: Blue-Eyes White Dragon (1) + Ryu-kishin (5) = Tyhone (13)

### 2. General Fusions (Fallback)

If no specific fusion exists, the system uses intelligent rules to find the best fusion result:

#### Calculation Process:

1. **Average Stats**: Calculate target ATK, DEF, and Level
   - `targetAtk = floor((cardA.atk + cardB.atk) / 2)`
   - `targetDef = floor((cardA.def + cardB.def) / 2)`
   - `targetLevel = round((cardA.level + cardB.level) / 2)`

2. **Preferred Race**: Determine which race to favor
   - Same race → keep it
   - Compatible races → use compatibility table
   - Otherwise → use race from higher-level card

3. **Preferred Attribute**: Determine which attribute to favor
   - Same attribute → keep it
   - Different attributes → use strength ranking (LIGHT/DARK > FIRE/WATER > EARTH/WIND)
   - Tie → use attribute from higher-level card

4. **Scoring System**: Find best match from card pool
   - Stat similarity: Lower difference = higher score
   - Level similarity: Closer level = higher score
   - Race match: +20 bonus
   - Attribute match: +15 bonus
   - ATK upgrade bonus: +5 if result ATK ≥ target

5. **Fallback**: If no good match found, return weak monster

### Race Compatibility Table

```typescript
{
  'Dragon': ['Dragon', 'Dinosaur', 'Reptile'],
  'Spellcaster': ['Spellcaster', 'Fairy'],
  'Warrior': ['Warrior', 'Beast-Warrior'],
  'Fiend': ['Fiend', 'Zombie'],
  'Beast': ['Beast', 'Beast-Warrior'],
  'Aqua': ['Aqua', 'Fish', 'Sea Serpent'],
  'Pyro': ['Pyro', 'Dinosaur'],
  'Thunder': ['Thunder', 'Machine'],
  'Machine': ['Machine', 'Thunder'],
  'Plant': ['Plant', 'Insect']
}
```

### Attribute Strength Ranking

```typescript
{
  'LIGHT': 5,
  'DARK': 5,
  'FIRE': 4,
  'WATER': 4,
  'EARTH': 3,
  'WIND': 3
}
```

## Example Fusions

### Specific Fusion
```
Blue-Eyes White Dragon (ID: 1, ATK: 3000, LIGHT Dragon)
+ Ryu-kishin (ID: 5, ATK: 1000, DARK Fiend)
= Tyhone (ID: 13, ATK: 1200, WIND Winged Beast)
```

### General Fusion
```
Tyhone (ID: 13, ATK: 1200, DEF: 1400, Lv4, WIND Winged Beast)
+ Battle Steer (ID: 14, ATK: 1800, DEF: 1300, Lv5, EARTH Beast-Warrior)

Target Stats:
- ATK: 1500 (avg)
- DEF: 1350 (avg)
- Level: 5 (rounded)
- Preferred Race: Beast-Warrior (higher level)
- Preferred Attr: EARTH (higher level)

→ System finds best matching card with similar stats, Beast-Warrior race, EARTH attribute
```

## Key Features

✅ **Always Produces Result**: No fusion fails - all monster pairs produce a result
✅ **Intelligent Matching**: Uses race, attribute, and stat compatibility
✅ **Backward Compatible**: All 974 specific fusions preserved
✅ **Expandable**: Easy to add new specific fusions to `fusions.json`
✅ **Type Safe**: Only Monster cards can be fused (Spells/Traps rejected)

## Implementation Details

**Location**: `src/engine/fusions.ts`

**Main Function**:
```typescript
export function checkFusion(a: number, b: number): number | null
```

**Returns**: 
- Card ID of fusion result (number)
- null if cards cannot be fused (e.g., trying to fuse Spell cards)

**Internal Functions**:
- `checkSpecificFusion()`: Looks up fusion table
- `checkGeneralFusion()`: Calculates general fusion
- `determinePreferredRace()`: Race preference logic
- `determinePreferredAttribute()`: Attribute preference logic
- `findBestGeneralFusion()`: Scoring and matching algorithm
- `findWeakFallbackMonster()`: Last-resort fallback

## Testing

Run the test suite to verify fusion behavior:
```bash
node /tmp/test_new_fusion.js
```

Expected results:
- ✅ Specific fusions work correctly
- ✅ General fusions produce intelligent results
- ✅ Same race fusions maintain race
- ✅ Same attribute fusions maintain attribute
- ✅ Spell/Trap cards rejected
- ✅ All monster pairs produce results

## Future Enhancements

Potential improvements for the fusion system:

1. **Guardian Star Integration**: Consider Guardian Stars in fusion calculations
2. **Ritual Fusions**: Special fusion mechanics for ritual monsters
3. **Fusion Chains**: Support for fusing the result with additional cards
4. **Weighted Scoring**: Fine-tune scoring algorithm based on playtesting
5. **Fusion Hints**: Show players potential fusion results before confirming
6. **Fusion History**: Track and display previously discovered fusions
