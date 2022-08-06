<script lang="ts">
	import themeStore from "./stores/themes";
	import locationStore from './stores/location'
	import type { Maybe, Theme } from "./Model";
	import ThemeCard from "./components/ThemeCard.svelte";
	import { onMount } from "svelte";
	let themes: Maybe<Theme[]> = null
	let location = new URL(window.location.href)

	function handleResize() {
		requestAnimationFrame(() => {
			const elem = document.querySelector(".theme-card-sample-container")
			if (!!elem) {
				const computed = getComputedStyle(elem)
				// 5rem is the default color cell size
				const remWide = parseInt(computed.width) / parseInt(computed.fontSize)
				const parts = Math.floor(remWide/5)
				let multiplier = 1
				while (multiplier*2 <= parts) {
					multiplier*=2
				} 
					document.documentElement.style.setProperty('--color-cell-size', `${remWide/multiplier}rem`)
				// console.log("parts", parts, multiplier)
			}
		})
	}

	themeStore.subscribe(_themes => {
		themes = _themes
		handleResize()
	})
	locationStore.subscribe(_location => location = _location)
	
	onMount(async function () {
		window.addEventListener('resize', handleResize)
		handleResize()
	})
</script>

<svelte:head>
	<title>Base16 theme showcase</title>
</svelte:head>

<h1>Base16 theme showcase</h1>

{#if themes != null}
	{#each Object.values(themes) as theme }
		<ThemeCard theme={theme} />
	{/each}
{:else}
	<h2>No themes</h2>
{/if}
<input type="file" id="data-input"/>

<style>
	#data-input {
		display: none;
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