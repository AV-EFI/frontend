<template>
  <div class="">
    <div v-for="(manifestation,i) in manifestationList" :key="manifestation._id || i" :id="`manifestation-${i}`"
      class="mt-2 collapse collapse-plus border-base-200 border-2">
      <input :id="`manifestation-${manifestation.handle || manifestation._id}`" type="checkbox"
        :name="`manifestation-${manifestation.handle || manifestation._id}`" class="manifestation-accordion-toggle"
        :aria-label="$t('toggleManifestation', { manifestationId: manifestation.handle || manifestation._id })"
        :alt="$t('toggleManifestation', { manifestationId: manifestation.handle || manifestation._id })"
        :title="$t('toggleManifestation', { manifestationId: manifestation.handle || manifestation._id })">
      <div class="collapse-title dark:bg-gray-800 dark:text-white">
        <DetailManifestationHeaderComp :manifestation="manifestation" />
      </div>

      <div class="collapse-content bg-gray-50 dark:bg-gray-800 dark:text-white">
        <!-- 16 Exemplare -->
        <h4 class="relative font-bold text-sm text-primary-700 dark:text-primary-200 my-4 md:pl-4">
          {{ safeT('items') }}
          <GlobalTooltipInfo :text="$t('tooltip.item')" class="ml-2" />
        </h4>
        <div class="bg-white dark:bg-gray-900 rounded-xl md:ml-4">
          <DetailItemListNewComp v-if="manifestation?.items?.length > 0" :items="manifestation?.items" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Item, MovingImageRecord } from '~/models/interfaces/schema/avefi_schema.js';
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
.collapse-plus>.collapse-title:after {
  @reference "tailwindcss";
  @apply w-4 h-4 dark:text-white;
  color: var(--color-primary-800);
  top: 25%;
}
</style>
