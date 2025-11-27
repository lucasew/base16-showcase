<script lang="ts">
  import themeStore, { loadDefaultThemes } from "$lib/stores/themes";
  import Themes from "$lib/components/Themes.svelte";
  import type { Maybe, Theme } from "$lib/Model";
  import { i18nString } from "$lib/i18n";
  let themes: Maybe<Record<string, Theme>> = null;
  themeStore.subscribe((_themes) => (themes = _themes));
</script>

{#if themes != null}
  <Themes />
{:else}
  <h2>{i18nString("no_themes_loaded")}</h2>
  <p>{i18nString("instruction_supported_formats")}</p>
  <p>{i18nString("instruction_other_details")}</p>
  <p>{i18nString("instruction_ingestion")}</p>
  <button on:click={loadDefaultThemes}>
    {i18nString("instruction_load_default_colors")}
  </button>
{/if}
<input type="file" id="data-input" multiple />

<style>
  #data-input {
    display: none;
  }
</style>
