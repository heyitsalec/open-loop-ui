import type { OpenLoopAdapterPayload, OpenLoopAdapterResult } from '@heyitsalec/open-loop-ui';

export async function POST(request: Request) {
  const payload = await request.json() as OpenLoopAdapterPayload;
  const result: OpenLoopAdapterResult = {
    ok: true,
    externalId: `NEXT-${payload.item.id.replace(/^LOOP-/, '')}`,
    message: `Queued ${payload.classification.kind} for ${payload.classification.route}.`,
    raw: {
      target: payload.target?.label ?? null
    }
  };

  return Response.json(result);
}
