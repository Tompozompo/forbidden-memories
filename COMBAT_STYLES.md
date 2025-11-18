# Type Effectiveness System - Dual Mode Design

**Status**: Ready for implementation  
**Last Updated**: 2025-11-18

---

## System Overview

This document specifies a **10-type effectiveness system** with two presentation modes that players can toggle between in settings. Both modes use identical battle mechanics and matchups, differing only in naming convention.

### Dual Mode System

- **Classic Mode**: Guardian Stars with zodiac/celestial names (Sun, Mercury, Venus, etc.)
- **Element Mode**: Combat Styles with elemental names (Radiance, Shadow, Bolt, etc.)
- **Settings Toggle**: Players can switch between modes based on preference
- **Same Mechanics**: Both use the two-cycle design with identical matchups

### Core Mechanics (Both Modes)

- **10 Types** organized in two independent cycles
- **6 Attributes** representing monster elemental nature (FIRE/WATER/EARTH/WIND/LIGHT/DARK)
- **Two-Cycle Design**: 
  - **Mystical Cycle**: 4 types - Light/Dark/Dreams/Fiend
  - **Elemental Cycle**: 6 types - Fire/Forest/Wind/Earth/Water/Thunder
- **Simple Balance**: Each type beats 1, loses to 1, neutral vs 8
- **STAB System**: 6 types match attributes for bonus damage potential
- **Position-Based**: Attack mode uses type, Defense mode uses Attribute only

---

## The 10 Types - Both Modes

| # | Classic Mode (Guardian Star) | Symbol | Element Mode (Combat Style) | Emoji | Alignment | Attribute Match | Theme |
|---|------------------------------|--------|----------------------------|-------|-----------|-----------------|-------|
| 1 | **Sun** | ☉ | **Radiance** | ✨ | Light | LIGHT | Radiant power |
| 2 | **Mercury** | ☿ | **Shadow** | 🌑 | Dark | DARK | Darkness |
| 3 | **Venus** | ♀ | **Dream** | 💭 | Dreams | *(none)* | Illusion |
| 4 | **Moon** | ☾ | **Fiend** | 👹 | Fiend | *(none)* | Dark magic |
| 5 | **Mars** | ♂ | **Flame** | 🔥 | Fire | FIRE | Burning heat |
| 6 | **Jupiter** | ♃ | **Plant** | 🌿 | Forest | *(none)* | Natural growth |
| 7 | **Saturn** | ♄ | **Gale** | 💨 | Wind | WIND | Air currents |
| 8 | **Uranus** | ⛢ | **Quake** | 🌍 | Earth | EARTH | Seismic power |
| 9 | **Neptune** | ♆ | **Torrent** | 🌊 | Water | WATER | Flowing water |
| 10 | **Pluto** | ♇ | **Bolt** | ⚡ | Thunder | *(none)* | Lightning |

---

## The Two-Cycle System

### Cycle 1: Mystical Cycle (4 Types)

The Mystical Cycle represents supernatural forces: Light, Dark, Dreams, and Fiend magic.

**Classic Mode Cycle:**
```
Sun (Light) → Moon (Fiend) → Venus (Dreams) → Mercury (Dark) → Sun
```

**Element Mode Cycle:**
```
Radiance (Light) → Fiend (Fiend) → Dream (Dreams) → Shadow (Dark) → Radiance
```

| Classic Mode | Element Mode | Beats | Loses To | Neutral Against (8 types) |
|--------------|--------------|-------|----------|---------------------------|
| **Sun** ☉ | **Radiance** ✨ | Moon/Fiend | Mercury/Shadow | Venus/Dream, Mars/Flame, Jupiter/Plant, Saturn/Gale, Uranus/Quake, Neptune/Torrent, Pluto/Bolt |
| **Mercury** ☿ | **Shadow** 🌑 | Sun/Radiance | Venus/Dream | Moon/Fiend, Mars/Flame, Jupiter/Plant, Saturn/Gale, Uranus/Quake, Neptune/Torrent, Pluto/Bolt |
| **Venus** ♀ | **Dream** 💭 | Mercury/Shadow | Moon/Fiend | Sun/Radiance, Mars/Flame, Jupiter/Plant, Saturn/Gale, Uranus/Quake, Neptune/Torrent, Pluto/Bolt |
| **Moon** ☾ | **Fiend** 👹 | Venus/Dream | Sun/Radiance | Mercury/Shadow, Mars/Flame, Jupiter/Plant, Saturn/Gale, Uranus/Quake, Neptune/Torrent, Pluto/Bolt |

