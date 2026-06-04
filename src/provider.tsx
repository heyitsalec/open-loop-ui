import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OpenLoopChrome } from './components';
import { OpenLoopContext } from './context';
import {
  buildOpenLoopPayload,
  classifyOpenLoopFeedback,
  createOpenLoopItem,
  describeOpenLoopTarget,
  getOpenLoopTargetElement,
  isOpenLoopControlElement
} from './core';
import type {
  OpenLoopAdapter,
  OpenLoopAdapterPayload,
  OpenLoopContextValue,
  OpenLoopHoverTarget,
  OpenLoopItem,
  OpenLoopLabels,
  OpenLoopProviderProps,
  OpenLoopTarget
} from './types';

const DEFAULT_LABELS: OpenLoopLabels = {
  pill: 'Improve UI',
  shortcut: 'mod .',
  title: 'design loop',
  subtitle: 'turn feedback into a handoff',
  pointAtElement: 'point at an element',
  pointing: 'click an element...',
  textareaPlaceholder: 'describe the change. concrete is better than vague.',
  previewLabel: 'this will land as',
  previewEmpty: 'your description will appear here',
  localPreview: 'local preview',
  send: 'send to agent',
  sending: 'sending...',
  sent: 'sent',
  submitHint: 'mod enter to send - esc closes',
  close: 'Close design loop',
  clearAnchor: 'Clear anchor',
  toastPrefix: 'queued as',
  adapterError: 'adapter returned an error'
};

const DEFAULT_ADAPTER: OpenLoopAdapter = (payload) => ({
  ok: true,
  externalId: `LOCAL-${payload.item.id.replace(/^LOOP-/, '')}`,
  message: `Captured ${payload.item.kind} for ${payload.classification.route}.`
});

