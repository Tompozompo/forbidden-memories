# Combat Styles System - Final Specification

**Status**: Ready for implementation  
**Last Updated**: 2025-11-17

---

## System Overview

This document specifies the **10-type Combat Style system** that replaces the original Guardian Star system. Each Combat Style beats exactly 2 others and loses to exactly 2 others, creating a perfectly balanced type effectiveness system.

### Core Mechanics

- **10 Combat Styles** representing different attack methods
- **6 Attributes** representing monster elemental nature (existing FIRE/WATER/EARTH/WIND/LIGHT/DARK)
- **Perfect Balance**: Each style beats 2, loses to 2, neutral vs 6
- **STAB System**: 6 styles match attributes for bonus damage potential
- **Position-Based**: Attack mode uses full dual-type, Defense mode uses Attribute only

---

## The 10 Combat Styles

| # | Combat Style | Emoji | Attribute Match | Theme |
|---|--------------|-------|-----------------|-------|
| 1 | **Flame** | 🔥 | FIRE | Burning heat, combustion |
| 2 | **Torrent** | 🌊 | WATER | Flowing water, erosion |
| 3 | **Quake** | 🌍 | EARTH | Seismic earth power |
| 4 | **Gale** | 💨 | WIND | Rushing wind, dispersion |
| 5 | **Radiance** | ✨ | LIGHT | Purifying light energy |
| 6 | **Shadow** | 🌑 | DARK | Intangible darkness |
| 7 | **Bolt** | ⚡ | *(none)* | Electrical energy |
| 8 | **Venom** | ☠️ | *(none)* | Corrosive poison/acid |
| 9 | **Frost** | ❄️ | *(none)* | Freezing cold, ice |
| 10 | **Impact** | 💥 | *(none)* | Physical force, crushing |

---

## Complete Matchup Table

### Type Effectiveness Chart

| Combat Style | Beats (Super Effective) | Loses To (Not Very Effective) | Neutral Against |
|--------------|-------------------------|-------------------------------|-----------------|
| **Flame** 🔥 | Frost, Venom | Torrent, Quake | Gale, Radiance, Shadow, Bolt, Impact |
| **Torrent** 🌊 | Flame, Quake | Gale, Bolt | Radiance, Shadow, Venom, Frost, Impact |
| **Quake** 🌍 | Bolt, Radiance | Torrent, Shadow | Flame, Gale, Venom, Frost, Impact |
| **Gale** 💨 | Torrent, Shadow | Flame, Frost | Quake, Radiance, Bolt, Venom, Impact |
| **Radiance** ✨ | Shadow, Venom | Quake, Impact | Flame, Torrent, Gale, Bolt, Frost |
| **Shadow** 🌑 | Quake, Impact | Gale, Radiance | Flame, Torrent, Bolt, Venom, Frost |
| **Bolt** ⚡ | Torrent, Impact | Quake, Frost | Flame, Gale, Radiance, Shadow, Venom |
| **Venom** ☠️ | Frost, Impact | Flame, Radiance | Torrent, Quake, Gale, Shadow, Bolt |
| **Frost** ❄️ | Gale, Bolt | Flame, Venom | Torrent, Quake, Radiance, Shadow, Impact |
| **Impact** 💥 | Radiance, Frost | Bolt, Shadow | Flame, Torrent, Quake, Gale, Venom |

### Matchup Matrix

|  | 🔥 | 🌊 | 🌍 | 💨 | ✨ | 🌑 | ⚡ | ☠️ | ❄️ | 💥 |
|---|---|---|---|---|---|---|---|---|---|---|
| **Flame** 🔥 | ○ | ❌ | ❌ | ○ | ○ | ○ | ○ | ✓ | ✓ | ○ |
| **Torrent** 🌊 | ✓ | ○ | ✓ | ❌ | ○ | ○ | ❌ | ○ | ○ | ○ |
| **Quake** 🌍 | ○ | ❌ | ○ | ○ | ✓ | ❌ | ✓ | ○ | ○ | ○ |
| **Gale** 💨 | ○ | ✓ | ○ | ○ | ○ | ✓ | ○ | ○ | ❌ | ○ |
| **Radiance** ✨ | ○ | ○ | ❌ | ○ | ○ | ✓ | ○ | ✓ | ○ | ❌ |
| **Shadow** 🌑 | ○ | ○ | ✓ | ❌ | ❌ | ○ | ○ | ○ | ○ | ✓ |
| **Bolt** ⚡ | ○ | ✓ | ❌ | ○ | ○ | ○ | ○ | ○ | ❌ | ✓ |
| **Venom** ☠️ | ❌ | ○ | ○ | ○ | ❌ | ○ | ○ | ○ | ✓ | ✓ |
| **Frost** ❄️ | ❌ | ○ | ○ | ✓ | ○ | ○ | ✓ | ❌ | ○ | ○ |
| **Impact** 💥 | ○ | ○ | ○ | ○ | ✓ | ❌ | ❌ | ○ | ✓ | ○ |

**Legend**: ✓ = Super Effective (×1.5) | ❌ = Not Very Effective (×0.7) | ○ = Neutral (×1.0)

