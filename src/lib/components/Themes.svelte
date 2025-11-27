<script lang="ts">
  import type { Maybe, Theme } from "$lib/Model";
  import themeStore from "$lib/stores/themes";
  import ThemeCard from "$lib/components/ThemeCard.svelte";

  let themes: Maybe<Record<string, Theme>> = null;

  themeStore.subscribe((_themes) => {
    themes = _themes;
  });
</script>

{#if themes}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each Object.entries(themes) as [id, theme]}
      <ThemeCard {theme} {id} />
    {/each}
  </div>
{/if}
