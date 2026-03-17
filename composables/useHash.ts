import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useHash(scroll = true) {
  const hash = ref('');
  let highlightTimer: ReturnType<typeof setTimeout> | null = null;
  let scrollTimer: ReturnType<typeof setTimeout> | null = null;
  let pendingHash = '';
  let observer: MutationObserver | null = null;

  const normalizeHashValue = (value: string) => {
    if (!value) return '';

    const raw = value.startsWith('#') ? value.slice(1) : value;
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  };

  const findTargetElement = (hashValue: string) => {
    const normalized = normalizeHashValue(hashValue);
    return document.getElementById(normalized);
  };

  const stopObserving = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  const ensureObserver = (hashValue: string) => {
    if (!scroll || !hashValue || observer) return;

    observer = new MutationObserver(() => {
      if (pendingHash !== hashValue) {
        stopObserving();
        return;
      }

      openTargetManifestation(hashValue);
      if (highlightAndScroll(hashValue)) {
        stopObserving();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
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
    if (!rawIndex) return;

    window.dispatchEvent(new CustomEvent('detail:openManifestation', {
      detail: { index: Number(rawIndex) },
    }));
  };

  const highlightAndScroll = (hashValue: string) => {
    const el = findTargetElement(hashValue);
    if (!(el instanceof HTMLElement)) return false;

    const hadTabIndex = el.hasAttribute('tabindex');
    if (!hadTabIndex) {
      el.setAttribute('tabindex', '-1');
    }

    el.classList.add(
      'bg-highlight',
      'text-white',
      'outline',
      'outline-2',
      'outline-primary',
      'transition-colors',
      'duration-500'
    );

    el.focus({ preventScroll: true });
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

    if (highlightTimer) clearTimeout(highlightTimer);
    highlightTimer = setTimeout(() => {
      el.classList.remove(
        'bg-highlight',
        'text-white',
        'outline',
        'outline-2',
        'outline-primary',
        'transition-colors',
        'duration-500'
      );
      if (!hadTabIndex) {
        el.removeAttribute('tabindex');
      }
    }, 3200);

    return true;
  };

  const scheduleHighlight = (hashValue: string, attempt = 0) => {
    if (!scroll || !hashValue || pendingHash !== hashValue) return;

    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (pendingHash !== hashValue) return;

      openTargetManifestation(hashValue);
      const didScroll = highlightAndScroll(hashValue);
      if (!didScroll && attempt < 8) {
        scheduleHighlight(hashValue, attempt + 1);
      } else if (!didScroll) {
        ensureObserver(hashValue);
      } else {
        stopObserving();
      }
    }, attempt === 0 ? 260 : 180);
  };

  const updateHash = () => {
    hash.value = normalizeHashValue(window.location.hash);
    pendingHash = hash.value;
    stopObserving();
    if (!scroll || !hash.value) return;

    scheduleHighlight(hash.value);
  };

  onMounted(() => {
    updateHash();
    window.addEventListener('hashchange', updateHash);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('hashchange', updateHash);
    stopObserving();
    if (scrollTimer) clearTimeout(scrollTimer);
    if (highlightTimer) clearTimeout(highlightTimer);
  });

  return { hash };
}
