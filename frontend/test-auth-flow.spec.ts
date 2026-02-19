import { test, expect } from '@playwright/test';

test('register and login flow', async ({ page }) => {
  // Test Registration
  await page.goto('http://localhost:3000/en/register');
  
  const testEmail = `testuser_${Date.now()}@example.com`;
  
  await page.fill('input[id="businessName"]', 'Playwright Test Business');
  await page.fill('input[id="phone"]', '1234567890');
  await page.fill('input[id="email"]', testEmail);
  await page.fill('input[id="password"]', 'TestPassword123!');
  
  await page.click('button[type="submit"]');
  
  // Wait for success message (translations could vary, so wait for the success container)
  await expect(page.locator('.bg-green-500\\/10')).toBeVisible({ timeout: 10000 });
  
  // Wait for redirect to login
  await page.waitForURL('**/login', { timeout: 10000 });
  
  // Test Login
  await page.fill('input[id="email"]', testEmail);
  await page.fill('input[id="password"]', 'TestPassword123!');
  await page.click('button[type="submit"]');
  
  // Wait for redirect to home/dashboard
  await page.waitForURL('**/*', { timeout: 10000 });
  // Should not be on login page anymore
  expect(page.url()).not.toContain('/login');
});
