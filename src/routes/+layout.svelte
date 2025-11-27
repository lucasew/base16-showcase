<script lang="ts">
  import Github from "$lib/components/Github.svelte";
  import i18n, { i18nString } from "$lib/i18n";
  import "$lib/app.css";
</script>

<svelte:head>
  <title>{i18nString("title")}</title>
</svelte:head>

<div class="min-h-screen bg-base-200">
  <div class="navbar bg-base-100 shadow-sm">
    <div class="flex-1">
      <a href="/" class="btn btn-ghost text-xl">{i18nString("title")}</a>
    </div>
    <div class="flex-none">
      <a
        href="https://github.com/lucasew/base16-showcase"
        target="_blank"
        class="btn btn-square btn-ghost"
        aria-label="Github"
      >
        <Github />
      </a>
    </div>
  </div>

  <div class="container mx-auto p-4 pt-10 max-w-[max(600px,80vw)]">
    <slot />
  </div>
</div>
