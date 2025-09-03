<template>
  <div v-for="item in items" :key="item.handle"
    class="card bg-white p-0 rounded-xl dark:bg-gray-800 w-full shadow-sm hover:shadow-xl mb-4 text-neutral-900 dark:text-white"
    role="region" :aria-label="`${$t('title')}: ${item?.has_record?.has_primary_title?.has_name}`">
    <div v-if="showAdminStats"
      class="w-full rounded-t-xl p-4 flex flex-row justify-between items-center h-8 bg-primary/10 text-primarydark:bg-gray-800 dark:text-white text-sm">
      <span>Status: <span class="badge badge-success text-white">Public</span></span>
      <span>{{ $t('lastedit') }}: {{ new Date(item?.['@timestamp']??'').toLocaleString('de-DE') }}</span>
      <span>{{ item?.has_record?.described_by?.has_issuer_name }}</span>
      <button class="btn btn-xs btn-primary">
        {{ $t('showHistory') }}
      </button>
    </div>
    <div
      class="flex flex-col md:flex-row min-h-12 w-full p-4 rounded-tl-xl rounded-tr-xl bg-primary dark:bg-primary-800 text-white">
      <div class="max-md:w-full w-4/5 md:w-4/5 content-center">
        
        <GlobalClipboardComp :display-text="item?.handle" class=" text-xs text-gray-50 dark:text-gray-300"
          :aria-label="$t('copyEfi')" :title="$t('copyEfi')" :dark-bg="true" />
        <h2 class="font-bold text-lg my-1 text-primary-50 dark:text-white" :alt="$t('title')" :title="$t('title')">
          <a :href="`/film/${item.objectID}`" :title="$t('detailviewlink')" target="_blank"
            class="link dark:link-white no-underline hover:underline">
            <span v-if="item._highlightResult?.has_record?.has_primary_title?.has_name">
              <ais-highlight attribute="has_record.has_primary_title.has_name" :hit="item" />
            </span>
            <span v-else>
              {{ item?.has_record?.has_primary_title?.has_name }}
            </span>
          </a>
        </h2>
        <h3 v-if="item?.has_record?.has_alternative_title" class="text-white">
          <ul v-if="item._highlightResult?.has_record?.has_alternative_title?.has_name">
            <li v-for="(alt, idx) in item._highlightResult?.has_record?.has_alternative_title?.has_name" :key="idx"
              class="block" :aria-label="$t('alternativeTitle')">
              <span v-html="alt.value" />
              <span v-if="item.has_record?.has_alternative_title?.[idx]?.type">
                ({{ $t(item.has_record.has_alternative_title[idx].type) }})
              </span>
            </li>
          </ul>
          <ul v-else-if="item?.has_record?.has_alternative_title">
            <li v-for="alt in item?.has_record?.has_alternative_title" :key="alt.id">
              {{ alt.has_name }} ({{ $t(alt.type) }})
            </li>
          </ul>
        </h3>
        <div class="flex flex-col md:flex-row text-sm text-white dark:text-base-content mt-2">
          <!-- Place -->
          <span v-if="item?.has_record?.has_event?.some(ev => ev.located_in?.length)" class="flex items-center">
            <Icon name="tabler:map-pin" class="mr-1" :alt="$t('place')" :title="$t('place')" />
            {{
            item?.has_record?.has_event
            ?.flatMap(ev => ev.located_in?.map(location => location.has_name) || [])
            .join(', ')
            }}
          </span>

          <!-- Production Year -->
          <span v-if="item?.years?.length" class="flex items-center">
            <template v-if="item.has_record?.has_event">
              <span class="flex items-center max-md:hidden">&nbsp;&nbsp;</span>
            </template>
            <Icon name="tabler:calendar" class="mr-1" :alt="$t('productionyear')" :title="$t('productionyear')" />
            {{ item.years.join(', ') }}
          </span>

          <!-- Directors or Editors -->
          <span v-if="item?.directors_or_editors?.length" class="flex items-center">
            <span class="flex items-center max-md:hidden">&nbsp;&nbsp;</span>
            <Icon name="tabler:clapperboard" class="mr-1" :alt="$t('directors_or_editors')"
              :title="$t('directors_or_editors')" />
            {{ item.directors_or_editors?.flatMap((f) => $t(f)).join(', ') }}
            <span v-if="isFacetActive('directors_or_editors', item.directors_or_editors.join(','))"
              class="badge badge-xs bg-highlight text-white ml-1"
              :title="$t('matchedField') + ': ' + item.directors_or_editors.join(', ')" />
          </span>

          <!-- Form -->
          <span v-if="item?.has_record?.has_form?.length" class="flex items-center">
            <template v-if="item.has_record?.has_event || item.years">
              <span class="flex items-center max-md:hidden">&nbsp;&nbsp;</span>
            </template>
            <Icon name="tabler:clapperboard" class="mr-1" />
            {{ item.has_record?.has_form?.flatMap((f) => $t(f)).join(', ') }}
          </span>

          <!-- Part of Series -->
          <span v-if="item?.has_record?.is_part_of?.length" class="flex items-center">
            <template v-if="item.has_record?.has_event || item.years || item.has_record?.has_form">
              <span class="flex items-center max-md:hidden">&nbsp;&nbsp;</span>
            </template>
            <Icon name="carbon:logical-partition" class="mr-1" />
            {{ $t('Episode/Part') }}
          </span>
        </div>
      </div>
      <div class="w-full md:w-1/5 flex flex-row flex-wrap justify-end items-end mr-0 mt-2 md:my-auto">
        <NuxtLink :to="`/film/${item.handle.replace('21.11155/','')}`"
          class="btn btn-circle btn-outline btn-md mr-2 text-white" :aria-label="$t('detailviewlink')"
          :title="$t('detailviewlink')" target="_blank">
          <Icon name="tabler:eye" class="text-2xl" :alt="$t('detailviewlink')" />
        </NuxtLink>
        <MicroEfiCopyComp class="hidden" category="work" :handle="item?.handle" />
        <GlobalActionContextComp :item="item" />
      </div>
    </div>
    <Transition name="fade" mode="out-in">
      <div v-if="showHighlight[item.handle] && getHighlightSnippets(item).length > 0"
        class="my-2 ml-3 text-sm highlight-snippets">
        <span>✨ <strong>{{ $t('lookWhatWeFound') }}</strong></span>
        <ul>
          <SearchHighlightMatchComp v-for="(entry, i) in getHighlightSnippets(item)" :key="i + entry.value"
            :value="entry.value" :field="entry.key" />
        </ul>
      </div>
    </Transition>

    <div
  class="border-t rounded-b-xl border-base-200 pt-2 bg-base-200 px-3 py-2 flex justify-center relative"
