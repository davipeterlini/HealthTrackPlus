import { test, expect } from '@playwright/test';

test.describe('Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.click('[data-testid="dev-mode-toggle"]').catch(async () => {
      await page.locator('button').filter({ hasText: /code/i }).first().click();
    });
    await page.waitForURL('/dashboard');
  });

  test('should complete full user journey from dashboard to subscription', async ({ page }) => {
    // Start at dashboard
    await expect(page.locator('h1')).toContainText('Dashboard de Saúde');
    
    // Navigate to subscription via quick action
    await page.click('text=Clube Premium');
    await expect(page).toHaveURL('/subscription');
    
    // Verify subscription page loaded
    await expect(page.locator('text=LifeTrek Premium Club')).toBeVisible();
    
    // Go back to dashboard
    await page.goBack();
    await expect(page).toHaveURL('/dashboard');
  });

  test('should navigate through all main pages', async ({ page }) => {
    const pages = [
      { link: 'Atividades', url: '/activity', title: 'Atividades Físicas' },
      { link: 'Nutrição', url: '/nutrition', title: 'Nutrição' },
      { link: 'Sono', url: '/sleep', title: 'Monitoramento do Sono' },
      { link: 'Exames', url: '/exams', title: 'Exames Médicos' },
    ];

    for (const pageInfo of pages) {
      await page.click(`text=${pageInfo.link}`);
      await expect(page).toHaveURL(pageInfo.url);
      await expect(page.locator('h1')).toContainText(pageInfo.title);
      
      // Return to dashboard
      await page.click('text=Dashboard');
      await expect(page).toHaveURL('/dashboard');
    }
  });

  test('should handle responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile menu toggle is visible
    const menuButton = page.locator('[data-testid="mobile-menu-toggle"]');
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    }
  });

  test('should maintain session across page refreshes', async ({ page }) => {
    // Refresh the page
    await page.reload();
    
    // Should still be on dashboard (dev mode maintains session)
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard de Saúde');
  });
});