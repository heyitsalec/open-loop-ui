import type { OpenLoopAdapter, OpenLoopAdapterResult } from '../types';

export type MockAdapterOptions = {
  delayMs?: number;
  fail?: boolean;
  externalIdPrefix?: string;
  message?: string;
};

export function createMockAdapter(options: MockAdapterOptions = {}): OpenLoopAdapter {
  const delayMs = options.delayMs ?? 180;
  const externalIdPrefix = options.externalIdPrefix ?? 'MOCK';
  return async (payload) => {
    if (delayMs > 0) await new Promise((resolve) => globalThis.setTimeout(resolve, delayMs));
    if (options.fail) {
      return {
        ok: false,
        message: options.message ?? 'Mock adapter was configured to fail.'
      };
    }
    return {
      ok: true,
      externalId: `${externalIdPrefix}-${payload.item.id.replace(/^LOOP-/, '')}`,
      message: options.message ?? `Queued ${payload.item.kind} for ${payload.classification.route}.`,
      raw: {
        received: payload.item.id,
        target: payload.target?.label ?? null
      }
    } satisfies OpenLoopAdapterResult;
  };
}

export const mockOpenLoopAdapter = createMockAdapter({ delayMs: 0 });
