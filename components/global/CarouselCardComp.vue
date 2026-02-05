<template>
  <div class="relative w-full">
    <!-- Desktop arrows -->
    <button v-if="items.length > 1" @click="prevSlide"
      class="absolute -left-4 top-1/2 z-10 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow hidden sm:flex w-10 h-10"
      :aria-label="t('togglePreviousSlide')">
      <Icon name="tabler:chevron-left" />
    </button>
    <div ref="carouselRef"
      class="carousel carousel-center w-full rounded-box p-4 overflow-x-auto scroll-smooth snap-none">
      <div v-for="(item, index) in items" :key="index"
        class="carousel-item align-top flex flex-col items-center mx-2 bg-white dark:bg-gray-800 w-[90vw] sm:w-72 md:w-96">
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
            class="h-auto min-h-12 break-words text-xs text-gray-500 mt-2 px-2 dark:text-gray-400">
            {{ t('imageSource') }}: <a :href="item.imgSourceLink" target="_blank" class="underline">{{
              item.imgSourceText }}</a>, {{ t('author') }}: {{ item.imgAuthor }} / {{ item.imgLicense }} ({{
            item.imgLicenseLink }})
          </figcaption>
          <figcaption v-else class="h-auto min-h-12 break-words text-xs text-gray-500 mt-2 px-2 dark:text-gray-400">
          </figcaption>
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
      <!-- Create your own card (appended after items) - now a daisyUI swap: slogan -> form -->
      <div
        class="carousel-item relative align-top flex flex-col items-center mx-2 bg-white dark:bg-gray-800 w-[90vw] sm:w-72 md:w-96">
        <label class="swap swap-flip w-full h-full cursor-pointer">
          <input type="checkbox" v-model="createOpen" aria-label="Toggle create form" />

          <!-- swap-off: show only slogan -->
          <div class="swap-off w-full h-full flex items-center justify-center p-6">
            <div class="flex flex-col items-center">
              <h2 class="card-title text-base font-semibold text-gray-900 dark:text-gray-200">
                {{ t('create.yourOwn') || 'Create Your Own' }}
              </h2>
              <div class="btn btn-primary btn-circle mt-2">
                <Icon class="" name="tabler:plus" />
              </div>
            </div>
          </div>

          <!-- swap-on: the full form (same fields as before) -->
          <div class="swap-on w-full h-full">
            <figure class="w-full">
              <div
                class="relative w-full h-48 md:h-56 lg:h-64 rounded overflow-hidden bg-gray-100 dark:bg-base-200 flex items-center justify-center">
                <img v-if="createForm.imgUrl" :src="createForm.imgUrl" :alt="createForm.title || 'Preview'"
                  class="absolute inset-0 w-full h-full object-cover opacity-40" loading="lazy" decoding="async" />
                <div class="relative z-10 flex items-center justify-center w-full h-full px-3">
                  <div class="w-full">
                    <input v-model="createForm.imgUrl" type="text" placeholder="Image URL (optional)"
                      class="input input-bordered input-sm w-full" />
                  </div>
                </div>
              </div>
            </figure>
            <div class="lg:h-72 lg:w-96 p-4 flex flex-col flex-1 w-full bg-white dark:bg-base-200">
              <h2 class="card-title text-base font-semibold mb-2 text-gray-900 dark:text-gray-200">{{
                t('create.yourOwn') || 'Create Your Own' }}</h2>
              <input v-model="createForm.title" type="text" placeholder="Title"
                class="input input-bordered input-sm mb-2 w-full" />
              <textarea v-model="createForm.description" rows="3" placeholder="Description"
                class="textarea textarea-bordered textarea-sm mb-2 w-full"></textarea>
              <input v-model="createForm.link" type="text" placeholder="Search Link (Copy URL from search page)"
                class="input input-bordered input-sm mb-2 w-full" />
              <div class="mt-auto">
                <button @click="handleCreate" class="btn btn-sm w-full md:w-auto btn-primary">{{$t('send')}}</button>
              </div>
            </div>
          </div>
        </label>

        <!-- Contact form overlay (opens after Create) -->
        <div v-if="contactFormOpen" class="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div class="w-full max-w-lg">
            <MicroContactForm :initialMessage="contactInitialMessage" @close="contactFormOpen = false" />
          </div>
        </div>
      </div>
    </div>
    <!-- Desktop arrows -->
    <button v-if="items.length > 1" @click="nextSlide"
      class="absolute -right-4 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow hidden sm:flex w-10 h-10"
      :aria-label="t('toggleNextSlide')">
      <Icon name="tabler:chevron-right" />
    </button>
    <!-- Mobile arrows -->
    <button v-if="items.length > 1" @click="prevSlide"
      class="absolute -left-4 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow flex sm:hidden"
      :aria-label="t('togglePreviousSlide')">
      <Icon name="tabler:chevron-left" />
    </button>
    <button v-if="items.length > 1" @click="nextSlide"
      class="absolute -right-4 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow flex sm:hidden"
      :aria-label="t('toggleNextSlide')">
      <Icon name="tabler:chevron-right" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
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

