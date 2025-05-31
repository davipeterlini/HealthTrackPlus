# Test info

- Name: Authentication Flow >> should toggle dark mode
- Location: /home/runner/workspace/e2e/tests/auth.spec.ts:62:3

# Error details

```
Error: browserType.launch: Executable doesn't exist at /home/runner/workspace/.cache/ms-playwright/webkit_ubuntu20.04_x64_special-2092/pw_run.sh
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║     npx playwright install                                              ║
║                                                                         ║
║ <3 Playwright Team                                                      ║
╚═════════════════════════════════════════════════════════════════════════╝
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Authentication Flow', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     await page.goto('/auth');
   6 |   });
   7 |
   8 |   test('should display login form', async ({ page }) => {
   9 |     await expect(page.locator('h1')).toContainText('LifeTrek');
  10 |     await expect(page.locator('input[name="username"]')).toBeVisible();
  11 |     await expect(page.locator('input[name="password"]')).toBeVisible();
  12 |     await expect(page.locator('button[type="submit"]')).toBeVisible();
  13 |   });
  14 |
  15 |   test('should switch between login and register tabs', async ({ page }) => {
  16 |     // Click on Register tab
  17 |     await page.click('text=Registro');
  18 |     await expect(page.locator('input[name="email"]')).toBeVisible();
  19 |     await expect(page.locator('input[name="name"]')).toBeVisible();
  20 |
  21 |     // Switch back to Login tab
  22 |     await page.click('text=Login');
  23 |     await expect(page.locator('input[name="username"]')).toBeVisible();
  24 |   });
  25 |
  26 |   test('should show validation errors for empty login form', async ({ page }) => {
  27 |     await page.click('button[type="submit"]');
  28 |     await expect(page.locator('text=Username is required')).toBeVisible();
  29 |     await expect(page.locator('text=Password is required')).toBeVisible();
  30 |   });
  31 |
  32 |   test('should register new user successfully', async ({ page }) => {
  33 |     // Switch to Register tab
  34 |     await page.click('text=Registro');
  35 |     
  36 |     // Fill registration form
  37 |     const timestamp = Date.now();
  38 |     await page.fill('input[name="username"]', `testuser${timestamp}`);
  39 |     await page.fill('input[name="email"]', `test${timestamp}@example.com`);
  40 |     await page.fill('input[name="password"]', 'password123');
  41 |     await page.fill('input[name="name"]', 'Test User');
  42 |     
  43 |     // Submit form
  44 |     await page.click('button[type="submit"]');
  45 |     
  46 |     // Should redirect to dashboard
  47 |     await expect(page).toHaveURL('/dashboard');
  48 |     await expect(page.locator('h1')).toContainText('Dashboard de Saúde');
  49 |   });
  50 |
  51 |   test('should login with dev mode toggle', async ({ page }) => {
  52 |     // Click dev mode toggle
  53 |     await page.click('[data-testid="dev-mode-toggle"]').catch(async () => {
  54 |       // If dev mode toggle not found, click the Code2 icon
  55 |       await page.locator('svg').first().click();
  56 |     });
  57 |     
  58 |     // Should redirect to dashboard automatically
  59 |     await expect(page).toHaveURL('/dashboard');
  60 |   });
  61 |
> 62 |   test('should toggle dark mode', async ({ page }) => {
     |   ^ Error: browserType.launch: Executable doesn't exist at /home/runner/workspace/.cache/ms-playwright/webkit_ubuntu20.04_x64_special-2092/pw_run.sh
  63 |     const body = page.locator('body');
  64 |     
  65 |     // Check initial theme
  66 |     const initialClass = await body.getAttribute('class');
  67 |     
  68 |     // Click theme toggle
  69 |     await page.click('[data-testid="theme-toggle"]').catch(() => {
  70 |       // Fallback to clicking moon/sun icon
  71 |       page.locator('svg[class*="lucide"]').nth(1).click();
  72 |     });
  73 |     
  74 |     // Check if theme changed
  75 |     const newClass = await body.getAttribute('class');
  76 |     expect(newClass).not.toBe(initialClass);
  77 |   });
  78 | });
```