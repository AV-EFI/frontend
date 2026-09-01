import { ref, onMounted, onBeforeUnmount } from 'vue';

const HASH_WORKFLOW_DELAYS = {
  openTarget: 900,
  openedTarget: 900,
  closedTarget: 220,
  highlight: 1400,
} as const;

type HashWorkflowTimer = 'openTarget' | 'targetActivation' | 'targetScroll' | 'highlight';

// Model: the durable facts the workflow needs in order to decide what happens next.
// Runtime details such as DOM nodes and timer IDs stay outside this pure state.
export type HashWorkflowModel = {
  hash: string;
  scroll: boolean;
  isInitialLoad: boolean;
};

// Message: every external event, timer callback, or effect result is translated into
// a named input. That keeps the workflow timeline explicit and testable.
export type HashWorkflowMessage =
  | { type: 'hashChanged'; hash: string }
  | { type: 'openDelayElapsed'; hash: string }
  | { type: 'manifestationOpenResolved'; hash: string; opened: boolean }
  | { type: 'targetDelayElapsed'; hash: string }
  | { type: 'targetHighlightResolved'; hash: string; highlighted: boolean }
  | { type: 'scrollDelayElapsed'; hash: string }
  | { type: 'clearHighlightElapsed'; hash: string };

// Effect: a description of work the impure runtime must perform after the pure
// update step has decided it is needed.
export type HashWorkflowEffect =
  | { type: 'clearTimer'; timer: HashWorkflowTimer }
  | { type: 'schedule'; timer: HashWorkflowTimer; delayMs: number; message: HashWorkflowMessage }
  | { type: 'scrollToTop' }
  | { type: 'openManifestation'; hash: string }
  | { type: 'highlightTarget'; hash: string }
  | { type: 'scrollToTarget'; hash: string }
  | { type: 'clearHighlight' };

// Update result: reducers return the next model plus effect descriptions, not
// direct calls to browser APIs.
export type HashWorkflowUpdate = {
  model: HashWorkflowModel;
  effects: HashWorkflowEffect[];
};

