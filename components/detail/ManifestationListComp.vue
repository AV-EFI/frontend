<template>
  <div class="">
    <NuxtLayout
      name="partial-grid-2-1-flex"
      class="mt-4"
    >
      <template #heading />
      <template #right />
    </NuxtLayout>

    <div
      v-for="(manifestation,i) in manifestationList"
      :key="manifestation._id || i"
      class="mt-2 collapse collapse-plus border-base border-2"
    >
      <input
        :id="`manifestation-${manifestation.handle || manifestation._id}`"
        type="checkbox"
        :name="`manifestation-${manifestation.handle || manifestation._id}`"
        class="manifestation-accordion-toggle"
        :aria-label="$t('toggleManifestation', { manifestationId: manifestation.handle || manifestation._id })"
        :alt="$t('toggleManifestation', { manifestationId: manifestation.handle || manifestation._id })"
        :title="$t('toggleManifestation', { manifestationId: manifestation.handle || manifestation._id })"
      >
      <div class="collapse-title bg-base-100 dark:bg-slate-700 dark:text-white">
        <DetailManifestationHeaderComp :manifestation="manifestation" />
      </div>

      <div class="collapse-content bg-gray-100 dark:bg-gray-800 dark:text-white">
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
          <!-- LEFT: 1–5 -->
          <template #left>
            <!-- 01 EFI Handle -->
            <DetailKeyValueComp
              :id="manifestation.handle?.replace?.('21.11155/', '')"
              keytxt="efi"
              :valtxt="manifestation?.handle"
              class="col-span-full"
              :clip="true"
            />

            <!-- 02 Titel -->
            <DetailKeyValueComp
              keytxt="title"
              :valtxt="manifestation?.has_record?.has_primary_title?.has_name"
              class="col-span-full"
              :clip="false"
            />

            <!-- 03 Datenhaltende Institution -->
            <DetailKeyValueComp
              v-if="manifestation?.has_record?.described_by?.has_issuer_name"
              keytxt="dataholding"
              :valtxt="manifestation?.has_record?.described_by?.has_issuer_name"
              class="col-span-full"
              :clip="false"
            />

            <!-- 04 Web-Ressource -->
            <div
              v-if="webresources(manifestation).length"
              class="col-span-full flex items-center gap-1"
            >
              <MicroLabelComp label-text="webresource" />
              <GlobalTooltipInfo :text="$t('tooltip.webresource')" />
            </div>
            <div
              v-for="(webresource, idx) in webresources(manifestation)"
              :key="webresource + '-' + idx"
              class="col-span-full"
            >
              <a
                :href="webresource"
                target="_blank"
                rel="noopener"
                :title="safeT('webresource')"
                :alt="safeT('webresource')"
                class="link link-primary dark:link-accent inline-flex items-center gap-1"
              >
                <span>{{ safeT('webresource') }}<span v-if="webresources(manifestation).length > 1">&nbsp;{{ idx + 1 }}</span></span>
                <Icon name="formkit:linkexternal" />
              </a>
            </div>

            <!-- 05 Notiz -->
            <DetailKeyValueListComp
              v-if="Array.isArray(manifestation?.has_record?.has_note) && manifestation.has_record.has_note.length"
              class="col-span-full text-justify md:pr-2"
              keytxt="avefi:Note"
              :valtxt="manifestation?.has_record?.has_note"
              :ul="true"
            />
          </template>

          <!-- RIGHT: 6–15 -->
          <template #right>
            <!-- 06–08 Manifestationsereignis (Typ/Datum/Ort) -->
            <DetailHasEventComp
              class="mt-0"
              :model-value="manifestation?.has_record?.has_event ?? []"
            />

            <!-- 09 Sprache -->
            <MicroLabelComp
              v-if="manifestation?.has_record?.in_language?.length"
              label-text="avefi:Language"
              class="w-full"
            />
            <ul
              v-if="manifestation?.has_record?.in_language?.length"
              class="w-full mt-2"
            >
              <li
                v-for="(lang, i) in manifestation?.has_record?.in_language"
                :key="lang?.code || i"
              >
                <span v-if="lang?.code">{{ $t(lang.code) }}</span>
                <span v-else>{{ $t('unknownLanguage') }}</span>
                <span
                  v-for="usage in (lang?.usage || [])"
                  :key="usage"
                >&nbsp;({{ $t(usage) }})</span>
              </li>
            </ul>

            <!-- 10 Ton (Sound Type) -->
            <DetailKeyValueComp
              v-if="manifestation?.has_record?.has_sound_type"
              keytxt="has_sound_type"
              :valtxt="manifestation?.has_record?.has_sound_type"
              :clip="false"
              class="w-full mt-2"
            />

            <!-- 11 Farbe (Colour Type) -->
            <DetailKeyValueComp
              v-if="manifestation?.has_record?.has_colour_type"
              keytxt="has_colour"
              :valtxt="manifestation?.has_record?.has_colour_type"
              class="w-full mt-2"
              :clip="false"
            />

            <!-- 12 Abspieldauer -->
            <DetailKeyValueComp
              v-if="manifestation?.has_record?.has_duration?.has_value"
              keytxt="avefi:Duration"
              :valtxt="formatDuration(manifestation?.has_record?.has_duration?.has_value)"
              :clip="false"
              class="w-full mt-2"
            />

            <!-- 13 Länge / Größe -->
            <DetailKeyValueComp
              v-if="manifestation?.has_record?.has_extent?.has_value"
              keytxt="avefi:Extent"
              :valtxt="formatExtent(manifestation?.has_record?.has_extent)"
              class="w-full mt-2"
              :clip="false"
            />
          </template>
        </NuxtLayout>

        <!-- 16 Exemplare -->
        <h4 class="relative font-bold text-sm text-primary-700 dark:text-primary-200 my-4 md:pl-4">
          {{ safeT('items') }}
          <GlobalTooltipInfo
            :text="$t('tooltip.item')"
            class="ml-2"
          />
        </h4>
        <div class="bg-white dark:bg-gray-900 rounded-xl md:ml-4">
          <DetailItemListNewComp
            v-if="manifestation?.items?.length > 0"
            :items="manifestation?.items"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Item, MovingImageRecord } from '../../models/interfaces/av_efi_schema.ts';
