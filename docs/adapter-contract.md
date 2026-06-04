# Adapter Contract

Adapters receive one `OpenLoopAdapterPayload` and return an `OpenLoopAdapterResult`. That payload/result pair is the stable 0.1 contract. Open Loop does not need to know whether the next stop is a shell script, an issue tracker item, a local model, a PR comment, or your own delightfully specific workflow.

```ts
export type OpenLoopAdapter = (
  payload: OpenLoopAdapterPayload
) => Promise<OpenLoopAdapterResult> | OpenLoopAdapterResult;
```

The package includes:

- `createMockAdapter()` for demos and tests.
- `createCliAdapter()` for local Node-capable contexts that can spawn a process.

The CLI adapter writes the payload to stdin and parses stdout as JSON. It does not know or care which model, provider, queue, or issue tracker your command uses. Do not import it directly into a browser-only React bundle; call it from a local server, Electron main process, devtool backend, or script.

```ts
createCliAdapter({
  command: 'open-loop-agent',
  args: ['--project', 'website'],
  timeoutMs: 15000
});
```

Nonzero exits, invalid JSON, spawn errors, and timeouts resolve to `{ ok: false }` instead of throwing into the UI.

## Why This Shape

The component is intentionally just the front door:

- UI captures the target, text, classification, and app metadata.
- Adapter decides where the work goes.
- Your system owns auth, provider choice, queueing, permission checks, and writes.

That makes it useful on a toy Vite app, an Electron control panel, a SaaS dashboard, or a portfolio site without changing the component itself.

## Browser Safety

The root package and mock adapter are browser-safe. `@alecbot/open-loop-ui/adapters/cli` uses `node:child_process`, so import it only from Node-capable code.
