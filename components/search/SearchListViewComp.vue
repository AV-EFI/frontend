<template>
    <div v-for="work in items" :key="work.handle"
         class="card bg-white border-base-200 border-2 shadow-md rounded-xl dark:bg-gray-900 w-full hover:shadow-xl mb-4"
         role="region" :aria-label="`${$t('title')}: ${work?.has_record?.has_primary_title?.has_name}`">
        <div v-if="showAdminStats"
             class="w-full rounded-t-xl p-4 flex flex-row justify-between items-center h-8 bg-primary/10 text-primary dark:bg-gray-900 dark:text-white text-sm">
            <span>{{ $t('statusLabel') }}: <span class="badge badge-success text-white">{{ $t('publicStatus') }}</span></span>
            <span>{{ $t('lastedit') }}: {{ new Date(work?.['@timestamp']??'').toLocaleString('de-DE') }}</span>
            <span>{{ work?.has_record?.described_by?.has_issuer_name }}</span>
            <button class="btn btn-xs btn-primary">
                {{ $t('showHistory') }}
            </button>
        </div>
        <header class="card-body p-4 pb-2 gap-y-0" :aria-labelledby="`work-title-${work?.handle ?? ''}`">
            <div class="flex flex-row justify-between">
                <div class="w-3/5 lg:w-4/5">
                    <div class="w-full flex flex-row justfiy-start items-center mb-1">
                        <GlobalClipboardComp
                            class="text-regular hidden lg:flex flex-row items-center whitespace-break-spaces text-xs! dark:text-gray-300 text-left muted"
                            :display-text="`${work?.handle ?? ''}`"
                            :copy-text="`${useRuntimeConfig().public.AVEFI_COPY_PID_URL}${work?.handle ?? ''}`" tabindex="0"
                            role="button" :aria-label="`${$t('copyToClipboard')}: ${work?.handle ?? ''}`" />
                        <MicroBadgeCategoryComp :category="work?.category || 'avefi:WorkVariant'" :dense="false"
                                                class="ml-2 hidden lg:inline-block" />
                        <!-- Badge for all items empty -->
                        <span v-if="allItemsEmpty(work)" class="badge badge-userinfo badge-sm lg:ml-2 dark:text-black"
                              :title="$t('allItemsEmptyTooltip')">
                            <Icon name="tabler:alert-circle" class="w-3 h-3 2xl:mr-1" />
                            <span class="hidden 2xl:inline-block text-xs">
                                {{ $t('allItemsEmpty') }}
                            </span>
                        </span>

                    </div>
                    <h2 :id="`work-title-${work?.handle ?? ''}`"
                        class="card-title flex-col-reverse lg:flex-row text-lg font-semibold items-start">
                        <NuxtLink v-if="work?.handle" :to="`/res/${work.handle}`"
                                  class="link link-hover dark:link-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded text-left leading-5 my-1"
                                  :aria-label="`${get(work, 'has_record.has_primary_title.has_name') || work?.handle || $t('title')}`"
                                  target="_blank">
                            {{ get(work, 'has_record.has_primary_title.has_name') || work?.handle || $t('title') }}
                        </NuxtLink>
                        <span v-else>
                            {{ get(work, 'has_record.has_primary_title.has_name') || work?.handle || $t('title') }}
                        </span>
                    </h2>
                    
                    
                    <h3 v-if="work?.has_record?.has_alternative_title" class="muted text-left">
                        <ul v-if="work?.has_record?.has_alternative_title">
                            <li v-for="alt in work?.has_record?.has_alternative_title" :key="alt.has_name" tabindex="0"
                                :aria-label="`${$t('alternativeTitle')}: ${alt.has_name} (${$t(alt.type)})`">
                                {{ alt.has_name }} ({{ $t(alt.type) }})
                            </li>
                        </ul>
                    </h3>
                </div>
                <div class="w-2/5 lg:w-1/5 flex-row flex-wrap justify-end items-start lg:items-end mr-0 mt-2 md:my-auto flex"
                     role="group" :aria-label="$t('actions')">
                    <NuxtLink v-if="work?.handle" :to="`/res/${work.handle}`"
                              class="btn btn-circle btn-outline btn-md mr-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                              :aria-label="`${$t('detailviewlink')}: ${get(work, 'has_record.has_primary_title.has_name') || work?.handle}`"
                              :title="$t('detailviewlink')" target="_blank">
                        <Icon name="tabler:eye" class="text-2xl" aria-hidden="true" />
                    </NuxtLink>
                    <GlobalActionContextComp v-if="work" :item="work" />
                </div>
            </div>

            <div class="mt-2 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.618fr)_minmax(18rem,1fr)] xl:items-stretch">
                <SearchGenericIconList :data="work" level="work" />
                <Transition name="fade" mode="out-in">
                    <div v-if="work && work.handle && showHighlight[work.handle] && getHighlightSnippets(work).length > 0"
                         class="h-full text-sm highlight-snippets text-left xl:border-l xl:border-base-300 xl:pl-3 bg-base-100 p-2" tabindex="0" role="region"
                         :aria-label="$t('lookWhatWeFound')">
                        <span>
                            {{ $t('lookWhatWeFound') }}
                        </span>
                        <ul>
                            <SearchHighlightMatchComp v-for="(entry, i) in getHighlightSnippets(work)" :key="i + entry.value"
                                                      :value="entry.value" :field="entry.key" />
                        </ul>
                    </div>
                </Transition>
            </div>
        </header>

        <div class="border-t border-base-300 pt-2 bg-base-200 dark:bg-gray-800 px-3 py-2 flex justify-center rounded-b-xl">
            <button v-if="work && work.handle"
                    class="btn btn-primary btn-xs my-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    :aria-label="`${isExpanded[work.handle] ? $t('hideDetails') : $t('showManifestItems')}: ${get(work, 'has_record.has_primary_title.has_name') || work?.handle}`"
                    :title="$t('toggleDetails')" :aria-expanded="isExpanded[work.handle] || false"
                    :aria-controls="`details-${work.handle}`"
                    @click="isExpanded[work.handle] = !isExpanded[work.handle]; showHighlight[work.handle] = !showHighlight[work.handle]">
                <Icon :name="isExpanded[work.handle] ? 'tabler:minus' : 'tabler:plus'" class="text-sm"
                      aria-hidden="true" />
                <span class="text-xs">
                    {{ isExpanded[work.handle] ? $t('hideDetails') : $t('showManifestItems') }}
                </span>
            </button>
            <span v-if="refinementsActive" :title="$t('tooltip.refinementsActive')"
                  class="badge badge-sm bg-highlight animate-pulse" />
        </div>
        <div v-show="work && work.handle && isExpanded[work.handle]" :id="`details-${work.handle}`"
             class="card-body p-2 pt-0" role="region" :aria-labelledby="`work-title-${work?.handle ?? ''}`">
            <!-- EO WorkVariant -->
            <!-- Manifestations -->
            <hr class="my-2">
            <div class="flex flex-col">
                <h3 class="relative font-bold text-md mb-2 pl-1 pr-4 text-gray-800 dark:text-base-content"
                    :aria-label="$t('tooltip.manifestation')">
                    {{ $t('manifestations') }}

                    <!-- Info icon positioned inside <h3> -->
                    <GlobalTooltipInfo :text="$t('tooltip.manifestation')" class="absolute ml-2" />
                </h3>
                <SearchManifestationListSplitView :key="`${work?.handle ?? 'work'}:${refinementSignature}:${searchUpdateTick}`"
                                                  :manifestations="getFilteredManifestations(work)"
                                                  :get-filtered-items="getFilteredItems" :work-variant-handle="work?.handle"
                                                  :refinement-signature="refinementSignature"
                                                  :search-update-tick="searchUpdateTick" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { allItemsEmpty, get } from '@/composables/useItemEmpty';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import type { SearchWorkHit, SearchManifestation, SearchItem } from '@/models/interfaces/manual/ISearchWorkHit';

