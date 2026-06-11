<template>
    <section
        v-if="materialSlides.length > 0"
        class="col-span-12 rounded-lg border border-gray-200 p-2 dark:border-gray-700"
        aria-labelledby="film-related-materials"
    >
        <header class="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 id="film-related-materials" class="text-base font-medium leading-5 dark:text-white">
                {{ $t('filmRelatedMaterials') }}
            </h3>
            <span class="badge badge-outline">{{ materialSlides.length }}</span>
        </header>

        <div
            ref="rootRef"
            class="relative w-full"
            role="region"
            aria-roledescription="carousel"
            :aria-label="$t('filmRelatedMaterials')"
        >
            <p class="sr-only" aria-live="polite">
                {{ carouselStatus }}
            </p>

            <button
                v-if="canNavigate"
                type="button"
                class="absolute -left-2 sm:-left-4 top-1/2 z-20 -translate-y-1/2 btn-carousel-control w-8 h-8 2xl:w-10 2xl:h-10"
                :aria-label="t('home.carousel.aria.previous')"
                :aria-controls="carouselViewportId"
                @click="prevSlide"
            >
                <Icon name="tabler:chevron-left" aria-hidden="true" />
            </button>

            <div
                :id="carouselViewportId"
                ref="viewportRef"
                class="w-full overflow-hidden rounded-box"
            >
                <div ref="containerRef" class="flex items-start touch-pan-y">
                    <article
                        v-for="(entry, index) in materialSlides"
                        :key="entry.material.handle"
                        class="flex min-w-0 w-full shrink-0 basis-full box-border flex-col self-start rounded-md border border-gray-100 bg-white p-6 2xl:p-8 dark:border-gray-800 dark:bg-gray-900"
                        role="group"
                        aria-roledescription="slide"
                        :aria-labelledby="getMaterialDomId(entry.material)"
                        :aria-label="getSlideAriaLabel(entry, index)"
                        :aria-hidden="isSlideHidden(index) ? 'true' : undefined"
                        :inert="isSlideHidden(index)"
                    >
                        <header class="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 max-w-full">
                            <div class="min-w-0">
                                <div class="mb-2 flex flex-wrap items-center gap-1">
                                    <span class="badge badge-xs badge-outline">
                                        {{ t('selectedLevel') }} {{ entry.depth + 1 }}
                                    </span>
                                    <span v-if="entry.parentTitle" class="text-xs text-base-content/60">
                                        {{ $t('isPartOf') }}: {{ entry.parentTitle }}
                                    </span>
                                </div>

                                <h4
                                    :id="getMaterialDomId(entry.material)"
                                    class="text-sm font-semibold leading-5 dark:text-white"
                                >
                                    {{ getPrimaryTitle(entry.material) }}
                                </h4>

                                <div class="mt-2 flex flex-wrap gap-1">
                                    <MicroLabelComp v-if="entry.material.type" :label-text="entry.material.type" />
                                    <span
                                        v-for="category in entry.material.has_object_category"
                                        :key="category"
                                        class="badge badge-sm badge-ghost"
                                    >
                                        {{ category }}
                                    </span>
                                </div>
                            </div>
                            <DetailSameAsComp
                                v-if="entry.material.url"
                                class="shrink-0 p-1"
                                :same-as-data="[{ id: entry.material.url, category: 'avefi:URL' }]"
                            />
                        </header>

                        <dl v-if="getKeyFacts(entry.material).length" class="mt-4 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                            <div
                                v-for="fact in getKeyFacts(entry.material)"
                                :key="fact.label"
                                class="min-w-0 rounded-md bg-base-200/60 p-2"
                            >
                                <dt class="text-xs font-medium uppercase text-base-content/60">
                                    {{ fact.label }}
                                </dt>
                                <dd class="mt-1 break-words leading-5">
                                    {{ fact.value }}
                                </dd>
                            </div>
                        </dl>

                        <section
                            v-if="entry.material.has_event?.length"
                            class="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800"
                            :aria-label="$t('event')"
                        >
                            <h5 class="text-xs font-medium uppercase text-base-content/60">
                                {{ $t('event') }}
                            </h5>

                            <div class="mt-2 grid gap-2">
                                <div
                                    v-for="(event, eventIndex) in entry.material.has_event"
                                    :key="`${event.category}-${event.has_date || ''}-${eventIndex}`"
                                    class="rounded-md border border-gray-100 p-2 text-sm dark:border-gray-800"
                                >
                                    <div class="flex flex-wrap items-center gap-2">
                                        <MicroLabelComp v-if="event.category" :label-text="event.category" />
                                        <span v-if="event.has_date" class="leading-5">
                                            {{ event.has_date }}
                                        </span>
                                    </div>

                                    <div v-if="event.located_in?.length" class="mt-2 grid gap-2">
                                        <div
                                            v-for="location in event.located_in"
                                            :key="`${location.category}-${location.has_name}`"
                                            class="flex min-w-0 items-start justify-between gap-2 rounded-md bg-base-200/60 p-2"
                                        >
                                            <div class="min-w-0">
                                                <MicroLabelComp v-if="location.category" :label-text="location.category" />
                                                <div class="mt-1 break-words leading-5">
                                                    {{ location.has_name }}
                                                </div>
                                            </div>

                                            <DetailSameAsComp
                                                v-if="location.same_as?.length"
                                                class="shrink-0"
                                                :same-as-data="location.same_as"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div
                            v-if="hasStructuredDetails(entry.material)"
                            class="mt-4 grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 dark:border-gray-800 md:grid-cols-2"
                        >
                            <section v-if="entry.material.has_subject?.length" :aria-label="$t('subjects')">
                                <h5 class="text-xs font-medium uppercase text-base-content/60">
                                    {{ $t('subjects') }}
                                </h5>
                                <ul class="mt-2 flex flex-wrap gap-1">
                                    <li
                                        v-for="subject in entry.material.has_subject"
                                        :key="subject.has_name"
                                        class="badge badge-sm"
                                    >
                                        {{ subject.has_name }}
                                    </li>
                                </ul>
                            </section>

                            <section v-if="getPhysicalProperties(entry.material).length" :aria-label="$t('material')">
                                <h5 class="text-xs font-medium uppercase text-base-content/60">
                                    {{ $t('material') }}
                                </h5>
                                <dl class="mt-2 grid gap-2">
                                    <div
                                        v-for="property in getPhysicalProperties(entry.material)"
                                        :key="property.label"
                                        class="grid grid-cols-[6rem_minmax(0,1fr)] gap-2 text-sm"
                                    >
                                        <dt class="text-base-content/60">{{ property.label }}</dt>
                                        <dd class="wrap-break-words">{{ property.value }}</dd>
                                    </div>
                                </dl>
                            </section>

                            <section v-if="entry.material.has_dimensions?.length" class="md:col-span-2" :aria-label="$t('dimensions')">
                                <h5 class="text-xs font-medium uppercase text-base-content/60">
                                    {{ $t('dimensions') }}
                                </h5>
                                <dl class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div
                                        v-for="dimension in entry.material.has_dimensions"
                                        :key="`${dimension.has_type}-${dimension.has_value}-${dimension.has_note || ''}`"
                                        class="rounded-md border border-gray-100 p-2 text-sm dark:border-gray-800"
                                    >
                                        <dt class="font-medium">{{ dimension.has_type }}</dt>
                                        <dd class="mt-1">{{ formatDimension(dimension) }}</dd>
                                    </div>
                                </dl>
                            </section>
                        </div>

                        <section
                            v-if="entry.material.has_note?.length"
                            class="mt-4 rounded-md bg-base-200/60 p-3 text-sm"
                            :aria-label="$t('notes')"
                        >
                            <h5 class="text-xs font-medium uppercase text-base-content/60">
                                {{ $t('notes') }}
                            </h5>
                            <ul class="mt-2 space-y-2">
                                <li v-for="note in entry.material.has_note" :key="note" class="leading-5">
                                    {{ note }}
                                </li>
                            </ul>
                        </section>
                    </article>
                </div>
            </div>

            <button
                v-if="canNavigate"
                type="button"
                class="absolute right-2 sm:-right-6 top-1/2 z-20 -translate-y-1/2 btn-carousel-control w-8 h-8 2xl:w-10 2xl:h-10"
                :aria-label="t('home.carousel.aria.next')"
                :aria-controls="carouselViewportId"
                @click="nextSlide"
            >
                <Icon name="tabler:chevron-right" aria-hidden="true" />
            </button>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import filmRelatedMaterialsMockup from '~/assets/data/filmrelated_materials_mockup_06052026.json';

