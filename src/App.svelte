<script lang="ts">
	import themeStore from "./stores/themes";
	import locationStore from './stores/location'
	import type { Maybe, Theme } from "./Model";
	import ThemeCard from "./components/ThemeCard.svelte";
	let themes: Maybe<Theme[]> = null
	let location = new URL(window.location.href)
	themeStore.subscribe(_themes => {
		console.log("themes", _themes)
		themes = _themes
	})
	locationStore.subscribe(_location => location = _location)
	console.log(themes)
	console.log(location)
</script>

<div id="content">
	<h1>Base16 theme showcase</h1>
	
	{#if themes != null}
		{#each Object.values(themes) as theme }
			<ThemeCard theme={theme} />
		{/each}
	{:else}
		<h2>No themes</h2>
	{/if}
	<input type="file" id="data-input"/>
</div>

<style>
	#data-input {
		display: none;
	}
	:global(body) {
		width: 100vw;
		height: 100vh;
		margin: 0px;
		padding: 0px;
	}
	div#content {
		max-width: max(600px, 80vw);
		margin-left: auto;
		margin-right: auto;
		margin-top: 10vh;
		padding: 0.5rem;
	}
</style>