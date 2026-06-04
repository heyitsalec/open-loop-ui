# Open Loop UI

![Open Loop UI hero screenshot](docs/assets/open-loop-hero.png)

A drop-in floating design feedback loop for React apps. Tiny button, big opinions.

Open Loop UI turns the best part of a design review into a reusable component: point at a real DOM element, describe the improvement, preview how it will route, and hand the request to any local CLI or agent through a small JSON contract.

It is meant to sit inside almost any application: dashboards, mobile shells, internal tools, portfolio sites, weird little agent workbenches, or the admin page nobody admits they use every day. The app keeps being the app. Open Loop just gives it a cheerful little "make this better" button.

```bash
npm install @alecbot/open-loop-ui
```

```tsx
import { OpenLoopProvider } from '@alecbot/open-loop-ui';
import '@alecbot/open-loop-ui/styles.css';

export function App() {
  return (
    <OpenLoopProvider
      appId="my-product"
      adapter={async (payload) => {
        const response = await fetch('/api/open-loop', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload)
        });
        return response.json();
      }}
    >
      <main data-open-loop-label="Main product canvas">
        <Dashboard />
      </main>
    </OpenLoopProvider>
  );
}
```

## Why It Stands Out

- It feels like a real product surface, not a comment box bolted to a page.
- The floating pill is small, memorable, keyboard-friendly, and ready for screenshots.
- Element targeting uses real DOM labels: add `data-open-loop-label="Revenue chart"` and the handoff knows exactly where the feedback belongs.
- The preview turns vague feedback into a visible routing decision: bug, copy, layout, color, motion, or idea.
- Playwright captures the proof states, so a PR can show the actual recorded UI image right in the review/chat thread instead of asking people to imagine it.
- The package never writes files or calls a provider directly. It collects intent and sends JSON to your adapter.

## The Fun Bit

Open the pill, click a real element, and Open Loop records the label, selector, target rectangle, draft, classification, and app metadata. That payload can become an issue tracker item, a local agent task, a design review note, a PR comment, or whatever your team uses to keep work moving.

The demo captures README-ready Playwright assets from sanitized app scenes:

- the quiet floating pill
- the DOM element targeting overlay
- the live routing panel
- the adapter handoff after submit
- a short WebM walkthrough of the same flow

The screenshots and video are generated from real interaction states, not mocked pixels. That is the whole trick: the component can prove its own UX in review.

<video src="docs/assets/open-loop-demo.webm" controls muted playsinline></video>

## Screenshots

| Hero flow | Floating pill |
|---|---|
| ![Open Loop UI hero flow](docs/assets/open-loop-hero.png) | ![Floating Improve UI pill](docs/assets/open-loop-pill.png) |

| Element targeting | Live panel |
|---|---|
| ![Open Loop element targeting](docs/assets/open-loop-targeting.png) | ![Open Loop panel](docs/assets/open-loop-panel.png) |

| Adapter handoff |
|---|---|
| ![Open Loop handoff](docs/assets/open-loop-handoff.png) |

## CLI Adapter Contract

The CLI adapter is model-agnostic. It runs your command, writes one JSON payload to stdin, and expects one JSON object on stdout.

Use it from a Node-capable boundary such as a local server, Electron main process, devtool backend, or script:

```ts
import { createCliAdapter } from '@alecbot/open-loop-ui/adapters/cli';

export const openLoopAdapter = createCliAdapter({
  command: 'open-loop-agent',
  timeoutMs: 15000
});
```

```json
{
  "item": {
    "id": "LOOP-K8YTM",
    "title": "Tighten chart spacing",
    "status": "local-preview"
  },
  "text": "Tighten chart spacing",
  "target": {
    "label": "Revenue chart",
    "selector": "[data-open-loop-label=\"Revenue chart\"]"
  },
  "classification": {
    "kind": "layout_tweak",
    "route": "design",
    "depth": "medium"
  },
  "app": {
    "id": "my-product"
  }
}
```

Return:

```json
{
  "ok": true,
  "externalId": "TASK-123",
  "url": "https://example.test/TASK-123",
  "message": "Queued for design review"
}
```

## Development

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run capture
```

`npm run test:e2e` refreshes the README screenshots and WebM under `docs/assets/`. `npm run capture` runs only the capture spec; set `OPEN_LOOP_CAPTURE_GIF=1` to also write an optional GIF when `ffmpeg` is installed.

## Docs

- [Getting started](docs/getting-started.md)
- [Adapter contract](docs/adapter-contract.md)
- [Theming](docs/theming.md)
- [Accessibility](docs/accessibility.md)
- [Screenshot playbook](docs/screenshot-playbook.md)
- [Implementation learnings](docs/implementation-learnings.md)
- [Public release checklist](docs/public-release-checklist.md)
- [Community growth playbook](docs/community-growth-playbook.md)
