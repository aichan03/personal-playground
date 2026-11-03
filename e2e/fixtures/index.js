// e2e/fixtures/index.js
import { test as base, expect } from '@playwright/test'
import { mockAuth, mockLogin } from '../mocks/api.js'
import { LoginPage } from '../pages/LoginPage.js'

export const test = base.extend({
   loginPage: async ({ page }, use) => {
      await use(new LoginPage(page))
   },

   api: async ({ page }, use) => {
      await use({
         mockAuth: () => mockAuth(page),
         mockLogin: (options) => mockLogin(page, options),
      })
   },
})

export { expect }