# Screenshot Playbook

The README screenshots are captured by Playwright, because "trust me, it looks cool" is not quite the professional artifact we deserve:

```bash
npm run test:e2e
npm run capture
```

The capture flow writes:

- `docs/assets/open-loop-hero.png`
- `docs/assets/open-loop-pill.png`
- `docs/assets/open-loop-dom-selection.png`
- `docs/assets/open-loop-targeting.png`
- `docs/assets/open-loop-panel.png`
- `docs/assets/open-loop-handoff.png`
- `docs/assets/open-loop-message-flow.png`
- `docs/assets/open-loop-pr-proof.png`
- `docs/assets/open-loop-demo.webm`

`npm run test:e2e` runs the whole browser suite and refreshes assets. `npm run capture` runs only the capture spec. Set `OPEN_LOOP_CAPTURE_GIF=1` to write `docs/assets/open-loop-demo.gif` too, but keep WebM as the primary video artifact.

Before publishing, inspect the images and keep only states that communicate the value quickly:

- The hero should show a real host app, a selected DOM target, and the panel at once.
- The pill should be visible without hiding important UI.
- The targeting screenshot should show a real highlighted DOM region.
- The DOM selection screenshot should include a visible cursor over the selected element.
- The panel screenshot should show typed feedback and routing preview chips.
- The handoff screenshot should show the JSON contract or submitted local item.
- The message handoff screenshot can be mocked, but it should use real provider state for the anchor text/item where possible.
- The PR proof screenshot should show a preview image and an approve action without naming private services.
- The WebM should show pill -> panel -> target -> submit -> toast without long dead air.

## PR / Chat Proof

For launch PRs, attach the Playwright images directly in the PR thread or chat summary:

- `open-loop-hero.png` makes the first impression.
- `open-loop-dom-selection.png` proves the DOM-element picker works.
- `open-loop-panel.png` proves the component has the product polish.
- `open-loop-message-flow.png` shows a request moving through a chat-like handoff.
- `open-loop-pr-proof.png` shows the payoff: preview image in chat plus approval.
- `open-loop-handoff.png` proves the payload is real, structured, and adapter-ready.

The video should sit next to those stills:

1. Pill appears on a normal app screen.
2. User opens the panel.
3. User points at a DOM element.
4. User submits.
5. Adapter JSON and local feed update.

Keep the still screenshots anyway; they render faster in README and make PR review friendlier.
