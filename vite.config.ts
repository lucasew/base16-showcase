import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			org: 'lucao-enterprise',
			project: 'base16-showcase'
		}),
		tailwindcss(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['preferredLanguage', 'baseLocale']
		}),
		sveltekit()
	]
});
