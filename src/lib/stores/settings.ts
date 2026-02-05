import { writable, derived } from 'svelte/store';
import { Settings, DEFAULT_SETTINGS } from '../types/settings';
import type { Theme } from './theme';

const STORAGE_KEY = 'advanced-notepad-settings';

function createSettingsStore() {
  const { subscribe, set, update } = writable<Settings>(DEFAULT_SETTINGS);

  return {
    subscribe,
    set,
    update,
    async load() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          set({ ...DEFAULT_SETTINGS, ...parsed });
        }
      } catch (error) {
        console.error('加载设置失败:', error);
      }
    },
    async save() {
      try {
        let current: Settings;
        subscribe((value) => {
          current = value;
        })();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      } catch (error) {
        console.error('保存设置失败:', error);
      }
    },
  };
}

export const settingsStore = createSettingsStore();
