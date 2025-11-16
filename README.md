# Forbidden Memories

A clean-room tribute to a certain PS1 card-alchemist classic, built as a mobile-first Progressive Web App.

## Current Status: v0.1.0-MVP

**Live Features:**
- ✅ 722 cards with full database
- ✅ 974 fusion combinations  
- ✅ 8 NPC duelists with unique decks
- ✅ Complete duel system (8000 LP, summons, fusion mechanics)
- ✅ Deck builder (20-card decks)
- ✅ Starchip economy & card shop
- ✅ Campaign mode with progression
- ✅ Card library browser
- ✅ PWA support (offline-ready, installable)
- ✅ LocalStorage save system
- ✅ Background music & settings

---

## Vision Statement
Ship the smallest playable slice that feels like 2000-era fusion maths, but runs in a browser and installs like an app.

Mobile-first UX with 1-v-1 duels, fusion table intact, and starchip economy loop.

---

## Core Loop
1. Build 20-card deck from owned cards  
2. Challenge NPC / PvP → best-of-1 duel  
3. Win → starchips + unlock new card(s)  
4. Spend starchips in shop (rotating singles)  
5. Repeat until you've cracked the fusion meta

---

## Tech Stack

**Frontend:**
- Vite 5 + React 18 + TypeScript 5
- react-router-dom for navigation
- Inline styles (no CSS framework)

**State & Storage:**
- Zustand for state management
- localStorage for persistence

**PWA:**
- vite-plugin-pwa for offline support
- Service worker auto-generation
- Installable on iOS/Android

**Animation & Interaction:**
- @react-spring/web for smooth animations
- @use-gesture/react for gesture handling

---

## Data Model

### Card Structure
```typescript
interface Card {
  id: number;
  name: string;
  type: "Monster" | "Spell" | "Trap";
  // Monster-specific
  atk?: number;
  def?: number;
  attr?: "EARTH" | "WATER" | "FIRE" | "WIND" | "LIGHT" | "DARK";
  race?: "Warrior" | "Spellcaster" | "Dragon" | ...;
  level?: 1..12;
}
```

### Fusion Structure
```typescript
interface Fusion {
  materials: [number, number];  // Card IDs
  result: number;                // Resulting card ID
}
```

### Deck
```typescript
type Deck = number[];  // Array of exactly 20 card IDs
```

### Duel State
```typescript
interface DuelState {
  turn: 0 | 1;
  lp: [number, number];
  hands: Card[][];
  fields: Card[][];
  graves: Card[][];
  phase: "Draw" | "Standby" | "Main" | "Battle" | "End";
}
```

---

## Project Structure

```
src/
  data/
    cards.json        # 722 cards (656 monsters + 30 spells + 36 traps)
    fusions.json      # 974 fusion combinations
    npcs.json         # 8 NPC duelists with fixed decks
  engine/
    duel.ts           # Core duel mechanics & state management
    fusions.ts        # Fusion lookup & validation logic
    ai.ts             # Simple NPC AI
  screens/
    MainMenu.tsx
    CampaignMenuScreen.tsx
    CampaignScreen.tsx
    MapScreen.tsx
    DuelScreen.tsx
    DeckEditScreen.tsx
    ShopScreen.tsx
    LibraryScreen.tsx
    SettingsScreen.tsx
  ui/
    Card.tsx
    DeckBuilder.tsx
    DuelBoard.tsx
    FieldZone.tsx
    SpellTrapZone.tsx
    DraggableCard.tsx
  store/
    saveStore.ts      # Save/load game state
    deckStore.ts      # Deck management
    settingsStore.ts  # User preferences
  utils/
    saveSystem.ts     # LocalStorage utilities
    duelSession.ts    # Duel session management
    musicPlayer.ts    # Background music system
  App.tsx             # Router & app setup
  main.tsx            # Entry point
  types.ts            # TypeScript definitions
```

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/Tompozompo/forbidden-memories.git
cd forbidden-memories

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev

# Build for production
npm run build
# or
pnpm build

# Preview production build
npm run preview
# or
pnpm preview
```

The dev server runs on `http://localhost:5173/forbidden-memories/`

---

## Current Scope

### ✅ Implemented
- 722-card database (expanded from original 150-card plan)
- 974 fusion combinations
- Full 1-v-1 duel rules: 8000 LP, normal summon/set, direct attack, fusion
- 8 NPC duelists with fixed decks
- Starchip wallet & card shop (rotating singles)
- Campaign mode with progression
- Card library browser
- Deck builder (enforced 20-card limit)
- Responsive mobile-first UI
- PWA features (offline, installable)
- LocalStorage persistence
- Background music system
- Settings management

### 🚧 In Progress / Future
- Enhanced card effects (flip effects, equip spells)
- Trap card mechanics
- Advanced AI strategies
- More sophisticated card art
- Expanded animations
- Online multiplayer (WebRTC)
- Card trading system
- Story mode & world map
- Sound effects
- Leaderboard & ranking system

---

## Card Database

The game currently includes **722 cards**:
- **656 Monster Cards** (IDs 1-656)
- **30 Spell Cards** (IDs 657-686)  
- **36 Trap Cards** (IDs 687-722)

**Authenticity:**
- Cards 1-150: 100% accurate to original game
- Cards 151-656: Generated placeholders (realistic stats)
- Spells & Traps: Properly named, effects not yet implemented

See `CARD_DATABASE.md` for complete details and contribution guidelines.

---

## Contributing

Contributions are welcome! Areas that need help:
- Verifying card data for IDs 151-656 against original game
- Implementing spell/trap effects
- Improving AI behavior
- Adding card artwork
- Expanding fusion database
- Bug fixes and performance improvements

---

## Development Notes

### Build Validation
```bash
# TypeScript check
npx tsc --noEmit

# Production build
npm run build

# Build artifacts in dist/
```

### No Linting Setup
- No ESLint or Prettier configured
- Code quality enforced by TypeScript strict mode
- Manual code review recommended

### PWA Features
- Auto-updates on new versions
- Offline-first with service worker
- Cacheable assets (JS, CSS, HTML, images)
- Installable to home screen (iOS/Android)

---

## Browser Support

**Recommended:**
- Chrome/Edge 90+
- Safari 14+ (iOS/iPadOS)
- Firefox 88+

**Mobile:**
- Optimized for 5G mobile devices
- Target load time: <3 seconds
- Touch-friendly UI

---

## License

This is a clean-room tribute project for educational purposes. No official Konami IP or copyrighted card art is included.

---

## Acknowledgments

Inspired by the classic PlayStation 1 game Yu-Gi-Oh! Forbidden Memories. All card data independently researched and implemented.
