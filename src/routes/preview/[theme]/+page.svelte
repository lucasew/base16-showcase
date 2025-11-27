<script lang="ts">
  import { page } from "$app/stores";
  import themeStore from "$lib/stores/themes";
  import type { Maybe, Theme } from "$lib/Model";
  import ThemeCard from "$lib/components/ThemeCard.svelte";
  import CodePreview from "$lib/components/CodePreview.svelte";

  let themes: Maybe<Record<string, Theme>> = null;
  themeStore.subscribe((_themes) => (themes = _themes));

  $: themeId = $page.params.theme;
  $: theme = (themes && themeId) ? themes[themeId] : undefined;
</script>

<div class="preview-page">
  <div class="header">
    <a href="/" class="btn btn-outline mb-4">← Back to Themes</a>
  </div>

  {#if theme}
    <div class="content">
      <h1 class="text-3xl font-bold mb-6">Theme Preview: {theme.name}</h1>

      <div class="card-container mb-12">
        <ThemeCard {theme} />
      </div>

      <div class="previews grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="preview-section">
          <h3 class="text-xl font-bold mb-4">JavaScript</h3>
          <CodePreview {theme} language="javascript" />
        </div>

        <div class="preview-section">
          <h3 class="text-xl font-bold mb-4">Rust</h3>
          <CodePreview {theme} language="rust" />
        </div>
      </div>
    </div>
  {:else if themes}
    <div class="error">
      <h2 class="text-2xl font-bold text-error">Theme not found</h2>
      <p>The theme "{themeId}" could not be found.</p>
      <a href="/" class="link">Return to Home</a>
    </div>
  {:else}
    <div class="loading loading-spinner loading-lg">
      <p class="sr-only">Loading themes...</p>
    </div>
  {/if}
</div>

<style>
  .preview-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
</style>
