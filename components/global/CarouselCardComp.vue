<template>
  <div class="relative w-full">
    <!-- Desktop arrows -->
    <button v-if="items.length > 1" @click="prevSlide"
      class="absolute left-2 top-1/2 z-10 -translate-y-1/2 btn btn-circle btn-glass bg-white dark:bg-base-200 shadow hidden sm:flex"
      :aria-label="t('togglePreviousSlide')">
      <Icon name="tabler:chevron-left" />
    </button>
    <div ref="carouselRef"
      class="carousel carousel-center w-full bg-white dark:bg-base-200 rounded-box p-4 overflow-x-auto scroll-smooth">
      <div v-for="(item, index) in items" :key="index"
        class="carousel-item inline-block align-top flex flex-col items-center mx-2 w-[90vw] sm:w-72 md:w-80 lg:w-96">

        <figure class="w-full">
          <div v-if="item.imgSrc"
            class="relative w-full h-48 md:h-56 lg:h-64 rounded overflow-hidden bg-white dark:bg-base-200">
            <img :src="item.imgSrc" alt="" loading="lazy" decoding="async"
              class="absolute inset-0 w-full h-full object-cover blur scale-110 opacity-30" aria-hidden="true">
            <div class="relative z-10 flex items-center justify-center w-full h-full">
              <img :src="item.imgSrc" :alt="item.imgAlt" loading="lazy" fetchpriority="low" decoding="async"
                class="max-w-full max-h-full object-contain z-10">
            </div>
          </div>
          <div v-else
            class="w-full h-48 md:h-56 lg:h-64 flex items-center justify-center bg-gray-100 dark:bg-base-200 rounded overflow-hidden">
            <img src="/img/placeholder-16x9.svg" alt="Avefi" class="object-cover w-full h-full" loading="lazy"
              decoding="async" />
          </div>
          <figcaption v-if="item.imgSourceText"
            class="lg:h-[48px] break-words text-xs text-gray-500 mt-2 px-2 dark:text-gray-400">
            {{ t('imageSource') }}: <a :href="item.imgSourceLink" target="_blank" class="underline">{{
              item.imgSourceText }}</a>, {{ t('author') }}: {{ item.imgAuthor }} / {{ item.imgLicense }} ({{
            item.imgLicenseLink }})
          </figcaption>
          <div v-else class="min-h-[48px]"><span></span></div>
        </figure>
        <div class="lg:h-72 p-4 flex flex-col flex-1 w-full bg-white dark:bg-base-200">
          <h2 class="card-title text-base font-semibold mb-2 text-gray-900 dark:text-gray-200">
            {{ t(item.title) }}
          </h2>
          <p class="text-gray-700 text-sm mb-2 dark:text-gray-300 md:!line-clamp-none"
            :class="{ 'line-clamp-4': !showFullText }">
            {{ t(item.description) }}
          </p>
          <a class="md:hidden link link-secondary mb-2 dark:link-info" @click="toggleText">
            {{ showFullText ? t('showLess') : t('showMore') }}
          </a>
          <div class="mt-auto">
            <a :href="item.link" class="btn btn-sm w-full md:w-auto btn-primary">
              {{ t(item.linkText) }}
              <Icon class="hidden md:inline-block ml-1" name="tabler:arrow-right" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- Desktop arrows -->
    <button v-if="items.length > 1" @click="nextSlide"
      class="absolute right-2 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-white dark:bg-base-200 shadow hidden sm:flex"
      :aria-label="t('toggleNextSlide')">
      <Icon name="tabler:chevron-right" />
    </button>
    <!-- Mobile arrows -->
    <button v-if="items.length > 1" @click="prevSlide"
      class="absolute left-2 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-white dark:bg-base-200 shadow flex sm:hidden"
      :aria-label="t('togglePreviousSlide')">
      <Icon name="tabler:chevron-left" />
    </button>
    <button v-if="items.length > 1" @click="nextSlide"
      class="absolute right-2 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-white dark:bg-base-200 shadow flex sm:hidden"
      :aria-label="t('toggleNextSlide')">
      <Icon name="tabler:chevron-right" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const { t } = useI18n();

interface CarouselItem {
  title: string;
  imgSrc: string;
  imgAlt: string;
  description: string;
  link: string;
  linkText: string;
  imgSourceLink: string;
  imgSourceText: string;
  imgAuthor: string;
  imgLicense: string;
  imgLicenseLink: string;
  imgCoverType: string;
}

const props = defineProps({
    items: {
        type: Array as PropType<CarouselItem[]>,
        required: true
    }
});

const showFullText = ref(false);
const toggleText = (e: Event) => {
    e.preventDefault();
    showFullText.value = !showFullText.value;
};


const carouselRef = ref<HTMLElement | null>(null);

const scrollAmount = 320; // px, adjust to match card width

const prevSlide = () => {
    if (carouselRef.value) {
        carouselRef.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
};

const nextSlide = () => {
    if (carouselRef.value) {
        carouselRef.value.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
};

</script>

<style scoped>
.carousel-item {
  transition: opacity 0.3s;
}
</style>
