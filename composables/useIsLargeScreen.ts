import { onBeforeUnmount, onMounted, ref } from 'vue';

/** Reactively tracks whether the viewport matches a given media query.
 *  Defaults to Tailwind's xl breakpoint (1280px). */
export function useIsLargeScreen(breakpoint = '(min-width: 1280px)') {
  const isLargeScreen = ref(false);
  let mql: MediaQueryList | null = null;

  function update(e?: MediaQueryListEvent) {
    isLargeScreen.value = e?.matches ?? mql?.matches ?? false;
  }

  onMounted(() => {
    if (typeof window === 'undefined') return;
    mql = window.matchMedia(breakpoint);
    update();
    mql.addEventListener('change', update);
  });

  onBeforeUnmount(() => {
    mql?.removeEventListener('change', update);
    mql = null;
  });

  return { isLargeScreen };
}
