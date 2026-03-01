# Task Tracker: uyuk

This document tracks all implementation tasks for uyuk. Tasks are organized by phase and dependency order. Each task has a status, priority, and estimated complexity.

## Status Legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete
- `[-]` Blocked
- `[!]` Needs review

## Priority

- **P0**: Must have for launch. Blocks other work.
- **P1**: Must have for launch. Can be parallelized.
- **P2**: Should have. Improves quality but not blocking.
- **P3**: Nice to have. Future scope.

## Complexity

- **S**: Small (< 2 hours)
- **M**: Medium (2-8 hours)
- **L**: Large (1-3 days)
- **XL**: Extra large (3+ days)

---

## Phase 0: Project Scaffolding

| #    | Task                                        | Priority | Size | Status | Notes                                     |
| ---- | ------------------------------------------- | -------- | ---- | ------ | ----------------------------------------- |
| 0.1  | Initialize TanStack Start project with pnpm | P0       | S    | [ ]    | `pnpm create @tanstack/start`             |
| 0.2  | Configure TypeScript strict mode            | P0       | S    | [ ]    | tsconfig.json per DEVELOPMENT.md          |
| 0.3  | Set up Tailwind CSS v4                      | P0       | S    | [ ]    | Install, configure entry point            |
| 0.4  | Set up Convex backend                       | P0       | S    | [ ]    | `npx convex init`, configure schema       |
| 0.5  | Configure oxlint                            | P0       | S    | [ ]    | Rules per DEVELOPMENT.md                  |
| 0.6  | Configure oxfmt formatter                   | P2       | S    | [ ]    | Format config, format-on-save             |
| 0.7  | Set up Vitest + React Testing Library       | P1       | S    | [ ]    | Config, test utils, first passing test    |
| 0.8  | Set up Playwright                           | P2       | S    | [ ]    | Config, first passing e2e test            |
| 0.9  | Set up git hooks (Lefthook)                 | P2       | S    | [ ]    | Pre-commit: lint + format                 |
| 0.10 | Configure path aliases (~/ imports)         | P2       | S    | [ ]    | tsconfig paths + bundler config           |
| 0.11 | Add base fonts (Inter + JetBrains Mono)     | P1       | S    | [ ]    | Google Fonts or self-hosted               |
| 0.12 | Define Tailwind theme tokens                | P1       | M    | [ ]    | Colors, spacing, typography per DESIGN.md |

---

## Phase 1: Authentication

| #   | Task                                              | Priority | Size | Status | Notes                                 |
| --- | ------------------------------------------------- | -------- | ---- | ------ | ------------------------------------- |
| 1.1 | Define Convex schema (users, habits, completions) | P0       | M    | [ ]    | Per ARCHITECTURE.md                   |
| 1.2 | Set up Convex Auth with Google OAuth              | P0       | M    | [ ]    | Auth config, provider setup           |
| 1.3 | Create auth page (/auth)                          | P0       | M    | [ ]    | Google sign-in button, redirect logic |
| 1.4 | Implement auth route guard                        | P0       | S    | [ ]    | Redirect unauthenticated to /auth     |
| 1.5 | Create root layout with auth provider             | P0       | M    | [ ]    | ConvexProvider, AuthProvider wrapping |
| 1.6 | Write integration tests for auth flow             | P1       | M    | [ ]    | Login, redirect, session persistence  |

---

## Phase 2: Core Data Layer (Convex)