**Thematic Logic:**
- Light banishes Fiends
- Darkness obscures Light
- Dreams dissolve in Darkness
- Fiends corrupt Dreams

### Cycle 2: Elemental Cycle (6 Types)

The Elemental Cycle represents natural forces: Fire, Water, Thunder, Earth, Wind, and Forest.

**Classic Mode Cycle:**
```
Mars (Fire) → Neptune (Water) → Pluto (Thunder) → Uranus (Earth) → Saturn (Wind) → Jupiter (Forest) → Mars
```

**Element Mode Cycle:**
```
Flame (Fire) → Torrent (Water) → Bolt (Thunder) → Quake (Earth) → Gale (Wind) → Plant (Forest) → Flame
```

| Classic Mode | Element Mode | Beats | Loses To | Neutral Against (8 types) |
|--------------|--------------|-------|----------|---------------------------|
| **Mars** ♂ | **Flame** 🔥 | Jupiter/Plant | Neptune/Torrent | Sun/Radiance, Mercury/Shadow, Venus/Dream, Moon/Fiend, Saturn/Gale, Uranus/Quake, Pluto/Bolt |
| **Jupiter** ♃ | **Plant** 🌿 | Saturn/Gale | Mars/Flame | Sun/Radiance, Mercury/Shadow, Venus/Dream, Moon/Fiend, Uranus/Quake, Neptune/Torrent, Pluto/Bolt |
| **Saturn** ♄ | **Gale** 💨 | Uranus/Quake | Jupiter/Plant | Sun/Radiance, Mercury/Shadow, Venus/Dream, Moon/Fiend, Mars/Flame, Neptune/Torrent, Pluto/Bolt |
| **Uranus** ⛢ | **Quake** 🌍 | Pluto/Bolt | Saturn/Gale | Sun/Radiance, Mercury/Shadow, Venus/Dream, Moon/Fiend, Mars/Flame, Jupiter/Plant, Neptune/Torrent |
| **Neptune** ♆ | **Torrent** 🌊 | Mars/Flame | Pluto/Bolt | Sun/Radiance, Mercury/Shadow, Venus/Dream, Moon/Fiend, Jupiter/Plant, Saturn/Gale, Uranus/Quake |
| **Pluto** ♇ | **Bolt** ⚡ | Neptune/Torrent | Uranus/Quake | Sun/Radiance, Mercury/Shadow, Venus/Dream, Moon/Fiend, Mars/Flame, Jupiter/Plant, Saturn/Gale |

**Thematic Logic:**
- Fire burns Forest/Plants
- Water extinguishes Fire
- Thunder electrifies Water
- Earth grounds Thunder
- Wind erodes Earth
- Forest blocks Wind

---

## Balance Verification

✅ **Perfect Two-Cycle Balance Confirmed**:
- Each type beats exactly 1 other
- Each type loses to exactly 1 other
- Each type is neutral vs exactly 8 others
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
| Super Effective | **×1.5** | Sun vs DARK | Radiance vs DARK |
| Neutral | **×1.0** | Sun vs FIRE | Radiance vs FIRE |
| Not Very Effective | **×0.7** | Sun vs LIGHT | Radiance vs LIGHT |

### vs Attack Mode (Type Active)

When attacking a monster in Attack Mode (type active):

