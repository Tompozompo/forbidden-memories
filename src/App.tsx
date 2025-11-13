import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDeckStore } from './store/deckStore';
import { useSaveStore } from './store/saveStore';
import MainMenu from './screens/MainMenu';
import MapScreen from './screens/MapScreen';
import DuelScreen from './screens/DuelScreen';
import DeckEditScreen from './screens/DeckEditScreen';
import ShopScreen from './screens/ShopScreen';

function App() {
  const { loadFromLocalStorage } = useDeckStore();
  const { loadGame } = useSaveStore();
  
  // Load data from localStorage on mount
  useEffect(() => {
    loadFromLocalStorage();
    loadGame();
  }, [loadFromLocalStorage, loadGame]);
  
  return (
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/map" element={<MapScreen />} />
      <Route path="/duel/:id" element={<DuelScreen />} />
      <Route path="/deck" element={<DeckEditScreen />} />
      <Route path="/shop" element={<ShopScreen />} />
    </Routes>
  );
}

export default App;
