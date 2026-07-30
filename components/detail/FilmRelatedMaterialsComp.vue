<template>
    <section
        id="film-related-materials"
        class="rounded-lg bg-base-100 p-4 dark:border-gray-700"
        aria-labelledby="film-related-materials-heading"
    >
        <header class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h3 id="film-related-materials-heading" class="text-base font-semibold leading-6 dark:text-white">
                    {{ $t('filmRelatedMaterials') }}
                </h3>
                <p class="mt-1 text-sm text-base-content/70">
                    {{ $t('filmRelatedMaterialsBrowserDescription') }}
                </p>
            </div>
            <span class="badge badge-outline">{{ totalMaterials }}</span>
        </header>

        <div class="mt-4 grid gap-3 lg:grid-cols-[minmax(16rem,1fr)_12rem_12rem_12rem]">
            <label class="form-control min-w-0">
                <span class="label pb-1">
                    <span class="label-text text-xs">{{ $t('search') }}</span>
                </span>
                <input
                    v-model.trim="searchText"
                    type="search"
                    class="input input-bordered input-sm w-full"
                    :placeholder="$t('filmRelatedMaterialsSearchPlaceholder')"
                />
            </label>

            <label class="form-control min-w-0">
                <span class="label pb-1">
                    <span class="label-text text-xs">{{ $t('materialType') }}</span>
                </span>
                <select v-model="categoryFilter" class="select select-bordered select-sm w-full">
                    <option value="">{{ $t('allMaterialTypes') }}</option>
                    <option v-for="category in categoryOptions" :key="category" :value="category">
                        {{ translateValue(category) }}
                    </option>
                </select>
            </label>

            <label class="form-control min-w-0">
                <span class="label pb-1">
                    <span class="label-text text-xs">{{ $t('recordType') }}</span>
                </span>
                <select v-model="typeFilter" class="select select-bordered select-sm w-full">
                    <option value="">{{ $t('allRecordTypes') }}</option>
                    <option v-for="type in typeOptions" :key="type" :value="type">
                        {{ translateValue(type) }}
                    </option>
                </select>
            </label>

            <label class="form-control min-w-0">
                <span class="label pb-1">
                    <span class="label-text text-xs">{{ $t('sortBy') }}</span>
                </span>
                <select v-model="sortMode" class="select select-bordered select-sm w-full">
                    <option value="title-asc">{{ $t('sortTitleAsc') }}</option>
                    <option value="title-desc">{{ $t('sortTitleDesc') }}</option>
                    <option value="newest">{{ $t('sortNewest') }}</option>
                    <option value="oldest">{{ $t('sortOldest') }}</option>
                </select>
            </label>
        </div>

        <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div v-if="activeFilterChips.length" class="flex flex-wrap gap-1" :aria-label="$t('selectedFilters')">
                <span
                    v-for="chip in activeFilterChips"
                    :key="chip.key"
                    class="badge badge-outline gap-1"
                >
                    {{ chip.label }}
                    <button
                        type="button"
                        class="btn btn-ghost btn-xs h-auto min-h-0 px-1"
                        :aria-label="`${$t('remove')}: ${chip.label}`"
                        @click="removeMaterialFilter(chip.key)"
                    >
                        &times;
                    </button>
                </span>
                <button type="button" class="btn btn-ghost btn-xs" @click="clearMaterialFilters">
                    {{ $t('clearMaterialFilters') }}
                </button>
            </div>
            <p class="ml-auto text-sm text-base-content/70" role="status">
                {{ filteredMaterials.length }} {{ $t('results') }}
            </p>
        </div>

        <div
            v-if="paginatedMaterials.length"
            class="mt-4 grid gap-3"
            role="list"
            :aria-label="$t('filmRelatedMaterials')"
        >
            <article
                v-for="entry in paginatedMaterials"
                :key="entry.material.handle"
                class="grid gap-3 rounded-md border border-base-300 bg-base-100 p-4 sm:grid-cols-[6rem_minmax(0,1fr)_auto]"
                role="listitem"
                :aria-labelledby="getMaterialDomId(entry.material)"
            >
                <div class="material-thumbnail" :aria-label="`${$t('previewLabel')}: ${getPrimaryTitle(entry.material)}`">
                    <div
                        v-if="entry.material.has_resource_representation?.length"
                        class="material-thumbnail__representations"
                        :class="{ 'is-single': entry.material.has_resource_representation.length === 1 }"
                    >
                        <figure
                            v-for="(representation, representationIndex) in entry.material.has_resource_representation"
                            :key="`${representation.id || 'representation'}-${representationIndex}`"
                            class="material-representation-thumbnail"
                            :title="getRepresentationLabel(representation, representationIndex)"
                            :aria-label="getRepresentationLabel(representation, representationIndex)"
                        >
                            <img
                                class="material-thumbnail__image"
                                :src="getRepresentationPreviewSrc(representation)"
                                :alt="getRepresentationPreviewAlt(representation, representationIndex)"
                                loading="lazy"
                            />
                        </figure>
                    </div>
                    <div v-else class="material-thumbnail__placeholder">
                        <Icon name="tabler:photo" class="h-5 w-5" aria-hidden="true" />
                        <span class="mt-1 block text-[11px] leading-tight">
                            {{ $t('materialPreviewUnavailable') }}
                        </span>
                    </div>
                </div>

                <div class="min-w-0">
                    <div class="mb-1 flex flex-wrap items-center gap-1">
                        <span v-if="entry.material.type" class="badge badge-sm badge-ghost">
                            {{ translateValue(entry.material.type) }}
                        </span>
                        <span
                            v-for="category in entry.material.has_object_category || []"
                            :key="category"
                            class="badge badge-sm badge-ghost"
                        >
                            {{ translateValue(category) }}
                        </span>
                        <span v-if="entry.parentTitle" class="text-xs text-base-content/60">
                            {{ $t('isPartOf') }}: {{ entry.parentTitle }}
                        </span>
                    </div>

                    <h4
                        :id="getMaterialDomId(entry.material)"
                        class="text-sm font-semibold leading-5 dark:text-white mt-2"
                    >
                        {{ getPrimaryTitle(entry.material) }}
                    </h4>

                    <dl v-if="getListFacts(entry.material).length" class="mt-3 grid gap-2 text-sm md:grid-cols-2">
                        <div
                            v-for="fact in getListFacts(entry.material)"
                            :key="fact.label"
                            class="min-w-0 rounded-md border border-base-300/70 bg-base-200/45 px-2.5 py-2"
                        >
                            <dt class="flex items-center gap-1 text-[11px] font-semibold uppercase leading-4 text-base-content/60">
                                <Icon :name="fact.icon" class="h-3.5 w-3.5" aria-hidden="true" />
                                <span>{{ fact.label }}</span>
                            </dt>
                            <dd class="mt-1 truncate text-sm leading-5 text-base-content" :title="fact.value">
                                {{ fact.value }}
                            </dd>
                        </div>
                    </dl>

                    <p v-if="getSubjectNames(entry.material)" class="mt-2 line-clamp-2 text-sm text-base-content/70">
                        <span class="font-medium">{{ $t('subjects') }}:</span>
                        {{ getSubjectNames(entry.material) }}
                    </p>
                </div>

                <a
                    v-if="entry.material.url"
                    class="btn btn-ghost btn-sm self-start"
                    :href="entry.material.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    :title="$t('openRecord')"
                    :aria-label="`${$t('openRecord')}: ${getPrimaryTitle(entry.material)}`"
                >
                    <Icon name="tabler:external-link" aria-hidden="true" />
                    <span class="sr-only">{{ $t('openRecord') }}</span>
                </a>
            </article>
        </div>

        <div v-else class="alert alert-info mt-4" role="status" :aria-label="$t('noResults')">
            <div>
                <p class="font-semibold">{{ $t('noResults') }}</p>
                <p class="text-sm">{{ $t('noFilmRelatedMaterialsResults') }}</p>
            </div>
        </div>

        <footer class="mt-4 flex flex-col gap-3 text-sm text-base-content/70">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <label class="flex items-center gap-2">
                    <span>{{ $t('rowsPerPage') }}</span>
                    <select v-model.number="pageSize" class="select select-bordered select-xs w-20">
                        <option :value="10">10</option>
                        <option :value="25">25</option>
                        <option :value="50">50</option>
                        <option :value="100">100</option>
                    </select>
                </label>

                <span>{{ pageRangeLabel }}</span>
            </div>

            <nav v-if="totalPages > 1" class="flex justify-center" role="navigation" :aria-label="$t('pagination')">
                <div class="flex flex-wrap items-center justify-center gap-1 my-1">
                    <button
                        type="button"
                        class="btn btn-sm btn-circle btn-primary btn-outline hover:text-white"
                        :disabled="currentPage <= 1"
                        :aria-label="$t('previousPage')"
                        @click="goToPage(currentPage - 1)"
                    >
                        <Icon name="tabler:chevron-left" aria-hidden="true" />
                    </button>

                    <button
                        v-for="page in paginationPageNumbers"
                        :key="page"
                        type="button"
                        class="btn btn-sm btn-circle text-center"
                        :class="page === currentPage
                            ? 'btn-accent text-white!'
                            : 'btn-primary btn-outline hover:text-white'"
                        :aria-current="page === currentPage ? 'page' : undefined"
                        :aria-label="`${$t('page')} ${page}`"
                        @click="goToPage(page)"
                    >
                        {{ page }}
                    </button>

                    <button
                        type="button"
                        class="btn btn-sm btn-circle btn-primary btn-outline hover:text-white"
                        :disabled="currentPage >= totalPages"
                        :aria-label="$t('nextPage')"
                        @click="goToPage(currentPage + 1)"
                    >
                        <Icon name="tabler:chevron-right" aria-hidden="true" />
                    </button>
                </div>
            </nav>
        </footer>
    </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    getFilmRelatedMaterialsForWork,
    type DisplayFilmRelatedMaterial,
} from '~/composables/useFilmRelatedMaterials';

