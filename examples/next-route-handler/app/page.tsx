'use client';

import { OpenLoopProvider } from '@heyitsalec/open-loop-ui';
import type { OpenLoopAdapterPayload } from '@heyitsalec/open-loop-ui';

async function sendToRoute(payload: OpenLoopAdapterPayload) {
  const response = await fetch('/api/open-loop', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return response.json();
}

export default function Page() {
  return (
    <OpenLoopProvider appId="next-route-handler" adapter={sendToRoute}>
      <main className="shell">
        <section className="panel" data-open-loop-label="Next.js example panel">
          <h1>Send feedback through a route handler.</h1>
          <p>The browser collects UI intent. The server route decides where it goes next.</p>
        </section>
      </main>
    </OpenLoopProvider>
  );
}
