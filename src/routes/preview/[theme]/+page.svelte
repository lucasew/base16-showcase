<script lang="ts">
  import { page } from "$app/stores";
  import themeStore from "$lib/stores/themes";
  import type { Maybe, Theme } from "$lib/Model";
  import ThemeCard from "$lib/components/ThemeCard.svelte";
  import CodePreview from "$lib/components/CodePreview.svelte";
  import { onMount } from "svelte";

  let themes: Maybe<Record<string, Theme>> = null;
  themeStore.subscribe((_themes) => (themes = _themes));

  $: themeId = $page.params.theme;
  $: theme = (themes && themeId) ? themes[themeId] : undefined;

  function handleResize() {
    if (typeof document === "undefined") return;
    requestAnimationFrame(() => {
      const elem = document.querySelector(".theme-card-sample-container");
      if (!!elem) {
        const computed = getComputedStyle(elem);
        // 5rem is the default color cell size
        const remWide = parseInt(computed.width) / parseInt(computed.fontSize);
        const parts = Math.floor(remWide / 5);
        let multiplier = 1;
        while (multiplier * 2 <= parts) {
          multiplier *= 2;
        }
        document.documentElement.style.setProperty(
          "--color-cell-size",
          `${remWide / multiplier}rem`
        );
      }
    });
  }

  onMount(() => {
    window.addEventListener("resize", handleResize);
    // Initial resize check after a short delay to ensure DOM is ready
    setTimeout(handleResize, 100);
  });

  // Re-run handleResize when theme loads
  $: if (theme) {
    setTimeout(handleResize, 0);
  }
</script>

<div class="preview-page">
  <div class="header">
    <a href="/" class="back-link">← Back to Themes</a>
  </div>

  {#if theme}
    <div class="content">
      <h1>Theme Preview: {theme.name}</h1>

      <div class="card-container">
        <ThemeCard {theme} />
      </div>

      <div class="previews">
        <div class="preview-section">
          <h3>JavaScript</h3>
          <CodePreview {theme} language="javascript" />
        </div>

        <div class="preview-section">
          <h3>Rust</h3>
          <CodePreview {theme} language="rust" />
        </div>
      </div>
    </div>
  {:else if themes}
    <div class="error">
      <h2>Theme not found</h2>
      <p>The theme "{themeId}" could not be found.</p>
      <a href="/">Return to Home</a>
    </div>
  {:else}
    <div class="loading">
      <p>Loading themes...</p>
    </div>
  {/if}
</div>

<style>
  .preview-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .header {
    margin-bottom: 2rem;
  }

  .back-link {
    font-size: 1.1rem;
    color: var(--color-text); /* Assuming this exists, fallback to inherit if not */
    text-decoration: none;
    padding: 0.5rem 1rem;
    border: 1px solid currentColor;
    border-radius: 4px;
    display: inline-block;
  }

  .back-link:hover {
    background-color: rgba(0,0,0,0.05);
  }

  .card-container {
    margin-bottom: 3rem;
  }

  .previews {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  @media (min-width: 900px) {
    .previews {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
  }

  h1 {
    margin-bottom: 1.5rem;
  }

  h3 {
    margin-bottom: 1rem;
  }
</style>
