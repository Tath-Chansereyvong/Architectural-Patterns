import { test, expect } from '@playwright/test';

test('complete checkout successfully', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  await page.getByRole('button', { name: /add to cart/i }).first().click();
  await page.locator('.shopping_cart_link').click();
  await page.getByRole('button', { name: /checkout/i }).click();

  await page.getByPlaceholder('First Name').fill('John');
  await page.getByPlaceholder('Last Name').fill('Doe');
  await page.getByPlaceholder('Zip/Postal Code').fill('12345');
  await page.getByRole('button', { name: /continue/i }).click();

  await page.getByRole('button', { name: /finish/i }).click();

  await expect(page.getByText('Thank you for your order!')).toBeVisible();
});

test('checkout fails if info missing', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  await page.getByRole('button', { name: /add to cart/i }).first().click();
  await page.locator('.shopping_cart_link').click();
  await page.getByRole('button', { name: /checkout/i }).click();

  await page.getByRole('button', { name: /continue/i }).click();
  await expect(page.locator('[data-test="error"]')).toBeVisible();
});