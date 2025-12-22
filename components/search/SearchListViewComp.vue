<template>
  <div
    v-for="work in items"
    :key="work.handle"
    class="card bg-white border-base-300 border-2 shadow-md rounded-xl dark:bg-gray-800 w-full hover:shadow-xl mb-4 text-neutral-900 dark:text-white"
    role="region"
    :aria-label="`${$t('title')}: ${work?.has_record?.has_primary_title?.has_name}`"
  >
    <div
      v-if="showAdminStats"
      class="w-full rounded-t-xl p-4 flex flex-row justify-between items-center h-8 bg-primary/10 text-primary dark:bg-gray-800 dark:text-white text-sm"
    >
      <span>Status: <span class="badge badge-success text-white">Public</span></span>
      <span>{{ $t('lastedit') }}: {{ new Date(work?.['@timestamp']??'').toLocaleString('de-DE') }}</span>
      <span>{{ work?.has_record?.described_by?.has_issuer_name }}</span>
      <button class="btn btn-xs btn-primary">
        {{ $t('showHistory') }}
      </button>
    </div>
    <header class="card-body p-4 pb-2 gap-y-0" :aria-labelledby="`flat-work-title-${work?.handle ?? ''}`">
      <div class="flex flex-col md:flex-row justify-between">
        <div class="w-4/5 md:w-4/5">
          <GlobalClipboardComp
            class="text-regular flex flex-row items-center whitespace-break-spaces text-xs dark:text-gray-300"
            :display-text="`${work?.handle ?? ''}`"
            :copy-text="`${useRuntimeConfig().public.AVEFI_COPY_PID_URL}${work?.handle ?? ''}`"
            tabindex="0"
            role="button"
            :aria-label="`${$t('copyToClipboard')}: ${work?.handle ?? ''}`"
          />
          <h2
            :id="`work-title-${work?.handle ?? ''}`"
            class="card-title text-lg font-semibold mb"
          >
            <NuxtLink
              v-if="work?.handle"
              :to="`/res/${work.handle}`"
              class="link link-hover dark:link-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              :aria-label="`${get(work, 'has_record.has_primary_title.has_name') || work?.handle || $t('title')}`"
              target="_blank"
            >
              {{ get(work, 'has_record.has_primary_title.has_name') || work?.handle || $t('title') }}
            </NuxtLink>
            <span v-else>
              {{ get(work, 'has_record.has_primary_title.has_name') || work?.handle || $t('title') }}
            </span>
            <MicroBadgeCategoryComp
              :category="work?.category || 'avefi:WorkVariant'"
              :dense="false"
              class="ml-2"
            />
            <!-- Badge for all items empty -->
            <span
              v-if="allItemsEmpty(work)"
              class="badge badge-manifestation badge-xs ml-2"
              :title="$t('allItemsEmptyTooltip') || 'All items in this work have no additional metadata'"
            >
              <Icon name="tabler:alert-circle" class="w-3 h-3 mr-1" />
              {{ $t('allItemsEmpty') || 'All Items Empty' }}
            </span>
          </h2>
          
          <h3
            v-if="work?.has_record?.has_alternative_title"
            class="text-sm text-left"
          >
            <ul v-if="work?.has_record?.has_alternative_title">
              <li
                v-for="alt in work?.has_record?.has_alternative_title"
                :key="alt.id"
                tabindex="0"
                :aria-label="`${$t('alternativeTitle')}: ${alt.has_name} (${$t(alt.type)})`"
              >
                {{ alt.has_name }} ({{ $t(alt.type) }})
              </li>
            </ul>
          </h3>
        </div>
        <div class="w-full md:w-1/5 flex flex-row flex-wrap justify-end items-end mr-0 mt-2 md:my-auto" role="group" :aria-label="$t('actions')">
          <NuxtLink 
            v-if="work?.handle"
            :to="`/res/${work.handle}`"
            class="btn btn-circle btn-outline btn-md mr-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            :aria-label="`${$t('detailviewlink')}: ${get(work, 'has_record.has_primary_title.has_name') || work?.handle}`"
            :title="$t('detailviewlink')"
            target="_blank"
          >
            <Icon
               name="tabler:eye"
              class="text-2xl"
              aria-hidden="true"
            />
          </NuxtLink>
          <GlobalActionContextComp
            v-if="work"
            :item="work"
          />
        </div>
      </div>

      <SearchGenericIconList
        :data="work"
        level="work"
        class="mt-1"
      />
    </header>
    <Transition
      name="fade"
      mode="out-in"
    >
      <div
        v-if="work && work.handle && showHighlight[work.handle] && getHighlightSnippets(work).length > 0"
        class="mb-2 ml-4 text-sm highlight-snippets text-left"
        tabindex="0"
        role="region"
        :aria-label="$t('lookWhatWeFound')"
      >
        <span>✨ 
          <strong>{{ $t('lookWhatWeFound') }}</strong>
        </span>
        <ul>
          <SearchHighlightMatchComp
            v-for="(entry, i) in getHighlightSnippets(work)"
            :key="i + entry.value"
            :value="entry.value"
            :field="entry.key"
          />
        </ul>
      </div>
    </Transition>

    <div class="border-t border-base-300 pt-2 bg-base-200 px-3 py-2 flex justify-center rounded-b-xl">
      <button
        v-if="work && work.handle"
        class="btn btn-highlight btn-xs my-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        :aria-label="`${isExpanded[work.handle] ? $t('hideDetails') : $t('showManifestItems')}: ${get(work, 'has_record.has_primary_title.has_name') || work?.handle}`"
        :title="$t('toggleDetails')"
        :aria-expanded="isExpanded[work.handle] || false"
        :aria-controls="`details-${work.handle}`"
        @click="isExpanded[work.handle] = !isExpanded[work.handle]; showHighlight[work.handle] = !showHighlight[work.handle]"
      >
        <Icon
           :name="isExpanded[work.handle] ? 'tabler:minus' : 'tabler:plus'"
          class="text-lg"
          aria-hidden="true"
        />
        <span class="text-sm">
          {{ isExpanded[work.handle] ? $t('hideDetails') : $t('showManifestItems') }}
        </span>
      </button>
      <span
        v-if="refinementsActive"
        :title="$t('tooltip.refinementsActive')"
        class="badge badge-sm bg-highlight animate-pulse"
      />
    </div>
    <div
      v-show="work && work.handle && isExpanded[work.handle]"
      :id="`details-${work.handle}`"
      class="card-body p-2 pt-0"
      role="region"
      :aria-labelledby="`work-title-${work?.handle ?? ''}`"
    >      
      <!-- EO WorkVariant -->
      <!-- Manifestations -->
      <hr class="my-2">
      <div class="flex flex-col">
        <h3
          class="relative font-bold text-md mb-2 pl-1 pr-4 text-gray-800 dark:text-base-content"
          aria-label="$t('tooltip.manifestation')"
        >
          {{ $t('manifestations') }}

          <!-- Info icon positioned inside <h3> -->
          <GlobalTooltipInfo
            :text="$t('tooltip.manifestation')"
            class="absolute ml-2"
          />
        </h3>
        <SearchManifestationListSplitView
          :manifestations="getFilteredManifestations(work)"
          :get-filtered-items="getFilteredItems"
          :work-variant-handle="work?.handle"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { allItemsEmpty, isItemEmpty, has, get, buildRows } from '@/composables/useItemEmpty';
