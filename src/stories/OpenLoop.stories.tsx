import { OpenLoopProvider } from '../provider';
import { createMockAdapter } from '../adapters/mock';
import { OpenLoopChrome } from '../components';
import '../styles.css';
import '../demo/demo.css';

export default {
  title: 'Open Loop UI'
};

export function DefaultPill() {
  return (
    <OpenLoopProvider renderChrome={false} adapter={createMockAdapter({ delayMs: 0 })}>
      <div className="demo-shell">
        <div className="demo-feedback-lane" data-open-loop-label="Story feedback lane">
          <div>Story canvas target</div>
          <strong>cmd .</strong>
        </div>
      </div>
      <OpenLoopChrome />
    </OpenLoopProvider>
  );
}

export function OpenPanel() {
  return (
    <OpenLoopProvider defaultOpen adapter={createMockAdapter({ delayMs: 0 })}>
      <div className="demo-shell">
        <section className="demo-chart" data-open-loop-label="Story chart">
          <div className="demo-section-head">
            <div>
              <strong>Story chart</strong>
              <span>targetable region</span>
            </div>
          </div>
        </section>
      </div>
    </OpenLoopProvider>
  );
}
