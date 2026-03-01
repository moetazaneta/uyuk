# Testing Strategy for uyuk

This document outlines the testing strategy for uyuk, following the Testing Trophy methodology by Kent C. Dodds. The primary goal is to gain maximum confidence with minimum maintenance overhead by focusing on integration tests.

## The Testing Trophy

The strategy is organized into four layers, from widest (most frequent) to narrowest (most critical):

1. **Static Analysis**: Catch typos and type errors before code even runs.
2. **Unit Tests**: Verify isolated logic and pure functions.
3. **Integration Tests (The Bulk)**: Verify that components and services work together as a cohesive system.
4. **End-to-End (E2E) Tests**: Verify critical user journeys in a real browser environment.

## 1. Static Analysis

Static analysis provides the fastest feedback loop.

- **Tools**: TypeScript (Strict Mode), oxlint.
- **Scope**: All source files.
- **Pattern**:
  - TypeScript ensures data structures for habits and completions are consistent across the app.
  - oxlint enforces code quality and catches common pitfalls like unused variables or improper dependency imports.

## 2. Unit Tests

Unit tests focus on complex logic that doesn't depend on the UI or external services.

- **Tools**: Vitest.
- **Location**: Co-located with source files (e.g., `src/utils/date-utils.test.ts`).
- **What to test**:
  - Streak calculation logic (handling leaps, timezones, and gaps).
  - Date formatting and week start day offsets.
  - Color manipulation (calculating grid cell intensity based on completion values).
  - Data transformation (converting raw Convex completion records into grid-ready arrays).

### Example Pattern

```typescript
import { describe, it, expect } from 'vitest'
import { calculateStreak } from './habit-utils'

describe('calculateStreak', () => {
  it('returns 0 for no completions', () => {
    expect(calculateStreak([])).toBe(0)
  })

  it('correctly increments for consecutive days', () => {
    const completions = ['2026-02-28', '2026-03-01']
    expect(calculateStreak(completions)).toBe(2)
  })
})
```

## 3. Integration Tests (The Largest Layer)

Integration tests provide the most value by simulating how users actually interact with the app. We test behavior, not implementation details.

- **Tools**: Vitest, React Testing Library (RTL).
- **Location**: Co-located with components (e.g., `src/components/HabitForm.test.tsx`).
- **Key Principle**: Use accessible queries (`screen.getByRole`, `screen.getByLabelText`) to ensure the app remains usable and accessible.

### What to test

- **Habit Management**: Filling out the creation form and seeing the new habit appear in the list.
- **Completion Logging**: Tapping a cell, seeing the value update, and verifying the visual change in the grid.
- **View Transitions**: Switching between Table and Grid views preserves the correct data.
- **Settings Impact**: Changing the "Week Start Day" in settings immediately updates the layout of all habit grids.

### Example Pattern

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { HabitList } from './HabitList'

it('allows a user to log a completion by clicking a cell', async () => {
  render(<HabitList />)

  const cell = screen.getByRole('button', { name: /march 1/i })
  fireEvent.click(cell)

  // Verify visual state change
  expect(cell).toHaveAttribute('data-completed', 'true')
})
```

## 4. End-to-End (E2E) Tests

E2E tests cover the "Happy Path" across the entire stack, including the real backend and database.

- **Tools**: Playwright.
- **Location**: `tests/e2e/*.spec.ts`.
- **Scope**: Critical paths only.
- **What to test**:
  - The full onboarding flow: Sign up -> Create first habit -> Log first completion -> Sign out.
  - Cross-device persistence: Completing a habit on a mobile viewport and seeing it reflected after refreshing on a desktop viewport.

### Example Pattern

```typescript
import { test, expect } from '@playwright/test'

test('user can create a habit and see it in the table view', async ({
  page,
}) => {
  await page.goto('/table')
  await page.getByRole('button', { name: /new habit/i }).click()
  await page.getByLabel(/habit name/i).fill('Drink Water')
  await page.getByRole('button', { name: /save/i }).click()

  await expect(page.getByText('Drink Water')).toBeVisible()
})
```

## Convex Backend Testing

Testing backend functions ensures the data integrity and security of the application.

- **Strategy**: Use the Convex testing library to run mutations and queries against a local or mock environment.
- **Mocking Auth**: Provide a mock identity object to test protected functions.
- **Data Isolation**: Ensure that queries for User A never return data belonging to User B.

### Example Pattern

```typescript
import { v } from 'convex/values'
import { api } from './_generated/api'
import { t } from './_generated/test_utils'

test('mutation: createHabit requires authentication', async () => {
  const convex = t.base()
  await expect(
    convex.mutation(api.habits.create, { name: 'Water' }),
  ).rejects.toThrow('Unauthenticated')
})
```

## CI Integration

Tests are executed automatically on every pull request via GitHub Actions.

1. **Static Analysis (Fastest)**: Runs `oxlint` and `tsc`.
2. **Unit & Integration**: Runs `vitest` with concurrency enabled.
3. **E2E (Most Expensive)**: Runs `playwright` against a preview deployment.

The pipeline uses a fail-fast approach. If static analysis fails, subsequent steps are skipped to save time and resources.

## Coverage and Regression

- **Thresholds**: We aim for 80% coverage on core business logic (utils and services) and 100% coverage on bug regressions.
- **Bug Fixes**: Every bug fix must include a corresponding test (usually integration) that would have caught the issue, preventing future regressions.
- **Speed**: Integration tests should mock network calls (using MSW or Convex testing utils) to keep the feedback loop under 30 seconds for the local suite.
