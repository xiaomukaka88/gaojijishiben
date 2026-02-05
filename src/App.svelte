<script lang="ts">
  import { onMount } from 'svelte';
  import Editor from './lib/components/Editor.svelte';
  import Toolbar from './lib/components/Toolbar.svelte';
  import { settingsStore } from './lib/stores/settings';
  import { themeStore } from './lib/stores/theme';

  onMount(async () => {
    await settingsStore.load();
    await themeStore.load();
    themeStore.applyTheme($themeStore);
  });
</script>

<div class="flex flex-col h-screen">
  <Toolbar />
  <Editor />
</div>
