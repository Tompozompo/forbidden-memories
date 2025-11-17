import { create } from 'zustand';
import { loadSave, saveSave, resetSave, type GameSave } from '../utils/saveSystem';

interface SaveStore extends GameSave {
  loadGame: () => void;
  saveGame: (patch: Partial<GameSave>) => void;
  resetGame: () => void;
  addStarchips: (amount: number) => void;
  addBeatenId: (id: number) => void;
  addOwnedCard: (cardId: number) => void;
  unlockAllCards: () => void;
  unlockAllDuelists: () => void;
}

export const useSaveStore = create<SaveStore>((set, get) => ({
  // Initial state from save system
  ...loadSave(),
  
  loadGame: () => {
    const save = loadSave();
    set(save);
  },
  
  saveGame: (patch: Partial<GameSave>) => {
    set(patch);
    saveSave(patch);
  },
  
  resetGame: () => {
    resetSave();
    const save = loadSave();
    set(save);
  },
  
  addStarchips: (amount: number) => {
    const { starchips } = get();
    const newAmount = starchips + amount;
    set({ starchips: newAmount });
    saveSave({ starchips: newAmount });
  },
  
  addBeatenId: (id: number) => {
    const { beatenIds } = get();
    if (!beatenIds.includes(id)) {
      const newBeatenIds = [...beatenIds, id];
      set({ beatenIds: newBeatenIds });
      saveSave({ beatenIds: newBeatenIds });
    }
  },
  
  addOwnedCard: (cardId: number) => {
    const { ownedCards } = get();
    if (!ownedCards.includes(cardId)) {
      const newOwnedCards = [...ownedCards, cardId];
      set({ ownedCards: newOwnedCards });
      saveSave({ ownedCards: newOwnedCards });
    }
  },
  
  unlockAllCards: () => {
    // Unlock all cards from 1 to 722
    const allCards = Array.from({ length: 722 }, (_, i) => i + 1);
    set({ ownedCards: allCards });
    saveSave({ ownedCards: allCards });
  },
  
  unlockAllDuelists: () => {
    // Unlock all duelists (NPCs) from 1 to 25
    const allDuelists = Array.from({ length: 25 }, (_, i) => i + 1);
    set({ beatenIds: allDuelists });
    saveSave({ beatenIds: allDuelists });
  },
}));
