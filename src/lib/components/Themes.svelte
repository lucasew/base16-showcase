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
  {#each Object.entries(themes) as [id, theme]}
    <ThemeCard {theme} {id} />
  {/each}
{/if}
