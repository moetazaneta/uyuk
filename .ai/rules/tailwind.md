# Tailwind CSS v4 Guidelines

> Source: Community (cursorrulespacks/cursorrules-collection)
> Status: OPTIONAL — disable if not needed
> Applies to: `*.css`, `*.tsx`, `*.ts`

## Utility Usage

- Utilities first. Extract components only after 3+ repetitions of the same combination
- Mobile-first responsive: `sm:`, `md:`, `lg:` — build upward from mobile, never max-width media queries
- Group related utilities in consistent order: layout (flex, grid) → sizing (w, h) → spacing (p, m) → typography → colors → effects → transitions
- Use arbitrary values `[24px]` only when the default scale genuinely doesn't cover it
- Prefer `size-*` when width and height are the same — `size-8` not `w-8 h-8`

## v4 Migration — Critical Changes

- Config now lives in CSS: `@import "tailwindcss"` in `globals.css`, NOT `tailwind.config.ts`
- Utility renames: `outline-none` → `outline-hidden`, `ring` defaults to 1px (was 3px)
- `bg-opacity-*` removed — use `bg-black/50` syntax instead
- `@layer utilities` replaced by `@utility`
- Use `var(--color-...)` instead of `theme()` in CSS
- Theme extension via `@theme` directive in CSS, not JS config

## Design Tokens

- Define semantic color names: `primary`, `surface`, `muted`, `destructive` — not `blue-500` scattered everywhere
- Consistent spacing scale: extend the default, don't replace it
- Font size with leading: `text-lg/7` for paired type + line-height
- Use CSS variables for colors that need runtime switching (themes): `--color-primary`

## Component Patterns

- `@apply` in CSS files for truly atomic repeated patterns (`.btn-primary`, `.input-base`)
- Prefer component extraction over `@apply` for anything with structure
- Never `@apply` responsive or state variants (`hover:`, `sm:`) — those belong in markup
- Use `cn()` utility (clsx + twMerge) for conditional classes — plain string concatenation breaks with conflicting utilities

## Dark Mode

- Use `dark:` variant with `class` strategy for manual toggle support
- Define dark palette in theme extension — don't scatter inline `dark:bg-gray-900` everywhere
- One semantic token (`bg-surface`) that changes in dark mode is better than 200 `dark:` overrides

## Layout

- Flexbox for 1D, Grid for 2D
- `gap-*` for flex/grid children spacing — margins on children cause edge-spacing bugs
- `divide-y` / `divide-x` for bordered list items instead of manual `border-b`

## Gotchas

- Dynamic class names are purged: `bg-${color}-500` will NOT be in production CSS. Use complete class names or safelist
- Arbitrary values with spaces need underscores: `grid-cols-[1fr_auto_1fr]`
- `ring-*` is not `border-*` — ring doesn't affect layout, border does
- `overflow-hidden` kills `sticky` positioning — use `overflow-clip` instead
