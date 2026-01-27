<template>
  <div class="w-full">
    <!-- Optional loading / error (for IssuerCarousel-like usage) -->
    <div v-if="loading" class="flex justify-center items-center min-h-[300px]">
      <span class="loading loading-spinner loading-lg text-primary" />
    </div>

    <div v-else-if="error" class="alert alert-error">
      <Icon name="tabler:alert-circle" class="w-6 h-6" />
      <span>{{ error }}</span>
    </div>

    <div v-else-if="items && items.length > 0">
      <!-- ===================== -->
      <!-- Desktop / Large screens -->
      <!-- ===================== -->
      <div
        class="carousel-container items-center relative hidden lg:flex dark:bg-base-200/80 rounded-box p-4"
      >
        <button
          v-if="items.length > 1"
          :alt="t('togglePreviousSlide')"
          :aria-label="t('togglePreviousSlide')"
          class="md:flex z-10 p-2 bg-primary text-white rounded-full bg-opacity-50 w-10 h-10 items-center justify-center
                 dark:bg-gray-600 dark:text-gray-200 md:absolute md:top-1/2 md:transform md:-translate-y-1/2 md:left-[-3rem]"
          @click="prevSlide"
        >
          <Icon name="tabler:chevron-left" />
        </button>

        <div class="overflow-hidden rounded-box w-full p-4">
          <div class="relative w-full" :style="{ minHeight: desktopMinHeightPx }">
            <!-- Keep IssuerCarousel-style transition -->
            <TransitionGroup name="slide">
              <div
                v-for="(item, index) in items"
                v-show="currentIndex === index"
                :key="getKey(item, index)"
                class="absolute inset-0 flex justify-center items-center p-2"
              >
                <!-- Scoped slot to render card content -->
                <slot name="card" :item="item" :index="index">
                  <!-- Default card (roughly matches CarouselComp defaults) -->
                  <div class="card bg-base-100 shadow-md w-full max-w-sm">
                    <a
                      v-if="(item as any).link"
                      :href="(item as any).link"
                      target="_blank"
                      rel="noopener noreferrer"
                      :aria-label="`Link to ${(item as any).link}`"
                    >
                      <figure class="px-6 py-6 bg-white rounded">
                        <img
                          class="h-20 w-auto object-contain bg-white"
                          :src="(item as any).src || (item as any).image"
                          :alt="(item as any).alt || (item as any).imageAlt || ''"
                          :title="(item as any).alt || (item as any).name || ''"
                          loading="lazy"
                          fetchpriority="low"
                        />
                      </figure>
                      <div class="card-body items-center text-center">
                        <h4 class="card-title text-base font-semibold line-clamp-2">
                          {{ (item as any).alt || (item as any).name || '' }}
                        </h4>
                        <div class="card-actions">
                          <NuxtLink
                            target="_blank"
                            rel="noopener"
                            :to="`${(item as any).link}`"
                            class="btn btn-primary btn-sm"
                          >
                            {{ t('viewHomepage') || 'View Homepage' }}
                            <Icon name="tabler:arrow-right" class="ml-1" />
                          </NuxtLink>
                        </div>
                      </div>
                    </a>

                    <div v-else class="card-body items-center text-center">
                      <h4 class="card-title text-base font-semibold line-clamp-2">
                        {{ (item as any).alt || (item as any).name || '' }}
                      </h4>
                    </div>
                  </div>
                </slot>
              </div>
            </TransitionGroup>
          </div>
        </div>

        <button
          v-if="items.length > 1"
          :alt="t('toggleNextSlide')"
          :aria-label="t('toggleNextSlide')"
          class="z-10 md:flex p-2 bg-primary text-white rounded-full bg-opacity-50 w-10 h-10 items-center justify-center
                 dark:bg-gray-600 dark:text-gray-200 md:absolute md:top-1/2 md:transform md:-translate-y-1/2 md:right-[-3rem]"
          @click="nextSlide"
        >
          <Icon name="tabler:chevron-right" />
        </button>
      </div>

      <!-- ===================== -->
      <!-- Mobile / Small screens -->
      <!-- ===================== -->
      <div class="w-full relative lg:hidden">
        <div
          ref="carouselRef"
          class="carousel carousel-center w-full bg-white/40 dark:bg-base-200/80 rounded-box p-4 overflow-x-auto scroll-smooth flex"
        >
          <div
            v-for="(item, index) in items"
            :key="getKey(item, index)"
            class="carousel-item align-top flex flex-col items-center mx-2"
            :class="mobileItemClass"
          >
            <!-- Scoped slot again -->
            <slot name="card" :item="item" :index="index">
              <!-- Default mobile card similar to CarouselComp -->
              <figure class="w-full">
                <div
                  v-if="(item as any).src || (item as any).image"
                  class="relative w-full h-48 md:h-56 lg:h-64 rounded overflow-hidden bg-white/80 dark:bg-white flex items-center justify-center"
                >
                  <img
                    :src="(item as any).src || (item as any).image"
                    :alt="(item as any).alt || (item as any).imageAlt || ''"
                    :title="(item as any).alt || (item as any).name || ''"
                    loading="lazy"
                    decoding="async"
                    class="max-w-full max-h-full object-contain z-10"
                  />
                </div>

                <div
                  v-else
                  class="w-full h-48 md:h-56 lg:h-64 flex items-center justify-center bg-gray-100 dark:bg-base-200 rounded overflow-hidden"
                >
                  <img
                    src="/img/placeholder-16x9.svg"
                    alt="Avefi"
                    class="object-cover w-full h-full"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </figure>

              <div class="p-4 flex flex-col flex-1 w-full bg-white dark:bg-base-200">
                <h2 class="card-title text-base font-semibold mb-2 text-gray-900 dark:text-gray-200">
                  {{ (item as any).alt || (item as any).name || '' }}
                </h2>

                <div class="mt-auto" v-if="(item as any).link">
                  <NuxtLink
                    :to="`${(item as any).link}`"
                    class="btn btn-sm w-full md:w-auto btn-primary"
                    target="_blank"
                    rel="noopener"
                  >
                    {{ t('viewHomepage') || 'View Homepage' }}
                    <Icon class="hidden md:inline-block ml-1" name="tabler:arrow-right" />
                  </NuxtLink>
                </div>
              </div>
            </slot>
          </div>
        </div>

        <!-- Mobile arrows (snap-point scrolling) -->
        <button
          v-if="items.length > 1"
          @click="prevMobileSlide"
          class="absolute left-2 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-primary text-white dark:bg-base-200 shadow flex"
          :aria-label="t('togglePreviousSlide')"
        >
          <Icon name="tabler:chevron-left" />
        </button>

        <button
          v-if="items.length > 1"
          @click="nextMobileSlide"
          class="absolute right-2 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-primary text-white dark:bg-base-200 shadow flex"
          :aria-label="t('toggleNextSlide')"
        >
          <Icon name="tabler:chevron-right" />
        </button>
      </div>
    </div>

    <div v-else class="text-center text-base-content/60 py-8">
      {{ emptyText || t('noResults') || 'No items found' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

const { t } = useI18n();

type Keyable = { id?: string | number; key?: string | number };

const props = defineProps({
    items: {
        type: Array as PropType<any[]>,
        required: true
    },

    /**
   * Desktop auto-slide interval in ms.
   * Set to 0 to disable auto sliding.
   */
    autoSlideInterval: {
        type: Number,
        default: 6000
    },

    /**
   * Desktop min height (px) to avoid layout jump.
   * IssuerCarousel used ~350px; CarouselComp used ~250px.
   */
    desktopMinHeight: {
        type: Number,
        default: 350
    },

    /**
   * Mobile item width classes; matches your two components.
   * Example issuer: "w-[80vw] sm:w-72 md:w-80 lg:w-96"
   * Example generic: "w-72 md:w-80 lg:w-96"
   */
    mobileItemClass: {
        type: String,
        default: 'w-[80vw] sm:w-72 md:w-80 lg:w-96'
    },

    /**
   * Optional loading/error/empty text support (so this can replace IssuerCarouselComp).
   */
    loading: {
        type: Boolean,
        default: false
    },
    error: {
        type: String,
        default: ''
    },
    emptyText: {
        type: String,
        default: ''
    },

    /**
   * Optional custom key resolver for items.
   */
    itemKey: {
        type: Function as PropType<(item: any, index: number) => string | number>,
        default: null
    }
});

const currentIndex = ref(0);
let autoSlideTimer: any = null;

const desktopMinHeightPx = computed(() => `${props.desktopMinHeight}px`);

function getKey(item: any, index: number) {
    if (props.itemKey) return props.itemKey(item, index);

    const k = (item as Keyable)?.key ?? (item as Keyable)?.id;
    return k != null ? String(k) : String(index);
}

const stopAutoSlide = () => {
    if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
    }
};

const startAutoSlide = () => {
    stopAutoSlide();
    if (props.autoSlideInterval > 0 && props.items.length > 1) {
        autoSlideTimer = setInterval(() => {
            currentIndex.value = (currentIndex.value + 1) % props.items.length;
        }, props.autoSlideInterval);
    }
};

const resetAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
};

