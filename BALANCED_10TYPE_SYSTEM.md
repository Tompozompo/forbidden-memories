# Perfectly Balanced 10-Type Combat Style System

This document presents a **perfectly symmetrical** 10-type system where each Combat Style beats exactly 2 others and loses to exactly 2 others.

## Visual Cycle Graph

```
                    Radiance ✨
                   /          \
              beats           beats
               /                \
          Shadow 🌑           Gale 💨
            /  \               /  \
       beats  beats       beats  beats
         /      \         /        \
     Bolt ⚡   Radiance  Torrent 🌊  Frost ❄️
       |                    |         |
    beats                beats     beats
       |                    |         |
   Impact 💥            Tremor 🌍   Venom ☠️
       |                    |         |
    beats                beats     beats
       |                    |         |
   Flame 🔥              Bolt ⚡   Radiance ✨
       \      /         \        /
       beats beats       beats beats
         \    /           \    /
        Frost ❄️          Shadow 🌑
           \                /
           beats        beats
              \          /
             Venom ☠️  Gale 💨
                  \  /
                 beats
                    |
                Impact 💥
```

## Circular Representation

```
           Flame 🔥
              ↓ ↓
         Frost   Venom
           ↓       ↓
        Gale      Impact
          ↓         ↓
       Torrent    Bolt
          ↓         ↓
       Tremor    Shadow
          ↓   ↘  ↙  ↓
         Bolt   Radiance
            ↘  ↙
           Shadow
              ↓
         (back to Gale)
```

## Complete Matchup Table

| Combat Style | Icon | Beats (Advantage) | Loses To (Disadvantage) | Neutral |
|--------------|------|-------------------|-------------------------|---------|
| **Flame** 🔥 | Fire | Frost, Venom | Torrent, Impact | Tremor, Gale, Radiance, Shadow, Bolt |
| **Torrent** 🌊 | Water | Flame, Tremor | Gale, Bolt | Frost, Venom, Radiance, Shadow, Impact |
| **Tremor** 🌍 | Earth | Bolt, Radiance | Torrent, Shadow | Flame, Frost, Gale, Venom, Impact |
| **Gale** 💨 | Wind | Torrent, Shadow | Flame, Frost | Tremor, Bolt, Venom, Radiance, Impact |
| **Radiance** ✨ | Light | Shadow, Gale | Tremor, Venom | Flame, Torrent, Frost, Bolt, Impact |
| **Shadow** 🌑 | Dark | Radiance, Bolt | Gale, Tremor | Flame, Torrent, Frost, Venom, Impact |
| **Bolt** ⚡ | Electric | Impact, Frost | Shadow, Tremor | Flame, Torrent, Gale, Venom, Radiance |
| **Venom** ☠️ | Poison | Radiance, Impact | Flame, Frost | Torrent, Tremor, Gale, Shadow, Bolt |
| **Frost** ❄️ | Ice | Gale, Venom | Flame, Bolt | Torrent, Tremor, Radiance, Shadow, Impact |
| **Impact** 💥 | Physical | Flame, Torrent | Bolt, Venom | Tremor, Gale, Radiance, Shadow, Frost |

## Matchup Matrix

|  | 🔥 | 🌊 | 🌍 | 💨 | ✨ | 🌑 | ⚡ | ☠️ | ❄️ | 💥 |
|---|---|---|---|---|---|---|---|---|---|---|
| **Flame** 🔥 | — | ❌ | ○ | ○ | ○ | ○ | ○ | ✓ | ✓ | ❌ |
| **Torrent** 🌊 | ✓ | — | ✓ | ❌ | ○ | ○ | ❌ | ○ | ○ | ○ |
| **Tremor** 🌍 | ○ | ❌ | — | ○ | ✓ | ❌ | ✓ | ○ | ○ | ○ |
| **Gale** 💨 | ○ | ✓ | ○ | — | ○ | ✓ | ○ | ○ | ❌ | ○ |
| **Radiance** ✨ | ○ | ○ | ❌ | ✓ | — | ✓ | ○ | ❌ | ○ | ○ |
| **Shadow** 🌑 | ○ | ○ | ✓ | ❌ | ✓ | — | ✓ | ○ | ○ | ○ |
| **Bolt** ⚡ | ○ | ✓ | ❌ | ○ | ○ | ❌ | — | ○ | ✓ | ✓ |
| **Venom** ☠️ | ❌ | ○ | ○ | ○ | ✓ | ○ | ○ | — | ❌ | ✓ |
| **Frost** ❄️ | ❌ | ○ | ○ | ✓ | ○ | ○ | ❌ | ✓ | — | ○ |
| **Impact** 💥 | ✓ | ✓ | ○ | ○ | ○ | ○ | ❌ | ❌ | ○ | — |

**Legend:**
- ✓ = Attacker wins (advantage)
- ❌ = Attacker loses (disadvantage)
- ○ = Neutral (no bonus/penalty)

## Battle Damage Multipliers

### vs Defense Mode (Single Type)
- **Advantage** (✓): ×1.5 ATK
- **Neutral** (○): ×1.0 ATK
- **Disadvantage** (❌): ×0.7 ATK

### vs Attack Mode (Dual Type)
- **Super Advantage** (✓✓): ×2.0 ATK (both types win)
- **Mixed** (✓❌): ×1.0 ATK (one wins, one loses)
- **Neutral Mixed** (✓○ or ❌○): ×1.5 or ×0.7 ATK (same as single advantage/disadvantage)
- **Super Disadvantage** (❌❌): ×0.5 ATK (both types lose)

## Strategic Implications

