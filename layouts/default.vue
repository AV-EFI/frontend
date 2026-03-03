<template>
    <div class="flex flex-col min-h-screen">
        <header :class="{'scrolled': isScrolled}" class="fixed top-0 left-0 z-30 border-0 w-full lg:w-90vw"
                @mouseenter="removeScrolledClass" @mouseleave="addScrolledClass">
            <GlobalNavBar />
        </header>
        <div class="h-[var(--header-height)] flex-shrink-0" aria-hidden="true"></div>
        <main class="main grow bg-base-100 2xl:px-6">
            <ClientOnly>
                <!--GlobalIndicatorComp /-->
            </ClientOnly>
            <slot />
            <ClientOnly>
                <LazyGlobalComparisonDrawer />
            </ClientOnly>
        </main>
        <footer class="dark:bg-gray-800">
            <LazyGlobalFooter />
        </footer>
        <button v-if="showScrollToTop"
                class="fixed z-20 bottom-20 right-[20px] p-2 bg-neutral border-2 border-white dark:bg-secondary-600 h-[42px] w-[42px] text-white rounded-full"
                :title="$t('scrollToTop')" @click="scrollToTop">
            <Icon name="tabler:chevron-up" class="text-lg" />
        </button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isScrolled: false,
            showScrollToTop: false,
            pageTallEnough: false,
            scrollRafId: null,
            resizeObserver: null,
        };
    },
    mounted() {
        if (typeof window === 'undefined') return;
        window.addEventListener('scroll', this.scheduleScrollUpdate, { passive: true });
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
    },
    methods: {
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
                target && this.resizeObserver.observe(target);
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