type InnerHits<T> = Record<string, { hits?: { hits?: Array<{ _source: T; inner_hits?: unknown }> } }>;
type WorkHit = SearchWorkHit & { inner_hits?: InnerHits<SearchManifestation> };
type ManifestationHit = SearchManifestation & { inner_hits?: InnerHits<SearchItem> };
type HighlightValue = { value?: string; matchLevel?: string; matchedWords?: string[] };

const route = useRoute();

const activeGenres = ref<string[]>([]);
const activeSubjects = ref<string[]>([]);
const activeHasForm = ref<string[]>([]);
const activeProduction = ref<string[]>([]);

function parseRefinementsFromUrl(href: string) {
    const url = new URL(href);
    const params = new URLSearchParams(url.search);

    const result: Record<string, string[]> = {
        has_genre_has_name: [],
        subjects: [],
        has_form_has_name: [],
        production_type: [],
        production_year_start: [],
        production_year_end: [],
        has_sound_type: [],
        in_language_code: [],
        creators: [],
        directors_or_editors: [],
        castmembers: [],
        production: [],
        located_in_has_name: [],
        has_duration_has_value: [],
        has_issuer_name: [],
        has_format_type: [],
        manifestation_event_type: [],
        has_colour_type: [],
        item_element_type: [],
        has_form: []
    };

    for (const [key, value] of params.entries()) {
        // Match keys like: [refinementList][has_genre_has_name][0]
        const match = key.match(/\[refinementList]\[([^\]]+)](?:\[\d+])?$/);
        if (match) {
            const facet = match[1];
            if (facet && facet in result) {
                result[facet]?.push(value);
            }
        }
    }

    return result;
}

