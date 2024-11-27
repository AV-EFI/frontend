<template>
  <div
    v-for="item in items"
    :key="item._id"
    class="p-2"
  >
    <div
      v-if="item.has_record?.category"
      class="card bg-base-100 w-full shadow-lg hover:shadow-xl m-2"
    >
      <div
        class="flex flex-row min-h-12 w-full pl-[2rem] pr-[2rem] pt-2 pb-2 rounded-tl-xl rounded-tr-xl"
        :class="[item.has_record.category == 'avefi:Manifestation'? 'dark:bg-slate-800 bg-slate-50': item.has_record.category == 'avefi:Item' ? 'dark:bg-slate-900 bg-slate-100':'dark:bg-slate-700', 'hover:bg-blend-darken']"
      >
        <div class="w-3/4 content-center">
          <h2 class="text-md">
            <a
              v-if="item._highlightResult?.has_record"
              :href="`/film/${item.objectID}`"
              :title="$t('detailviewlink')"
              class="align-text-top"
              target="_blank"
            >
              <ais-highlight
                attribute="has_record.has_primary_title.has_name"
                :hit="item"
              />
            </a>
            <a
              v-else
              :href="`/film/${item.objectID}`"
              :title="$t('detailviewlink')"
              class="align-text-top"
              target="_blank"
            >
              {{ item?.has_record?.has_primary_title.has_name }}
            </a>
          </h2>
        </div>
        <div class="w-1/4 grid justify-items-center content-center">
          <MicroBadgeCategoryComp :category="item.has_record?.category" />
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
            <KeyValueListComp
              keytxt="year"
              :valtxt="item?.productionyear"
              class="mb-2"
            />
            <KeyValueListComp
              keytxt="countries"
              :valtxt="item?.country"
            />
          </div>
          <div class="w-1/2 flex flex-col">
            <KeyValueListComp
              keytxt="Director"
              :valtxt="item?.directors"
              class="mb-2"
            />
            <KeyValueListComp
              keytxt="productioncompany"
              :valtxt="item?.producers"
              :ul="true"
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
import {toast } from 'vue3-toastify';
import type {Activity, DirectingActivity, MovingImageRecord, ProductionEvent} from '../../models/interfaces/av_efi_schema.ts';
import type { WorkVariant } from '../../models/interfaces/av_efi_schema_type_utils.ts';
import KeyValueComp from '../detail/KeyValueComp.vue';
import KeyValueListComp from '../detail/KeyValueListComp.vue';
const props = defineProps({
    'items': {
        type: Array as PropType<Array<MovingImageRecord>>,
        //type: Array<MovingImageRecord>,
        required:true
    }
});

//DFF53D88-158D-4C70-A1E3-1646CDA3B094-SDK-TEST
console.log(props.items.filter((i) => {return i.has_record?.is_manifestation_of?.id.indexOf('DFF53D88-158D-4C70-A1E3-1646CDA3B094-SDK-TEST') > 0;}));
console.log(props.items);
</script>