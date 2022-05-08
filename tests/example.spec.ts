import { test, expect, chromium } from '@playwright/test';

test('basic test',async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://baidu.com');
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
});