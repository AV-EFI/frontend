<template>
  <div
    v-for="item in items"
    :key="item._id"
  >
    <div
      v-if="item.has_record?.category"
      class="card bg-base-100 dark:bg-slate-900 w-full shadow-lg hover:shadow-xl mt-2"
    >
      <div
        class="flex flex-row min-h-12 w-full pl-[2rem] pr-[2rem] pt-2 pb-2 rounded-tl-xl rounded-tr-xl"
        :class="[item.has_record.category == 'avefi:Manifestation'? 'dark:bg-slate-700 bg-slate-50': item.has_record.category == 'avefi:Item' ? 'dark:bg-slate-800 bg-slate-100':'dark:bg-slate-600 border-b-2 border-slate-200 dark:border-slate-700', 'hover:bg-blend-darken']"
      >
        <div class="w-2/5 content-center">
          <h2 class="text-md">
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
              class="align-text-top link  text-primary dark:text-white"
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
        
        <div class="w-1/5 grid justify-items-center content-center">
          <MicroBadgeCategoryComp :category="item.has_record?.category" />
        </div>
        <div class="w-2/5 grid justify-items-end content-end my-auto">
          <GlobalActionContextComp :item="item" />
        </div>
      </div>
      <div
        class="card-body pt-4"
      >
        <div class="flex flex-row">
          <div class="w-100 flex flex-col">
            <KeyValueComp
              keytxt="EFI"
              :valtxt="item?.handle"
              class="mb-2"
            />
          </div>
        </div>
        <div class="flex flex-row">
          <div class="w-1/2 flex flex-col">
            <MicroLabelComp
              label-text="Director"
            />
            <SearchHighlightListComp 
              :items="item?.directors"
              :hilite="item._highlightResult?.directors?.matchedWords"
              font-size="text-sm"
              class="mb-2"
            />
            <MicroLabelComp
              label-text="avefi:ProductionEvent"
            />
            <SearchHighlightListComp 
              :items="item?.producers"
              :hilite="item._highlightResult?.producers?.matchedWords"
              font-size="text-sm"
              class="mb-2"
            />
            <MicroLabelComp
              label-text="CastMember"
            />
            <SearchHighlightListComp 
              :items="item?.castmembers"
              :hilite="item._highlightResult?.castmembers?.matchedWords"
              font-size="text-sm"
              class="max-h-48 overflow-y-auto"
            />
          </div>
          <div class="w-1/2 ml-2 flex flex-col">
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
            <MicroLabelComp
              label-text="avefi:Subject"
            />
            <SearchHighlightListComp
              :items="item?.subjects"
              :hilite="item._highlightResult?.subjects?.matchedWords"
              font-size="text-sm"
              class="max-h-48 overflow-y-auto"
            />
          </div>
        </div>
        <!--div class="card-actions justify-end">
          <button
            type="button"
            class="btn btn-outline btn-primary"
          >
            <a
              :href="`/film/${item.objectID}`"
              :title="$t('detailviewlink')"
              class="align-text-top"
            >{{ $t('detailviewlink') }}&nbsp;
              <Icon
                class="text-xl align-text-bottom"
                name="bx:detail"
              />
            </a>
          </button>
        </div-->
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { MovingImageRecord} from '../../models/interfaces/av_efi_schema.ts';
const props = defineProps({
    'items': {
        type: Array as PropType<Array<MovingImageRecord>>,
        //type: Array<MovingImageRecord>,
        required:true
    }
});
console.log(props.items);

</script>