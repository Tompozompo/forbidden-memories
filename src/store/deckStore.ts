import { create } from 'zustand';

interface DeckStore {
  currentDeck: number[];
  ownedCards: number[];
  setCurrentDeck: (deck: number[]) => void;
  setOwnedCards: (cards: number[]) => void;
  loadFromLocalStorage: () => void;
  saveDeckToLocalStorage: () => void;
}

export const useDeckStore = create<DeckStore>((set, get) => ({
  currentDeck: [],
  ownedCards: [],
  
  setCurrentDeck: (deck: number[]) => set({ currentDeck: deck }),
  
  setOwnedCards: (cards: number[]) => void set({ ownedCards: cards }),
  
  loadFromLocalStorage: () => {
    try {
      // Load owned cards (fallback to first 20 cards if not set)
      const storedOwned = localStorage.getItem('ownedCards');
      const ownedCards = storedOwned 
        ? JSON.parse(storedOwned) 
        : Array.from({ length: 20 }, (_, i) => i + 1);
      
      // Load current deck
      const storedDeck = localStorage.getItem('currentDeck');
      const currentDeck = storedDeck ? JSON.parse(storedDeck) : [];
      
      set({ ownedCards, currentDeck });
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      // Fallback to first 20 cards
      set({ 
        ownedCards: Array.from({ length: 20 }, (_, i) => i + 1),
        currentDeck: []
      });
    }
  },
  
  saveDeckToLocalStorage: () => {
    try {
      const { currentDeck } = get();
      localStorage.setItem('currentDeck', JSON.stringify(currentDeck));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
}));
