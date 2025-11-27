<script lang="ts">
  import { onMount } from "svelte";

  import type { Maybe, Theme } from "$lib/Model";
  import themeStore from "$lib/stores/themes";
  import ThemeCard from "$lib/components/ThemeCard.svelte";

  let themes: Maybe<Record<string, Theme>> = null;

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
        // console.log("parts", parts, multiplier)
      }
    });
  }

  themeStore.subscribe((_themes) => {
    themes = _themes;
    handleResize();
  });

  onMount(async function () {
    window.addEventListener("resize", handleResize);
    handleResize();
  });
</script>

{#if themes}
  {#each Object.entries(themes) as [id, theme]}
    <ThemeCard {theme} {id} />
  {/each}
{/if}
