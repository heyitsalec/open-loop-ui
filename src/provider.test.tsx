import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OpenLoopProvider } from './provider';
import type { OpenLoopAdapter } from './types';

function renderLoop(adapter?: OpenLoopAdapter, onCanvasClick = vi.fn()) {
  render(
    <div onClick={onCanvasClick}>
      <OpenLoopProvider adapter={adapter ?? (async () => ({ ok: true, externalId: 'TEST-1' }))}>
        <button type="button" data-open-loop-label="Chart region">Chart region</button>
      </OpenLoopProvider>
    </div>
  );
  return { onCanvasClick };
}

describe('OpenLoopProvider', () => {
  it('opens the panel from the pill and updates the preview from the draft', () => {
    renderLoop();
    fireEvent.click(screen.getByTestId('open-loop-pill'));
    expect(screen.getByTestId('open-loop-panel')).toBeVisible();
    expect(screen.getByTestId('open-loop-panel')).toHaveAttribute('aria-modal', 'true');

    fireEvent.change(screen.getByTestId('open-loop-input'), {
      target: { value: 'Spacing around the chart feels crowded' }
    });

    expect(screen.getByText('layout tweak')).toBeVisible();
    expect(screen.getAllByText('Spacing around the chart feels crowded')).toHaveLength(2);
  });

  it('does not wrap host app children in Open Loop layout chrome', () => {
    const { container } = render(
      <OpenLoopProvider renderChrome={false}>
        <button type="button" data-testid="host-button">Host button</button>
      </OpenLoopProvider>
    );

    expect(container.firstElementChild).toBe(screen.getByTestId('host-button'));
    expect(screen.getByTestId('host-button').closest('[data-open-loop-root]')).toBeNull();
  });

  it('submits through the adapter and shows a toast', async () => {
    const adapter = vi.fn(async () => ({ ok: true, externalId: 'AGENT-1', message: 'queued' }));
    renderLoop(adapter);
    fireEvent.click(screen.getByTestId('open-loop-pill'));
    fireEvent.change(screen.getByTestId('open-loop-input'), {
      target: { value: 'Fix the broken hover state now' }
    });
    fireEvent.click(screen.getByTestId('open-loop-submit'));

    await waitFor(() => expect(adapter).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByTestId('open-loop-toast')).toBeVisible());
    expect(screen.getByText('AGENT-1')).toBeVisible();
  });

  it('uses Escape to leave targeting and close the panel', () => {
    renderLoop();
    fireEvent.click(screen.getByTestId('open-loop-pill'));
    fireEvent.click(screen.getByRole('button', { name: /point at an element/i }));
    expect(screen.getByTestId('open-loop-pointer')).toBeVisible();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('open-loop-pointer')).not.toBeInTheDocument();

    fireEvent.keyDown(screen.getByTestId('open-loop-input'), { key: 'Escape' });
    expect(screen.queryByTestId('open-loop-panel')).not.toBeInTheDocument();
  });

  it('closes the panel from Escape even when focus leaves the textarea', () => {
    renderLoop();
    fireEvent.click(screen.getByTestId('open-loop-pill'));
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.queryByTestId('open-loop-panel')).not.toBeInTheDocument();
  });

  it('keeps Tab and Shift+Tab focus inside the panel', () => {
    renderLoop();
    fireEvent.click(screen.getByTestId('open-loop-pill'));
    fireEvent.change(screen.getByTestId('open-loop-input'), {
      target: { value: 'Fix the broken hover state now' }
    });

    const panel = screen.getByTestId('open-loop-panel');
    const closeButton = screen.getByRole('button', { name: /close design loop/i });
    const submitButton = screen.getByTestId('open-loop-submit');

    closeButton.focus();
    fireEvent.keyDown(panel, { key: 'Tab', shiftKey: true });
    expect(submitButton).toHaveFocus();

    fireEvent.keyDown(panel, { key: 'Tab' });
    expect(closeButton).toHaveFocus();
  });

  it('does not bubble widget clicks into the host canvas', () => {
    const { onCanvasClick } = renderLoop();
    fireEvent.click(screen.getByTestId('open-loop-pill'));
    fireEvent.click(screen.getByTestId('open-loop-panel'));
    fireEvent.mouseDown(screen.getByTestId('open-loop-panel'));

    expect(onCanvasClick).not.toHaveBeenCalled();
  });

  it('ignores stale adapter results after the panel is closed mid-submit', async () => {
    let resolveAdapter: (value: { ok: boolean; externalId: string }) => void = () => undefined;
    const adapter = vi.fn(() => new Promise<{ ok: boolean; externalId: string }>((resolve) => {
      resolveAdapter = resolve;
    }));
    renderLoop(adapter);
    fireEvent.click(screen.getByTestId('open-loop-pill'));
    fireEvent.change(screen.getByTestId('open-loop-input'), {
      target: { value: 'Fix the broken hover state now' }
    });
    fireEvent.click(screen.getByTestId('open-loop-submit'));
    expect(adapter).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(screen.getByTestId('open-loop-input'), { key: 'Escape' });
    await act(async () => {
      resolveAdapter({ ok: true, externalId: 'STALE-1' });
      await Promise.resolve();
    });

    expect(screen.queryByText('STALE-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('open-loop-toast')).not.toBeInTheDocument();
  });
});
