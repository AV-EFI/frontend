<template>
  <div
    v-for="item in items"
    :key="item._id"
    class="card bg-base-100 dark:bg-slate-900 w-full shadow-lg hover:shadow-xl mt-2"
  >
    <div
      v-if="item.has_record?.category"
      class="flex flex-col md:flex-row min-h-12 w-full p-4 rounded-tl-xl rounded-tr-xl"
      :class="getCategoryClass(item.has_record.category)"
    >
      <div class="w-full md:w-2/5 content-center">
        <h2 class="text-lg dark:text-white">
          <a
            v-if="item._highlightResult?.has_record && item.has_record?.category == 'avefi:WorkVariant'"
            :href="`/film/${item.objectID}`"
            :title="$t('detailviewlink')"
            class="align-text-top link text-primary dark:text-white"
            target="_blank"
          >
            <ais-highlight
              v-if="item._highlightResult?.has_record?.has_primary_title?.has_name"
              attribute="has_record.has_primary_title.has_name"
              :hit="item"
            />
            <span v-else>{{ item.has_record?.has_primary_title?.has_name }}</span>
          </a>
          <a
            v-else-if="item.has_record.category == 'avefi:WorkVariant'"
            :href="`/film/${item.objectID}`"
            :title="$t('detailviewlink')"
            class="align-text-top link text-primary dark:text-white"
            target="_blank"
          >
            <ais-highlight
              v-if="item._highlightResult?.has_record?.has_primary_title?.has_name"
              attribute="has_record.has_primary_title.has_name"
              :hit="item"
            />
            <span v-else>{{ item.has_record?.has_primary_title?.has_name }}</span>
          </a>
          <a
            v-else-if="item.has_record.is_manifestation_of"
            :href="`/film/${item.has_record.is_manifestation_of[0]?.id.replace('21.11155/','')}`"
            :title="$t('detailviewlink')"
            class="align-text-top link text-primary dark:text-white"
            target="_blank"
          >
            <ais-highlight
              v-if="item._highlightResult?.has_record?.has_primary_title?.has_name"
              attribute="has_record.has_primary_title.has_name"
              :hit="item"
            />
            <span v-else>{{ item.has_record?.has_primary_title?.has_name }}</span>
          </a>
          <span
            v-else
            :title="$t('pleaseusemanifestationlink')"
          >
            <ais-highlight
              v-if="item._highlightResult?.has_record?.has_primary_title?.has_name"
              attribute="has_record.has_primary_title.has_name"
              :hit="item"
            />
            <span v-else>{{ item.has_record?.has_primary_title?.has_name }}</span>
          </span>
        </h2>
      </div>
      <div class="w-full md:w-1/5 grid justify-items-center content-center mt-2 md:mt-0">
        <MicroBadgeCategoryComp :category="item.has_record?.category" />
      </div>
      <div class="w-full md:w-2/5 grid justify-items-end content-end my-auto mt-2 md:mt-0">
        <GlobalActionContextComp :item="item" />
      </div>
    </div>
    <div class="card-body pt-4">
      <div class="flex flex-col md:flex-row">
        <div class="w-full md:w-100 flex flex-col">
          <KeyValueComp
            keytxt="EFI"
            :valtxt="item?.handle"
            class="mb-2"
          />
        </div>
      </div>
      <div class="flex flex-col md:flex-row">
        <div class="w-full md:w-1/2 flex flex-col">
          <MicroLabelComp label-text="Director" />
          <SearchHighlightListComp
            :items="item?.directors"
            :hilite="item._highlightResult?.directors?.matchedWords"
            font-size="text-sm"
            class="mb-2"
          />
          <MicroLabelComp label-text="avefi:ProductionEvent" />
          <SearchHighlightListComp
            :items="item?.producers"
            :hilite="item._highlightResult?.producers?.matchedWords"
            font-size="text-sm"
            class="mb-2"
          />
          <MicroLabelComp label-text="CastMember" />
          <SearchHighlightListComp
            :items="item?.castmembers"
            :hilite="item._highlightResult?.castmembers?.matchedWords"
            font-size="text-sm"
            class="max-h-48 overflow-y-auto"
          />
        </div>
        <div class="w-full md:w-1/2 ml-2 flex flex-col">
          <KeyValueListComp
            keytxt="year"
            :valtxt="item?.productionyears"
            class="mb-2"
            :ul="true"
          />
          <KeyValueListComp
            keytxt="country"
            :valtxt="item.countries"
            :ul="true"
            class="mb-2"
          />
          <MicroLabelComp label-text="avefi:Subject" />
          <SearchHighlightListComp
            :items="item?.subjects"
            :hilite="item._highlightResult?.subjects?.matchedWords"
            font-size="text-sm"
            class="max-h-48 overflow-y-auto"
          />
        </div>
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
        return 'dark:bg-slate-600 border-b-2 border-slate-200 dark:border-slate-700 hover:bg-blend-darken';
    }
}
</script>
