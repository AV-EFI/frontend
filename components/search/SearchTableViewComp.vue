<template>
  <table class="table border-collapse border border-slate-400 table-sm w-full">
    <thead class="bg-primary-500 text-white">
      <tr>
        <th
          class="border border-slate-300"
          :alt="$t('title')"
          :title="$t('title')"
        >
          {{ $t('title').toUpperCase() }}
        </th>
        <th
          class="border border-slate-300"
          :alt="$t('title')"
          :title="$t('title')"
        >
          {{ $t('category').toUpperCase() }}
        </th>
        <th
          class="border border-slate-300 w-6 text-ellipsis overflow-hidden"
          :alt="$t('productionyear')"
          :title="$t('productionyear')"
        >
          {{ $t('year').toUpperCase() }}
        </th>
        <th
          class="border border-slate-300 max-w-16 text-ellipsis overflow-hidden"
          :alt="$t('directors')"
          :title="$t('directors')"
        >
          {{ $t('directors').toUpperCase() }}
        </th>
        <th
          class="border border-slate-300 max-w-16 text-ellipsis overflow-hidden"
          :alt="$t('productioncompany')"
          :title="$t('productioncompany')"
        >
          {{ $t('productioncompany').toUpperCase() }}
        </th>
        <th
          class="border border-slate-300 max-w-16 text-ellipsis overflow-hidden"
          :alt="$t('countries')"
          :title="$t('countries')"
        >
          {{ $t('countries').toUpperCase() }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in items"
        :key="item._id"
        :class="[item.has_record.category == 'avefi:Manifestation'? 'dark:bg-slate-800 bg-slate-50': item.has_record.category == 'avefi:Item' ? 'dark:bg-slate-900 bg-slate-100':'dark:bg-slate-700', 'hover:bg-blend-darken']"
      >
        <td
          class="border border-slate-200 dark:border-slate-600 min-w-12 max-w-80 md:max-w-96 xxl:max-w-128"
          style="word-wrap: break-word; overflow-wrap:break-word;}"
          :title="item.has_record.has_primary_title.has_name"
        >
          <a
            v-if="item.has_record.category == 'avefi:WorkVariant'"
            :href="`/film/${item.objectID}`"
            :title="$t('detailviewlink')"
            target="_blank"
            class="link dark:link-white"
          >
            <span v-if="item._highlightResult?.has_record">
              <ais-highlight
                attribute="has_record.has_primary_title.has_name"
                :hit="item"
              />
            </span>
            <span v-else>
              {{ item?.has_record?.has_primary_title.has_name }}
            </span>
          </a>
          <span
            v-else
            :title="$t('detailviewlink')"
            class=""
          >
            {{ item?.has_record?.has_primary_title.has_name }}
          </span>
        </td>
        <td
          class="border border-slate-200 dark:border-slate-600"
          style="width: 100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
          :title="$t(item?.has_record?.category)"
        >
          <MicroBadgeCategoryComp
            :category="item.has_record.category"
            :dense="true"
          />
        </td>
        <td
          class="border border-slate-200 dark:border-slate-600"
          style="max-width: 95px;
                 overflow: hidden;
                 text-overflow: ellipsis;
                 white-space: nowrap;"
        >
          <span class="float-right">{{ getProductionYearFromWorkVariation(item) }}</span>
        </td>
        <td
          class="border border-slate-200 dark:border-slate-600 w-[150px]"
          style="max-width: 200px;
                 overflow: hidden;
                 text-overflow: ellipsis;
                 white-space: nowrap;"
          :title="item?.directors?.join(', ')"
        >
          <span>
            {{ item?.directors?.join(', ') }}                       
          </span>
        </td>
        <td
          class="border border-slate-200 dark:border-slate-600"
          style="max-width: 200px;
                 overflow: hidden;
                 text-overflow: ellipsis;
                 white-space: nowrap;"
          :title="item.producers?.join(', ')"
        >
          <span>
            {{ item?.producers?.join(', ') }}
          </span>
        </td>
        <td
          class="border border-slate-200 dark:border-slate-600"
          style="max-width: 200px;
                 overflow: hidden;
                 text-overflow: ellipsis;
                 white-space: nowrap;"
          :title="item.country?.join(', ')"
        >
          <span>
            {{ item?.country?.join(', ') }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts" setup>
import {toast } from 'vue3-toastify';
//import {getAgentNameFromWorkVariation} from '../../utils/index.ts';
import type {MovingImageRecordContainer} from '../../models/interfaces/av_efi_schema.ts';
const props = defineProps({
    'items': {
        type: Array as PropType<Array<MovingImageRecordContainer>>,
        //type: Array,
        required:true
    }
});
</script>