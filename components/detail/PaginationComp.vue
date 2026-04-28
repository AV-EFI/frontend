<template>
    <div
        ref="root"
        class="relative pagination px-2 flex justify-center w-full bg-white dark:bg-gray-800"
        role="navigation"
        :aria-label="$t('pagination')"
    >
        <ais-pagination
            v-show="!showPaginationSkeleton"
            :class-names="{
                'ais-Pagination': 'flex justify-center my-auto bg-white dark:bg-gray-800',
                'ais-Pagination-list': 'flex space-x-1 my-1',
                'ais-Pagination-item': 'btn btn-sm btn-circle btn-primary btn-outline hover:text-white text-center',
                'ais-Pagination-link': 'text-center vertical-align-middle text-[12px] dark:text-gray-200',
                'ais-Pagination-item--selected': 'btn btn-sm btn-circle btn-accent !text-white'
            }"
        />
        <div
            v-if="showPaginationSkeleton"
            class="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-800/70 z-50 pointer-events-auto"
            role="status"
            aria-live="polite"
        >
            <div class="flex items-center gap-2" aria-hidden="true">
                <span
                    v-for="n in 5"
                    :key="`pager-skel-${n}`"
                    class="h-8 w-8 rounded-full bg-base-300/80 dark:bg-gray-700/80 animate-pulse"
                />
            </div>
            <span class="sr-only">{{ $t('loading') }}</span>
        </div>
    </div>
</template>

<style scoped>
.ais-Pagination-item {
    position: relative;
}
.ais-Pagination-item .ais-Pagination-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    -webkit-user-select: none;
    user-select: none;
}
</style>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
    isSearchLoading: {
        type: Boolean,
        default: false,
    },
});

const root = ref<HTMLElement | null>(null);
const loading = ref(false);
const bootstrapSkeleton = ref(true);
const showPaginationSkeleton = computed(() => loading.value || bootstrapSkeleton.value);

let observer: MutationObserver | null = null;
let timeoutId: number | null = null;
let bootstrapTimer: number | null = null;

function clearLoading() {
    loading.value = false;
    if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
}

function setLoadingWithFallback() {
    loading.value = true;
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
        loading.value = false;
        timeoutId = null;
    }, 3000);
}

function handleDelegatedClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!root.value) return;

    // If the user clicked (or tapped) directly on a pagination link/button, set loading and let it proceed
    const directLink = target.closest && (target.closest('.ais-Pagination-link, a, button') as HTMLElement | null);
    if (directLink) {
        const itemFromLink = directLink.closest ? (directLink.closest('.ais-Pagination-item') as HTMLElement | null) : null;
        if (itemFromLink && (itemFromLink.classList.contains('ais-Pagination-item--disabled') || itemFromLink.getAttribute('aria-disabled') === 'true')) return;
        setLoadingWithFallback();
        return;
    }

    const item = target.closest ? (target.closest('.ais-Pagination-item') as HTMLElement | null) : null;
    if (!item) return;

    // don't trigger for disabled items
    if (item.classList.contains('ais-Pagination-item--disabled') || item.getAttribute('aria-disabled') === 'true') return;

    // find a link or button inside the item to trigger
    const link = item.querySelector('.ais-Pagination-link, a, button') as HTMLElement | null;
    if (!link) return;

    // Mark loading so users don't click multiple times
    setLoadingWithFallback();

    // programmatically trigger click when the click missed the inner control (Firefox hit-area issue)
    try {
        link.click();
    } catch (err) {
        // fallback: dispatch MouseEvent
        const evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        link.dispatchEvent(evt);
    }
}

onMounted(() => {
    root.value?.addEventListener('click', handleDelegatedClick);

    // Observe DOM changes (pagination update) to clear loading when content changes
    if (root.value) {
        observer = new MutationObserver(() => {
            if (loading.value) clearLoading();
            if (bootstrapSkeleton.value) bootstrapSkeleton.value = false;
        });
        observer.observe(root.value, { childList: true, subtree: true });
    }

    // Fail-safe so skeleton cannot stay forever in edge cases with 1 page/no controls.
    bootstrapTimer = window.setTimeout(() => {
        bootstrapSkeleton.value = false;
        bootstrapTimer = null;
    }, 900);
});

watch(
    () => props.isSearchLoading,
    (value) => {
        if (value) {
            loading.value = true;
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            return;
        }

        clearLoading();
        if (bootstrapSkeleton.value) {
            bootstrapSkeleton.value = false;
        }
    },
    { immediate: true }
);

onBeforeUnmount(() => {
    root.value?.removeEventListener('click', handleDelegatedClick);
    if (observer) {
        observer.disconnect();
        observer = null;
    }
    if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
    if (bootstrapTimer !== null) {
        clearTimeout(bootstrapTimer);
        bootstrapTimer = null;
    }
});
</script>
