import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'mithilaArt_theme';
const DARK_PALETTE_KEY = 'mithilaArt_darkPalette';
const LIGHT_PALETTE_KEY = 'mithilaArt_lightPalette';

const THEME_CLASSES = [
  'theme-dark-gold',
  'theme-dark-purple',
  'theme-dark-emerald',
  'theme-dark-sapphire',
  'theme-dark-ruby',
  'theme-dark-ivory',
  'theme-light-classic',
  'theme-light-parchment',
  'theme-light-ivory',
  'theme-light-sandstone'
];

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const [darkPalette, setDarkPalette] = useState(() => {
    try {
      return localStorage.getItem(DARK_PALETTE_KEY) || 'gold';
    } catch {
      return 'gold';
    }
  });

  const [lightPalette, setLightPalette] = useState(() => {
    try {
      return localStorage.getItem(LIGHT_PALETTE_KEY) || 'classic';
    } catch {
      return 'classic';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove current classes
    root.classList.remove('dark', ...THEME_CLASSES);

    if (isDark) {
      root.classList.add('dark');
      root.classList.add(`theme-dark-${darkPalette}`);
    } else {
      root.classList.add(`theme-light-${lightPalette}`);
    }

    try {
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
      localStorage.setItem(DARK_PALETTE_KEY, darkPalette);
      localStorage.setItem(LIGHT_PALETTE_KEY, lightPalette);
    } catch {}
  }, [isDark, darkPalette, lightPalette]);

  const toggleTheme = useCallback(() => setIsDark((prev) => !prev), []);

  const value = useMemo(() => ({
    isDark,
    toggleTheme,
    darkPalette,
    setDarkPalette,
    lightPalette,
    setLightPalette,
    activePalette: isDark ? darkPalette : lightPalette
  }), [isDark, toggleTheme, darkPalette, lightPalette]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within <ThemeProvider>');
  return context;
}

export default ThemeContext;
