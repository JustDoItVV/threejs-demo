'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type ColorMode = 'light' | 'dark';

interface ColorModeContextType {
  colorMode: ColorMode;
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  // Start with undefined to avoid hydration mismatch
  const [colorMode, setColorMode] = useState<ColorMode | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const systemPreference = mediaQuery.matches ? 'dark' : 'light';

    // Check localStorage
    const stored = localStorage.getItem('chakra-ui-color-mode') as ColorMode | null;
    const initial = stored || systemPreference;

    setColorMode(initial);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(initial);

    // Listen for system preference changes
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('chakra-ui-color-mode')) {
        const newMode = e.matches ? 'dark' : 'light';
        setColorMode(newMode);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newMode);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleColorMode = () => {
    if (!colorMode) return;

    const newMode = colorMode === 'light' ? 'dark' : 'light';
    setColorMode(newMode);
    localStorage.setItem('chakra-ui-color-mode', newMode);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newMode);
  };

  // Use 'light' as fallback during SSR
  const effectiveColorMode = colorMode || 'light';

  return (
    <ColorModeContext.Provider value={{ colorMode: effectiveColorMode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  const context = useContext(ColorModeContext);
  if (context === undefined) {
    throw new Error('useColorMode must be used within a ColorModeProvider');
  }
  return context;
}
