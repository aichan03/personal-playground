// @ts-check
import { test, expect } from '@playwright/test';

const LOGIN_URL = '/';

/**
 * @param {import('@playwright/test').Page} page
 * @param {{ status?: number, body?: object }} [options]
 */
async function mockLogin(page, { status = 200, body = { message: 'ok' } } = {}) {
  await page.route('**/login', async (route) => {
    if (route.request().method() !== 'POST') {
      return route.continue();
    }
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

/**
 * @param {import('@playwright/test').Page} page
 */
async function mockAuth(page) {
  let loggedIn = false;
  const user = { id: 1, email: 'admin@example.com', name: 'Admin' };

  await page.route('**/login', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    loggedIn = true;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ user }) });
  });

  await page.route('**/me', async (route) => {
    await route.fulfill({
      status: loggedIn ? 200 : 401,
      contentType: 'application/json',
      body: JSON.stringify(loggedIn ? { user } : { message: 'Unauthorized' }),
    });
  });
}

test.describe('Auth redirects', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await mockAuth(page); // /me returns 401 because nobody is logged in

    await page.goto('/home'); // protected route
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('shows the login page at / when not authenticated', async ({ page }) => {
    await mockAuth(page);

    await page.goto('/');
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });
});

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  test('renders the login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByText('Welcome back to the My Playground')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Remember me' })).toBeChecked();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeEnabled();
    await expect(page.getByText('Demo: admin@example.com / password')).toBeVisible();
  });

  test('shows required errors when submitting an empty form', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Enter your email')).toBeVisible();
    await expect(page.getByText('Enter your password')).toBeVisible();
  });

  test('shows an error for an invalid email format', async ({ page }) => {
    await page.getByLabel('Email').fill('not-an-email');
    await page.getByLabel('Password', { exact: true }).fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Enter a valid email address')).toBeVisible();
  });

  test('shows an error when password is missing', async ({ page }) => {
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Enter your password')).toBeVisible();
    await expect(page.getByText('Enter your email')).toBeHidden();
  });

  test('toggles password visibility', async ({ page }) => {
    const password = page.getByLabel('Password', { exact: true });
    await password.fill('secret123');
    await expect(password).toHaveAttribute('type', 'password');

    await page.getByRole('img', { name: /eye/ }).click();
    await expect(password).toHaveAttribute('type', 'text');
  });

  test('toggles dark / light mode', async ({ page }) => {
    const themeSwitch = page.getByRole('switch');
    await expect(themeSwitch).not.toBeChecked();

    await themeSwitch.click();
    await expect(themeSwitch).toBeChecked();
    await expect(page.getByText('Dark')).toBeVisible();

    await themeSwitch.click();
    await expect(themeSwitch).not.toBeChecked();
    await expect(page.getByText('Light')).toBeVisible();
  });

  test('shows an alert and stays on the page when login fails', async ({ page }) => {
    await mockLogin(page, { status: 401, body: { message: 'Invalid credentials' } });

    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Password', { exact: true }).fill('wrong-password');
    await page.getByRole('button', { name: 'Sign in' }).click();

    const alert = page.getByRole('alert');
    await expect(alert).toBeVisible();
    await expect(page).toHaveURL('/');

    // The alert can be dismissed
    await alert.getByRole('button', { name: /close/i }).click();
    await expect(alert).toBeHidden();
  });

  test('redirects to /home after a successful login', async ({ page }) => {
    await mockLogin(page, { status: 200, body: { user: { email: 'admin@example.com' } } });

    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Password', { exact: true }).fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/\/home/);
  });
});