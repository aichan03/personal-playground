// e2e/pages/LoginPage.js
import { expect } from '@playwright/test'

export class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page

    this.heading = page.getByRole('heading', { name: 'Sign in' })
    this.welcomeText = page.getByText('Welcome back to the My Playground')
    this.demoHint = page.getByText('Demo: admin@example.com / password')
    this.email = page.getByLabel('Email')
    this.password = page.getByLabel('Password', { exact: true })
    this.rememberMe = page.getByRole('checkbox', { name: 'Remember me' })
    this.submitButton = page.getByRole('button', { name: 'Sign in' })
    this.passwordToggle = page.getByRole('img', { name: /eye/ })
    this.themeSwitch = page.getByRole('switch')
    this.alert = page.getByRole('alert')

    this.emailRequiredError = page.getByText('Enter your email')
    this.passwordRequiredError = page.getByText('Enter your password')
    this.emailInvalidError = page.getByText('Enter a valid email address')
  }

  async goto() {
    await this.page.goto('/')
  }

  /**
   * @param {{ email?: string, password?: string }} credentials
   */
  async login({ email, password } = {}) {
    if (email) await this.email.fill(email)
    if (password) await this.password.fill(password)
    await this.submitButton.click()
  }

  async expectVisible() {
    await expect(this.heading).toBeVisible()
  }
}
