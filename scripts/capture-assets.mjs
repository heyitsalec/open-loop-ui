#!/usr/bin/env node

import { existsSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const result = spawnSync('npx', ['playwright', 'test', 'tests/e2e/capture.spec.ts', '--project=chromium'], {
  stdio: 'inherit'
});

if (result.status !== 0) process.exit(result.status ?? 1);

if (process.env.OPEN_LOOP_CAPTURE_GIF !== '0') {
  const ffmpeg = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
  if (ffmpeg.status !== 0) {
    console.warn('ffmpeg was not found. Keeping WebM only.');
    process.exit(0);
  }

  const webm = 'docs/assets/open-loop-demo.webm';
  const gif = 'docs/assets/open-loop-demo.gif';
  const palette = 'docs/assets/.open-loop-demo-palette.png';
  if (!existsSync(webm)) {
    console.warn(`${webm} is missing. Skipping GIF conversion.`);
    process.exit(0);
  }

  rmSync(palette, { force: true });
  const paletteResult = spawnSync(
    'ffmpeg',
    ['-y', '-i', webm, '-vf', 'fps=10,scale=960:-1:flags=lanczos,palettegen', '-frames:v', '1', '-update', '1', palette],
    { stdio: 'inherit' }
  );
  if (paletteResult.status !== 0) process.exit(paletteResult.status ?? 1);

  const gifResult = spawnSync(
    'ffmpeg',
    [
      '-y',
      '-i',
      webm,
      '-i',
      palette,
      '-lavfi',
      'fps=10,scale=960:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5',
      '-loop',
      '0',
      gif
    ],
    { stdio: 'inherit' }
  );
  rmSync(palette, { force: true });
  if (gifResult.status !== 0) process.exit(gifResult.status ?? 1);
}
