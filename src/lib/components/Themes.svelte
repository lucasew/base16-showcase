<script lang="ts">
	import themeStore from '$lib/stores/themes';
	import ThemeCard from '$lib/components/ThemeCard.svelte';
</script>

{#if $themeStore}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each Object.entries($themeStore) as [id, theme] (id)}
			<ThemeCard {theme} {id} />
		{/each}
	</div>
{/if}