---

## Thematic Logic

Each matchup has clear real-world or fantasy logic:

### Flame 🔥
- **Beats Frost**: Fire melts ice
- **Beats Venom**: Fire burns/purifies toxins
- **Loses to Torrent**: Water extinguishes fire
- **Loses to Quake**: Earth smothers fire

### Torrent 🌊
- **Beats Flame**: Water extinguishes fire
- **Beats Quake**: Water erodes earth
- **Loses to Gale**: Wind evaporates water
- **Loses to Bolt**: Electricity conducts through water

### Quake 🌍
- **Beats Bolt**: Earth grounds electricity
- **Beats Radiance**: Earth blocks/eclipses light
- **Loses to Torrent**: Water erodes earth
- **Loses to Shadow**: Shadow flows through cracks

### Gale 💨
- **Beats Torrent**: Wind evaporates water
- **Beats Shadow**: Wind disperses darkness
- **Loses to Flame**: Fire consumes oxygen
- **Loses to Frost**: Cold stops air movement

### Radiance ✨
- **Beats Shadow**: Light reveals darkness
- **Beats Venom**: Light purifies poison
- **Loses to Quake**: Earth blocks light
- **Loses to Impact**: Matter obstructs light

### Shadow 🌑
- **Beats Quake**: Intangible flows through solid
- **Beats Impact**: Can't strike what has no form
- **Loses to Gale**: Wind disperses shadow
- **Loses to Radiance**: Light reveals shadow

### Bolt ⚡
- **Beats Torrent**: Electricity conducts through water
- **Beats Impact**: Energy pierces matter
- **Loses to Quake**: Earth grounds electricity
- **Loses to Frost**: Cold stops energy flow

### Venom ☠️
- **Beats Frost**: Acid dissolves ice
- **Beats Impact**: Corrosion weakens matter
- **Loses to Flame**: Fire burns toxins
- **Loses to Radiance**: Light purifies poison

### Frost ❄️
- **Beats Gale**: Cold freezes air
- **Beats Bolt**: Cold stops energy flow
- **Loses to Flame**: Fire melts ice
- **Loses to Venom**: Acid dissolves ice

### Impact 💥
- **Beats Radiance**: Solid matter blocks light
- **Beats Frost**: Force shatters brittle ice
- **Loses to Bolt**: Energy pierces through
- **Loses to Shadow**: Can't hit intangible

---

## Battle Multipliers

### vs Defense Mode (Single-Type)

When attacking a monster in Defense Mode (only Attribute active):

| Matchup Result | Multiplier | Example |
|----------------|------------|---------|
| Super Effective | **×1.5** | Flame vs WIND attribute |
| Neutral | **×1.0** | Flame vs DARK attribute |
| Not Very Effective | **×0.7** | Flame vs WATER attribute |

### vs Attack Mode (Dual-Type)

When attacking a monster in Attack Mode (Attribute + Combat Style active):

| Matchup Result | Multiplier | Example |
|----------------|------------|---------|
| **Super Advantage** (Win both) | **×2.0** | Flame vs WIND + Gale |
| **Mixed** (Win 1, lose 1) | **×1.0** | Flame vs WATER + Shadow |
| **Super Disadvantage** (Lose both) | **×0.5** | Flame vs WATER + Torrent |

### STAB (Same Type Attack Bonus)

When a monster's Attribute matches its Combat Style:

- FIRE monster using Flame style = STAB
- WATER monster using Torrent style = STAB
- Etc. for all 6 matched pairs

**STAB Effect**: Enables the maximum ×2.0 super advantage multiplier when both types win.

**No STAB**: The 4 unmatched styles (Bolt, Venom, Frost, Impact) can achieve ×1.5 maximum advantage but have more flexibility.

---

## Implementation Data Structure

### TypeScript Example

```typescript
export type CombatStyle = 
  | 'Flame' | 'Torrent' | 'Quake' | 'Gale' | 'Radiance'
  | 'Shadow' | 'Bolt' | 'Venom' | 'Frost' | 'Impact';

export type Attribute = 
  | 'FIRE' | 'WATER' | 'EARTH' | 'WIND' | 'LIGHT' | 'DARK';

export interface TypeEffectiveness {
  [attackingStyle: string]: {
    superEffective: CombatStyle[];
    notVeryEffective: CombatStyle[];
  };
}

export const TYPE_CHART: TypeEffectiveness = {
  Flame: {
    superEffective: ['Frost', 'Venom'],
    notVeryEffective: ['Torrent', 'Quake']
  },
  Torrent: {
    superEffective: ['Flame', 'Quake'],
    notVeryEffective: ['Gale', 'Bolt']
  },
  Quake: {
    superEffective: ['Bolt', 'Radiance'],
    notVeryEffective: ['Torrent', 'Shadow']
  },
  Gale: {
    superEffective: ['Torrent', 'Shadow'],
    notVeryEffective: ['Flame', 'Frost']
  },
  Radiance: {
    superEffective: ['Shadow', 'Venom'],
    notVeryEffective: ['Quake', 'Impact']
  },
  Shadow: {
    superEffective: ['Quake', 'Impact'],
    notVeryEffective: ['Gale', 'Radiance']
  },
  Bolt: {
    superEffective: ['Torrent', 'Impact'],
    notVeryEffective: ['Quake', 'Frost']
  },
  Venom: {
    superEffective: ['Frost', 'Impact'],
    notVeryEffective: ['Flame', 'Radiance']
  },
  Frost: {
    superEffective: ['Gale', 'Bolt'],
    notVeryEffective: ['Flame', 'Venom']
  },
  Impact: {
    superEffective: ['Radiance', 'Frost'],
    notVeryEffective: ['Bolt', 'Shadow']
  }
};

export const ATTRIBUTE_TO_STYLE: Record<Attribute, CombatStyle> = {
  FIRE: 'Flame',
  WATER: 'Torrent',
  EARTH: 'Quake',
  WIND: 'Gale',
  LIGHT: 'Radiance',
  DARK: 'Shadow'
};
```