// --- Helper functions for template ---
function allItemsEmpty(work: any): boolean {
    const rows = buildRows(work);
    if (rows.length === 0) return false; // No items at all, don't show badge
    return rows.every(row => isItemEmpty(row.item));
}
function isItemEmpty(item: any): boolean {
    if (!item) return true;
    // Get all item fields from spec that should be shown (excluding handle)
    const itemFieldsFromSpec = [
        'has_record.has_format',
        'in_language.code',
        'element_type',
        'has_webresource',
    ];
    // Check if any field has data
    return !itemFieldsFromSpec.some(path => has(item, path));
}
function get(obj: any, path: string): any {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((o, p) => (o && o[p] != null ? o[p] : undefined), obj);
}
function buildRows(work: any): Array<{ item: any, mf: any | null }> {
    const rows: Array<{ item: any, mf: any | null }> = [];
    const mfs: any[] = Array.isArray(work?.manifestations) ? work.manifestations : [];
    for (const mf of mfs) {
        const items: any[] = Array.isArray(mf?.items) ? mf.items : [];
        for (const it of items) rows.push({ item: it, mf });
    }
    const tlItems: any[] = Array.isArray(work?.items) ? work.items : [];
    for (const it of tlItems) {
        rows.push({ item: it, mf: null });
    }
    return rows;
}

