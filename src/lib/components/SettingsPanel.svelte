<script lang="ts">
  import { settingsStore } from '../stores/settings';
  import { themeStore, lightTheme, darkTheme } from '../stores/theme';

  export let showSettings: boolean = false;

  function handleThemeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const theme = select.value === 'dark' ? darkTheme : lightTheme;
    themeStore.set(theme);
    themeStore.applyTheme(theme);
    themeStore.save();
  }

  function handleFontSizeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    settingsStore.update((s) => ({ ...s, fontSize: parseInt(input.value) }));
    settingsStore.save();
  }

  function handleOpacityChange(event: Event) {
    const input = event.target as HTMLInputElement;
    settingsStore.update((s) => ({ ...s, opacity: parseFloat(input.value) }));
    settingsStore.save();
  }

  function handleAlwaysOnTopChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    settingsStore.update((s) => ({ ...s, alwaysOnTop: checkbox.checked }));
    settingsStore.save();
  }
</script>

{#if showSettings}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-[var(--surface-color)] p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-xl font-bold mb-4">设置</h2>

      <div class="space-y-4">
        <div>
          <label class="block mb-2">主题</label>
          <select on:change={handleThemeChange} value={$themeStore.name} class="w-full p-2 rounded bg-[var(--bg-color)] border border-[var(--border-color)]">
            <option value="light">浅色</option>
            <option value="dark">深色</option>
          </select>
        </div>

        <div>
          <label class="block mb-2">字体大小 ({$settingsStore.fontSize}px)</label>
          <input
            type="range"
            min="12"
            max="48"
            step="1"
            value={$settingsStore.fontSize}
            on:input={handleFontSizeChange}
            class="w-full"
          />
        </div>

        <div>
          <label class="block mb-2">透明度 ({$settingsStore.opacity * 100}%)</label>
          <input
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={$settingsStore.opacity}
            on:input={handleOpacityChange}
            class="w-full"
          />
        </div>

        <div class="flex items-center">
          <input
            type="checkbox"
            id="alwaysOnTop"
            checked={$settingsStore.alwaysOnTop}
            on:change={handleAlwaysOnTopChange}
            class="mr-2"
          />
          <label for="alwaysOnTop">置顶显示</label>
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-2">
        <button on:click={() => (showSettings = false)} class="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600">
          关闭
        </button>
      </div>
    </div>
  </div>
{/if}
