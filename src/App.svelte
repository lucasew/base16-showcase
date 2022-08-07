<script lang="ts">
	import themeStore from "./stores/themes";
	import locationStore from './stores/location'
	import {Github} from '@icons-pack/svelte-simple-icons' 
	import Themes from "./components/Themes.svelte";
	import type { Maybe, Theme } from "./Model";
	let location = new URL(window.location.href)
	locationStore.subscribe(_location => location = _location)
	let themes: Maybe<Record<string,Theme>> = null
	themeStore.subscribe(_themes => themes = _themes)
</script>

<svelte:head>
	<title>Base16 theme showcase</title>
</svelte:head>

<h1>Base16 theme showcase <a id="github-link" href="https://github.com/lucasew/base16-showcase" target="_blank"><Github/></a></h1>

{#if themes != null}
	<Themes/>
{:else}
	<h2>No themes loaded</h2>
	<p>You can load a nix-colors structured JSON or a base16 YAML file.</p>
	<p>Some other details may be covered by this app.</p>
	<p>You can drag-and-drop the files or double-click anywhere in the app to open a file selector.</p>
{/if}
<input type="file" id="data-input"/>

<style>
	#data-input {
		display: none;
	}
	#github-link {
		color: unset;
	}
	:global(body) {
		min-height: 100vh;
		max-width: max(600px, 80vw);
		margin: 0px;
		margin-left: auto;
		margin-right: auto;
		padding: 0.5rem;
		padding-top: 10vh;
	}
</style>