<script lang="ts">
	import Github from '$lib/components/Github.svelte';
	import '$lib/app.css';
	import * as m from '$lib/paraglide/messages.js';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { handleFilesInput } from '$lib/services/themeLoader';

	const { children } = $props();

	let isDark = $state(false);

	if (browser) {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) {
			isDark = savedTheme === 'dark';
		} else {
			isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}
	}

	$effect(() => {
		if (!browser) return;
		const theme = isDark ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	});

	const handleDrop = (ev: DragEvent) => {
		ev.preventDefault();
		if (ev.dataTransfer) {
			handleFilesInput(ev.dataTransfer.files);
		}
	};

	const handleDragOver = (ev: DragEvent) => {
		ev.preventDefault();
	};

	const handleDoubleClick = () => {
		const dataInput = document.getElementById('data-input') as HTMLInputElement;
		if (!dataInput) return;

		// Use onchange property to ensure single listener and handle element replacement
		dataInput.onchange = (ev: Event) => {
			handleFilesInput((ev.target as HTMLInputElement).files);
		};
		dataInput.click();
	};
</script>

<svelte:document ondrop={handleDrop} ondragover={handleDragOver} ondblclick={handleDoubleClick} />

<div class="min-h-screen bg-base-200">
	<div class="navbar bg-base-100 shadow-sm">
		<div class="flex-1">
			<a href="{base}/" class="btn btn-ghost text-xl">{m.app_title()}</a>
		</div>
		<div class="flex-none flex items-center gap-2">
			<label class="swap swap-rotate btn btn-square btn-ghost">
				<input type="checkbox" bind:checked={isDark} />

				<!-- sun icon -->
				<svg
					class="swap-on h-6 w-6 fill-current"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<path
						d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
					/>
				</svg>

				<!-- moon icon -->
				<svg
					class="swap-off h-6 w-6 fill-current"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<path
						d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
					/>
				</svg>
			</label>
			<a
				href="https://github.com/lucasew/base16-showcase"
				target="_blank"
				rel="noopener noreferrer"
				class="btn btn-square btn-ghost"
				aria-label="Github"
			>
				<Github />
			</a>
		</div>
	</div>

	<div class="container mx-auto p-4 pt-10 max-w-[max(600px,80vw)]">
		{@render children()}
	</div>
</div>
