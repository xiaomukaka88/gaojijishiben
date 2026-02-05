import { writable } from 'svelte/store';
import { settingsStore } from './settings';

export interface Theme {
  name: 'light' | 'dark';
  colors: {
    background: string;
    foreground: string;
    surface: string;
    border: string;
    primary: string;
    secondary: string;
  };
}

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: '#ffffff',
    foreground: '#000000',
    surface: '#f5f5f5',
    border: '#e0e0e0',
    primary: '#3b82f6',
    secondary: '#6b7280',
  },
};

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: '#1a1a1a',
    foreground: '#ffffff',
    surface: '#2d2d2d',
    border: '#404040',
    primary: '#60a5fa',
    secondary: '#9ca3af',
  },
};

const STORAGE_KEY = 'advanced-notepad-theme';

function createThemeStore() {
  const { subscribe, set, update } = writable<Theme>(lightTheme);

  return {
    subscribe,
    set,
    update,
    async load() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          set(parsed.name === 'dark' ? darkTheme : lightTheme);
        }
      } catch (error) {
        console.error('加载主题失败:', error);
      }
    },
    async save() {
      try {
        let current: Theme;
        subscribe((value) => {
          current = value;
        })();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      } catch (error) {
        console.error('保存主题失败:', error);
      }
    },
    toggle() {
      update((current) => {
        const newTheme = current.name === 'light' ? darkTheme : lightTheme;
        this.applyTheme(newTheme);
        return newTheme;
      });
    },
    applyTheme(theme: Theme) {
      const root = document.documentElement;
      if (theme.name === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      document.documentElement.style.setProperty('--bg-color', theme.colors.background);
      document.documentElement.style.setProperty('--fg-color', theme.colors.foreground);
      document.documentElement.style.setProperty('--surface-color', theme.colors.surface);
      document.documentElement.style.setProperty('--border-color', theme.colors.border);
      document.documentElement.style.setProperty('--primary-color', theme.colors.primary);
      document.documentElement.style.setProperty('--secondary-color', theme.colors.secondary);
    },
  };
}

export const themeStore = createThemeStore();
