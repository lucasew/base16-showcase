# Sentinel's Journal - CRITICAL LEARNINGS ONLY
## 2024-07-25 - Prototype Pollution via JSON.parse in YAML Parser
**Vulnerability:** The `parseSimpleYaml` function in `src/lib/stores/themes.ts` used `JSON.parse()` on values from user-provided YAML files. A malicious actor could craft a value like `{"__proto__": {"polluted": "true"}}` which, if parsed and merged unsafely, could pollute the Object prototype.

**Learning:** Using `JSON.parse()` on unsanitized, user-provided string values is a security risk. It can parse complex objects and arrays, creating a vector for prototype pollution if the application's logic doesn't defend against it.

**Prevention:** Avoid using `JSON.parse()` on arbitrary strings from user input. When parsing simple key-value files, use a safer, purpose-built parser that only handles expected primitive types (strings, numbers, booleans) and explicitly disallows object and array creation.

## 2026-01-10 - Stored XSS in Theme Metadata
**Vulnerability:** User-provided theme files containing metadata like 'author' or 'scheme' were not sanitized before being stored. If this data were rendered on a page, it could lead to a stored Cross-Site Scripting (XSS) vulnerability, allowing an attacker to inject malicious scripts.
**Learning:** Any data originating from user-uploaded files, even if it seems benign like a theme name or author, must be treated as untrusted. Storing raw user input and rendering it later is a classic vector for XSS.
**Prevention:** Always sanitize data at the point of ingestion, before it is stored. For data intended to be displayed as plain text within HTML, this means escaping special HTML characters (like '<', '>', '&') to prevent them from being interpreted by the browser.