type DisplayRow = {
    label: string;
    value: string;
    icon: string;
};

type MaterialListEntry = {
    material: DisplayFilmRelatedMaterial;
    parentTitle?: string;
    representationCount: number;
};

type FilterChipKey = 'search' | 'category' | 'type';
type RepresentationResource = NonNullable<DisplayFilmRelatedMaterial['has_resource_representation']>[number];

const REPRESENTATION_PLACEHOLDER_SRC = '/img/img_placeholder_150.webp';

const props = defineProps({
    workVariantId: {
        type: String,
        required: true
    }
});

const { t } = useI18n();
const collator = new Intl.Collator(undefined, { sensitivity: 'base', numeric: true });

const searchText = ref('');
const categoryFilter = ref('');
const typeFilter = ref('');
const sortMode = ref<'title-asc' | 'title-desc' | 'newest' | 'oldest'>('title-asc');
const pageSize = ref(10);
const currentPage = ref(1);

const filmMaterials = computed<DisplayFilmRelatedMaterial[]>(() =>
    getFilmRelatedMaterialsForWork(props.workVariantId)
);

const totalMaterials = computed(() => filmMaterials.value.length);

const materialsByHandle = computed(() =>
    new Map(filmMaterials.value.map((material) => [material.handle, material]))
);

