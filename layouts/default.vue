<template>
    <div class="flex flex-col min-h-screen">
        <header
            :class="{ scrolled: isScrolled }"
            class="fixed top-0 left-0 z-30 border-0 w-full lg:w-90vw"
            @mouseenter="removeScrolledClass"
            @mouseleave="addScrolledClass"
        >
            <GlobalMaintenanceBanner />
            <GlobalNavBar />
        </header>

        <div class="shrink-0" :style="headerSpacerStyle" aria-hidden="true"></div>

        <main class="main grow 2xl:px-6">
            <slot />
            <component :is="GlobalComparisonDrawerAsync" v-if="hydrated && comparisonDrawerReady" />
            <component :is="GlobalContactDrawerAsync" v-if="hydrated && contactDrawerReady" />
        </main>

        <footer class="dark:bg-gray-900">
            <GlobalFooter />
        </footer>

        <button
            v-if="hydrated && showScrollToTop"
            class="fixed z-20 bottom-20 right-5 p-2 bg-neutral border-2 border-white dark:bg-secondary-600 h-10.5 w-10.5 text-white rounded-full"
            :title="$t('scrollToTop')"
            @click="scrollToTop"
        >
            <Icon name="tabler:chevron-up" class="text-lg" />
        </button>
    </div>
</template>

<script>
import { computed, defineAsyncComponent } from 'vue';
import GlobalFooter from '~/components/global/Footer.vue';
import GlobalMaintenanceBanner from '~/components/global/MaintenanceBanner.vue';
import { useMaintenanceBanner } from '~/composables/useMaintenanceBanner';
import { useObjectListStore } from '~/stores/compareList';

const GlobalComparisonDrawerAsync = defineAsyncComponent(() => import('~/components/global/ComparisonDrawer.vue'));
const GlobalContactDrawerAsync = defineAsyncComponent(() => import('~/components/global/ContactDrawer.vue'));

export default {
    components: {
        GlobalFooter,
        GlobalMaintenanceBanner,
    },
    setup() {
        const { visible: maintenanceBannerVisible } = useMaintenanceBanner();
        const objectListStore = useObjectListStore();

        const headerSpacerStyle = computed(() => ({
            height: maintenanceBannerVisible.value
                ? 'calc(var(--header-height) + var(--maintenance-banner-height))'
                : 'var(--header-height)',
        }));

        return {
            GlobalComparisonDrawerAsync,
            GlobalContactDrawerAsync,
            headerSpacerStyle,
            objectListStore,
        };
    },
    data() {
        return {
            hydrated: false,
            comparisonDrawerReady: false,
            contactDrawerReady: false,
            isScrolled: false,
            showScrollToTop: false,
            pageTallEnough: false,
            scrollRafId: null,
            resizeObserver: null,
        };
    },
    mounted() {
        this.hydrated = true;
        this.comparisonDrawerReady = this.objectListStore.comparisonDrawerOpen;
        if (typeof window === 'undefined') return;
        window.addEventListener('scroll', this.scheduleScrollUpdate, { passive: true });
        window.addEventListener('toggle-contact-drawer', this.prepareContactDrawer, true);
        window.addEventListener('open-contact-drawer', this.prepareContactDrawer, true);
        window.addEventListener('open-contact-form', this.prepareContactDrawer, true);
        this.observePageSize();
        this.updatePageTallEnough();
        this.applyScrollState();
    },
    beforeUnmount() {
        if (typeof window === 'undefined') return;
        window.removeEventListener('scroll', this.scheduleScrollUpdate);
        if (this.scrollRafId) {
            cancelAnimationFrame(this.scrollRafId);
            this.scrollRafId = null;
        }
        if (this.resizeObserver?.disconnect) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        } else {
            window.removeEventListener('resize', this.updatePageTallEnough);
        }
        window.removeEventListener('toggle-contact-drawer', this.prepareContactDrawer, true);
        window.removeEventListener('open-contact-drawer', this.prepareContactDrawer, true);
        window.removeEventListener('open-contact-form', this.prepareContactDrawer, true);
    },
    watch: {
        'objectListStore.comparisonDrawerOpen'(isOpen) {
            if (isOpen) {
                this.comparisonDrawerReady = true;
            }
        }
    },
    methods: {
        prepareContactDrawer(event) {
            if (this.contactDrawerReady || event.__avefiReplayedContactEvent) return;

            event.stopImmediatePropagation();
            this.contactDrawerReady = true;

            const replayedEvent = event instanceof CustomEvent
                ? new CustomEvent(event.type, { detail: event.detail })
                : new Event(event.type);

            Object.defineProperty(replayedEvent, '__avefiReplayedContactEvent', { value: true });
            this.$nextTick(() => {
                window.dispatchEvent(replayedEvent);
            });
        },
        scheduleScrollUpdate() {
            if (this.scrollRafId !== null) return;
            this.scrollRafId = requestAnimationFrame(() => {
                this.scrollRafId = null;
                this.applyScrollState();
            });
        },
        applyScrollState() {
            if (typeof window === 'undefined') return;
            const scrolled = window.scrollY > 50;
            this.isScrolled = scrolled;
            this.showScrollToTop = scrolled && this.pageTallEnough;
        },
        scrollToTop() {
            if (typeof window === 'undefined') return;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        updatePageTallEnough() {
            if (typeof document === 'undefined' || typeof window === 'undefined') return;
            const doc = document.documentElement;
            const pageHeight = doc?.scrollHeight || 0;
            this.pageTallEnough = pageHeight > window.innerHeight * 3;
            this.showScrollToTop = this.isScrolled && this.pageTallEnough;
        },
        observePageSize() {
            if (typeof window === 'undefined' || typeof document === 'undefined') return;
            if ('ResizeObserver' in window) {
                this.resizeObserver = new ResizeObserver(() => {
                    if ('requestIdleCallback' in window) {
                        window.requestIdleCallback(() => this.updatePageTallEnough(), { timeout: 150 });
                    } else {
                        requestAnimationFrame(() => this.updatePageTallEnough());
                    }
                });
                const target = document.body || document.documentElement;
                if (target) this.resizeObserver.observe(target);
            } else {
                window.addEventListener('resize', this.updatePageTallEnough, { passive: true });
            }
        },
        removeScrolledClass() {
            this.isScrolled = false;
        },
        addScrolledClass() {
            if (typeof window === 'undefined') return;
            this.isScrolled = window.scrollY > 50;
        }
    }
};
</script>
