# Contributing

Thanks for helping make Open Loop UI better. The project is intentionally small: polished React UI, a stable JSON handoff, and adapters that let host apps decide what happens next.

## Local Setup

```bash
npm install
npm run dev
```

Before opening a PR, run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:consumer
npm run test:e2e:smoke
```

Before release or launch-focused PRs, run:

```bash
npm run release:check
```

Use `npm run test:e2e` only when you intentionally want to refresh README screenshots.

## Good First Contributions

The best early contributions are docs, examples, accessibility polish, adapter recipes, and focused tests. Please keep the core package model-agnostic: Open Loop UI should capture intent and call an adapter, not own auth, queues, model providers, issue trackers, or file writes.

## Pull Request Guidelines

- Keep changes scoped and explain the user-facing behavior.
- Add or update tests for runtime behavior.
- Include screenshots or a short clip for visual changes.
- Avoid adding required dependencies unless they clearly improve the core package.

## Release Notes

Changes that affect package behavior, public exports, adapter contracts, docs, or setup should update `CHANGELOG.md`.
