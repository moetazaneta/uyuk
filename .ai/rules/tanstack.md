# TanStack Router / Start Guidelines

> Source: Official TanStack vibe-rules (https://tanstack.com/router/v1/docs/llm-support)
> Status: INSTALL AFTER PROJECT SETUP — rules are bundled in the NPM package
> Applies to: `src/**/*.ts`, `src/**/*.tsx`, `app/**/*.ts`, `app/**/*.tsx`

## Setup Instructions

TanStack Router ships official AI rules inside the NPM package. After project setup:

```bash
# Install vibe-rules globally
pnpm add -g vibe-rules

# Install TanStack Router rules for your editor
# For Cursor:
vibe-rules install cursor

# For other editors, see: https://github.com/FutureExcited/vibe-rules
```

This will auto-detect TanStack Router in your dependencies and install the comprehensive rules from the package's `llms` export.

## Core Patterns (Manual Reference)

Until the full vibe-rules are installed, follow these patterns:

### File-Based Routing

- TanStack Router uses file-based routing in `app/routes/`
- Route files export a `Route` object created via `createFileRoute`
- Layout routes use `_layout` suffix or `__root.tsx` for root layout
- Path params use `$paramName` in filenames: `app/routes/habits/$habitId.tsx`

### Route Definition

```typescript
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/habits/$habitId")({
  // Loader runs before render — fetch data here
  loader: async ({ params, context }) => {
    return context.queryClient.ensureQueryData(habitQueryOptions(params.habitId));
  },
  component: HabitDetailPage,
});

function HabitDetailPage() {
  const { habitId } = Route.useParams();
  const data = Route.useLoaderData();
  return <div>{/* ... */}</div>;
}
```

### Search Params (URL State)

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  view: z.enum(['grid', 'table']).default('grid'),
  range: z.enum(['week', 'month', 'year']).default('month'),
})

export const Route = createFileRoute('/habits')({
  validateSearch: searchSchema,
  component: HabitsPage,
})

function HabitsPage() {
  const { view, range } = Route.useSearch()
  const navigate = Route.useNavigate()

  const switchView = (newView: 'grid' | 'table') => {
    navigate({ search: (prev) => ({ ...prev, view: newView }) })
  }
}
```

### Navigation

```typescript
import { Link, useNavigate } from "@tanstack/react-router";

// Declarative
<Link to="/habits/$habitId" params={{ habitId: "123" }}>
  View Habit
</Link>

// Imperative
const navigate = useNavigate();
navigate({ to: "/habits/$habitId", params: { habitId: "123" } });
```

### TanStack Start (Server Functions)

```typescript
import { createServerFn } from '@tanstack/react-start/server'

const getUser = createServerFn({ method: 'GET' })
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    // This runs on the server
    return await fetchUser(data.userId)
  })
```

### Key Anti-Patterns

- Do NOT use `react-router-dom` APIs — use TanStack Router equivalents
- Do NOT use `useEffect` for data fetching — use route loaders
- Do NOT manually parse URL params — use `validateSearch` with Zod
- Do NOT use `window.location` for navigation — use `useNavigate` or `<Link>`
- Do NOT import from `@tanstack/react-router` in server-only code — use `@tanstack/react-start/server`
