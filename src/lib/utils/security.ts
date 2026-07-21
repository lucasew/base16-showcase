const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Sanitizes object keys to prevent prototype pollution attacks.
 *
 * @param key - The object key to check.
 * @returns The original key, or a prefixed version (e.g., "safe-__proto__") if it is forbidden.
 */
export function sanitize(key: unknown): string {
	if (key == null) return '';
	const keyStr = String(key);
	if (FORBIDDEN_KEYS.has(keyStr)) {
		// Prepend "safe-" to dangerous keys to neutralize them.
		return `safe-${keyStr}`;
	}
	return keyStr;
}
