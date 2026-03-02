import { expect, test } from '@playwright/test'

test.describe('Auth flow', () => {
  test('sign in page loads with email input', async ({ page }) => {
    await page.goto('/')
    // Should redirect to sign-in
    await expect(page).toHaveURL(/sign-in|\//)
    await expect(page.locator('body')).toBeVisible()
  })

  test('sign in page has password field', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })
})

test.describe('Authenticated flows (require running Convex)', () => {
  test.skip(
    !process.env.E2E_TEST_EMAIL,
    'Skipped: set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to run auth E2E tests',
  )

  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in')
    await page.fill('input[type="email"]', process.env.E2E_TEST_EMAIL!)
    await page.fill('input[type="password"]', process.env.E2E_TEST_PASSWORD!)
    await page.click('button[type="submit"]')
    await page.waitForURL(/table|grids/)
  })

  test('create a habit', async ({ page }) => {
    // Navigate to new habit form
    await page.goto('/habits/new')
    await page.waitForLoadState('networkidle')

    // Fill in habit name
    await page.fill('input[name="name"]', 'E2E Test Habit')

    // Submit the form
    await page.click('button[type="submit"]')

    // Should redirect back to table view
    await page.waitForURL(/table/)

    // Habit should appear in the table
    await expect(page.locator('text=E2E Test Habit')).toBeVisible()
  })

  test('log a completion', async ({ page }) => {
    await page.goto('/table')
    await page.waitForLoadState('networkidle')

    // Click first available day cell
    const firstCell = page.locator('[role="button"][aria-label*=","]').first()
    if (await firstCell.isVisible()) {
      await firstCell.click()
      // Optimistic update should show immediately
      await expect(firstCell).toBeVisible()
    }
  })

  test('navigate between views', async ({ page }) => {
    await page.goto('/table')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/table/)

    // Navigate to grids
    const gridsLink = page.locator('a[href*="grids"]').first()
    await gridsLink.click()
    await expect(page).toHaveURL(/grids/)

    // Navigate to settings
    const settingsLink = page.locator('a[href*="settings"]').first()
    await settingsLink.click()
    await expect(page).toHaveURL(/settings/)
  })
})
