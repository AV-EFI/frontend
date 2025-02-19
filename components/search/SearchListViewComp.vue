<template>
  <div
    v-for="item in items"
    :key="item._id"
    class="card bg-base-100 dark:bg-slate-900 w-full shadow-lg hover:shadow-xl mt-2"
  >
    <div
      v-if="item.has_record?.category"
      class="flex flex-row md:flex-row min-h-12 w-full p-4 rounded-tl-xl rounded-tr-xl"
      :class="getCategoryClass(item.has_record.category)"
    >
      <div class="w-4/5 md:w-4/5 content-center">
        <p
          class=" text-xs 2xl:text-base text-primary-900 dark:text-white"
          alt="EFI"
          title="EFI"
        >
          {{ item?.handle }}
        </p>
        <h2
          class="font-bold text-base/5 mt-1 text-primary-900 dark:text-white"
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
      </div>
      <div class="w-1/5 md:w-1/5 flex flex-row flex-wrap justify-end items-end mr-0 mt-2 md:my-auto">
        <MicroEfiCopyComp :handle="item?.handle" />
        <GlobalActionContextComp :item="item" />
      </div>
    </div>
    <div class="card-body p-4 pt-0">
      <!--top-->
      <div class="grid col-span-full md:col-span-12 grid-cols-12 gap-2">
        <div class="col-span-full md:col-span-12">
          <MicroDividerComp
            class="mx-auto"
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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div class="flex flex-col">
          <MicroLabelComp label-text="Director" />
          <SearchHighlightListComp
            :items="item?.directors_or_editors"
            :hilite="item._highlightResult?.directors_or_editors?.flatMap((dirs) => ( dirs.matchedWords ))"            
            class="mb-2"
          />
          <MicroLabelComp label-text="avefi:ProductionEvent" />
          <SearchHighlightListComp
            :items="item?.production"
            :hilite="item._highlightResult?.production?.flatMap((dirs) => ( dirs.matchedWords ))"            
            class="mb-2"
          />
        </div>
        <div class="flex flex-col">
          <MicroLabelComp label-text="CastMember" />
          <SearchHighlightListComp
            :items="item?.castmembers"
            :hilite="item._highlightResult?.castmembers?.flatMap((dirs) => ( dirs.matchedWords ))"
            class="max-h-48 overflow-y-auto"
          />
        </div>
        <div class="flex flex-col">
          <MicroLabelComp label-text="avefi:Subject" />
          <SearchHighlightListComp
            :items="item?.subjects"
            :hilite="item._highlightResult?.subjects?.flatMap((dirs) => ( dirs.matchedWords ))"            
            class="max-h-48 overflow-y-auto"
          />
        </div>
        <div class="flex flex-col">
          <MicroLabelComp label-text="avefi:Genre" />
          <SearchHighlightListComp
            :items="item?.has_record?.has_genre?.flatMap(genre => genre.has_name) || null"
            :hilite="item._highlightResult?.has_record?.has_genre?.has_name?.flatMap((dirs) => ( dirs.matchedWords ))"
            class="max-h-48 overflow-y-auto"
          />
          <DetailKeyValueListComp
            keytxt="years"
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
      </div>
      <hr class="my-2">
      <div class="w-full flex flex-col">
        <h3 class="font-bold text-sm mb-2 pl-1 uppercase text-primary-900 dark:text-primary-100">
          {{ $t('manifestations') }}
        </h3>
        <div
          v-for="manifestation in item?.manifestations"
          :key="manifestation.id"
          class="collapse collapse-arrow"
        >
          <input
            type="checkbox"
            class="manifestation-checkbox"
          >
          <div class="collapse-title bg-slate-100 dark:bg-slate-700 dark:text-whitefont-medium">
            <DetailManifestationHeaderComp
              :manifestation="manifestation"
              type="searchresult"
            />
          </div>
          
          <div class="collapse-content bg-slate-50 dark:bg-slate-800 dark:text-white">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <!--top-->
              <div class="grid col-span-full md:col-span-12 grid-cols-12 gap-2">
                <div class="col-span-full md:col-span-12">
                  <MicroDividerComp
                    class="mx-auto mb-0"
                    label-text="avefi:Manifestation" 
                  />
                </div>
              </div>
              <div class="col-span-1">
                <MicroLabelComp label-text="in_language_code" />
                <SearchHighlightListComp
                  :items="manifestation?.has_record?.in_language?.map(lang => lang.code)"
                  :hilite="item._highlightResult?.manifestations?.has_record?.in_language?.code?.matchedWords"                  
                  class="mb-2"
                />
              </div>
              <div class="col-span-1">
                <MicroLabelComp label-text="has_colour" />
                <SearchHighlightSingleComp 
                  :item="manifestation?.has_record?.has_colour_type"
                  :hitlite="item._highlightResult?.manifestations?.has_record?.has_colour_type?.matchedWords"                  
                  class="mb-2"
                />
              </div>
            </div>
            <hr class="my-2">
            <h4 class="font-bold text-sm text-primary-800 dark:text-primary-200 pl-1 uppercase">
              {{ $t('items') }}
            </h4>
            <div
              v-for="exemplar in manifestation.items"
              :key="exemplar.id"
              class="grid grid-cols-1 md:grid-cols-5 gap-2 bg-slate-200 rounded-lg p-2 dark:bg-slate-900 dark:text-white mt-2"
            >
              <div class="col-span-full">
                <MicroDividerComp
                  class="mx-auto"
                  label-text="avefi:Item" 
                />
              </div>
              <div class="col-span-1">
                <MicroLabelComp label-text="has_format" />
                <SearchHighlightListComp
                  :items="exemplar?.has_record?.has_format?.map(form => form.type)"
                  :hilite="item._highlightResult?.manifestations?.items.has_record?.has_format.matchedWords"                  
                  class="mb-2"
                />
              </div>
              <div class="col-span-1">
                <MicroLabelComp label-text="item_element_type" />
                <SearchHighlightSingleComp
                  :item="exemplar?.has_record.element_type"
                  :hitlite="item._highlightResult?.manifestations?.items.has_record?.element_type?.matchedWords"
                  class="mb-2"
                />
              </div>
              <div class="col-span-1">
                <MicroLabelComp label-text="in_language_code" />
                <SearchHighlightSingleComp
                  :item="exemplar?.has_record?.in_language?.code"
                  :hitlite="item._highlightResult?.manifestations?.items.has_record?.in_language?.code?.matchedWords"
                  class="mb-2"
                />
              </div>
              <div class="col-span-1 flex flex-col justify-center">
                <a
                  v-if="exemplar?.has_record?.has_webresource"
                  :href="exemplar?.has_record?.has_webresource"
                  target="_blank"
                  class="link link-primary dark:link-accent"
                ><Icon
                  name="formkit:linkexternal"
                />&nbsp;{{ $t('webresource') }}</a>
              </div>

              <div class="col-span-1 col-start-5 flex flex-col justify-center items-center">
                <MicroEfiCopyComp :handle="exemplar?.handle" />
              </div>
            </div>
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
import type { MovingImageRecord } from '../../models/interfaces/av_efi_schema.ts';

const props = defineProps({
    items: {
        type: Array as PropType<Array<MovingImageRecord>>,
        required: true
    }
});

function getCategoryClass(category: string) {
    switch (category) {
    case 'avefi:Manifestation':
        return 'dark:bg-slate-700 bg-slate-50';
    case 'avefi:Item':
        return 'dark:bg-slate-800 bg-slate-100';
    default:
        return 'dark:bg-slate-600 border-none pb-2 hover:bg-blend-darken';
    }
}
</script>
