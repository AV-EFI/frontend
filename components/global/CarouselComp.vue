<template>
  <div ref="carouselRef" class="carousel rounded-box w-full p-4 overflow-x-auto scroll-smooth" role="region"
    :aria-label="$t('partnersCarousel') || 'Partner carousel'">
    <div v-for="(item, index) in items" :key="index" class="carousel-item w-full flex-shrink-0 px-2 lg:px-4">
      <article class="card w-full shadow-md">
        <figure class="px-4 pt-2 pb-2">
          <div class="w-full h-48 flex items-center justify-center rounded-xl bg-white overflow-hidden"
            aria-hidden="true">
            <img v-if="item.src" :src="item.src" :alt="item.alt || item.title || ''" loading="lazy" decoding="async"
              :width="item.width || DEFAULT_LOGO_WIDTH" :height="item.height || DEFAULT_LOGO_HEIGHT"
              class="w-full h-24 object-contain p-2" />
            <img v-else src="/img/placeholder-16x9.svg" alt="Avefi placeholder" loading="lazy" decoding="async"
              :width="DEFAULT_LOGO_WIDTH" :height="DEFAULT_LOGO_HEIGHT"
              class="w-full h-full object-contain opacity-70" />
          </div>
        </figure>
        <div class="card-body text-center items-center gap-3">
          <h3 class="card-title text-base font-semibold">
            {{ item.alt || item.title || '' }}
          </h3>
          <p v-if="item.description" class="text-sm opacity-80">
            {{ item.description }}
          </p>
          <div class="card-actions">
            <NuxtLink v-if="item.link" :to="item.link" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
              {{ item.linkText || $t('viewHomepage') || 'View Homepage' }}
              <Icon name="tabler:arrow-right" class="ml-1" />
            </NuxtLink>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, onBeforeUnmount, nextTick, watch, computed } from 'vue';

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
const carouselRef = ref(null);
const slideWidth = ref(0);
const itemCount = computed(() => props.items.length);
const DEFAULT_LOGO_WIDTH = 320;
const DEFAULT_LOGO_HEIGHT = 120;
let autoSlideTimer = null;
let resizeObserver = null;

const measureSlides = () => {
  const host = carouselRef.value;
  if (!host) {
    slideWidth.value = 0;
    return;
  }
  const firstSlide = host.querySelector('.carousel-item');
  if (firstSlide) {
    const rect = firstSlide.getBoundingClientRect();
    slideWidth.value = rect.width;
  } else {
    slideWidth.value = host.clientWidth;
  }
};

const scrollToSlide = (behavior = 'smooth') => {
  const host = carouselRef.value;
  if (!host || !itemCount.value || !slideWidth.value) return;
  host.scrollTo({ left: slideWidth.value * currentIndex.value, behavior });
};

const advanceSlide = () => {
  if (!itemCount.value || !slideWidth.value) return;
  currentIndex.value = (currentIndex.value + 1) % itemCount.value;
  scrollToSlide();
};

const startAutoSlide = () => {
  if (props.autoSlideInterval > 0 && itemCount.value > 1 && slideWidth.value) {
    autoSlideTimer = setInterval(advanceSlide, props.autoSlideInterval);
  }
};

const stopAutoSlide = () => {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer);
    autoSlideTimer = null;
  }
};

const setupResizeObserver = () => {
  if (typeof window === 'undefined') return;
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => {
      measureSlides();
      scrollToSlide('auto');
    });
    nextTick(() => {
      if (carouselRef.value) {
        resizeObserver.observe(carouselRef.value);
      }
    });
  } else {
    window.addEventListener('resize', measureSlides, { passive: true });
  }
};

onMounted(() => {
  nextTick(() => {
    measureSlides();
    scrollToSlide('auto');
    startAutoSlide();
  });
  setupResizeObserver();
});

onBeforeUnmount(() => {
  stopAutoSlide();
  if (resizeObserver?.disconnect) {
    resizeObserver.disconnect();
    resizeObserver = null;
  } else if (typeof window !== 'undefined') {
    window.removeEventListener('resize', measureSlides);
  }
});

watch(
  () => props.items.length,
  () => {
    stopAutoSlide();
    currentIndex.value = 0;
    nextTick(() => {
      measureSlides();
      scrollToSlide('auto');
      startAutoSlide();
    });
  }
);
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
