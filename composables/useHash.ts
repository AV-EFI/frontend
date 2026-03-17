import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useHash(scroll = true) {
  const hash = ref('');
  let highlightTimer: ReturnType<typeof setTimeout> | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  const debugPrefix = '[useHash]';

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
    console.debug(`${debugPrefix} openTargetManifestation`, {
      hashValue,
      normalized,
    });
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
    console.debug(`${debugPrefix} highlightAndScroll`, {
      hashValue,
      normalized,
      found: el instanceof HTMLElement,
    });
    if (!(el instanceof HTMLElement)) return false;

    const hadTabIndex = el.hasAttribute('tabindex');
    if (!hadTabIndex) {
      el.setAttribute('tabindex', '-1');
    }

    const targetTop = window.scrollY + el.getBoundingClientRect().top;

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
    window.setTimeout(() => {
      window.scrollTo({
        top: Math.max(targetTop - window.innerHeight * 0.35, 0),
        behavior: 'smooth',
      });
    }, 140);
    console.debug(`${debugPrefix} scrolled`, {
      id: el.id,
      tagName: el.tagName,
    });

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

  const applyHash = () => {
    hash.value = normalizeHashValue(window.location.hash);
    console.debug(`${debugPrefix} applyHash`, {
      locationHash: window.location.hash,
      normalizedHash: hash.value,
      scroll,
    });
    if (!scroll || !hash.value) return;

    const openedManifestation = openTargetManifestation(hash.value);
    if (openedManifestation) {
      if (retryTimer) clearTimeout(retryTimer);
      retryTimer = window.setTimeout(() => {
        highlightAndScroll(hash.value);
      }, 120);
      return;
    }

    if (highlightAndScroll(hash.value)) return;

    if (retryTimer) clearTimeout(retryTimer);
    retryTimer = window.setTimeout(() => {
      highlightAndScroll(hash.value);
    }, 180);
  };

  onMounted(() => {
    console.debug(`${debugPrefix} mounted`);
    applyHash();
    window.addEventListener('hashchange', applyHash);
  });

  onBeforeUnmount(() => {
    console.debug(`${debugPrefix} beforeUnmount`);
    window.removeEventListener('hashchange', applyHash);
    if (retryTimer) clearTimeout(retryTimer);
    if (highlightTimer) clearTimeout(highlightTimer);
  });

  return { hash };
}
