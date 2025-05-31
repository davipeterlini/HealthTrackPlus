import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navigate to app and set dev mode for testing
  await page.goto('http://localhost:5000/auth');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Close browser
  await browser.close();
}

export default globalSetup;