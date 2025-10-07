<template>
  <div class="">
    <NuxtLayout
      name="partial-grid-2-1-flex"
      class="mt-4"
    >
      <template #heading>
        <hr class="my-2 col-span-full">
        <h3
          class="relative font-bold text-lg col-span-full pl-1 text-primary-800 dark:text-primary-100"
          :alt="safeT('manifestations')"
        >
          {{ safeT('manifestations') }}
          <span
            class="ml-2 text-neutral-500 dark:text-neutral-300 text-sm cursor-help"
            :title="$t('tooltip.manifestation')"
          >
            ⓘ
          </span>
        </h3>
      </template>
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
        <DetailManifestationHeaderComp 
          v-if="manifestation.handle"
          :manifestation="manifestation as any" 
        />
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
                <Icon name="tabler:external-link" />
                <span>{{ safeT('webresource') }} <Icon name="tabler:external-link" /></span>
              </a>
            </div>

            <!-- 05 Notiz -->
            <DetailKeyValueListComp
              v-if="Array.isArray(manifestation?.has_record?.has_note) && manifestation.has_record.has_note.length"
              class="col-span-full text-justify md:pr-2"
              keytxt="avefi:Note"
              :valtxt="manifestation?.has_record?.has_note.map((note: any) => ({ value: note }))"
              :ul="true"
            />
          </template>

          <!-- RIGHT: 6–15 -->
          <template #right>
            <!-- 11–15 Events -->
            <DetailHasEventComp
              class="mt-4"
              :model-value="(manifestation?.has_record?.has_event ?? []) as any"
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
            v-if="manifestation?.items && manifestation.items.length > 0"
            :items="(manifestation.items || []) as IAVefiItem[]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import type { IAVefiManifestation, IAVefiItem } from '@/models/interfaces/generated';
import type { Manifestation, Item, Language } from '@/models/interfaces/schema/avefi_schema_type_utils';
import type { PropType } from 'vue';

const { t } = useI18n();

// Extended interfaces for Elasticsearch compatibility
interface ExtendedManifestation extends Manifestation {
  in_language?: Language[];
  has_sound_type?: string;
  has_colour_type?: string;
  has_duration?: any;
  has_extent?: any;
  _id?: string;
  [key: string]: any;
}

const manifestationList = defineModel({
    type: Array as PropType<any[]>,
    required: true
});

onMounted(() => {
    window.addEventListener('keydown', handleEscKey);
});
onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleEscKey);
});

function handleEscKey(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        const checkboxes = document.querySelectorAll('.manifestation-accordion-toggle') as NodeListOf<HTMLInputElement>;
        checkboxes.forEach((cb: HTMLInputElement) => {
            cb.checked = false;
        });
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
    return String(has_value || '');
}

function webresources(m: any): string[] {
    const wr = m?.has_record?.has_webresource;
    if (!wr) return [];
    return Array.isArray(wr) ? wr.filter(Boolean) : [wr];
}
</script>

<style scoped>
/*
.collapse-plus > .collapse-title:after {
  @apply text-3xl w-4 h-4 text-primary-800 dark:text-white;
  top: 25%;
}
*/
</style>
