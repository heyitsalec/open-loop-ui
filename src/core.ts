import type {
  OpenLoopAdapterPayload,
  OpenLoopClassification,
  OpenLoopItem,
  OpenLoopRect,
  OpenLoopTarget
} from './types';

const BUG_PATTERN = /\b(bug|broken|crash|error|wrong|breaks?|regression|stuck|failing)\b/;
const COPY_PATTERN = /\b(copy|wording|word|label|text|microcopy|tone|headline)\b/;
const LAYOUT_PATTERN = /\b(spacing|padding|margin|gap|layout|align|density|overlap|wrap|grid)\b/;
const COLOR_PATTERN = /\b(color|tint|shade|hue|palette|contrast|dark|light|brand)\b/;
const MOTION_PATTERN = /\b(animation|motion|transition|ease|tween|hover|microinteraction)\b/;
const IDEA_PATTERN = /\b(idea|maybe|consider|what if|could we|someday|experiment)\b/;
const LOUD_PATTERN = /\b(urgent|asap|blocking|today|now|ship)\b/;
const QUIET_PATTERN = /\b(later|someday|nice to have|whenever|parking lot)\b/;

const OPEN_LOOP_CHROME_SELECTOR = [
  '.olu-pill',
  '.olu-panel',
  '.olu-backdrop',
  '.olu-pointer',
  '.olu-toast',
  '[data-open-loop-ignore="true"]'
].join(',');

const OPEN_LOOP_CONTROL_SELECTOR = [
  '.olu-pill',
  '.olu-panel',
  '.olu-toast',
  '[data-open-loop-ignore="true"]'
].join(',');

export function classifyOpenLoopFeedback(text: string): OpenLoopClassification {
  const normalized = text.toLowerCase();
  let kind: OpenLoopClassification['kind'] = 'ui_feedback';
  let route: OpenLoopClassification['route'] = 'design';
  let depth: OpenLoopClassification['depth'] = 'medium';

  if (BUG_PATTERN.test(normalized)) {
    kind = 'bug_report';
    route = 'fix';
    depth = 'loud';
  } else if (COPY_PATTERN.test(normalized)) {
    kind = 'copy_change';
    route = 'copy';
  } else if (LAYOUT_PATTERN.test(normalized)) {
    kind = 'layout_tweak';
    route = 'design';
  } else if (COLOR_PATTERN.test(normalized)) {
    kind = 'color_tweak';
    route = 'design';
  } else if (MOTION_PATTERN.test(normalized)) {
    kind = 'motion_tweak';
    route = 'design';
  } else if (IDEA_PATTERN.test(normalized)) {
    kind = 'design_idea';
    route = 'planning';
    depth = 'quiet';
  }

  if (LOUD_PATTERN.test(normalized)) depth = 'loud';
  if (QUIET_PATTERN.test(normalized)) depth = 'quiet';
  return { kind, route, depth };
}

export function createOpenLoopItem(
  input: {
    text: string;
    target?: OpenLoopTarget | null;
    now?: number;
    id?: string;
    status?: OpenLoopItem['status'];
  },
  existingIds: string[] = []
): OpenLoopItem {
  const text = input.text.trim();
  const now = input.now ?? Date.now();
  const createdAt = new Date(now).toISOString();
  const taken = new Set(existingIds);
  const baseId = input.id ?? `LOOP-${now.toString(36).slice(-5).toUpperCase()}`;
  let id = baseId;
  let suffix = 2;
  while (taken.has(id)) id = `${baseId}-${suffix++}`;

  return {
    id,
    title: previewText(text, 420) || 'Improve UI',
    text,
    target: input.target?.label ?? 'current screen',
    targetSelector: input.target?.selector ?? null,
    targetNodeId: input.target?.nodeId ?? null,
    createdAt,
    status: input.status ?? 'local-preview',
    adapterResult: null,
    ...classifyOpenLoopFeedback(text)
  };
}

