# Public Release Checklist

Use this before flipping the repository public, and again before each notable update. The goal is simple: make the first visit visual, useful, and easy to trust.

## Public Story

Short version:

> Open Loop UI is a floating design feedback loop for React apps. Click any DOM element, describe what should improve, and hand a structured payload to your local agent, CLI, issue tracker, or PR flow.

Slightly warmer version:

> A tiny "Improve UI" button for any app. It knows what element you clicked, previews the kind of work it is, and hands the feedback to whatever system you trust to do the next step.

## Public Surfaces

- **GitHub:** publish as `open-loop-ui`, pin it, and make the README screenshots the first thing people see.
- **Portfolio site:** add it as a featured project, framed as a reusable UI pattern extracted from real product work.
- **Work marketplace profile:** use it as a portfolio item for frontend, React component systems, design engineering, and local-agent tooling.
- **Social posts:** share the tiny story: "I kept wanting this in every app I built, so I packaged it."
- **Portfolio case study:** show the before/after: vague feedback becomes element-targeted, typed, screenshot-backed work.

## Launch Checklist

- Confirm the README opens with the strongest screenshot or GIF.
- Confirm the hero, DOM selection, message handoff, PR proof, and WebM assets were regenerated from Playwright.
- Add a portfolio project page with the screenshots and one short demo clip.
- Add a work marketplace portfolio entry with the same screenshot set.
- Prepare one short post with the "tiny button, real DOM target" hook.
- Record `docs/assets/open-loop-demo.webm` or `docs/assets/open-loop-demo.gif`.
- For launch PRs or release notes, attach the Playwright screenshots directly in the review/chat summary.
- Remove `"private": true` only when publishing to npm.
- Use the [Community Growth Playbook](community-growth-playbook.md) as the reusable launch checklist for this and the next couple of OSS projects.

## Proof Assets

Current stills:

- `docs/assets/open-loop-hero.png`
- `docs/assets/open-loop-pill.png`
- `docs/assets/open-loop-dom-selection.png`
- `docs/assets/open-loop-targeting.png`
- `docs/assets/open-loop-panel.png`
- `docs/assets/open-loop-handoff.png`
- `docs/assets/open-loop-message-flow.png`
- `docs/assets/open-loop-pr-proof.png`

Video:

- `docs/assets/open-loop-demo.webm`

The screenshots are not decoration. They are part of the pitch: this component can prove its own UX in a PR.