const refinementsActive = ref(false);

const updateFromHref = () => {
    const refinements = parseRefinementsFromUrl(window.location.href);
    activeGenres.value = refinements.has_genre_has_name || [];
    activeSubjects.value = refinements.subjects || [];
    activeHasForm.value = refinements.has_form_has_name || [];
    activeProduction.value = refinements.production_type || [];
    refinementsActive.value = Object.values(refinements).some(arr => arr.length > 0);
};

// InstantSearch's router.write patch in InstantSearchTemplateAVefi keeps Vue Router in
// sync after every IS URL change. Watching route.query here replaces the old 200 ms
// polling loop and the fake pushstate/replacestate listeners (which never fired anyway),
// giving a single reactive trigger for both IS-driven and browser-navigation changes.
watch(() => route.query, () => {
    if (typeof window !== 'undefined') updateFromHref();
}, { deep: true, immediate: true });
const { t: $t } = useI18n();
const props = defineProps({
    items: {
        type: Array as PropType<Array<SearchWorkHit>>,
        required: true
    },
    productionDetailsChecked: {
        type: Boolean,
        required: true,
    },
    showAdminStats: {
        type: Boolean,
        required: false,
        default: false,
    },
    expandedHandles: {
        type: Set as PropType<Set<string>>,
        required: false,
        default: () => new Set<string>(),
    },
    expandAllHandlesChecked: {
        type: Boolean,
        required: false,
        default: false,
    },
    facetsActive: {
        type: Boolean,
        required: false,
        default: false,
    },
    nrOfFacetsActive: {
        type: Number,
        required: false,
        default: 0,
    },
    currentRefinements: {
        type: Array as PropType<Array<{ label?: string; values?: unknown[] }>>,
        required: false,
        default: () => []
    }
});


const refinementSignature = computed(() => JSON.stringify(props.currentRefinements ?? []));
const searchUpdateTick = ref(0);

const componentInfoReady = ref(false);
const isExpanded = reactive<Record<string, boolean>>({});
const showHighlight = ref<Record<string, boolean>>({});

onMounted(() => {
    componentInfoReady.value = true;

    if (typeof window !== 'undefined') {
        window.addEventListener('avefi:search-updated', onSearchUpdated as EventListener);
    }

    // Initialize showHighlight to true for all items
    props.items.forEach(item => {
        showHighlight.value[item.handle] = true;
    });
});

onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('avefi:search-updated', onSearchUpdated as EventListener);
    }
});

watch(
    () => props.items,
    (newItems) => {
        newItems.forEach(item => {
            if (showHighlight.value[item.handle] === undefined) {
                showHighlight.value[item.handle] = true;
            }
        });
    },
    { immediate: true }
);

