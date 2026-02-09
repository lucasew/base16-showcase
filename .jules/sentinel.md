# Sentinel's Journal - CRITICAL LEARNINGS ONLY

## 2024-07-25 - Prototype Pollution via JSON.parse in YAML Parser

**Vulnerability:** The `parseSimpleYaml` function in `src/lib/stores/themes.ts` used `JSON.parse()` on values from user-provided YAML files. A malicious actor could craft a value like `{"__proto__": {"polluted": "true"}}` which, if parsed and merged unsafely, could pollute the Object prototype.

**Learning:** Using `JSON.parse()` on unsanitized, user-provided string values is a security risk. It can parse complex objects and arrays, creating a vector for prototype pollution if the application's logic doesn't defend against it.

**Prevention:** Avoid using `JSON.parse()` on arbitrary strings from user input. When parsing simple key-value files, use a safer, purpose-built parser that only handles expected primitive types (strings, numbers, booleans) and explicitly disallows object and array creation.

## 2026-01-25 - Content Security Policy (CSP) Implementation

**Vulnerability:** Missing Content Security Policy (CSP) headers allowed potential execution of unauthorized scripts and resources, increasing the risk of Cross-Site Scripting (XSS) and other injection attacks.

**Learning:** Implementing CSP is a critical defense-in-depth measure. For SvelteKit apps, using `kit.csp` with `mode: 'nonce'` is effective for handling inline scripts used during hydration and initial setup.

**Prevention:** Always configure CSP headers in `svelte.config.js`. Ensure inline scripts in `app.html` include the `nonce="%sveltekit.nonce%"` attribute to be whitelisted by the policy.

## 2026-01-26 - DoS Vulnerability in Color Normalization

**Vulnerability:** The `normalizeColor` function in `src/lib/utils/theme.ts` assumed input was always a string or undefined. When parsing JSON theme files, numerical values (e.g., `123456`) could be passed, causing a crash (`TypeError: color.startsWith is not a function`) and leading to a Denial of Service.

**Learning:** TypeScript types are erased at runtime. When handling user-provided data (like JSON files), explicit type coercion or validation is necessary to prevent runtime crashes, even if the types say otherwise. Updating function signatures to accept `unknown` can help enforce safe handling of untrusted input.

**Prevention:** Explicitly coerce potential string inputs using `String()` or validate `typeof` before calling string methods when dealing with external data. Update TS signatures to reflect that input might be untrusted (`unknown`).

- 2026-01-27: [Ignored Errors] Swallowing errors or using console.error directly hides failures; always use a centralized reportError function.
