// e2e/auth.spec.js
import { test, expect } from './fixtures/index.js'

test.describe('Auth redirects', () => {
  test.beforeEach(async ({ api }) => {
    await api.mockAuth() // /me returns 401 until login
  })

  test('redirects to login when not authenticated', async ({ page, loginPage }) => {
    await page.goto('/home')

    await expect(page).toHaveURL('/')
    await loginPage.expectVisible()
  })

  test('shows the login page at / when not authenticated', async ({ page, loginPage }) => {
    await loginPage.goto()

    await expect(page).toHaveURL('/')
    await loginPage.expectVisible()
  })
})
