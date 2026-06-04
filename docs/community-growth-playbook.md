# Community Growth Playbook

This is the low-drama plan for earning attention without pretending the internet is a vending machine. The goal is simple: make the project easy to understand, easy to try, easy to share, and obviously made by someone with taste.

## Easy Wins Before Public Launch

- **Pin the visual proof first.** Keep the README screenshot above the fold, then show targeting, panel, and handoff screenshots before the deeper API details.
- **Keep the 20-30 second demo clip sharp.** A short `open-loop-demo.webm` showing pill -> target -> submit -> JSON handoff will do more than five paragraphs.
- **Show why it beats chat alone.** Use `open-loop-dom-selection.png`, `open-loop-message-flow.png`, and `open-loop-pr-proof.png` together: clicked DOM target, request sent, preview image returned for approval.
- **Use sharp GitHub topics.** Start with `react`, `typescript`, `vite`, `ui`, `design-tools`, `developer-tools`, `feedback`, `playwright`, `agent-tools`.
- **Make the repo description concrete.** Suggested: `A floating design feedback loop for React apps: click a DOM element, describe the fix, hand JSON to your agent or CLI.`
- **Add a social preview image.** Use `docs/assets/open-loop-hero.png` or a cropped composite of targeting + panel.
- **Ship one "copy-paste in 60 seconds" example.** The README already has the provider snippet; keep it near the top.
- **Add a tiny examples folder later.** `examples/vite-basic` and `examples/next-route-handler` would make the project feel immediately usable.
- **Open 3-5 starter issues.** Good first issues make the repo feel alive: Next.js example, demo video, theme preset, adapter examples, docs polish.

## Launch Sequence

1. Finish docs, screenshots, and video while the repo is still in prep mode.
2. Configure GitHub topics, description, social preview, and pinned README screenshots.
3. Publish one portfolio project page first, so GitHub visitors have somewhere warm to learn more.
4. Share the repo in one tight post: visual hook, one-sentence value prop, GIF/video, GitHub link.
5. Add it to a portfolio or work marketplace profile with screenshots and the "real DOM element -> structured handoff" story.
6. Use follow-up posts sparingly: one technical thread about adapter design, one visual thread about the interaction pattern, one "what I learned extracting this from real apps" note.

## Places To Share

- **GitHub profile README / pinned repos:** strongest evergreen surface.
- **Portfolio site:** best professional narrative surface.
- **Work marketplace portfolio:** best conversion surface for design-engineering work.
- **LinkedIn:** best "I build polished tools" surface.
- **X / Bluesky:** best GIF-friendly quick demo surface.
- **Relevant developer communities:** share only when it solves a conversation people are already having.
- **Hacker News / Reddit:** wait until the demo video and examples are strong; those audiences punish hand-wavy launches and reward concrete tools.

## Post Templates

Short post:

> I kept wanting a tiny "Improve UI" loop inside every app I was building, so I packaged it.
>
> Open Loop UI lets you click a real DOM element, describe what should change, and hand structured JSON to your local agent, CLI, or issue flow.
>
> React + TypeScript + Playwright proof screenshots.

More technical post:

> Small pattern I like: UI feedback should point at the actual interface, not float around as vague prose.
>
> Open Loop UI captures: label, selector, target rectangle, draft, classification, and app metadata. The adapter decides whether that becomes an issue tracker item, PR note, local model task, or CLI handoff.

Portfolio caption:

> Extracted from real product work, Open Loop UI is a reusable React component for element-targeted design feedback. It shows a taste for polished interfaces, practical developer APIs, and proof-driven UI workflows.

## Reusable Learnings For The Next OSS Projects

- **Lead with proof, then explain.** Screenshot/GIF first, architecture second.
- **Name the tiny magic trick.** For this project it is "real DOM element -> structured handoff." Every project needs its equivalent.
- **Keep the first install path boring.** Fancy internals are fine; setup should be uneventful.
- **Make boundaries explicit.** This package collects intent; adapters own writes. That clarity builds trust.
- **Document launch surfaces early.** GitHub, portfolio, work marketplace, issue tracker, and social copy should be planned before flipping public.
- **Capture PR-ready artifacts.** Screenshots, video, and test output make a project feel real before anyone reads the code.
- **Leave breadcrumbs for contributors.** Starter issues, examples, and docs gaps are invitations.
- **Keep the voice human.** Warm beats corporate. Specific beats hype. A little personality is good; too much bit gets distracting.

## Open Loop UI Specific Hooks

- "Add a tiny Improve UI button to any React app."
- "Click a DOM element, not just a blank comment field."
- "The loop comes back with a preview image and an approval path."
- "Model-agnostic: your adapter decides what happens next."
- "Playwright-backed screenshots prove the interaction in PR review."
- "Useful for dashboards, internal tools, portfolios, agent workbenches, and app prototypes."

## Things Not To Do Yet

- Do not publish to npm before the repo is public-ready.
- Do not over-explain agent internals in the README.
- Do not launch without refreshing the short demo clip if you can avoid it.
- Do not post the same announcement everywhere with identical copy.
- Do not chase stars at the expense of making the project actually useful.
