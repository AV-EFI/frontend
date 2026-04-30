
<template>
    <div ref="rootRef" class="relative w-full">
        <button v-if="partnersItems.length > 1 && isReady" @click="prevSlide"
                class="absolute -left-10 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow hidden sm:flex w-10 h-10"
                :aria-label="$t('home.carousel.aria.previous')">
            <Icon name="tabler:chevron-left" />
        </button>
        <button v-if="partnersItems.length > 1 && isReady && props.autoSlideInterval > 0"
                type="button"
                class="absolute right-2 top-2 z-20 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow w-10 h-10"
                :aria-label="$t(isAutoplayPaused ? 'home.carousel.aria.play' : 'home.carousel.aria.pause')"
                :aria-pressed="isAutoplayPaused"
                @click="toggleAutoplay">
            <Icon :name="isAutoplayPaused ? 'tabler:player-play' : 'tabler:player-pause'" aria-hidden="true" />
        </button>

        <div ref="viewportRef" class="w-full mx-auto rounded-box px-6 py-4 sm:px-4 lg:px-4 sm:py-4 bg-base-200 overflow-hidden">
            <div ref="containerRef" class="flex touch-pan-y">
                <div
                    v-for="(item, index) in partnersItems"
                    :key="index"
                    :inert="isReady && !visibleSlideIndexes.has(index)"
                    :aria-hidden="isReady && !visibleSlideIndexes.has(index) ? 'true' : undefined"
                    class="min-w-0 shrink-0 basis-full sm:basis-72 md:basis-96 lg:basis-[calc(50%-0.5rem)] mr-4 rounded-lg align-top flex flex-col items-center bg-white dark:bg-base-200 lg:p-2"
                >
                    <figure class="w-full flex-col p-1 md:p-2 rounded-lg">
                        <div
                            v-if="item.src"
                            class="relative w-full h-20 py-2 rounded-lg overflow-hidden bg-white flex items-center justify-center"
                        >
                            <img
                                :src="item.src"
                                :alt="item.alt || item.title || ''"
                                :width="item.width || DEFAULT_LOGO_WIDTH"
                                :height="item.height || DEFAULT_LOGO_HEIGHT"
                                class="h-full w-auto max-w-full object-contain"
                                loading="lazy"
                                decoding="async"
                            >
                        </div>
                        <div
                            v-else
                            class="w-full h-20 flex items-center justify-center bg-gray-100 dark:bg-base-200 rounded-lg overflow-hidden"
                        >
                            <img src="/img/avefi_placeholder.webp" alt="AVefi" class="object-cover w-full h-full" loading="lazy" decoding="async">
                        </div>
                    </figure>

                    <div class="p-4 flex flex-col flex-1 w-full bg-white dark:bg-base-100 rounded-lg">
                        <h3 class="card-title text-base font-semibold mb-2 text-gray-900 dark:text-gray-200">
                            {{ item.alt || item.title || '' }}
                        </h3>
                        <p v-if="item.description" class="text-gray-700 text-sm mb-2 dark:text-gray-300 md:line-clamp-none">
                            {{ item.description }}
                        </p>
                        <div class="mt-auto">
                            <NuxtLink
                                v-if="item.link"
                                :to="item.link"
                                target="_blank"
                                rel="noopener"
                                class="link w-full md:w-auto"
                            >
                                {{ item.linkText || $t('home.carousel.actions.viewHomepage') }}
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <button v-if="partnersItems.length > 1 && isReady" @click="nextSlide"
                class="absolute -right-10 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow hidden sm:flex w-10 h-10"
                :aria-label="$t('home.carousel.aria.next')">
            <Icon name="tabler:chevron-right" />
        </button>

        <button v-if="partnersItems.length > 1 && isReady" @click="prevSlide"
                class="absolute left-0 md:-left-4 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow flex sm:hidden"
                :aria-label="$t('home.carousel.aria.previous')">
            <Icon name="tabler:chevron-left" />
        </button>
        <button v-if="partnersItems.length > 1 && isReady" @click="nextSlide"
                class="absolute right-0 md:-right-4 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow flex sm:hidden"
                :aria-label="$t('home.carousel.aria.next')">
            <Icon name="tabler:chevron-right" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';

type EmblaApi = {
    canScrollPrev: () => boolean;
    canScrollNext: () => boolean;
    loop: () => boolean;    
    scrollPrev: () => void;
    scrollNext: () => void;
    slidesInView: () => number[];
    on: (event: 'select' | 'reInit', cb: () => void) => void;
    off: (event: 'select' | 'reInit', cb: () => void) => void;
    destroy: () => void;
};

