/**
 * Normalizes and validates a color string to ensure it is a safe hex code.
 *
 * This function mitigates CSS injection risks by strictly allowing only valid hex characters
 * and standard hex lengths (3, 4, 6, 8).
 *
 * @param color - The input value (typically a string, e.g., "#fff", "123456").
 * @returns The normalized hex string with a leading "#", or an empty string if invalid.
 */
export function normalizeColor(color: unknown): string {
	if (!color) return '';
	const colorStr = String(color);
	const hex = colorStr.startsWith('#') ? colorStr.substring(1) : colorStr;

	// Validate that the color is a valid hex code to prevent CSS injection.
	// It must only contain hex characters and have a valid length (3, 4, 6, or 8).
	if (!/^[0-9a-fA-F]+$/.test(hex) || ![3, 4, 6, 8].includes(hex.length)) {
		return ''; // Return a safe, empty string if invalid.
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
export function normalizeColorKeys(obj: Record<string, unknown>): Record<string, unknown> {
	// Convert all keys to lowercase, but only process color keys (base00-0f)
	const normalized: Record<string, unknown> = {};
	for (const key in obj) {
		// Only iterate over own properties to avoid prototype chain issues.
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const lowerKey = key.toLowerCase();
			// Only include keys that look like base colors
			if (lowerKey.match(/^base0[0-9a-f]$/)) {
				normalized[lowerKey] = obj[key];
			}
		}
	}
	return normalized;
}
