import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useHash(scroll = true) {
  const hash = ref('');
  // Typed as `number` (not ReturnType<typeof setTimeout>) because @types/node's global
  // augmentation turns window.setTimeout into an overloaded/intersected callable, and
  // TS's ReturnType<> picks the *last* call signature (NodeJS.Timeout) rather than the
  // one window.setTimeout actually returns at runtime — this composable is browser-only.
  let highlightTimer: number | null = null;
  let retryTimer: number | null = null;
  let scrollTimer: number | null = null;
  let isInitialLoad = true;
  const actionDelayMs = 900;
  const postOpenDelayMs = 900;

  const normalizeHashValue = (value: string) => {
    if (!value) return '';

    const raw = value.startsWith('#') ? value.slice(1) : value;
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  };

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

  const highlightAndScroll = (hashValue: string) => {
    const normalized = normalizeHashValue(hashValue);
    const el = findTargetElement(normalized);
    if (!(el instanceof HTMLElement)) return false;

    const highlightEl = findHighlightElement(el);
    const hadTabIndex = highlightEl.hasAttribute('tabindex');
    if (!hadTabIndex) {
      highlightEl.setAttribute('tabindex', '-1');
    }

    highlightEl.classList.add(
      'bg-highlight',
      'transition-colors',
      'duration-300'
    );

    highlightEl.focus({ preventScroll: true });

    if (scrollTimer) clearTimeout(scrollTimer);

    scrollTimer = window.setTimeout(() => {
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
    }, postOpenDelayMs);

    if (highlightTimer) clearTimeout(highlightTimer);
    highlightTimer = window.setTimeout(() => {
      highlightEl.classList.remove(
        'bg-highlight',
        'transition-colors',
        'duration-300'
      );
      if (!hadTabIndex) {
        highlightEl.removeAttribute('tabindex');
      }
    }, 1400);

    return true;
  };

  const applyHash = () => {
    hash.value = normalizeHashValue(window.location.hash);
    if (!scroll || !hash.value) {
      isInitialLoad = false;
      return;
    }

    if (retryTimer) clearTimeout(retryTimer);
    retryTimer = window.setTimeout(() => {
      if (isInitialLoad) {
        window.scrollTo(0, 0);
        isInitialLoad = false;
      }

      const openedManifestation = openTargetManifestation(hash.value);
      retryTimer = window.setTimeout(() => {
        highlightAndScroll(hash.value);
      }, openedManifestation ? postOpenDelayMs : 220);
    }, actionDelayMs);
  };

  onMounted(() => {
    applyHash();
    window.addEventListener('hashchange', applyHash);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('hashchange', applyHash);
    if (retryTimer) clearTimeout(retryTimer);
    if (highlightTimer) clearTimeout(highlightTimer);
    if (scrollTimer) clearTimeout(scrollTimer);
  });

  return { hash };
}
