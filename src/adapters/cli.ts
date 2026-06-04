import { spawn } from 'node:child_process';
import type { CliAdapterOptions, OpenLoopAdapter, OpenLoopAdapterPayload, OpenLoopAdapterResult } from '../types';

export function createCliAdapter(options: CliAdapterOptions): OpenLoopAdapter {
  return (payload) => runCliAdapter(options, payload);
}

export async function runCliAdapter(
  options: CliAdapterOptions,
  payload: OpenLoopAdapterPayload
): Promise<OpenLoopAdapterResult> {
  const timeoutMs = options.timeoutMs ?? 15_000;

  return new Promise((resolve) => {
    const child = spawn(options.command, options.args ?? [], {
      cwd: options.cwd,
      env: { ...process.env, ...options.env },
      shell: options.shell ?? false,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let settled = false;
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill('SIGTERM');
      resolve({
        ok: false,
        message: `CLI adapter timed out after ${timeoutMs}ms.`,
        raw: { stdout, stderr }
      });
    }, timeoutMs);

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    child.on('error', (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({
        ok: false,
        message: error.message,
        raw: { stdout, stderr }
      });
    });

    child.on('close', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      const trimmed = stdout.trim();
      if (code !== 0) {
        resolve({
          ok: false,
          message: stderr.trim() || `CLI adapter exited with code ${code}.`,
          raw: { code, stdout, stderr }
        });
        return;
      }
      if (!trimmed) {
        resolve({
          ok: true,
          message: stderr.trim() || 'CLI adapter completed without output.',
          raw: { stdout, stderr }
        });
        return;
      }
      try {
        const parsed = JSON.parse(trimmed) as Partial<OpenLoopAdapterResult>;
        resolve({
          ok: parsed.ok ?? true,
          externalId: parsed.externalId,
          url: parsed.url,
          message: parsed.message,
          raw: parsed.raw ?? { stdout, stderr }
        });
      } catch (error) {
        resolve({
          ok: false,
          message: `CLI adapter returned invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
          raw: { stdout, stderr }
        });
      }
    });

    child.stdin.end(`${JSON.stringify(payload)}\n`);
  });
}
