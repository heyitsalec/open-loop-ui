import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { dirname } from 'node:path';
import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

const assets = {
  hero: 'docs/assets/open-loop-hero.png',
  pill: 'docs/assets/open-loop-pill.png',
  domSelection: 'docs/assets/open-loop-dom-selection.png',
  targeting: 'docs/assets/open-loop-targeting.png',
  panel: 'docs/assets/open-loop-panel.png',
  handoff: 'docs/assets/open-loop-handoff.png',
  messageFlow: 'docs/assets/open-loop-message-flow.png',
  prProof: 'docs/assets/open-loop-pr-proof.png',
  video: 'docs/assets/open-loop-demo.webm'
};

const stillDimensions: Array<[string, { width: number; height: number }]> = [
  [assets.hero, { width: 1440, height: 960 }],
  [assets.pill, { width: 1437, height: 896 }],
  [assets.domSelection, { width: 1093, height: 551 }],
  [assets.targeting, { width: 1093, height: 551 }],
  [assets.panel, { width: 464, height: 474 }],
  [assets.handoff, { width: 440, height: 320 }],
  [assets.messageFlow, { width: 600, height: 760 }],
  [assets.prProof, { width: 600, height: 760 }]
];

const STILL_STYLE = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    scroll-behavior: auto !important;
  }
  .olu-backdrop {
    background: oklch(23% 0.045 150 / 0.14) !important;
    backdrop-filter: blur(2px) saturate(0.9) !important;
  }
  .olu-toast {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
`;

test.describe.configure({ mode: 'serial' });

test('captures composed README screenshot states', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Screenshots are captured once on the desktop project.');
  for (const path of Object.values(assets)) mkdirSync(dirname(path), { recursive: true });

  await preparePage(page, 'operator');
  await openPanelWithText(page, 'Make the queue cards easier to scan and soften the hover motion.');
  await selectTarget(page, '.operator-node.n-1');
  await expect(page.getByText(/anchored to/i)).toBeVisible();
  await screenshotUnion(page, [page.locator('.demo-workbench'), page.getByTestId('open-loop-panel')], assets.hero, 18);

  await preparePage(page, 'portfolio');
  await expect(page.getByTestId('open-loop-pill')).toBeVisible();
  await screenshotUnion(page, [page.getByTestId('demo-scene'), page.getByTestId('open-loop-pill')], assets.pill, 18);

  await preparePage(page, 'operator');
  await openPanelWithText(page, 'Tighten the map spacing and make active nodes easier to scan.');
  await startTargeting(page, '.operator-node.n-2');
  await expect(page.locator('.olu-pointer-rect')).toContainText('Patch workflow node');
  await screenshotUnion(page, [page.locator('.olu-pointer-rect'), page.getByTestId('open-loop-panel')], assets.targeting, 26);

  await addCaptureCursor(page, '.operator-node.n-2');
  await screenshotUnion(
    page,
    [page.locator('.olu-pointer-rect'), page.getByTestId('open-loop-panel'), page.locator('.demo-capture-cursor')],
    assets.domSelection,
    26
  );

  await preparePage(page, 'dashboard');
  await openPanelWithText(page, 'Tighten the spacing around the chart and make the hover state feel more tactile.');
  await expect(page.getByText('layout tweak')).toBeVisible();
  await screenshotUnion(page, [page.getByTestId('open-loop-panel')], assets.panel, 24);

  await preparePage(page, 'mobile');
  await openPanelWithText(page, 'Make the mobile header card feel more tappable.');
  await selectTarget(page, '[data-open-loop-id="mobile-header-card"]');
  await page.getByTestId('open-loop-submit').click();
  await expect(page.getByTestId('open-loop-toast')).toBeVisible();
  await expect(page.locator('.demo-feed-item')).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.addStyleTag({
    content: '.olu-toast { right: 52px !important; bottom: 118px !important; z-index: 9999 !important; }'
  });
  await screenshotClip(page, assets.handoff, { x: 980, y: 620, width: 440, height: 320 });

  await preparePage(page, 'operator', { proof: 'message' });
  await submitProofRequest(page);
  await expect(page.getByText(/Branch preview is starting/i)).toBeVisible();
  await screenshotClip(page, assets.messageFlow, { x: 820, y: 82, width: 600, height: 760 });

  await preparePage(page, 'operator', { proof: 'pr' });
  await submitProofRequest(page);
  await expect(page.getByText(/PR #42 is up/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /approve/i })).toBeVisible();
  await screenshotClip(page, assets.prProof, { x: 820, y: 82, width: 600, height: 760 });

  for (const [path, expected] of stillDimensions) {
    expect(existsSync(path), `${path} should exist`).toBe(true);
    expect(pngDimensions(path), `${path} should have deterministic dimensions`).toEqual(expected);
    expect(statSync(path).size, `${path} should not be empty`).toBeGreaterThan(8_000);
  }
});

test('captures the README demo video', async ({ browser }, testInfo) => {
  test.setTimeout(60_000);
  test.skip(testInfo.project.name !== 'chromium', 'Video is captured once on the desktop project.');
  const tmpDir = 'docs/assets/.video-tmp';
  rmSync(tmpDir, { recursive: true, force: true });
  mkdirSync(tmpDir, { recursive: true });
  mkdirSync(dirname(assets.video), { recursive: true });

  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:5174',
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: tmpDir,
      size: { width: 1280, height: 720 }
    }
  });
  await context.addInitScript(fixedDateScript());
  const page = await context.newPage();

  await page.goto('/?scene=operator&capture=video&proof=sequence');
  await expect(page.getByTestId('demo-scene')).toBeVisible();
  await expect(page.getByTestId('demo-proof-waiting')).toBeVisible();
  await page.addStyleTag({ content: '.olu-toast { display: none !important; }' });
  await page.waitForTimeout(300);
  await page.getByTestId('open-loop-pill').click();
  await page.waitForTimeout(200);
  const input = page.getByTestId('open-loop-input');
  await input.click();
  await input.pressSequentially('Make the review queue easier to scan.', { delay: 12 });
  await page.waitForTimeout(200);
  await startTargeting(page, '.operator-node.n-2', { cursor: true });
  await expect(page.locator('.olu-pointer-rect')).toContainText('workflow node');
  await page.waitForTimeout(350);
  await hoverCaptureTarget(page, '.operator-node.n-1', { cursor: true });
  await expect(page.locator('.olu-pointer-rect')).toContainText('workflow node');
  await page.waitForTimeout(350);
  await hoverCaptureTarget(page, '.operator-queue', { cursor: true });
  await expect(page.locator('.olu-pointer-rect')).toContainText('Operator queue panel');
  await page.waitForTimeout(450);
  await clickTarget(page, '.operator-queue');
  await page.waitForTimeout(250);
  await expect(page.getByText(/anchored to/i)).toBeVisible();
  await page.getByTestId('open-loop-submit').click();
  await expect(page.getByText(/LLM thinking/i)).toBeVisible();
  await page.waitForTimeout(850);
  await expect(page.getByText(/Branch preview is starting/i)).toBeVisible();
  await page.waitForTimeout(1_200);
  await expect(page.getByText(/PR #42 is up/i)).toBeVisible();
  await expect(page.getByText(/image proof/i)).toBeVisible();
  await expect(page.getByText('improvement WebM', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /approve/i })).toBeVisible();
  await page.waitForTimeout(1_350);

  const video = page.video();
  await page.close();
  await context.close();
  const videoPath = await video?.path();
  expect(videoPath).toBeTruthy();
  copyFileSync(videoPath!, assets.video);
  rmSync(tmpDir, { recursive: true, force: true });

  expect(existsSync(assets.video)).toBe(true);
  expect(statSync(assets.video).size).toBeGreaterThan(50_000);
});

async function preparePage(page: Page, scene: string, options: { proof?: 'message' | 'pr' | 'sequence' } = {}) {
  await page.addInitScript(fixedDateScript());
  const params = new URLSearchParams({ scene, capture: 'stills' });
  if (options.proof) params.set('proof', options.proof);
  await page.goto(`/?${params.toString()}`);
  await page.addStyleTag({ content: STILL_STYLE });
  await expect(page.getByTestId('demo-scene')).toBeVisible();
}

async function openPanelWithText(page: Page, text: string) {
  await page.getByTestId('open-loop-pill').click();
  await expect(page.getByTestId('open-loop-panel')).toBeVisible();
  await page.getByTestId('open-loop-input').fill(text);
}

async function startTargeting(page: Page, selector: string, options: { cursor?: boolean } = {}) {
  await page.getByRole('button', { name: /point at an element/i }).click();
  await hoverCaptureTarget(page, selector, options);
}

async function hoverCaptureTarget(page: Page, selector: string, options: { cursor?: boolean } = {}) {
  const box = await page.locator(selector).boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width * 0.48, box!.y + box!.height * 0.5, { steps: 8 });
  if (options.cursor) await addCaptureCursor(page, selector);
  await expect(page.locator('.olu-pointer-rect')).toBeVisible();
}

async function selectTarget(page: Page, selector: string) {
  await startTargeting(page, selector);
  await clickTarget(page, selector);
}

async function submitProofRequest(page: Page) {
  await openPanelWithText(page, 'Make the review queue easier to scan and give the active item a calmer highlight.');
  await selectTarget(page, '.operator-queue');
  await page.getByTestId('open-loop-submit').click();
  await expect(page.getByTestId('open-loop-panel')).toBeHidden();
  await expect(page.getByTestId('demo-proof-flow')).toBeVisible();
  await page.addStyleTag({ content: '.olu-toast { display: none !important; }' });
}

async function clickTarget(page: Page, selector: string) {
  const box = await page.locator(selector).boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.click(box!.x + box!.width * 0.48, box!.y + box!.height * 0.5);
}

async function addCaptureCursor(page: Page, selector: string) {
  const box = await page.locator(selector).boundingBox();
  expect(box).not.toBeNull();
  await page.evaluate(({ x, y }) => {
    let cursor = document.querySelector('.demo-capture-cursor');
    const style = [
      'position: fixed',
      `left: ${x}px`,
      `top: ${y}px`,
      'z-index: 2147483647',
      'width: 38px',
      'height: 38px',
      'pointer-events: none',
      'filter: drop-shadow(0 10px 14px rgb(0 0 0 / 0.28))',
      'transition: left 180ms ease, top 180ms ease'
    ].join(';');
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.className = 'demo-capture-cursor';
      cursor.innerHTML = `
        <svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true">
          <path d="M8 5.5 31 22.6 20.4 25.1 16 35.5 8 5.5Z" fill="#123522" stroke="#f7fff2" stroke-width="2.8" />
          <path d="M19.6 24.8 28 34" stroke="#f7fff2" stroke-width="3.2" stroke-linecap="round" />
        </svg>
      `;
      document.body.append(cursor);
    }
    cursor.setAttribute('style', style);
  }, {
    x: box!.x + box!.width * 0.56,
    y: box!.y + box!.height * 0.56
  });
  await expect(page.locator('.demo-capture-cursor')).toBeVisible();
}

async function screenshotUnion(page: Page, locators: Locator[], path: string, padding: number) {
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  const boxes = (await Promise.all(locators.map((locator) => locator.boundingBox()))).filter((box) => box !== null);
  expect(boxes.length, `capture boxes for ${path}`).toBeGreaterThan(0);

  const left = Math.max(0, Math.floor(Math.min(...boxes.map((box) => box!.x)) - padding));
  const top = Math.max(0, Math.floor(Math.min(...boxes.map((box) => box!.y)) - padding));
  const right = Math.min(viewport!.width, Math.ceil(Math.max(...boxes.map((box) => box!.x + box!.width)) + padding));
  const bottom = Math.min(viewport!.height, Math.ceil(Math.max(...boxes.map((box) => box!.y + box!.height)) + padding));

  await page.screenshot({
    path,
    scale: 'css',
    clip: {
      x: left,
      y: top,
      width: Math.max(1, right - left),
      height: Math.max(1, bottom - top)
    }
  });
}

async function screenshotClip(
  page: Page,
  path: string,
  clip: { x: number; y: number; width: number; height: number }
) {
  await page.screenshot({
    path,
    scale: 'css',
    clip
  });
}

function fixedDateScript() {
  return `
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
  `;
}

function pngDimensions(path: string) {
  const buffer = readFileSync(path);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}