>
  <div class="relative inline-flex items-center">
    <!-- Toggle button -->
    <button
      class="btn btn-outline hover:bg-highlight btn-xs my-2"
      :aria-label="$t('toggleDetails')"
      :title="$t('toggleDetails')"
      :aria-expanded="isExpanded[item.handle] || false"
      @click="
        isExpanded[item.handle] = !isExpanded[item.handle];
        showHighlight[item.handle] = !showHighlight[item.handle]
      "
    >
      <Icon
        :name="isExpanded[item.handle] ? 'tabler:minus' : 'tabler:plus'"
        class="text-lg"
        :alt="isExpanded[item.handle] ? $t('hideDetails') : $t('showDetails')"
        :title="isExpanded[item.handle] ? $t('hideDetails') : $t('showDetails')"
      />
      <span class="text-sm">
        {{ isExpanded[item.handle] ? $t('hideDetails') : $t('showDetails') }}
      </span>
    </button>

    <!-- Facet impact badge -->
    <span
      v-if="showFacetBadge"
      class="absolute -right-[125px] top-1/2 -translate-y-1/2"
    >
      <span
        class="badge badge-sm bg-highlight text-white animate-attention"
        :title="$t('filteredInside')"
      >
        {{ $t('filteredInside') }}
      </span>
    </span>
  </div>
