# Guardian Stars System - Dual Mode Design

**Status**: Ready for implementation  
**Last Updated**: 2025-11-18

---

## System Overview

This document specifies the **10-type Guardian Star system** with two presentation modes that players can toggle between in settings. Both modes use identical battle mechanics and matchups from the original Yu-Gi-Oh! Forbidden Memories, differing only in naming convention.

### Dual Mode System

- **Classic Mode**: Zodiac/celestial names (Sun, Mercury, Venus, Moon, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto)
- **Element Mode**: Direct alignment names (Light, Dark, Dreams, Fiend, Fire, Forest, Wind, Earth, Water, Thunder)
- **Settings Toggle**: Players can switch between modes based on preference
- **Same Mechanics**: Both use the original two-cycle design with identical matchups

### Core Mechanics (Both Modes)

- **10 Guardian Stars** organized in two independent cycles
- **6 Attributes** representing monster elemental nature (FIRE/WATER/EARTH/WIND/LIGHT/DARK)
- **Two-Cycle Design**: 
  - **Mystical Cycle**: 4 stars - Light/Dark/Dreams/Fiend
  - **Elemental Cycle**: 6 stars - Fire/Forest/Wind/Earth/Water/Thunder
- **Simple Balance**: Each star beats 1, loses to 1, neutral vs 8
- **STAB System**: 6 stars match attributes for bonus damage potential
- **Position-Based**: Attack mode uses Guardian Star, Defense mode uses Attribute only

---

## The 10 Guardian Stars - Both Modes

| # | Classic Mode | Symbol | Element Mode | Emoji | Attribute Match | Theme |
|---|--------------|--------|--------------|-------|-----------------|-------|
| 1 | **Sun** | ☉ | **Light** | ✨ | LIGHT | Radiant solar power |
| 2 | **Mercury** | ☿ | **Dark** | 🌑 | DARK | Shadow and darkness |
| 3 | **Venus** | ♀ | **Dreams** | 💭 | *(none)* | Illusion and fantasy |
| 4 | **Moon** | ☾ | **Fiend** | 👹 | *(none)* | Dark magic and demons |
| 5 | **Mars** | ♂ | **Fire** | 🔥 | FIRE | Burning flames |
| 6 | **Jupiter** | ♃ | **Forest** | 🌿 | *(none)* | Natural growth, plants |
| 7 | **Saturn** | ♄ | **Wind** | 💨 | WIND | Air currents |
| 8 | **Uranus** | ⛢ | **Earth** | 🌍 | EARTH | Solid ground |
| 9 | **Neptune** | ♆ | **Water** | 🌊 | WATER | Ocean depths |
| 10 | **Pluto** | ♇ | **Thunder** | ⚡ | *(none)* | Lightning and electricity |

---

## The Two-Cycle System

### Cycle 1: Mystical Cycle (4 Stars)

The Mystical Cycle represents supernatural forces: Light, Dark, Dreams, and Fiend magic.

**Classic Mode Cycle:**
```
Sun (Light) → Moon (Fiend) → Venus (Dreams) → Mercury (Dark) → Sun
```

**Element Mode Cycle:**
```
Light → Fiend → Dreams → Dark → Light
```

| Classic Mode | Element Mode | Beats | Loses To | Neutral Against (8 stars) |
|--------------|--------------|-------|----------|--------------------------|
| **Sun** ☉ | **Light** ✨ | Moon/Fiend | Mercury/Dark | Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto |
| **Mercury** ☿ | **Dark** 🌑 | Sun/Light | Venus/Dreams | Moon, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto |
| **Venus** ♀ | **Dreams** 💭 | Mercury/Dark | Moon/Fiend | Sun, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto |
| **Moon** ☾ | **Fiend** 👹 | Venus/Dreams | Sun/Light | Mercury, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto |

**Thematic Logic:**
- Light banishes Fiends
- Dark obscures Light
- Dreams dissolve in Darkness
- Fiends corrupt Dreams

