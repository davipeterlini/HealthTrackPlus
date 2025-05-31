import { test, expect } from '@playwright/test';

test.describe('Subscription Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Use dev mode to access subscription page
    await page.goto('/auth');
    await page.click('[data-testid="dev-mode-toggle"]').catch(async () => {
      await page.locator('button').filter({ hasText: /code/i }).first().click();
    });
    await page.waitForURL('/dashboard');
    await page.goto('/subscription');
  });

  test('should display subscription plans', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('LifeTrek Premium Club');
    
    // Check for pricing plans
    await expect(page.locator('text=Básico')).toBeVisible();
    await expect(page.locator('text=Premium')).toBeVisible();
    await expect(page.locator('text=Profissional')).toBeVisible();
    
    // Check pricing
    await expect(page.locator('text=Gratuito')).toBeVisible();
    await expect(page.locator('text=R$ 29,90')).toBeVisible();
    await expect(page.locator('text=R$ 79,90')).toBeVisible();
  });

  test('should display premium features', async ({ page }) => {
    await expect(page.locator('text=IA Avançada')).toBeVisible();
    await expect(page.locator('text=Monitoramento 360°')).toBeVisible();
    await expect(page.locator('text=Conquistas & Metas')).toBeVisible();
  });

  test('should show security information', async ({ page }) => {
    await expect(page.locator('text=Pagamento 100% seguro')).toBeVisible();
    await expect(page.locator('text=Processado pelo Stripe')).toBeVisible();
    await expect(page.locator('text=Ativação instantânea')).toBeVisible();
  });

  test('should handle subscription button click', async ({ page }) => {
    const subscribeButton = page.locator('text=Assinar Premium');
    await expect(subscribeButton).toBeVisible();
    
    // Click subscription button
    await subscribeButton.click();
    
    // Should handle the subscription creation (may show loading or payment form)
    await page.waitForTimeout(2000);
  });
});