# Consistently Ignored Changes

This file lists patterns of changes that have been consistently rejected by human reviewers. All agents MUST consult this file before proposing a new change. If a planned change matches any pattern described below, it MUST be abandoned.

---

## IGNORE: Sanitizing Theme Metadata for XSS Prevention

**- Pattern:** Do not attempt to sanitize theme metadata fields (like `name`, `author`) against XSS attacks.
**- Justification:** This change has been proposed multiple times by Sentinel and consistently rejected. While well-intentioned, the risk of XSS from theme metadata in this application is considered negligible, and the sanitization logic has been deemed unnecessary by the maintainers. It is treated as a false positive.
**- Files Affected:** `src/lib/stores/themes.ts`

## IGNORE: Stylistic Loops (forEach vs for..of)

**- Pattern:** Refactoring `for..of` loops to `forEach` (or vice versa) without functional benefit.
**- Justification:** These are stylistic lateral moves that create noise and churn without improving code quality or performance.
**- Files Affected:** `*.ts`, `*.js`, `*.svelte`

## IGNORE: Removing Semantic Variable Aliases in Themes

**- Pattern:** Removing intermediate variable aliases (e.g., `const keyword = colors.base0E`) in favor of direct property access (e.g., `color: colors.base0E`) in theme or highlighting definitions.
**- Justification:** These aliases provide semantic meaning and context (mapping Base16 colors to syntax tokens) which is valuable for maintainability and documentation of the mapping logic.
**- Files Affected:** `src/lib/codemirrorTheme.ts`

## IGNORE: Extracting Regex Constants

**- Pattern:** Extracting regex literals to top-level constants when they are used in limited scope (1-2 times) inside stores or services.
**- Justification:** Unless the regex is complex or reused widely, extracting it increases cognitive load by separating definition from usage and has been rejected as unnecessary optimization.
**- Files Affected:** `src/lib/stores/*.ts`, `src/lib/services/*.ts`

## IGNORE: Mise Task Chaining

**- Pattern:** Defining `mise` tasks using shell chaining (e.g., `cmd1 && cmd2`) for complex workflows like CI.
**- Justification:** The project prefers using `mise`'s dependency system (`depends = [...]`) for task orchestration to ensure parallel execution where possible and cleaner definitions.
**- Files Affected:** `mise.toml`

## IGNORE: Automated Codegen PR Workflow

**- Pattern:** Creating a GitHub Actions workflow (e.g., `autorelease.yml`) that runs codegen tasks and automatically creates a Pull Request for changes.
**- Justification:** Multiple attempts to implement this automation have been rejected. The complexity and potential for noise (churning PRs) are unwanted. The repository prefers a single, simple autorelease workflow.
**- Files Affected:** `.github/workflows/*.yml`

## IGNORE: Wildcard Mise Task Dependencies

**- Pattern:** Using wildcard dependencies in `mise.toml` (e.g., `depends = ["lint:*"]`) instead of explicit lists.
**- Justification:** The project prefers explicit lists of dependencies (e.g., `["lint:eslint", "lint:prettier"]`) to ensure deterministic execution order and clarity.
**- Files Affected:** `mise.toml`

## IGNORE: Redundant Color Normalization in Store

**- Pattern:** Modifying `src/lib/stores/themes.ts` to implement `normalizeColor` with `unknown` type input or explicit string coercion.
**- Justification:** This logic is already correctly implemented in `src/lib/utils/theme.ts`. Modifying the store file is incorrect (wrong location) and redundant.
**- Files Affected:** `src/lib/stores/themes.ts`

## IGNORE: Sanitizing Filename Fallback in Theme Loader

**- Pattern:** Adding sanitization logic to the filename fallback path in `handleOneStructure` (e.g., `sanitize(filename)`).
**- Justification:** Consistently rejected. The risk of prototype pollution from filenames in this context is considered negligible or false positive by maintainers.
**- Files Affected:** `src/lib/services/themeLoader.ts`, `src/lib/stores/themes.ts`

## IGNORE: Out-of-Scope Formatting

**- Pattern:** Running formatters (like Prettier) on files outside the explicit scope of the assigned task.
**- Justification:** Formatting unrelated files creates large, noisy diffs that obscure the core logic changes, making PRs harder to review. Changes must be strictly scoped to the problem at hand.
**- Files Affected:** `**/*`

## IGNORE: Unprompted Dependency Upgrades

**- Pattern:** Submitting PRs solely to bump dependency versions without an explicit user request.
**- Justification:** Dependency upgrades that are not tied to a specific feature or bug fix add noise and risk regressions. The project relies on explicit requests for upgrades or pins specific versions.
**- Files Affected:** `package.json`, `bun.lock`

---