export function OpenLoopProvider({
  children,
  adapter,
  appId = 'open-loop-app',
  appName,
  appUrl,
  appMetadata,
  shortcut = 'mod+.',
  labels,
  maxItems = 24,
  defaultOpen = false,
  renderChrome = true,
  className,
  onItem
}: OpenLoopProviderProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [pointing, setPointing] = useState(false);
  const [text, setText] = useState('');
  const [target, setTarget] = useState<OpenLoopTarget | null>(null);
  const [hover, setHover] = useState<OpenLoopHoverTarget | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState<OpenLoopItem | null>(null);
  const [items, setItems] = useState<OpenLoopItem[]>([]);
  const [lastPayload, setLastPayload] = useState<OpenLoopAdapterPayload | null>(null);
  const resolvedAdapter = adapter ?? DEFAULT_ADAPTER;
  const resolvedLabels = useMemo<OpenLoopLabels>(() => ({ ...DEFAULT_LABELS, ...labels }), [labels]);
  const classification = useMemo(() => classifyOpenLoopFeedback(text), [text]);
  const canSubmit = text.trim().length > 4 && !sending;
  const closeTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const submittingRef = useRef(false);
  const submissionIdRef = useRef(0);
  const mountedRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    closeTimerRef.current = null;
    toastTimerRef.current = null;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimers();
    };
  }, [clearTimers]);

  const closePanel = useCallback(() => {
    if (submittingRef.current) {
      submissionIdRef.current += 1;
      submittingRef.current = false;
    }
    setOpen(false);
    setPointing(false);
    setSending(false);
    setSent(false);
    setText('');
    setTarget(null);
    setHover(null);
  }, []);

  const openPanel = useCallback(() => {
    setOpen(true);
    setSent(false);
  }, []);

  const toggleTargeting = useCallback(() => {
    setHover(null);
    setPointing((value) => !value);
  }, []);

  const stopTargeting = useCallback(() => {
    setHover(null);
    setPointing(false);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!matchesShortcut(event, shortcut)) return;
      event.preventDefault();
      setOpen((value) => !value);
      setPointing(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shortcut]);

  useEffect(() => {
    if (!open || pointing) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      closePanel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closePanel, open, pointing]);

  useEffect(() => {
    if (!pointing) return undefined;

    let last: Element | null = null;
    const updateHover = (event: MouseEvent) => {
      const element = getOpenLoopTargetElement(event.clientX, event.clientY);
      if (!element) {
        setHover(null);
        return;
      }
      if (element === last) return;
      last = element;
      const described = describeOpenLoopTarget(element);
      setHover(described.rect ? { target: described, rect: described.rect } : null);
    };
    const chooseTarget = (event: MouseEvent) => {
      if (isOpenLoopControlElement(event.target)) return;
      const element = getOpenLoopTargetElement(event.clientX, event.clientY);
      if (!element) return;
      event.preventDefault();
      event.stopPropagation();
      setTarget(describeOpenLoopTarget(element));
      stopTargeting();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') stopTargeting();
    };
    document.addEventListener('mousemove', updateHover);
    document.addEventListener('click', chooseTarget, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousemove', updateHover);
      document.removeEventListener('click', chooseTarget, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [pointing, stopTargeting]);

  const previewPayload = useMemo<OpenLoopAdapterPayload | null>(() => {
    if (!text.trim()) return null;
    const item = createOpenLoopItem({ text, target, id: 'LOOP-PREVIEW', now: 0 }, []);
    return buildOpenLoopPayload({ item, text: text.trim(), target, appId, appName, appUrl, appMetadata });
  }, [appId, appMetadata, appName, appUrl, target, text]);

  const submit = useCallback(async () => {
    if (!canSubmit || submittingRef.current) return;
    submittingRef.current = true;
    const submissionId = submissionIdRef.current + 1;
    submissionIdRef.current = submissionId;
    const created = createOpenLoopItem({ text, target }, items.map((item) => item.id));
    const payload = buildOpenLoopPayload({
      item: created,
      text: text.trim(),
      target,
      appId,
      appName,
      appUrl,
      appMetadata
    });

    setSending(true);
    setSent(false);
    clearTimers();
    setLastPayload(payload);
    setItems((current) => [created, ...current.filter((item) => item.id !== created.id)].slice(0, maxItems));

    const result = await Promise.resolve(resolvedAdapter(payload)).catch((error: unknown) => ({
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    }));
    if (!mountedRef.current || submissionId !== submissionIdRef.current) return;
    const finalItem: OpenLoopItem = {
      ...created,
      status: result.ok ? 'submitted' : 'failed',
      adapterResult: result
    };
    setItems((current) => [finalItem, ...current.filter((item) => item.id !== finalItem.id)].slice(0, maxItems));
    setToast(finalItem);
    setSending(false);
    submittingRef.current = false;
    setSent(true);
    onItem?.(finalItem, payload, result);
    closeTimerRef.current = window.setTimeout(() => closePanel(), 560);
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 4_400);
  }, [appId, appMetadata, appName, appUrl, canSubmit, clearTimers, closePanel, items, maxItems, onItem, resolvedAdapter, target, text]);

  const value = useMemo<OpenLoopContextValue>(() => ({
    open,
    pointing,
    sending,
    sent,
    text,
    target,
    hover,
    toast,
    items,
    classification,
    labels: resolvedLabels,
    canSubmit,
    lastPayload,
    previewPayload,
    openPanel,
    closePanel,
    startTargeting: toggleTargeting,
    stopTargeting,
    clearTarget: () => setTarget(null),
    setText,
    submit
  }), [
    canSubmit,
    classification,
    closePanel,
    hover,
    items,
    lastPayload,
    open,
    openPanel,
    pointing,
    previewPayload,
    resolvedLabels,
    sending,
    sent,
    stopTargeting,
    submit,
    target,
    text,
    toggleTargeting,
    toast
  ]);

  return (
    <OpenLoopContext.Provider value={value}>
      {children}
      {renderChrome && (
        <div className={['olu-theme', className].filter(Boolean).join(' ')} data-open-loop-root>
          <OpenLoopChrome />
        </div>
      )}
    </OpenLoopContext.Provider>
  );
}

function matchesShortcut(event: KeyboardEvent, shortcut: string): boolean {
  const normalized = shortcut.toLowerCase().replace(/\s+/g, '');
  if (normalized === 'mod+.') return (event.metaKey || event.ctrlKey) && event.key === '.';
  if (normalized === 'ctrl+.') return event.ctrlKey && event.key === '.';
  if (normalized === 'meta+.') return event.metaKey && event.key === '.';
  return false;
}
