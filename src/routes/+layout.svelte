<script lang="ts">
  import Github from "$lib/components/Github.svelte";
  import i18n, { i18nString } from "$lib/i18n";
  import "$lib/app.css";
</script>

<svelte:head>
  <title>{i18nString("title")}</title>
</svelte:head>

<div class="min-h-screen max-w-[max(600px,80vw)] mx-auto p-2 pt-[10vh]">
  <h1 class="text-3xl font-bold mb-4 flex items-center gap-2">
    {i18nString("title")}
    <a
      id="github-link"
      href="https://github.com/lucasew/base16-showcase"
      target="_blank"
      class="hover:text-primary transition-colors"
    >
      <Github />
    </a>
  </h1>

  <slot />
</div>
