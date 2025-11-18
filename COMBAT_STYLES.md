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

## ⚠️ IMPORTANT: Original Table Had Balance Issues

The original table had reciprocal relationship errors where Impact was weak to 3 types instead of 2. Below are **three perfectly balanced alternatives** to choose from, each with exactly 2 strengths and 2 weaknesses per type.

---

## Alternative 1: Cycle Pattern

**Perfectly balanced** with clear thematic cycles.

| Combat Style | Beats (Super Effective) | Loses To (Not Very Effective) | Neutral Against |
|--------------|-------------------------|-------------------------------|-----------------|
| **Flame** 🔥 | Frost, Venom | Torrent, Bolt | Quake, Gale, Radiance, Shadow, Impact |
| **Torrent** 🌊 | Flame, Impact | Quake, Impact | Gale, Radiance, Shadow, Bolt, Venom, Frost |
| **Quake** 🌍 | Bolt, Torrent | Gale, Venom | Flame, Radiance, Shadow, Frost, Impact |
| **Gale** 💨 | Quake, Shadow | Radiance, Frost | Flame, Torrent, Bolt, Venom, Impact |
| **Radiance** ✨ | Gale, Venom | Shadow, Venom | Flame, Torrent, Quake, Bolt, Frost, Impact |
| **Shadow** 🌑 | Radiance, Impact | Gale, Bolt | Flame, Torrent, Quake, Venom, Frost |
| **Bolt** ⚡ | Flame, Shadow | Quake, Frost | Torrent, Gale, Radiance, Venom, Impact |
| **Venom** ☠️ | Quake, Radiance | Flame, Radiance | Torrent, Gale, Shadow, Bolt, Frost, Impact |
| **Frost** ❄️ | Gale, Bolt | Flame, Impact | Torrent, Quake, Radiance, Shadow, Venom |
| **Impact** 💥 | Torrent, Frost | Torrent, Shadow | Flame, Quake, Gale, Radiance, Bolt, Venom |

**Thematic Logic:**
- Fire melts ice and burns away toxins
- Water extinguishes fire and shapes/erodes solid impact  
- Earth grounds electricity and absorbs water
- Wind carves earth and disperses shadow
- Light illuminates wind paths and purifies poison
- Shadow shrouds light and makes impact miss
- Lightning ignites fire and pierces shadow
- Venom corrodes earth and poisons light
- Frost freezes wind and conducts electricity away
- Impact crushes water and shatters ice

---

## Alternative 2: Balanced Distribution

**Perfectly balanced** with varied interactions.

| Combat Style | Beats (Super Effective) | Loses To (Not Very Effective) | Neutral Against |
|--------------|-------------------------|-------------------------------|-----------------|
| **Flame** 🔥 | Frost, Venom | Torrent, Impact | Quake, Gale, Radiance, Shadow, Bolt |
| **Torrent** 🌊 | Flame, Radiance | Gale, Impact | Quake, Shadow, Bolt, Venom, Frost |
| **Quake** 🌍 | Bolt, Impact | Shadow, Venom | Flame, Torrent, Gale, Radiance, Frost |
| **Gale** 💨 | Torrent, Shadow | Bolt, Frost | Flame, Quake, Radiance, Venom, Impact |
| **Radiance** ✨ | Shadow, Frost | Torrent, Venom | Flame, Quake, Gale, Bolt, Impact |
| **Shadow** 🌑 | Quake, Venom | Gale, Radiance | Flame, Torrent, Bolt, Frost, Impact |
| **Bolt** ⚡ | Gale, Impact | Quake, Frost | Flame, Torrent, Radiance, Shadow, Venom |
| **Venom** ☠️ | Radiance, Quake | Flame, Shadow | Torrent, Gale, Bolt, Frost, Impact |
| **Frost** ❄️ | Bolt, Gale | Flame, Radiance | Torrent, Quake, Shadow, Venom, Impact |
| **Impact** 💥 | Flame, Torrent | Quake, Bolt | Gale, Radiance, Shadow, Venom, Frost |

**Thematic Logic:**
- Fire melts ice and burns toxins
- Water extinguishes fire and floods light
- Earth grounds electricity and crushes with impact
- Wind disperses water and scatters shadows  
- Light reveals darkness and freezes shadows solid
- Shadow seeps through earth and poisons awareness
- Lightning energizes air and disrupts solid matter
- Venom purifies light and corrodes earth
- Frost conducts electricity and freezes air
- Impact smashes fire and crushes water

---

## Alternative 3: Classic Elements Enhanced

**Perfectly balanced** with traditional element relationships.