const materialEntries = computed<MaterialListEntry[]>(() =>
    filmMaterials.value.map((material) => {
        const parent = getParent(material);

        return {
            material,
            parentTitle: parent ? getPrimaryTitle(parent) : undefined,
            representationCount: material.has_resource_representation?.length || 0,
        };
    })
);

const categoryOptions = computed(() =>
    uniqueSorted(materialEntries.value.flatMap((entry) => entry.material.has_object_category || []))
);

const typeOptions = computed(() =>
    uniqueSorted(materialEntries.value.map((entry) => entry.material.type || '').filter(Boolean))
);

const filteredMaterials = computed<MaterialListEntry[]>(() => {
    const query = searchText.value.trim().toLowerCase();

    return materialEntries.value
        .filter((entry) => {
            const material = entry.material;

            if (categoryFilter.value && !(material.has_object_category || []).includes(categoryFilter.value)) {
                return false;
            }

            if (typeFilter.value && material.type !== typeFilter.value) {
                return false;
            }

            if (!query) return true;

            return getSearchHaystack(material).includes(query);
        })
        .sort((a, b) => sortMaterials(a.material, b.material));
});

const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredMaterials.value.length / pageSize.value))
);

const paginatedMaterials = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredMaterials.value.slice(start, start + pageSize.value);
});

