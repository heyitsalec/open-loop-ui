import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  BellRing,
  CheckCircle2,
  Compass,
  FileText,
  GitBranch,
  GitPullRequest,
  Image as ImageIcon,
  Layers3,
  LayoutDashboard,
  MessageSquareText,
  MonitorDot,
  MousePointer2,
  Palette,
  PanelRight,
  Phone,
  RadioTower,
  Send,
  Sparkles,
  ThumbsUp,
  Wand2
} from 'lucide-react';
import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useOpenLoop } from '../context';

const sceneIds = ['dashboard', 'portfolio', 'operator', 'mobile'] as const;
type DemoSceneId = (typeof sceneIds)[number];
type ProofMode = 'off' | 'message' | 'pr';

type SceneConfig = {
  id: DemoSceneId;
  label: string;
  shortLabel: string;
  title: string;
  subtitle: string;
  hostLabel: string;
  accent: 'green' | 'blue' | 'coral' | 'gold';
  component: () => ReactElement;
};

const routes = [
  { label: 'layout', value: 'design', tone: 'green' },
  { label: 'copy', value: 'copy', tone: 'blue' },
  { label: 'bug', value: 'fix', tone: 'coral' },
  { label: 'idea', value: 'planner', tone: 'gold' }
];

const scenes: Record<DemoSceneId, SceneConfig> = {
  dashboard: {
    id: 'dashboard',
    label: 'Product dashboard',
    shortLabel: 'Product',
    title: 'Feedback lands exactly where the UI work happens.',
    subtitle: 'A SaaS-style dashboard with labeled regions and JSON handoff.',
    hostLabel: 'Product dashboard surface',
    accent: 'green',
    component: ProductDashboardScene
  },
  portfolio: {
    id: 'portfolio',
    label: 'Portfolio site',
    shortLabel: 'Portfolio',
    title: 'A tiny loop for the pages people actually judge.',
    subtitle: 'Drop it into a personal site, case study, or polished project page.',
    hostLabel: 'Portfolio project surface',
    accent: 'blue',
    component: PortfolioScene
  },
  operator: {
    id: 'operator',
    label: 'Operator console',
    shortLabel: 'Console',
    title: 'Dense tools get clearer when feedback has an anchor.',
    subtitle: 'Point at a panel, graph, row, or command and keep the next step precise.',
    hostLabel: 'Operator console surface',
    accent: 'coral',
    component: OperatorScene
  },
  mobile: {
    id: 'mobile',
    label: 'Mobile shell',
    shortLabel: 'Mobile',
    title: 'Mobile-sized flows can still hand off useful context.',
    subtitle: 'Same provider, same adapter shape, smaller host application.',
    hostLabel: 'Mobile app preview surface',
    accent: 'gold',
    component: MobileScene
  }
};

export function DemoApp() {
  const [sceneId, setSceneId] = useState<DemoSceneId>(() => initialScene());
  const scene = scenes[sceneId];
  const captureMode = getCaptureMode();
  const proofMode = getProofMode();
  const Scene = scene.component;

  return (
    <main
      className={`demo-shell scene-${scene.id}`}
      data-capture-mode={captureMode}
      data-demo-scene={scene.id}
      data-proof-mode={proofMode}
    >
      <section className="demo-workbench" aria-label="Open Loop UI demo workbench">
        <DemoTopbar scene={scene} onSceneChange={setSceneId} />
        <div className="demo-grid">
          <section
            className="demo-host"
            data-testid="demo-scene"
            data-open-loop-label={scene.hostLabel}
            data-open-loop-id={`${scene.id}-host`}
          >
            <SceneHero scene={scene} />
            <Scene />
          </section>
          {proofMode === 'off' ? <AdapterPanel scene={scene} /> : <ProofFlowPanel mode={proofMode} scene={scene} />}
        </div>
      </section>
    </main>
  );
}

function DemoTopbar({ scene, onSceneChange }: { scene: SceneConfig; onSceneChange: (scene: DemoSceneId) => void }) {
  return (
    <header className="demo-topbar" data-open-loop-label="Demo top bar" data-open-loop-id="demo-topbar">
      <div className="demo-brand">
        <span className="demo-brand-mark"><Sparkles size={15} /></span>
        <div>
          <strong>Open Loop UI</strong>
          <small>floating design feedback for React apps</small>
        </div>
      </div>
      <nav className="demo-tabs" aria-label="Sanitized demo scenes" data-open-loop-label="Demo scene switcher">
        {sceneIds.map((id) => (
          <button
            key={id}
            type="button"
            className={scene.id === id ? 'active' : undefined}
            onClick={() => onSceneChange(id)}
          >
            {scenes[id].shortLabel}
          </button>
        ))}
      </nav>
      <div className="demo-top-actions" data-open-loop-label="Demo toolbar actions">
        <span><MonitorDot size={14} /> local</span>
        <button type="button">Export JSON</button>
      </div>
    </header>
  );
}

