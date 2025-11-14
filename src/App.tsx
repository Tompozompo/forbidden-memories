import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSaveStore } from './store/saveStore';
import MainMenu from './screens/MainMenu';
import CampaignMenuScreen from './screens/CampaignMenuScreen';
import CampaignScreen from './screens/CampaignScreen';
import LibraryScreen from './screens/LibraryScreen';
import MapScreen from './screens/MapScreen';
import DuelScreen from './screens/DuelScreen';
import DeckEditScreen from './screens/DeckEditScreen';
import ShopScreen from './screens/ShopScreen';
import SettingsScreen from './screens/SettingsScreen';

function App() {
  const { loadGame } = useSaveStore();
  
  // Load data from localStorage on mount
  useEffect(() => {
    loadGame();
  }, [loadGame]);
  
  return (
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/campaign-menu" element={<CampaignMenuScreen />} />
      <Route path="/campaign" element={<CampaignScreen />} />
      <Route path="/library" element={<LibraryScreen />} />
      <Route path="/map" element={<MapScreen />} />
      <Route path="/duel/:id" element={<DuelScreen />} />
      <Route path="/deck" element={<DeckEditScreen />} />
      <Route path="/shop" element={<ShopScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
    </Routes>
  );
}

export default App;
