import { test } from "@playwright/test";

test("capture all chapters - desktop", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await page.screenshot({ path: "e2e/screenshots/01-opening.png", fullPage: false });

  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: "e2e/screenshots/02-three-friends.png", fullPage: false });

  const sections = ["#count-differently", "#fairness-criteria", "#impossibility", "#proof-sketch", "#trade-offs", "#further-reading"];

  for (let i = 0; i < sections.length; i++) {
    const selector = sections[i]!;
    const el = page.locator(selector);
    if (await el.count() > 0) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await page.screenshot({ path: `e2e/screenshots/${String(i + 3).padStart(2, "0")}-${selector.replace("#", "")}.png`, fullPage: false });
    }
  }

  await page.screenshot({ path: "e2e/screenshots/full-page.png", fullPage: true });
});
