## 2026-01-10 - Refactor `parseSimpleYaml` to use `reduce`

**Issue:** The `parseSimpleYaml` function used a combination of `filter` and `forEach` with an external mutable variable to construct a key-value object from a string. This approach, while functional, was less declarative and slightly harder to read.
**Root Cause:** The implementation was written in an imperative style, focusing on iterating and modifying state rather than on the data transformation itself.
**Solution:** I refactored the function to use a single `reduce` method. This consolidates the logic into one self-contained operation, making the code more concise and eliminating the need for a mutable variable outside the loop's scope.
**Pattern:** When transforming an array into a single value or object, prefer using `reduce` over chaining methods like `filter` and `forEach`. This functional approach often leads to cleaner, more declarative code that is easier to reason about.

## 2026-02-02 - Extract and reuse regex constants

**Issue:** Regex literals for validating hex colors and Base16 keys were duplicated across `src/lib/utils/theme.ts` and `src/lib/stores/themes.ts`.
**Root Cause:** Lack of shared constants for common validation patterns leads to code duplication and potential inconsistency.
**Solution:** Extracted `HEX_CHARS_REGEX` and `BASE16_KEY_REGEX` into `src/lib/utils/theme.ts`, exported the latter, and updated consuming code to use these constants. Also extracted `THEME_FILE_EXTENSIONS_REGEX` in the store.
**Pattern:** Extract repeated regex literals into top-level named constants. This avoids runtime recompilation, eliminates duplication, and acts as self-documentation.
