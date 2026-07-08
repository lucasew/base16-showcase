<script lang="ts">
	import themeStore from '$lib/stores/themes';
	import { loadDefaultThemes } from '$lib/services/themeLoader';
	import Themes from '$lib/components/Themes.svelte';
	import * as m from '$lib/paraglide/messages.js';
</script>

{#if $themeStore != null}
	<Themes />
{:else}
	<div class="hero min-h-[50vh] bg-base-100 rounded-box shadow-xl">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1 class="text-5xl font-bold">{m.app_title()}</h1>
				<div class="py-6 space-y-2">
					<p>
						{m.supported_formats()} .yaml, .json, .tmTheme, .enc (Base16).
					</p>
					<p>{m.drag_drop_instruction()}</p>
					<p>{m.local_processing()}</p>
				</div>
				<button class="btn btn-primary" on:click={loadDefaultThemes}>
					{m.load_default_colors()}
				</button>
			</div>
		</div>
	</div>
{/if}
