# Open Loop UI

[![npm version](https://img.shields.io/npm/v/%40alecbot%2Fopen-loop-ui.svg)](https://www.npmjs.com/package/@alecbot/open-loop-ui)
[![MIT license](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

![Open Loop UI end-to-end demo](docs/assets/open-loop-demo.gif)
Open Loop drives live ui/ux improvement while you actually use the app.  Make bug fixes, customizations, and features a delightful and frictionless part of your every day app use.  Empower technical and non technical users alike!

Open Loop UI turns the best part of a design review into a reusable component: point at a real DOM element, describe the improvement, preview how it will route, and hand the implementation request to any local CLI or agent through a small JSON contract.  It's a Tiny button, big opinions, and can hook into CLIs, agents, local llms.

It is meant to sit inside almost any application: dashboards, mobile shells, internal tools, portfolio sites, weird little agent workbenches, or the admin page nobody admits they use every day. The app keeps being the app. Open Loop just gives it a cheerful little "make this better" button.

```bash
npm install @alecbot/open-loop-ui
```

Works with React 18 and 19. The static demo ships with the repo and can be built with `npm run build:demo`.

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

## Supported Targets

Add `data-open-loop-label="Revenue chart"` to any region you want the picker to name clearly. Optional attributes:

- `data-open-loop-id` creates a stable selector.
- `data-open-loop-node-id` adds an internal node id to the payload.
- `data-open-loop-ignore="true"` keeps app chrome or overlays out of targeting.

If no label is present, Open Loop falls back to nearby ids, class names, or tag names.

## The Fun Bit

Open the pill, click a real element, and Open Loop records the label, selector, target rectangle, draft, classification, and app metadata. That payload can become an issue tracker item, a local agent task, a design review note, a PR comment, or whatever your team uses to keep work moving.

The demo captures README-ready Playwright assets from sanitized app scenes:

- the quiet floating pill
- the DOM element targeting overlay, including a cursor over the selected element
- the live routing panel
- the adapter handoff after submit
- a mock message handoff flow
- a mock PR-ready proof card with a rendered preview image and approve button
- a tight 6-9 second GIF/WebM walkthrough of the same flow

The screenshots and video are generated from real interaction states, not mocked pixels. That is the whole trick: the component can prove its own UX in review.

[Watch the higher-quality WebM walkthrough](docs/assets/open-loop-demo.webm).

## Screenshots

| Hero flow | Floating pill |
|---|---|
| ![Open Loop UI hero flow](docs/assets/open-loop-hero.png) | ![Floating Improve UI pill](docs/assets/open-loop-pill.png) |

| DOM selection | Live panel |
|---|---|
| ![Open Loop DOM selection with cursor](docs/assets/open-loop-dom-selection.png) | ![Open Loop panel](docs/assets/open-loop-panel.png) |

| Message handoff | PR proof |
|---|---|
| ![Open Loop message handoff](docs/assets/open-loop-message-flow.png) | ![Open Loop PR proof](docs/assets/open-loop-pr-proof.png) |

| Adapter handoff | Targeting crop |
|---|---|
| ![Open Loop handoff](docs/assets/open-loop-handoff.png) | ![Open Loop element targeting](docs/assets/open-loop-targeting.png) |

## CLI Adapter Contract

The adapter payload and result are the stable 0.1 contract. The CLI adapter is model-agnostic: it runs your command, writes one JSON payload to stdin, and expects one JSON object on stdout.

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
npm run test:e2e:smoke
npm run release:check
```

`npm run test:e2e:smoke` avoids rewriting tracked screenshots. Use `npm run test:e2e` when you intentionally want the full browser suite, including asset refresh. Use `npm run capture` when you only want to refresh the README screenshots, WebM, and GIF under `docs/assets/`; set `OPEN_LOOP_CAPTURE_GIF=0` to skip GIF conversion.

`npm run release:check` runs the full local launch gate, including demo build, smoke e2e, packed consumer verification, and npm pack dry-run. `npm pack` and `npm publish` also rebuild `dist` through `prepack` so the package does not ship stale output.

Build the static demo with:

```bash
npm run build:demo
```

## Examples

- [Vite basic](examples/vite-basic)
- [Next.js route handler](examples/next-route-handler)

## Docs

- [Getting started](docs/getting-started.md)
- [Adapter contract](docs/adapter-contract.md)
- [Theming](docs/theming.md)
- [Accessibility](docs/accessibility.md)
- [Screenshot playbook](docs/screenshot-playbook.md)
- [Starter issues](docs/starter-issues.md)
