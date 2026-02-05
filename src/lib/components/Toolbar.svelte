<script lang="ts">
  import { settingsStore } from '../stores/settings';
  import { themeStore } from '../stores/theme';

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

<div class="flex items-center justify-between p-4 bg-[var(--surface-color)] border-b border-[var(--border-color)]">
  <div class="flex items-center gap-2">
    <span class="font-bold text-lg">高级记事本</span>
  </div>

  <div class="flex items-center gap-4">
    <button
      on:click={handleToggleTheme}
      class="px-3 py-1 rounded bg-[var(--primary-color)] text-white hover:opacity-80"
    >
      {$themeStore.name === 'light' ? '🌙' : '🌓'}
    </button>

    <button
      on:click={handleToggleAlwaysOnTop}
      class="px-3 py-1 rounded {$settingsStore.alwaysOnTop ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-300'}"
    >
      📌
    </button>
  </div>
</div>