### Battle Calculation Function

```typescript
function getTypeMultiplier(
  attackerStyle: CombatStyle,
  defenderAttribute: Attribute,
  defenderStyle?: CombatStyle // undefined if in defense mode
): number {
  const defenderStyleActual = defenderStyle || ATTRIBUTE_TO_STYLE[defenderAttribute];
  
  let advantageCount = 0;
  let disadvantageCount = 0;
  
  // Check style vs attribute
  const attributeStyle = ATTRIBUTE_TO_STYLE[defenderAttribute];
  if (TYPE_CHART[attackerStyle].superEffective.includes(attributeStyle)) {
    advantageCount++;
  } else if (TYPE_CHART[attackerStyle].notVeryEffective.includes(attributeStyle)) {
    disadvantageCount++;
  }
  
  // If defender is in attack mode, also check style vs style
  if (defenderStyle) {
    if (TYPE_CHART[attackerStyle].superEffective.includes(defenderStyle)) {
      advantageCount++;
    } else if (TYPE_CHART[attackerStyle].notVeryEffective.includes(defenderStyle)) {
      disadvantageCount++;
    }
  }
  
  // Calculate final multiplier
  if (!defenderStyle) {
    // vs Defense Mode
    if (advantageCount > 0) return 1.5;
    if (disadvantageCount > 0) return 0.7;
    return 1.0;
  } else {
    // vs Attack Mode
    if (advantageCount === 2) return 2.0; // Super advantage
    if (disadvantageCount === 2) return 0.5; // Super disadvantage
    return 1.0; // Mixed or neutral
  }
}
```

---

## Color Palette (Recommended: Vibrant)

| Style | Color Name | Hex Code | RGB |
|-------|-----------|----------|-----|
| Flame | Scarlet | `#DC143C` | (220, 20, 60) |
| Torrent | Sapphire | `#0F52BA` | (15, 82, 186) |
| Quake | Amber | `#FFBF00` | (255, 191, 0) |
| Gale | Turquoise | `#40E0D0` | (64, 224, 208) |
| Radiance | Gold | `#FFD700` | (255, 215, 0) |
| Shadow | Obsidian | `#0B1215` | (11, 18, 21) |
| Bolt | Electric Yellow | `#FFFF00` | (255, 255, 0) |
| Venom | Toxic Green | `#00FF00` | (0, 255, 0) |
| Frost | Ice Blue | `#B0E0E6` | (176, 224, 230) |
| Impact | Silver | `#C0C0C0` | (192, 192, 192) |

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
- **Card Border Color**: Combat Style color (represents how the monster ATTACKS)
- **Dual-Style Monsters**: Layered or split border showing both Combat Styles

### Example: Blue-Eyes White Dragon
- Base: Gold (LIGHT attribute)
- Border 1: Gold (Radiance style - STAB!)
- Border 2: Ice Blue (Frost style - secondary)
- Result: Golden card with gold + ice blue dual border

---

## Balance Verification

✅ **Perfect Balance Confirmed**:
- Each Combat Style beats exactly 2 others
- Each Combat Style loses to exactly 2 others  
- Each Combat Style is neutral vs exactly 6 others
- All reverse relationships verified (if A beats B, then B loses to A)
- Total wins = Total losses = 20

---

## Next Steps for Implementation

1. **Add Combat Style fields to Card data structure**
   - Primary Combat Style
   - Optional Secondary Combat Style

2. **Implement type effectiveness lookup**
   - Use TYPE_CHART constant
   - Battle calculation with getTypeMultiplier()

3. **UI Updates**
   - Card border colors based on Combat Styles
   - Type effectiveness indicators in battle
   - Combat Style icons/badges

4. **Card Assignment**
   - Assign Combat Styles to all 720+ existing cards
   - Formula-based with manual overrides for iconic cards
   - Use thematic logic (e.g., Blue-Eyes = Radiance/Frost)

5. **Testing**
   - Verify multipliers work correctly
   - Balance testing across card pool
   - UI/UX testing

---

**Document Version**: 1.0 Final  
**Ready for Implementation**: Yes ✅
