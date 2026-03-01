# Development Guide

This document covers the setup, tooling, and conventions for the uyuk repository.

## Development Environment

- Node.js 20+
- pnpm 9+
- [GitHub CLI (`gh`)](https://cli.github.com/) — for PRs and repo operations
- TanStack Start (Frontend + API)
- Convex (Backend)
- Tailwind CSS v4

## Prerequisites and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/moetazaneta/uyuk.git
   cd uyuk
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up Convex:
   ```bash
   npx convex dev
   ```
   Follow the prompts to create a new project. This command will also generate `convex.json` and start the backend development server.

4. Configure environment variables:
   Copy `.env.example` to `.env.local` and fill in the required values.
   ```bash
   cp .env.example .env.local
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Run tests:
   ```bash
   pnpm test
   ```

## TypeScript Configuration

We use strict TypeScript settings to ensure type safety across the TanStack Start and Convex boundary.

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "paths": {
      "~/*": ["./src/*"]
    },
    "resolveJsonModule": true,
    "types": ["vite/client"],
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "convex"]
}
```

## oxlint Configuration

We use oxlint for fast, Rust-based linting. It replaces ESLint for better performance.

How to run: `pnpm lint`

### .oxlintrc.json

```json
{
  "rules": {
    "no-unused-vars": "error",
    "no-explicit-any": "error",
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"]
      }
    ],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-has-content": "error"
  }
}
```

## Formatting

We use Biome for fast formatting and linting.

- No semicolons
- Single quotes
- Tab width: 2

### biome.json

```json
{
  "$schema": "https://biomejs.dev/schemas/1.8.3/schema.json",
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineEnding": "lf",
    "lineWidth": 80,
    "attributePosition": "auto"
  },
  "javascript": {
    "formatter": {
      "jsxQuoteStyle": "double",
      "quoteProperties": "asNeeded",
      "trailingCommas": "all",
      "semicolons": "asNeeded",
      "arrowParentheses": "always",
      "bracketSpacing": true,
      "bracketSameLine": false,
      "quoteStyle": "single",
      "attributePosition": "auto"
    }
  }
}
```

## Git Hooks

We use Lefthook for managing git hooks.

### lefthook.yml

```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{js,ts,jsx,tsx}"
      run: pnpm exec oxlint {staged_files}
    format:
      glob: "*.{js,ts,jsx,tsx,json,md}"
      run: pnpm exec biome format --write {staged_files}
```

## Git Workflow

### Branching

- `main` is the production branch. Never push directly to it.
- Create feature branches from `main`:
  ```bash
  git checkout -b feat/habit-creation
  ```
- Branch naming: `feat/`, `fix/`, `chore/`, `docs/` prefixes.

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add habit creation form
fix: correct streak calculation for timezone edge case
chore: configure biome formatter
docs: add git workflow guide
refactor: extract color picker into standalone component
test: add integration tests for table view
```

Rules:
- Lowercase, no period at the end.
- Use imperative mood ("add" not "added").
- Keep the subject line under 72 characters.
- Add a body for non-obvious changes (blank line after subject):
  ```
  fix: prevent double-tap registering two completions

  The tap handler was not debounced, causing rapid taps to fire
  multiple mutations. Added a 200ms debounce to the cell onClick.
  ```

### Pull Requests

Use the [GitHub CLI (`gh`)](https://cli.github.com/) for creating and merging PRs:

```bash
# Push your branch
git push -u origin feat/habit-creation

# Create a PR
gh pr create --title "feat: add habit creation form" --body "Summary of changes"

# Squash merge when CI passes
gh pr merge --squash --delete-branch
```

Rules:
- PR title follows conventional commit format.
- CI must pass (lint, typecheck, test, build) before merging.
- Squash merge into `main` to keep history clean.

## Code Conventions

### File Naming

- Components: PascalCase (e.g., `HabitForm.tsx`)
- Utilities: kebab-case (e.g., `date-utils.ts`)
- Constants: camelCase for filenames, UPPER_CASE for exports
- Convex functions: camelCase (e.g., `habits.ts`)
- Test files: `*.test.ts` or `*.test.tsx`, co-located with the source file
- Barrel exports: Avoid using them (e.g., no `index.ts` files solely for exporting)

### Component Patterns

- Use function components only.
- Props interface naming: `ComponentNameProps`.
- Provide explicit return types on exported functions.
- Prefer named exports over default exports.
- Co-locate the component, its types, and its test in the same directory.

### Import Ordering

1. External packages (e.g., `react`, `lucide-react`)
2. Internal absolute imports (e.g., `~/components`, `~/utils`)
3. Relative imports (e.g., `./HabitItem`)

Maintain a blank line between these groups.

### Error Handling

- Never swallow errors. No empty catch blocks.
- Use Result/Error types for expected failures.
- In Convex, use `ConvexError` for expected application-level errors.

## CI/CD Pipeline

We use GitHub Actions for our CI pipeline and Vercel for deployment.

### GitHub Actions Workflow (.github/workflows/ci.yml)

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Type check
        run: pnpm typecheck

      - name: Lint
        run: pnpm lint

      - name: Test
        run: pnpm test

      - name: Build
        run: pnpm build

  e2e:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || github.event_name == 'workflow_dispatch'
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - name: Install dependencies
        run: pnpm install
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run E2E tests
        run: pnpm test:e2e
```

### Vercel Deployment

- Main branch is automatically deployed to production.
- Pull requests trigger preview deployments.
- Convex deployment is managed via the Convex Vercel integration.

## Scripts

Defined in `package.json`:

- `dev`: `concurrently "pnpm dev:frontend" "pnpm dev:backend"`
- `build`: `tanstack-start build`
- `start`: `tanstack-start start`
- `lint`: `oxlint .`
- `format`: `biome format --write .`
- `format:check`: `biome format .`
- `typecheck`: `tsc --noEmit`
- `test`: `vitest run`
- `test:watch`: `vitest`
- `test:coverage`: `vitest run --coverage`
- `test:e2e`: `playwright test`
- `validate`: `pnpm typecheck && pnpm lint && pnpm test`

## Environment Variables

Required environment variables in `.env.local`:

```bash
# Convex
CONVEX_DEPLOYMENT=...
VITE_CONVEX_URL=...

# Auth (Public)
VITE_GOOGLE_CLIENT_ID=...
```

Convex environment variables are configured in the Convex dashboard and synced during `npx convex dev`.

## Recommended IDE Setup

- VS Code
- Extensions:
  - Tailwind CSS IntelliSense
  - Biome
  - Convex
- Settings:
  - `editor.formatOnSave: true`
  - `editor.defaultFormatter: "biomejs.biome"`
