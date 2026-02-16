import { test, expect } from '@playwright/test';

test('verify seamless track', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Click start button
  await page.click('button:has-text("START MISSION")');

  // Wait for game to run for a bit
  await page.waitForTimeout(2000);

  // Take screenshot of gameplay
  await page.screenshot({ path: 'seamless_track_1.png' });

  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'seamless_track_2.png' });
});
