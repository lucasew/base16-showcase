import themeStore from '$lib/stores/themes';
import type { Theme } from '$lib/Model';
import { normalizeColor, normalizeColorKeys } from '$lib/utils/theme';
import { sanitize } from '$lib/utils/security';
import { parseSimpleYaml } from '$lib/utils/yaml';
import { reportError } from '$lib/utils/error';

let themeCounter = 0;

/**
 * Processes a single theme structure and adds it to the global store.
 * @param obj - The raw theme object.
 * @param filename - Optional. The original filename.
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
 * Loads the default set of themes from the static asset /nix-colors.json.
 */
export async function loadDefaultThemes() {
	try {
		const assetAPI = await fetch('/nix-colors.json');
		if (!assetAPI.ok) {
			throw new Error(`Failed to fetch default themes: ${assetAPI.statusText}`);
		}
		const assetAPIJSON = await assetAPI.json();
		for (const theme of Object.values(assetAPIJSON)) {
			handleOneStructure(theme as any);
		}
	} catch (error) {
		reportError(error, { phase: 'loadDefaultThemes' });
	}
}

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

	let content: string;
	try {
		content = await file.text();
	} catch (error) {
		reportError(error, { filename: file.name, phase: 'read_file' });
		return;
	}
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
	} catch (error) {
		// JSON parsing failed, try YAML
		reportError(error, { filename, phase: 'json_parse_fallback', expected: true });
	}

	// Try YAML parsing
	try {
		const structure = parseSimpleYaml(content);
		handleOneStructure(structure, filename);
	} catch (yamlError) {
		reportError(yamlError, { filename, phase: 'yaml_parse' });
	}
}

function handleFilesInput(_files: FileList | null) {
	if (!_files) return;
	const files = Array.from(_files);
	return Promise.all(files.map(processFile));
}

/**
 * Initializes global event listeners for file handling.
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
