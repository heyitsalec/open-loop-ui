import { Activity, ArrowUpRight, CheckCircle2, GitBranch, Layers3, MonitorDot, MousePointer2, Sparkles } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { useMemo } from 'react';
import { useOpenLoop } from '../context';

const bars = [42, 68, 54, 82, 64, 92, 76, 88];
const routes = [
  { label: 'layout', value: 'design', tone: 'green' },
  { label: 'copy', value: 'copy', tone: 'blue' },
  { label: 'bug', value: 'fix', tone: 'coral' },
  { label: 'idea', value: 'planner', tone: 'gold' }
];

export function DemoApp() {
  return (
    <main className="demo-shell">
      <section className="demo-workbench" aria-label="Open Loop UI demo workbench">
        <DemoTopbar />
        <div className="demo-grid">
          <ProductCanvas />
          <AdapterPanel />
        </div>
      </section>
    </main>
  );
}

function DemoTopbar() {
  return (
    <header className="demo-topbar" data-open-loop-label="Demo top bar" data-open-loop-id="demo-topbar">
      <div className="demo-brand">
        <span className="demo-brand-mark"><Sparkles size={15} /></span>
        <div>
          <strong>Open Loop UI</strong>
          <small>floating design feedback for React apps</small>
        </div>
      </div>
      <nav className="demo-tabs" aria-label="Demo sections">
        <button type="button" className="active">Canvas</button>
        <button type="button">Queue</button>
        <button type="button">Adapter</button>
      </nav>
      <div className="demo-top-actions" data-open-loop-label="Demo toolbar actions">
        <span><MonitorDot size={14} /> local</span>
        <button type="button">Export JSON</button>
      </div>
    </header>
  );
}

function ProductCanvas() {
  return (
    <section className="demo-canvas" data-open-loop-label="Product dashboard canvas" data-open-loop-id="product-dashboard-canvas">
      <div className="demo-canvas-head">
        <div>
          <span className="demo-kicker">Demo product surface</span>
          <h1>Feedback lands exactly where the UI work happens.</h1>
        </div>
        <div className="demo-score" data-open-loop-label="Quality score widget">
          <strong>94</strong>
          <span>polish score</span>
        </div>
      </div>

      <div className="demo-metrics" data-open-loop-label="Metric strip">
        <Metric icon={<Activity size={16} />} label="signals" value="128" trend="+18%" />
        <Metric icon={<GitBranch size={16} />} label="handoffs" value="34" trend="+9%" />
        <Metric icon={<CheckCircle2 size={16} />} label="accepted" value="22" trend="steady" />
      </div>

      <div className="demo-canvas-main">
        <section className="demo-chart" data-open-loop-label="Revenue canvas chart" data-open-loop-node-id="chart.revenue">
          <div className="demo-section-head">
            <div>
              <strong>Revenue canvas</strong>
              <span>mock dashboard region</span>
            </div>
            <ArrowUpRight size={16} />
          </div>
          <div className="demo-bars" aria-label="Demo bar chart">
            {bars.map((height, index) => (
              <span key={index} style={{ '--bar-height': `${height}%` } as CSSProperties} />
            ))}
          </div>
        </section>

        <section className="demo-routes" data-open-loop-label="Routing preview cards">
          <div className="demo-section-head">
            <div>
              <strong>Live route preview</strong>
              <span>heuristic first, adapter second</span>
            </div>
            <Layers3 size={16} />
          </div>
          <div className="demo-route-list">
            {routes.map((route) => (
              <div className={`demo-route ${route.tone}`} key={route.value}>
                <span>{route.label}</span>
                <strong>{route.value}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="demo-feedback-lane" data-open-loop-label="Recent local feedback lane">
        <div>
          <MousePointer2 size={15} />
          <span>Try the floating pill, then point at this lane or the chart.</span>
        </div>
        <strong>cmd .</strong>
      </section>
    </section>
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

function AdapterPanel() {
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
        app: { id: 'open-loop-demo' }
      };
    }
    return payload;
  }, [loop.classification, payload]);

  return (
    <aside className="demo-adapter" data-open-loop-label="Adapter JSON inspector" data-open-loop-id="adapter-json-inspector">
      <div className="demo-section-head">
        <div>
          <strong>Adapter handoff</strong>
          <span>model-agnostic JSON contract</span>
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