</div>
    <div v-show="isExpanded[item.handle]" class="card-body p-4 pt-0">
      <!--top-->
      <div class="grid col-span-full grid-cols-12 gap-2">
        <div class="col-span-full">
          <MicroDividerComp class="mx-auto my-[15px] mt-4" label-text="avefi:WorkVariant" in-class="work" />
        </div>
      </div>
      <div v-if="!item?.production?.length > 0
          && !item?.has_record?.has_form?.length > 0
          && !item?.has_record?.has_genre?.length > 0
          && !item?.subjects?.length > 0" class="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {{ $t('noWorkVariantDetails') }}
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
        <div v-if="item?.production" class="flex flex-col">
          <MicroLabelComp label-text="avefi:ProductionEvent" />
          <SearchHighlightListComp :items="item?.production || []" :hilite="activeProduction" class="mb-2"
            :font-size="'text-sm'" />
        </div>
        <div v-if="item?.has_record?.has_form" class="flex flex-col">
          <MicroLabelComp label-text="has_form" />
          <SearchHighlightListComp :items="item?.has_record?.has_form || []" :hilite="activeHasForm"
            class="max-h-48 overflow-y-auto mb-2" :font-size="'text-sm'" />
        </div>
        <div v-if="item?.has_record?.has_genre?.length > 0" class="flex flex-col">
          <MicroLabelComp label-text="avefi:Genre" />
          <SearchHighlightListComp :items="item?.has_record?.has_genre?.flatMap(genre => genre.has_name) || []"
            :hilite="activeGenres" class="max-h-48 overflow-y-auto mb-2" :font-size="'text-sm'" />
        </div>
        <div v-if="item?.subjects?.length > 0" class="flex flex-col">
          <MicroLabelComp label-text="avefi:Subject" />
          <SearchHighlightListComp :items="item?.subjects || []" :hilite="activeSubjects"
            class="max-h-48 overflow-y-auto" :font-size="'text-sm'" />
        </div>
      </div>
      <!-- EO WorkVariant -->
      <!-- Manifestations -->
      <hr class="my-2">
      <div class="flex flex-col">
        <h3 class="relative font-bold text-md mb-2 pl-1 pr-6 text-gray-800 dark:text-base-content"
          aria-label="$t('tooltip.manifestation')">
          {{ $t('manifestations') }}

          <!-- Info icon positioned inside <h3> -->
          <span class="absolute ml-2 text-neutral-500 dark:text-neutral-300 text-sm cursor-help group" role="img"
            aria-label="Info" tabindex="0" :title="$t('tooltip.manifestation')">
            ⓘ
          </span>
        </h3>
        <SearchManifestationListSplitView :manifestations="getFilteredManifestations(item)"
          :get-filtered-items="getFilteredItems" :work-variant-handle="item?.handle" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ElasticMSearchResponse } from '@/models/interfaces/generated/IElasticResponses';

const route = useRoute();

const activeGenres = ref<string[]>([]);
const activeSubjects = ref<string[]>([]);
const activeHasForm = ref<string[]>([]);
const activeProduction = ref<string[]>([]);

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
    facetsActive: {
        type: Object as PropType<Record<string, Set<string | number | boolean>>>,
        default: false,
    },
    nrOfFacetsActive: {
        type: Number,
        default: 0,
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

function getFilteredItems(manifestation) {
    if (!manifestation.inner_hits) {
        return manifestation.items || [];
    }

    const itemsInnerHitsKey = Object.keys(manifestation.inner_hits).find(key => key.includes('items'));

    if (!itemsInnerHitsKey) {
        return manifestation.items || [];
    }

    const innerHitsItems = manifestation.inner_hits[itemsInnerHitsKey]?.hits?.hits || [];

    return innerHitsItems.map(hit => hit._source);
}

function getFilteredManifestations(item) {
    if (!item.inner_hits) {
        return item.manifestations || [];
    }

    const innerHitsManifestations = item.inner_hits.manifestations?.hits?.hits || [];

    if (innerHitsManifestations.length > 0) {
    // ✅ Keep inner_hits on each manifestation
        return innerHitsManifestations.map((hit) => ({
            ...hit._source,
            inner_hits: hit.inner_hits
        }));
    }

    return [];
}
// Facets that change content *inside* a WorkVariant (tune as needed)
const nestedFacetKeys = [
    'in_language_code',
    'has_colour_type',
    'has_sound_type',
    'has_access_status',
    'item_element_type',
    // also show hint for these, since they affect inner rendering
    'has_form_has_name',
    'has_genre_has_name',
    'subjects',
    'production_type'
];

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

</script>
<style scoped>
.collapse-plus>.collapse-title:after {
  @apply text-3xl w-4 h-4;
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