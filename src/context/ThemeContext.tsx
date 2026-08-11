import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, ThemeColors } from '@/theme/colors';
import { storage } from '@/services/storage';

interface ThemeContextValue {
  mode: 'light' | 'dark';
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<'light' | 'dark'>(systemScheme === 'dark' ? 'dark' : 'light');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await storage.getTheme();
      if (saved) setMode(saved);
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (hydrated) {
      storage.setTheme(mode).catch(() => undefined);
    }
  }, [mode, hydrated]);

  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  const colors = mode === 'light' ? lightColors : darkColors;

  const value = useMemo(() => ({ mode, colors, toggleTheme }), [mode, colors]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