| #    | Task                                    | Priority | Size | Status | Notes                                                      |
| ---- | --------------------------------------- | -------- | ---- | ------ | ---------------------------------------------------------- |
| 2.1  | Implement habits.create mutation        | P0       | S    | [ ]    | Validate input, set sortOrder                              |
| 2.2  | Implement habits.list query             | P0       | S    | [ ]    | Filter active, sort by sortOrder                           |
| 2.3  | Implement habits.update mutation        | P0       | S    | [ ]    | Partial update, set updatedAt                              |
| 2.4  | Implement habits.reorder mutation       | P0       | M    | [ ]    | Batch sortOrder update                                     |
| 2.5  | Implement habits.archive / unarchive    | P1       | S    | [ ]    | Toggle isArchived                                          |
| 2.6  | Implement habits.softDelete / restore   | P1       | S    | [ ]    | Toggle isDeleted                                           |
| 2.7  | Implement habits.archived query         | P1       | S    | [ ]    | List archived habits                                       |
| 2.8  | Implement habits.deleted query          | P1       | S    | [ ]    | List soft-deleted habits                                   |
| 2.9  | Implement completions.upsert mutation   | P0       | M    | [ ]    | Create or update per habit+date                            |
| 2.10 | Implement completions.clear mutation    | P1       | S    | [ ]    | Reset value to 0 (never delete records)                    |
| 2.11 | Implement completions.byDateRange query | P0       | M    | [ ]    | Fetch completions within date range                        |
| 2.12 | Implement completions.byHabit query     | P1       | S    | [ ]    | All completions for one habit                              |
| 2.13 | Implement stats.forHabit query          | P1       | M    | [ ]    | Streak, longest streak, total completions, completion rate |
| 2.14 | Implement user.settings query           | P1       | S    | [ ]    | Get current user preferences                               |
| 2.15 | Implement user.updateSettings mutation  | P1       | S    | [ ]    | Update weekStartDay, timezone, etc.                        |
| 2.16 | Write unit tests for streak calculation | P1       | M    | [ ]    | Edge cases: gaps, timezone, new habits                     |
| 2.17 | Write backend tests for data isolation  | P1       | M    | [ ]    | User A cannot see User B data                              |

---

## Phase 3: App Shell and Navigation

| #   | Task                                     | Priority | Size | Status | Notes                                      |
| --- | ---------------------------------------- | -------- | ---- | ------ | ------------------------------------------ |
| 3.1 | Create app shell layout component        | P0       | M    | [ ]    | Sidebar (desktop) + bottom tabs (mobile)   |
| 3.2 | Implement sidebar navigation (desktop)   | P0       | M    | [ ]    | Table, Grids, Settings links, active state |
| 3.3 | Implement bottom tab bar (mobile)        | P0       | M    | [ ]    | Table, Grids, Settings tabs                |
| 3.4 | Set up route structure                   | P0       | S    | [ ]    | /, /table, /grids, /settings, /auth        |
| 3.5 | Implement responsive breakpoint behavior | P1       | M    | [ ]    | Sidebar <-> bottom tabs transition         |
| 3.6 | Style navigation per DESIGN.md           | P1       | M    | [ ]    | Colors, active indicators, dimensions      |

---

## Phase 4: Habit CRUD UI

| #   | Task                                      | Priority | Size | Status | Notes                                 |
| --- | ----------------------------------------- | -------- | ---- | ------ | ------------------------------------- |
| 4.1 | Create HabitForm component                | P0       | L    | [ ]    | Name, desc, icon, color, type, target |
| 4.2 | Build icon picker (emoji + icon library)  | P0       | L    | [ ]    | Tabbed picker, search, selection      |
| 4.3 | Build color picker (palette + custom hex) | P0       | M    | [ ]    | 12 swatches + hex input               |
| 4.4 | Build type toggle (boolean vs numeric)    | P0       | S    | [ ]    | Segmented control, conditional fields |
| 4.5 | Implement habit creation modal (desktop)  | P0       | M    | [ ]    | Modal overlay, form inside            |
| 4.6 | Implement habit creation screen (mobile)  | P0       | M    | [ ]    | Full-screen route /habits/new         |
| 4.7 | Implement habit editing (reuse form)      | P0       | M    | [ ]    | Pre-fill form, update mutation        |
| 4.8 | Add form validation                       | P0       | S    | [ ]    | Name required, target > 0             |
| 4.9 | Write integration tests for habit CRUD    | P1       | L    | [ ]    | Create, edit, validate, cancel        |

---

## Phase 5: Table View

