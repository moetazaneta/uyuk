# uyuk — AI Agent Guidelines

## Project Overview

**uyuk** is a habit tracking web app inspired by HabitKit. Terminal-inspired aesthetic, dark-first, compact and dense UI with no borders or rounding.

## Tech Stack

| Layer       | Technology                              |
| ----------- | --------------------------------------- |
| Framework   | TanStack Start (React meta-framework)  |
| Router      | TanStack Router (file-based routing)   |
| Database    | Convex (real-time backend)             |
| Auth        | Convex Auth with Google OAuth          |
| Styling     | Tailwind CSS v4                        |
| Language    | TypeScript (strict mode)               |
| Linting     | oxlint                                 |
| Formatting  | Biome                                  |
| Testing     | Vitest + React Testing Library         |
| E2E Testing | Playwright                             |
| Deployment  | Vercel + GitHub Actions                |
| Package Mgr | pnpm                                   |

## Project Structure

```
uyuk/
├── .ai/                    # AI agent rules (this file + library rules)
│   ├── AGENTS.md           # ← You are here
│   └── rules/              # Library-specific AI coding rules
│       ├── convex.md       # Convex official rules (ALWAYS ACTIVE)
│       ├── tanstack.md     # TanStack Router/Start rules (ALWAYS ACTIVE)
│       ├── tailwind.md     # Tailwind CSS v4 rules (OPTIONAL)
│       ├── react.md        # React 19 rules (OPTIONAL)
│       ├── vitest.md       # Vitest testing rules (OPTIONAL)
│       └── playwright.md   # Playwright E2E rules (OPTIONAL)
├── .cursor/rules/          # Cursor AI rules
│   └── convex.mdc          # Convex rules for Cursor
├── .github/instructions/   # GitHub Copilot rules
│   └── convex.instructions.md
├── app/                    # TanStack Start app (routes, components)
├── convex/                 # Convex backend (schema, functions)
├── docs/                   # Project documentation
│   ├── README.md           # Documentation index
│   ├── PRD.md              # Product requirements
│   ├── ARCHITECTURE.md     # Technical architecture
│   ├── DESIGN.md           # Design system
│   ├── TESTING.md          # Testing strategy
│   ├── DEVELOPMENT.md      # Development setup
│   └── TASKS.md            # Task tracker
└── e2e/                    # Playwright E2E tests
```

## Rules Management

### Active Rules (Always Loaded)

These rules are critical for correct code generation:

- **`.ai/rules/convex.md`** — Convex database patterns, validators, schema design
- **`.ai/rules/tanstack.md`** — TanStack Router/Start routing, loaders, navigation

### Optional Rules (Enable/Disable as Needed)

These rules can be enabled or disabled. To **disable** a rule, rename the file to add a `.disabled` suffix:

```bash
# Disable a rule
mv .ai/rules/react.md .ai/rules/react.md.disabled

# Re-enable a rule
mv .ai/rules/react.md.disabled .ai/rules/react.md
```

Optional rules:

- **`.ai/rules/tailwind.md`** — Tailwind v4 utility patterns and migration gotchas
- **`.ai/rules/react.md`** — React 19 component patterns and hooks
- **`.ai/rules/vitest.md`** — Unit testing patterns with Vitest
- **`.ai/rules/playwright.md`** — E2E testing patterns with Playwright

### TanStack Official Rules (Post-Setup)

After project initialization, install TanStack's official AI rules from the NPM package:

```bash
pnpm add -g vibe-rules
vibe-rules install cursor    # For Cursor users
```

## Coding Conventions

### TypeScript

- Strict mode enabled — no `any`, no `@ts-ignore`, no `@ts-expect-error`
- Use `type` imports: `import type { Foo } from './foo'`
- Prefer `interface` for object shapes, `type` for unions/intersections
- Use `satisfies` operator for type-safe object literals
- All functions must have explicit return types in public APIs

### File Naming

- Components: `PascalCase.tsx` (e.g., `HabitGrid.tsx`)
- Utilities: `kebab-case.ts` (e.g., `date-utils.ts`)
- Convex functions: `kebab-case.ts` (e.g., `convex/habits.ts`)
- Tests: colocated `*.test.ts` / `*.test.tsx`
- E2E tests: `e2e/*.spec.ts`

### Component Patterns

- Functional components only, named exports
- Props interface named `{ComponentName}Props`
- One component per file, max 150 lines
- Colocate tests, types, and styles with component

### Imports

- Use path aliases: `~/*` for `src/*`
- Group imports: external → internal → relative → types
- No default exports (except route files and Convex schema)

### Error Handling

- Never empty catch blocks
- Use Convex's error handling patterns for backend
- Show user-friendly error messages, log technical details

### Data Fetching

- Use Convex reactive queries for real-time data
- Use TanStack Router loaders for initial data
- Never use `useEffect` for data fetching

## Design Principles

- **Dark-first**: Design for dark mode, adapt to light
- **Terminal aesthetic**: No borders, no rounding, compact and dense
- **Typography**: JetBrains Mono for data, Inter for labels/UI text
- **Grid cells**: Solid squares, NO gap, NO border-radius
- **Animations**: Minimal/subtle only
- **Mobile**: Bottom tab navigation
- **Desktop**: Sidebar navigation

## Key Product Rules

- Auth: Google OAuth only (via Convex Auth)
- Habits: Boolean (tap counter) and numeric (target + current)
- Frequency: Daily only in v1
- Archive: Hide but keep data
- Delete: Soft delete, can restore, never hard-delete from DB
- Ordering: Manual drag-and-drop
- Stats: Current streak, longest streak, total completions, completion rate %
- Backfill: Any past day
- Week start: Configurable (Mon/Sun)
- Online-only in v1

## Documentation

Full project documentation is in `/docs/`. Read these before implementing:

1. **PRD.md** — What to build and why
2. **ARCHITECTURE.md** — How it's structured
3. **DESIGN.md** — How it looks
4. **TESTING.md** — How to test
5. **DEVELOPMENT.md** — How to set up and develop
6. **TASKS.md** — What's done and what's next
