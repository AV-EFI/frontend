import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useHash(scroll = true) {
  const hash = ref('');
  let highlightTimer: ReturnType<typeof setTimeout> | null = null;

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

  const applyHash = () => {
    hash.value = normalizeHashValue(window.location.hash);
    if (!scroll || !hash.value) return;

    openTargetManifestation(hash.value);
    highlightAndScroll(hash.value);
  };

  onMounted(() => {
    applyHash();
    window.addEventListener('hashchange', applyHash);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('hashchange', applyHash);
    if (highlightTimer) clearTimeout(highlightTimer);
  });

  return { hash };
}
