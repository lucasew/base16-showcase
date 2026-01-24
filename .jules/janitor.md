## 2026-01-10 - Refactor `parseSimpleYaml` to use `reduce`
**Issue:** The `parseSimpleYaml` function used a combination of `filter` and `forEach` with an external mutable variable to construct a key-value object from a string. This approach, while functional, was less declarative and slightly harder to read.
**Root Cause:** The implementation was written in an imperative style, focusing on iterating and modifying state rather than on the data transformation itself.
**Solution:** I refactored the function to use a single `reduce` method. This consolidates the logic into one self-contained operation, making the code more concise and eliminating the need for a mutable variable outside the loop's scope.
**Pattern:** When transforming an array into a single value or object, prefer using `reduce` over chaining methods like `filter` and `forEach`. This functional approach often leads to cleaner, more declarative code that is easier to reason about.

## 2026-01-24 - Extract Regex Patterns to Constants
**Issue:** Inline regex literals were used repeatedly in loops and functions within `src/lib/stores/themes.ts`. This causes regex recompilation on each execution and makes the code less readable (magic strings/patterns).
**Root Cause:** The regex patterns were defined directly where they were used, likely for convenience during initial development.
**Solution:** Extracted `HEX_COLOR_REGEX`, `BASE_COLOR_KEY_REGEX`, and `FILE_EXTENSION_REGEX` to top-level constants. Replaced usages with these constants and switched to `.test()` for boolean checks where appropriate.
**Pattern:** Define regex patterns as named constants at the top of the file/module. This improves performance (avoiding recompilation), readability (giving the pattern a name), and maintainability (single source of truth).
