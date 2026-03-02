<template>
<div class="relative w-full">
    <div v-if="loading" class="flex justify-center items-center min-h-75">
        <span class="loading loading-spinner loading-lg text-primary" />
    </div>
    <div v-else-if="error" class="alert alert-error">
        <Icon name="tabler:alert-circle" class="w-6 h-6" />
        <span>{{ error }}</span>
    </div>
    <div v-else-if="issuerItems.length > 0">
        <!-- Desktop arrows -->
        <button v-if="issuerItems.length > 1" @click="prevSlide"
            class="absolute -left-4 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow hidden sm:flex w-10 h-10"
            :aria-label="$t('home.carousel.aria.previous')">
            <Icon name="tabler:chevron-left" />
        </button>
        <div ref="carouselRef"
            class="carousel carousel-center w-full mx-auto rounded-box px-0 sm:p-4 overflow-x-auto scroll-smooth snap-none bg-base-200">
            <div v-for="(item, index) in issuerItems" :key="index"
                class="carousel-item w-[calc(100%-64px)] shrink-0 mx-8 sm:mx-2 sm:w-72! md:w-96! rounded-lg align-top flex flex-col items-center lg:p-2 bg-white dark:bg-gray-800">
                <figure class="w-full flex-col p-1 md:p-2 rounded-lg">
                    <div class="relative w-full h-20 py-2 overflow-hidden bg-white dark:bg-base-200 flex items-center justify-center rounded-lg">
                        <img :src="`${item.image}`" :alt="item.imageAlt" :title="item.name" loading="lazy" decoding="async"
                            class="h-full w-auto max-w-full object-contain" />
                    </div>
                </figure>
                <div class="p-4 flex flex-col flex-1 w-full bg-white dark:bg-base-200">
                    <h2 class="card-title text-base font-semibold mb-2 text-gray-900 dark:text-gray-200">
                        {{ item.name }}
                    </h2>
                    <p class="text-gray-700 text-sm mb-2 dark:text-gray-300 md:line-clamp-none!">
                        {{ item.doc_count.toLocaleString() }} {{ item.doc_count === 1 ? $t('home.common.dataset') : $t('home.common.datasets') }}
                    </p>
                    <div class="mt-auto">
                        <NuxtLink :to="`/search/?has_issuer_name%5B0%5D=${encodeURIComponent(item.name)}`"
                            class="btn btn-sm w-full md:w-auto btn-primary">
                            <span class="text-xs md:text-regular">
                                {{ $t('home.carousel.actions.viewDatasets') || 'View Datasets' }}
                            </span>
                            <Icon class="hidden md:inline-block ml-1" name="tabler:arrow-right" />
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
        <!-- Desktop arrows -->
        <button v-if="issuerItems.length > 1" @click="nextSlide"
            class="absolute -right-4 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow hidden sm:flex w-10 h-10"
            :aria-label="$t('home.carousel.aria.next')">
            <Icon name="tabler:chevron-right" />
        </button>
        <!-- Mobile arrows -->
        <button v-if="issuerItems.length > 1" @click="prevSlide"
            class="absolute left-0 md:-left-4 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow flex sm:hidden"
            :aria-label="$t('home.carousel.aria.previous')">
            <Icon name="tabler:chevron-left" />
        </button>
        <button v-if="issuerItems.length > 1" @click="nextSlide"
            class="absolute right-0 md:-right-4 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow flex sm:hidden"
            :aria-label="$t('home.carousel.aria.next')">
            <Icon name="tabler:chevron-right" />
        </button>
    </div>
    <div v-else class="text-center text-base-content/60 py-8">
        {{ $t('home.carousel.actions.noIssuersFound') || 'No issuers found' }}
    </div>
</div>
</template>

<script setup lang="ts">

import topIssuersData from '~/data/top-issuers.json';
import issuerImagesData from '~/data/issuer-images.json';

interface Issuer {
    name: string;
    id: string | null;
    doc_count: number;
}

