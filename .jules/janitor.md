## 2026-01-10 - Refactor `parseSimpleYaml` to use `reduce`
**Issue:** The `parseSimpleYaml` function used a combination of `filter` and `forEach` with an external mutable variable to construct a key-value object from a string. This approach, while functional, was less declarative and slightly harder to read.
**Root Cause:** The implementation was written in an imperative style, focusing on iterating and modifying state rather than on the data transformation itself.
**Solution:** I refactored the function to use a single `reduce` method. This consolidates the logic into one self-contained operation, making the code more concise and eliminating the need for a mutable variable outside the loop's scope.
**Pattern:** When transforming an array into a single value or object, prefer using `reduce` over chaining methods like `filter` and `forEach`. This functional approach often leads to cleaner, more declarative code that is easier to reason about.

## 2026-01-26 - Remove unused variables and unify color mapping
**Issue:** `src/lib/codemirrorTheme.ts` contained multiple unused variable declarations (`string2`, `property`, `meta`, `attribute`, `number`) and mixed two styles of color assignment (variable aliases vs direct property access).
**Root Cause:** Incomplete refactoring or legacy code where semantic names were defined but not consistently used or needed.
**Solution:** Removed unused variables and inlined the used ones (`variable`, `keyword`, etc.) to use `colors.baseXX` directly.
**Pattern:** Remove dead code and enforce a consistent style (direct property access) to improve readability and reduce noise.
