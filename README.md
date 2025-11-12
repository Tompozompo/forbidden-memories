# forbidden-memories

FM-Clone Master Spec  
v0.1 “Phone-First Draft” – 2025-11-11

A clean-room tribute to a certain PS1 card-alchemist classic. Working title: “Memories Forbidden” (MF).

---

1. Vision Statement
Ship the smallest playable slice that feels like 2000-era fusion maths, but runs in a browser and installs like an app.

Target: 150 cards, 1-v-1 duels, fusion table intact, starchip economy loop, mobile-first UX.

---

2. Core Loop
1. Build 20-card deck from owned cards  
2. Challenge NPC / PvP → best-of-1 duel  
3. Win → starchips + unlock new card(s)  
4. Spend starchips in slot-machine booster or direct single-card shop  
5. Repeat until you’ve cracked the fusion meta

---

3. MVP Scope (cut nothing below)
- 150 scrubbed cards (no Konami IP)  
- Full 1-v-1 duel rules: 8000 LP, normal summon/set, flip effects, equip, direct attack, fusion via hand + field  
- Exact PS1 fusion table (722 combos) encoded as JSON  
- 8 NPC duelists with fixed 20-card decks and cheesy personality text  
- Starchip wallet & simple card shop (5 rotating singles)  
- Responsive web app that PWA-installs on iOS/Android  
- Local-only storage (no backend yet)  

---

4. Out-of-Scope for MVP
Story mode, world map, 3-D battle scenes, online multiplayer, trading, sound, card art > 1 per card, animations > 0.3 s.

---

5. Tech Stack
- Frontend: Vite + React + TypeScript + Tailwind  
- PWA: Vite-PWA plugin → offline, icon, splash  
- State: Zustand (tiny, phone-edit friendly)  
- Storage: localStorage + JSON serialization  
- Router: react-router-dom (main menu → map → duel flow)  
- Repo: GitHub private, README = this doc  
- AI pair: Claude 3.5 Sonnet (mobile prompt via claude.ai)

---

6. Data Model (pseudo-json)

```json
Card {
  id: number,
  name: string,
  atk: number,
  def: number,
  type: "Spell" | "Trap" | "Monster",
  attr?: "EARTH" | "WATER" | ... ,
  race?: "Warrior" | "Spellcaster" | ...,
  level?: 1..12,
  text: string,
  fusion?: { materialIds: number[], resultId: number }[]
}

Deck = number[]  // card ids, exactly 20

DuelState {
  turn: 0 | 1,
  lp: [number, number],
  hands: Card[][],
  fields: Card[][],
  graves: Card[][],
  phase: "Draw" | "Standby" | "Main" | "Battle" | "End"
}
```

---

7. File Tree (src/)

```
src/
  data/
    cards.json        // 150 cards
    fusions.json      // 722 entries
    npcs.json         // 8 duelists
  engine/
    duel.ts           // reducer-style state machine
    fusions.ts        // lookup & validation
  ui/
    App.tsx
    DeckBuilder.tsx
    DuelBoard.tsx
    Shop.tsx
  store/
    gameStore.ts
  main.tsx
```

---

8. Acceptance Criteria
1. Clone repo, `pnpm i`, `pnpm dev` → loads on localhost:5173 in <3 s on 5G  
2. PWA installs to home screen, opens offline  
3. New player starts with 3 random cards + 50 starchips  
4. Can build legal 20-card deck (enforced UI)  
5. Can duel first NPC; win awards 10-30 starchips & 1 random card  
6. Fusion test-case: “Monster A + Monster B → Monster C” works exactly once per valid pair  
7. No console errors on iOS Safari / Chrome Android

---

9. Future Tickets (just headlines)
- Online lobby (WebRTC)  
- 700-card expansion  
- Card art gen pipeline (SDXL)  
- Animated fusion summon FX  
- Leaderboard & ELO  
- Community card editor  
- Soundtrack AI generation

---

10. Phone-Edit Checklist
- Create GitHub repo → paste this README 
- Generate 150-card JSON (prompt Claude)  
- Generate fusion JSON (prompt Claude)  
- Scaffold Vite-React-PWA template  
- Build DeckBuilder UI  
- Build DuelBoard UI  
- Wire duel engine reducer  
- Add NPC data & simple AI  
- Add starchip shop  
- PWA icons & manifest  
- Playtest on subway → ship v0.1
