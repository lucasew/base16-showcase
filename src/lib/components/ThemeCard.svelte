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
<div class="w-full card bg-base-100 shadow-xl mb-4">
  {#if id}
    <a href="/preview/{id}" class="block hover:opacity-80 transition-opacity">
      <div class="card-body p-4 flex flex-row items-center justify-between">
        <h2 class="card-title mr-12 whitespace-nowrap">{theme.name}</h2>
        <p class="text-right text-sm opacity-70">{theme.author}</p>
      </div>
      <div class="flex flex-row flex-wrap items-center justify-center p-4 pt-0">
        {#each Object.entries(theme.colors) as [_, colorValue]}
          <div
            class="flex items-center justify-center w-20 h-20"
            style="background-color: {colorValue}"
          >
            <p class="bg-white px-[0.1rem] rounded-[0.05rem] m-2 font-mono uppercase text-black text-xs">
              {colorValue}
            </p>
          </div>
        {/each}
      </div>
    </a>
  {:else}
    <div class="card-body p-4 flex flex-row items-center justify-between">
      <h2 class="card-title mr-12 whitespace-nowrap">{theme.name}</h2>
      <p class="text-right text-sm opacity-70">{theme.author}</p>
    </div>
    <div class="flex flex-row flex-wrap items-center justify-center p-4 pt-0">
      {#each Object.entries(theme.colors) as [_, colorValue]}
        <div
          class="flex items-center justify-center w-20 h-20"
          style="background-color: {colorValue}"
        >
          <p class="bg-white px-[0.1rem] rounded-[0.05rem] m-2 font-mono uppercase text-black text-xs">
            {colorValue}
          </p>
        </div>
      {/each}
    </div>
  {/if}
</div>