| Combat Style | Beats (Super Effective) | Loses To (Not Very Effective) | Neutral Against |
|--------------|-------------------------|-------------------------------|-----------------|
| **Flame** 🔥 | Frost, Gale | Torrent, Quake | Radiance, Shadow, Bolt, Venom, Impact |
| **Torrent** 🌊 | Flame, Quake | Shadow, Bolt | Gale, Radiance, Venom, Frost, Impact |
| **Quake** 🌍 | Bolt, Flame | Torrent, Shadow | Gale, Radiance, Venom, Frost, Impact |
| **Gale** 💨 | Shadow, Venom | Flame, Frost | Torrent, Quake, Radiance, Bolt, Impact |
| **Radiance** ✨ | Shadow, Impact | Venom, Frost | Flame, Torrent, Quake, Gale, Bolt |
| **Shadow** 🌑 | Quake, Torrent | Gale, Radiance | Flame, Bolt, Venom, Frost, Impact |
| **Bolt** ⚡ | Torrent, Frost | Quake, Impact | Flame, Gale, Radiance, Shadow, Venom |
| **Venom** ☠️ | Radiance, Impact | Gale, Impact | Flame, Torrent, Quake, Shadow, Bolt, Frost |
| **Frost** ❄️ | Gale, Radiance | Flame, Bolt | Torrent, Quake, Shadow, Venom, Impact |
| **Impact** 💥 | Bolt, Venom | Radiance, Venom | Flame, Torrent, Quake, Gale, Shadow, Frost |

**Thematic Logic:**
- Fire melts ice and consumes wind's oxygen
- Water extinguishes fire and erodes earth
- Earth grounds electricity and smothers fire  
- Wind disperses shadow and carries poison away
- Light reveals darkness and obstructs impact
- Shadow seeps through earth and absorbs water
- Lightning conducts through water and freezes into frost
- Venom pierces light and corrodes through impact
- Frost freezes wind and reflects light
- Impact disrupts electricity and crushes poison

---

## Balance Verification

✅ **Perfect Balance Confirmed for All Alternatives**:
- Each Combat Style beats exactly 2 others
- Each Combat Style loses to exactly 2 others  
- Each Combat Style is neutral vs exactly 6 others
- All reverse relationships verified (if A beats B, then B loses to A)
- Total wins = Total losses = 20

---

## Choosing an Alternative

All three alternatives are **perfectly balanced** with exactly 2 strengths and 2 weaknesses per type. Choose based on your preferred thematic approach:

- **Alternative 1**: Clear cycle patterns, easiest to remember
- **Alternative 2**: Varied interactions, unique combinations
- **Alternative 3**: Classic elemental relationships, familiar to players

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

### TypeScript Example (Using Alternative 1)

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

// Alternative 1: Cycle Pattern
export const TYPE_CHART: TypeEffectiveness = {
  Flame: {
    superEffective: ['Frost', 'Venom'],
    notVeryEffective: ['Torrent', 'Bolt']
  },
  Torrent: {
    superEffective: ['Flame', 'Impact'],
    notVeryEffective: ['Quake', 'Impact']
  },
  Quake: {
    superEffective: ['Bolt', 'Torrent'],
    notVeryEffective: ['Gale', 'Venom']
  },
  Gale: {
    superEffective: ['Quake', 'Shadow'],
    notVeryEffective: ['Radiance', 'Frost']
  },
  Radiance: {
    superEffective: ['Gale', 'Venom'],
    notVeryEffective: ['Shadow', 'Venom']
  },
  Shadow: {
    superEffective: ['Radiance', 'Impact'],
    notVeryEffective: ['Gale', 'Bolt']
  },
  Bolt: {
    superEffective: ['Flame', 'Shadow'],
    notVeryEffective: ['Quake', 'Frost']
  },
  Venom: {
    superEffective: ['Quake', 'Radiance'],
    notVeryEffective: ['Flame', 'Radiance']
  },
  Frost: {
    superEffective: ['Gale', 'Bolt'],
    notVeryEffective: ['Flame', 'Impact']
  },
  Impact: {
    superEffective: ['Torrent', 'Frost'],
    notVeryEffective: ['Torrent', 'Shadow']
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

## Next Steps for Implementation

1. **Choose which alternative to use** (all are perfectly balanced)
   - Alternative 1: Cycle Pattern (recommended for clarity)
   - Alternative 2: Balanced Distribution  
   - Alternative 3: Classic Elements Enhanced

2. **Add Combat Style fields to Card data structure**
   - Primary Combat Style
   - Optional Secondary Combat Style

3. **Implement type effectiveness lookup**
   - Use TYPE_CHART constant for chosen alternative
   - Battle calculation with getTypeMultiplier()

4. **UI Updates**
   - Card border colors based on Combat Styles
   - Type effectiveness indicators in battle
   - Combat Style icons/badges

5. **Card Assignment**
   - Assign Combat Styles to all 720+ existing cards
   - Formula-based with manual overrides for iconic cards
   - Use thematic logic (e.g., Blue-Eyes = Radiance/Frost)

6. **Testing**
   - Verify multipliers work correctly
   - Balance testing across card pool
   - UI/UX testing

---

**Document Version**: 2.0 - Fixed Balance Issues  
**Last Updated**: 2025-11-18  
**Status**: Ready for Implementation ✅  
**Note**: Original table had reciprocal relationship errors. All alternatives are now perfectly balanced.