function SceneHero({ scene }: { scene: SceneConfig }) {
  return (
    <header className="demo-scene-hero" data-open-loop-label={`${scene.label} headline`}>
      <div>
        <span className={`demo-kicker ${scene.accent}`}>{scene.label}</span>
        <h1>{scene.title}</h1>
        <p>{scene.subtitle}</p>
      </div>
      <div className={`demo-score ${scene.accent}`} data-open-loop-label={`${scene.label} proof badge`}>
        <strong>{scene.id === 'mobile' ? '4x' : scene.id === 'operator' ? '12' : scene.id === 'portfolio' ? '8' : '94'}</strong>
        <span>{scene.id === 'mobile' ? 'app styles' : scene.id === 'operator' ? 'targets' : scene.id === 'portfolio' ? 'sections' : 'polish score'}</span>
      </div>
    </header>
  );
}

function ProductDashboardScene() {
  return (
    <>
      <div className="demo-metrics" data-open-loop-label="Metric strip">
        <Metric icon={<Activity size={16} />} label="signals" value="128" trend="+18%" />
        <Metric icon={<GitBranch size={16} />} label="handoffs" value="34" trend="+9%" />
        <Metric icon={<CheckCircle2 size={16} />} label="accepted" value="22" trend="steady" />
      </div>

      <div className="demo-canvas-main">
        <section className="demo-chart" data-open-loop-label="Revenue canvas chart" data-open-loop-id="dashboard-chart" data-open-loop-node-id="chart.revenue">
          <SectionHead title="Revenue canvas" meta="mock dashboard region" icon={<ArrowUpRight size={16} />} />
          <div className="demo-bars" aria-label="Demo bar chart">
            {[42, 68, 54, 82, 64, 92, 76, 88].map((height, index) => (
              <span key={index} style={{ '--bar-height': `${height}%` } as CSSProperties} />
            ))}
          </div>
        </section>

        <section className="demo-routes" data-open-loop-label="Routing preview cards">
          <SectionHead title="Live route preview" meta="heuristic first, adapter second" icon={<Layers3 size={16} />} />
          <RouteList />
        </section>
      </div>

      <FeedbackLane>Try the floating pill, then point at this lane or the chart.</FeedbackLane>
    </>
  );
}

function PortfolioScene() {
  return (
    <div className="portfolio-board">
      <section className="portfolio-card feature" data-open-loop-label="Featured project case study" data-open-loop-id="portfolio-case-study">
        <SectionHead title="Signal Studio" meta="case study preview" icon={<Palette size={16} />} />
        <p>A public project page with a crisp visual hook, short proof points, and enough breathing room for the feedback pill to feel native.</p>
        <div className="portfolio-proof-row">
          <span>React package</span>
          <span>DOM targeting</span>
          <span>PR proof</span>
        </div>
      </section>

      <section className="portfolio-card timeline" data-open-loop-label="Portfolio launch timeline">
        <SectionHead title="Launch notes" meta="public story" icon={<FileText size={16} />} />
        <ol>
          <li><strong>Show the thing.</strong><span>Screenshot or GIF first.</span></li>
          <li><strong>Name the trick.</strong><span>Real DOM target to structured handoff.</span></li>
          <li><strong>Invite reuse.</strong><span>Adapter boundary stays boring.</span></li>
        </ol>
      </section>

      <section className="portfolio-card quote" data-open-loop-label="Portfolio testimonial block">
        <BadgeCheck size={17} />
        <p>"A comment box is fine. A feedback loop that knows what you clicked is better."</p>
      </section>
    </div>
  );
}

