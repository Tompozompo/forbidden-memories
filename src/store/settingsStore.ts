import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  // Checkered pattern colors for the duel board
  checkerColor1: string;
  checkerColor2: string;
  
  // Music settings
  musicEnabled: boolean;
  musicVolume: number; // 0 to 1
  
  // Actions to update settings
  setCheckerColor1: (color: string) => void;
  setCheckerColor2: (color: string) => void;
  setMusicEnabled: (enabled: boolean) => void;
  setMusicVolume: (volume: number) => void;
  resetToDefaults: () => void;
}

// Default colors inspired by the PS1 game
const DEFAULT_COLOR_1 = '#2a4a2a';
const DEFAULT_COLOR_2 = '#1a3a1a';

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      checkerColor1: DEFAULT_COLOR_1,
      checkerColor2: DEFAULT_COLOR_2,
      musicEnabled: true,
      musicVolume: 0.5,
      
      setCheckerColor1: (color: string) => set({ checkerColor1: color }),
      setCheckerColor2: (color: string) => set({ checkerColor2: color }),
      setMusicEnabled: (enabled: boolean) => set({ musicEnabled: enabled }),
      setMusicVolume: (volume: number) => set({ musicVolume: Math.max(0, Math.min(1, volume)) }),
      resetToDefaults: () => set({ 
        checkerColor1: DEFAULT_COLOR_1, 
        checkerColor2: DEFAULT_COLOR_2,
        musicEnabled: true,
        musicVolume: 0.5
      }),
    }),
    {
      name: 'fm-settings',
    }
  )
);
