import { writable } from 'svelte/store';
import type { Maybe, Theme } from '$lib/Model';
import { normalizeColor, normalizeColorKeys } from '$lib/utils/theme';
import { sanitize } from '$lib/utils/security';
import { parseSimpleYaml } from '$lib/utils/yaml';

const _themeStore = writable<Maybe<Record<string, Theme>>>(null);

/**
 * Global store for managing loaded Base16 themes.
 *
 * Exposes a read-only subscription and a set method (though internal updates use the private `_themeStore`).
 * The store value is a record mapping theme slugs to `Theme` objects, or `null` if not initialized.
 */
const themeStore = {
	subscribe: _themeStore.subscribe,
	set: _themeStore.set
};

let themeCounter = 0;

function handleOneStructure(obj: any, filename?: string) {
	let rawSlug = obj.scheme || obj.slug;

	// Generate automatic name if slug is missing
	if (!rawSlug) {
		if (filename) {
			// Use filename without extension
			rawSlug = filename.replace(/\.(json|yaml|yml)$/i, '');
		} else {
			// Fallback to counter
			themeCounter++;
			rawSlug = `theme-${themeCounter}`;
		}
	}
	const slug = sanitize(String(rawSlug));
	const { author } = obj;
	const colors = normalizeColorKeys(obj.colors || obj);

	const theme: Theme = {
		author,
		name: slug,
		colors: Object.fromEntries(
			Array.from({ length: 16 }, (_, i) => {
				const key = `base0${i.toString(16)}` as keyof Theme['colors'];
				return [key, normalizeColor(colors[key])];
			})
		) as Theme['colors']
	};
	_themeStore.update((old) => {
		return {
			...(old || {}),
			[slug]: theme
		};
	});
}

/**
 * Loads the default set of themes from the static asset `/nix-colors.json`.
 *
 * This function is typically called on app initialization to populate the store.
 */
export async function loadDefaultThemes() {
	const assetAPI = await fetch('/nix-colors.json');
	const assetAPIJSON = await assetAPI.json();
	for (const theme of Object.values(assetAPIJSON)) {
		handleOneStructure(theme as any);
	}
}

/**
 * Processes a user-uploaded file to extract theme data.
 *
 * Supports both JSON and simple YAML formats. Includes security checks:
 * - **DoS Protection:** Warns the user if the file exceeds 1MB.
 * - **Validation:** Attempts to identify Base16 theme structures.
 *
 * @param file - The file object from a drag-and-drop or file input event.
 */
async function processFile(file: File) {
	const MAX_FILE_SIZE = 1024 * 1024; // 1MB
	if (file.size > MAX_FILE_SIZE) {
		const userConfirmed = window.confirm(
			`File "${file.name}" is larger than ${MAX_FILE_SIZE / 1024 / 1024}MB. Processing large files may cause performance issues. Do you want to continue?`
		);
		if (!userConfirmed) {
			return; // Stop if the user cancels
		}
	}
	const content = await file.text();
	const filename = file.name;

	// Try JSON first (regardless of file extension)
	try {
		const json = JSON.parse(content);

		// Check if it has color keys directly (single theme with colors at root)
		const hasColorKeys = Object.keys(json).some((key) =>
			key.toLowerCase().match(/^base0[0-9a-f]$/)
		);

		if (
			hasColorKeys ||
			json.slug !== undefined ||
			json.scheme !== undefined ||
			json.colors !== undefined
		) {
			// Single theme (either has colors at root, or has slug/scheme/colors property)
			handleOneStructure(json, filename);
		} else {
			// Collection of themes
			Object.values(json).forEach((theme: any) => {
				handleOneStructure(theme, filename);
			});
		}
		return;
	} catch {
		// JSON parsing failed, try YAML
	}

	// Try YAML parsing
	try {
		const structure = parseSimpleYaml(content);
		handleOneStructure(structure, filename);
	} catch (yamlError) {
		console.error(`Failed to parse file ${filename}:`, yamlError);
	}
}

function handleFilesInput(_files: FileList | null) {
	if (!_files) return;
	const files = Array.from(_files);
	return Promise.all(files.map(processFile));
}

if (typeof document !== 'undefined') {
	document.addEventListener('drop', (ev: DragEvent) => {
		ev.preventDefault();
		if (ev.dataTransfer) {
			handleFilesInput(ev.dataTransfer.files);
		}
	});

	document.addEventListener('dragover', (ev) => {
		ev.preventDefault();
	});

	let doubleclickEngaged = false;
	document.addEventListener('dblclick', () => {
		const dataInput = document.getElementById('data-input') as HTMLInputElement;
		if (!dataInput) return;

		if (!doubleclickEngaged) {
			dataInput.addEventListener('change', (ev: Event) => {
				handleFilesInput((ev.target as HTMLInputElement).files);
			});
			doubleclickEngaged = true;
		}
		dataInput.click();
	});
}

export default themeStore;
