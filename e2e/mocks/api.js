// e2e/mocks/api.js

import { ADMIN } from '../../tests/data/users'

const ENDPOINTS = {
   login: '**/login',
   me: '**/me',
}

const { password: _password, ...PUBLIC_USER } = ADMIN

/**
 * @param {import('@playwright/test').Route} route
 * @param {number} status
 * @param {object} body
 */
const json = (route, status, body) =>
   route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
   })

/**
 * Mock POST /login with a fixed response.
 * @param {import('@playwright/test').Page} page
 * @param {{ status?: number, body?: object }} [options]
 */
export async function mockLogin(page, { status = 200, body = { user: PUBLIC_USER } } = {}) {
   await page.route(ENDPOINTS.login, (route) => {
      if (route.request().method() !== 'POST') return route.continue()
      return json(route, status, body)
   })
}

/**
 * Stateful auth mock: /me returns 401 until POST /login succeeds.
 * @param {import('@playwright/test').Page} page
 */
export async function mockAuth(page) {
   let loggedIn = false

   await page.route(ENDPOINTS.login, (route) => {
      if (route.request().method() !== 'POST') return route.continue()
      loggedIn = true
      return json(route, 200, { user: PUBLIC_USER })
   })

   await page.route(ENDPOINTS.me, (route) =>
      loggedIn
         ? json(route, 200, { user: PUBLIC_USER })
         : json(route, 401, { message: 'Unauthorized' }),
   )
}