<script lang="ts">
  import { settingsStore } from '../stores/settings';
  import { themeStore } from '../stores/theme';

  function handleToggleTheme() {
    themeStore.toggle();
    themeStore.save();
  }

  function handleToggleAlwaysOnTop() {
    settingsStore.update((s) => ({
      ...s,
      alwaysOnTop: !s.alwaysOnTop
    }));
    settingsStore.save();
  }

  function handleFontSizeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const fontSize = parseInt(input.value);
    settingsStore.update((s) => ({ ...s, fontSize }));
    settingsStore.save();
  }

  function handleOpacityChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const opacity = parseFloat(input.value);
    settingsStore.update((s) => ({ ...s, opacity }));
    settingsStore.save();
  }
</script>

<div class="flex items-center justify-between px-4 py-2 bg-[var(--surface-color)] border-b border-[var(--border-color)] gap-4">
  <div class="flex items-center gap-2">
    <div class="w-8 h-8 bg-gradient-to-br from-[var(--primary-color)] to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
      记
    </div>
    <span class="font-bold text-base whitespace-nowrap">高级记事本</span>
  </div>

  <div class="flex items-center gap-2 flex-1 justify-center">
    <!-- 字体大小 -->
    <div class="flex items-center gap-2 bg-[var(--bg-color)] rounded-lg px-3 py-1.5">
      <span class="text-sm" title="字体大小">🔤</span>
      <span class="text-xs font-mono min-w-[30px] text-center">{$settingsStore.fontSize}</span>
      <input
        type="range"
        min="12"
        max="48"
        step="1"
        value={$settingsStore.fontSize}
        on:input={handleFontSizeChange}
        class="w-20 h-1.5 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-[var(--primary-color)]"
      />
    </div>

    <!-- 透明度 -->
    <div class="flex items-center gap-2 bg-[var(--bg-color)] rounded-lg px-3 py-1.5">
      <span class="text-sm" title="窗口透明度">👁️</span>
      <span class="text-xs font-mono min-w-[30px] text-center">{Math.round($settingsStore.opacity * 100)}%</span>
      <input
        type="range"
        min="0.2"
        max="1.0"
        step="0.05"
        value={$settingsStore.opacity}
        on:input={handleOpacityChange}
        class="w-20 h-1.5 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-[var(--primary-color)]"
      />
    </div>
  </div>

  <div class="flex items-center gap-1">
    <!-- 主题切换 -->
    <button
      on:click={handleToggleTheme}
      class="w-8 h-8 rounded-lg flex items-center justify-center text-sm hover:bg-[var(--bg-color)] transition-colors flex-shrink-0"
      title="切换主题"
    >
      {$themeStore.name === 'light' ? '🌙' : '🌓'}
    </button>

    <!-- 置顶显示 -->
    <button
      on:click={handleToggleAlwaysOnTop}
      class="w-8 h-8 rounded-lg flex items-center justify-center text-sm {$settingsStore.alwaysOnTop ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-[var(--bg-color)]'} transition-all flex-shrink-0"
      title="置顶显示"
    >
      📌
    </button>
  </div>
</div>
