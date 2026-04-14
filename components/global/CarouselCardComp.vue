<template>
    <div ref="rootRef" class="relative w-full">
        <!-- Desktop arrows -->
        <button v-if="canNavigate" @click="prevSlide"
                class="absolute -left-10 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow hidden sm:flex w-10 h-10"
                :aria-label="t('home.carousel.aria.previous')">
            <Icon name="tabler:chevron-left" />
        </button>
        <div ref="viewportRef"
             class="w-full mx-auto rounded-box px-6 sm:px-4 lg:px-6 py-0 sm:py-4 overflow-hidden">
            <div ref="containerRef" class="flex touch-pan-y">
                <div v-for="(item, index) in items" :key="index"
                     class="carousel-item align-top flex flex-col items-center bg-white dark:bg-gray-800 min-w-0 w-full shrink-0 basis-full sm:basis-72 md:basis-96 lg:basis-[calc(50%-24px)] mr-4 lg:p-2">
                    <figure class="w-full flex-col bg-base-200 md:p-2 rounded-lg">
                        <div v-if="item.imgSrc"
                             class="relative w-full h-48 md:h-56 lg:h-64 rounded overflow-hidden bg-white dark:bg-base-200">
                            <img :src="item.imgBlurSrc || item.imgSrc"
                                 :srcset="item.imgBlurSrc ? undefined : item.imgSrcSet || undefined" :sizes="item.imgSizes || undefined"
                                 alt="" loading="lazy" fetchpriority="low" decoding="async"
                                 :width="item.imgBlurWidth || item.imgWidth || undefined"
                                 :height="item.imgBlurHeight || item.imgHeight || undefined"
                                 class="absolute inset-0 w-full h-full object-cover opacity-20 hidden md:block md:blur md:scale-110 md:opacity-30"
                                 aria-hidden="true">
                            <div class="relative z-10 flex items-center justify-center w-full h-full">
                                <img :src="item.imgSrc" :srcset="item.imgSrcSet || undefined" :sizes="item.imgSizes || undefined"
                                     :alt="item.imgAlt" :width="item.imgWidth || undefined" :height="item.imgHeight || undefined"
                                     :loading="index === 0 ? 'eager' : 'lazy'" :fetchpriority="index === 0 ? 'high' : 'auto'"
                                     decoding="async" class="h-full w-auto max-w-full z-10"
                                     :class="item.imgCoverType ? item.imgCoverType : 'object-cover'" />
                            </div>
                        </div>
                        <div v-else
                             class="w-full h-48 md:h-56 lg:h-64 flex items-center justify-center bg-gray-100 dark:bg-base-200 rounded overflow-hidden">
                            <img src="/img/avefi_placeholder.webp" alt="AVefi" class="object-cover w-full h-full" loading="lazy"
                                 decoding="async" />
                        </div>
                        <figcaption v-if="item.imgSourceText"
                                    class="h-auto min-h-12 wrap-break-word text-xs text-gray-700 mt-2 px-4 dark:text-gray-400">
                            {{ t('home.carousel.labels.imageSource') }}: <a :href="item.imgSourceLink" target="_blank" class="underline">{{
                                item.imgSourceText }}</a>, {{ t('home.carousel.labels.author') }}: {{ item.imgAuthor }} / {{ item.imgLicense }} ({{
                                item.imgLicenseLink }})
                        </figcaption>
                        <figcaption v-else class="h-auto min-h-12 wrap-break-word text-xs text-gray-700 mt-2 px-4 dark:text-gray-400">
                        </figcaption>
                    </figure>
                    <div class="lg:h-72 p-4 flex flex-col flex-1 w-full bg-white dark:bg-base-200">
                        <h2 class="card-title text-base font-semibold mb-2 text-gray-900 dark:text-gray-200">
                            {{ t(item.title) }}
                        </h2>
                        <p class="text-gray-700 text-sm mb-2 dark:text-gray-300 md:line-clamp-none!">
                            {{ t(item.description) }}
                        </p>
                        <div class="mt-auto">
                            <a :href="item.link" class="btn btn-md lg:btn-sm w-full md:w-auto btn-primary">
                                <span class="text-xs md:text-regular">
                                    {{ t(item.linkText) }}
                                </span>
                                <Icon class="hidden md:inline-block ml-1" name="tabler:arrow-right" />
                            </a>
                        </div>
                    </div>
                </div>
                <!-- Create your own card (appended after items) - now a daisyUI swap: slogan -> form -->
                <div
                    class="carousel-item relative align-top flex flex-col items-center bg-white dark:bg-gray-800 min-w-0 w-full shrink-0 basis-full sm:basis-72 md:basis-96 lg:basis-[calc(50%-24px)] mr-4 lg:p-2">
                    <label class="swap swap-flip w-full h-full cursor-pointer">
                        <input type="checkbox" v-model="createOpen" :aria-label="$t('toggleCreateForm')" />
                        <!-- swap-off: show only slogan -->
                        <div class="swap-off w-full h-full flex items-center justify-center p-6">
                            <div class="flex flex-col items-center">
                                <h2 class="card-title text-base font-semibold text-gray-900 dark:text-gray-200">
                                    {{ t('home.carousel.create.title') }}
                                </h2>
                                <p class="w-64 mx-auto">{{ t('home.carousel.create.description') }}
                                </p>
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
                                    <div class="relative z-10 flex items-center justify-center w-full h-full px-3">
                                        <div class="w-full">
                                            <input v-model="createForm.imgUrl" type="text" :placeholder="t('home.carousel.create.imageUrlPlaceholder')"
                                                   class="input input-bordered input-sm w-full" />
                                        </div>
                                    </div>
                                </div>
                            </figure>
                            <div class="lg:h-72 p-4 flex flex-col flex-1 w-full bg-white dark:bg-base-200">
                                <h2 class="card-title text-base font-semibold mb-2 text-gray-900 dark:text-gray-200">{{
                                    t('home.carousel.create.yourOwn') }}</h2>
                                <input v-model="createForm.title" type="text" :placeholder="t('home.carousel.create.titlePlaceholder')"
                                       class="input input-bordered input-sm mb-2 w-full" />
                                <textarea v-model="createForm.description" rows="3" :placeholder="t('home.carousel.create.descriptionPlaceholder')"
                                          class="textarea textarea-bordered textarea-sm mb-2 w-full"></textarea>
                                <input v-model="createForm.link" type="text" :placeholder="t('home.carousel.create.linkPlaceholder')"
                                       class="input input-bordered input-sm mb-2 w-full" />
                                <div class="mt-auto">
                                    <button @click="handleCreate" class="btn btn-md lg:btn-sm w-full md:w-auto btn-primary">{{$t('home.carousel.actions.send')}}</button>
                                </div>
                            </div>
                        </div>
                    </label>

                    <!-- Contact form overlay (opens after Create) -->
                    <div v-if="contactFormOpen" class="absolute inset-0 z-50 flex items-center justify-center p-4">
                        <div class="w-full max-w-lg bg-base-100">
                            <MicroContactForm :initialMessage="contactInitialMessage" @close="contactFormOpen = false" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Desktop arrows -->
        <button v-if="canNavigate" @click="nextSlide"
                class="absolute -right-10 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow hidden sm:flex w-10 h-10"
                :aria-label="t('home.carousel.aria.next')">
            <Icon name="tabler:chevron-right" />
        </button>
        <!-- Mobile arrows -->
        <button v-if="canNavigate" @click="prevSlide"
                class="absolute left-0 md:-left-4 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral dark:bg-accent text-white dark:bg-base-200 shadow flex sm:hidden"
                :aria-label="t('home.carousel.aria.previous')">
            <Icon name="tabler:chevron-left" />
        </button>
        <button v-if="canNavigate" @click="nextSlide"
                class="absolute right-0 md:-right-4 top-1/2 z-20 -translate-y-1/2 btn btn-circle btn-glass bg-neutral text-white dark:bg-base-200 shadow flex sm:hidden"
                :aria-label="t('home.carousel.aria.next')">
            <Icon name="tabler:chevron-right" />
        </button>
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
const { t } = useI18n();

