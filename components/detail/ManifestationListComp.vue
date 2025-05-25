<template>
  <div class="">
    <NuxtLayout
      name="partial-grid-2-1-flex"
      class="mt-4"
    >
      <template #heading>
        <h3
          class="font-bold text-sm uppercase col-span-full pl-1 text-primary-800 dark:text-primary-100 decoration-manifestation"
          :alt="safeT('manifestations')"
        >
          {{ safeT('manifestations') }}
        </h3>
        <hr class="my-2 col-span-full">
      </template>
      <template #right />
    </NuxtLayout>

    <div
      v-for="(manifestation,i) in manifestationList"
      :key="manifestation._id || i"
      class="mt-2 collapse collapse-arrow"
    >
      <input
        :id="`manifestation-${manifestation._id}`"
        type="checkbox"
        :name="`manifestation-${manifestation._id}`"
        class="manifestation-accordion-toggle"
      >
      <div class="collapse-title bg-slate-100 dark:bg-slate-700 dark:text-white">
        <DetailManifestationHeaderComp :manifestation="manifestation" />
      </div>

      <div class="collapse-content bg-slate-50 dark:bg-slate-800 dark:text-white">
        <div class="w-full">
          <LazyMicroDividerComp
            label-text="avefi:Manifestation"
            in-class="manifestation"
          />
        </div>

        <NuxtLayout
          name="partial-grid-2-1-flex"
          left-class="border-l-2 border-manifestation pl-2"
        >
          <template #left>
            <DetailKeyValueComp
              :id="manifestation._id"
              keytxt="EFI"
              :valtxt="manifestation?.handle"
              class="col-span-full"
              :clip="true"
            />
            <DetailKeyValueComp
              v-if="manifestation?.has_record?.described_by?.has_issuer_name"
              keytxt="dataholding"
              :valtxt="manifestation?.has_record?.described_by?.has_issuer_name"
              class="col-span-full"
              :clip="false"
            />
            <MicroLabelComp
              v-if="manifestation?.has_record?.has_webresource"
              label-text="webresource"
              class="col-span-full"
            />
            <div
              v-for="webresource in manifestation?.has_record?.has_webresource"
              :key="webresource"
              class="col-span-full"
            >
              <a
                v-if="webresource"
                :href="webresource"
                target="_blank"
                :title="safeT('webresource')"
                :alt="safeT('webresource')"
                class="link link-primary dark:link-accent"
              >
                <span>{{ safeT('webresource') }} <Icon name="formkit:linkexternal" /></span>
              </a>
            </div>
            <DetailKeyValueListComp
              v-if="manifestation?.has_record?.has_note"
              class="col-span-full text-justify"
              keytxt="avefi:Note"
              :valtxt="manifestation?.has_record?.has_note"
              :ul="true"
            />
          </template>

          <template #right>
            <DetailKeyValueComp
              v-if="manifestation?.has_record?.has_duration?.has_value"
              keytxt="avefi:Duration"
              :valtxt="manifestation?.has_record?.has_duration?.has_value"
              :clip="false"
              class="w-full"
            />
            <DetailKeyValueComp
              v-if="manifestation?.has_record?.has_sound_type"
              keytxt="has_sound_type"
              :valtxt="manifestation?.has_record?.has_sound_type"
              :clip="false"
              class="w-full mt-2"
            />
            <DetailKeyValueComp
              v-if="manifestation?.has_record?.has_extent?.has_value"
              keytxt="avefi:Extent"
              :valtxt="formatExtent(manifestation?.has_record?.has_extent)"
              class="w-full mt-2"
              :clip="false"
            />
            <DetailKeyValueComp
              v-if="manifestation?.has_record?.has_colour_type"
              keytxt="has_colour"
              :valtxt="manifestation?.has_record?.has_colour_type"
              class="w-full mt-2"
              :clip="false"
            />
            <MicroLabelComp
              v-if="manifestation?.has_record?.in_language"
              label-text="avefi:Language"
              class="w-full mt-2"
            />
            <ul
              v-if="manifestation?.has_record?.in_language"
              class="w-full mt-2"
            >
              <li
                v-for="(lang, i) in manifestation?.has_record?.in_language"
                :key="lang?.code || i"
              >
                <span v-if="lang?.code">{{ $t(lang.code) }}</span>
                <span v-else>{{ $t('unknownLanguage') }}</span>
                <span
                  v-for="usage in lang?.usage"
                  :key="usage"
                >&nbsp;({{ $t(usage) }})</span>
              </li>
            </ul>
          </template>
        </NuxtLayout>

        <DetailHasEventComp
          class="mt-4"
          :model-value="manifestation?.has_record?.has_event ?? []"
        />

        <h4
          class="font-bold text-sm text-primary-800 dark:text-primary-200 uppercase my-4 md:pl-4"
          :alt="safeT('items')"
        >
          {{ safeT('items') }}
        </h4>

        <DetailItemListNewComp
          v-if="manifestation?.items?.length > 0"
          :items="manifestation?.items"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Item, MovingImageRecord } from '../../models/interfaces/av_efi_schema.ts';

const manifestationList = defineModel({
    type: Array as PropType<AVefiFEManifestation[]>,
    required: true
});

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

onMounted(() => {
    window.addEventListener('keydown', handleEscKey);
});
onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleEscKey);
});

function handleEscKey(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        const checkboxes = document.querySelectorAll('.manifestation-accordion-toggle');
        checkboxes.forEach((cb: any) => {
            cb.checked = false;
        });
    }
}

function safeT(input: unknown): string {
    if (typeof input !== 'string' || !input.trim()) return '';
    try {
        return $t(input);
    } catch (err) {
        console.warn('Invalid translation key:', input, err);
        return String(input ?? '');
    }
}

function formatExtent(extent?: { has_value?: string | number, has_unit?: string }) {
    if (!extent?.has_value) return '';
    return `${extent.has_value} ${safeT(extent.has_unit)}`.trim();
}
</script>
