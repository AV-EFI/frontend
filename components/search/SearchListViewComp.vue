<template>
  <div
    v-for="item in items"
    :key="item.handle"
    class="card bg-white border border-base-300 border-2 shadow-md rounded-xl dark:bg-gray-800 w-full shadow-lg hover:shadow-xl mb-4 text-neutral-900 dark:text-white"
    role="region"
    :aria-label="`${$t('title')}: ${item?.has_record?.has_primary_title?.has_name}`"
  >
    <div
      v-if="showAdminStats"
      class="w-full rounded-t-xl p-4 flex flex-row justify-between items-center h-8 bg-primary/10 text-primarydark:bg-gray-800 dark:text-white text-sm p-2"
    >
      <span>Status: <span class="badge badge-success text-white">Public</span></span>
      <span>{{ $t('lastedit') }}: {{ new Date(item?.['@timestamp']??'').toLocaleString('de-DE') }}</span>
      <span>{{ item?.has_record?.described_by?.has_issuer_name }}</span>
      <button class="btn btn-xs btn-primary">
        {{ $t('showHistory') }}
      </button>
    </div>
    <div
      class="flex flex-col md:flex-row min-h-12 w-full p-4 rounded-tl-xl rounded-tr-xl bg-primary dark:bg-primary-800 text-white"
    >
      <div class="max-md:w-full w-4/5 md:w-4/5 content-center">
        <GlobalClipboardComp
          :display-text="item?.handle"
          class=" text-xs text-gray-50 dark:text-gray-300"
          :aria-label="$t('copyEfi')"
          :title="$t('copyEfi')"
          :dark-bg="true"
        />
        <h2
          class="font-bold text-lg my-1 text-primary-50 dark:text-white"
          :alt="$t('title')"
          :title="$t('title')"
        >
          <a
            :href="`/film/${item.objectID}`"
            :title="$t('detailviewlink')"
            target="_blank"
            class="link dark:link-white no-underline hover:underline"
          >
            <span 
              v-if="item._highlightResult?.has_record?.has_primary_title?.has_name"
            >
              <ais-highlight
                attribute="has_record.has_primary_title.has_name"
                :hit="item"
              />
            </span>
            <span v-else>
              {{ item?.has_record?.has_primary_title?.has_name }}
            </span>
          </a>
        </h2>
        <h3
          v-if="item?.has_record?.has_alternative_title"
          class="text-white"
        >
          <span 
            v-if="item._highlightResult?.has_record?.has_alternative_title?.has_name"
          >
            <span
              v-for="(alt, idx) in item._highlightResult?.has_record?.has_alternative_title"
              :key="idx"
            >
              <ais-highlight
                attribute="has_record.has_alternative_title.has_name"
                :hit="item"
              />
              <span v-if="alt.type">
                ({{ $t(alt.type) }})
              </span>
              <span v-if="idx < item._highlightResult?.has_record?.has_alternative_title.length - 1">, </span>
            </span>
          </span>
          <ul v-else-if="item?.has_record?.has_alternative_title">
            <li
              v-for="alt in item?.has_record?.has_alternative_title"
              :key="alt.id"
            >
              {{ alt.has_name }} ({{ $t(alt.type) }})
            </li>
          </ul>
        </h3>
        <div class="flex flex-col md:flex-row text-sm text-white dark:text-base-content mt-2">
          <span
            v-if="item?.has_record?.has_event?.map((loc) => loc)"
            class="flex items-center"
          >
            <Icon
              name="mdi:map-marker-outline"
              class="mr-1"
              :alt="$t('place')"
              :title="$t('place')"
            />
            {{ item?.has_record?.has_event?.flatMap(ev => ev.located_in?.map(location => location.has_name) || null).join(', ') }}
          </span>
          <span
            v-if="item.years"
            class="flex items-center"
          >
            <template v-if="item.has_record?.has_event">
              <span class="flex items-center max-md:hidden">&nbsp;&nbsp;</span></template>
            <Icon
              name="fa:calendar"
              class="mr-1"
              :alt="$t('productionyear')"
              :title="$t('productionyear')"
            />
            {{ item.years.join(', ') }}
          </span>
          <span
            v-if="item.directors_or_editors"
            class="flex items-center"            
          >
            <template v-if="item.directors_or_editors">
              <span class="flex items-center max-md:hidden">&nbsp;&nbsp;</span>
            </template>
            <Icon
              name="iconoir:director-chair"
              class="mr-1"
              :alt="$t('directors_or_editors')"
              :title="$t('directors_or_editors')"
            />
            {{ item.directors_or_editors?.flatMap((f) => $t(f)).join(', ') }}
            <span
              v-if="isFacetActive('directors_or_editors', item.directors_or_editors.join(','))"
              class="badge badge-xs bg-highlight text-white ml-1"
              :title="$t('matchedField') + ': ' + item.directors_or_editors.join(', ')"
            />

          </span>
          <span
            v-if="item.has_record?.has_form"
            class="flex items-center"
          >
            <template v-if="item.has_record?.has_event || item.years">
              <span class="flex items-center max-md:hidden">&nbsp;&nbsp;</span>
            </template>
            <Icon
              name="fa:film"
              class="mr-1"
            />
            {{ item.has_record?.has_form?.flatMap((f) => $t(f)).join(', ') }}
          </span>
          <span
            v-if="item?.has_record?.is_part_of"
            class="flex items-center"
          >
            <template v-if="item.has_record?.has_event || item.years || item.has_record?.has_form">
              <span class="flex items">
                &nbsp;&nbsp;
              </span>
              <Icon
                name="carbon:logical-partition"
                class="mr-1"
              />
              {{ $t('Episode/Part') }}
            </template>
          </span>
        </div>
      </div>
      <div class="w-full md:w-1/5 flex flex-row flex-wrap justify-end items-end mr-0 mt-2 md:my-auto">
        <NuxtLink 
          :to="`/film/${item.handle.replace('21.11155/','')}`"
          class="btn btn-circle btn-outline btn-md mr-2 text-white"
          :aria-label="$t('detailviewlink')"
          :title="$t('detailviewlink')"
          target="_blank"
        >
          <Icon
            name="mdi:eye-outline"
            class="text-2xl"
            :alt="$t('detailviewlink')"
          />
        </NuxtLink>
        <MicroEfiCopyComp
          class="hidden"
          category="work"
          :handle="item?.handle"
        />
        <GlobalActionContextComp :item="item" />
      </div>
    </div>
    <Transition
      name="fade"
      mode="out-in"
    >
      <div
        v-if="showHighlight[item.handle] && getHighlightSnippets(item).length > 0"
        class="mt-2 ml-3 text-sm highlight-snippets"
      >
        <span>✨ <strong>{{ $t('lookWhatWeFound') }}</strong></span>
        <ul>
          <SearchHighlightMatchComp
            v-for="(entry, i) in getHighlightSnippets(item)"
            :key="i + entry.value"
            :value="entry.value"
            :field="entry.key"
          />
        </ul>
      </div>
    </Transition>

    <button
      class="btn btn-primary btn-xs btn-outline my-2 mx-auto"
      :aria-label="$t('toggleDetails')"
      :title="$t('toggleDetails')"
      :aria-expanded="isExpanded[item.handle] || false"
      @click="isExpanded[item.handle] = !isExpanded[item.handle]; showHighlight[item.handle] = !showHighlight[item.handle]"
    >
      <Icon
        :name="isExpanded[item.handle] ? 'mdi:minus' : 'mdi:plus'"
        class="text-lg"
        :alt="isExpanded[item.handle] ? $t('hideDetails') : $t('showDetails')"
        :title="isExpanded[item.handle] ? $t('hideDetails') : $t('showDetails')"
      />
    </button>
    <div
      v-show="isExpanded[item.handle]"
      class="card-body p-4 pt-0"
    >
      <!--top-->
      <div class="grid col-span-full grid-cols-12 gap-2">
        <div class="col-span-full">
          <MicroDividerComp
            class="mx-auto my-[15px] mt-4"
            label-text="avefi:WorkVariant" 
            in-class="work"
          />
        </div>
      </div>
      <div
        v-if="!item?.production?.length > 0
          && !item?.has_record?.has_form?.length > 0
          && !item?.has_record?.has_genre?.length > 0
          && !item?.subjects?.length > 0"
        class="text-sm text-gray-500 dark:text-gray-400 mb-2"
      >
        {{ $t('noWorkVariantDetails') }}
      </div> 
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm"
      >
        <div
          v-if="item?.production"
          class="flex flex-col"
        >
          <MicroLabelComp label-text="avefi:ProductionEvent" />
          <SearchHighlightListComp
            :items="item?.production || []"
            :hilite="activeProduction"
            class="mb-2"
            :font-size="'text-sm'"
          />
        </div>
        <div
          v-if="item?.has_record?.has_form"
          class="flex flex-col"
        >
          <MicroLabelComp label-text="has_form" />
          <SearchHighlightListComp
            :items="item?.has_record?.has_form || []"
            :hilite="activeHasForm"           
            class="max-h-48 overflow-y-auto mb-2"
            :font-size="'text-sm'"
          />
        </div>
        <div
          v-if="item?.has_record?.has_genre?.length > 0"
          class="flex flex-col"
        >
          <MicroLabelComp label-text="avefi:Genre" />
          <SearchHighlightListComp
            :items="item?.has_record?.has_genre?.flatMap(genre => genre.has_name) || []"
            :hilite="activeGenres"
            class="max-h-48 overflow-y-auto mb-2"
            :font-size="'text-sm'"
          />
        </div>
        <div
          v-if="item?.subjects?.length > 0" 
          class="flex flex-col"
        >
          <MicroLabelComp label-text="avefi:Subject" />
          <SearchHighlightListComp
            :items="item?.subjects || []"
            :hilite="activeSubjects"
            class="max-h-48 overflow-y-auto"
            :font-size="'text-sm'"
          />
        </div>
      </div>
      <!-- EO WorkVariant -->
      <!-- Manifestations -->
      <hr class="my-2">
      <div class="flex flex-col">
        <h3
          class="relative font-bold text-md mb-2 pl-1 pr-6 text-gray-800 dark:text-base-content"
          aria-label="$t('tooltip.manifestation')"
        >
          {{ $t('manifestations') }}

          <!-- Info icon positioned inside <h3> -->
          <span
            class="absolute ml-2 text-neutral-500 dark:text-neutral-300 text-sm cursor-help group"
            role="img"
            aria-label="Info"
            tabindex="0"
          >
            ⓘ
            <!-- Tooltip -->
            <span
              class="absolute z-10 left-1/2 -translate-x-1/2 bottom-full mb-1 w-64 p-2 text-xs text-left text-white bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity"
              role="tooltip"
            >
              {{ $t('tooltip.manifestation') }}
            </span>
          </span>
        </h3>
        <SearchManifestationListSplitView
          :manifestations="getFilteredManifestations(item)"
          :get-filtered-items="getFilteredItems"
          :work-variant-handle="item?.handle"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { MovingImageRecordContainer } from '../../models/interfaces/av_efi_schema.ts';

