<template>
  <div
    v-for="item in items"
    :key="item._id"
    :class="[item.has_record.category == 'avefi:Manifestation'? 'dark:bg-neutral-900 bg-slate-50': item.has_record.category == 'avefi:Item' ? 'dark:bg-neutral-800 bg-slate-100':'', 'hover:bg-blend-darken px-2']"
  >
    <div
      v-if="item.has_record.category"
      class="card bg-base-100 w-full shadow-lg hover:shadow-xl mb-2"
    >
      <div class="card-body">
        <div class="flex flex-row">
          <div class="w-3/4">
            <h2 class="text-md">
              <span v-if="item._highlightResult?.has_record">
                <ais-highlight
                  attribute="has_record.has_primary_title.has_name"
                  :hit="item"
                />
              </span>
              <span v-else>
                {{ item?.has_record?.has_primary_title.has_name }}
              </span>
            </h2>
          </div>
          <div class="w-1/4 grid justify-items-center">
            <MicroBadgeCategoryComp :category="item.has_record?.catgegory" />
          </div>
        </div>
        <div class="flex flex-row">
          <div class="w-1/2 flex flex-col">
            <span class="capitalize font-semibold">{{ $t('year') }}:</span>
            <span>{{ getProductionYearFromWorkVariation(item) }}</span>
            <span class="capitalize font-semibold mt-2">EFI:</span>
            <span>{{ item?.handle }}</span>
          </div>
          <div class="w-1/2  flex flex-col">
            <span class="capitalize font-semibold">{{ $t('Director') }}:</span>
            <span> {{ getAgentNameFromWorkVariation(item, "avefi:DirectingActivity") || '-' }}</span>
            <span class="capitalize font-semibold mt-2">{{ $t('productioncompany') }}:</span>
            <span> {{ getAgentNameFromWorkVariation(item, "avefi:ProducingActivity") || '-' }}</span>
          </div>
        </div>
        <div class="card-actions justify-end">
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
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {toast } from 'vue3-toastify';
import type {Activity, DirectingActivity, MovingImageRecord, ProductionEvent} from '../../models/interfaces/av_efi_schema.ts';
import type { WorkVariant } from '../../models/interfaces/av_efi_schema_type_utils.ts';
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