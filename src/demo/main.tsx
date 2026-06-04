import React from 'react';
import { createRoot } from 'react-dom/client';
import { createMockAdapter } from '../adapters/mock';
import { OpenLoopProvider } from '../index';
import '../styles.css';
import { DemoApp } from './DemoApp';
import './demo.css';

const demoParams = new URLSearchParams(window.location.search);
const demoAdapter = createMockAdapter({
  delayMs: 240,
  externalIdPrefix: 'OPEN',
  fail: demoParams.has('failAdapter')
});
const demoMetadata = { environment: 'local-demo', adapter: 'mock-cli-shape' };

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <OpenLoopProvider
      adapter={demoAdapter}
      appId="open-loop-demo"
      appName="Open Loop UI demo"
      appMetadata={demoMetadata}
    >
      <DemoApp />
    </OpenLoopProvider>
  </React.StrictMode>
);
