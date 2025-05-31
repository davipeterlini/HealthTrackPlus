import { test, expect } from '@playwright/test';

test.describe('Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Use dev mode to skip authentication for testing
    await page.goto('/auth');
    await page.click('[data-testid="dev-mode-toggle"]').catch(async () => {
      // Fallback: try to find and click the dev mode button
      await page.locator('button').filter({ hasText: /code/i }).first().click();
    });
    await page.waitForURL('/dashboard');
  });

  test('should display dashboard components', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard de Saúde');
    
    // Check for health metrics cards
    await expect(page.locator('text=Passos Hoje')).toBeVisible();
    await expect(page.locator('text=Calorias')).toBeVisible();
    await expect(page.locator('text=Sono Médio')).toBeVisible();
    await expect(page.locator('text=Hidratação')).toBeVisible();
  });

  test('should navigate to different pages from sidebar', async ({ page }) => {
    // Test navigation to Activity page
    await page.click('text=Atividades');
    await expect(page).toHaveURL('/activity');
    await expect(page.locator('h1')).toContainText('Atividades Físicas');
    
    // Navigate back to dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL('/dashboard');
    
    // Test navigation to Nutrition page
    await page.click('text=Nutrição');
    await expect(page).toHaveURL('/nutrition');
    await expect(page.locator('h1')).toContainText('Nutrição');
  });

  test('should display quick action cards', async ({ page }) => {
    await expect(page.locator('text=Registrar Atividade')).toBeVisible();
    await expect(page.locator('text=Adicionar Refeição')).toBeVisible();
    await expect(page.locator('text=Novo Exame')).toBeVisible();
    await expect(page.locator('text=Clube Premium')).toBeVisible();
  });

  test('should open modals from quick actions', async ({ page }) => {
    // Click on "Registrar Atividade"
    await page.click('text=Registrar Atividade');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Close modal
    await page.keyboard.press('Escape');
    
    // Click on "Adicionar Refeição"
    await page.click('text=Adicionar Refeição');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('should navigate to subscription page', async ({ page }) => {
    await page.click('text=Clube Premium');
    await expect(page).toHaveURL('/subscription');
    await expect(page.locator('text=LifeTrek Premium Club')).toBeVisible();
  });
});