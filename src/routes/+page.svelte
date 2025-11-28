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
        <h1 class="text-5xl font-bold">{m.hello_world()}</h1>
        <div class="py-6 space-y-2">
            <p>{m.supported_formats()} .yaml, .json, .tmTheme, .enc (Base16).</p>
            <p>{m.drag_drop_instruction()}</p>
            <p>{m.local_processing()}</p>
        </div>
        <button class="btn btn-primary" on:click={loadDefaultThemes}>
          {m.load_default_colors()}
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
