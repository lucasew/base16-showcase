<script lang="ts">
  import type { Theme } from "$lib/Model";
  import * as m from "$lib/paraglide/messages.js";

  interface Props {
    theme: Theme;
    id?: string;
  }

  export let theme: Theme;
  export let id: string | undefined = undefined;
</script>

<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
  <div class="card-body p-4">
    <div class="flex justify-between items-start mb-2">
      <div>
        <h2 class="card-title text-lg font-bold">
          {#if id}
            <a href="/preview/{id}" class="link link-hover hover:text-primary">
              {theme.name}
            </a>
          {:else}
            {theme.name}
          {/if}
        </h2>
        <p class="text-xs text-base-content/70">{m.by()} {theme.author}</p>
      </div>
    </div>

    <div class="grid grid-cols-8 gap-1 mt-2">
      {#each Object.entries(theme.colors) as [colorName, colorValue]}
        <div
          class="aspect-square w-full rounded-sm shadow-sm hover:scale-110 transition-transform cursor-help relative group"
          style="background-color: {colorValue}"
          title="{colorName}: {colorValue}"
        >
          <span class="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 bg-neutral text-neutral-content text-[10px] px-1 py-0.5 rounded pointer-events-none mb-1 whitespace-nowrap z-10">
            {colorValue}
          </span>
        </div>
      {/each}
    </div>

    {#if id}
      <div class="card-actions justify-end mt-4">
        <a href="/preview/{id}" class="btn btn-sm btn-outline btn-primary">
          {m.preview()}
        </a>
      </div>
    {/if}
  </div>
</div>
