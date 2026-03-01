# React 19 Guidelines

> Source: Community (cursorrulespacks/cursorrules-collection)
> Status: OPTIONAL — disable if not needed
> Applies to: `*.tsx`, `*.jsx`

## Components

- Functional components only. No class components
- Keep under 150 lines. Extract hooks and sub-components early
- Named exports, one component per file
- Descriptive names: `HabitGridCell` not `Cell`
- Colocate styles, tests, and types with the component file
- Props interface named `{ComponentName}Props`, defined above the component
- Default props via destructuring defaults, not `defaultProps`
- Avoid spreading props blindly (`{...props}`). Be explicit about what's passed

## React 19 Specific Changes

- `ref` is now a standard prop — `forwardRef` is deprecated
- String refs (`ref="myRef"`) are deprecated
- Client components must have `"use client"` at top when needed
- Server action files need `"use server"`
- Never use `import * as React` — use explicit imports

## State Management

- `useState` for local UI state, `useReducer` for complex logic with multiple related values
- Lift state only as high as needed — avoid prop drilling beyond 2 levels
- Context for global concerns (theme, auth, locale). Never for frequently updating values
- Server state belongs in TanStack Query / Convex reactive queries, not `useState`
- Derive values from existing state instead of syncing with `useEffect`
- URL is state too: use searchParams for filters, pagination, selected tabs

## Hooks

- Follow Rules of Hooks. Use ESLint/oxlint plugin
- Extract reusable logic into custom hooks (`use*` prefix)
- `useMemo`/`useCallback` only with demonstrated performance need — profile first
- Complete dependency arrays. Never disable exhaustive-deps
- `useEffect` is for synchronization with external systems, not for derived state
- Cleanup functions in `useEffect` for subscriptions, timers, event listeners
- Custom hooks should return objects (not arrays) when returning 3+ values

## Patterns

- Composition over configuration: children/render props over config objects
- Handle loading, error, and empty states in every data component
- `ErrorBoundary` at route/feature boundaries, not around individual components
- `React.lazy` + `Suspense` for route-level code splitting
- Avoid conditional hooks. Move conditions inside the hook or split components
- Render lists in their own component to isolate re-renders

## Performance

- Stable unique keys for lists, never array index for dynamic lists
- Avoid inline object/array literals in JSX props — extract to constants or `useMemo`
- Profile with React DevTools Profiler before optimizing
- Virtualize long lists (>100 items) with `react-window` or similar
- Debounce expensive operations triggered by user input (search, resize)

## Conditional Rendering

- Use `{condition ? <Element /> : null}` over `&&` for conditional rendering
- This avoids the `0` rendering bug with falsy numbers
