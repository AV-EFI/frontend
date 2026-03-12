import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import type { Ref } from 'vue';

type DeferredVisibilityOptions = IntersectionObserverInit;

export function useDeferredVisibility(
  options: DeferredVisibilityOptions = { rootMargin: '200px 0px' }
) {
  const target = ref<HTMLElement | null>(null);
  const isReady = ref(false);

  let stop: (() => void) | undefined;

  onMounted(() => {
    const observer = useIntersectionObserver(
            target as Ref<HTMLElement | null>,
            ([entry]) => {
              if (entry?.isIntersecting) {
                isReady.value = true;
                stop?.();
              }
            },
            options
    );

    stop = observer.stop;
  });

  onBeforeUnmount(() => {
    stop?.();
  });

  return {
    target,
    isReady,
  };
}