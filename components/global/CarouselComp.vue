<template>
  <div>
    <!-- Desktop/Large screens: original carousel -->
    <div class="carousel-container items-center relative hidden bg:white/80 dark:bg-base-200/60 lg:flex rounded-xl">
      <button :alt="$t('togglePreviousSlide')" :aria-label="$t('togglePreviousSlide')"
        class="lg:flex my-auto z-10 p-2 bg-neutral text-white rounded-full bg-opacity-50 w-11 h-11 min-w-[44px] min-h-[44px] items-center justify-center lg:mr-4 dark:bg-gray-600 dark:text-gray-200 lg:absolute lg:top-1/2 lg:transform lg:-translate-y-1/2"
        style="min-width:44px;min-height:44px;" @click="prevSlide">
        <Icon name="tabler:chevron-left" />
      </button>
      <div class="overflow-hidden rounded-box w-full p-4">
        <div class="relative w-full" style="min-height: 250px;">
          <TransitionGroup name="slide">
            <div v-for="(item, index) in items" v-show="currentIndex === index" :key="index"
              class="absolute inset-0 flex justify-center items-center p-2">
              <div class="card bg-base-100 shadow-md w-full max-w-sm">
                <a :href="item.link" target="_blank" rel="noopener noreferrer" :aria-label="'Link to ' + item.link">
                  <figure class="px-6 pt-6 pb-4 bg-white rounded">
                    <img class="h-20 w-auto object-contain bg-white" :src="item.src" :alt="item.alt" :title="item.alt"
                      loading="lazy" fetchpriority="low" />
                  </figure>
                  <div class="card-body items-center text-center">
                    <h4 class="card-title text-base font-semibold line-clamp-2">
                      {{ item.alt }}
                    </h4>
                    <div class="card-actions">
                      <NuxtLink target="_blank" rel="noopener" :to="`${item.link}`" class="btn btn-primary btn-sm">
                        {{ $t('viewHomepage') || 'View Homepage' }}
                        <Icon name="tabler:arrow-right" class="ml-1" />
                      </NuxtLink>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
      <button
        class="z-10 my-auto lg:flex p-2 bg-neutral text-white rounded-full bg-opacity-50 w-11 h-11 min-w-[44px] min-h-[44px] items-center justify-center lg:ml-4 dark:bg-gray-600 dark:text-gray-200 lg:absolute lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:right-0"
        style="min-width:44px;min-height:44px;" :alt="$t('toggleNextSlide')" :aria-label="$t('toggleNextSlide')"
        @click="nextSlide">
        <Icon name="tabler:chevron-right" />
      </button>
    </div>

    <!-- Mobile/Small screens: horizontal scrollable cards -->
    <div class="lg:hidden w-full relative">
      <div ref="carouselRef"
        class="carousel carousel-center w-full bg-white/90 dark:bg-base-200 rounded-box p-4 overflow-x-auto scroll-smooth flex">
        <div v-for="(item, index) in items" :key="index"
          class="carousel-item align-top flex flex-col items-center mx-4 w-80 md:w-80 lg:w-96">
          <figure class="w-full">
            <div v-if="item.src" class="relative w-full h-48 md:h-56 lg:h-64 rounded overflow-hidden bg-white">
              <div class="absolute inset-0 w-full h-full object-cover bg-white scale-110" aria-hidden="true">
                <div class="relative z-10 flex items-center justify-center w-full h-full ">
                  <img :src="item.src" :alt="item.alt" loading="lazy" fetchpriority="low" decoding="async"
                    class="max-w-full max-h-full object-contain z-10 bg-white roundend-xl p-6">
                </div>
              </div>
            </div>
            <div v-else
              class="w-full h-48 md:h-56 lg:h-64 flex items-center justify-center bg-gray-100 dark:bg-base-200 rounded overflow-hidden">
              <img src="/img/placeholder-16x9.svg" alt="Avefi" class="object-cover w-full h-full" loading="lazy"
                decoding="async" />
            </div>
          </figure>
          <div class="p-4 flex flex-col flex-1 w-full bg-white dark:bg-base-200">
            <h2 class="card-title text-base font-semibold mb-2 text-gray-900 dark:text-gray-200">
              {{ item.alt }}
            </h2>
            <div class="mt-auto">
              <NuxtLink :to="`${item.link}`" class="btn btn-sm w-full md:w-auto btn-primary" target="_blank"
                rel="noopener">
                {{ $t('viewHomepage') || 'View Homepage' }}
                <Icon class="hidden md:inline-block ml-1" name="tabler:arrow-right" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <!-- Mobile arrows -->
      <button v-if="items.length > 1" @click="prevMobileSlide"
        class="absolute -left-8 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-primary text-white dark:bg-base-100 shadow flex"
        :aria-label="$t('togglePreviousSlide')">
        <Icon name="tabler:chevron-left" />
      </button>
      <button v-if="items.length > 1" @click="nextMobileSlide"
        class="absolute -right-8 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-primary text-white dark:bg-base-100 shadow flex"
        :aria-label="$t('toggleNextSlide')">
        <Icon name="tabler:chevron-right" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  autoSlideInterval: {
    type: Number,
    default: 5000
  }
});

const currentIndex = ref(0);
let autoSlideTimer = null;

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length;
  resetAutoSlide();
};

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.items.length;
  resetAutoSlide();
};

const startAutoSlide = () => {
  if (props.autoSlideInterval > 0) {
    autoSlideTimer = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % props.items.length;
    }, props.autoSlideInterval);
  }
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

// Mobile scroll logic (fixed scroll amount like IssuerCarouselComp.vue)
const carouselRef = ref(null);
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
.carousel-inner {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-item {
  flex-shrink: 0;
  width: 100%;
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

@media (prefers-reduced-motion: reduce) {

  .carousel-inner,
  .slide-enter-active,
  .slide-leave-active {
    transition: none !important;
  }
}
</style>
