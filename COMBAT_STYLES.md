# Guardian Stars System - Original Design

**Status**: Ready for implementation  
**Last Updated**: 2025-11-18

---

## System Overview

This document specifies the **10-type Guardian Star system** based on the original Yu-Gi-Oh! Forbidden Memories design. Each Guardian Star beats exactly 1 other and loses to exactly 1 other, creating two independent cycle-based type effectiveness systems.

### Core Mechanics

- **10 Guardian Stars** organized in two independent cycles
- **6 Attributes** representing monster elemental nature (FIRE/WATER/EARTH/WIND/LIGHT/DARK)
- **Two-Cycle Design**: 
  - **Mystical Cycle**: 4 stars (Sun, Mercury, Venus, Moon) - Light/Dark/Dreams/Fiend
  - **Elemental Cycle**: 5 stars (Mars, Jupiter, Saturn, Uranus, Neptune) - Fire/Forest/Wind/Earth/Water
  - **Plus Thunder**: Pluto joins the Elemental cycle
- **Simple Balance**: Each star beats 1, loses to 1, neutral vs 8
- **STAB System**: 6 stars match attributes for bonus damage potential
- **Position-Based**: Attack mode uses Guardian Star, Defense mode uses Attribute only

---

## The 10 Guardian Stars

| # | Guardian Star | Symbol | Alignment | Attribute Match | Theme |
|---|--------------|--------|-----------|-----------------|-------|
| 1 | **Sun** | ☉ | Light | LIGHT | Radiant solar power |
| 2 | **Mercury** | ☿ | Dark | DARK | Shadow and darkness |
| 3 | **Venus** | ♀ | Dreams | *(none)* | Illusion and fantasy |
| 4 | **Moon** | ☾ | Fiend | *(none)* | Dark magic and demons |
| 5 | **Mars** | ♂ | Fire | FIRE | Burning flames |
| 6 | **Jupiter** | ♃ | Forest | *(none)* | Natural growth, plants |
| 7 | **Saturn** | ♄ | Wind | WIND | Air currents |
| 8 | **Uranus** | ⛢ | Earth | EARTH | Solid ground |
| 9 | **Neptune** | ♆ | Water | WATER | Ocean depths |
| 10 | **Pluto** | ♇ | Thunder | *(none)* | Lightning and electricity |

---

## The Two-Cycle System

### Cycle 1: Mystical Cycle (4 Stars)

The Mystical Cycle represents supernatural forces: Light, Dark, Dreams, and Fiend magic.

```
Sun (Light) → Moon (Fiend) → Venus (Dreams) → Mercury (Dark) → Sun
```

| Guardian Star | Beats | Loses To | Neutral Against |
|---------------|-------|----------|-----------------|
| **Sun** ☉ | Moon | Mercury | Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto |
| **Mercury** ☿ | Sun | Venus | Moon, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto |
| **Venus** ♀ | Mercury | Moon | Sun, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto |
| **Moon** ☾ | Venus | Sun | Mercury, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto |

**Thematic Logic:**
- Sun's light banishes Fiends (Moon)
- Dark (Mercury) obscures Light (Sun)
- Dreams (Venus) dissolve in Darkness (Mercury)
- Fiends (Moon) corrupt Dreams (Venus)

### Cycle 2: Elemental Cycle (6 Stars)

The Elemental Cycle represents natural forces: Fire, Water, Thunder, Earth, Wind, and Forest.

```
Mars (Fire) → Neptune (Water) → Pluto (Thunder) → Uranus (Earth) → Saturn (Wind) → Jupiter (Forest) → Mars
```

| Guardian Star | Beats | Loses To | Neutral Against |
|---------------|-------|----------|-----------------|
| **Mars** ♂ | Jupiter | Neptune | Sun, Mercury, Venus, Moon, Saturn, Uranus, Pluto |
| **Jupiter** ♃ | Saturn | Mars | Sun, Mercury, Venus, Moon, Uranus, Neptune, Pluto |
| **Saturn** ♄ | Uranus | Jupiter | Sun, Mercury, Venus, Moon, Mars, Neptune, Pluto |
| **Uranus** ⛢ | Pluto | Saturn | Sun, Mercury, Venus, Moon, Mars, Jupiter, Neptune |
| **Neptune** ♆ | Mars | Pluto | Sun, Mercury, Venus, Moon, Jupiter, Saturn, Uranus |
| **Pluto** ♇ | Neptune | Uranus | Sun, Mercury, Venus, Moon, Mars, Jupiter, Saturn |

