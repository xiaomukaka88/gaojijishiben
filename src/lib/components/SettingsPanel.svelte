<script lang="ts">
  import { settingsStore } from '../stores/settings';
  import { themeStore, lightTheme, darkTheme } from '../stores/theme';
  import { invoke } from '@tauri-apps/api/core';

  export let showSettings: boolean = false;

  function handleThemeChange(value: 'light' | 'dark') {
    const theme = value === 'dark' ? darkTheme : lightTheme;
    themeStore.set(theme);
    themeStore.applyTheme(theme);
    themeStore.save();
  }

  async function handleFontSizeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const fontSize = parseInt(input.value);
    settingsStore.update((s) => ({ ...s, fontSize }));
    settingsStore.save();
  }

  async function handleOpacityChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const opacity = parseFloat(input.value);
    settingsStore.update((s) => ({ ...s, opacity }));
    settingsStore.save();
    
    try {
      await invoke('set_window_opacity', { opacity });
    } catch (error) {
      console.log('窗口命令不可用 (开发模式)');
    }
  }

  async function handleAlwaysOnTopChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const alwaysOnTop = checkbox.checked;
    settingsStore.update((s) => ({ ...s, alwaysOnTop }));
    settingsStore.save();
    
    try {
      await invoke('set_window_always_on_top', { alwaysOnTop });
    } catch (error) {
      console.log('窗口命令不可用 (开发模式)');
    }
  }

  function handleReset() {
    settingsStore.set({
      opacity: 1.0,
      fontSize: 16,
      alwaysOnTop: false,
      theme: 'light',
      autoSave: true,
      autoSaveInterval: 500,
    });
    settingsStore.save();
    
    themeStore.set(lightTheme);
    themeStore.applyTheme(lightTheme);
    themeStore.save();
  }
</script>

{#if showSettings}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" on:click={(e) => e.target === e.currentTarget && (showSettings = false)}>
    <div class="bg-[var(--surface-color)] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" on:click|stopPropagation>
      <div class="bg-gradient-to-r from-[var(--primary-color)] to-blue-600 px-6 py-4 flex items-center justify-between">
        <h2 class="text-xl font-bold text-white">设置</h2>
        <button 
          on:click={() => (showSettings = false)}
          class="text-white/80 hover:text-white transition-colors text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        <!-- 主题设置 -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">🎨</span>
              <div>
                <h3 class="font-semibold">主题模式</h3>
                <p class="text-sm text-[var(--secondary-color)]">选择界面配色</p>
              </div>
            </div>
            <div class="flex bg-[var(--bg-color)] rounded-lg p-1">
              <button
                on:click={() => handleThemeChange('light')}
                class="px-4 py-2 rounded-md text-sm font-medium transition-all {$themeStore.name === 'light' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'text-[var(--secondary-color)] hover:text-[var(--foreground)]'}"
              >
                ☀️ 浅色
              </button>
              <button
                on:click={() => handleThemeChange('dark')}
                class="px-4 py-2 rounded-md text-sm font-medium transition-all {$themeStore.name === 'dark' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'text-[var(--secondary-color)] hover:text-[var(--foreground)]'}"
              >
                🌙 深色
              </button>
            </div>
          </div>
        </div>

        <div class="border-t border-[var(--border-color)]"></div>

        <!-- 字体大小 -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">🔤</span>
              <div>
                <h3 class="font-semibold">字体大小</h3>
                <p class="text-sm text-[var(--secondary-color)]">调整文字显示大小</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-mono bg-[var(--bg-color)] px-3 py-1 rounded-md" style="min-width: 60px; text-align: center;">
                {$settingsStore.fontSize}px
              </span>
            </div>
          </div>
          <div class="flex items-center gap-4 pl-11">
            <span class="text-xs text-[var(--secondary-color)]">12px</span>
            <input
              type="range"
              min="12"
              max="48"
              step="1"
              value={$settingsStore.fontSize}
              on:input={handleFontSizeChange}
              class="flex-1 h-2 bg-[var(--bg-color)] rounded-lg appearance-none cursor-pointer accent-[var(--primary-color)]"
            />
            <span class="text-xs text-[var(--secondary-color)]">48px</span>
          </div>
          <!-- 字体预览 -->
          <div class="pl-11 pt-2">
            <div class="bg-[var(--bg-color)] rounded-lg p-3 border border-[var(--border-color)]" style="font-size: {$settingsStore.fontSize}px;">
              字体预览示例
            </div>
          </div>
        </div>

        <div class="border-t border-[var(--border-color)]"></div>

        <!-- 窗口透明度 -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">👁️</span>
              <div>
                <h3 class="font-semibold">窗口透明度</h3>
                <p class="text-sm text-[var(--secondary-color)]">调整窗口透明程度</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-mono bg-[var(--bg-color)] px-3 py-1 rounded-md" style="min-width: 60px; text-align: center;">
                {Math.round($settingsStore.opacity * 100)}%
              </span>
            </div>
          </div>
          <div class="flex items-center gap-4 pl-11">
            <span class="text-xs text-[var(--secondary-color)]">20%</span>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={$settingsStore.opacity}
              on:input={handleOpacityChange}
              class="flex-1 h-2 bg-[var(--bg-color)] rounded-lg appearance-none cursor-pointer accent-[var(--primary-color)]"
            />
            <span class="text-xs text-[var(--secondary-color)]">100%</span>
          </div>
        </div>

        <div class="border-t border-[var(--border-color)]"></div>

        <!-- 置顶显示 -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">📌</span>
              <div>
                <h3 class="font-semibold">置顶显示</h3>
                <p class="text-sm text-[var(--secondary-color)]">窗口始终显示在最上层</p>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={$settingsStore.alwaysOnTop}
                on:change={handleAlwaysOnTopChange}
                class="sr-only peer"
              />
              <div class="w-14 h-7 bg-[var(--bg-color)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--secondary-color)] after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[var(--primary-color)] peer-checked:after:bg-white peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="bg-[var(--bg-color)] px-6 py-4 flex items-center justify-between">
        <button
          on:click={handleReset}
          class="text-sm text-[var(--secondary-color)] hover:text-[var(--foreground)] transition-colors flex items-center gap-2"
        >
          🔄 重置默认
        </button>
        <button
          on:click={() => (showSettings = false)}
          class="px-6 py-2.5 bg-[var(--primary-color)] text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          完成
        </button>
      </div>
    </div>
  </div>
{/if}
