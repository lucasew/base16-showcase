## 2026-01-10 - Refactor `parseSimpleYaml` to use `reduce`
**Issue:** The `parseSimpleYaml` function used a combination of `filter` and `forEach` with an external mutable variable to construct a key-value object from a string. This approach, while functional, was less declarative and slightly harder to read.
**Root Cause:** The implementation was written in an imperative style, focusing on iterating and modifying state rather than on the data transformation itself.
**Solution:** I refactored the function to use a single `reduce` method. This consolidates the logic into one self-contained operation, making the code more concise and eliminating the need for a mutable variable outside the loop's scope.
**Pattern:** When transforming an array into a single value or object, prefer using `reduce` over chaining methods like `filter` and `forEach`. This functional approach often leads to cleaner, more declarative code that is easier to reason about.

## 2026-01-12 - Refactor color object creation to use reduce
**Issue:** The `handleOneStructure` function used a combination of `Object.fromEntries` and `Array.from` to create the `colors` object. This approach was less declarative and more verbose than it needed to be.
**Root Cause:** The implementation was written in an imperative style, focusing on creating an array of entries and then converting it to an object.
**Solution:** I refactored the function to use a single `reduce` method. This consolidates the logic into one self-contained operation, making the code more concise and easier to read.
**Pattern:** When transforming an array into an object, prefer using `reduce` over chaining methods like `map` and `Object.fromEntries`. This functional approach often leads to cleaner, more declarative code.
