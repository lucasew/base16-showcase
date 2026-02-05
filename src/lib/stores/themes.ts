import { writable } from 'svelte/store';
import type { Maybe, Theme } from '$lib/Model';

const _themeStore = writable<Maybe<Record<string, Theme>>>(null);

/**
 * Global store for managing loaded Base16 themes.
 *
 * Exposes a read-only subscription and methods to modify the state.
 * The store value is a record mapping theme slugs to `Theme` objects, or `null` if not initialized.
 */
const themeStore = {
	subscribe: _themeStore.subscribe,
	set: _themeStore.set,
	/**
	 * Adds a single theme to the store.
	 * @param slug - The unique identifier for the theme.
	 * @param theme - The theme object.
	 */
	addTheme: (slug: string, theme: Theme) => {
		_themeStore.update((old) => {
			return {
				...(old || {}),
				[slug]: theme
			};
		});
	}
};

export default themeStore;
