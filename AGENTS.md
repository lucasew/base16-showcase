# Agent Guidelines

## Tooling

- Use `mise` for all task execution.
- `mise.toml` tasks must use wildcard dependencies (e.g., `lint` depends on `["lint:*"]`).
- `package.json` scripts should wrap binary executions (e.g., `bun run lint:eslint`).

## Error Handling

- Use `reportError` from `src/lib/utils/error.ts` for all error reporting. Do not use `console.error` directly.

## CI/CD

- The repository must maintain EXACTLY ONE GitHub Actions workflow: `.github/workflows/autorelease.yml`.