| #    | Task                                   | Priority | Size | Status | Notes                                           |
| ---- | -------------------------------------- | -------- | ---- | ------ | ----------------------------------------------- |
| 5.1  | Create TableView page component        | P0       | M    | [ ]    | Route /table, data fetching                     |
| 5.2  | Build table header (day columns)       | P0       | M    | [ ]    | Day labels, today highlight, configurable count |
| 5.3  | Build habit row component              | P0       | L    | [ ]    | Icon, name, day cells, stats                    |
| 5.4  | Implement boolean cell interaction     | P0       | M    | [ ]    | Tap to increment, visual fill state             |
| 5.5  | Implement numeric cell interaction     | P0       | M    | [ ]    | Tap to open input, save value                   |
| 5.6  | Implement drag-and-drop reordering     | P1       | L    | [ ]    | Drag handle, optimistic reorder                 |
| 5.7  | Add configurable day column count      | P1       | M    | [ ]    | Settings-driven, responsive                     |
| 5.8  | Style table per DESIGN.md              | P1       | M    | [ ]    | Row height, cell size, today highlight          |
| 5.9  | Implement backfill (past day cells)    | P1       | S    | [ ]    | All cells interactive, not just today           |
| 5.10 | Show inline stats (streak, rate)       | P2       | M    | [ ]    | Compact display at row end                      |
| 5.11 | Write integration tests for table view | P1       | L    | [ ]    | Render, tap, increment, numeric input           |

---

## Phase 6: Grids View

| #    | Task                                   | Priority | Size | Status | Notes                                 |
| ---- | -------------------------------------- | -------- | ---- | ------ | ------------------------------------- |
| 6.1  | Create GridsView page component        | P0       | M    | [ ]    | Route /grids, data fetching           |
| 6.2  | Build HabitGrid component              | P0       | L    | [ ]    | 1-month heatmap, 7-col layout         |
| 6.3  | Implement color intensity mapping      | P0       | M    | [ ]    | Completion % -> opacity per DESIGN.md |
| 6.4  | Build combined grid (all habits)       | P0       | L    | [ ]    | Aggregate completion %, neutral color |
| 6.5  | Add habit name + stats labels          | P1       | S    | [ ]    | Above each grid                       |
| 6.6  | Add day-of-week headers                | P1       | S    | [ ]    | M T W T F S S above columns           |
| 6.7  | Add month label                        | P1       | S    | [ ]    | Current month display                 |
| 6.8  | Style grids per DESIGN.md              | P1       | M    | [ ]    | Cell size 12px, no gap, no radius     |
| 6.9  | Responsive grid layout                 | P1       | M    | [ ]    | Multi-column at xl/2xl breakpoints    |
| 6.10 | Write integration tests for grids view | P1       | L    | [ ]    | Intensity mapping, combined grid      |

---

## Phase 7: Settings

| #   | Task                                 | Priority | Size | Status | Notes                        |
| --- | ------------------------------------ | -------- | ---- | ------ | ---------------------------- |
| 7.1 | Create Settings page                 | P1       | M    | [ ]    | Route /settings              |
| 7.2 | Week start day toggle                | P1       | S    | [ ]    | Sunday / Monday picker       |
| 7.3 | Display name editor                  | P1       | S    | [ ]    | Text input, save             |
| 7.4 | Timezone selector                    | P1       | M    | [ ]    | Timezone list, search        |
| 7.5 | Archived habits management           | P1       | M    | [ ]    | List, unarchive action       |
| 7.6 | Deleted habits management            | P1       | M    | [ ]    | List, restore action         |
| 7.7 | Sign out button                      | P1       | S    | [ ]    | Confirm, clear session       |
| 7.8 | Write integration tests for settings | P2       | M    | [ ]    | Week start day affects views |

---

## Phase 8: Polish and Quality

| #    | Task                              | Priority | Size | Status | Notes                                     |
| ---- | --------------------------------- | -------- | ---- | ------ | ----------------------------------------- |
| 8.1  | Accessibility audit               | P1       | L    | [ ]    | WCAG 2.1 AA, keyboard nav, screen readers |
| 8.2  | Add aria-labels to all grid cells | P1       | M    | [ ]    | "March 1, 2026: 75% complete"             |
| 8.3  | Focus management for modals       | P1       | S    | [ ]    | Trap focus, restore on close              |
| 8.4  | Loading states                    | P1       | M    | [ ]    | Skeleton loaders for table/grids          |
| 8.5  | Empty states                      | P1       | M    | [ ]    | No habits yet, no data for date range     |
| 8.6  | Error states                      | P1       | M    | [ ]    | Network errors, mutation failures         |
| 8.7  | Optimistic updates                | P1       | L    | [ ]    | Completion taps, reorder, form submit     |
| 8.8  | Performance profiling             | P2       | M    | [ ]    | Grid rendering with 50+ habits            |
| 8.9  | Mobile touch interactions         | P1       | M    | [ ]    | Touch targets, swipe gestures if needed   |
| 8.10 | Cross-browser testing             | P2       | M    | [ ]    | Chrome, Firefox, Safari, mobile Safari    |

