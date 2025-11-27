<script lang="ts">
  import type { Theme } from "$lib/Model";

  interface Props {
    theme: Theme;
    id?: string;
  }

  export let theme: Theme;
  export let id: string | undefined = undefined;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="theme-card">
  {#if id}
    <a href="/preview/{id}" class="theme-card-link">
      <div class="theme-card-info-container">
        <h2>{theme.name}</h2>
        <p>{theme.author}</p>
      </div>
      <div class="theme-card-sample-container">
        {#each Object.entries(theme.colors) as [_, colorValue]}
          <div
            class="theme-card-color-container"
            style="background-color: {colorValue}"
          >
            <p>{colorValue}</p>
          </div>
        {/each}
      </div>
    </a>
  {:else}
    <div class="theme-card-info-container">
      <h2>{theme.name}</h2>
      <p>{theme.author}</p>
    </div>
    <div class="theme-card-sample-container">
      {#each Object.entries(theme.colors) as [_, colorValue]}
        <div
          class="theme-card-color-container"
          style="background-color: {colorValue}"
        >
          <p>{colorValue}</p>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .theme-card {
    width: 100%;
  }
  .theme-card-link {
    text-decoration: none;
    color: inherit;
    display: block;
  }
  .theme-card-link:hover {
    opacity: 0.8;
  }
  .theme-card-sample-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
  .theme-card-info-container {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
  }
  .theme-card-info-container h2 {
    margin-right: 3rem;
    white-space: nowrap;
  }
  .theme-card-info-container p {
    text-align: right;
  }
  .theme-card-color-container {
    width: var(--color-cell-size);
    height: var(--color-cell-size);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .theme-card-color-container p {
    background-color: white;
    padding: 0.1rem;
    border-radius: 0.05rem;
    margin: 0.5rem;
    font-family: "Courier New", monospace;
    text-transform: uppercase;
    color: black;
  }
</style>
