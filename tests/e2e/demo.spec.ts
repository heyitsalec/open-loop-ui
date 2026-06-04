import { expect, test } from '@playwright/test';

const scenes = ['dashboard', 'portfolio', 'operator', 'mobile'] as const;

test('demo scenes render without horizontal overflow', async ({ page }) => {
  for (const scene of scenes) {
    await page.goto(`/?scene=${scene}`);
    await expect(page.getByTestId('demo-scene')).toBeVisible();
    await expect(page.getByText('Open Loop UI').first()).toBeVisible();
    const hasNoOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
    expect(hasNoOverflow, `${scene} should not overflow horizontally`).toBe(true);
  }
});

test('element picker highlights the selected scene region', async ({ page }) => {
  await page.goto('/?scene=operator');
  await page.getByTestId('open-loop-pill').click();
  await page.getByTestId('open-loop-input').fill('Tighten the queue map spacing and make the selected node easier to scan.');
  await page.getByRole('button', { name: /point at an element/i }).click();

  const target = page.locator('.operator-node.n-1');
  const box = await target.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width * 0.5, box!.y + box!.height * 0.52);

  await expect(page.locator('.olu-pointer-rect')).toBeVisible();
  await expect(page.locator('.olu-pointer-rect')).toContainText('Review workflow node');
});

test('submit creates a local item and closes the panel', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Submit coverage uses the desktop layout; mobile is covered by scene and picker smoke tests.');
  await page.goto('/?scene=mobile');
  await page.getByTestId('open-loop-pill').click();
  await page.getByTestId('open-loop-input').fill('Make the mobile header card feel more tappable.');
  await page.getByRole('button', { name: /point at an element/i }).click();

  const target = page.locator('[data-open-loop-id="mobile-header-card"]');
  const box = await target.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.click(box!.x + box!.width * 0.5, box!.y + box!.height * 0.5);

  await expect(page.getByText(/anchored to/i)).toBeVisible();
  await page.getByTestId('open-loop-submit').click();
  await expect(page.getByTestId('open-loop-toast')).toBeVisible();
  await expect(page.locator('.demo-feed-item')).toBeVisible();
  await expect(page.getByTestId('open-loop-panel')).toBeHidden();
});

test('reduced-motion mode keeps the demo usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?scene=dashboard');
  await page.getByTestId('open-loop-pill').click();
  await page.getByTestId('open-loop-input').fill('Motion should respect reduced motion preferences.');
  await expect(page.getByText('motion tweak')).toBeVisible();
});
