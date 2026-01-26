import { writable } from "svelte/store";
import type { Maybe, Theme } from "$lib/Model";

const _themeStore = writable<Maybe<Record<string, Theme>>>(null);

/**
 * Global store for managing loaded Base16 themes.
 *
 * Exposes a read-only subscription and a set method (though internal updates use the private `_themeStore`).
 * The store value is a record mapping theme slugs to `Theme` objects, or `null` if not initialized.
 */
const themeStore = {
  subscribe: _themeStore.subscribe,
  set: _themeStore.set,
};

let themeCounter = 0;

/**
 * Normalizes and validates a color string to ensure it is a safe hex code.
 *
 * This function mitigates CSS injection risks by strictly allowing only valid hex characters
 * and standard hex lengths (3, 4, 6, 8).
 *
 * @param color - The input color string (e.g., "#fff", "123456").
 * @returns The normalized hex string with a leading "#", or an empty string if invalid.
 */
function normalizeColor(color: string | undefined): string {
  if (!color) return "";
  const hex = color.startsWith("#") ? color.substring(1) : color;

  // Validate that the color is a valid hex code to prevent CSS injection.
  // It must only contain hex characters and have a valid length (3, 4, 6, or 8).
  if (!/^[0-9a-fA-F]+$/.test(hex) || ![3, 4, 6, 8].includes(hex.length)) {
    return ""; // Return a safe, empty string if invalid.
  }

  return `#${hex}`;
}

/**
 * Filters an object to only include keys that match the Base16 color pattern (base00-base0f).
 *
 * Keys are normalized to lowercase.
 *
 * @param obj - The input object containing potential color definitions.
 * @returns A new object containing only valid color keys.
 */
function normalizeColorKeys(obj: any): any {
  // Convert all keys to lowercase, but only process color keys (base00-0f)
  const normalized: any = {};
  for (const key in obj) {
    // Only include keys that look like base colors
    if (key.toLowerCase().match(/^base0[0-9a-f]$/)) {
      normalized[key.toLowerCase()] = obj[key];
    }
  }
  return normalized;
}

const FORBIDDEN_KEYS = ["__proto__", "constructor", "prototype"];

/**
 * Sanitizes object keys to prevent prototype pollution attacks.
 *
 * @param key - The object key to check.
 * @returns The original key, or a prefixed version (e.g., "safe-__proto__") if it is forbidden.
 */
function sanitize(key: string): string {
  if (FORBIDDEN_KEYS.includes(key)) {
    // Prepend "safe-" to dangerous keys to neutralize them.
    return `safe-${key}`;
  }
  return key;
}

function handleOneStructure(obj: any, filename?: string) {
  let slug = sanitize(obj.scheme || obj.slug);

  // Generate automatic name if slug is missing
  if (!slug) {
    if (filename) {
      // Use filename without extension
      slug = filename.replace(/\.(json|yaml|yml)$/i, "");
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
        const key = `base0${i.toString(16)}` as keyof Theme["colors"];
        return [key, normalizeColor(colors[key])];
      }),
    ) as Theme["colors"],
  };
  _themeStore.update((old) => {
    return {
      ...(old || {}),
      [slug]: theme,
    };
  });
}

/**
 * Loads the default set of themes from the static asset `/nix-colors.json`.
 *
 * This function is typically called on app initialization to populate the store.
 */
export async function loadDefaultThemes() {
  const assetAPI = await fetch("/nix-colors.json");
  const assetAPIJSON = await assetAPI.json();
  for (const theme of Object.values(assetAPIJSON)) {
    handleOneStructure(theme as any);
  }
}

/**
 * Parses a single YAML value into a primitive type (string, number, boolean).
 *
 * This custom parser avoids the risks of `JSON.parse` or full YAML parsers when handling
 * untrusted input, ensuring only simple primitives are returned.
 *
 * @param value - The raw string value from the YAML line.
 * @returns The parsed value as a boolean, number, or string.
 */
function parseYamlValue(value: string): string | number | boolean {
  // Safely parse a YAML value without using JSON.parse to prevent prototype pollution.
  const trimmedValue = value.trim();

  // Boolean check
  if (trimmedValue === "true") return true;
  if (trimmedValue === "false") return false;

  // Number check (integer or float)
  const num = Number(trimmedValue);
  if (!isNaN(num) && isFinite(num) && trimmedValue !== "") {
    return num;
  }

  // String fallback (remove quotes if present)
  if (
    (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
    (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
  ) {
    return trimmedValue.slice(1, -1);
  }

  return trimmedValue;
}

/**
 * A hardened, simple YAML parser that only supports flat key-value pairs.
 *
 * Designed to prevent Denial of Service (DoS) and prototype pollution by avoiding
 * complex recursion and dangerous object construction patterns found in full YAML parsers.
 *
 * @param yaml - The raw YAML string.
 * @returns A dictionary of parsed key-value pairs.
 */
function parseSimpleYaml(yaml: string): Record<string, any> {
  // Parse simple YAML (one level depth)
  return yaml.split("\n").reduce((structure: Record<string, any>, line: string) => {
    const trimmedLine = line.trim();
    if (trimmedLine.length === 0 || trimmedLine.startsWith("#")) {
      return structure;
    }

    const colonIndex = trimmedLine.indexOf(":");
    if (colonIndex === -1) {
      return structure;
    }

    const rawKey = trimmedLine.substring(0, colonIndex).trim();
    if (rawKey.length === 0) {
      return structure;
    }

    const value = trimmedLine.substring(colonIndex + 1).trim();
    const key = sanitize(rawKey);
    structure[key] = parseYamlValue(value);

    return structure;
  }, {});
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
      `File "${file.name}" is larger than ${MAX_FILE_SIZE / 1024 / 1024}MB. Processing large files may cause performance issues. Do you want to continue?`,
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
      key.toLowerCase().match(/^base0[0-9a-f]$/),
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
  } catch (jsonError) {
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

if (typeof document !== "undefined") {
  document.addEventListener("drop", (ev: DragEvent) => {
    ev.preventDefault();
    if (ev.dataTransfer) {
      handleFilesInput(ev.dataTransfer.files);
    }
  });

  document.addEventListener("dragover", (ev) => {
    ev.preventDefault();
  });

  let doubleclickEngaged = false;
  document.addEventListener("dblclick", () => {
    const dataInput = document.getElementById("data-input") as HTMLInputElement;
    if (!dataInput) return;

    if (!doubleclickEngaged) {
      dataInput.addEventListener("change", (ev: Event) => {
        handleFilesInput((ev.target as HTMLInputElement).files);
      });
      doubleclickEngaged = true;
    }
    dataInput.click();
  });
}

export default themeStore;
