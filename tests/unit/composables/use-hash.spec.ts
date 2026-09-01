// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  createHashWorkflowModel,
  normalizeHashValue,
  updateHashWorkflow,
  useHash,
  type HashWorkflowEffect,
} from '~/composables/useHash';

const Host = defineComponent({
  setup() {
    const { hash } = useHash();
    return { hash };
  },
  template: `
    <main>
      <section data-manifestation-index="2">
        <div id="21.11155/IT-1">Item 1</div>
      </section>
    </main>
  `,
});

function scheduledEffect(effects: HashWorkflowEffect[], timer: string) {
  return effects.find((effect) => effect.type === 'schedule' && effect.timer === timer);
}

describe('hash workflow state updates', () => {
  test('normalizes encoded hash fragments', () => {
    expect(normalizeHashValue('#21.11155%2FIT-1')).toBe('21.11155/IT-1');
    expect(normalizeHashValue('#broken%')).toBe('broken%');
  });

  test('starts a delayed hash workflow after the hash changes', () => {
    const update = updateHashWorkflow(createHashWorkflowModel(), {
      type: 'hashChanged',
      hash: '#21.11155%2FIT-1',
    });

    expect(update.model.hash).toBe('21.11155/IT-1');
    expect(update.model.isInitialLoad).toBe(true);
    expect(update.effects).toEqual(expect.arrayContaining([
      { type: 'clearTimer', timer: 'openTarget' },
      { type: 'clearTimer', timer: 'targetActivation' },
      { type: 'clearTimer', timer: 'targetScroll' },
      { type: 'clearTimer', timer: 'highlight' },
      { type: 'clearHighlight' },
    ]));
    expect(scheduledEffect(update.effects, 'openTarget')).toMatchObject({
      type: 'schedule',
      delayMs: 900,
      message: { type: 'openDelayElapsed', hash: '21.11155/IT-1' },
    });
  });

  test('ignores stale timer messages for a superseded hash', () => {
    const model = {
      ...createHashWorkflowModel(),
      hash: 'new-target',
    };

    const update = updateHashWorkflow(model, {
      type: 'openDelayElapsed',
      hash: 'old-target',
    });

    expect(update.model).toBe(model);
    expect(update.effects).toEqual([]);
  });

  test('opens the target once the initial delay elapses', () => {
    const model = {
      ...createHashWorkflowModel(),
      hash: '21.11155/IT-1',
      isInitialLoad: true,
    };

    const update = updateHashWorkflow(model, {
      type: 'openDelayElapsed',
      hash: '21.11155/IT-1',
    });

    expect(update.model.isInitialLoad).toBe(false);
    expect(update.effects).toEqual([
      { type: 'scrollToTop' },
      { type: 'openManifestation', hash: '21.11155/IT-1' },
    ]);
  });

  test('waits longer before targeting content when a manifestation was opened', () => {
    const model = {
      ...createHashWorkflowModel(),
      hash: '21.11155/IT-1',
    };

    const update = updateHashWorkflow(model, {
      type: 'manifestationOpenResolved',
      hash: '21.11155/IT-1',
      opened: true,
    });

    expect(scheduledEffect(update.effects, 'targetActivation')).toMatchObject({
      type: 'schedule',
      delayMs: 900,
      message: { type: 'targetDelayElapsed', hash: '21.11155/IT-1' },
    });
  });

  test('clears pending timers and highlight state when the hash is cleared', () => {
    const model = {
      ...createHashWorkflowModel(),
      hash: '21.11155/IT-1',
      isInitialLoad: true,
    };

    const update = updateHashWorkflow(model, {
      type: 'hashChanged',
      hash: '',
    });

    expect(update.model.hash).toBe('');
    expect(update.model.isInitialLoad).toBe(false);
    expect(update.effects).toEqual([
      { type: 'clearTimer', timer: 'openTarget' },
      { type: 'clearTimer', timer: 'targetActivation' },
      { type: 'clearTimer', timer: 'targetScroll' },
      { type: 'clearTimer', timer: 'highlight' },
      { type: 'clearHighlight' },
    ]);
  });
});

describe('useHash runtime effects', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
    window.history.replaceState({}, '', '/#21.11155%2FIT-1');
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('opens the parent manifestation before highlighting and scrolling to the target', async () => {
    const openManifestation = vi.fn();
    window.addEventListener('detail:openManifestation', openManifestation);

    const wrapper = mount(Host, { attachTo: document.body });
    await nextTick();

    vi.advanceTimersByTime(900);
    await nextTick();

    expect(openManifestation).toHaveBeenCalledTimes(1);
    expect((openManifestation.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({ index: 2 });

    vi.advanceTimersByTime(900);
    await nextTick();

    const target = document.getElementById('21.11155/IT-1');
    expect(target?.classList.contains('bg-highlight')).toBe(true);
    expect(target?.getAttribute('tabindex')).toBe('-1');

    vi.advanceTimersByTime(1400);
    await nextTick();

    expect(target?.classList.contains('bg-highlight')).toBe(false);
    expect(target?.hasAttribute('tabindex')).toBe(false);

    wrapper.unmount();
    window.removeEventListener('detail:openManifestation', openManifestation);
  });
});

describe('useHash focus target for sr-only summary headings', () => {
  const HostWithSrOnlyHeading = defineComponent({
    setup() {
      const { hash } = useHash();
      return { hash };
    },
    template: `
      <main>
        <section data-manifestation-index="0">
          <h5 id="item-heading" class="sr-only">Item 1.1, has_access_status: Public</h5>
          <div id="21.11155/IT-1">Item 1</div>
        </section>
      </main>
    `,
  });

  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
    window.history.replaceState({}, '', '/#21.11155%2FIT-1');
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('focuses the adjacent sr-only summary heading instead of the empty anchor, while still highlighting the visible anchor', async () => {
    const wrapper = mount(HostWithSrOnlyHeading, { attachTo: document.body });
    await nextTick();

    vi.advanceTimersByTime(900); // open the manifestation
    await nextTick();
    vi.advanceTimersByTime(900); // reach the target
    await nextTick();

    const heading = document.getElementById('item-heading');
    const anchor = document.getElementById('21.11155/IT-1');

    expect(document.activeElement).toBe(heading);
    expect(heading?.getAttribute('tabindex')).toBe('-1');
    expect(anchor?.classList.contains('bg-highlight')).toBe(true);
    expect(heading?.classList.contains('bg-highlight')).toBe(false);

    vi.advanceTimersByTime(1400); // clear the highlight
    await nextTick();

    expect(heading?.hasAttribute('tabindex')).toBe(false);
    expect(anchor?.classList.contains('bg-highlight')).toBe(false);

    wrapper.unmount();
  });
});
