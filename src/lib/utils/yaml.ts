import { sanitize } from './security';

/**
 * Parses a single YAML value into a primitive type (string, number, boolean).
 *
 * This custom parser avoids the risks of `JSON.parse` or full YAML parsers when handling
 * untrusted input, ensuring only simple primitives are returned.
 *
 * @param value - The raw string value from the YAML line.
 * @returns The parsed value as a boolean, number, or string.
 */
export function parseYamlValue(value: string): string | number | boolean {
	// Safely parse a YAML value without using JSON.parse to prevent prototype pollution.
	const trimmedValue = value.trim();

	// Boolean check
	if (trimmedValue === 'true') return true;
	if (trimmedValue === 'false') return false;

	// Number check (integer or float)
	const num = Number(trimmedValue);
	if (!isNaN(num) && isFinite(num) && trimmedValue !== '') {
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
export function parseSimpleYaml(yaml: string): Record<string, any> {
	// Parse simple YAML (one level depth)
	return yaml.split('\n').reduce((structure: Record<string, any>, line: string) => {
		const trimmedLine = line.trim();
		if (trimmedLine.length === 0 || trimmedLine.startsWith('#')) {
			return structure;
		}

		const colonIndex = trimmedLine.indexOf(':');
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
