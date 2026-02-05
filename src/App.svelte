<script lang="ts">
  import { settingsStore } from './lib/stores/settings';
  import { themeStore } from './lib/stores/theme';
  import Editor from './lib/components/Editor.svelte';
  import { onMount } from 'svelte';

  onMount(async () => {
    await settingsStore.load();
    await themeStore.load();
    themeStore.applyTheme($themeStore);
  });

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

<div class="flex flex-col h-screen">
  <div class="flex items-center px-4 py-2 bg-[var(--surface-color)] border-b border-[var(--border-color)] gap-3">
    <!-- Logo: 记 -->
    <div class="w-10 h-10 bg-gradient-to-br from-[var(--primary-color)] to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
      记
    </div>

    <!-- 置顶显示 -->
    <button
        on:click={handleToggleAlwaysOnTop}
        class="w-10 h-10 rounded-xl flex items-center justify-center text-base {$settingsStore.alwaysOnTop ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-[var(--bg-color)]'} transition-all flex-shrink-0"
        title="置顶显示"
    >
      📌
    </button>

    <!-- 主题切换 -->
    <button
        on:click={handleToggleTheme}
        class="w-10 h-10 rounded-xl flex items-center justify-center text-base hover:bg-[var(--bg-color)] transition-colors flex-shrink-0"
        title="切换主题"
    >
      {$themeStore.name === 'light' ? '🌙' : '☀️'}
    </button>

    <!-- 透明度 -->
    <div class="flex items-center gap-2 bg-[var(--bg-color)] rounded-xl px-3 py-1.5 flex-shrink-0">
      <span class="text-xs">透明</span>
      <span class="text-xs font-mono min-w-[28px] text-center">{Math.round($settingsStore.opacity * 100)}%</span>
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

    <!-- 字体大小 -->
    <div class="flex items-center gap-2 bg-[var(--bg-color)] rounded-xl px-3 py-1.5 flex-shrink-0">
      <span class="text-xs">字体</span>
      <span class="text-xs font-mono min-w-[28px] text-center">{$settingsStore.fontSize}</span>
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
  </div>

  <Editor />
</div>