const prevSlide = () => {
    if (!props.items.length) return;
    currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length;
    resetAutoSlide();
};

const nextSlide = () => {
    if (!props.items.length) return;
    currentIndex.value = (currentIndex.value + 1) % props.items.length;
    resetAutoSlide();
};

/**
 * MOBILE: snap-point-aware scrolling
 * This avoids "no animation" / jumpy behavior caused by scroll-snap + guessed widths.
 */
const carouselRef = ref<HTMLElement | null>(null);

function getMobileItems(): HTMLElement[] {
    const el = carouselRef.value;
    if (!el) return [];
    return Array.from(el.querySelectorAll<HTMLElement>('.carousel-item'));
}

function getClosestMobileIndex(): number {
    const el = carouselRef.value;
    if (!el) return 0;

    const items = getMobileItems();
    if (!items.length) return 0;

    const currentLeft = el.scrollLeft;

    let bestIdx = 0;
    let bestDist = Infinity;

    for (let i = 0; i < items.length; i++) {
        const dist = Math.abs(items[i].offsetLeft - currentLeft);
        if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
        }
    }

    return bestIdx;
}

function scrollMobileToIndex(idx: number) {
    const el = carouselRef.value;
    if (!el) return;

    const items = getMobileItems();
    if (!items.length) return;

    const clamped = Math.max(0, Math.min(idx, items.length - 1));
    const targetLeft = items[clamped].offsetLeft;

    el.scrollTo({ left: targetLeft, behavior: 'smooth' });
}

const prevMobileSlide = () => {
    const i = getClosestMobileIndex();
    scrollMobileToIndex(i - 1);
};

const nextMobileSlide = () => {
    const i = getClosestMobileIndex();
    scrollMobileToIndex(i + 1);
};

onMounted(() => {
    startAutoSlide();
});

onBeforeUnmount(() => {
    stopAutoSlide();
});
</script>

<style scoped>
/* Desktop slide animation (from IssuerCarouselComp.vue) */
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

/* Reduced motion: respect OS setting */
@media (prefers-reduced-motion: reduce) {
  .slide-enter-active,
  .slide-leave-active {
    transition: none !important;
  }
}
</style>