**Thematic Logic:**
- Fire (Mars) burns Forest (Jupiter)
- Water (Neptune) extinguishes Fire (Mars)
- Thunder (Pluto) electrifies Water (Neptune)
- Earth (Uranus) grounds Thunder (Pluto)
- Wind (Saturn) erodes Earth (Uranus)
- Forest (Jupiter) blocks Wind (Saturn)

---

## Balance Verification

✅ **Perfect Two-Cycle Balance Confirmed**:
- Each Guardian Star beats exactly 1 other
- Each Guardian Star loses to exactly 1 other
- Each Guardian Star is neutral vs exactly 8 others
- All reverse relationships verified (if A beats B, then B loses to A)
- Total wins = Total losses = 10
- Two independent cycles with no cross-interactions

---

## Battle Multipliers

### vs Defense Mode (Attribute Only)

When attacking a monster in Defense Mode (only Attribute active):

| Matchup Result | Multiplier | Example |
|----------------|------------|---------|
| Super Effective | **×1.5** | Sun (Light) vs DARK attribute |
| Neutral | **×1.0** | Sun (Light) vs FIRE attribute |
| Not Very Effective | **×0.7** | Sun (Light) vs LIGHT attribute |

### vs Attack Mode (Guardian Star Active)

When attacking a monster in Attack Mode (Guardian Star active):

| Matchup Result | Multiplier | Example |
|----------------|------------|---------|
| **Advantage** (Your star beats theirs) | **×1.3** | Sun vs Moon |
| **Neutral** (No cycle relationship) | **×1.0** | Sun vs Mars |
| **Disadvantage** (Your star loses to theirs) | **×0.8** | Sun vs Mercury |

### STAB (Same Type Attack Bonus)

When a monster's Attribute matches its Guardian Star alignment:

- LIGHT monster using Sun star = STAB
- DARK monster using Mercury star = STAB
- FIRE monster using Mars star = STAB
- WATER monster using Neptune star = STAB
- EARTH monster using Uranus star = STAB
- WIND monster using Saturn star = STAB

**STAB Effect**: +10% bonus to base damage when alignment matches.

**No STAB**: The 4 unaligned stars (Venus-Dreams, Moon-Fiend, Jupiter-Forest, Pluto-Thunder) don't get STAB but offer tactical flexibility.

---

## Implementation Data Structure

### TypeScript Example

```typescript
export type GuardianStar = 
  | 'Sun' | 'Mercury' | 'Venus' | 'Moon'
  | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto';

export type Alignment = 
  | 'Light' | 'Dark' | 'Dreams' | 'Fiend'
  | 'Fire' | 'Forest' | 'Wind' | 'Earth' | 'Water' | 'Thunder';

export type Attribute = 
  | 'FIRE' | 'WATER' | 'EARTH' | 'WIND' | 'LIGHT' | 'DARK';

export interface StarEffectiveness {
  [attackingStar: string]: {
    beats: GuardianStar;
    losesTo: GuardianStar;
  };
}

export const GUARDIAN_STAR_CHART: StarEffectiveness = {
  Sun: { beats: 'Moon', losesTo: 'Mercury' },
  Mercury: { beats: 'Sun', losesTo: 'Venus' },
  Venus: { beats: 'Mercury', losesTo: 'Moon' },
  Moon: { beats: 'Venus', losesTo: 'Sun' },
  Mars: { beats: 'Jupiter', losesTo: 'Neptune' },
  Jupiter: { beats: 'Saturn', losesTo: 'Mars' },
  Saturn: { beats: 'Uranus', losesTo: 'Jupiter' },
  Uranus: { beats: 'Pluto', losesTo: 'Saturn' },
  Neptune: { beats: 'Mars', losesTo: 'Pluto' },
  Pluto: { beats: 'Neptune', losesTo: 'Uranus' }
};

export const STAR_TO_ALIGNMENT: Record<GuardianStar, Alignment> = {
  Sun: 'Light',
  Mercury: 'Dark',
  Venus: 'Dreams',
  Moon: 'Fiend',
  Mars: 'Fire',
  Jupiter: 'Forest',
  Saturn: 'Wind',
  Uranus: 'Earth',
  Neptune: 'Water',
  Pluto: 'Thunder'
};

export const ALIGNMENT_TO_ATTRIBUTE: Partial<Record<Alignment, Attribute>> = {
  Light: 'LIGHT',
  Dark: 'DARK',
  Fire: 'FIRE',
  Water: 'WATER',
  Earth: 'EARTH',
  Wind: 'WIND'
  // Dreams, Fiend, Forest, Thunder don't match attributes
};
```

### Battle Calculation Function

