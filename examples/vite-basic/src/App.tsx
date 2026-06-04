import { OpenLoopProvider } from '@alecbot/open-loop-ui';
import { createMockAdapter } from '@alecbot/open-loop-ui/adapters/mock';

export function App() {
  return (
    <OpenLoopProvider appId="vite-basic" adapter={createMockAdapter({ delayMs: 120 })}>
      <main className="shell">
        <section className="hero" data-open-loop-label="Example hero">
          <span>Open Loop UI</span>
          <h1>Point feedback at the actual interface.</h1>
          <p>Click the floating pill, select a region, and submit a local mock handoff.</p>
        </section>
        <section className="grid" data-open-loop-label="Example card grid">
          <article data-open-loop-label="Metric card">
            <strong>42</strong>
            <span>queued improvements</span>
          </article>
          <article data-open-loop-label="Adapter card">
            <strong>JSON</strong>
            <span>model-agnostic handoff</span>
          </article>
        </section>
      </main>
    </OpenLoopProvider>
  );
}
