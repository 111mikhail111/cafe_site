import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('system'); // 'light', 'dark' или 'system'

  useEffect(() => {
    // Применяем тему при загрузке и изменении
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (selectedTheme) => {
    const root = document.documentElement;
    
    if (selectedTheme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      selectedTheme = systemDark ? 'dark' : 'light';
    }

    root.style.setProperty('--background', selectedTheme === 'dark' ? '#0a0a0a' : '#ffffff');
    root.style.setProperty('--foreground', selectedTheme === 'dark' ? '#ededed' : '#171717');
    root.style.setProperty('--dark', selectedTheme === 'dark' ? '#b9c7a8' : '#485638');
    root.style.setProperty('--darker', selectedTheme === 'dark' ? '#d7dfce' : '#293120');
    root.style.setProperty('--light', selectedTheme === 'dark' ? '#485638' : '#b9c7a8');
    root.style.setProperty('--lighten', selectedTheme === 'dark' ? '#293120' : '#d7dfce');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}