interface CarouselItem {
    title: string;
    imgSrc?: string | undefined;
    imgAlt?: string | undefined;
    description: string;
    link: string;
    linkText: string;
    imgSourceLink?: string | undefined;
    imgSourceText?: string | undefined;
    imgAuthor?: string | undefined;
    imgLicense?: string | undefined;
    imgLicenseLink?: string | undefined;
    imgCoverType?: string | undefined;
    imgSrcSet?: string | undefined;
    imgSizes?: string | undefined;
    imgWidth?: number | undefined;
    imgHeight?: number | undefined;
    imgBlurSrc?: string | undefined;
    imgBlurWidth?: number | undefined;
    imgBlurHeight?: number | undefined;
}

const props = defineProps({
    items: {
        type: Array as PropType<CarouselItem[]>,
        required: true
    }
});

type EmblaApi = {
    scrollPrev: () => void;
    scrollNext: () => void;
    destroy: () => void;
};

const rootRef = ref<HTMLElement | null>(null);
const viewportRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const emblaApi = shallowRef<EmblaApi | null>(null);
const isReady = computed(() => !!emblaApi.value);
const totalSlides = computed(() => (props.items?.length || 0) + 1);
const canNavigate = computed(() => isReady.value && totalSlides.value > 1);
let visibilityObserver: IntersectionObserver | null = null;

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
        linkText: createForm.value.linkText || t('open'),
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
    contactInitialMessage.value = t('home.carousel.create.contactFormPrefill', { title, description, url }) as string;
    contactFormOpen.value = true;

    // reset form and close swap
    createForm.value = { title: '', description: '', imgUrl: '', link: '', linkText: '' };
    createOpen.value = false;
}
const prevSlide = () => {
    emblaApi.value?.scrollPrev();
};

const nextSlide = () => {
    emblaApi.value?.scrollNext();
};

const initEmbla = async () => {
    if (!viewportRef.value || emblaApi.value) return;

    const { default: EmblaCarousel } = await import('embla-carousel');

    emblaApi.value = EmblaCarousel(viewportRef.value, {
        align: 'center',
        containScroll: 'trimSnaps',
        loop: true,
        slidesToScroll: 2,
        breakpoints: {
            '(max-width: 1023px)': {
                slidesToScroll: 1
            }
        }
    });
};

onMounted(() => {
    if (!rootRef.value) return;

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
        visibilityObserver = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (!entry?.isIntersecting) return;
            initEmbla();
            visibilityObserver?.disconnect();
            visibilityObserver = null;
        }, { rootMargin: '200px 0px' });

        visibilityObserver.observe(rootRef.value);
        return;
    }

    initEmbla();
});

onBeforeUnmount(() => {
    visibilityObserver?.disconnect();
    visibilityObserver = null;

    if (emblaApi.value) {
        emblaApi.value.destroy();
        emblaApi.value = null;
    }
});
</script>
