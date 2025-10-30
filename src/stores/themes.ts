import { writable } from "svelte/store";
import type { Maybe, Theme } from "../Model";

const _themeStore = writable<Maybe<Record<string, Theme>>>(null);

const themeStore = {
  subscribe: _themeStore.subscribe.bind(_themeStore),
};

let themeCounter = 0;

function normalizeColor(color: string | undefined): string {
  if (!color) return '';
  // Add # prefix if missing
  return color.startsWith('#') ? color : `#${color}`;
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

function handleOneStructure(obj: any, filename?: string) {
  console.log('handleOneStructure - input obj:', obj);

  let slug = obj.scheme || obj.slug;

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
  console.log('handleOneStructure - normalized colors:', colors);

  const theme: Theme = {
    author,
    name: slug,
    colors: {
      base00: normalizeColor(colors.base00),
      base01: normalizeColor(colors.base01),
      base02: normalizeColor(colors.base02),
      base03: normalizeColor(colors.base03),
      base04: normalizeColor(colors.base04),
      base05: normalizeColor(colors.base05),
      base06: normalizeColor(colors.base06),
      base07: normalizeColor(colors.base07),
      base08: normalizeColor(colors.base08),
      base09: normalizeColor(colors.base09),
      base0a: normalizeColor(colors.base0a),
      base0b: normalizeColor(colors.base0b),
      base0c: normalizeColor(colors.base0c),
      base0d: normalizeColor(colors.base0d),
      base0e: normalizeColor(colors.base0e),
      base0f: normalizeColor(colors.base0f),
    },
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
    Object.values(assetAPIJSON).map(handleOneStructure);
}

function parseSimpleYaml(yaml: string): any {
  // Parse simple YAML (one level depth)
  let structure = {};
  yaml
    .split("\n")
    .filter(line => {
      const trimmed = line.trim();
      return trimmed.length > 0 && !trimmed.startsWith('#');
    })
    .forEach((line) => {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) return;

      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();

      if (key.length > 0) {
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

function handleFilesInput(_files: FileList) {
  let files: File[] = [];
  for (let i = 0; i < _files.length; i++) {
    files.push(_files.item(i));
  }
  return Promise.all(
    files.map(async (file) => {
      const content = await file.text();
      const filename = file.name;

      // Try JSON first (regardless of file extension)
      try {
        const json = JSON.parse(content);

        // Check if it has color keys directly (single theme with colors at root)
        const hasColorKeys = Object.keys(json).some(key =>
          key.toLowerCase().match(/^base0[0-9a-f]$/)
        );

        if (hasColorKeys || json.slug !== undefined || json.scheme !== undefined || json.colors !== undefined) {
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
    })
  );
}
document.addEventListener("drop", (ev: DragEvent) => {
  ev.preventDefault();
  handleFilesInput(ev.dataTransfer.files);
});

document.addEventListener("dragover", (ev) => {
  ev.preventDefault();
});

let doubleclickEngaged = false;
document.addEventListener("dblclick", () => {
  if (!doubleclickEngaged) {
    document
      .getElementById("data-input")
      .addEventListener("change", (ev: InputEvent) => {
        handleFilesInput((ev.target as HTMLInputElement).files);
      });
    doubleclickEngaged = true;
  }
  document.getElementById("data-input").click();
});

export default themeStore;