type FilmRelatedMaterialWrapper = {
    handle: string;
    url?: string;
    has_record?: FilmRelatedMaterialRecord;
};

type FilmRelatedWorkHit = {
    _source?: {
        handle?: string;
        related_material?: FilmRelatedMaterialWrapper[];
    };
};

type NamedResource = {
    has_name?: string;
};

type RelatedLocation = {
    category?: string;
    has_name?: string;
    same_as?: {
        category: string;
        id: string;
    }[];
};

type RelatedEvent = {
    category?: string;
    has_date?: string;
    located_in?: RelatedLocation[];
};

type Dimension = {
    has_type?: string;
    has_unit?: string;
    has_value?: string;
    has_note?: string;
};

type FilmRelatedMaterialRecord = {
    type?: string;
    described_by?: {
        has_issuer_name?: string;
    };
    has_primary_title?: {
        has_name?: string;
    };
    has_inventory_number?: {
        id?: string;
    }[];
    is_part_of?: {
        id?: string;
    }[];
    has_object_category?: string[];
    has_event?: RelatedEvent[];
    has_subject?: NamedResource[];
    has_material?: string[];
    has_technique?: string[];
    has_note?: string[];
    has_dimensions?: Dimension[];
};

type DisplayFilmRelatedMaterial = FilmRelatedMaterialRecord & {
    handle: string;
    url?: string;
};

