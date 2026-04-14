import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useHash(scroll = true) {
  const hash = ref('');
  let highlightTimer: ReturnType<typeof setTimeout> | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let scrollTimer: ReturnType<typeof setTimeout> | null = null;
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
    const heading = el.querySelector('h5');

    const hadTabIndex = el.hasAttribute('tabindex');
    if (!hadTabIndex) {
      el.setAttribute('tabindex', '-1');
    }

    heading?.classList.add(
      'bg-highlight',
      'text-white',
      'transition-colors',
      'duration-500'
    );

    el.focus({ preventScroll: true });

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
    highlightTimer = setTimeout(() => {
      heading?.classList.remove(
        'bg-highlight',
        'text-white',
        'transition-colors',
        'duration-500'
      );
      if (!hadTabIndex) {
        el.removeAttribute('tabindex');
      }
    }, 3200);

    return true;
  };

  const applyHash = () => {
    hash.value = normalizeHashValue(window.location.hash);
    if (!scroll || !hash.value) return;

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
