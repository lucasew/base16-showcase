// svelte.config.js
import adapter from '@sveltejs/adapter-auto'; // Or a specific adapter like adapter-static or adapter-node
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: preprocess(), // Configure preprocessors if needed (e.g., PostCSS, Sass)
    kit: {
        adapter: adapter()
    }
};

export default config;