const route = useRoute();

import { ref, onMounted, onBeforeUnmount } from 'vue';

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
        production_type: []
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


const updateFromHref = () => {
    const refinements = parseRefinementsFromUrl(window.location.href);

    activeGenres.value = refinements.has_genre_has_name || [];
    activeSubjects.value = refinements.subjects || [];
    activeHasForm.value = refinements.has_form_has_name || [];
    activeProduction.value = refinements.production_type || [];

    console.log('✅ URL parsed:');
    console.log('→ Genres:', activeGenres.value);
    console.log('→ Subjects:', activeSubjects.value);
    console.log('→ Forms:', activeHasForm.value);
    console.log('→ ProdType:', activeProduction.value);
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


import { useI18n } from 'vue-i18n';
const { t: $t } = useI18n();
const props = defineProps({
    items: {
        type: Array as PropType<Array<MovingImageRecordContainer>>,
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
    }
});

const componentInfoReady = ref(false);
const isExpanded = reactive<Record<string, boolean>>({});
const showHighlight = ref<Record<string, boolean>>({});

onMounted(() => {
    componentInfoReady.value = true;

    // Initialize showHighlight to true for all items
    props.items.forEach(item => {
        showHighlight.value[item.handle] = true;
    });
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

    const innerHitsManifestations = item.inner_hits.manifestations_hits?.hits?.hits || [];

    if (innerHitsManifestations.length > 0) {
    // ✅ Keep inner_hits on each manifestation
        return innerHitsManifestations.map((hit) => ({
            ...hit._source,
            inner_hits: hit.inner_hits
        }));
    }

    return [];
}


async function checkEmptyProperties(manifestations: any[]): Promise<void> {
    for (const manifestation of manifestations) {
        let allItemsEmpty = true;
        for (const item of manifestation.items) {
            if (!item.has_record?.has_format && !item.has_record?.in_language?.code && !item.has_record?.element_type && !item.has_record?.has_webresource) {
                item.isEmpty = true;
            } else {
                item.isEmpty = false;
                allItemsEmpty = false;
            }
        }
        manifestation.allItemsEmpty = allItemsEmpty;
    }
}

async function markDuplicateManifestations(manifestations: any[]): Promise<void> {
    const seen = new Map();
    if(manifestations.length === 0) return;
    for (const manifestation of manifestations) {
        if(manifestation?.has_record?.in_language !== undefined || manifestation?.has_record?.has_colour_type !== undefined || manifestation?.has_record?.is_manifestation_of !== undefined || manifestation?.has_record?.is_manifestation_of.length > 0) {
            let alterTitles;  
            if(manifestation?.has_record?.is_manifestation_of !== undefined) {
                alterTitles = props.items
                    ?.filter(item => manifestation?.has_record?.is_manifestation_of.flatMap(imo => imo?.id).includes(item?.handle))
                    ?.flatMap(mir => mir.has_record?.has_alternative_title?.flatMap(alt => alt.has_name))
                    .join(',');
            }
            const key = `${manifestation?.has_record?.in_language?.map(lang => lang.code).join(',')}-${manifestation?.has_record?.has_colour_type}-${manifestation?.has_record?.is_manifestation_of?.flatMap(imo => imo?.id)}-${alterTitles??''}`;
            if (seen.has(key)) {
                manifestation.isTwin = true;
                seen.get(key).isTwin = true;
            } else {
                manifestation.isTwin = false;
                seen.set(key, manifestation);
            }
        }
    }
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


watch(() => props.items, async (newVal) => {
    const allFilteredManifestations = newVal
        .flatMap(item => getFilteredManifestations(item));

    await Promise.all([
        checkEmptyProperties(allFilteredManifestations),
        markDuplicateManifestations(allFilteredManifestations)
    ]);

    componentInfoReady.value = true;
});

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
.collapse-plus > .collapse-title:after {
  @apply text-3xl w-4 h-4;
  color: var(--primary-800);
  top: 25%;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active, .slide-fade-leave-active {
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
  max-height: 1000px; /* enough to show full content */
  opacity: 1;
}

</style>