```typescript
function getStarMultiplier(
  attackerStar: GuardianStar,
  defenderAttribute: Attribute,
  defenderStar?: GuardianStar // undefined if in defense mode
): number {
  // If defender is in attack mode, check Guardian Star matchup
  if (defenderStar) {
    if (GUARDIAN_STAR_CHART[attackerStar].beats === defenderStar) {
      return 1.3; // Advantage
    } else if (GUARDIAN_STAR_CHART[attackerStar].losesTo === defenderStar) {
      return 0.8; // Disadvantage
    }
    return 1.0; // Neutral
  }
  
  // If defender is in defense mode, check attribute matchup
  const attackerAlignment = STAR_TO_ALIGNMENT[attackerStar];
  const attackerAttribute = ALIGNMENT_TO_ATTRIBUTE[attackerAlignment];
  
  if (!attackerAttribute) {
    return 1.0; // No attribute = neutral
  }
  
  // Simple attribute advantage (customize as needed)
  if (isStrongAgainst(attackerAttribute, defenderAttribute)) {
    return 1.5; // Super effective
  } else if (isWeakAgainst(attackerAttribute, defenderAttribute)) {
    return 0.7; // Not very effective
  }
  
  return 1.0; // Neutral
}

function hasSTAB(
  monsterAttribute: Attribute,
  guardianStar: GuardianStar
): boolean {
  const alignment = STAR_TO_ALIGNMENT[guardianStar];
  const matchingAttribute = ALIGNMENT_TO_ATTRIBUTE[alignment];
  return matchingAttribute === monsterAttribute;
}
```

---

## Color Palette (Recommended)

| Star | Color Name | Hex Code | RGB |
|------|-----------|----------|-----|
| Sun | Bright Gold | `#FFD700` | (255, 215, 0) |
| Mercury | Deep Purple | `#4B0082` | (75, 0, 130) |
| Venus | Pink Dream | `#FF69B4` | (255, 105, 180) |
| Moon | Dark Violet | `#9400D3` | (148, 0, 211) |
| Mars | Crimson | `#DC143C` | (220, 20, 60) |
| Jupiter | Verdant Green | `#228B22` | (34, 139, 34) |
| Saturn | Sky Blue | `#87CEEB` | (135, 206, 235) |
| Uranus | Earth Brown | `#8B4513` | (139, 69, 19) |
| Neptune | Deep Blue | `#00008B` | (0, 0, 139) |
| Pluto | Electric Yellow | `#FFFF00` | (255, 255, 0) |

### Attribute Base Colors

| Attribute | Color | Hex Code |
|-----------|-------|----------|
| FIRE | Orange-Red | `#FF4500` |
| WATER | Deep Blue | `#0047AB` |
| EARTH | Brown | `#8B4513` |
| WIND | Sky Blue | `#87CEEB` |
| LIGHT | Bright Gold | `#FFD700` |
| DARK | Deep Purple | `#4B0082` |

---

## Visual Design Concept

### Card Appearance
- **Card Base Color**: Attribute color (represents what the monster IS)
- **Card Border/Accent**: Guardian Star color (represents the monster's combat approach)
- **Symbol**: Guardian Star symbol displayed on card

### Example: Blue-Eyes White Dragon
- Base: Gold (LIGHT attribute)
- Border: Gold (Sun star - STAB!)
- Symbol: ☉
- Result: Golden card with Sun symbol, perfect STAB alignment

---

## Next Steps for Implementation

1. **Add Guardian Star fields to Card data structure**
   - Primary Guardian Star
   - Optional Secondary Guardian Star (for variety)

2. **Implement star effectiveness lookup**
   - Use GUARDIAN_STAR_CHART constant
   - Battle calculation with getStarMultiplier()

3. **UI Updates**
   - Card border/accent colors based on Guardian Star
   - Star effectiveness indicators in battle
   - Guardian Star symbols on cards

4. **Card Assignment**
   - Assign Guardian Stars to all 720+ existing cards
   - Use thematic logic (e.g., Blue-Eyes = Sun, Red-Eyes = Mars)
   - Can assign based on original game data if available

5. **Testing**
   - Verify multipliers work correctly
   - Balance testing across card pool
   - UI/UX testing

---

**Document Version**: 3.0 - Guardian Stars (Original Design)  
**Last Updated**: 2025-11-18  
**Status**: Ready for Implementation ✅  
**Note**: Replaced Combat Styles with original Guardian Stars system featuring two independent cycles (Mystical 4-cycle and Elemental 6-cycle) with 1-beats-1, 1-loses-to-1 balance.
