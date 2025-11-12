# GitHub Copilot Instructions for Forbidden Memories

## Project Overview

This is a clean-room tribute to a PS1 card-alchemist game, built as a mobile-first Progressive Web App (PWA). The project aims to recreate the fusion-based card dueling experience in a modern web browser.

## Tech Stack

- **Frontend**: React 18.2 with TypeScript
- **Build Tool**: Vite 5
- **State Management**: Zustand (lightweight state management)
- **Animations**: @react-spring/web and @use-gesture/react
- **Package Manager**: pnpm (fallback to npm if unavailable)

## Project Structure

```
src/
  data/           # JSON data files (cards, fusions, NPCs)
  engine/         # Core game logic (duel system, AI, fusions)
  ui/             # React components for UI
  store/          # Zustand state stores
  types.ts        # TypeScript type definitions
  App.tsx         # Main application component
  main.tsx        # Application entry point
```

## Coding Conventions

### TypeScript
- **Strict mode enabled**: All code must pass TypeScript strict checks
- **Explicit types**: Prefer explicit type annotations for function parameters and return types
- **Type imports**: Use `type` keyword for type-only imports: `import type { Card } from './types'`
- **Interface naming**: Use PascalCase for interfaces (e.g., `Card`, `DeckStore`)

### React
- **Functional components**: Use functional components with hooks (no class components)
- **TypeScript with React**: Use proper typing for props and state
- **State management**: Use Zustand stores for shared state, `useState` for local component state
- **Effects**: Use `useEffect` with proper dependency arrays

### State Management (Zustand)
- Store files live in `src/store/`
- Export custom hooks with `use` prefix (e.g., `useDeckStore`)
- Use TypeScript interfaces to define store shape
- Include both state and actions in the store interface

### Styling
- Use inline styles for now (no CSS-in-JS library or Tailwind configured yet)
- Style objects should use camelCase properties
- Keep styling simple and mobile-first

### File Naming
- React components: PascalCase (e.g., `DeckBuilder.tsx`)
- Utilities and stores: camelCase (e.g., `deckStore.ts`)
- Type files: lowercase with descriptive names (e.g., `types.ts`)

## Data Model

### Core Types
```typescript
interface Card {
  id: number;
  name: string;
  atk?: number;
  def?: number;
}
```

### Data Files
- **cards.json**: Array of 150+ card definitions
- **fusions.json**: Array of fusion recipes (722 combinations)
- **npcs.json**: Array of NPC duelists with fixed decks

All data files are imported as static JSON modules.

## Build & Development

### Commands
- `npm run dev` or `pnpm dev`: Start development server on localhost:5173
- `npm run build` or `pnpm build`: TypeScript check + Vite production build
- `npm run preview` or `pnpm preview`: Preview production build locally
- `npm run github-run` or `pnpm github-run`: Dev server with network access

### Build Process
1. TypeScript compilation check (using `tsc`)
2. Vite bundling and optimization
3. Output to `dist/` directory

### No Linting/Testing Infrastructure
- No ESLint or Prettier configured
- No test framework set up
- Code quality relies on TypeScript strict mode

## Key Architectural Patterns

### Local Storage Persistence
- Deck state persists to `localStorage`
- Keys: `currentDeck`, `ownedCards`
- Always wrap localStorage access in try/catch with fallbacks

### Card IDs
- Cards are referenced by numeric IDs throughout the application
- Convert between IDs and Card objects using `.find()` on the cards array
- Always filter out undefined results when mapping IDs to cards

### MVP Scope
- 150 cards, 722 fusion combinations
- 1v1 duels with 8000 LP
- 8 NPC opponents
- Starchip economy
- PWA with offline support (planned)

## Dependencies

### Production
- `react`, `react-dom`: UI framework
- `zustand`: State management
- `@react-spring/web`: Animation library
- `@use-gesture/react`: Gesture handling

### Development
- `typescript`: Language and type checking
- `vite`: Build tool and dev server
- `@vitejs/plugin-react`: React support for Vite
- `@types/react`, `@types/react-dom`: React type definitions

## Future Considerations
- PWA features (Vite-PWA plugin planned)
- Online multiplayer (WebRTC planned)
- Expanded card library (700+ cards planned)
- Test infrastructure may be added later

## Important Notes
- Mobile-first design: Consider touch interactions and small screen sizes
- Performance matters: Target works on 5G mobile devices
- Keep bundle size small: App should load in <3 seconds
- No backend yet: All state is client-side only
