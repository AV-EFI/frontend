<template>
    <div ref="rootRef" class="relative w-full">
        <div v-if="loading" class="flex justify-center items-center min-h-75">
            <span class="loading loading-spinner loading-lg text-primary" />
        </div>
        <div v-else-if="error" class="alert alert-error">
            <Icon name="tabler:alert-circle" class="w-6 h-6" />
            <span>{{ error }}</span>
        </div>
        <div v-else-if="issuerItems.length > 0">
            <button v-if="issuerItems.length > 1 && isReady" @click="prevSlide"
                    class="absolute -left-10 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow hidden sm:flex w-10 h-10"
                    :aria-label="$t('home.carousel.aria.previous')">
                <Icon name="tabler:chevron-left" />
            </button>
            <div ref="viewportRef" class="w-full mx-auto rounded-box px-4 py-4 sm:px-4 lg:px-6 py-0 sm:py-4 bg-base-200 overflow-hidden">
                <div ref="containerRef" class="flex items-stretch touch-pan-y">
                    <div v-for="(item, index) in issuerItems" :key="index"
                         :inert="isReady && !visibleSlideIndexes.has(index)"
                         :aria-hidden="isReady && !visibleSlideIndexes.has(index) ? 'true' : undefined"
                         class="min-w-0 shrink-0 self-stretch basis-full sm:basis-72 md:basis-96 mr-4 rounded-lg flex flex-col items-stretch lg:basis-[calc(50%-24px)] lg:p-2 bg-white dark:bg-base-200">
                        <figure class="w-full flex-col p-1 md:p-2 rounded-lg">
                            <div class="relative w-full h-20 py-2 overflow-hidden bg-white flex items-center justify-center rounded-lg">
                                <img :src="item.image" :alt="item.imageAlt" :title="item.name" loading="lazy" decoding="async"
                                     class="h-full w-auto max-w-full object-contain" />
                            </div>
                        </figure>
                        <div class="p-4 flex flex-col flex-1 w-full min-h-56 bg-white dark:bg-base-100 rounded-lg">
                            <h2 class="card-title min-h-[4.75rem] items-start text-base leading-snug font-semibold mb-2 dark:bg-base-200 text-gray-900 dark:text-gray-100 px-2">
                                {{ item.name }}
                            </h2>
                            <div class="stats stats-horizontal w-full min-h-14 shadow-none bg-base-200/60 mb-3">
                                <div class="stat px-2 py-1 min-w-0">
                                    <div class="stat-title text-[10px] leading-tight">{{ $t('works') }}</div>
                                    <div class="stat-value text-sm leading-tight">
                                        {{ getIssuerCategoryCount(item, 'avefi:WorkVariant').toLocaleString() }}
                                    </div>
                                </div>
                                <div class="stat px-2 py-1 min-w-0">
                                    <div class="stat-title text-[10px] leading-tight">{{ $t('manifestations') }}</div>
                                    <div class="stat-value text-sm leading-tight">
                                        {{ getIssuerCategoryCount(item, 'avefi:Manifestation').toLocaleString() }}
                                    </div>
                                </div>
                                <div class="stat px-2 py-1 min-w-0">
                                    <div class="stat-title text-[10px] leading-tight">{{ $t('items') }}</div>
                                    <div class="stat-value text-sm leading-tight">
                                        {{ getIssuerCategoryCount(item, 'avefi:Item').toLocaleString() }}
                                    </div>
                                </div>
                            </div>
                            <div class="mt-auto">
                                <NuxtLink :to="`/search/?has_issuer_name%5B0%5D=${encodeURIComponent(item.name)}`"
                                          class="btn btn-sm w-full md:w-auto btn-primary">
                                    <span class="text-xs md:text-regular">
                                        {{ $t('home.carousel.actions.viewDatasets') }}
                                    </span>
                                    <Icon class="hidden md:inline-block ml-1" name="tabler:arrow-right" />
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button v-if="issuerItems.length > 1 && isReady" @click="nextSlide"
                    class="absolute -right-10 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow hidden sm:flex w-10 h-10"
                    :aria-label="$t('home.carousel.aria.next')">
                <Icon name="tabler:chevron-right" />
            </button>

            <button v-if="issuerItems.length > 1 && isReady" @click="prevSlide"
                    class="absolute left-0 md:-left-4 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow flex sm:hidden"
                    :aria-label="$t('home.carousel.aria.previous')">
                <Icon name="tabler:chevron-left" />
            </button>
            <button v-if="issuerItems.length > 1 && isReady" @click="nextSlide"
                    class="absolute right-0 md:-right-4 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow flex sm:hidden"
                    :aria-label="$t('home.carousel.aria.next')">
                <Icon name="tabler:chevron-right" />
            </button>
        </div>
        <div v-else class="text-center text-base-content/70 py-8">
            {{ $t('home.carousel.actions.noIssuersFound') }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import rawIssuerImagesData from '~/data/issuer-images.json';

interface Issuer {
    name: string;
    id: string | null;
    doc_count: number;
    category_counts?: {
        'avefi:WorkVariant'?: number;
        'avefi:Manifestation'?: number;
        'avefi:Item'?: number;
    };
}

function getIssuerCategoryCount(
    issuer: Issuer,
    category: 'avefi:WorkVariant' | 'avefi:Manifestation' | 'avefi:Item'
): number {
    const fromCategoryCounts = issuer.category_counts?.[category];
    if (typeof fromCategoryCounts === 'number') {
        return fromCategoryCounts;
    }

    // Backward-compatible fallback for cached or legacy API responses
    // that only provide doc_count.
    if (category === 'avefi:Item') {
        return 0;
    }

    return typeof issuer.doc_count === 'number' ? issuer.doc_count : 0;
}

interface IssuerItem extends Issuer {
    image: string;
    imageAlt: string;
}

type EmblaApi = {
    scrollPrev: () => void;
    scrollNext: () => void;
    slidesInView: () => number[];
    on: (event: 'select' | 'reInit', cb: () => void) => void;
    off: (event: 'select' | 'reInit', cb: () => void) => void;
    destroy: () => void;
};

interface IssuerImageMapping {
    [key: string]: {
        image: string;
        alt: string;
    };
}

interface IssuerImagesData {
    mappings: IssuerImageMapping;
    fallback: {
        image: string;
        alt: string;
    };
}

const issuerImagesData = rawIssuerImagesData as IssuerImagesData;

const props = defineProps({
    autoSlideInterval: {
        type: Number,
        default: 7000
    }
});

const {
    data,
    pending,
    error: fetchError
} = await useAsyncData<{ issuers: Issuer[] }>(
    'top-issuers',
    () => $fetch('/api/top-issuers'),
    {
        default: () => ({ issuers: [] })
    }
);

const loading = computed(() => pending.value);
const error = computed(() => fetchError.value?.message || null);

const rootRef = ref<HTMLElement | null>(null);
const viewportRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const emblaApi = shallowRef<EmblaApi | null>(null);
const autoplayPlugin = shallowRef<{ stop?: () => void; play?: () => void } | null>(null);
const isReady = computed(() => !!emblaApi.value);
const visibleSlideIndexes = ref(new Set<number>());
const isAutoplayPaused = ref(false);
let visibilityObserver: IntersectionObserver | null = null;

const issuerItems = computed<IssuerItem[]>(() => {
    const issuers: Issuer[] = data.value?.issuers || [];
    const imageMap = issuerImagesData.mappings;
    const fallback = issuerImagesData.fallback;

    return issuers.map((issuer: Issuer) => {
        const imageInfo = issuer.id && imageMap[issuer.id] ? imageMap[issuer.id] : null;
        return {
            ...issuer,
            image: imageInfo?.image || fallback.image,
            imageAlt: imageInfo?.alt || `${issuer.name} ${t('press.assetTypes.logo')}`
        };
    });
});

const initEmbla = async () => {
    if (!viewportRef.value || emblaApi.value || issuerItems.value.length === 0) return;

    const [{ default: EmblaCarousel }, { default: Autoplay }] = await Promise.all([
        import('embla-carousel'),
        import('embla-carousel-autoplay')
    ]);

    const plugins: unknown[] = [];
    if (props.autoSlideInterval > 0 && issuerItems.value.length > 1) {
        const autoplay = Autoplay({
            delay: props.autoSlideInterval,
            stopOnInteraction: true,
            stopOnMouseEnter: true
        });
        autoplayPlugin.value = autoplay;
        plugins.push(autoplay);
    }

    emblaApi.value = EmblaCarousel(viewportRef.value, {
        align: 'center',
        containScroll: 'trimSnaps',
        loop: true,
        slidesToScroll: 2,
        breakpoints: {
            '(max-width: 1023px)': {
                slidesToScroll: 1
            }
        }
    }, plugins);

    emblaApi.value.on('select', updateVisibleSlides);
    emblaApi.value.on('reInit', updateVisibleSlides);
    updateVisibleSlides();
};

const prevSlide = () => {
    emblaApi.value?.scrollPrev();
};

const nextSlide = () => {
    emblaApi.value?.scrollNext();
};

const updateVisibleSlides = () => {
    const visible = emblaApi.value?.slidesInView() || [];
    visibleSlideIndexes.value = new Set(visible);
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
        emblaApi.value.off('select', updateVisibleSlides);
        emblaApi.value.off('reInit', updateVisibleSlides);
        emblaApi.value.destroy();
        emblaApi.value = null;
    }

    //autoplayPlugin.value?.stop?.();
    //autoplayPlugin.value = null;
    //isAutoplayPaused.value = false;
});
</script>
