<template>
  <div class="carousel-container flex items-center relative">
    <button :alt="$t('togglePreviousSlide')" :aria-label="$t('togglePreviousSlide')"
      class="lg:flex my-auto z-10 p-2 lg:bg-gray-800 lg:text-white text-black rounded-full bg-opacity-50 w-10 h-10 items-center justify-center lg:mr-4 dark:bg-gray-600 dark:text-gray-200 lg:absolute lg:top-1/2 lg:transform lg:-translate-y-1/2"
      @click="prevSlide">
      <Icon name="tabler:chevron-left" />
    </button>
    <div class="overflow-hidden rounded-box w-full p-4">
      <div class="relative w-full" style="min-height: 250px;">
        <TransitionGroup name="slide">
          <div v-for="(item, index) in items" v-show="currentIndex === index" :key="index"
            class="absolute inset-0 flex justify-center items-center p-2">
            <div class="card bg-base-100 shadow-md w-full max-w-sm">
              <a :href="item.link" target="_blank" rel="noopener noreferrer" :aria-label="'Link to ' + item.link">
                <figure class="px-6 pt-6">
                  <img class="h-20 w-auto object-contain" :src="item.src" :alt="item.alt" :title="item.alt"
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
      class="z-10 my-auto lg:flex p-2 lg:bg-gray-800 text-black lg:text-white rounded-full bg-opacity-50 w-10 h-10 items-center justify-center lg:ml-4 dark:bg-gray-600 dark:text-gray-200 lg:absolute lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:right-0"
      :alt="$t('toggleNextSlide')" :aria-label="$t('toggleNextSlide')" @click="nextSlide">
      <Icon name="tabler:chevron-right" />
    </button>
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

.carousel-container {
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