### Cycle 2: Elemental Cycle (6 Stars)

The Elemental Cycle represents natural forces: Fire, Water, Thunder, Earth, Wind, and Forest.

**Classic Mode Cycle:**
```
Mars (Fire) → Neptune (Water) → Pluto (Thunder) → Uranus (Earth) → Saturn (Wind) → Jupiter (Forest) → Mars
```

**Element Mode Cycle:**
```
Fire → Water → Thunder → Earth → Wind → Forest → Fire
```

| Classic Mode | Element Mode | Beats | Loses To | Neutral Against (8 stars) |
|--------------|--------------|-------|----------|--------------------------|
| **Mars** ♂ | **Fire** 🔥 | Jupiter/Forest | Neptune/Water | Sun, Mercury, Venus, Moon, Saturn, Uranus, Pluto |
| **Jupiter** ♃ | **Forest** 🌿 | Saturn/Wind | Mars/Fire | Sun, Mercury, Venus, Moon, Uranus, Neptune, Pluto |
| **Saturn** ♄ | **Wind** 💨 | Uranus/Earth | Jupiter/Forest | Sun, Mercury, Venus, Moon, Mars, Neptune, Pluto |
| **Uranus** ⛢ | **Earth** 🌍 | Pluto/Thunder | Saturn/Wind | Sun, Mercury, Venus, Moon, Mars, Jupiter, Neptune |
| **Neptune** ♆ | **Water** 🌊 | Mars/Fire | Pluto/Thunder | Sun, Mercury, Venus, Moon, Jupiter, Saturn, Uranus |
| **Pluto** ♇ | **Thunder** ⚡ | Neptune/Water | Uranus/Earth | Sun, Mercury, Venus, Moon, Mars, Jupiter, Saturn |

**Thematic Logic:**
- Fire burns Forest
- Water extinguishes Fire
- Thunder electrifies Water
- Earth grounds Thunder
- Wind erodes Earth
- Forest blocks Wind

---

## Balance Verification

✅ **Perfect Two-Cycle Balance Confirmed**:
- Each Guardian Star beats exactly 1 other
- Each Guardian Star loses to exactly 1 other
- Each Guardian Star is neutral vs exactly 8 others
- All reverse relationships verified (if A beats B, then B loses to A)
- Total wins = Total losses = 10
- Two independent cycles with no cross-interactions
- **Both naming modes use identical matchups**

---

## Battle Multipliers

### vs Defense Mode (Attribute Only)

When attacking a monster in Defense Mode (only Attribute active):

| Matchup Result | Multiplier | Example (Classic) | Example (Element) |
|----------------|------------|-------------------|-------------------|
| Super Effective | **×1.5** | Sun vs DARK | Light vs DARK |
| Neutral | **×1.0** | Sun vs FIRE | Light vs FIRE |
| Not Very Effective | **×0.7** | Sun vs LIGHT | Light vs LIGHT |

### vs Attack Mode (Guardian Star Active)

When attacking a monster in Attack Mode (Guardian Star active):

| Matchup Result | Multiplier | Example (Classic) | Example (Element) |
|----------------|------------|-------------------|-------------------|
| **Advantage** | **×1.3** | Sun vs Moon | Light vs Fiend |
| **Neutral** | **×1.0** | Sun vs Mars | Light vs Fire |
| **Disadvantage** | **×0.8** | Sun vs Mercury | Light vs Dark |

### STAB (Same Type Attack Bonus)

When a monster's Attribute matches its Guardian Star:

**Classic Mode Examples:**
- LIGHT monster using Sun = STAB
- DARK monster using Mercury = STAB
- FIRE monster using Mars = STAB
- WATER monster using Neptune = STAB
- EARTH monster using Uranus = STAB
- WIND monster using Saturn = STAB

**Element Mode Examples:**
- LIGHT monster using Light = STAB
- DARK monster using Dark = STAB
- FIRE monster using Fire = STAB
- WATER monster using Water = STAB
- EARTH monster using Earth = STAB
- WIND monster using Wind = STAB

