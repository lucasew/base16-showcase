<script lang="ts">
import type { Theme } from "../Model";

export let theme: Theme;
</script>

<style>
    .theme-card {
        width: 100%;
    }
    .theme-card-sample-container {
        width: 90%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .theme-card-info-container {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
    }
    .theme-card-color-container {
        width: 1fr;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .theme-card-color-container p {
        background-color: white;
        padding: .1rem;
        border-radius: .05rem;
        margin: .5rem;
        font-family: 'Courier New', monospace;
    }
</style>

<div class="theme-card">
    <div class="theme-card-info-container">
        <h2>{theme.name}</h2>
        <p>{theme.author}</p>
    </div>
    <div class="theme-card-sample-container">
        {#each Object.keys(theme.colors) as color}
            <div class="theme-card-color-container" style="background-color: #{theme.colors[color]}">
                <p style="color: #{theme.colors[color]}">{color}</p>
            </div>
        {/each}
    </div>
</div>