import { writable } from "svelte/store";
import type { Maybe, Theme } from "$lib/Model";

const _themeStore = writable<Maybe<Record<string, Theme>>>(null);

const themeStore = {
  subscribe: _themeStore.subscribe,
  set: _themeStore.set,
};

let themeCounter = 0;

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

function sanitizeSlug(slug: string): string {
  const forbidden = ["__proto__", "constructor", "prototype"];
  if (forbidden.includes(slug)) {
    // Prepend "safe-" to dangerous slugs to neutralize them.
    return `safe-${slug}`;
  }
  return slug;
}

function sanitizeKey(key: string): string {
  const forbidden = ["__proto__", "constructor", "prototype"];
  if (forbidden.includes(key)) {
    return `safe-${key}`;
  }
  return key;
}

function handleOneStructure(obj: any, filename?: string) {
  let slug = sanitizeSlug(obj.scheme || obj.slug);

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

export async function loadDefaultThemes() {
  const assetAPI = await fetch("/nix-colors.json");
  const assetAPIJSON = await assetAPI.json();
  for (const theme of Object.values(assetAPIJSON)) {
    handleOneStructure(theme as any);
  }
}

function parseSimpleYaml(yaml: string): Record<string, any> {
  // Parse simple YAML (one level depth)
  const structure: Record<string, any> = {};
  yaml
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      return trimmed.length > 0 && !trimmed.startsWith("#");
    })
    .forEach((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) return;

      const rawKey = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();

      if (rawKey.length > 0) {
        const key = sanitizeKey(rawKey);
        try {
          // Try to parse value as JSON (handles strings, numbers, booleans)
          structure[key] = JSON.parse(value);
        } catch {
          // If JSON parsing fails, treat as plain string
          structure[key] = value;
        }
      }
    });
  return structure;
}

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
