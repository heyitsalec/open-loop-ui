#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const result = spawnSync('npx', ['playwright', 'test', 'tests/e2e/capture.spec.ts', '--project=chromium'], {
  stdio: 'inherit'
});

if (result.status !== 0) process.exit(result.status ?? 1);

if (truthy(process.env.OPEN_LOOP_CAPTURE_GIF)) {
  const ffmpeg = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
  if (ffmpeg.status !== 0) {
    console.warn('OPEN_LOOP_CAPTURE_GIF was set, but ffmpeg was not found. Keeping WebM only.');
    process.exit(0);
  }

  const webm = 'docs/assets/open-loop-demo.webm';
  const gif = 'docs/assets/open-loop-demo.gif';
  if (!existsSync(webm)) {
    console.warn(`${webm} is missing. Skipping GIF conversion.`);
    process.exit(0);
  }

  const gifResult = spawnSync(
    'ffmpeg',
    ['-y', '-i', webm, '-vf', 'fps=8,scale=960:-1:flags=lanczos', '-loop', '0', gif],
    { stdio: 'inherit' }
  );
  if (gifResult.status !== 0) process.exit(gifResult.status ?? 1);
}

function truthy(value) {
  return value === '1' || value === 'true' || value === 'yes';
}
