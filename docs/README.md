# uyuk - Documentation

uyuk is a habit tracking web application inspired by HabitKit. It provides visual progress tracking through colorful heatmap grids and a compact table interface for rapid daily logging.

## Documentation Index

| Document                             | Description                                                                                                                                                             |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [PRD.md](./PRD.md)                   | Product Requirements Document. What the app does, user stories, feature specs, acceptance criteria, and future roadmap. Start here.                                     |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture. Stack choices, Convex schema, file structure, routing, state management, and architecture decisions.                                            |
| [DESIGN.md](./DESIGN.md)             | Design system. Terminal-inspired aesthetic, color system, typography, spacing, component specs, grid/heatmap specifications, responsive breakpoints, and accessibility. |
| [TESTING.md](./TESTING.md)           | Testing strategy. Testing Trophy methodology (static, unit, integration, e2e), tools (Vitest, RTL, Playwright), patterns, and CI integration.                           |
| [DEVELOPMENT.md](./DEVELOPMENT.md)   | Development guide. Environment setup, TypeScript config, oxlint, Biome formatting, git hooks, coding conventions, CI/CD pipeline, and IDE setup.                        |
| [TASKS.md](./TASKS.md)               | Task tracker. All implementation tasks organized by phase with priorities, sizes, statuses, dependencies, and progress summary.                                         |

## Quick Reference

### Tech Stack

- **Framework**: TanStack Start (React, SSR, file-based routing)
- **Database**: Convex (reactive, real-time, serverless)
- **Auth**: Convex Auth + Google OAuth
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript (strict)
- **Linting**: oxlint
- **Formatting**: Biome
- **Testing**: Vitest + React Testing Library + Playwright
- **Deployment**: Vercel + Convex Cloud

### Key Design Decisions

- Terminal-inspired aesthetic: no borders, no rounding, dark-first, compact
- Two main views: Table (spreadsheet-like) and Grids (heatmap per habit)
- Both boolean (tap to increment) and numeric (enter value) habit types
- Solid square grid cells with no gaps, color intensity mapped to completion %
- Responsive: sidebar on desktop, bottom tabs on mobile

### v1 Scope

See [PRD.md](./PRD.md) for full details. In summary:

- Auth (Google OAuth)
- Habit CRUD (create, edit, archive, soft-delete, restore, reorder)
- Table view with configurable day columns
- Grids view with 1-month heatmaps + combined grid
- Basic stats (streak, longest streak, total completions, completion rate)
- Settings (week start day, timezone, display name)
- Dark-first theme (light mode planned for future)

### Reading Order

1. **PRD.md** - Understand what we're building
2. **DESIGN.md** - Understand how it looks
3. **ARCHITECTURE.md** - Understand how it's built
4. **DEVELOPMENT.md** - Set up your environment
5. **TESTING.md** - Understand quality expectations
6. **TASKS.md** - Find what to work on next
