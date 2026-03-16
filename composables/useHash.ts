import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useHash(scroll = true) {
  const hash = ref('');
  let highlightTimer: ReturnType<typeof setTimeout> | null = null;
  let scrollTimer: ReturnType<typeof setTimeout> | null = null;

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
    if (!(el instanceof HTMLElement)) return;

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
  };

  const updateHash = () => {
    hash.value = window.location.hash.slice(1);
    if (!scroll || !hash.value) return;

    if (scrollTimer) clearTimeout(scrollTimer);
    openTargetManifestation(hash.value);

    scrollTimer = setTimeout(() => {
      highlightAndScroll(hash.value);
    }, 260);
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
