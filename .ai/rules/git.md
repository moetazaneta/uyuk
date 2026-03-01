# Git Rules — uyuk

Project-specific git conventions. Loaded alongside the `git-master` skill.

## Branching

- `main` is production. Never push directly.
- Branch from `main` with prefixes: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`, `test/`
- Example: `git checkout -b feat/habit-creation`

## Commit Style

**Style: SEMANTIC (Conventional Commits). Language: ENGLISH. Lowercase.**

```
feat: add habit creation form
fix: correct streak calculation for timezone edge case
chore: configure biome formatter
docs: update architecture guide
refactor: extract color picker into standalone component
test: add integration tests for table view
```

Rules:
- Lowercase, imperative mood, no period at end
- Subject line under 72 characters
- Add body (blank line after subject) for non-obvious changes

## Pull Requests

- Push branch, open PR against `main`
- PR title = conventional commit format
- CI must pass (lint, typecheck, test, build) before merge
- Squash merge to keep history clean

## Pre-commit Hooks (Lefthook)

The project uses Lefthook. On commit, staged files are automatically:
- Linted with `oxlint`
- Formatted with `biome`

If hooks fail, fix the issues before committing. Never skip hooks.
