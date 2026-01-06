# Sentinel's Journal - CRITICAL LEARNINGS ONLY
## 2024-07-25 - Prototype Pollution via JSON.parse in YAML Parser
**Vulnerability:** The `parseSimpleYaml` function in `src/lib/stores/themes.ts` used `JSON.parse()` on values from user-provided YAML files. A malicious actor could craft a value like `{"__proto__": {"polluted": "true"}}` which, if parsed and merged unsafely, could pollute the Object prototype.

**Learning:** Using `JSON.parse()` on unsanitized, user-provided string values is a security risk. It can parse complex objects and arrays, creating a vector for prototype pollution if the application's logic doesn't defend against it.

**Prevention:** Avoid using `JSON.parse()` on arbitrary strings from user input. When parsing simple key-value files, use a safer, purpose-built parser that only handles expected primitive types (strings, numbers, booleans) and explicitly disallows object and array creation.
