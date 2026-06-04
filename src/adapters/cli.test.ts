import { describe, expect, it } from 'vitest';
import { runCliAdapter } from './cli';
import { createOpenLoopItem, buildOpenLoopPayload } from '../core';

const item = createOpenLoopItem({ text: 'Improve spacing', id: 'LOOP-TEST', now: 0 });
const payload = buildOpenLoopPayload({
  item,
  text: item.text,
  target: null,
  appId: 'test-app'
});

describe('runCliAdapter', () => {
  it('sends JSON on stdin and parses JSON from stdout', async () => {
    const result = await runCliAdapter({
      command: process.execPath,
      args: ['-e', 'let data=""; process.stdin.on("data", c => data += c); process.stdin.on("end", () => { const payload = JSON.parse(data); process.stdout.write(JSON.stringify({ ok: true, externalId: "CLI-" + payload.item.id, message: payload.classification.route })); });']
    }, payload);

    expect(result).toMatchObject({
      ok: true,
      externalId: 'CLI-LOOP-TEST',
      message: 'design'
    });
  });

  it('reports nonzero exits with stderr', async () => {
    const result = await runCliAdapter({
      command: process.execPath,
      args: ['-e', 'console.error("nope"); process.exit(7);']
    }, payload);

    expect(result.ok).toBe(false);
    expect(result.message).toBe('nope');
  });

  it('reports invalid JSON output', async () => {
    const result = await runCliAdapter({
      command: process.execPath,
      args: ['-e', 'process.stdout.write("not json");']
    }, payload);

    expect(result.ok).toBe(false);
    expect(result.message).toContain('invalid JSON');
  });

  it('times out long-running commands', async () => {
    const result = await runCliAdapter({
      command: process.execPath,
      args: ['-e', 'setTimeout(() => {}, 5000);'],
      timeoutMs: 30
    }, payload);

    expect(result.ok).toBe(false);
    expect(result.message).toContain('timed out');
  });
});
