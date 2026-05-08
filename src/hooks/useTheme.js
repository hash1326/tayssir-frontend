import { useState, useEffect } from 'react';

/**
 * Custom hook to manage global dark mode state.
 * Uses Tailwind's native "class" strategy by toggling the '.dark' class on the HTML root.
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      // Restore user preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      // Fallback to system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    // We add BOTH 'dark' (for Tailwind) and 'dark-mode' (for legacy CSS compatibility)
    if (isDark) {
      root.classList.add('dark', 'dark-mode');
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('platform-dark-mode', 'true');
    } else {
      root.classList.remove('dark', 'dark-mode');
      localStorage.setItem('theme', 'light');
      localStorage.setItem('platform-dark-mode', 'false');
    }
    
    // Smooth transition class appended universally
    root.classList.add('transition-colors', 'duration-300');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return { isDark, toggleTheme };
}
