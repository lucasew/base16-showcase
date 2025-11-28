<script lang="ts">
  import themeStore, { loadDefaultThemes } from "$lib/stores/themes";
  import Themes from "$lib/components/Themes.svelte";
  import type { Maybe, Theme } from "$lib/Model";
  import * as m from "$lib/paraglide/messages.js";
  let themes: Maybe<Record<string, Theme>> = null;
  themeStore.subscribe((_themes) => (themes = _themes));
</script>

{#if themes != null}
  <Themes />
{:else}
  <div class="hero min-h-[50vh] bg-base-100 rounded-box shadow-xl">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">{m.no_themes_loaded()}</h1>
        <div class="py-6 space-y-2">
            <p>{m.instruction_supported_formats()}</p>
            <p>{m.instruction_other_details()}</p>
            <p>{m.instruction_ingestion()}</p>
        </div>
        <button class="btn btn-primary" on:click={loadDefaultThemes}>
          {m.instruction_load_default_colors()}
        </button>
      </div>
    </div>
  </div>
{/if}
<input type="file" id="data-input" multiple />

<style>
  #data-input {
    display: none;
  }
</style>
