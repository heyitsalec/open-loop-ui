import { describe, expect, it } from 'vitest';
import {
  classifyOpenLoopFeedback,
  createOpenLoopItem,
  describeOpenLoopTarget,
  getOpenLoopTargetElement,
  isOpenLoopChromeElement,
  isOpenLoopControlElement
} from './core';

describe('classifyOpenLoopFeedback', () => {
  it('routes bugs to fix with loud depth', () => {
    expect(classifyOpenLoopFeedback('urgent regression: chart is broken')).toEqual({
      kind: 'bug_report',
      route: 'fix',
      depth: 'loud'
    });
  });

  it('detects copy, layout, color, motion, and planning feedback', () => {
    expect(classifyOpenLoopFeedback('tighten the headline copy').kind).toBe('copy_change');
    expect(classifyOpenLoopFeedback('spacing feels crowded').kind).toBe('layout_tweak');
    expect(classifyOpenLoopFeedback('color contrast is too light').kind).toBe('color_tweak');
    expect(classifyOpenLoopFeedback('hover motion feels abrupt').kind).toBe('motion_tweak');
    expect(classifyOpenLoopFeedback('maybe someday add a review mode')).toEqual({
      kind: 'design_idea',
      route: 'planning',
      depth: 'quiet'
    });
  });
});

describe('createOpenLoopItem', () => {
  it('creates a stable local preview item and avoids id collisions', () => {
    const item = createOpenLoopItem(
      {
        text: 'Fix the chart spacing',
        id: 'LOOP-ABCDE',
        now: Date.UTC(2026, 0, 2),
        target: { label: 'Chart', selector: '[data-open-loop-label="Chart"]' }
      },
      ['LOOP-ABCDE']
    );

    expect(item.id).toBe('LOOP-ABCDE-2');
    expect(item.title).toBe('Fix the chart spacing');
    expect(item.target).toBe('Chart');
    expect(item.status).toBe('local-preview');
    expect(item.kind).toBe('layout_tweak');
  });
});

describe('target discovery', () => {
  it('skips Open Loop chrome while hit-testing the page', () => {
    const panel = document.createElement('section');
    panel.className = 'olu-panel';
    const backdrop = document.createElement('button');
    backdrop.className = 'olu-backdrop';
    const target = document.createElement('div');
    target.dataset.openLoopLabel = 'Revenue chart';
    const fakeDocument = {
      elementsFromPoint: () => [backdrop, panel, target]
    } as unknown as Document;

    expect(isOpenLoopChromeElement(panel)).toBe(true);
    expect(isOpenLoopChromeElement(backdrop)).toBe(true);
    expect(isOpenLoopControlElement(panel)).toBe(true);
    expect(isOpenLoopControlElement(backdrop)).toBe(false);
    expect(getOpenLoopTargetElement(10, 10, fakeDocument)).toBe(target);
  });

  it('uses the labelled ancestor as the target bounds and selector', () => {
    const parent = document.createElement('section');
    parent.dataset.openLoopLabel = 'Revenue chart';
    parent.getBoundingClientRect = () => ({
      x: 12,
      y: 20,
      width: 320,
      height: 180,
      top: 20,
      left: 12,
      right: 332,
      bottom: 200,
      toJSON: () => ({})
    });
    const child = document.createElement('button');
    child.getBoundingClientRect = () => ({
      x: 20,
      y: 30,
      width: 40,
      height: 20,
      top: 30,
      left: 20,
      right: 60,
      bottom: 50,
      toJSON: () => ({})
    });
    parent.appendChild(child);

    const target = describeOpenLoopTarget(child);
    expect(target.label).toBe('Revenue chart');
    expect(target.selector).toBe('[data-open-loop-label="Revenue chart"]');
    expect(target.rect).toEqual({ x: 12, y: 20, width: 320, height: 180 });
  });
});