// Emit created items to parent
const emit = defineEmits<{
  (e: 'create-item', payload: CarouselItem): void
}>();

const createForm = ref({
    title: '',
    description: '',
    imgUrl: '',
    link: '',
    linkText: ''
});

// controls the daisyUI swap state for the create card
const createOpen = ref(false);

// contact form state for prefilled suggestion when creating a card
const contactFormOpen = ref(false);
const contactInitialMessage = ref('');

function handleCreate() {
  if (!createForm.value.title || !createForm.value.title.trim()) return;

  const newItem: CarouselItem = {
    title: createForm.value.title,
    imgSrc: createForm.value.imgUrl || '',
    imgAlt: createForm.value.title,
    description: createForm.value.description || '',
    link: createForm.value.link || '#',
    linkText: createForm.value.linkText || 'Open',
    imgSourceLink: '',
    imgSourceText: '',
    imgAuthor: '',
    imgLicense: '',
    imgLicenseLink: '',
    imgCoverType: ''
  };

  emit('create-item', newItem);

  // prepare contact form with prefilled message and open it
  const title = newItem.title;
  const description = newItem.description || '';
  const url = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}${window.location.search}` : '';
  contactInitialMessage.value = t('create.contactFormPrefill', { title, description, url }) as string;
  contactFormOpen.value = true;

  // reset form and close swap
  createForm.value = { title: '', description: '', imgUrl: '', link: '', linkText: '' };
  createOpen.value = false;
}

/**
 * Safari / snap edge-cases: if smooth scroll is ignored, we fall back to an rAF tween.
 */
function smoothScrollTo(el: HTMLElement, left: number, duration = 420) {
    // Try native first
    try {
        el.scrollTo({ left, behavior: 'smooth' });
        return;
    } catch {
    // ignore and fallback
    }

    const start = el.scrollLeft;
    const delta = left - start;
    const startTime = performance.now();

    const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const tick = (now: number) => {
        const p = Math.min(1, (now - startTime) / duration);
        el.scrollLeft = start + delta * easeInOutCubic(p);
        if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
}

function getItems(): HTMLElement[] {
    const el = carouselRef.value;
    if (!el) return [];
    return Array.from(el.querySelectorAll<HTMLElement>('.carousel-item'));
}

function getClosestIndex(): number {
    const el = carouselRef.value;
    if (!el) return 0;
    const items = getItems();
    if (!items.length) return 0;

    const current = el.scrollLeft;
    let bestIdx = 0;
    let bestDist = Infinity;

    for (let i = 0; i < items.length; i++) {
        const dist = Math.abs(items[i].offsetLeft - current);
        if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
        }
    }
    return bestIdx;
}

function scrollToIndex(idx: number) {
    const el = carouselRef.value;
    if (!el) return;

    const items = getItems();
    if (!items.length) return;

    const clamped = Math.max(0, Math.min(idx, items.length - 1));
    const targetLeft = items[clamped].offsetLeft;

    smoothScrollTo(el, targetLeft);
}

const prevSlide = () => {
    const i = getClosestIndex();
    scrollToIndex(i - 1);
};

const nextSlide = () => {
    const i = getClosestIndex();
    scrollToIndex(i + 1);
};

function onResize() {
    // After resize, align to the nearest snap item so buttons stay consistent
    const i = getClosestIndex();
    scrollToIndex(i);
}

onMounted(() => {
    window.addEventListener('resize', onResize, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener('resize', onResize);
});
</script>


<style scoped>
.carousel-item {
  transition: opacity 0.3s;
}
</style>
