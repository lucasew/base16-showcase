<script lang="ts">
	import { page } from '$app/stores';
	import themeStore from '$lib/stores/themes';
	import type { Maybe, Theme } from '$lib/Model';
	import ThemeCard from '$lib/components/ThemeCard.svelte';
	import CodePreview from '$lib/components/CodePreview.svelte';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { base } from '$app/paths';

	let themes: Maybe<Record<string, Theme>> = null;
	themeStore.subscribe((_themes) => (themes = _themes));

	$: themeId = $page.params.theme;
	$: theme = themes && themeId ? themes[themeId] : undefined;

	function handleResize() {
		if (typeof document === 'undefined') return;
		requestAnimationFrame(() => {
			const elem = document.querySelector('.theme-card-sample-container');
			if (elem) {
				const computed = getComputedStyle(elem);
				// 5rem is the default color cell size
				const remWide = parseInt(computed.width) / parseInt(computed.fontSize);
				const parts = Math.floor(remWide / 5);
				let multiplier = 1;
				while (multiplier * 2 <= parts) {
					multiplier *= 2;
				}
				document.documentElement.style.setProperty(
					'--color-cell-size',
					`${remWide / multiplier}rem`
				);
			}
		});
	}

	onMount(() => {
		window.addEventListener('resize', handleResize);
		// Initial resize check after a short delay to ensure DOM is ready
		setTimeout(handleResize, 100);
	});

	// Re-run handleResize when theme loads
	$: if (theme) {
		setTimeout(handleResize, 0);
	}
</script>

<div class="preview-page">
	<div class="header">
		<a href="{base}/" class="back-link">{m.back_to_themes()}</a>
	</div>

	{#if theme}
		<div class="content prose max-w-none">
			<h1>{theme.name}</h1>

			<div class="card-container not-prose">
				<ThemeCard {theme} />
			</div>

			<div class="previews">
				<div class="preview-section">
					<h3>{m.javascript()}</h3>
					<div class="not-prose">
						<CodePreview {theme} language="javascript" />
					</div>
				</div>

				<div class="preview-section">
					<h3>{m.rust()}</h3>
					<div class="not-prose">
						<CodePreview {theme} language="rust" />
					</div>
				</div>
			</div>
		</div>
	{:else if themes}
		<div class="error">
			<h2>{m.theme_not_found()}</h2>
			<p>{m.theme_not_found_description({ id: themeId ?? '' })}</p>
			<a href="{base}/">{m.return_to_home()}</a>
		</div>
	{:else}
		<div class="loading">
			<p>{m.loading_themes()}</p>
		</div>
	{/if}
</div>

<style>
	.preview-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.header {
		margin-bottom: 2rem;
	}

	.back-link {
		font-size: 1.1rem;
		color: var(--color-text); /* Assuming this exists, fallback to inherit if not */
		text-decoration: none;
		padding: 0.5rem 1rem;
		border: 1px solid currentColor;
		border-radius: 4px;
		display: inline-block;
	}

	.back-link:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.card-container {
		margin-bottom: 3rem;
	}

	.previews {
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	@media (min-width: 900px) {
		.previews {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 2rem;
		}
	}
</style>