type DisplayRow = {
    label: string;
    value: string;
};

type MaterialSlide = {
    material: DisplayFilmRelatedMaterial;
    depth: number;
    parentTitle?: string;
};

type EmblaApi = {
    scrollPrev: () => void;
    scrollNext: () => void;
    selectedScrollSnap: () => number;
    slidesInView: () => number[];
    on: (event: 'select' | 'reInit', cb: () => void) => void;
    off: (event: 'select' | 'reInit', cb: () => void) => void;
    destroy: () => void;
};

const props = defineProps({
    workVariantId: {
        type: String,
        required: true
    }
});

const { t } = useI18n();
const rootRef = ref<HTMLElement | null>(null);
const viewportRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const emblaApi = shallowRef<EmblaApi | null>(null);
const visibleSlideIndexes = ref(new Set<number>());
const currentSlideIndex = ref(0);
let visibilityObserver: IntersectionObserver | null = null;
const carouselViewportId = 'film-related-materials-carousel';

const filmRelatedWorks = filmRelatedMaterialsMockup as unknown as FilmRelatedWorkHit[];

const filmMaterials = computed<DisplayFilmRelatedMaterial[]>(() => {
    const work = filmRelatedWorks.find((item) => item._source?.handle === props.workVariantId);

    return (work?._source?.related_material || []).map((material) => ({
        ...material.has_record,
        handle: material.handle,
        url: material.url
    }));
});

const materialSlides = computed<MaterialSlide[]>(() => {
    const byHandle = new Map(filmMaterials.value.map((material) => [material.handle, material]));

    function getParent(material: DisplayFilmRelatedMaterial): DisplayFilmRelatedMaterial | undefined {
        const parentHandle = material.is_part_of?.find((parent) => parent.id && byHandle.has(parent.id))?.id;
        return parentHandle ? byHandle.get(parentHandle) : undefined;
    }

    function getDepth(material: DisplayFilmRelatedMaterial, seen = new Set<string>()): number {
        if (seen.has(material.handle)) return 0;

        const parent = getParent(material);
        if (!parent) return 0;

        const nextSeen = new Set(seen);
        nextSeen.add(material.handle);
        return getDepth(parent, nextSeen) + 1;
    }

    return filmMaterials.value.map((material) => {
        const parent = getParent(material);

        return {
            material,
            depth: getDepth(material),
            parentTitle: parent ? getPrimaryTitle(parent) : undefined
        };
    });
});

