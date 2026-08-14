import { test, expect } from '@playwright/test'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// test('homepage has Vite + React heading', async ({ page }) => {
//   await page.goto('/')
//   await expect(page.getByRole('heading', { name: 'Vite + React' })).toBeVisible()
// })

test('count button increments on click', async ({ page }) => {
  await page.goto('/')
  const button = page.getByRole('button')

  await expect(button).toHaveText('count is 0')

  await button.click()
  await expect(button).toHaveText('count is 1')
  await delay(2000); // Pauses execution for 2 seconds

  await button.click()
  await expect(button).toHaveText('count is 2')
  await delay(2000); // Pauses execution for 2 seconds

  await button.click()
  await expect(button).toHaveText('count is 3')
  await delay(2000); // Pauses execution for 2 seconds

  await button.click()
  await expect(button).toHaveText('count is 4')
  await delay(2000); // Pauses execution for 2 seconds

  await button.click()
  await expect(button).toHaveText('count is 5')

  // await page.pause() // ← keeps browser + inspector open here
})

// test('vite and react logo links are present', async ({ page }) => {
//   await page.goto('/')
//   await expect(page.getByRole('link').first()).toHaveAttribute('href', 'https://vitejs.dev')
//   await expect(page.getByRole('link').nth(1)).toHaveAttribute('href', 'https://react.dev')
// })