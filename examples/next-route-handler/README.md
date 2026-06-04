# Next.js Route Handler Example

This example keeps `createCliAdapter` out of the browser. The React provider calls `/api/open-loop`, and the route handler owns the server-side handoff.

```bash
npm install
npm run dev
```

The included route returns a local JSON response. Replace the body of `app/api/open-loop/route.ts` with issue creation, queueing, or CLI handoff when you are ready.