const isReady = computed(() => !!emblaApi.value);
const canNavigate = computed(() => isReady.value && materialSlides.value.length > 1);
const carouselStatus = computed(() => {
    const total = materialSlides.value.length;
    if (!total) return '';

    const index = Math.min(currentSlideIndex.value, total - 1);
    return `${getPrimaryTitle(materialSlides.value[index].material)} (${index + 1} / ${total})`;
});

function prevSlide() {
    emblaApi.value?.scrollPrev();
}

function nextSlide() {
    emblaApi.value?.scrollNext();
}

function updateVisibleSlides() {
    visibleSlideIndexes.value = new Set(emblaApi.value?.slidesInView() || []);
    currentSlideIndex.value = emblaApi.value?.selectedScrollSnap() || 0;
}

function destroyEmbla() {
    if (!emblaApi.value) return;

    emblaApi.value.off('select', updateVisibleSlides);
    emblaApi.value.off('reInit', updateVisibleSlides);
    emblaApi.value.destroy();
    emblaApi.value = null;
    visibleSlideIndexes.value = new Set<number>();
    currentSlideIndex.value = 0;
}

async function initEmbla() {
    if (!viewportRef.value || emblaApi.value || materialSlides.value.length <= 1) return;

    const { default: EmblaCarousel } = await import('embla-carousel');

    emblaApi.value = EmblaCarousel(viewportRef.value, {
        align: 'start',
        containScroll: 'trimSnaps',
        loop: materialSlides.value.length > 2,
        slidesToScroll: 1
    });

    emblaApi.value.on('select', updateVisibleSlides);
    emblaApi.value.on('reInit', updateVisibleSlides);
    updateVisibleSlides();
}

function getPrimaryTitle(material: DisplayFilmRelatedMaterial): string {
    return material.has_primary_title?.has_name || material.handle;
}

function getMaterialDomId(material: DisplayFilmRelatedMaterial): string {
    const slug = material.handle.replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
    return `film-related-material-${slug}`;
}

function getSlideAriaLabel(entry: MaterialSlide, index: number): string {
    return `${getPrimaryTitle(entry.material)} (${index + 1} / ${materialSlides.value.length})`;
}

function isSlideHidden(index: number): boolean {
    return isReady.value && !visibleSlideIndexes.value.has(index);
}

function compactJoin(values: Array<string | undefined>): string {
    return values.filter((value): value is string => Boolean(value)).join(', ');
}

function getInventoryNumbers(material: DisplayFilmRelatedMaterial): string {
    return compactJoin((material.has_inventory_number || []).map((inventoryNumber) => inventoryNumber.id));
}

function getKeyFacts(material: DisplayFilmRelatedMaterial): DisplayRow[] {
    return [
        { label: t('issuer'), value: material.described_by?.has_issuer_name || '' },
        { label: t('inventoryNumber'), value: getInventoryNumbers(material) }
    ].filter((row) => row.value);
}

function getPhysicalProperties(material: DisplayFilmRelatedMaterial): DisplayRow[] {
    return [
        { label: t('material'), value: compactJoin(material.has_material || []) },
        { label: t('technique'), value: compactJoin(material.has_technique || []) }
    ].filter((row) => row.value);
}

function hasStructuredDetails(material: DisplayFilmRelatedMaterial): boolean {
    return !!(
        material.has_subject?.length ||
        material.has_dimensions?.length ||
        getPhysicalProperties(material).length
    );
}

function formatDimension(dimension: Dimension): string {
    const value = compactJoin([dimension.has_value, dimension.has_unit]);
    return dimension.has_note ? `${value} (${dimension.has_note})` : value;
}

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

watch(
    () => materialSlides.value.length,
    () => {
        destroyEmbla();
        initEmbla();
    }
);

onBeforeUnmount(() => {
    visibilityObserver?.disconnect();
    visibilityObserver = null;
    destroyEmbla();
});
</script>