function OperatorScene() {
  return (
    <div className="operator-console">
      <aside className="operator-rail" data-open-loop-label="Operator command rail">
        <button type="button" className="active"><LayoutDashboard size={15} /> Overview</button>
        <button type="button"><RadioTower size={15} /> Signals</button>
        <button type="button"><PanelRight size={15} /> Queue</button>
      </aside>

      <section className="operator-map" data-open-loop-label="Operator flow map" data-open-loop-id="operator-flow-map">
        <SectionHead title="Flow map" meta="dense console region" icon={<Compass size={16} />} />
        <div className="operator-nodes">
          {['Intake', 'Review', 'Patch', 'Ship'].map((label, index) => (
            <div className={`operator-node n-${index}`} key={label} data-open-loop-label={`${label} workflow node`}>
              <span>{label}</span>
              <strong>{index === 0 ? '42' : index === 1 ? '18' : index === 2 ? '7' : '3'}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="operator-queue" data-open-loop-label="Operator queue panel">
        <SectionHead title="Review queue" meta="selected handoffs" icon={<BellRing size={16} />} />
        {['Tighten empty state copy', 'Unify toolbar hover', 'Soften chart transition'].map((item, index) => (
          <article key={item}>
            <span>Q-{index + 1}</span>
            <strong>{item}</strong>
          </article>
        ))}
      </section>
    </div>
  );
}

function MobileScene() {
  return (
    <div className="mobile-stage">
      <section className="mobile-device" data-open-loop-label="Mobile app shell" data-open-loop-id="mobile-shell">
        <div className="mobile-status">
          <span>9:41</span>
          <strong>Open Loop</strong>
          <span>100%</span>
        </div>
        <div className="mobile-hero" data-open-loop-label="Mobile header card" data-open-loop-id="mobile-header-card">
          <Wand2 size={18} />
          <h2>Daily polish pass</h2>
          <p>Small screens still deserve specific feedback.</p>
        </div>
        <div className="mobile-list">
          {[
            ['Home card spacing', 'Layout tweak', 'now'],
            ['Button label tone', 'Copy pass', 'next'],
            ['Swipe feedback', 'Motion note', 'later']
          ].map(([title, kind, time], index) => (
            <article
              key={title}
              data-open-loop-label={index === 0 ? 'Mobile now card' : `${title} row`}
              data-open-loop-id={index === 0 ? 'mobile-now-card' : undefined}
            >
              <span>{time}</span>
              <div>
                <strong>{title}</strong>
                <small>{kind}</small>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="mobile-notes" data-open-loop-label="Mobile implementation notes">
        <Phone size={18} />
        <p>Same React provider. Same JSON shape. Different host app personality.</p>
      </section>
    </div>
  );
}

function Metric({ icon, label, value, trend }: { icon: ReactNode; label: string; value: string; trend: string }) {
  return (
    <div className="demo-metric" data-open-loop-label={`${label} metric`}>
      <span>{icon}</span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
      <em>{trend}</em>
    </div>
  );
}

function SectionHead({ title, meta, icon }: { title: string; meta: string; icon: ReactNode }) {
  return (
    <div className="demo-section-head">
      <div>
        <strong>{title}</strong>
        <span>{meta}</span>
      </div>
      {icon}
    </div>
  );
}

function RouteList() {
  return (
    <div className="demo-route-list">
      {routes.map((route) => (
        <div className={`demo-route ${route.tone}`} key={route.value}>
          <span>{route.label}</span>
          <strong>{route.value}</strong>
        </div>
      ))}
    </div>
  );
}

function FeedbackLane({ children }: { children: ReactNode }) {
  return (
    <section className="demo-feedback-lane" data-open-loop-label="Recent local feedback lane">
      <div>
        <MousePointer2 size={15} />
        <span>{children}</span>
      </div>
      <strong>cmd .</strong>
    </section>
  );
}

function AdapterPanel({ scene }: { scene: SceneConfig }) {
  const loop = useOpenLoop();
  const payload = loop.previewPayload ?? loop.lastPayload;
  const displayPayload = useMemo(() => {
    if (!payload) {
      return {
        item: {
          id: 'LOOP-PREVIEW',
          title: 'Type feedback to preview the handoff',
          status: 'local-preview'
        },
        target: null,
        classification: loop.classification,
        app: { id: 'open-loop-demo', metadata: { scene: scene.id } }
      };
    }
    return payload;
  }, [loop.classification, payload, scene.id]);

  return (
    <aside className="demo-adapter" data-open-loop-label="Adapter JSON inspector" data-open-loop-id="adapter-json-inspector">
      <div className="demo-section-head">
        <div>
          <strong>Adapter handoff</strong>
          <span>{scene.label} / model-agnostic JSON</span>
        </div>
        <span className="demo-live-dot" />
      </div>

      <pre className="demo-json" data-testid="demo-json-preview">
        {JSON.stringify(displayPayload, null, 2)}
      </pre>

      <div className="demo-feed" data-open-loop-label="Submitted feedback feed">
        <div className="demo-feed-head">
          <span>local items</span>
          <strong>{loop.items.length}</strong>
        </div>
        {loop.items.length === 0 ? (
          <p>No feedback queued yet. The demo adapter will echo the item here.</p>
        ) : (
          loop.items.slice(0, 3).map((item) => (
            <article key={item.id} className={`demo-feed-item ${item.status}`}>
              <span>{item.id}</span>
              <strong>{item.kind.replace(/_/g, ' ')}</strong>
              <p>{item.title}</p>
            </article>
          ))
        )}
      </div>
    </aside>
  );
}

function ProofFlowPanel({ mode, scene }: { mode: Exclude<ProofMode, 'off'>; scene: SceneConfig }) {
  const loop = useOpenLoop();
  const payload = loop.lastPayload ?? loop.previewPayload;
  const item = loop.items[0];
  const requestText = payload?.text ?? 'Make the review queue easier to scan and give the active item a calmer highlight.';
  const targetLabel = payload?.target?.label ?? 'Review queue panel';
  const selector = payload?.target?.selector ?? '[data-open-loop-label="Review queue panel"]';
  const itemId = item?.id ?? 'LOOP-G0W00';
  const routeLabel = (payload?.classification.kind ?? 'ui_feedback').replace(/_/g, ' ');

  return (
    <aside
      className={`demo-proof-flow proof-${mode}`}
      data-testid="demo-proof-flow"
      data-open-loop-label="Proof chat rail"
      data-open-loop-id="proof-chat-rail"
    >
      <div className="proof-head">
        <div>
          <strong>Handoff chat</strong>
          <span>{scene.label} / public-safe mock flow</span>
        </div>
        <MessageSquareText size={17} />
      </div>

      <div className="proof-thread">
        <article className="proof-message user">
          <div className="proof-message-meta">
            <span>You</span>
            <small>request sent</small>
          </div>
          <p>{requestText}</p>
          <div className="proof-chip-row">
            <span>@ {targetLabel}</span>
            <span>{routeLabel}</span>
          </div>
          <code>{selector}</code>
        </article>

        <article className="proof-message agent">
          <div className="proof-message-meta">
            <span>Open Loop Agent</span>
            <small>{mode === 'message' ? 'working' : 'ready for review'}</small>
          </div>
          {mode === 'message' ? (
            <>
              <p>Filed <strong>{itemId}</strong>. Branch preview is starting; screenshot proof will land back here when the change is ready.</p>
              <div className="proof-status-list">
                <span><Send size={12} /> JSON received</span>
                <span><GitPullRequest size={12} /> PR pending</span>
                <span><ImageIcon size={12} /> preview queued</span>
              </div>
            </>
          ) : (
            <>
              <p><strong>PR #42 is up.</strong> The preview run attached a rendered image of the changed component.</p>
              <div className="proof-review-card">
                <div className="proof-thumb" aria-label="Rendered preview screenshot" role="img">
                  <div className="proof-thumb-top">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="proof-thumb-body">
                    <div className="proof-thumb-sidebar" />
                    <div className="proof-thumb-main">
                      <strong>Review queue</strong>
                      <span className="proof-thumb-row active" />
                      <span className="proof-thumb-row" />
                      <span className="proof-thumb-row" />
                    </div>
                  </div>
                </div>
                <div>
                  <span className="proof-pr-badge"><GitPullRequest size={12} /> PR #42</span>
                  <p>Queue card contrast tightened, spacing normalized, hover state softened.</p>
                  <div className="proof-actions">
                    <button type="button"><ThumbsUp size={13} /> Approve</button>
                    <button type="button" className="secondary">View diff</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </article>
      </div>
    </aside>
  );
}

function initialScene(): DemoSceneId {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('scene');
  return sceneIds.includes(requested as DemoSceneId) ? (requested as DemoSceneId) : 'dashboard';
}

function getCaptureMode() {
  return new URLSearchParams(window.location.search).get('capture') ?? 'off';
}

function getProofMode(): ProofMode {
  const requested = new URLSearchParams(window.location.search).get('proof');
  return requested === 'message' || requested === 'pr' ? requested : 'off';
}