interface IssuerItem extends Issuer {
    image: string;
    imageAlt: string;
}

const loading = ref(false);
const error = ref<string | null>(null);
const currentIndex = ref(0);
let autoSlideTimer: ReturnType<typeof setInterval> | null = null;
const carouselRef = ref<HTMLElement | null>(null);

const issuerItems = computed<IssuerItem[]>(() => {
    const issuers: Issuer[] = topIssuersData.issuers || [];
    const imageMap = issuerImagesData.mappings;
    const fallback = issuerImagesData.fallback;

    return issuers.map((issuer: Issuer) => {
        const imageInfo = issuer.id && imageMap[issuer.id] ? imageMap[issuer.id] : null;
        return {
            ...issuer,
            image: imageInfo?.image || fallback.image,
            imageAlt: imageInfo?.alt || `${issuer.name} Logo`
        };
    });
});

const prevSlide = () => {
    if (!issuerItems.value.length) return;
    currentIndex.value = (currentIndex.value - 1 + issuerItems.value.length) % issuerItems.value.length;
    resetAutoSlide();
};

const nextSlide = () => {
    if (!issuerItems.value.length) return;
    currentIndex.value = (currentIndex.value + 1) % issuerItems.value.length;
    resetAutoSlide();
};

const startAutoSlide = () => {
    stopAutoSlide();
    if (issuerItems.value.length <= 1) {
        return;
    }
    autoSlideTimer = setInterval(() => {
        currentIndex.value = (currentIndex.value + 1) % issuerItems.value.length;
        scrollToIndex();
    }, 7000);
};

const stopAutoSlide = () => {
    if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
    }
};

const resetAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
};

const getSlides = () => {
    const host = carouselRef.value;
    if (!host) return [] as HTMLElement[];
    return Array.from(host.querySelectorAll<HTMLElement>('.carousel-item'));
};

const getCenteredOffset = (slide: HTMLElement) => {
    const host = carouselRef.value;
    if (!host || !slide) return 0;
    const raw = slide.offsetLeft + (slide.offsetWidth / 2) - (host.clientWidth / 2);
    const max = Math.max(0, host.scrollWidth - host.clientWidth);
    return Math.min(Math.max(raw, 0), max);
};

const scrollToIndex = (behavior: ScrollBehavior = 'smooth') => {
    const carousel = carouselRef.value;
    if (!carousel) return;
    const items = getSlides();
    if (!items.length) return;
    const index = ((currentIndex.value % items.length) + items.length) % items.length;
    const target = items[index];
    if (!target) return;
    carousel.scrollTo({ left: getCenteredOffset(target), behavior });
};

const handleScroll = () => {
    const host = carouselRef.value;
    if (!host) return;
    const slides = getSlides();
    if (!slides.length) return;

    const viewportCenter = host.scrollLeft + (host.clientWidth / 2);
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
        const slideCenter = slide.offsetLeft + (slide.offsetWidth / 2);
        const distance = Math.abs(slideCenter - viewportCenter);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });

    currentIndex.value = closestIndex;
};

onMounted(() => {
    startAutoSlide();
    nextTick(() => {
        scrollToIndex('auto');
        carouselRef.value?.addEventListener('scroll', handleScroll, { passive: true });
    });
});

onBeforeUnmount(() => {
    stopAutoSlide();
    carouselRef.value?.removeEventListener('scroll', handleScroll);
});

watch(currentIndex, () => {
    scrollToIndex();
});

watch(issuerItems, async () => {
    currentIndex.value = 0;
    await nextTick();
    scrollToIndex('auto');
    startAutoSlide();
});
</script>

<style scoped>
.carousel {
    scroll-snap-type: x mandatory;
}

.carousel::-webkit-scrollbar {
    display: none;
}

.carousel-item {
    scroll-snap-align: center;
}

@media (prefers-reduced-motion: reduce) {
    .carousel {
        scroll-behavior: auto;
    }
}
</style>
