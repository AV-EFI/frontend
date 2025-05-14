<template>
  <div class="">
    <NuxtLayout
      name="partial-grid-2-1-flex"
      class="mt-4"
    >
      <template #heading>
        <h3
          class="font-bold text-sm uppercase col-span-full pl-1 text-primary-800 dark:text-primary-100 decoration-manifestation"
          :alt="$t('manifestations')"
        >
          {{ $t('manifestations') }}
        </h3>
        <hr class="my-2 col-span-full">
      </template>
      <template #right />
    </NuxtLayout>
    <div
      v-for="manifestation in manifestationList"
      :key="manifestation._id"
      class="mt-2 collapse collapse-arrow"
    >    
      <input
        type="radio"
        name="manifestation-accordion"
        class="manifestation-accordion-toggle"
        :checked="manifestationList.length < 2?'true':false"
      >
      <div class="collapse-title bg-slate-100 dark:bg-slate-700 dark:text-white">
        <DetailManifestationHeaderComp
          :manifestation="manifestation"
        />
      </div>
      <div class="collapse-content bg-slate-50 dark:bg-slate-800 dark:text-white">
        <div class="w-full">
          <LazyMicroDividerComp label-text="avefi:Manifestation" />
        </div>
        <NuxtLayout
          name="partial-grid-2-1-flex"
          left-class="border-l-2 border-manifestation pl-2"
        >
          <template #left>
            <DetailKeyValueComp
              :id="manifestation._id"
              keytxt="EFI"
              :valtxt="manifestation._source?.handle"
              class="col-span-full"
              :clip="false"
            />
            <DetailKeyValueComp
              v-if="manifestation._source?.has_record?.described_by?.has_issuer_name"
              keytxt="dataholding"
              :valtxt="manifestation._source?.has_record?.described_by?.has_issuer_name"
              class="col-span-full"
              :clip="false"
            />
            <MicroLabelComp
              v-if="manifestation._source?.has_record?.has_webresource"
              label-text="webresource"
              class="col-span-full"
            />
            <div
              v-for="webresource in manifestation._source?.has_record?.has_webresource"
              :key="webresource"
              class="col-span-full"
            >
              <a
                v-if="webresource"
                :href="webresource"
                target="_blank"
                :title="$t('webresource')"
                :alt="$t('webresource')"
                class="link link-primary dark:link-accent"
              ><span class="">{{ $t('webresource') }}&nbsp;
                <Icon
                  name="formkit:linkexternal"
                  class=""
                /></span></a>
            </div>
            <DetailKeyValueListComp
              v-if="manifestation._source.has_record?.has_note"
              class="col-span-full text-justify"
              keytxt="avefi:Note"              
              :valtxt="manifestation._source.has_record?.has_note"
              :ul="true"
            />
          </template>
          <template #right>
            <DetailKeyValueComp
              v-if="manifestation._source.has_record?.has_duration?.has_value"
              keytxt="avefi:Duration"
              :valtxt="manifestation._source.has_record?.has_duration?.has_value_clean?? manifestation._source.has_record?.has_duration?.has_value"
              class="w-full"
            />
            <DetailKeyValueComp
              v-if="manifestation._source.has_record?.has_extent?.has_value"
              keytxt="avefi:Extent"
              :valtxt="`${manifestation._source.has_record?.has_extent?.has_value} ${manifestation._source.has_record?.has_extent?.has_unit}`"
              class="w-full mt-2"
            />
            <DetailKeyValueComp
              v-if="manifestation._source.has_record?.has_colour_type"
              keytxt="has_colour"
              :valtxt="manifestation._source.has_record?.has_colour_type"
              class="w-full mt-2"
              :clip="false"
            />
            <MicroLabelComp
              v-if="manifestation._source.has_record?.in_language"
              label-text="avefi:Language"
              class="w-full mt-2"
            />
            <ul
              v-if="manifestation._source.has_record?.in_language"
              class="w-full mt-2"
            >
              <li
                v-for="lang in manifestation._source.has_record?.in_language"
                :key="lang.code"
              >
                <span class="">{{ $t(lang?.code) }}</span>&nbsp;
                <span
                  v-for="usage in lang?.usage"
                  :key="usage"
                >({{ $t(usage) }})</span>
              </li>
            </ul>
          </template>
        </NuxtLayout>
        <DetailHasEventComp
          class="mt-4"
          :model-value="manifestation._source.has_record?.has_event ?? []"
        />
        <DetailItemListNewComp
          v-if="manifestation._source.items.length > 0"
          :items="manifestation._source.items"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Item, MovingImageRecord } from '../../models/interfaces/av_efi_schema.ts';

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

manifestationList.value.forEach((mani) => {
    if(mani._source.has_record?.has_duration?.has_value) {
        const duration = mani._source.has_record.has_duration.has_value.replace(/PT/g, '').replace(/S/g, '').split('M');
        duration[0] = String(duration[0]).padStart(2, '0');
        if(duration.length > 1) {
            duration[1] = String(duration[1]).padStart(2, '0');
        }
        mani._source.has_record.has_duration.has_value_clean = duration.join(':');
    }
});

</script>