const PAGINATION_WINDOW_SIZE = 5;

const paginationPageNumbers = computed(() => {
    const total = totalPages.value;
    if (total <= PAGINATION_WINDOW_SIZE) {
        return Array.from({ length: total }, (_, index) => index + 1);
    }

    const half = Math.floor(PAGINATION_WINDOW_SIZE / 2);
    let start = Math.max(1, currentPage.value - half);
    const end = Math.min(total, start + PAGINATION_WINDOW_SIZE - 1);
    start = Math.max(1, end - PAGINATION_WINDOW_SIZE + 1);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
});

const pageRangeLabel = computed(() => {
    if (!filteredMaterials.value.length) {
        return `${t('page')} 1 / 1`;
    }

    const start = (currentPage.value - 1) * pageSize.value + 1;
    const end = Math.min(currentPage.value * pageSize.value, filteredMaterials.value.length);
    return `${start}-${end} / ${filteredMaterials.value.length}`;
});

const activeFilterChips = computed(() => {
    const chips: { key: FilterChipKey; label: string }[] = [];
    if (searchText.value) chips.push({ key: 'search', label: searchText.value });
    if (categoryFilter.value) chips.push({ key: 'category', label: translateValue(categoryFilter.value) });
    if (typeFilter.value) chips.push({ key: 'type', label: translateValue(typeFilter.value) });
    return chips;
});

function getParent(material: DisplayFilmRelatedMaterial): DisplayFilmRelatedMaterial | undefined {
    const parentHandle = material.is_part_of?.find((parent) => parent.id && materialsByHandle.value.has(parent.id))?.id;
    return parentHandle ? materialsByHandle.value.get(parentHandle) : undefined;
}

function getPrimaryTitle(material: DisplayFilmRelatedMaterial): string {
    return material.has_primary_title?.has_name || material.handle;
}

function getMaterialDomId(material: DisplayFilmRelatedMaterial): string {
    const slug = material.handle.replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
    return `film-related-material-${slug}`;
}

