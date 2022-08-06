<script lang="ts">
	import themeStore from "./stores/themes";
	import locationStore from './stores/location'
	let themes = null
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