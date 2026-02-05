<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import Editor from './lib/components/Editor.svelte';
  import Toolbar from './lib/components/Toolbar.svelte';
  import SettingsPanel from './lib/components/SettingsPanel.svelte';
  import { settingsStore } from './lib/stores/settings';
  import { themeStore } from './lib/stores/theme';
  import { editorStore } from './lib/stores/editor';

  let showSettings = writable(false);

  onMount(async () => {
    await settingsStore.load();
    await themeStore.load();
    await editorStore.load();
  });
</script>

<div class="flex flex-col h-screen">
  <Toolbar bind:showSettings={$showSettings} />
  <Editor />
</div>

<SettingsPanel bind:showSettings={$showSettings} />
