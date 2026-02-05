<script lang="ts">
  import { settingsStore } from '../stores/settings';
  import { themeStore } from '../stores/theme';

  export let showSettings: boolean = false;

  function handleToggleTheme() {
    themeStore.toggle();
    themeStore.save();
  }

  function handleToggleAlwaysOnTop() {
    settingsStore.update((s) => {
      const newValue = !s.alwaysOnTop;
      return { ...s, alwaysOnTop: newValue };
    });
    settingsStore.save();
  }
</script>

<div class="flex items-center justify-between px-6 py-3 bg-[var(--surface-color)] border-b border-[var(--border-color)]">
  <div class="flex items-center gap-3">
    <div class="w-10 h-10 bg-gradient-to-br from-[var(--primary-color)] to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
      记
    </div>
    <div>
      <h1 class="font-bold text-lg leading-tight">高级记事本</h1>
      <p class="text-xs text-[var(--secondary-color)]">智能计算 · 自动保存</p>
    </div>
  </div>

  <div class="flex items-center gap-2">
    <button
      on:click={handleToggleTheme}
      class="w-10 h-10 rounded-lg flex items-center justify-center text-lg hover:bg-[var(--bg-color)] transition-colors"
      title="切换主题"
    >
      {$themeStore.name === 'light' ? '🌙' : '🌓'}
    </button>

    <button
      on:click={handleToggleAlwaysOnTop}
      class="w-10 h-10 rounded-lg flex items-center justify-center text-lg {$settingsStore.alwaysOnTop ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-[var(--bg-color)]'} transition-all"
      title="置顶显示"
    >
      📌
    </button>

    <div class="w-px h-6 bg-[var(--border-color)] mx-1"></div>

    <button
      on:click={() => (showSettings = true)}
      class="w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-[var(--bg-color)] hover:bg-[var(--border-color)] transition-colors"
      title="打开设置"
    >
      ⚙️
    </button>
  </div>
</div>
