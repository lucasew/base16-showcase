<script lang="ts">
  import Github from "$lib/components/Github.svelte";
  import i18n, { i18nString } from "$lib/i18n";
  import "$lib/app.css";
</script>

<svelte:head>
  <title>{i18nString("title")}</title>
</svelte:head>

<h1>
  {i18nString("title")}
  <a
    id="github-link"
    href="https://github.com/lucasew/base16-showcase"
    target="_blank"
  >
    <Github />
  </a>
</h1>

<slot />
