import { createContext, useContext } from 'react';
import type { ThemeMode } from '~/utils/storage';

export interface ThemeModeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: 'system',
  setMode: () => {}
});

export const useThemeMode = () => useContext(ThemeModeContext);
