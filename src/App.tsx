import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useSaveStore } from './store/saveStore';
import { useSettingsStore } from './store/settingsStore';
import { musicPlayer } from './utils/musicPlayer';
import { useSpring, animated, config } from '@react-spring/web';
import MainMenu from './screens/MainMenu';
import CampaignMenuScreen from './screens/CampaignMenuScreen';
import CampaignScreen from './screens/CampaignScreen';
import LibraryScreen from './screens/LibraryScreen';
import MapScreen from './screens/MapScreen';
import DuelScreen from './screens/DuelScreen';
import DeckEditScreen from './screens/DeckEditScreen';
import ShopScreen from './screens/ShopScreen';
import SettingsScreen from './screens/SettingsScreen';
import CardPackOpeningScreenWrapper from './screens/CardPackOpeningScreenWrapper';

function App() {
  const { loadGame } = useSaveStore();
  const { musicEnabled, musicVolume } = useSettingsStore();
  const location = useLocation();
  
  // Smooth screen transitions
  const transitions = useSpring({
    from: { opacity: 0, transform: 'scale(0.98)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: config.gentle,
    reset: true,
    key: location.pathname,
  });
  
  // Load data from localStorage on mount
  useEffect(() => {
    loadGame();
  }, [loadGame]);

  // Handle music playback based on settings
  useEffect(() => {
    const handleUserInteraction = () => {
      if (musicEnabled && !musicPlayer.getIsPlaying()) {
        musicPlayer.start(musicVolume);
      }
    };

    // Start music on first user interaction (browser autoplay policy)
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []); // Only run once on mount

  // Update music state when settings change
  useEffect(() => {
    if (musicEnabled) {
      if (!musicPlayer.getIsPlaying()) {
        musicPlayer.start(musicVolume);
      } else {
        musicPlayer.setVolume(musicVolume);
      }
    } else {
      musicPlayer.stop();
    }
  }, [musicEnabled, musicVolume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      musicPlayer.dispose();
    };
  }, []);
  
  return (
    <animated.div style={transitions}>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/card-opening" element={<CardPackOpeningScreenWrapper />} />
        <Route path="/campaign-menu" element={<CampaignMenuScreen />} />
        <Route path="/campaign" element={<CampaignScreen />} />
        <Route path="/library" element={<LibraryScreen />} />
        <Route path="/map" element={<MapScreen />} />
        <Route path="/duel/:id" element={<DuelScreen />} />
        <Route path="/deck" element={<DeckEditScreen />} />
        <Route path="/shop" element={<ShopScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>
    </animated.div>
  );
}

export default App;