**STAB Effect**: +10% bonus to base damage when alignment matches.

**No STAB**: The 4 unaligned stars (Dreams, Fiend, Forest, Thunder) don't get STAB but offer tactical flexibility.

---

## Implementation Data Structure

### TypeScript Example

```typescript
// Guardian Star names (Classic Mode)
export type GuardianStar = 
  | 'Sun' | 'Mercury' | 'Venus' | 'Moon'
  | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto';

// Alignment names (Element Mode)
export type StarAlignment = 
  | 'Light' | 'Dark' | 'Dreams' | 'Fiend'
  | 'Fire' | 'Forest' | 'Wind' | 'Earth' | 'Water' | 'Thunder';

export type Attribute = 
  | 'FIRE' | 'WATER' | 'EARTH' | 'WIND' | 'LIGHT' | 'DARK';

export type DisplayMode = 'classic' | 'element';

export interface StarEffectiveness {
  [alignment: string]: {
    beats: StarAlignment;
    losesTo: StarAlignment;
  };
}

// Core matchup data (mode-independent)
export const GUARDIAN_STAR_CHART: StarEffectiveness = {
  Light: { beats: 'Fiend', losesTo: 'Dark' },
  Dark: { beats: 'Light', losesTo: 'Dreams' },
  Dreams: { beats: 'Dark', losesTo: 'Fiend' },
  Fiend: { beats: 'Dreams', losesTo: 'Light' },
  Fire: { beats: 'Forest', losesTo: 'Water' },
  Forest: { beats: 'Wind', losesTo: 'Fire' },
  Wind: { beats: 'Earth', losesTo: 'Forest' },
  Earth: { beats: 'Thunder', losesTo: 'Wind' },
  Water: { beats: 'Fire', losesTo: 'Thunder' },
  Thunder: { beats: 'Water', losesTo: 'Earth' }
};

// Name mappings
export const CLASSIC_NAMES: Record<StarAlignment, GuardianStar> = {
  Light: 'Sun',
  Dark: 'Mercury',
  Dreams: 'Venus',
  Fiend: 'Moon',
  Fire: 'Mars',
  Forest: 'Jupiter',
  Wind: 'Saturn',
  Earth: 'Uranus',
  Water: 'Neptune',
  Thunder: 'Pluto'
};

export const ALIGNMENT_TO_ATTRIBUTE: Partial<Record<StarAlignment, Attribute>> = {
  Light: 'LIGHT',
  Dark: 'DARK',
  Fire: 'FIRE',
  Water: 'WATER',
  Earth: 'EARTH',
  Wind: 'WIND'
  // Dreams, Fiend, Forest, Thunder don't match attributes
};

// Display helper
export function getStarName(
  alignment: StarAlignment, 
  mode: DisplayMode
): GuardianStar | StarAlignment {
  return mode === 'classic' ? CLASSIC_NAMES[alignment] : alignment;
}
```

### Battle Calculation Function

```typescript
function getStarMultiplier(
  attackerAlignment: StarAlignment,
  defenderAttribute: Attribute,
  defenderAlignment?: StarAlignment // undefined if in defense mode
): number {
  // If defender is in attack mode, check Guardian Star matchup
  if (defenderAlignment) {
    if (GUARDIAN_STAR_CHART[attackerAlignment].beats === defenderAlignment) {
      return 1.3; // Advantage
    } else if (GUARDIAN_STAR_CHART[attackerAlignment].losesTo === defenderAlignment) {
      return 0.8; // Disadvantage
    }
    return 1.0; // Neutral
  }
  
  // If defender is in defense mode, check attribute matchup
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
  starAlignment: StarAlignment
): boolean {
  const matchingAttribute = ALIGNMENT_TO_ATTRIBUTE[starAlignment];
  return matchingAttribute === monsterAttribute;
}
```

---

## Color Palette

Both modes use the same colors for matching alignments:

