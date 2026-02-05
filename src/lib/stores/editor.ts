import { writable } from 'svelte/store';
import { EditorState } from '../types/editor';
import { settingsStore } from './settings';
import { EditorStorage } from '../utils/storage';

const STORAGE_KEY = 'advanced-notepad-content';

function createEditorStore() {
  const { subscribe, set, update } = writable<EditorState>({
    content: '',
    cursorPosition: 0,
    selection: { start: 0, end: 0 },
  });

  const storage = new EditorStorage();
  let saveTimeout: ReturnType<typeof setTimeout> | null = null;

  return {
    subscribe,
    set,
    update,
    async load() {
      try {
        const content = await storage.load();
        set({ content, cursorPosition: 0, selection: { start: 0, end: 0 } });
      } catch (error) {
        console.error('加载编辑器内容失败:', error);
      }
    },
    async save() {
      try {
        let current: EditorState;
        subscribe((value) => {
          current = value;
        })();
        await storage.save(current.content);
      } catch (error) {
        console.error('保存编辑器内容失败:', error);
      }
    },
    scheduleSave() {
      settingsStore.subscribe((settings) => {
        if (!settings.autoSave) return;

        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          this.save();
        }, settings.autoSaveInterval);
      })();
    },
  };
}

export const editorStore = createEditorStore();
