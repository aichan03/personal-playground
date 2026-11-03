// e2e/login.spec.js
import { test, expect } from './fixtures/index.js'
import { ADMIN, INVALID_EMAIL, WRONG_PASSWORD } from '../tests/data/users.js'

test.describe('Login page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto()
  })

  test('renders the login form', async ({ loginPage }) => {
    await expect(loginPage.heading).toBeVisible()
    await expect(loginPage.welcomeText).toBeVisible()
    await expect(loginPage.email).toBeVisible()
    await expect(loginPage.password).toBeVisible()
    await expect(loginPage.rememberMe).toBeChecked()
    await expect(loginPage.submitButton).toBeEnabled()
    await expect(loginPage.demoHint).toBeVisible()
  })

  test.describe('validation', () => {
    test('requires email and password on empty submit', async ({ loginPage }) => {
      await loginPage.login()

      await expect(loginPage.emailRequiredError).toBeVisible()
      await expect(loginPage.passwordRequiredError).toBeVisible()
    })

    test('rejects an invalid email format', async ({ loginPage }) => {
      await loginPage.login({ email: INVALID_EMAIL, password: ADMIN.password })

      await expect(loginPage.emailInvalidError).toBeVisible()
    })

    test('requires a password', async ({ loginPage }) => {
      await loginPage.login({ email: ADMIN.email })

      await expect(loginPage.passwordRequiredError).toBeVisible()
      await expect(loginPage.emailRequiredError).toBeHidden()
    })
  })

  test.describe('interactions', () => {
    test('toggles password visibility', async ({ loginPage }) => {
      await loginPage.password.fill('secret123')
      await expect(loginPage.password).toHaveAttribute('type', 'password')

      await loginPage.passwordToggle.click()
      await expect(loginPage.password).toHaveAttribute('type', 'text')
    })

    test('toggles dark / light mode', async ({ page, loginPage }) => {
      await expect(loginPage.themeSwitch).not.toBeChecked()

      await loginPage.themeSwitch.click()
      await expect(loginPage.themeSwitch).toBeChecked()
      await expect(page.getByText('Dark')).toBeVisible()

      await loginPage.themeSwitch.click()
      await expect(loginPage.themeSwitch).not.toBeChecked()
      await expect(page.getByText('Light')).toBeVisible()
    })
  })

  test.describe('submission', () => {
    test('shows a dismissible alert when login fails', async ({ page, api, loginPage }) => {
      await api.mockLogin({ status: 401, body: { message: 'Invalid credentials' } })

      await loginPage.login({ email: ADMIN.email, password: WRONG_PASSWORD })

      await expect(loginPage.alert).toBeVisible()
      await expect(page).toHaveURL('/')

      await loginPage.alert.getByRole('button', { name: /close/i }).click()
      await expect(loginPage.alert).toBeHidden()
    })

    test('redirects to /home after a successful login', async ({ page, api, loginPage }) => {
      await api.mockLogin()

      await loginPage.login({ email: ADMIN.email, password: ADMIN.password })

      await expect(page).toHaveURL(/\/home/)
    })
  })
})
