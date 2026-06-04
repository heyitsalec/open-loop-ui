# Implementation Learnings

Open Loop UI came from a few private experiments with the same tiny idea: a floating control that lets a UI point at itself. This note keeps the reusable lessons public-safe and provider-agnostic.

## What Carried Over

- **Routing preview matters.** The strongest versions made the handoff visible before submit: kind, route, depth, selected target, and local preview state.
- **The picker needs real labels.** `data-open-loop-label` is the clean public version of the pattern. It keeps screenshots readable and payloads useful.
- **Filed-item polish is part of the pitch.** A success toast and local item feed make the loop feel finished instead of disappearing into a black box.
- **Chat can be the return lane.** A useful loop does not stop at "request sent"; it can show when a branch or PR is ready, attach a rendered preview image, and give the reviewer a clear approve action.
- **Screenshots should be generated, not hand-curated.** Deterministic Playwright states make the README and PR proof repeatable.
- **Video is the fastest explanation.** A 6-9 second GIF/WebM showing pill -> target -> chat response -> PR proof explains the component before anyone reads the API.

## What Stayed Out

- Provider-specific model names.
- Private project names or internal issue links.
- App-specific orchestration details.
- Direct file writes or production mutations.

The public package should stay boring at the boundary: collect intent, describe the DOM target, classify the draft, and hand JSON to an adapter.

## Current Drift Notes

- The public package has the cleanest API and theme surface.
- Older private widgets had useful ideas around screenshot drop, PR status, and filed-item history.
- The most compelling UI state is still the routing preview plus a highlighted DOM target.
- The next strongest state is the proof return: request message, PR-ready status, screenshot thumbnail, approve button.
- The capture harness should keep improving before the repo goes public, because the visuals are the pitch.