export const normalizeHashValue = (value: string) => {
  if (!value) return '';

  const raw = value.startsWith('#') ? value.slice(1) : value;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

export function createHashWorkflowModel(scroll = true): HashWorkflowModel {
  return {
    hash: '',
    scroll,
    isInitialLoad: true,
  };
}

function clearWorkflowEffects(): HashWorkflowEffect[] {
  return [
    { type: 'clearTimer', timer: 'openTarget' },
    { type: 'clearTimer', timer: 'targetActivation' },
    { type: 'clearTimer', timer: 'targetScroll' },
    { type: 'clearTimer', timer: 'highlight' },
    { type: 'clearHighlight' },
  ];
}

function isCurrentHash(model: HashWorkflowModel, hash: string) {
  return Boolean(model.scroll && model.hash && model.hash === hash);
}

// The reducer is the workflow's pure decision point. Given only the current model
// and one message, it returns the next model and the effects the runtime should run.
export function updateHashWorkflow(
  model: HashWorkflowModel,
  message: HashWorkflowMessage
): HashWorkflowUpdate {
  switch (message.type) {
  case 'hashChanged': {
    const hash = normalizeHashValue(message.hash);
    const nextModel = { ...model, hash };
    // A new hash supersedes every pending step from the previous hash workflow.
    const effects = clearWorkflowEffects();

    if (!model.scroll || !hash) {
      return {
        model: { ...nextModel, isInitialLoad: false },
        effects,
      };
    }

    return {
      model: nextModel,
      effects: [
        ...effects,
        {
          type: 'schedule',
          timer: 'openTarget',
          delayMs: HASH_WORKFLOW_DELAYS.openTarget,
          message: { type: 'openDelayElapsed', hash },
        },
      ],
    };
  }

  case 'openDelayElapsed': {
    // Timer messages carry the hash they were scheduled for. If the user has moved
    // on to another hash, the stale message becomes a no-op.
    if (!isCurrentHash(model, message.hash)) return { model, effects: [] };

    return {
      model: { ...model, isInitialLoad: false },
      effects: [
        ...(model.isInitialLoad ? [{ type: 'scrollToTop' } as const] : []),
        { type: 'openManifestation', hash: message.hash },
      ],
    };
  }

  case 'manifestationOpenResolved': {
    if (!isCurrentHash(model, message.hash)) return { model, effects: [] };

    return {
      model,
      effects: [{
        type: 'schedule',
        timer: 'targetActivation',
        // Opening a manifestation can reveal nested content, so successful opens
        // get the longer delay before the target is highlighted and scrolled.
        delayMs: message.opened ? HASH_WORKFLOW_DELAYS.openedTarget : HASH_WORKFLOW_DELAYS.closedTarget,
        message: { type: 'targetDelayElapsed', hash: message.hash },
      }],
    };
  }

  case 'targetDelayElapsed': {
    if (!isCurrentHash(model, message.hash)) return { model, effects: [] };

    return {
      model,
      effects: [{ type: 'highlightTarget', hash: message.hash }],
    };
  }

  case 'targetHighlightResolved': {
    if (!isCurrentHash(model, message.hash) || !message.highlighted) return { model, effects: [] };

    return {
      model,
      effects: [
        { type: 'clearTimer', timer: 'targetScroll' },
        { type: 'clearTimer', timer: 'highlight' },
        {
          type: 'schedule',
          timer: 'targetScroll',
          delayMs: HASH_WORKFLOW_DELAYS.openedTarget,
          message: { type: 'scrollDelayElapsed', hash: message.hash },
        },
        {
          type: 'schedule',
          timer: 'highlight',
          delayMs: HASH_WORKFLOW_DELAYS.highlight,
          message: { type: 'clearHighlightElapsed', hash: message.hash },
        },
      ],
    };
  }

  case 'scrollDelayElapsed': {
    if (!isCurrentHash(model, message.hash)) return { model, effects: [] };

    return {
      model,
      effects: [{ type: 'scrollToTarget', hash: message.hash }],
    };
  }

  case 'clearHighlightElapsed': {
    if (!isCurrentHash(model, message.hash)) return { model, effects: [] };

    return {
      model,
      effects: [{ type: 'clearHighlight' }],
    };
  }
  }

  return { model, effects: [] };
}

export function useHash(scroll = true) {
  const hash = ref('');
  const timers: Partial<Record<HashWorkflowTimer, number>> = {};
  let model = createHashWorkflowModel(scroll);
  // Runtime-owned state can be mutated freely because it is not part of the
  // workflow model we test through updateHashWorkflow.
  let activeHighlight: { highlightElement: HTMLElement; focusElement: HTMLElement; removeTabIndex: boolean } | null = null;

  const findTargetElement = (hashValue: string) => document.getElementById(normalizeHashValue(hashValue));

  const isVisibleElement = (el: Element) => {
    if (!(el instanceof HTMLElement)) return false;
    if (el.hidden || el.classList.contains('sr-only')) return false;
    return el.offsetParent !== null || el.getClientRects().length > 0;
  };

  const findHighlightElement = (el: HTMLElement) => {
    if (/^H[1-6]$/i.test(el.tagName) && isVisibleElement(el)) return el;

    const innerHeading = Array.from(el.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      .find(isVisibleElement);
    if (innerHeading instanceof HTMLElement) return innerHeading;

    const previousHeading = el.previousElementSibling?.matches('h1, h2, h3, h4, h5, h6')
      ? el.previousElementSibling
      : null;
    if (previousHeading instanceof HTMLElement && isVisibleElement(previousHeading)) return previousHeading;

    const nextHeading = el.nextElementSibling?.matches('h1, h2, h3, h4, h5, h6')
      ? el.nextElementSibling
      : null;
    if (nextHeading instanceof HTMLElement && isVisibleElement(nextHeading)) return nextHeading;

    return el;
  };

  // Same adjacency search as findHighlightElement, but without the visibility
  // filter: a sr-only heading is exactly how items/manifestations expose their
  // full "Item 1.1, ..." identity to assistive tech (see ItemListNewComp), and
  // is the right thing to move focus to even though it can't carry the visible
  // highlight color.
  const findAccessibleHeading = (el: HTMLElement) => {
    if (/^H[1-6]$/i.test(el.tagName)) return el;

    const innerHeading = el.querySelector('h1, h2, h3, h4, h5, h6');
    if (innerHeading instanceof HTMLElement) return innerHeading;

    const previousHeading = el.previousElementSibling;
    if (previousHeading instanceof HTMLElement && previousHeading.matches('h1, h2, h3, h4, h5, h6')) return previousHeading;

    const nextHeading = el.nextElementSibling;
    if (nextHeading instanceof HTMLElement && nextHeading.matches('h1, h2, h3, h4, h5, h6')) return nextHeading;

    return null;
  };

  const openTargetManifestation = (hashValue: string) => {
    const normalized = normalizeHashValue(hashValue);
    const manifestationMatch = normalized.match(/^manifestation-(\d+)$/);
    const itemMatch = normalized.match(/^item-(\d+)-\d+$/);
    const directIndex = manifestationMatch?.[1] ?? itemMatch?.[1];
    const directTarget = findTargetElement(normalized);
    const parentManifestation = directTarget?.closest('section[data-manifestation-index]') as HTMLElement | null;
    const parentIndex = parentManifestation?.dataset?.manifestationIndex;
    const rawIndex = directIndex ?? parentIndex;
    if (!rawIndex) return false;

    window.dispatchEvent(new CustomEvent('detail:openManifestation', {
      detail: { index: Number(rawIndex) },
    }));
    return true;
  };

  const clearActiveHighlight = () => {
    if (!activeHighlight) return;

    activeHighlight.highlightElement.classList.remove(
      'bg-highlight',
      'transition-colors',
      'duration-300'
    );
    if (activeHighlight.removeTabIndex) {
      activeHighlight.focusElement.removeAttribute('tabindex');
    }
    activeHighlight = null;
  };

  const highlightTarget = (hashValue: string) => {
    const normalized = normalizeHashValue(hashValue);
    const el = findTargetElement(normalized);
    if (!(el instanceof HTMLElement)) return false;

    clearActiveHighlight();

    // The visible color flash and the assistive-tech focus target can be two
    // different elements: a sr-only summary heading carries the richer
    // accessible name but can't visibly flash, so it only wins the focus, not
    // the highlight.
    const highlightEl = findHighlightElement(el);
    highlightEl.classList.add(
      'bg-highlight',
      'transition-colors',
      'duration-300'
    );

    const focusEl = findAccessibleHeading(el) ?? highlightEl;
    const hadTabIndex = focusEl.hasAttribute('tabindex');
    if (!hadTabIndex) {
      focusEl.setAttribute('tabindex', '-1');
    }

    focusEl.focus({ preventScroll: true });

    activeHighlight = {
      highlightElement: highlightEl,
      focusElement: focusEl,
      removeTabIndex: !hadTabIndex,
    };

    return true;
  };

  const scrollTargetIntoView = (hashValue: string) => {
    const normalized = normalizeHashValue(hashValue);
    const el = findTargetElement(normalized);
    if (!(el instanceof HTMLElement)) return;

    const scrollRoot = document.scrollingElement;
    const absoluteTop = window.scrollY + el.getBoundingClientRect().top;
    const targetTop = Math.max(absoluteTop - window.innerHeight * 0.35, 0);

    if (scrollRoot?.scrollTo) {
      scrollRoot.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    }
  };

  const clearTimer = (timer: HashWorkflowTimer) => {
    const timerId = timers[timer];
    if (typeof timerId !== 'number') return;

    window.clearTimeout(timerId);
    delete timers[timer];
  };

  const runEffects = (effects: HashWorkflowEffect[]) => {
    for (const effect of effects) {
      switch (effect.type) {
      case 'clearTimer':
        clearTimer(effect.timer);
        break;

      case 'schedule':
        clearTimer(effect.timer);
        timers[effect.timer] = window.setTimeout(() => {
          delete timers[effect.timer];
          dispatch(effect.message);
        }, effect.delayMs);
        break;

      case 'scrollToTop':
        window.scrollTo(0, 0);
        break;

      case 'openManifestation':
        // Effects that can succeed or fail report back by dispatching another
        // message, keeping branching decisions inside the reducer.
        dispatch({
          type: 'manifestationOpenResolved',
          hash: effect.hash,
          opened: openTargetManifestation(effect.hash),
        });
        break;

      case 'highlightTarget':
        dispatch({
          type: 'targetHighlightResolved',
          hash: effect.hash,
          highlighted: highlightTarget(effect.hash),
        });
        break;

      case 'scrollToTarget':
        scrollTargetIntoView(effect.hash);
        break;

      case 'clearHighlight':
        clearActiveHighlight();
        break;
      }
    }
  };

  const dispatch = (message: HashWorkflowMessage) => {
    const update = updateHashWorkflow(model, message);
    model = update.model;
    hash.value = model.hash;
    // This is the Elm-like loop: message in, model/effects out, effects may
    // dispatch more messages when browser work completes.
    runEffects(update.effects);
  };

  const applyHash = () => {
    dispatch({ type: 'hashChanged', hash: window.location.hash });
  };

  onMounted(() => {
    applyHash();
    window.addEventListener('hashchange', applyHash);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('hashchange', applyHash);
    clearTimer('openTarget');
    clearTimer('targetActivation');
    clearTimer('targetScroll');
    clearTimer('highlight');
    clearActiveHighlight();
  });

  return { hash };
}
