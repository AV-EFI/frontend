
  <template>
    <div class="relative w-full">
      <!-- Desktop arrows -->
      <button v-if="partnersItems.length > 1" @click="prevSlide"
        class="absolute -left-4 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow hidden sm:flex w-10 h-10"
        :aria-label="$t('home.carousel.aria.previous')">
        <Icon name="tabler:chevron-left" />
      </button>
      <div ref="carouselRef" class="carousel carousel-center w-full mx-auto rounded-box px-0 sm:p-4 overflow-x-auto scroll-smooth snap-none bg-base-200">
        <div v-for="(item, index) in partnersItems" :key="index"
                    class="carousel-item w-[calc(100%-64px)] shrink-0 mx-8 sm:mx-2 sm:w-72 md:w-96 rounded-lg align-top flex flex-col items-center lg:p-2 bg-white dark:bg-gray-800">
          <figure class="w-full flex-col p-1 md:p-2 rounded-lg">
            <div v-if="item.src"
              class="relative w-full h-20 py-2 rounded-lg overflow-hidden bg-white dark:bg-base-200 flex items-center justify-center">
              <img :src="item.src"
                :alt="item.alt || item.title || ''"
                :width="item.width || DEFAULT_LOGO_WIDTH"
                :height="item.height || DEFAULT_LOGO_HEIGHT"
                class="h-full w-auto max-w-full object-contain" />
            </div>
            <div v-else
              class="w-full h-20 flex items-center justify-center bg-gray-100 dark:bg-base-200 rounded-lg overflow-hidden">
              <img src="/img/avefi_placeholder.webp" alt="AVefi" class="object-cover w-full h-full" loading="lazy"
                decoding="async" />
            </div>
          </figure>
          <div class="p-4 flex flex-col flex-1 w-full bg-white dark:bg-base-200">
            <h3 class="card-title text-base font-semibold mb-2 text-gray-900 dark:text-gray-200">
              {{ item.alt || item.title || '' }}
            </h3>
            <p v-if="item.description" class="text-gray-700 text-sm mb-2 dark:text-gray-300 md:line-clamp-none">
              {{ item.description }}
            </p>
            <div class="mt-auto">
              <NuxtLink v-if="item.link" :to="item.link" target="_blank" rel="noopener" class="btn btn-primary btn-sm w-full md:w-auto">
                {{ item.linkText || $t('home.carousel.actions.viewHomepage') || 'View Homepage' }}
                <Icon name="tabler:arrow-right" class="ml-1" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <!-- Desktop arrows -->
      <button v-if="partnersItems.length > 1" @click="nextSlide"
        class="absolute -right-4 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow hidden sm:flex w-10 h-10"
        :aria-label="$t('home.carousel.aria.next')">
        <Icon name="tabler:chevron-right" />
      </button>
      <!-- Mobile arrows -->
      <button v-if="partnersItems.length > 1" @click="prevSlide"
        class="absolute left-0 md:-left-4 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow flex sm:hidden"
        :aria-label="$t('home.carousel.aria.previous')">
        <Icon name="tabler:chevron-left" />
      </button>
      <button v-if="partnersItems.length > 1" @click="nextSlide"
        class="absolute right-0 md:-right-4 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow flex sm:hidden"
        :aria-label="$t('home.carousel.aria.next')">
        <Icon name="tabler:chevron-right" />
      </button>
    </div>
  </template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue';
const partnersItems = ref([
    {
        src: '/img/gwdg_logo.min.svg',
        width: 176.871,
        height: 52.384,
        alt: 'Gesellschaft für wissenschaftliche Datenverarbeitung Göttingen',
        link: 'https://www.gwdg.de'
    },
    {
        src: '/img/logo_sdk.webp',
        width: 50,
        height: 80,
        alt: 'Stiftung Deutsche Kinemathek',
        link: 'https://www.deutsche-kinemathek.de'
    },
    {
        src: '/img/logo_tib.webp',
        width: 85,
        height: 80,
        alt: 'Technische Informationsbibliothek Hannover',
        link: 'https://www.tib.eu'
    },
    {
        src: '/img/logo_fmd.webp',
        width: 199,
        height: 80,
        alt: 'Filmmuseum Düsseldorf',
        link: 'https://www.duesseldorf.de/filmmuseum'
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

const currentIndex = ref(0);
const carouselRef = ref(null);
const slideWidth = ref(0);
const itemCount = computed(() => partnersItems.value.length);
const DEFAULT_LOGO_WIDTH = 320;
const DEFAULT_LOGO_HEIGHT = 80;
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

const getSlides = () => {
    const host = carouselRef.value;
    if (!host) return [];
    return Array.from(host.querySelectorAll('.carousel-item'));
};

const getCenteredOffset = (slide) => {
    const host = carouselRef.value;
    if (!host || !slide) return 0;
    const raw = slide.offsetLeft + (slide.offsetWidth / 2) - (host.clientWidth / 2);
    const max = Math.max(0, host.scrollWidth - host.clientWidth);
    return Math.min(Math.max(raw, 0), max);
};

const centerSlideAtIndex = (index, behavior = 'smooth') => {
    const host = carouselRef.value;
    if (!host) return;
    const total = itemCount.value;
    if (!total) return;
    const clamped = Math.max(0, Math.min(index, total - 1));
    const slides = getSlides();
    const slide = slides[clamped];
    if (!slide) return;
    currentIndex.value = clamped;
    host.scrollTo({ left: getCenteredOffset(slide), behavior });
};

const scrollToSlide = (behavior = 'smooth') => {
    centerSlideAtIndex(currentIndex.value, behavior);
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

watch(
    () => partnersItems.length,
    () => {
        stopAutoSlide();
        currentIndex.value = 0;
        nextTick(() => {
            measureSlides();
            centerSlideAtIndex(0, 'auto');
            startAutoSlide();
        });
    }
);
const prevSlide = () => {
    scrollToIndex(currentIndex.value - 1);
};

const nextSlide = () => {
    scrollToIndex(currentIndex.value + 1);
};

const handleScroll = () => {
    const host = carouselRef.value;
    if (!host || !slideWidth.value) return;
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

const scrollToIndex = (index, behavior = 'smooth') => {
    centerSlideAtIndex(index, behavior);
};

const setupResizeObserver = () => {
    if (typeof window === 'undefined') return;
    if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(() => {
            measureSlides();
            centerSlideAtIndex(currentIndex.value, 'auto');
        });
        if (carouselRef.value) {
            resizeObserver.observe(carouselRef.value);
        }
    } else {
        window.addEventListener('resize', measureSlides, { passive: true });
    }
};

onMounted(() => {
    nextTick(() => {
        measureSlides();
        centerSlideAtIndex(currentIndex.value, 'auto');
        startAutoSlide();

        const host = carouselRef.value;
        if (host) {
            host.addEventListener('scroll', handleScroll, { passive: true });
        }
        setupResizeObserver();
    });
});

onBeforeUnmount(() => {
    stopAutoSlide();
    carouselRef.value?.removeEventListener('scroll', handleScroll);
    if (resizeObserver?.disconnect) {
        resizeObserver.disconnect();
        resizeObserver = null;
    } else if (typeof window !== 'undefined') {
        window.removeEventListener('resize', measureSlides);
    }
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