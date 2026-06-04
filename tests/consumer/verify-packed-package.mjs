import { mkdtempSync, mkdirSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');
const temp = mkdtempSync(resolve(tmpdir(), 'open-loop-ui-consumer-'));
let packedPath;

function run(command, args, cwd = root) {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
}

try {
  const packOutput = run('npm', ['pack', '--json', '--ignore-scripts']);
  const [packInfo] = JSON.parse(packOutput);
  packedPath = resolve(root, packInfo.filename);

  writeFileSync(resolve(temp, 'package.json'), JSON.stringify({
    type: 'module',
    scripts: {
      build: 'vite build',
      verify: 'node verify.mjs'
    }
  }, null, 2));
  mkdirSync(resolve(temp, 'src'), { recursive: true });
  writeFileSync(resolve(temp, 'index.html'), '<div id="root"></div><script type="module" src="/src/main.tsx"></script>\n');
  writeFileSync(resolve(temp, 'vite.config.ts'), [
    "import react from '@vitejs/plugin-react';",
    "import { defineConfig } from 'vite';",
    'export default defineConfig({ plugins: [react()] });'
  ].join('\n'));
  writeFileSync(resolve(temp, 'src/main.tsx'), [
    "import { createRoot } from 'react-dom/client';",
    "import { OpenLoopProvider } from '@alecbot/open-loop-ui';",
    "import { createMockAdapter } from '@alecbot/open-loop-ui/adapters/mock';",
    "import '@alecbot/open-loop-ui/styles.css';",
    '',
    'createRoot(document.getElementById("root")!).render(',
    '  <OpenLoopProvider appId="consumer-fixture" adapter={createMockAdapter({ delayMs: 0 })}>',
    '    <main data-open-loop-label="Consumer fixture">Packed package works</main>',
    '  </OpenLoopProvider>',
    ');'
  ].join('\n'));
  writeFileSync(resolve(temp, 'verify.mjs'), [
    "import { existsSync } from 'node:fs';",
    "import React from 'react';",
    "import { renderToString } from 'react-dom/server';",
    "import { OpenLoopProvider } from '@alecbot/open-loop-ui';",
    "import { createMockAdapter } from '@alecbot/open-loop-ui/adapters/mock';",
    "import { createCliAdapter } from '@alecbot/open-loop-ui/adapters/cli';",
    '',
    "if (typeof createCliAdapter !== 'function') throw new Error('CLI adapter export is missing.');",
    "if (!existsSync('node_modules/@alecbot/open-loop-ui/dist/styles.css')) throw new Error('CSS export is missing.');",
    'const html = renderToString(',
    "  React.createElement(OpenLoopProvider, { renderChrome: false, adapter: createMockAdapter({ delayMs: 0 }) },",
    "    React.createElement('div', { 'data-open-loop-label': 'SSR fixture' }, 'ok')",
    '  )',
    ');',
    "if (!html.includes('SSR fixture')) throw new Error('Provider did not render children.');"
  ].join('\n'));

  run('npm', [
    'install',
    '--silent',
    '--no-package-lock',
    packedPath,
    'react@19.2.0',
    'react-dom@19.2.0',
    'vite@7.2.4',
    '@vitejs/plugin-react@5.1.1',
    'typescript@5.9.3'
  ], temp);
  run('npm', ['run', 'verify', '--silent'], temp);
  run('npm', ['run', 'build', '--silent'], temp);
} finally {
  if (packedPath) {
    try {
      unlinkSync(packedPath);
    } catch {
      // The pack step may have failed before writing a tarball.
    }
  }
  rmSync(temp, { force: true, recursive: true });
}