function getFilteredManifestations(workOrHit: WorkHit | null | undefined): SearchManifestation[] {
    if (!workOrHit) return [];

    // If there are no inner_hits at all, just return the attached manifestations.
    if (!workOrHit.inner_hits) {
        return Array.isArray(workOrHit.manifestations) ? workOrHit.manifestations : [];
    }

    // Try to find an inner_hits bucket that refers to manifestations
    const mKey = Object.keys(workOrHit.inner_hits).find(k =>
        k.includes('manifestations')
    );

    if (mKey) {
        const hits = workOrHit.inner_hits[mKey]?.hits?.hits || [];
        if (hits.length > 0) {
            // Keep any nested inner_hits on each manifestation hit
            return hits.map(h => ({ ...h._source, inner_hits: h.inner_hits } as ManifestationHit));
        }
    }

    // No manifestations-specific inner_hits -> fall back to full list
    return Array.isArray(workOrHit.manifestations) ? workOrHit.manifestations : [];
}

function getFilteredItems(manifestation: ManifestationHit | null | undefined): SearchItem[] {
    if (!manifestation) return [];

    const allItems = Array.isArray(manifestation.items) ? manifestation.items : [];

    if (manifestation.inner_hits) {
        const itemsKey = Object.keys(manifestation.inner_hits).find(k => k.includes('items'));
        if (itemsKey) {
            const hits = manifestation.inner_hits[itemsKey]?.hits?.hits || [];
            if (hits.length > 0) {
                return hits.map(h => h._source);
            }
        }
    }

    // Keep split-view data strictly tied to server payload.
    // If no item inner_hits exist, use manifestation.items as-is.
    return allItems;
}

function onSearchUpdated() {
    searchUpdateTick.value += 1;
}



watch(() => props.expandAllHandlesChecked, (newVal) => {
    props.items.forEach((item, i) => {
        const handle = item.handle;
        const delay = i * 50;

        // ✅ Correct access
        if (showHighlight.value[handle] === undefined)
            showHighlight.value[handle] = false;

        if (isExpanded[handle] === undefined)
            isExpanded[handle] = false;

        if (newVal) {
            showHighlight.value[handle] = true;
            setTimeout(() => {
                if (!isExpanded[handle]) {
                    isExpanded[handle] = true;
                }
                showHighlight.value[handle] = false;
            }, 250 + delay);
        } else {
            isExpanded[handle] = false;
            showHighlight.value[handle] = true;
        }
    });
});

function getHighlightSnippets(item: SearchWorkHit | null | undefined): Array<{ key: string; value: string }> {
    if (item) {
        const result: Array<{ key: string; value: string }> = [];
        const highlights = item._highlightResult || {};

        // Define the fields to extract (labelKey: dot.path.in.highlightResult)
        const fieldsToInclude = {
            title: 'has_record.has_primary_title.has_name',
            AlternativeTitle: 'has_record.has_alternative_title.has_name',
            production: 'production',
            creators: 'creators',
            directors_or_editors: 'directors_or_editors',
            'has_form': 'has_record.has_form',
            genre: 'has_record.has_genre.has_name',
            subject: 'subjects',
        };

        for (const [labelKey, path] of Object.entries(fieldsToInclude)) {
            const entry = getValueByPath(highlights, path);
            const entries = Array.isArray(entry) ? entry : [entry];
            for (const raw of entries) {
                const e = raw as HighlightValue | null | undefined;
                if (
                    e?.matchLevel !== 'none' &&
                    Array.isArray(e?.matchedWords) &&
                    e.matchedWords.length > 0 &&
                    typeof e.value === 'string'
                ) {
                    result.push({ key: labelKey, value: e.value });
                }
            }
        }

        return result;
    }
    return [];
}

// Helper to safely walk nested highlight paths like 'has_record.has_primary_title.has_name'
function getValueByPath(obj: unknown, path: string): unknown {
    return path.split('.').reduce((o: unknown, p: string) => {
        const rec = o as Record<string, unknown> | null | undefined;
        return rec && rec[p] ? rec[p] : null;
    }, obj);
}


onMounted(() => {
    componentInfoReady.value = true;
});


</script>
<style scoped>
.collapse-plus>.collapse-title:after {
    color: var(--primary-800);
    top: 25%;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    overflow: hidden;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    max-height: 0;
    opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
    max-height: 1000px;
    /* enough to show full content */
    opacity: 1;
}

@keyframes gentlePulse {

    0%,
    100% {
        transform: scale(1);
        opacity: 1;
    }

    50% {
        transform: scale(1.05);
        opacity: 0.85;
    }
}

.animate-attention {
    animation: gentlePulse 2s ease-in-out infinite;
}
</style>
