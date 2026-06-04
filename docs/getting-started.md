# Getting Started

Open Loop UI is a React package plus a small adapter boundary. Drop it into the app, label a few interesting regions, and suddenly the UI can point at itself.

```tsx
import { OpenLoopProvider } from '@alecbot/open-loop-ui';
import '@alecbot/open-loop-ui/styles.css';

export function App() {
  return (
    <OpenLoopProvider
      appId="demo"
      adapter={async (payload) => {
        const response = await fetch('/api/open-loop', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload)
        });
        return response.json();
      }}
    >
      <section data-open-loop-label="Dashboard canvas">
        Your app goes here.
      </section>
    </OpenLoopProvider>
  );
}
```

Add `data-open-loop-label` to regions you want the picker to name clearly. If no label is present, Open Loop UI falls back to nearby ids, class names, or tag names.

```tsx
<section data-open-loop-label="Revenue chart">
  <Chart />
</section>
```

When someone clicks that region, the payload includes the human label, a selector, and the target rectangle. That is the magic trick: the feedback is not floating around in a vague “page comment” cloud. It is attached to the actual interface.

The default shortcut is `Cmd+.` on macOS and `Ctrl+.` elsewhere.

For static demos and tests, use the mock adapter:

```ts
import { createMockAdapter } from '@alecbot/open-loop-ui/adapters/mock';
```

The package does not care what happens after submit. Make a Linear issue, call a local model, open a draft PR comment, or just log the payload while you noodle. It is politely nosy, not bossy.
