# Vite Basic Example

This example shows the smallest useful browser-only setup: wrap your app, import the CSS, and send payloads to an adapter.

```bash
npm install
npm run dev
```

The mock adapter keeps everything local. Swap it for a `fetch('/api/open-loop')` adapter when your app has a server boundary.
