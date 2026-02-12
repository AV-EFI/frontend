<template>
    <div class="w-full">
        <div v-if="loading" class="flex justify-center items-center min-h-[300px]">
            <span class="loading loading-spinner loading-lg text-primary" />
        </div>
        <div v-else-if="error" class="alert alert-error">
            <Icon name="tabler:alert-circle" class="w-6 h-6" />
            <span>{{ error }}</span>
        </div>
        <div v-else-if="issuerItems.length > 0">
            <!-- Desktop/Large screens: original carousel -->
            <div
                class="carousel-container items-center relative hidden lg:flex bg:white/80 dark:bg-base-200/60 rounded-box p-4">
                <button :alt="$t('togglePreviousSlide')" :aria-label="$t('togglePreviousSlide')"
                    class="md:flex z-10 p-2 bg-neutral text-white rounded-full bg-opacity-50 w-10 h-10 items-center justify-center md:mr-4 dark:bg-gray-600 dark:text-gray-200 md:absolute md:top-1/2 md:transform md:-translate-y-1/2 md:left-[-3rem]"
                    @click="prevSlide">
                    <Icon name="tabler:chevron-left" />
                </button>
                <div class="overflow-hidden rounded-box w-full p-4">
                    <div class="relative w-full" style="min-height: 350px;">
                        <TransitionGroup name="slide">
                            <div v-for="(item, index) in issuerItems" v-show="currentIndex === index" :key="index"
                                class="absolute inset-0 flex justify-center items-center p-2">
                                <div class="card bg-base-100 shadow-md w-full max-w-sm">
                                    <figure class="px-6 py-6 bg-white rounded">
                                        <img :src="item.image" :alt="item.imageAlt" :title="item.name"
                                            class="h-20 w-auto object-contain bg-white" loading="lazy">
                                    </figure>
                                    <div class="card-body items-center text-center">
                                        <h3 class="card-title text-base font-semibold line-clamp-2">
                                            {{ item.name }}
                                        </h3>
                                        <p class="text-sm opacity-70">
                                            {{ item.doc_count.toLocaleString() }} {{ item.doc_count === 1 ?
                                            $t('dataset') : $t('datasets') }}
                                        </p>
                                        <div class="card-actions">
                                            <NuxtLink
                                                :to="`/search/?has_issuer_name%5B0%5D=${encodeURIComponent(item.name)}`"
                                                class="btn btn-primary btn-sm">
                                                {{ $t('viewDatasets') || 'View Datasets' }}
                                                <Icon class="text-white" name="tabler:arrow-right" />
                                            </NuxtLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TransitionGroup>
                    </div>
                </div>
                <button :alt="$t('toggleNextSlide')" :aria-label="$t('toggleNextSlide')"
                    class="z-10 md:flex p-2 bg-neutral text-white rounded-full bg-opacity-50 w-10 h-10 items-center justify-center md:ml-4 dark:bg-gray-600 dark:text-gray-200 md:absolute md:top-1/2 md:transform md:-translate-y-1/2 md:right-[-3rem]"
                    @click="nextSlide">
                    <Icon class="text-white" name="tabler:chevron-right" />
                </button>
            </div>

            <!-- Mobile/Small screens: horizontal scrollable cards -->
            <div class="w-full relative lg:hidden">
                <div ref="carouselRef"
                    class="carousel carousel-center w-full bg-white/40 dark:bg-base-200/60 rounded-box p-4 overflow-x-auto scroll-smooth flex">
                    <div v-for="(item, index) in issuerItems" :key="index"
                        class="carousel-item align-top flex flex-col items-center mx-2 w-[85vw] sm:w-72 md:w-80 lg:w-96">
                        <figure class="w-full">
                            <div
                                class="relative w-full h-48 md:h-56 lg:h-64 rounded overflow-hidden bg-white/80 dark:bg-white flex items-center justify-center">
                                <img :src="item.image" :alt="item.imageAlt" :title="item.name" loading="lazy"
                                    decoding="async" class="max-w-full max-h-full object-contain z-10">
                            </div>
                        </figure>
                        <div class="p-4 flex flex-col flex-1 w-full bg-white dark:bg-base-200">
                            <h2 class="card-title text-base font-semibold mb-2 text-gray-900 dark:text-gray-200">
                                {{ item.name }}
                            </h2>
                            <p class="text-gray-700 text-sm mb-2 dark:text-gray-300 md:!line-clamp-none">
                                {{ item.doc_count.toLocaleString() }} {{ item.doc_count === 1 ? $t('dataset') :
                                $t('datasets') }}
                            </p>
                            <div class="mt-auto">
                                <NuxtLink :to="`/search/?has_issuer_name%5B0%5D=${encodeURIComponent(item.name)}`"
                                    class="btn btn-sm w-full md:w-auto btn-primary">
                                    {{ $t('viewDatasets') || 'View Datasets' }}
                                    <Icon class="hidden md:inline-block ml-1" name="tabler:arrow-right" />
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Mobile arrows -->
                <button v-if="issuerItems.length > 1" @click="prevMobileSlide"
                    class="absolute -left-6 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral dark:bg-base-100 shadow flex"
                    :aria-label="$t('togglePreviousSlide')">
                    <Icon class="text-white" name="tabler:chevron-left" />
                </button>
                <button v-if="issuerItems.length > 1" @click="nextMobileSlide"
                    class="absolute -right-6 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral dark:bg-base-100 shadow flex"
                    :aria-label="$t('toggleNextSlide')">
                    <Icon class="text-white" name="tabler:chevron-right" />
                </button>
            </div>
        </div>
        <div v-else class="text-center text-base-content/60 py-8">
            {{ $t('noIssuersFound') || 'No issuers found' }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
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
let autoSlideTimer: any = null;

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
    currentIndex.value = (currentIndex.value - 1 + issuerItems.value.length) % issuerItems.value.length;
    resetAutoSlide();
};

const nextSlide = () => {
    currentIndex.value = (currentIndex.value + 1) % issuerItems.value.length;
    resetAutoSlide();
};

const startAutoSlide = () => {
    autoSlideTimer = setInterval(() => {
        currentIndex.value = (currentIndex.value + 1) % issuerItems.value.length;
    }, 6000);
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

// Mobile scroll logic
const carouselRef = ref<HTMLElement | null>(null);
const scrollAmount = 320; // px, adjust to match card width
const prevMobileSlide = () => {
    if (carouselRef.value) {
        carouselRef.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
};
const nextMobileSlide = () => {
    if (carouselRef.value) {
        carouselRef.value.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
};

onMounted(() => {
    startAutoSlide();
});

onBeforeUnmount(() => {
    stopAutoSlide();
});
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: all 0.5s ease;
}

.slide-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.slide-leave-to {
    opacity: 0;
    transform: translateX(-100%);
}
</style>
