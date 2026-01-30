const FORBIDDEN_KEYS = ['__proto__', 'constructor', 'prototype'];

/**
 * Sanitizes object keys to prevent prototype pollution attacks.
 *
 * @param key - The object key to check.
 * @returns The original key, or a prefixed version (e.g., "safe-__proto__") if it is forbidden.
 */
export function sanitize(key: string): string {
	if (FORBIDDEN_KEYS.includes(key)) {
		// Prepend "safe-" to dangerous keys to neutralize them.
		return `safe-${key}`;
	}
	return key;
}
