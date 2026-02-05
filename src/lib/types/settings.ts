export interface Settings {
  opacity: number;
  fontSize: number;
  alwaysOnTop: boolean;
  theme: 'light' | 'dark';
  autoSave: boolean;
  autoSaveInterval: number;
}

export const DEFAULT_SETTINGS: Settings = {
  opacity: 1.0,
  fontSize: 16,
  alwaysOnTop: false,
  theme: 'light',
  autoSave: true,
  autoSaveInterval: 500,
};
