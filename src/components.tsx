import { Check, ChevronRight, MousePointer2, RefreshCw, Send, Sparkles, X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useOpenLoop } from './context';
import type { OpenLoopFeedbackKind, OpenLoopRoute } from './types';

const KIND_LABELS: Record<OpenLoopFeedbackKind, string> = {
  ui_feedback: 'ui feedback',
  bug_report: 'bug report',
  copy_change: 'copy change',
  layout_tweak: 'layout tweak',
  color_tweak: 'color tweak',
  motion_tweak: 'motion tweak',
  design_idea: 'design idea'
};

const ROUTE_LABELS: Record<OpenLoopRoute, string> = {
  design: 'design agent',
  fix: 'fix agent',
  copy: 'copy agent',
  planning: 'planner'
};

export function OpenLoopChrome() {
  return (
    <>
      <OpenLoopPill />
      <OpenLoopPointerOverlay />
      <OpenLoopPanel />
      <OpenLoopToast />
    </>
  );
}

export function OpenLoopPill() {
  const loop = useOpenLoop();
  if (loop.open) return null;
  const draftHint = loop.text.trim();
  return (
    <button
      className="olu-pill"
      type="button"
      data-testid="open-loop-pill"
      data-has-draft={draftHint ? 'true' : undefined}
      onClick={(event) => {
        event.stopPropagation();
        loop.openPanel();
      }}
      onMouseDown={(event) => event.stopPropagation()}
      aria-label={loop.labels.pill}
    >
      <span className="olu-pill-icon"><RefreshCw size={14} /></span>
      <span className="olu-pill-copy">
        <strong>{loop.labels.pill}</strong>
        <small>{draftHint || 'Capture feedback on this screen'}</small>
      </span>
      <kbd>{loop.labels.shortcut}</kbd>
    </button>
  );
}

export function OpenLoopPanel() {
  const loop = useOpenLoop();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!loop.open) return undefined;
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handle = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      window.clearTimeout(handle);
      if (restoreFocusRef.current?.isConnected) restoreFocusRef.current.focus();
      restoreFocusRef.current = null;
    };
  }, [loop.open]);

  if (!loop.open) return null;
  return (
    <>
      <button
        className={`olu-backdrop ${loop.sent ? 'sent' : ''}`}
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={loop.closePanel}
      />
      <section
        ref={panelRef}
        className={`olu-panel ${loop.sent ? 'sent' : ''}`}
        data-testid="open-loop-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === 'Tab') trapDialogFocus(event, panelRef.current);
        }}
      >
        <div className="olu-panel-head">
          <div>
            <h2 id={titleId}>{splitTitle(loop.labels.title)}</h2>
            <span id={descriptionId}>{loop.labels.subtitle}</span>
          </div>
          <button className="olu-icon-button" type="button" onClick={loop.closePanel} aria-label={loop.labels.close}>
            <X size={15} />
          </button>
        </div>

        <div className="olu-anchor-row">
          {loop.target ? (
            <div className="olu-anchor pinned">
              <span>anchored to <em>{loop.target.label}</em></span>
              <button type="button" onClick={loop.clearTarget} aria-label={loop.labels.clearAnchor}>
                <X size={11} />
              </button>
            </div>
          ) : (
            <button
              className={`olu-anchor ${loop.pointing ? 'active' : ''}`}
              type="button"
              aria-pressed={loop.pointing}
              onClick={loop.startTargeting}
            >
              <MousePointer2 size={13} />
              {loop.pointing ? loop.labels.pointing : loop.labels.pointAtElement}
            </button>
          )}
        </div>

        <textarea
          ref={inputRef}
          className="olu-textarea"
          data-testid="open-loop-input"
          placeholder={loop.labels.textareaPlaceholder}
          value={loop.text}
          rows={4}
          onChange={(event) => loop.setText(event.target.value)}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
              event.preventDefault();
              void loop.submit();
            }
          }}
        />

        <div className="olu-preview" data-empty={loop.text.trim().length === 0}>
          <div className="olu-preview-label">{loop.labels.previewLabel}</div>
          <div className="olu-preview-card">
            <div className="olu-preview-row">
              <span className="olu-chip src"><Sparkles size={10} /> open-loop</span>
              <span className="olu-chip kind">{KIND_LABELS[loop.classification.kind]}</span>
              <span className={`olu-dot ${loop.classification.depth}`} title={loop.classification.depth} />
            </div>
            <p>{loop.text.trim() || <span>{loop.labels.previewEmpty}</span>}</p>
            <div className="olu-preview-row wrap">
              <span className="olu-chip project">{loop.labels.localPreview}</span>
              <ChevronRight className="olu-arrow" size={12} />
              <span className="olu-chip route">{ROUTE_LABELS[loop.classification.route]}</span>
              {loop.target && <span className="olu-chip anchor">@ {loop.target.label}</span>}
            </div>
          </div>
        </div>

        <div className="olu-panel-foot">
          <span>{loop.labels.submitHint}</span>
          <button
            className={loop.canSubmit ? 'ready' : ''}
            data-testid="open-loop-submit"
            type="button"
            disabled={!loop.canSubmit}
            onClick={() => void loop.submit()}
          >
            <Send size={13} />
            {loop.sending ? loop.labels.sending : loop.sent ? loop.labels.sent : loop.labels.send}
          </button>
        </div>
        {loop.sending && <div className="olu-progress" />}
      </section>
    </>
  );
}

export function OpenLoopPointerOverlay() {
  const loop = useOpenLoop();
  if (!loop.pointing) return null;
  return (
    <div className="olu-pointer" data-testid="open-loop-pointer" aria-hidden="true">
      <div className="olu-pointer-hint">
        <MousePointer2 size={12} />
        click any element - esc to cancel
      </div>
      {loop.hover && (
        <div
          className="olu-pointer-rect"
          style={{
            left: loop.hover.rect.x,
            top: loop.hover.rect.y,
            width: loop.hover.rect.width,
            height: loop.hover.rect.height
          }}
        >
          <span>{loop.hover.target.label}</span>
        </div>
      )}
    </div>
  );
}

export function OpenLoopToast() {
  const loop = useOpenLoop();
  if (!loop.toast) return null;
  const failed = loop.toast.status === 'failed';
  return (
    <div className={`olu-toast ${failed ? 'failed' : ''}`} data-testid="open-loop-toast" role="status">
      <span className="olu-toast-icon">{failed ? '!' : <Check size={12} />}</span>
      <p>
        {failed ? loop.labels.adapterError : loop.labels.toastPrefix}{' '}
        <strong>{loop.toast.id}</strong>
        {' '}<em>{ROUTE_LABELS[loop.toast.route]}</em>
      </p>
      {loop.toast.adapterResult?.externalId && <code>{loop.toast.adapterResult.externalId}</code>}
    </div>
  );
}

function splitTitle(title: string) {
  const [first, ...rest] = title.split(/\s+/);
  if (rest.length === 0) return title;
  return <>{first} <em>{rest.join(' ')}</em></>;
}

function trapDialogFocus(event: ReactKeyboardEvent, panel: HTMLElement | null) {
  if (!panel) return;
  const focusable = getFocusableElements(panel);
  if (focusable.length === 0) {
    event.preventDefault();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
    return;
  }
  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function getFocusableElements(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>([
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(','))).filter((element) => !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true');
}
