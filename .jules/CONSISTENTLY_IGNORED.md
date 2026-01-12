# Consistently Ignored Changes

This file lists patterns of changes that have been consistently rejected by human reviewers. All agents MUST consult this file before proposing a new change. If a planned change matches any pattern described below, it MUST be abandoned.

---

## IGNORE: Sanitizing Theme Metadata for XSS Prevention

**- Pattern:** Do not attempt to sanitize theme metadata fields (like `name`, `author`) against XSS attacks.
**- Justification:** This change has been proposed multiple times by Sentinel and consistently rejected. While well-intentioned, the risk of XSS from theme metadata in this application is considered negligible, and the sanitization logic has been deemed unnecessary by the maintainers. It is treated as a false positive.
**- Files Affected:** `src/lib/stores/themes.ts`

---
