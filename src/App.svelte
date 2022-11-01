<script lang="ts">
  import themeStore, { loadDefaultThemes } from "./stores/themes";
  import locationStore from "./stores/location";
  import Github from "./components/Github.svelte";
  import Themes from "./components/Themes.svelte";
  import type { Maybe, Theme } from "./Model";
  import i18n, { i18nString } from "./i18n";
  let location = new URL(window.location.href);
  locationStore.subscribe((_location) => (location = _location));
  let themes: Maybe<Record<string, Theme>> = null;
  themeStore.subscribe((_themes) => (themes = _themes));
</script>

<svelte:head>
  <title>{i18nString('title')}</title>
</svelte:head>

<h1>
  {i18nString('title')}
  <a
    id="github-link"
    href="https://github.com/lucasew/base16-showcase"
    target="_blank"
  >
    <Github />
  </a>
</h1>

{#if themes != null}
  <Themes />
{:else}
  <h2>{i18nString('no_themes_loaded')}</h2>
  <p>{i18nString('instruction_supported_formats')}</p>
  <p>{i18nString('instruction_other_details')}</p>
  <p>{i18nString('instruction_ingestion')}</p>
  <button on:click={loadDefaultThemes}>{i18nString('instruction_load_default_colors')}</button>
{/if}
<input type="file" id="data-input" multiple/>

<style>
  #data-input {
    display: none;
  }
  #github-link {
    color: unset;
  }
  :global(body) {
    min-height: 100vh;
    max-width: max(600px, 80vw);
    margin: 0px;
    margin-left: auto;
    margin-right: auto;
    padding: 0.5rem;
    padding-top: 10vh;
  }
</style>
