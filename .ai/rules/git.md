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

Use `gh` CLI for all PR operations:

```bash
# Create PR
gh pr create --title "feat: description" --body "Summary"

# Squash merge when ready
gh pr merge --squash --delete-branch
```

- PR title = conventional commit format
- CI must pass before merge
- Squash merge to keep history clean

## Pre-commit Hooks (Lefthook)

The project uses Lefthook. On commit, staged files are automatically:

- Linted with `oxlint`
- Formatted with `biome`

If hooks fail, fix the issues before committing. Never skip hooks.

## Phase Completion Workflow

At the end of every phase, run the full branch → PR → merge cycle. Never commit phase work directly to `main`.

```bash
# 1. Verify previous phase PR was merged to main
gh pr list --state merged

# 2. Switch to main and pull latest
git checkout main && git pull origin main

# 3. Create a new branch for the phase
git checkout -b feat/phase-N-<slug>   # e.g. feat/phase-3-app-shell

# 4. Commit work (multiple atomic commits per git-master conventions)
git add -p && git commit -m "feat: ..."

# 5. Push and open PR
git push -u origin feat/phase-N-<slug>
gh pr create --title "feat: <description> (Phase N)" --body "## Summary\n- ..."

# 6. Squash merge and delete branch
gh pr merge --squash --delete-branch

# 7. Pull main to sync local
git checkout main && git pull origin main
```

Rules:

- Branch name: `feat/phase-N-<slug>` (lowercase, hyphenated)
- PR title: conventional commit format + `(Phase N)` suffix
- Always squash merge — keeps `main` history one-commit-per-phase
- Delete the remote branch after merge (`--delete-branch` flag)
- Delete the local stale branch: `git branch -d feat/phase-N-<slug>`
- Never skip this cycle, even for "small" phases
