<script lang="ts">
  import type { Theme } from "../Model";

  export let theme: Theme;
</script>

<div class="theme-card">
  <div class="theme-card-info-container">
    <h2>{theme.name}</h2>
    <p>{theme.author}</p>
  </div>
  <div class="theme-card-sample-container">
    {#each Object.keys(theme.colors) as color}
      <div
        class="theme-card-color-container"
        style="background-color: #{theme.colors[color]}"
      >
        <p>#{theme.colors[color]}</p>
      </div>
    {/each}
  </div>
</div>

<style>
  .theme-card {
    width: 100%;
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
  }
</style>