| Matchup Result | Multiplier | Example (Classic) | Example (Element) |
|----------------|------------|-------------------|-------------------|
| **Advantage** | **×1.3** | Sun vs Moon | Radiance vs Fiend |
| **Neutral** | **×1.0** | Sun vs Mars | Radiance vs Flame |
| **Disadvantage** | **×0.8** | Sun vs Mercury | Radiance vs Shadow |

### STAB (Same Type Attack Bonus)

When a monster's Attribute matches its type alignment:

**Classic Mode Examples:**
- LIGHT monster using Sun = STAB
- DARK monster using Mercury = STAB
- FIRE monster using Mars = STAB

**Element Mode Examples:**
- LIGHT monster using Radiance = STAB
- DARK monster using Shadow = STAB
- FIRE monster using Flame = STAB

**STAB Effect**: +10% bonus to base damage when alignment matches.

**No STAB**: The 4 unaligned types (Dreams, Fiend, Forest, Thunder) don't get STAB but offer tactical flexibility.

---

## Implementation Data Structure

### TypeScript Example

```typescript
// Mode-independent type system
export type TypeAlignment = 
  | 'Light' | 'Dark' | 'Dreams' | 'Fiend'
  | 'Fire' | 'Forest' | 'Wind' | 'Earth' | 'Water' | 'Thunder';

export type Attribute = 
  | 'FIRE' | 'WATER' | 'EARTH' | 'WIND' | 'LIGHT' | 'DARK';

// Classic Mode (Guardian Stars)
export type GuardianStar = 
  | 'Sun' | 'Mercury' | 'Venus' | 'Moon'
  | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto';

// Element Mode (Combat Styles)
export type CombatStyle = 
  | 'Radiance' | 'Shadow' | 'Dream' | 'Fiend'
  | 'Flame' | 'Plant' | 'Gale' | 'Quake' | 'Torrent' | 'Bolt';

export type DisplayMode = 'classic' | 'element';

export interface TypeEffectiveness {
  [alignment: string]: {
    beats: TypeAlignment;
    losesTo: TypeAlignment;
  };
}

// Core matchup data (mode-independent)
export const TYPE_CHART: TypeEffectiveness = {
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
export const CLASSIC_NAMES: Record<TypeAlignment, GuardianStar> = {
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

export const ELEMENT_NAMES: Record<TypeAlignment, CombatStyle> = {
  Light: 'Radiance',
  Dark: 'Shadow',
  Dreams: 'Dream',
  Fiend: 'Fiend',
  Fire: 'Flame',
  Forest: 'Plant',
  Wind: 'Gale',
  Earth: 'Quake',
  Water: 'Torrent',
  Thunder: 'Bolt'
};

export const ALIGNMENT_TO_ATTRIBUTE: Partial<Record<TypeAlignment, Attribute>> = {
  Light: 'LIGHT',
  Dark: 'DARK',
  Fire: 'FIRE',
  Water: 'WATER',
  Earth: 'EARTH',
  Wind: 'WIND'
  // Dreams, Fiend, Forest, Thunder don't match attributes
};

// Display helper
export function getTypeName(
  alignment: TypeAlignment, 
  mode: DisplayMode
): GuardianStar | CombatStyle {
  return mode === 'classic' 
    ? CLASSIC_NAMES[alignment] 
    : ELEMENT_NAMES[alignment];
}
```

### Battle Calculation Function

```typescript
function getTypeMultiplier(
  attackerAlignment: TypeAlignment,
  defenderAttribute: Attribute,
  defenderAlignment?: TypeAlignment // undefined if in defense mode
): number {
  // If defender is in attack mode, check type matchup
  if (defenderAlignment) {
    if (TYPE_CHART[attackerAlignment].beats === defenderAlignment) {
      return 1.3; // Advantage
    } else if (TYPE_CHART[attackerAlignment].losesTo === defenderAlignment) {
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
  typeAlignment: TypeAlignment
): boolean {
  const matchingAttribute = ALIGNMENT_TO_ATTRIBUTE[typeAlignment];
  return matchingAttribute === monsterAttribute;
}
```