const partnersItems = ref([
    {
        src: '/img/logo_tib.webp',
        width: 85,
        height: 80,
        alt: 'Technische Informationsbibliothek Hannover',
        link: 'https://www.tib.eu'
    },
    {
        src: '/img/logo_sdk.webp',
        width: 50,
        height: 80,
        alt: 'Stiftung Deutsche Kinemathek',
        link: 'https://www.deutsche-kinemathek.de'
    },
    {
        src: '/img/logo_fmd.webp',
        width: 199,
        height: 80,
        alt: 'Filmmuseum Düsseldorf',
        link: 'https://www.duesseldorf.de/filmmuseum'
    },
    {
        src: '/img/gwdg_logo.min.svg',
        width: 176.871,
        height: 52.384,
        alt: 'Gesellschaft für wissenschaftliche Datenverarbeitung Göttingen',
        link: 'https://www.gwdg.de'
    },
    {
        src: '/img/logo_mcdci.webp',
        width: 80,
        height: 80,
        alt: 'Marburg Center for Digital Culture and Infrastructure',
        link: 'https://www.uni-marburg.de/de/mcdci'
    }
]);

const props = defineProps({
    autoSlideInterval: {
        type: Number,
        default: 7000
    }
});

const DEFAULT_LOGO_WIDTH = 320;
const DEFAULT_LOGO_HEIGHT = 80;

const rootRef = ref<HTMLElement | null>(null);
const viewportRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const emblaApi = shallowRef<EmblaApi | null>(null);
const autoplayPlugin = shallowRef<{ stop?: () => void; play?: () => void } | null>(null);
const isReady = computed(() => !!emblaApi.value);
const visibleSlideIndexes = ref(new Set<number>());
const isAutoplayPaused = ref(false);

let visibilityObserver: IntersectionObserver | null = null;

const updateNavState = () => {
    emblaApi.value?.canScrollPrev();
    emblaApi.value?.canScrollNext();
    updateVisibleSlides();
};

const updateVisibleSlides = () => {
    const visible = emblaApi.value?.slidesInView() || [];
    visibleSlideIndexes.value = new Set(visible);
};

const initEmbla = async () => {
    if (!viewportRef.value || emblaApi.value) return;

    const [{ default: EmblaCarousel }, { default: Autoplay }] = await Promise.all([
        import('embla-carousel'),
        import('embla-carousel-autoplay')
    ]);

    const plugins: unknown[] = [];
    if (props.autoSlideInterval > 0) {
        const autoplay = Autoplay({
            delay: props.autoSlideInterval,
            stopOnInteraction: true,
            stopOnMouseEnter: true
        });
        autoplayPlugin.value = autoplay;
        plugins.push(autoplay);
    }

    emblaApi.value = EmblaCarousel(viewportRef.value, {
        align: 'start',
        containScroll: 'trimSnaps',
        loop: true,
        slidesToScroll: 2,
        breakpoints: {
            '(max-width: 1023px)': {
                slidesToScroll: 1
            }
        }
    }, plugins);

    emblaApi.value.on('select', updateNavState);
    emblaApi.value.on('reInit', updateNavState);
    updateNavState();
};

const prevSlide = () => {
    emblaApi.value?.scrollPrev();
};

const nextSlide = () => {
    emblaApi.value?.scrollNext();
};

const toggleAutoplay = () => {
    if (isAutoplayPaused.value) {
        autoplayPlugin.value?.play?.();
        isAutoplayPaused.value = false;
        return;
    }

    autoplayPlugin.value?.stop?.();
    isAutoplayPaused.value = true;
};

onMounted(() => {
    if (!rootRef.value) return;

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
        visibilityObserver = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (!entry?.isIntersecting) return;
            initEmbla();
            visibilityObserver?.disconnect();
            visibilityObserver = null;
        }, { rootMargin: '200px 0px' });

        visibilityObserver.observe(rootRef.value);
        return;
    }

    initEmbla();
});

onBeforeUnmount(() => {
    visibilityObserver?.disconnect();
    visibilityObserver = null;

    if (emblaApi.value) {
        emblaApi.value.off('select', updateNavState);
        emblaApi.value.off('reInit', updateNavState);
        emblaApi.value.destroy();
        emblaApi.value = null;
    }

    autoplayPlugin.value?.stop?.();
    autoplayPlugin.value = null;
    isAutoplayPaused.value = false;
});
</script>

<style scoped>
.embla__viewport {
    overflow: hidden;
}
</style>