function getRepresentationPreviewSrc(representation: RepresentationResource): string {
    const id = representation?.id?.trim() || '';
    if (!id || id.startsWith('placeholderpath/')) return REPRESENTATION_PLACEHOLDER_SRC;
    if (!/\.(avif|gif|jpe?g|png|webp)(\?.*)?$/i.test(id)) return REPRESENTATION_PLACEHOLDER_SRC;
    if (/^https?:\/\//i.test(id) || id.startsWith('/')) return id;
    return `/${id.replace(/^public\//, '')}`;
}

function getRepresentationLabel(representation: RepresentationResource, index: number): string {
    const id = representation?.id?.trim();
    if (!id) return `${t('previewLabel')} ${index + 1}`;
    return id.replace(/^placeholderpath\//, '');
}

function getRepresentationPreviewAlt(representation: RepresentationResource, index: number): string {
    const id = representation?.id?.trim() || '';
    if (!id || id.startsWith('placeholderpath/')) return '';
    return getRepresentationLabel(representation, index);
}

function compactJoin(values: Array<string | undefined>): string {
    return values.filter((value): value is string => Boolean(value)).join(', ');
}

function uniqueSorted(values: string[]): string[] {
    return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
        collator.compare(translateValue(a), translateValue(b))
    );
}

function translateValue(value: string): string {
    const translated = t(value);
    return translated !== value ? translated : value;
}

function getInventoryNumbers(material: DisplayFilmRelatedMaterial): string {
    return compactJoin((material.has_inventory_number || []).map((inventoryNumber) => inventoryNumber.id));
}

function getEventSummary(material: DisplayFilmRelatedMaterial): string {
    const events = material.has_event || [];
    const values = events.flatMap((event) => [
        event.has_date,
        ...(event.located_in || []).map((location) => location.has_name),
    ]);
    return compactJoin(values);
}

function getListFacts(material: DisplayFilmRelatedMaterial): DisplayRow[] {
    return [
        { label: t('issuer'), value: material.described_by?.has_issuer_name || '', icon: 'tabler:building-bank' },
        { label: t('inventoryNumber'), value: getInventoryNumbers(material), icon: 'tabler:barcode' },
        { label: t('event'), value: getEventSummary(material), icon: 'tabler:calendar-event' },
        { label: t('material'), value: compactJoin(material.has_material || []), icon: 'tabler:box' },
        { label: t('technique'), value: compactJoin(material.has_technique || []), icon: 'tabler:tools' },
    ].filter((row) => row.value);
}

function getSubjectNames(material: DisplayFilmRelatedMaterial): string {
    return compactJoin((material.has_subject || []).map((subject) => subject.has_name));
}

function getSearchHaystack(material: DisplayFilmRelatedMaterial): string {
    return [
        material.handle,
        material.url,
        getPrimaryTitle(material),
        material.type,
        material.described_by?.has_issuer_name,
        material.described_by?.has_issuer_id,
        ...(material.described_by?.has_source_key || []),
        ...(material.has_object_category || []),
        ...(material.has_material || []),
        ...(material.has_technique || []),
        ...(material.has_note || []),
        ...((material.has_inventory_number || []).map((inventoryNumber) => inventoryNumber.id)),
        ...((material.has_subject || []).map((subject) => subject.has_name)),
        ...((material.has_event || []).flatMap((event) => [
            event.category,
            event.has_date,
            ...((event.located_in || []).map((location) => location.has_name)),
        ])),
    ].filter(Boolean).join(' ').toLowerCase();
}

function getComparableDate(material: DisplayFilmRelatedMaterial): number {
    const timestamp = material['@timestamp'];
    if (timestamp) {
        const parsed = Date.parse(timestamp);
        if (!Number.isNaN(parsed)) return parsed;
    }

    const eventDate = material.has_event?.find((event) => event.has_date)?.has_date;
    if (!eventDate) return 0;

    const year = eventDate.match(/\d{4}/)?.[0];
    return year ? Number(year) : 0;
}

function sortMaterials(a: DisplayFilmRelatedMaterial, b: DisplayFilmRelatedMaterial): number {
    if (sortMode.value === 'newest') return getComparableDate(b) - getComparableDate(a);
    if (sortMode.value === 'oldest') return getComparableDate(a) - getComparableDate(b);

    const titleCompare = collator.compare(getPrimaryTitle(a), getPrimaryTitle(b));
    return sortMode.value === 'title-desc' ? -titleCompare : titleCompare;
}

function goToPage(page: number) {
    currentPage.value = Math.min(Math.max(1, page), totalPages.value);
}

function removeMaterialFilter(key: FilterChipKey) {
    if (key === 'search') searchText.value = '';
    if (key === 'category') categoryFilter.value = '';
    if (key === 'type') typeFilter.value = '';
}

function clearMaterialFilters() {
    searchText.value = '';
    categoryFilter.value = '';
    typeFilter.value = '';
}

watch(
    [searchText, categoryFilter, typeFilter, sortMode, pageSize],
    () => {
        currentPage.value = 1;
    }
);

watch(
    () => filteredMaterials.value.length,
    () => {
        if (currentPage.value > totalPages.value) {
            currentPage.value = totalPages.value;
        }
    }
);
</script>

<style scoped>
.material-thumbnail {
    display: flex;
    width: 6rem;
    height: 6rem;
    min-width: 6rem;
    min-height: 6rem;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 1px solid var(--color-base-300);
    border-radius: .25rem;
    background: var(--color-base-200);
    color: color-mix(in oklab, var(--color-base-content) 60%, transparent);
}

.material-thumbnail__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.material-thumbnail__placeholder {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    text-align: center;
}

.material-thumbnail__representations {
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.25rem;
    overflow: auto;
    padding: 0.25rem;
}

.material-thumbnail__representations.is-single {
    display: block;
    padding: 0;
    overflow: hidden;
}

.material-representation-thumbnail {
    aspect-ratio: 1 / 1;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    border-radius: 0.25rem;
    background: var(--color-base-100);
}

.material-thumbnail__representations.is-single .material-representation-thumbnail {
    width: 100%;
    height: 100%;
    border-radius: 0;
}
</style>
