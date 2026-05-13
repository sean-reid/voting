import { test } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});

test("mobile screenshots", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await page.screenshot({ path: "e2e/screenshots/mobile-01-opening.png" });

  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: "e2e/screenshots/mobile-02-three-friends.png" });

  const el = page.locator("#count-differently");
  if (await el.count() > 0) {
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: "e2e/screenshots/mobile-03-count-differently.png" });
  }

  const fairness = page.locator("#fairness-criteria");
  if (await fairness.count() > 0) {
    await fairness.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: "e2e/screenshots/mobile-04-fairness.png" });
  }
});
