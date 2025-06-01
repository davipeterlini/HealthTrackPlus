import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('LifeTrek');
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should switch between login and register tabs', async ({ page }) => {
    // Click on Register tab
    await page.click('text=Registro');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();

    // Switch back to Login tab
    await page.click('text=Login');
    await expect(page.locator('input[name="username"]')).toBeVisible();
  });

  test('should show validation errors for empty login form', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Username is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should register new user successfully', async ({ page }) => {
    // Switch to Register tab
    await page.click('text=Registro');
    
    // Fill registration form
    const timestamp = Date.now();
    await page.fill('input[name="username"]', `testuser${timestamp}`);
    await page.fill('input[name="email"]', `test${timestamp}@example.com`);
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="name"]', 'Test User');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard de Saúde');
  });

  test('should login with dev mode toggle', async ({ page }) => {
    // Click dev mode toggle
    await page.click('[data-testid="dev-mode-toggle"]').catch(async () => {
      // If dev mode toggle not found, click the Code2 icon
      await page.locator('svg').first().click();
    });
    
    // Should redirect to dashboard automatically
    await expect(page).toHaveURL('/dashboard');
  });

  test('should toggle dark mode', async ({ page }) => {
    const body = page.locator('body');
    
    // Check initial theme
    const initialClass = await body.getAttribute('class');
    
    // Click theme toggle
    await page.click('[data-testid="theme-toggle"]').catch(() => {
      // Fallback to clicking moon/sun icon
      page.locator('svg[class*="lucide"]').nth(1).click();
    });
    
    // Check if theme changed
    const newClass = await body.getAttribute('class');
    expect(newClass).not.toBe(initialClass);
  });
});