export function buildOpenLoopPayload(input: {
  item: OpenLoopItem;
  text: string;
  target: OpenLoopTarget | null;
  appId: string;
  appName?: string;
  appUrl?: string;
  appMetadata?: Record<string, unknown>;
}): OpenLoopAdapterPayload {
  return {
    item: input.item,
    text: input.text,
    target: input.target,
    classification: {
      kind: input.item.kind,
      route: input.item.route,
      depth: input.item.depth
    },
    app: {
      id: input.appId,
      name: input.appName,
      url: input.appUrl,
      metadata: input.appMetadata
    }
  };
}

export function getOpenLoopTargetElement(x: number, y: number, doc: Document = document): Element | null {
  for (const element of doc.elementsFromPoint(x, y)) {
    if (isOpenLoopChromeElement(element)) continue;
    return element;
  }
  return null;
}

export function describeOpenLoopTarget(element: Element): OpenLoopTarget {
  const labelled = element.closest<HTMLElement>('[data-open-loop-label]');
  const nodeElement = element.closest<HTMLElement>('[data-open-loop-node-id]');
  const nodeId = nodeElement?.dataset.openLoopNodeId ?? null;
  const source = labelled ?? nodeElement ?? (element instanceof HTMLElement ? element : null);
  const rect = source?.getBoundingClientRect() ?? element.getBoundingClientRect();

  if (labelled?.dataset.openLoopLabel) {
    return {
      label: labelled.dataset.openLoopLabel,
      selector: selectorForElement(labelled),
      nodeId,
      tagName: labelled.tagName.toLowerCase(),
      rect: rectToPlain(rect)
    };
  }

  if (nodeId) {
    return {
      label: `node ${nodeId}`,
      selector: nodeElement ? selectorForElement(nodeElement) : null,
      nodeId,
      tagName: nodeElement?.tagName.toLowerCase(),
      rect: rectToPlain(rect)
    };
  }

  const className = source?.className;
  const meaningful = typeof className === 'string'
    ? className.split(/\s+/).find((name) => /^(demo-|app-|panel-|card-|toolbar-|nav-)/.test(name))
    : undefined;

  return {
    label: meaningful ? meaningful.replace(/-/g, ' ') : element.tagName.toLowerCase(),
    selector: source ? selectorForElement(source) : null,
    tagName: element.tagName.toLowerCase(),
    rect: rectToPlain(rect)
  };
}

export function isOpenLoopChromeElement(value: EventTarget | Element | null): boolean {
  return value instanceof Element && Boolean(value.closest(OPEN_LOOP_CHROME_SELECTOR));
}

export function isOpenLoopControlElement(value: EventTarget | Element | null): boolean {
  return value instanceof Element && Boolean(value.closest(OPEN_LOOP_CONTROL_SELECTOR));
}

export function previewText(text: string, length: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= length) return trimmed;
  return `${trimmed.slice(0, Math.max(0, length - 1))}…`;
}

function rectToPlain(rect: DOMRect): OpenLoopRect {
  return {
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.round(rect.width),
    height: Math.round(rect.height)
  };
}

function selectorForElement(element: HTMLElement): string | null {
  if (element.dataset.openLoopId) return `[data-open-loop-id="${escapeAttribute(element.dataset.openLoopId)}"]`;
  if (element.id) return `#${safeCssEscape(element.id)}`;
  if (element.dataset.openLoopLabel) return `[data-open-loop-label="${escapeAttribute(element.dataset.openLoopLabel)}"]`;
  const className = typeof element.className === 'string'
    ? element.className.split(/\s+/).filter(Boolean).slice(0, 2)
    : [];
  if (className.length > 0) return `${element.tagName.toLowerCase()}.${className.map(safeCssEscape).join('.')}`;
  return element.tagName.toLowerCase();
}

function safeCssEscape(value: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') return CSS.escape(value);
  return value.replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`);
}

function escapeAttribute(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
