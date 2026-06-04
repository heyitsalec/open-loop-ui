import type { ReactNode } from 'react';

export type OpenLoopFeedbackKind =
  | 'ui_feedback'
  | 'bug_report'
  | 'copy_change'
  | 'layout_tweak'
  | 'color_tweak'
  | 'motion_tweak'
  | 'design_idea';

export type OpenLoopRoute = 'design' | 'fix' | 'copy' | 'planning';
export type OpenLoopDepth = 'loud' | 'medium' | 'quiet';
export type OpenLoopStatus = 'local-preview' | 'submitted' | 'failed';

export type OpenLoopClassification = {
  kind: OpenLoopFeedbackKind;
  route: OpenLoopRoute;
  depth: OpenLoopDepth;
};

export type OpenLoopRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type OpenLoopTarget = {
  label: string;
  selector: string | null;
  nodeId?: string | null;
  tagName?: string;
  rect?: OpenLoopRect;
};

export type OpenLoopAdapterResult = {
  ok: boolean;
  externalId?: string;
  url?: string;
  message?: string;
  raw?: unknown;
};

export type OpenLoopItem = OpenLoopClassification & {
  id: string;
  title: string;
  text: string;
  target: string;
  targetSelector: string | null;
  targetNodeId?: string | null;
  createdAt: string;
  status: OpenLoopStatus;
  adapterResult?: OpenLoopAdapterResult | null;
};

export type OpenLoopAdapterPayload = {
  item: OpenLoopItem;
  text: string;
  target: OpenLoopTarget | null;
  classification: OpenLoopClassification;
  app: {
    id: string;
    name?: string;
    url?: string;
    metadata?: Record<string, unknown>;
  };
};

export type OpenLoopAdapter = (payload: OpenLoopAdapterPayload) => Promise<OpenLoopAdapterResult> | OpenLoopAdapterResult;

export type OpenLoopLabels = {
  pill: string;
  shortcut: string;
  title: string;
  subtitle: string;
  pointAtElement: string;
  pointing: string;
  textareaPlaceholder: string;
  previewLabel: string;
  previewEmpty: string;
  localPreview: string;
  send: string;
  sending: string;
  sent: string;
  submitHint: string;
  close: string;
  clearAnchor: string;
  toastPrefix: string;
  adapterError: string;
};

export type OpenLoopProviderProps = {
  children: ReactNode;
  adapter?: OpenLoopAdapter;
  appId?: string;
  appName?: string;
  appUrl?: string;
  appMetadata?: Record<string, unknown>;
  shortcut?: string;
  labels?: Partial<OpenLoopLabels>;
  maxItems?: number;
  defaultOpen?: boolean;
  renderChrome?: boolean;
  className?: string;
  onItem?: (item: OpenLoopItem, payload: OpenLoopAdapterPayload, result: OpenLoopAdapterResult) => void;
};

export type CliAdapterOptions = {
  command: string;
  args?: string[];
  cwd?: string;
  env?: Record<string, string>;
  timeoutMs?: number;
  shell?: boolean;
};

export type OpenLoopHoverTarget = {
  target: OpenLoopTarget;
  rect: OpenLoopRect;
};

export type OpenLoopContextValue = {
  open: boolean;
  pointing: boolean;
  sending: boolean;
  sent: boolean;
  text: string;
  target: OpenLoopTarget | null;
  hover: OpenLoopHoverTarget | null;
  toast: OpenLoopItem | null;
  items: OpenLoopItem[];
  classification: OpenLoopClassification;
  labels: OpenLoopLabels;
  canSubmit: boolean;
  lastPayload: OpenLoopAdapterPayload | null;
  previewPayload: OpenLoopAdapterPayload | null;
  openPanel: () => void;
  closePanel: () => void;
  startTargeting: () => void;
  stopTargeting: () => void;
  clearTarget: () => void;
  setText: (text: string) => void;
  submit: () => Promise<void>;
};
