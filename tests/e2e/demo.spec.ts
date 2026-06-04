import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { expect, test } from '@playwright/test';

const assets = {
  pill: 'docs/assets/open-loop-pill.png',
  targeting: 'docs/assets/open-loop-targeting.png',
  panel: 'docs/assets/open-loop-panel.png',
  handoff: 'docs/assets/open-loop-handoff.png'
};

test('demo renders without horizontal overflow', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Open Loop UI').first()).toBeVisible();
  const hasNoOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
  expect(hasNoOverflow).toBe(true);
});

test('captures README screenshot states', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Screenshots are captured once on the desktop project.');
  for (const path of Object.values(assets)) mkdirSync(dirname(path), { recursive: true });

  await page.addInitScript({
    content: `
      (() => {
        const fixed = new Date('2026-06-04T12:00:00.000Z').valueOf();
        const NativeDate = Date;
        function FixedDate(...args) {
          return args.length > 0 ? new NativeDate(...args) : new NativeDate(fixed);
        }
        FixedDate.now = () => fixed;
        FixedDate.UTC = NativeDate.UTC;
        FixedDate.parse = NativeDate.parse;
        FixedDate.prototype = NativeDate.prototype;
        window.Date = FixedDate;
      })();
    `
  });
  await page.goto('/');
  await expect(page.getByTestId('open-loop-pill')).toBeVisible();
  await page.screenshot({ path: assets.pill, fullPage: true });

  await page.getByTestId('open-loop-pill').click();
  await expect(page.getByTestId('open-loop-panel')).toBeVisible();
  await page.getByTestId('open-loop-input').fill('Tighten the spacing around the chart and make the hover state feel more tactile.');
  await expect(page.getByText('layout tweak')).toBeVisible();
  await page.screenshot({ path: assets.panel, fullPage: true });

  await page.getByRole('button', { name: /point at an element/i }).click();
  const chart = page.locator('[data-open-loop-id="product-dashboard-canvas"] .demo-chart');
  const box = await chart.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width * 0.45, box!.y + box!.height * 0.44);
  await expect(page.locator('.olu-pointer-rect')).toBeVisible();
  await page.screenshot({ path: assets.targeting, fullPage: true });

  await page.mouse.click(box!.x + box!.width * 0.45, box!.y + box!.height * 0.44);
  await expect(page.getByText(/anchored to/i)).toBeVisible();
  await page.getByTestId('open-loop-submit').click();
  await expect(page.getByTestId('open-loop-toast')).toBeVisible();
  await expect(page.locator('.demo-feed-item')).toBeVisible();
  await expect(page.getByTestId('open-loop-panel')).toBeHidden();
  await page.screenshot({ path: assets.handoff, fullPage: true });
});

test('reduced-motion mode keeps the demo usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByTestId('open-loop-pill').click();
  await page.getByTestId('open-loop-input').fill('Motion should respect reduced motion preferences.');
  await expect(page.getByText('motion tweak')).toBeVisible();
});
