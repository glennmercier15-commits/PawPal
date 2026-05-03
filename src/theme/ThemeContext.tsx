import React, { createContext, useContext, useState, useEffect } from 'react';

const LIGHT = {
  background: '#FFF9FB', card: '#FFE4F0', text: '#5D3A6B',
  textLight: '#B39DDB', border: '#F5D0E8',
};

const DARK = {
  background: '#1A0A22', card: '#2D1040', text: '#F3E5F5',
  textLight: '#CE93D8', border: '#4A1060',
};

interface ThemeContextType {
  isDark: boolean;
  theme: typeof LIGHT;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('pawpal_dark_mode');
    if (stored === 'true') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('pawpal_dark_mode', String(next));
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, theme: isDark ? DARK : LIGHT, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
