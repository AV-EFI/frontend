<template>
  <EasyDataTable
    table-class-name="customize_table w-[300px] md:w-auto"
    table-theme-color="var(--primary)"
    :headers="headers"
    :items="items"
    alternating
    buttons-pagination
    show-index
    hide-footer
    :rows-per-page="10"
  >
    <template #header-has_record.has_primary_title.has_name="header">
      <div class="customize-header dark:text-primary-100">
        {{ $t(header.text) }}
      </div>
    </template>
    <template #header-has_record.has_event.located_in.has_name="header">
      <div class="customize-header dark:text-primary-100">
        {{ $t(header.text) }}
      </div>
    </template>
    <template #header-years="header">
      <div class="customize-header dark:text-primary-100">
        {{ $t(header.text) }}
      </div>
    </template>
    <template #header-directors_or_editors="header">
      <div class="customize-header dark:text-primary-100">
        {{ $t(header.text) }}
      </div>
    </template>
    <template #header-production="header">
      <div class="customize-header dark:text-primary-100">
        {{ $t(header.text) }}
      </div>
    </template>
    <template #loading>
      <div class="dark:text-primary-100">
        loading items ...
      </div>
    </template>
    <template #item-has_record.has_primary_title.has_name="item">
      <div class="w-full flex flex-row">
        <div class="dark:text-primary-100 w-4/5 my-auto">
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
        </div>
        <MicroEfiCopyComp
          :handle="item?.handle"
          comp-size="sm"
          class="my-auto"
        />
        <div
          v-if="showAdminStats"
          class="w-full flex flex-col items-start py-1 text-primary-900 dark:text-white text-xs"
        >
          <span
            alt="Status"
            title="Status"
            class="badge badge-success badge-xs text-white"
          >Public
          </span>
          <span
            :alt="$t('lastedit')"
            :title="$t('lastedit')"
          >{{ new Date(item?.['@timestamp']??'').toLocaleString('de-DE') }}</span>
          <span
            :alt="$t('lastedit')"
            :title="$t('lastedit')"
          >{{ item?.has_record?.described_by?.has_issuer_name }}</span>
          <button
            :alt="$t('showHistory')"
            :title="$t('showHistory')"
            class="btn btn-xs btn-primary"
          >
            <Icon
              name="material-symbols:history"
              class="w-4 h-4 mr-1 inline-block"
            />
          </button>
        </div>
        <GlobalActionContextComp
          v-if="!showAdminStats"
          :item="item"
          comp-size="sm"
          class="w-1/5 justify-center items-center my-auto"
        />          
      </div>
    </template>
    <template #item-has_record.has_event.located_in.has_name="item">
      <DetailKeyValueListComp
        :valtxt="item?.has_record?.has_event?.flatMap(ev => ev.located_in?.map(location => location.has_name) || null)"
        :ul="true"
        font-size="text-sm"
        overflow-y="overflow-y-clip"
        class="mb-2"
      />
    </template>
    <template #item-years="item">
      <DetailKeyValueListComp
        :valtxt="item?.years"
        class="mb-2"
        font-size="text-sm"
        :ul="true"
      />
    </template>
    <template #item-directors_or_editors="item">
      <SearchHighlightListComp
        :items="item?.directors_or_editors"
        :hilite="item._highlightResult?.directors_or_editors?.flatMap((dirs) => ( dirs.matchedWords ))"            
        font-size="text-sm"
        class="mb-2"
      />
    </template>
    <template #item-production="item">
      <SearchHighlightListComp
        :items="item?.production"
        :hilite="item._highlightResult?.production?.flatMap((dirs) => ( dirs.matchedWords ))"            
        font-size="text-sm"
        class="mb-2"
      />
    </template>
    <template
      #expand="item"
    >
      <div
        v-for="manifestation in item?.manifestations"
        :key="manifestation.id"
        class="collapse collapse-arrow rounded-none md:pl-[64px]"
      >
        <input
          type="checkbox"
          class="manifestation-checkbox"
        >
        <div class="collapse-title py-2 bg-slate-100 dark:bg-slate-700 dark:text-whitefont-medium">
          <DetailManifestationHeaderComp
            :manifestation="manifestation"
            type="searchresult"
            comp-size="sm"
          />
        </div>
        <div class="collapse-content bg-slate-50 dark:bg-slate-800 dark:text-white">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div class="col-span-1">
              <MicroLabelComp 
                label-text="in_language_code"
                font-size="text-xs"
              />
              <SearchHighlightListComp
                :items="manifestation?.has_record?.in_language?.map(lang => lang.code)"
                :hilite="item._highlightResult?.manifestations?.has_record?.in_language?.code?.matchedWords"                  
                font-size="text-xs"
                class="mb-2"
              />
            </div>
            <div class="col-span-1">
              <MicroLabelComp 
                label-text="has_colour"
                font-size="text-xs"
              />
              <SearchHighlightSingleComp 
                :item="manifestation?.has_record?.has_colour_type"
                :hitlite="item._highlightResult?.manifestations?.has_record?.has_colour_type?.matchedWords"
                font-size="text-xs"                  
                class="mb-2"
              />
            </div>
          </div>
          <hr class="my-2">
          <h4 class="font-bold text-item-900 dark:text-item-200 pl-1 underline decoration-item">
            {{ $t('items') }}
          </h4>
          <table class="table border-collapse border border-slate-400 table-sm max-w-full mt-2">
            <thead class="bg-slate-200 dark:bg-slate-900 dark:text-white">
              <tr>
                <th class="border border-slate-300">
                  efi
                </th>
                <th class="border border-slate-300">
                  {{ $t('has_format') }}
                </th>
                <th class="border border-slate-300">
                  {{ $t('item_element_type') }}
                </th>
                <th class="border border-slate-300">
                  {{ $t('in_language_code') }}
                </th>
                <th class="border border-slate-300">
                  {{ $t('webresource') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="exemplar in manifestation.items"
                :key="exemplar.id"
                class="bg-slate-100 dark:bg-slate-800 dark:text-white"
              >
                <td class="border border-slate-200 dark:border-slate-600 flex flex-row items-center justify-between">
                  <p class="text-xs">
                    {{ exemplar.handle }}
                  </p>
                  <LazyMicroEfiCopyComp
                    :handle="exemplar.handle"
                    comp-size="sm"
                    class="z-10 relative"
                  />
                </td>
                <td class="border border-slate-200 dark:border-slate-600">
                  <SearchHighlightListComp
                    :items="exemplar?.has_record?.has_format?.map(form => form.type)"
                    :hilite="item._highlightResult?.manifestations?.items.has_record?.has_format.matchedWords"
                    font-size="text-xs"
                    class="mb-2"
                  />
                </td>
                <td class="border border-slate-200 dark:border-slate-600">
                  <SearchHighlightSingleComp
                    :item="exemplar?.has_record.element_type"
                    :hitlite="item._highlightResult?.manifestations?.items.has_record?.element_type?.matchedWords"
                    class="mb-2"
                  />
                </td>
                <td class="border border-slate-200 dark:border-slate-600">
                  <SearchHighlightSingleComp
                    :item="exemplar?.has_record?.in_language?.code"
                    :hitlite="item._highlightResult?.manifestations?.items.has_record?.in_language?.code?.matchedWords"
                    font-size="text-xs"
                    class="mb-2"
                  />
                </td>
                <td class="border border-slate-200 dark:border-slate-600">
                  <a
                    v-if="exemplar?.has_record?.has_webresource"
                    :href="exemplar?.has_record?.has_webresource"
                    target="_blank"
                    class="link link-primary dark:link-accent text-xs"
                  >
                    <Icon
                      name="formkit:linkexternal"
                    />&nbsp;{{ $t('webresource') }}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </EasyDataTable>
</template>
<script lang="ts" setup>
import type {MovingImageRecordContainer} from '../../models/interfaces/av_efi_schema.ts';
const props = defineProps({
    'items': {
        type: Array as PropType<Array<MovingImageRecordContainer>>,
        required:true
    },
    showAdminStats: {
        type: Boolean,
        required: false,
        default: false,
    }
});

const headers = [
    { text: 'title', value: 'has_record.has_primary_title.has_name' },
    { text: 'country', value: 'has_record.has_event.located_in.has_name' },
    { text: 'year', value: 'years' },
    { text: 'directors_or_editors', value: 'directors_or_editors' },
    { text: 'avefi:ProductionEvent', value: 'production' }
];

</script>