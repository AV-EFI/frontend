<template>
  <div class="ml-2">
    <NuxtLayout
      name="partial-grid-2-1"
      class="mt-4"
    >
      <template #left>
        <h2
          class="text-lg col-span-full text-primary-900 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
          :alt="$t('manifestations')"
        >
          {{ $t('manifestations') }}
        </h2>  
      </template>
      <template #right />
    </NuxtLayout>
    <div
      v-for="manifestation in manifestationList"
      :key="manifestation._id"
      class="mt-2 collapse collapse-plus"
    >    
      <input
        type="radio"
        :name="`manifestation-accordion`"
        :checked="manifestationList.length < 2?'true':false"
      >
      <div class="collapse-title bg-slate-100 dark:bg-slate-800 dark:text-white">
        <NuxtLayout name="partial-grid-2-1">
          <template #left>
            <h4 class="col-span-full text-sm">
              {{ manifestation._source?.handle }}
            </h4>
          </template>
          <template #right />
        </nuxtlayout>
      </div>
      <div class="collapse-content bg-slate-50 dark:bg-slate-900 dark:text-white">
        <MicroDividerComp
          in-class="manifestation"
          :label-text="manifestation._source.has_record.category"
        />
        <NuxtLayout name="partial-grid-2-1">
          <template #left>
            <DetailKeyValueComp
              keytxt="EFI"
              :valtxt="manifestation._source?.handle"
              class="col-span-full"
            />
            <DetailKeyValueComp
              v-if="manifestation._source?.has_record?.described_by?.has_issuer_name"
              keytxt="Described by"
              :valtxt="manifestation._source?.has_record?.described_by?.has_issuer_name"
              class="col-span-full"
            />
            <DetailKeyValueListComp
              v-if="manifestation._source?.has_record?.has_webresource"
              keytxt="Webresource"
              :valtxt="manifestation._source?.has_record?.has_webresource"
              class="col-span-full"
            />
            <DetailKeyValueListComp
              v-if="manifestation._source.has_record?.has_note"
              class="col-span-full"
              keytxt="avefi:Note"
              :valtxt="manifestation._source.has_record?.has_note"
              :ul="true"
            />
          </template>
          <template #right>
            <DetailKeyValueComp
              v-if="manifestation._source.has_record?.has_duration?.has_value"
              keytxt="avefi:Duration"
              :valtxt="manifestation._source.has_record?.has_duration?.has_value"
              class="w-full"
            />
            <DetailKeyValueComp
              v-if="manifestation._source.has_record?.has_extent?.has_value"
              keytxt="avefi:Extent"
              :valtxt="`${manifestation._source.has_record?.has_extent?.has_value} ${manifestation._source.has_record?.has_extent?.has_unit}`"
              class="w-full mt-1"
            />
            <ul
              v-if="manifestation._source.has_record?.in_language"
              class="w-full mt-1"
            >
              <li
                v-for="lang in manifestation._source.has_record?.in_language"
                :key="lang.code"
              >
                <span class="uppercase">{{ $t(lang?.code) }}</span>&nbsp;
                <span
                  v-for="usage in lang?.usage"
                  :key="usage"
                >{{ $t(usage) }}</span>
              </li>
            </ul>
          </template>
        </NuxtLayout>
        <DetailHasEventComp
          class="mt-2"
          :model-value="manifestation._source.has_record?.has_event"
        />
        <DetailItemListComp
          v-model="manifestation._source.items"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Header } from 'vue3-easy-data-table';
import type { Item, Manifestation, MovingImageRecord, MovingImageRecordContainer } from '../../models/interfaces/av_efi_schema.ts';

const manifestationList = defineModel({type: Array as PropType<AVefiFEManifestation[]>, required: true});

interface AVefiFEManifestation {
    _source: Source;
    _id: string;
    index: string;
    _score: number;
}

interface Source {
    handle: string;
    kip: string;
    has_record: MovingImageRecord;
    items: Item[];
}

</script>