<template>
  <div ref="carouselRef" class="carousel rounded-box w-full p-4 overflow-x-auto scroll-smooth" role="region"
    :aria-label="$t('partnersCarousel') || 'Partner carousel'">
    <div v-for="(item, index) in items" :key="index" class="carousel-item w-full flex-shrink-0 px-2 lg:px-4"
      :aria-hidden="currentIndex !== index" :tabindex="currentIndex === index ? 0 : -1">
      <article class="card w-full shadow-md">
        <figure class="px-4 pt-6 pb-2">
          <div class="w-full h-48 flex items-center justify-center rounded-xl bg-white overflow-hidden"
            aria-hidden="true">
            <img v-if="item.src" :src="item.src" :alt="item.alt || item.title || ''" loading="lazy" decoding="async"
              :width="item.width || undefined" :height="item.height || undefined"
              class="w-full h-24 object-contain p-2" />
            <img v-else src="/img/placeholder-16x9.svg" alt="Avefi placeholder" loading="lazy" decoding="async"
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
import { ref, defineProps, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';

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
let autoSlideTimer = null;

const scrollToSlide = () => {
  const host = carouselRef.value;
  if (!host) return;
  const slides = host.querySelectorAll('.carousel-item');
  const target = slides[currentIndex.value];
  if (target) {
    host.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
  }
};

const advanceSlide = () => {
  if (!props.items.length) return;
  currentIndex.value = (currentIndex.value + 1) % props.items.length;
  nextTick(scrollToSlide);
};

const startAutoSlide = () => {
  if (props.autoSlideInterval > 0 && props.items.length > 1) {
    autoSlideTimer = setInterval(advanceSlide, props.autoSlideInterval);
  }
};

const stopAutoSlide = () => {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer);
    autoSlideTimer = null;
  }
};

onMounted(() => {
  nextTick(scrollToSlide);
  startAutoSlide();
});

onBeforeUnmount(() => {
  stopAutoSlide();
});

watch(
  () => props.items.length,
  () => {
    currentIndex.value = 0;
    nextTick(scrollToSlide);
    stopAutoSlide();
    startAutoSlide();
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