const { t } = useI18n();

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
        checkboxes.forEach((cb: any) => { cb.checked = false; });
    }
}

function safeT(input: unknown): string {
    if (typeof input !== 'string' || !input.trim()) return String(input ?? '');
    try { return t(input); } catch (err) {
        console.warn('Invalid translation key:', input, err);
        return String(input ?? '');
    }
}

function formatExtent(extent?: { has_value?: string | number, has_unit?: string }) {
    if (!extent?.has_value) return '';
    return `${extent.has_value} ${safeT(extent.has_unit)}`.trim();
}

function formatDuration(has_value: any): string {
    if (has_value) {
        try {
            const duration = has_value
                .replace(/PT/g, '')
                .replace(/S/g, '')
                .replace(/M/g, ':')
                .replace(/H/g, ':')
                .split(':');
            duration[0] = String(duration[0]).padStart(2, '0');
            if (duration.length > 1) duration[1] = String(duration[1]).padStart(2, '0');
            return duration.join(':');
        } catch (error) {
            console.error('Error formatting duration:', error);
            return String(has_value);
        }
    }
    return has_value;
}

function webresources(m: any): string[] {
    const wr = m?.has_record?.has_webresource;
    if (!wr) return [];
    return Array.isArray(wr) ? wr.filter(Boolean) : [wr];
}
</script>

<style scoped>
.collapse-plus > .collapse-title:after {
  @apply text-3xl w-4 h-4 text-primary-800 dark:text-white;
  top: 25%;
}
</style>