---

## Color Palettes

### Classic Mode (Guardian Stars)

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

### Element Mode (Combat Styles)

| Style | Color Name | Hex Code | RGB |
|-------|-----------|----------|-----|
| Radiance | Bright Gold | `#FFD700` | (255, 215, 0) |
| Shadow | Deep Purple | `#4B0082` | (75, 0, 130) |
| Dream | Pink Dream | `#FF69B4` | (255, 105, 180) |
| Fiend | Dark Violet | `#9400D3` | (148, 0, 211) |
| Flame | Crimson | `#DC143C` | (220, 20, 60) |
| Plant | Verdant Green | `#228B22` | (34, 139, 34) |
| Gale | Sky Blue | `#87CEEB` | (135, 206, 235) |
| Quake | Earth Brown | `#8B4513` | (139, 69, 19) |
| Torrent | Deep Blue | `#00008B` | (0, 0, 139) |
| Bolt | Electric Yellow | `#FFFF00` | (255, 255, 0) |

*Note: Both modes use the same colors for matching alignments*

---

## Settings Toggle Implementation

### User Settings

Add a display mode preference to the settings:

```typescript
interface UserSettings {
  // ... other settings
  typeDisplayMode: 'classic' | 'element'; // Default: 'classic'
}
```

### UI Display

Throughout the UI, use the mode to determine which names to show:

```typescript
// Example: Card display
function CardTypeDisplay({ alignment, settings }: Props) {
  const typeName = getTypeName(alignment, settings.typeDisplayMode);
  const symbol = settings.typeDisplayMode === 'classic' 
    ? getSymbol(alignment) 
    : getEmoji(alignment);
  
  return <span>{symbol} {typeName}</span>;
}
```

### Settings Screen

Add a toggle option in the settings screen:

```
⚙️ Settings

Display Mode:
○ Classic Mode (Guardian Stars: Sun, Mercury, Venus...)
○ Element Mode (Combat Styles: Radiance, Shadow, Dream...)
```

---

## Visual Design Concept

### Card Appearance (Both Modes)
- **Card Base Color**: Attribute color (represents what the monster IS)
- **Card Border/Accent**: Type color (represents the monster's combat approach)
- **Symbol/Icon**: Mode-dependent (Classic shows ☉☿♀, Element shows ✨🌑💭)

### Example: Blue-Eyes White Dragon

**Classic Mode:**
- Base: Gold (LIGHT attribute)
- Border: Gold (Sun star - STAB!)
- Symbol: ☉
- Label: "Sun"

**Element Mode:**
- Base: Gold (LIGHT attribute)
- Border: Gold (Radiance style - STAB!)
- Symbol: ✨
- Label: "Radiance"

---

## Next Steps for Implementation

1. **Add type fields to Card data structure**
   - TypeAlignment (internal representation)
   - Display name determined by mode setting

2. **Implement settings toggle**
   - Add typeDisplayMode to user settings
   - Persist preference in localStorage
   - Add UI control in settings screen

3. **Update all UI components**
   - Use getTypeName() helper for display
   - Show appropriate symbols/emojis based on mode
   - Type effectiveness indicators work in both modes

4. **Card Assignment**
   - Assign TypeAlignment to all 720+ existing cards
   - Use thematic logic (e.g., Blue-Eyes = Light, Red-Eyes = Fire)
   - Display adapts automatically based on mode

5. **Testing**
   - Verify matchups work correctly in both modes
   - Test mode switching in settings
   - Balance testing across card pool
   - UI/UX testing for both modes

---

**Document Version**: 4.0 - Dual Mode System (Classic & Element)  
**Last Updated**: 2025-11-18  
**Status**: Ready for Implementation ✅  
**Note**: Combines Guardian Stars (classic/zodiac naming) and Combat Styles (element naming) into a unified dual-mode system. Players can toggle between modes in settings while using the same battle mechanics and matchups.
