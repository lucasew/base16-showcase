import themeStore from '$lib/stores/themes';
import type { Theme } from '$lib/Model';
import { normalizeColor, normalizeColorKeys } from '$lib/utils/theme';
import { sanitize } from '$lib/utils/security';
import { parseSimpleYaml } from '$lib/utils/yaml';

/**
 * Counter for generating unique slugs for themes with missing names.
 * This is a module-level side effect.
 */
let themeCounter = 0;

/**
 * Processes a single theme structure and adds it to the global store.
 *
 * This function handles:
 * - Slug generation: Uses `scheme`/`slug`, falls back to filename, or an auto-incrementing counter.
 * - Sanitization: Ensures the slug is safe to use.
 * - Color Normalization: Validates and normalizes color values to safe hex codes.
 * - State Update: Updates `themeStore` with the new theme.
 *
 * @param obj - The raw theme object. Expected to contain `scheme` (or `slug`), `author`, and `colors`.
 * @param filename - Optional. The original filename, used as a fallback for slug generation if the theme lacks a name.
 */
function handleOneStructure(obj: any, filename?: string) {
	let slug = sanitize(obj.scheme || obj.slug);

	// Generate automatic name if slug is missing
	if (!slug) {
		if (filename) {
			// Use filename without extension
			slug = filename.replace(/\.(json|yaml|yml)$/i, '');
		} else {
			// Fallback to counter
			themeCounter++;
			slug = `theme-${themeCounter}`;
		}
	}
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
	themeStore.addTheme(slug, theme);
}

/**
 * Loads the default set of themes from the static asset `/nix-colors.json`.
 *
 * This function is typically called on app initialization to populate the store.
 * It iterates over the collection and processes each theme using `handleOneStructure`.
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
 * Flow:
 * 1. Checks file size.
 * 2. Tries to parse as JSON.
 *    - Detects if it's a single theme (has `slug`/`colors`/`base0X`) or a collection.
 * 3. If JSON fails, tries to parse as simple YAML.
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

/**
 * Handles a list of files (e.g., from a file input or drag event).
 *
 * @param _files - The FileList object (can be null).
 * @returns A promise that resolves when all files have been processed.
 */
function handleFilesInput(_files: FileList | null) {
	if (!_files) return;
	const files = Array.from(_files);
	return Promise.all(files.map(processFile));
}

/**
 * Initializes global event listeners for file handling.
 *
 * Supported interactions:
 * - **Drag & Drop:** Allows users to drop theme files anywhere on the page.
 * - **Double Click:** Triggers a hidden file input (id `data-input`) to open the file picker.
 *
 * Returns a cleanup function to remove the listeners, useful for component lifecycle management.
 *
 * @returns A cleanup function that removes the event listeners.
 */
export function initializeThemeListeners() {
	if (typeof document === 'undefined') return () => {};

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

	document.addEventListener('drop', handleDrop);
	document.addEventListener('dragover', handleDragOver);
	document.addEventListener('dblclick', handleDoubleClick);

	return () => {
		document.removeEventListener('drop', handleDrop);
		document.removeEventListener('dragover', handleDragOver);
		document.removeEventListener('dblclick', handleDoubleClick);
	};
}