### Perfect Balance
- Every Combat Style has exactly **2 advantages** and **2 disadvantages**
- **6 neutral matchups** for each style
- No style is inherently stronger or weaker than others

### STAB Opportunities
With 6 Attributes (FIRE, WATER, EARTH, WIND, LIGHT, DARK):
- **6 styles get STAB**: Flame, Torrent, Tremor, Gale, Radiance, Shadow
- **4 specialist styles**: Bolt, Venom, Frost, Impact (no STAB bonus)

### Deck Building Strategy
1. **Pure STAB builds** (Fire/Flame): Maximum power (×2.0 super advantage possible)
2. **Mixed builds** (Fire/Bolt): Flexible, safer matchups
3. **Specialist builds** (Any/Venom): Consistent ×1.5 max, no ×2.0 spikes

## Comparison to Original Guardian Stars

| Aspect | Original (Asymmetric) | New (Perfectly Balanced) |
|--------|----------------------|--------------------------|
| Each defeats | Exactly 2 | Exactly 2 |
| Each loses to | 1-3 (varies) | Exactly 2 |
| Neutral matchups | 5-7 (varies) | Exactly 6 |
| Balance | Slight asymmetry | Perfect symmetry |
| Pluto anomaly | Lost to only 1 | Fixed |
| Neptune/Saturn | Lost to 3 each | Fixed |

## Example Battle Scenarios

### Scenario 1: Pure STAB Attack
```
Attacker: FIRE attribute + Flame style (STAB!)
Defender: WIND attribute (defense mode)

Flame vs Wind → Neutral (×1.0)
But Flame vs WIND is neutral, so no advantage
Result: ×1.0 (no bonus)
```

### Scenario 2: Super Advantage
```
Attacker: WATER attribute + Torrent style (STAB!)
Defender: FIRE attribute + Flame style (attack mode)

Torrent vs FIRE → Advantage (✓)
Torrent vs Flame → Advantage (✓)
Both winning → ×2.0 SUPER ADVANTAGE!
```

### Scenario 3: Super Disadvantage
```
Attacker: FIRE attribute + Flame style (STAB!)
Defender: WATER attribute + Torrent style (attack mode)

Flame vs WATER → Disadvantage (❌)
Flame vs Torrent → Disadvantage (❌)
Both losing → ×0.5 SUPER DISADVANTAGE!
```

### Scenario 4: Specialist Style
```
Attacker: FIRE attribute + Bolt style (no STAB)
Defender: DARK attribute (defense mode)

Bolt vs DARK → Check table... Neutral (○)
Result: ×1.0 (neutral)
```

## Graph Theory Analysis

### Properties
- **Directed Graph**: Each node (style) has edges pointing to 2 others (beats)
- **In-degree = Out-degree = 2**: Perfectly balanced
- **Total Edges**: 20 (10 styles × 2 defeats each)
- **Cycles**: Multiple cycles exist (e.g., Flame→Frost→Gale→Torrent→Flame)

### Symmetry
This is a **circulant tournament** - a special class of balanced digraphs where the structure has rotational symmetry.

## Implementation Notes

### Data Structure
```typescript
const TYPE_MATCHUPS: Record<CombatStyle, { beats: CombatStyle[], losesTo: CombatStyle[] }> = {
  Flame: { beats: ['Frost', 'Venom'], losesTo: ['Torrent', 'Impact'] },
  Torrent: { beats: ['Flame', 'Tremor'], losesTo: ['Gale', 'Bolt'] },
  Tremor: { beats: ['Bolt', 'Radiance'], losesTo: ['Torrent', 'Shadow'] },
  Gale: { beats: ['Torrent', 'Shadow'], losesTo: ['Flame', 'Frost'] },
  Radiance: { beats: ['Shadow', 'Gale'], losesTo: ['Tremor', 'Venom'] },
  Shadow: { beats: ['Radiance', 'Bolt'], losesTo: ['Gale', 'Tremor'] },
  Bolt: { beats: ['Impact', 'Frost'], losesTo: ['Shadow', 'Tremor'] },
  Venom: { beats: ['Radiance', 'Impact'], losesTo: ['Flame', 'Frost'] },
  Frost: { beats: ['Gale', 'Venom'], losesTo: ['Flame', 'Bolt'] },
  Impact: { beats: ['Flame', 'Torrent'], losesTo: ['Bolt', 'Venom'] }
};
```

### Lookup Function
```typescript
function getMultiplier(attackerStyle: CombatStyle, defenderTypes: CombatStyle[]): number {
  const wins = defenderTypes.filter(t => TYPE_MATCHUPS[attackerStyle].beats.includes(t)).length;
  const losses = defenderTypes.filter(t => TYPE_MATCHUPS[attackerStyle].losesTo.includes(t)).length;
  
  if (defenderTypes.length === 1) {
    // vs Defense Mode
    if (wins > 0) return 1.5;
    if (losses > 0) return 0.7;
    return 1.0;
  } else {
    // vs Attack Mode (2 types)
    if (wins === 2) return 2.0; // Super advantage
    if (losses === 2) return 0.5; // Super disadvantage
    if (wins === 1 && losses === 1) return 1.0; // Mixed
    if (wins === 1) return 1.5; // One advantage
    if (losses === 1) return 0.7; // One disadvantage
    return 1.0; // Both neutral
  }
}
```

## Conclusion

This perfectly balanced 10-type system maintains the strategic depth of the original Guardian Star system while ensuring complete fairness - no Combat Style has an inherent advantage over the metagame. Every style has exactly 2 favorable matchups, 2 unfavorable matchups, and 6 neutral matchups.