// --- End helpers ---
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ElasticMSearchResponse } from '@/models/interfaces/generated/IElasticResponses';

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
            if (facet in result) {
                result[facet].push(value);
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

onMounted(() => {
    updateFromHref();

    const interval = setInterval(() => {
        if (window.location.href !== lastHref.value) {
            lastHref.value = window.location.href;
            updateFromHref();
        }
    }, 200);

    window.addEventListener('popstate', updateFromHref);
    window.addEventListener('pushstate', updateFromHref);
    window.addEventListener('replacestate', updateFromHref);

    onBeforeUnmount(() => {
        clearInterval(interval);
        window.removeEventListener('popstate', updateFromHref);
        window.removeEventListener('pushstate', updateFromHref);
        window.removeEventListener('replacestate', updateFromHref);
    });
});

const lastHref = ref(window.location.href);
const { t: $t } = useI18n();
const props = defineProps({
    items: {
        type: Array as PropType<Array<ElasticMSearchResponse>>,
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
        type: Array as PropType<Array<string>>,
        required: false,
        default: () => [],
    },
    expandAllHandlesChecked: {
        type: Boolean,
        required: false,
        default: false,
    },
    currentRefinements: {
        type: Array,
        required: false,
        default: () => []
    }
});

const showFacetBadge = computed(() => props.nrOfFacetsActive > 0);

const componentInfoReady = ref(false);
const isExpanded = reactive<Record<string, boolean>>({});
const showHighlight = ref<Record<string, boolean>>({});

onMounted(() => {
    componentInfoReady.value = true;

    // Initialize showHighlight to true for all items
    props.items.forEach(item => {
        showHighlight.value[item.handle] = true;
    });

    console.log('Facets active on mount:', props.nrOfFacetsActive);
});

watch(
    () => props.items,
    (newItems) => {
        newItems.forEach(item => {
            if (showHighlight.value[item.handle] === undefined) {
                showHighlight.value[item.handle] = true;
            }
        });
        console.log('Items updated, facets active:', props.nrOfFacetsActive);
    },
    { immediate: true }
);

function getFilteredManifestations(workOrHit: any) {
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
            return hits.map(h => ({ ...h._source, inner_hits: h.inner_hits }));
        }
    }

    // No manifestations-specific inner_hits -> fall back to full list
    return Array.isArray(workOrHit.manifestations) ? workOrHit.manifestations : [];
}

function getFilteredItems(manifestation: any) {
    if (!manifestation) return [];
    if (!manifestation.inner_hits) {
        return Array.isArray(manifestation.items) ? manifestation.items : [];
    }

    const itemsKey = Object.keys(manifestation.inner_hits).find(k => k.includes('items'));
    if (!itemsKey) {
        return Array.isArray(manifestation.items) ? manifestation.items : [];
    }

    const hits = manifestation.inner_hits[itemsKey]?.hits?.hits || [];
    return hits.map(h => h._source);
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

function getHighlightSnippets(item) {
    if(item) {
        const result = [];
        const highlights = item._highlightResult || {};

        // Define the fields to extract (labelKey: dot.path.in.highlightResult)
        const fieldsToInclude = {
            title: 'has_record.has_primary_title.has_name',
            AlternativeTitle: 'has_record.has_alternative_title.has_name',
            production: 'production',
            'directors_or_editors': 'directors_or_editors',
            'has_form': 'has_record.has_form',
            genre: 'has_record.has_genre.has_name',
            subject: 'subjects',
        };

        for (const [labelKey, path] of Object.entries(fieldsToInclude)) {
            const entry = getValueByPath(highlights, path);
            const entries = Array.isArray(entry) ? entry : [entry];

            for (const e of entries) {
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
function getValueByPath(obj, path) {
    return path.split('.').reduce((o, p) => (o && o[p] ? o[p] : null), obj);
}


onMounted(() => {
    componentInfoReady.value = true;
});

function isFacetActive(facetKey: string, value: string): boolean {
    return Object.entries(route.query).some(([key, raw]) => {
        const match = key.includes(`[refinementList][${facetKey}]`);
        if (!match) return false;
        const decoded = Array.isArray(raw) ? raw.map(decodeURIComponent) : [decodeURIComponent(raw)];
        return decoded.includes(value);
    });
}

function asList(val: any): string {
    if (Array.isArray(val))  {
        if (val.length > 0 && typeof val[0] === 'object') {
            return (val as any[]).map((v: any) => (v?.has_name ? String(v.has_name) : '')).filter((v: string) => v !== '').join(', ');
        } else if (typeof val[0] === 'string' || typeof val[0] === 'number' || typeof val[0] === 'boolean') {
            return (val as Array<string | number | boolean>).join(', ');
        }
        return (val as any[]).filter(v => v != null && v !== '').join(', ');
    }
    return String(val);
}

function yearsDisplay(work: any): string {
    const years = get(work, 'years');
    if (years && Array.isArray(years) && years.length) return years.join(', ');
    const range = get(work, 'production_in_year');
    if (range && typeof range === 'object') {
        const from = (range.gte ?? range.gt ?? '');
        const to = (range.lte ?? range.lt ?? '');
        return [from, to].filter(Boolean).join('–');
    }
    return '';
}
function formatValue(val: any): string {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return String(val);
    if (Array.isArray(val)) return val.map(formatValue).join(', ');
    if (typeof val === 'object') {
        return '{ ' + Object.entries(val).map(([k, v]) => `${k}: ${formatValue(v)}`).join(', ') + ' }';
    }
    return String(val);
}



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