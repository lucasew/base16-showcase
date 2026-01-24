# Sentinel's Journal - CRITICAL LEARNINGS ONLY
## 2024-07-25 - Prototype Pollution via JSON.parse in YAML Parser
**Vulnerability:** The `parseSimpleYaml` function in `src/lib/stores/themes.ts` used `JSON.parse()` on values from user-provided YAML files. A malicious actor could craft a value like `{"__proto__": {"polluted": "true"}}` which, if parsed and merged unsafely, could pollute the Object prototype.

**Learning:** Using `JSON.parse()` on unsanitized, user-provided string values is a security risk. It can parse complex objects and arrays, creating a vector for prototype pollution if the application's logic doesn't defend against it.

**Prevention:** Avoid using `JSON.parse()` on arbitrary strings from user input. When parsing simple key-value files, use a safer, purpose-built parser that only handles expected primitive types (strings, numbers, booleans) and explicitly disallows object and array creation.

## 2026-01-24 - DoS via Type Confusion in Color Normalization
**Vulnerability:** The `normalizeColor` function in `src/lib/stores/themes.ts` assumed input was always a string. If a user-provided theme file (JSON) contained numeric color values, parsing would succeed but `normalizeColor` would throw a runtime error (`TypeError: color.startsWith is not a function`), causing a client-side crash (DoS).
**Learning:** TypeScript types (`string | undefined`) do not guarantee runtime safety when data comes from external sources like `JSON.parse`. `JSON.parse` preserves types (numbers remain numbers), bypassing string-only assumptions.
**Prevention:** Always coerce untrusted input to the expected type before applying type-specific methods. For strings, use `String(input)` or explicit checks.
