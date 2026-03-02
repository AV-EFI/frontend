import { ref } from 'vue';
import type { Ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';

type DeferredVisibilityOptions = IntersectionObserverInit;

export function useDeferredVisibility(options: DeferredVisibilityOptions = { rootMargin: '200px 0px' }) {
    const target = ref<HTMLElement | null>(null);
    const isReady = ref(false);

    if (import.meta.client) {
        const { stop } = useIntersectionObserver(
            target as Ref<HTMLElement | null>,
            ([entry]) => {
                if (entry?.isIntersecting) {
                    isReady.value = true;
                    stop();
                }
            },
            options
        );
    }

    return {
        target,
        isReady,
    };
}
