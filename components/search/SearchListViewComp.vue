<template>
  <div
    v-for="item in items"
    :key="item._id"
    class="card bg-base-100 dark:bg-slate-900 w-full shadow-lg hover:shadow-xl mb-4"
  >
    <div
      v-if="showAdminStats"
      class="w-full rounded-t-xl p-4 flex flex-row justify-between items-center h-8 bg-primary-100 dark:bg-slate-800 text-primary-900 dark:text-white text-sm p-2"
    >
      <span>Status: <span class="badge badge-success text-white">Public</span></span>
      <span>{{ $t('lastedit') }}: {{ new Date(item?.['@timestamp']??'').toLocaleString('de-DE') }}</span>
      <span>{{ item?.has_record?.described_by?.has_issuer_name }}</span>
      <button class="btn btn-xs btn-primary">
        {{ $t('showHistory') }}
      </button>
    </div>
    <div
      class="flex flex-col md:flex-row min-h-12 w-full p-4 pb-2 rounded-tl-xl rounded-tr-xl"
    >
      <div class="max-md:w-full w-4/5 md:w-4/5 content-center">
        <p
          class=" text-xs text-primary-800 dark:text-gray-300"
          alt="efi"
          title="efi"
        >
          {{ item?.handle }}
        </p>
        <h2
          class="font-bold text-lg my-1 text-primary-900 dark:text-white"
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
        <div class="flex flex-col md:flex-row text-sm text-primary-700 dark:text-gray-200 mt-2">
          <span
            v-if="item?.has_record?.has_event?.map((loc) => loc)"
            class="flex items-center"
          >
            <Icon
              name="mdi:map-marker-outline"
              class="mr-1"
              :alt="$t('country')"
              :title="$t('country')"
            />
            {{ item?.has_record?.has_event?.flatMap(ev => ev.located_in?.map(location => location.has_name) || null).join(', ') }}
          </span>
          <span
            v-if="item.years"
            class="flex items-center"
          >
            <template v-if="item.has_record?.has_event"><span class="flex items-center">&nbsp;&nbsp;</span></template>
            <Icon
              name="fa:calendar"
              class="mr-1"
            />
            {{ item.years.join(', ') }}
          </span>
          <span
            v-if="item.has_record?.has_form"
            class="flex items-center"
          >
            <template v-if="item.has_record?.has_event || item.years">
              <span class="flex items-center">&nbsp;&nbsp;</span>
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
        <MicroEfiCopyComp :handle="item?.handle" />
        <GlobalActionContextComp :item="item" />
      </div>
    </div>
    <div class="card-body p-4 pt-0">
      <!--top-->
      <div class="grid col-span-full grid-cols-12 gap-2">
        <div class="col-span-full">
          <MicroDividerComp
            class="mx-auto my-[8px] mt-2"
            label-text="avefi:WorkVariant" 
          />
        </div>
      </div>
      <div class="flex flex-col md:flex-row hidden">
        <div class="w-full md:w-100 flex flex-col">
          <DetailKeyValueComp
            keytxt="EFI"
            :valtxt="item?.handle"
            class="mb-2"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="flex flex-col col-span-full">
          <MicroLabelComp label-text="AlternativeTitle" />
          <span 
            v-if="item._highlightResult?.has_record?.has_alternative_title?.has_name"
          >
            <ais-highlight
              attribute="has_record.has_alternative_title.has_name"
              :hit="item"
            />
          </span>
          <ul v-else-if="item?.has_record?.has_alternative_title">
            <li
              v-for="alt in item?.has_record?.has_alternative_title"
              :key="alt.id"
            >
              {{ alt.has_name }}
            </li>
          </ul>
          <span v-else>-</span>
        </div>
        <div
          v-if="productionDetailsChecked"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 w-full col-span-full"
        >
          <div class="flex flex-col">
            <MicroLabelComp label-text="directors_or_editors" />
            <SearchHighlightListComp
              :items="item?.directors_or_editors"
              :hilite="item._highlightResult?.directors_or_editors?.flatMap((dirs) => ( dirs.matchedWords ))"            
              class="mb-2"
            />
          </div>
          <div class="flex flex-col">
            <MicroLabelComp label-text="avefi:ProductionEvent" />
            <SearchHighlightListComp
              :items="item?.production"
              :hilite="item._highlightResult?.production?.flatMap((dirs) => ( dirs.matchedWords ))"            
              class="mb-2"
            />
          </div>
          <div class="flex flex-col">
            <DetailKeyValueListComp
              keytxt="productionyear"
              :valtxt="item?.years"
              class="mb-2"
              :ul="true"
            />
            <DetailKeyValueListComp
              keytxt="country"
              :valtxt="item?.has_record?.has_event?.flatMap(ev => ev.located_in?.map(location => location.has_name) || null)"
              :ul="true"
              class="mb-2"
            />
          </div>
          <div class="flex flex-col">
            <MicroLabelComp label-text="has_form" />
            <SearchHighlightListComp
              :items="item?.has_record?.has_form || null"
              :hilite="item._highlightResult?.has_record?.has_form?.matchedWords"
              class="max-h-48 overflow-y-auto mb-2"
            />
            <MicroLabelComp label-text="avefi:Genre" />
            <SearchHighlightListComp
              :items="item?.has_record?.has_genre?.flatMap(genre => genre.has_name) || null"
              :hilite="item._highlightResult?.has_record?.has_genre?.has_name?.flatMap((dirs) => ( dirs.matchedWords ))"
              class="max-h-48 overflow-y-auto mb-2"
            />

            <MicroLabelComp label-text="avefi:Subject" />
            <SearchHighlightListComp
              :items="item?.subjects"
              :hilite="item._highlightResult?.subjects?.flatMap((dirs) => ( dirs.matchedWords ))"            
              class="max-h-48 overflow-y-auto"
            />
          </div>
        </div>
      </div>
      <!-- EO WorkVariant -->
      <!-- Manifestations -->
      <hr class="my-2">
      <div class="w-full flex flex-col">
        <h3 class="font-bold text-sm mb-2 pl-1 uppercase text-primary-800 dark:text-gray-200">
          {{ $t('manifestations') }}
        </h3>
        <div
          v-for="(manifestation, index) in getFilteredManifestations(item)"
          :key="index"
          class="collapse collapse-arrow"
        >
          <input
            type="checkbox"
            class="manifestation-checkbox"
          >
          <div class="collapse-title bg-gray-100 dark:bg-slate-700 dark:text-white font-medium">
            <DetailManifestationHeaderComp
              v-if="componentInfoReady"
              :manifestation="manifestation"
              type="searchresult"
              :is-twin="manifestation.isTwin"
              :all-items-empty="manifestation.allItemsEmpty"
            />
          </div>        
          <div class="collapse-content bg-slate-50 dark:bg-slate-800 dark:text-white">
            <div class="grid grid-cols-4 gap-1 grid-rows-[minmax(0,1fr)] border-l-2 border-manifestation px-2">
              <!--top-->
              <div class="col-span-full grid-cols-4 gap-2 row-start-1">
                <div class="col-span-full">
                  <MicroDividerComp
                    class="mx-auto my-[5px] mb-2"
                    label-text="avefi:Manifestation" 
                  />
                </div>
              </div>
              <div class="col-span-full row-start-2">
                <DetailKeyValueComp 
                  keytxt="EFI"
                  :valtxt="manifestation?.handle"
                  :clip="false"
                />
              </div>
              <div class="col-span-1 row-start-3 md:flex-row">
                <MicroLabelComp label-text="in_language_code" />
                <SearchHighlightListComp
                  :items="manifestation?.has_record?.in_language?.map(lang => lang.code)"
                  :hilite="item._highlightResult?.manifestations?.has_record?.in_language?.code?.matchedWords"                  
                  class="mb-2"
                />
              </div>
              <div class="col-span-1 row-start-3 md:flex-row">
                <MicroLabelComp label-text="has_colour" />
                <SearchHighlightSingleComp 
                  :item="manifestation?.has_record?.has_colour_type"
                  :hitlite="item._highlightResult?.manifestations?.has_record?.has_colour_type?.matchedWords"                  
                  class="mb-2"
                />
              </div>
            </div>
            <hr class="mt-4 mb-2 dark:border-gray-500">
            <h4 class="font-bold text-sm text-primary-800 dark:text-primary-200 uppercase mt-4">
              {{ $t('items') }}
            </h4>
            <DetailItemListNewComp 
              :items="manifestation?.items"
              :production-details-checked="productionDetailsChecked"
              :show-admin-stats="showAdminStats"
              :highlightresult="item?._highlightResult"
            />
          </div>
        </div>
      <!-- TODO replace above with component -->
      <!--        
      <LazySearchResultManifestation
        :manifestation_items="item?.manifestations"
      />-->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { MovingImageRecordContainer } from '../../models/interfaces/av_efi_schema.ts';
const filteredManifestationCache = new WeakMap();

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
});

const componentInfoReady = ref(false);

function getFilteredManifestations(item: any) {
    if (filteredManifestationCache.has(item)) {
        return filteredManifestationCache.get(item);
    }

    const innerHits = item?.inner_hits || {};
    const matchingKeys = Object.keys(innerHits).filter(key =>
        key.startsWith('matching_')
    );

    for (const key of matchingKeys) {
        const hits = innerHits[key]?.hits?.hits;
        if (hits && hits.length > 0) {
            const result = hits.map((hit: any) => hit._source);
            filteredManifestationCache.set(item, result);
            return result;
        }
    }

    const result = item?.manifestations || [];
    filteredManifestationCache.set(item, result);
    return result;
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
/*
Promise.all([
    checkEmptyProperties(props.items.flatMap(item => item.manifestations)),
    markDuplicateManifestations(props.items.flatMap(item => item.manifestations))
]).then(() => {
    componentInfoReady.value = true;
});
*/

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
</script>
