import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useHash(scroll = true) {
  const hash = ref('');
  let highlightTimer: ReturnType<typeof setTimeout> | null = null;
  let scrollTimer: ReturnType<typeof setTimeout> | null = null;
  let pendingHash = '';

  const openTargetManifestation = (hashValue: string) => {
    const manifestationMatch = hashValue.match(/^manifestation-(\d+)$/);
    const itemMatch = hashValue.match(/^item-(\d+)-\d+$/);
    const directIndex = manifestationMatch?.[1] ?? itemMatch?.[1];
    const directTarget = document.getElementById(hashValue);
    const parentManifestation = directTarget?.closest('section[data-manifestation-index]') as HTMLElement | null;
    const parentIndex = parentManifestation?.dataset?.manifestationIndex;
    const rawIndex = directIndex ?? parentIndex;
    if (!rawIndex) return;

    window.dispatchEvent(new CustomEvent('detail:openManifestation', {
      detail: { index: Number(rawIndex) },
    }));
  };

  const highlightAndScroll = (hashValue: string) => {
    const el = document.getElementById(hashValue);
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
      }
    }, attempt === 0 ? 260 : 180);
  };

  const updateHash = () => {
    hash.value = window.location.hash.slice(1);
    pendingHash = hash.value;
    if (!scroll || !hash.value) return;

    scheduleHighlight(hash.value);
  };

  onMounted(() => {
    updateHash();
    window.addEventListener('hashchange', updateHash);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('hashchange', updateHash);
    if (scrollTimer) clearTimeout(scrollTimer);
    if (highlightTimer) clearTimeout(highlightTimer);
  });

  return { hash };
}
