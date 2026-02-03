import { test, expect } from '@playwright/test';

test('locked user shows error message', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('locked_out_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page.locator('[data-test="error"]')).toBeVisible();
});

test('sorting products by price low to high', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page).toHaveURL(/inventory.html/);
  await expect(page.getByText('Products')).toBeVisible();

  const sortSelect = page.locator('select.product_sort_container');
  await sortSelect.selectOption('lohi');

  const firstPrice = page.locator('.inventory_item_price').first();
  await expect(firstPrice).toHaveText('$7.99');
});

test('logout returns to login page', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  await page.locator('#react-burger-menu-btn').click();
  await page.getByRole('link', { name: /logout/i }).click();

  await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
});