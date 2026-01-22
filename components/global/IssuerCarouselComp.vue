<template>
    <div class="w-full">
        <div v-if="loading" class="flex justify-center items-center min-h-[300px]">
            <span class="loading loading-spinner loading-lg text-primary" />
        </div>
        <div v-else-if="error" class="alert alert-error">
            <Icon name="tabler:alert-circle" class="w-6 h-6" />
            <span>{{ error }}</span>
        </div>
        <div v-else-if="issuerItems.length > 0" class="carousel-container flex items-center relative">
            <button :alt="$t('togglePreviousSlide')" :aria-label="$t('togglePreviousSlide')"
                class="md:flex z-10 p-2 md:bg-gray-800 md:text-white text-black rounded-full bg-opacity-50 w-10 h-10 items-center justify-center md:mr-4 dark:bg-gray-600 dark:text-gray-200 md:absolute md:top-1/2 md:transform md:-translate-y-1/2 md:left-[-3rem]"
                @click="prevSlide">
                <Icon name="tabler:chevron-left" />
            </button>

            <div class="overflow-hidden rounded-box w-full p-4">
                <div class="relative w-full" style="min-height: 350px;">
                    <TransitionGroup name="slide">
                        <div v-for="(item, index) in issuerItems" v-show="currentIndex === index" :key="index"
                            class="absolute inset-0 flex justify-center items-center p-2">
                            <div class="card bg-base-100 shadow-md w-full max-w-sm">
                                <figure class=" px-6 py-6 bg-white rounded">
                                    <img :src="item.image" :alt="item.imageAlt" :title="item.name"
                                        class="h-20 w-auto object-contain bg-white" loading="lazy">
                                </figure>
                                <div class="card-body items-center text-center">
                                    <h4 class="card-title text-base font-semibold line-clamp-2">
                                        {{ item.name }}
                                    </h4>
                                    <p class="text-sm opacity-70">
                                        {{ item.doc_count.toLocaleString() }} {{ item.doc_count === 1 ? $t('dataset') :
                                        $t('datasets') }}
                                    </p>
                                    <div class="card-actions">
                                        <NuxtLink
                                            :to="`/search/?has_issuer_name%5B0%5D=${encodeURIComponent(item.name)}`"
                                            class="btn btn-primary btn-sm">
                                            {{ $t('viewDatasets') || 'View Datasets' }}
                                            <Icon name="tabler:arrow-right" class="ml-1" />
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TransitionGroup>
                </div>
            </div>

            <button :alt="$t('toggleNextSlide')" :aria-label="$t('toggleNextSlide')"
                class="z-10 md:flex p-2 md:bg-gray-800 text-black md:text-white rounded-full bg-opacity-50 w-10 h-10 items-center justify-center md:ml-4 dark:bg-gray-600 dark:text-gray-200 md:absolute md:top-1/2 md:transform md:-translate-y-1/2 md:right-[-3rem]"
                @click="nextSlide">
                <Icon name="tabler:chevron-right" />
            </button>
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

onMounted(() => {
    startAutoSlide();
});

onBeforeUnmount(() => {
    stopAutoSlide();
});
</script>

<style scoped>
<style scoped>.carousel-container {
    display: flex;
    align-items: center;
    position: relative;
}

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
