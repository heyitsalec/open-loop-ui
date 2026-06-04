# Screenshot Playbook

The README screenshots are captured by Playwright, because “trust me, it looks cool” is not quite the professional artifact we deserve:

```bash
npm run test:e2e
```

The screenshot test writes:

- `docs/assets/open-loop-pill.png`
- `docs/assets/open-loop-targeting.png`
- `docs/assets/open-loop-panel.png`
- `docs/assets/open-loop-handoff.png`

Before publishing, inspect the images and keep only states that communicate the value quickly:

- The pill should be visible without hiding important UI.
- The targeting screenshot should show a real highlighted DOM region.
- The panel screenshot should show typed feedback and routing preview chips.
- The handoff screenshot should show the JSON contract or submitted local item.

## PR / Chat Proof

For launch PRs, attach the Playwright images directly in the PR thread or chat summary:

- `open-loop-targeting.png` proves the DOM-element picker works.
- `open-loop-panel.png` proves the component has the product polish.
- `open-loop-handoff.png` proves the payload is real, structured, and adapter-ready.

The nearly-finished next step is a short video capture of the same flow:

1. Pill appears on a normal app screen.
2. User opens the panel.
3. User points at a DOM element.
4. User submits.
5. Adapter JSON and local feed update.

That video should live next to the screenshots, probably as `docs/assets/open-loop-demo.webm` or `docs/assets/open-loop-demo.gif`. Keep the still screenshots anyway; they render faster in README and make PR review friendlier.