---

## Phase 9: CI/CD and Deployment

| #   | Task                                 | Priority | Size | Status | Notes                             |
| --- | ------------------------------------ | -------- | ---- | ------ | --------------------------------- |
| 9.1 | Set up GitHub Actions workflow       | P1       | M    | [ ]    | Lint, typecheck, test, build      |
| 9.2 | Configure Vercel deployment          | P1       | M    | [ ]    | Auto-deploy, preview branches     |
| 9.3 | Set up Convex production environment | P1       | S    | [ ]    | Separate from dev                 |
| 9.4 | Configure environment variables      | P1       | S    | [ ]    | Vercel + Convex env vars          |
| 9.5 | Write E2E tests for critical paths   | P2       | L    | [ ]    | Signup -> create -> log -> verify |
| 9.6 | Set up coverage reporting            | P2       | S    | [ ]    | Vitest coverage, threshold checks |

---

## Phase 10: Future Enhancements [P3]

These are documented for planning but NOT part of the initial build.

| #     | Task                             | Priority | Size | Status | Notes                            |
| ----- | -------------------------------- | -------- | ---- | ------ | -------------------------------- |
| 10.1  | Light theme                      | P3       | L    | [ ]    | Full color system for light mode |
| 10.2  | Habit categories/tags            | P3       | L    | [ ]    | Schema change, filter UI         |
| 10.3  | Custom frequency (specific days) | P3       | L    | [ ]    | Schema + UI for day picker       |
| 10.4  | Switchable grid time ranges      | P3       | M    | [ ]    | 3mo, 6mo, year toggle            |
| 10.5  | Habit detail screen              | P3       | L    | [ ]    | Full history, charts, notes      |
| 10.6  | Push notifications               | P3       | XL   | [ ]    | Service worker, permission flow  |
| 10.7  | Data export (CSV/JSON)           | P3       | M    | [ ]    | Download file generation         |
| 10.8  | Offline mode                     | P3       | XL   | [ ]    | IndexedDB cache, sync queue      |
| 10.9  | Habit templates                  | P3       | M    | [ ]    | Pre-built habit suggestions      |
| 10.10 | Configurable table day count UX  | P3       | S    | [ ]    | Slider or input in settings      |

---

## Progress Summary

| Phase          | Total  | Done  | In Progress | Blocked |
| -------------- | ------ | ----- | ----------- | ------- |
| 0. Scaffolding | 12     | 0     | 0           | 0       |
| 1. Auth        | 6      | 0     | 0           | 0       |
| 2. Data Layer  | 17     | 0     | 0           | 0       |
| 3. App Shell   | 6      | 0     | 0           | 0       |
| 4. Habit CRUD  | 9      | 0     | 0           | 0       |
| 5. Table View  | 11     | 0     | 0           | 0       |
| 6. Grids View  | 10     | 0     | 0           | 0       |
| 7. Settings    | 8      | 0     | 0           | 0       |
| 8. Polish      | 10     | 0     | 0           | 0       |
| 9. CI/CD       | 6      | 0     | 0           | 0       |
| **Total v1**   | **95** | **0** | **0**       | **0**   |
| 10. Future     | 10     | 0     | 0           | 0       |

## Dependencies

Key dependency chains (must complete in order):

```
0.1 -> 0.2 -> 0.3 -> 0.4 (scaffolding is sequential)
0.4 -> 1.1 -> 1.2 -> 1.3 (schema before auth)
1.2 -> 1.4 -> 3.1 (auth before app shell)
1.1 -> 2.1 -> 4.1 (schema before CRUD)
2.1 + 2.9 -> 5.1 (habits + completions before table view)
2.1 + 2.9 + 2.11 -> 6.1 (data layer before grids view)
3.1 -> 5.1, 6.1, 7.1 (app shell before content pages)
```

Parallelizable after Phase 1:

- Phase 2 (data layer) + Phase 3 (app shell) can run in parallel
- Phase 5 (table) + Phase 6 (grids) can run in parallel after Phase 2+3
- Phase 7 (settings) can run in parallel with Phase 5+6
- Phase 8 (polish) runs after all feature phases
- Phase 9 (CI/CD) can start as early as Phase 0
