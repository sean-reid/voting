import { test } from "@playwright/test";

test("full page audit - desktop 1280x900", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await page.screenshot({ path: "e2e/screenshots/audit-01-opening.png", fullPage: false });

  const sections = [
    "#three-friends",
    "#count-differently",
    "#fairness-criteria",
    "#impossibility",
    "#proof-sketch",
    "#trade-offs",
    "#further-reading",
  ];

  for (let i = 0; i < sections.length; i++) {
    const sel = sections[i]!;
    const el = page.locator(sel);
    if ((await el.count()) > 0) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      await page.screenshot({
        path: `e2e/screenshots/audit-${String(i + 2).padStart(2, "0")}-${sel.replace("#", "")}.png`,
        fullPage: false,
      });

      const box = await el.boundingBox();
      if (box && box.height > 1200) {
        await page.evaluate((s) => {
          const elem = document.querySelector(s);
          if (elem) elem.scrollIntoView({ block: "center" });
        }, sel);
        await page.waitForTimeout(400);
        await page.screenshot({
          path: `e2e/screenshots/audit-${String(i + 2).padStart(2, "0")}-${sel.replace("#", "")}-mid.png`,
          fullPage: false,
        });

        await page.evaluate((s) => {
          const elem = document.querySelector(s);
          if (elem) elem.scrollIntoView({ block: "end" });
        }, sel);
        await page.waitForTimeout(400);
        await page.screenshot({
          path: `e2e/screenshots/audit-${String(i + 2).padStart(2, "0")}-${sel.replace("#", "")}-end.png`,
          fullPage: false,
        });
      }
    }
  }

  await page.screenshot({ path: "e2e/screenshots/audit-full.png", fullPage: true });
});