| Classic Mode | Element Mode | Color Name | Hex Code | RGB |
|--------------|--------------|-----------|----------|-----|
| Sun | Light | Bright Gold | `#FFD700` | (255, 215, 0) |
| Mercury | Dark | Deep Purple | `#4B0082` | (75, 0, 130) |
| Venus | Dreams | Pink Dream | `#FF69B4` | (255, 105, 180) |
| Moon | Fiend | Dark Violet | `#9400D3` | (148, 0, 211) |
| Mars | Fire | Crimson | `#DC143C` | (220, 20, 60) |
| Jupiter | Forest | Verdant Green | `#228B22` | (34, 139, 34) |
| Saturn | Wind | Sky Blue | `#87CEEB` | (135, 206, 235) |
| Uranus | Earth | Earth Brown | `#8B4513` | (139, 69, 19) |
| Neptune | Water | Deep Blue | `#00008B` | (0, 0, 139) |
| Pluto | Thunder | Electric Yellow | `#FFFF00` | (255, 255, 0) |

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

## Settings Toggle Implementation

### User Settings

Add a display mode preference to the settings:

```typescript
interface UserSettings {
  // ... other settings
  guardianStarDisplayMode: 'classic' | 'element'; // Default: 'classic'
}
```

### UI Display

Throughout the UI, use the mode to determine which names to show:

```typescript
// Example: Card display
function CardStarDisplay({ alignment, settings }: Props) {
  const starName = getStarName(alignment, settings.guardianStarDisplayMode);
  const symbol = settings.guardianStarDisplayMode === 'classic' 
    ? getZodiacSymbol(alignment) 
    : getEmoji(alignment);
  
  return <span>{symbol} {starName}</span>;
}
```

### Settings Screen

Add a toggle option in the settings screen:

```
⚙️ Settings

Guardian Star Display:
○ Classic Mode (Zodiac: Sun, Mercury, Venus, Moon...)
○ Element Mode (Alignment: Light, Dark, Dreams, Fiend...)
```

---

## Visual Design Concept

### Card Appearance (Both Modes)
- **Card Base Color**: Attribute color (represents what the monster IS)
- **Card Border/Accent**: Guardian Star color (represents combat approach)
- **Symbol/Icon**: Mode-dependent (Classic shows ☉☿♀, Element shows ✨🌑💭)

### Example: Blue-Eyes White Dragon

**Classic Mode:**
- Base: Gold (LIGHT attribute)
- Border: Gold (Sun star - STAB!)
- Symbol: ☉
- Label: "Sun"

**Element Mode:**
- Base: Gold (LIGHT attribute)
- Border: Gold (Light alignment - STAB!)
- Symbol: ✨
- Label: "Light"

---

## Next Steps for Implementation

1. **Add Guardian Star fields to Card data structure**
   - StarAlignment (internal representation)
   - Display name determined by mode setting

2. **Implement settings toggle**
   - Add guardianStarDisplayMode to user settings
   - Persist preference in localStorage
   - Add UI control in settings screen

3. **Update all UI components**
   - Use getStarName() helper for display
   - Show appropriate symbols/emojis based on mode
   - Star effectiveness indicators work in both modes

4. **Card Assignment**
   - Assign StarAlignment to all 720+ existing cards
   - Use thematic logic (e.g., Blue-Eyes = Light, Red-Eyes = Fire)
   - Display adapts automatically based on mode

5. **Testing**
   - Verify matchups work correctly in both modes
   - Test mode switching in settings
   - Balance testing across card pool
   - UI/UX testing for both modes

---

**Document Version**: 4.1 - Simplified Dual Mode (Classic & Element)  
**Last Updated**: 2025-11-18  
**Status**: Ready for Implementation ✅  
**Note**: Simplified dual-mode system using original Guardian Star zodiac names (Sun, Mercury, etc.) in Classic Mode and direct alignment names (Light, Dark, Fire, Water, etc.) in Element Mode. Both modes use identical two-cycle battle mechanics from the original game.
