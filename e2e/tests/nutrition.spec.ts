import { test, expect } from '@playwright/test';

test.describe('Nutrition Page Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.click('[data-testid="dev-mode-toggle"]').catch(async () => {
      await page.locator('button').filter({ hasText: /code/i }).first().click();
    });
    await page.waitForURL('/dashboard');
    await page.goto('/nutrition');
  });

  test('should display nutrition page components', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Nutrição');
    
    // Check for main sections
    await expect(page.locator('text=Atual')).toBeVisible();
    await expect(page.locator('text=Histórico')).toBeVisible();
    await expect(page.locator('text=Adicionar Refeição')).toBeVisible();
  });

  test('should toggle between tabs', async ({ page }) => {
    // Click on Histórico tab
    await page.click('text=Histórico');
    await page.waitForTimeout(500);
    
    // Click back to Atual tab
    await page.click('text=Atual');
    await page.waitForTimeout(500);
  });

  test('should open add meal modal', async ({ page }) => {
    await page.click('text=Adicionar Refeição');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Check form fields
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('select, [role="combobox"]')).toBeVisible();
  });
});