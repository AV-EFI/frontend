<template>
    <div role="list" :aria-label="$t('manifestations')">
        <section
            v-for="(manifestation, i) in manifestationList"
            :id="getManifestationAnchorId(manifestation, i)"
            :key="manifestation._id || i"
            class="mt-2 border-base-200 border-2 rounded-lg overflow-hidden bg-base-100"
            role="listitem"
            :data-manifestation-index="i"
            :aria-labelledby="`manifestation-heading-${i}`"
        >
            <button
                type="button"
                class="w-full text-left px-4 py-3 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                :aria-expanded="isManifestationOpen(i) ? 'true' : 'false'"
                :aria-controls="`manifestation-panel-${i}`"
                :title="$t('toggleManifestation', { manifestationId: manifestation.handle || manifestation._id })"
                @click="toggleManifestation(i)"
            >
                <div class="flex items-start justify-between gap-3">
                    <DetailManifestationHeaderComp
                        :manifestation="manifestation"
                        :heading-id="`manifestation-heading-${i}`"
                    />
                    <Icon
                        name="tabler:chevron-down"
                        class="mt-1 shrink-0 transition-transform duration-200"
                        :class="isManifestationOpen(i) ? 'rotate-180' : ''"
                        aria-hidden="true"
                    />
                </div>
            </button>

            <div
                v-show="isManifestationOpen(i)"
                :id="`manifestation-panel-${i}`"
                class="bg-gray-50 dark:bg-gray-800 dark:text-white px-4 pb-4"
                role="region"
                :aria-labelledby="`manifestation-heading-${i}`"
            >
                <!-- 16 Exemplare -->
                <h4 class="relative font-bold text-sm text-primary-700 dark:text-primary-200 my-4 md:pl-4">
                    {{ safeT('items') }}
                    <GlobalTooltipInfo :text="$t('tooltip.item')" class="ml-2" />
                </h4>
                <div class="bg-white dark:bg-gray-900 rounded-xl md:ml-4">
                    <DetailItemListNewComp
                        v-if="manifestation?.items?.length > 0"
                        :items="manifestation?.items"
                        :manifestation-index="i"
                        :manifestation-handle="manifestation?.handle || ''"
                    />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
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
    window.addEventListener('detail:openManifestation', handleOpenManifestation as EventListener);
});
onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleEscKey);
    window.removeEventListener('detail:openManifestation', handleOpenManifestation as EventListener);
});

const openManifestations = ref<Record<number, boolean>>({});

function handleEscKey(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        openManifestations.value = {};
    }
}

function isManifestationOpen(index: number) {
    return !!openManifestations.value[index];
}

function toggleManifestation(index: number) {
    openManifestations.value = {
        ...openManifestations.value,
        [index]: !openManifestations.value[index],
    };
}

function handleOpenManifestation(event: Event) {
    const customEvent = event as CustomEvent<{ index?: number }>;
    const index = customEvent.detail?.index;
    if (typeof index !== 'number') return;
    openManifestations.value = {
        ...openManifestations.value,
        [index]: true,
    };
}

function getManifestationAnchorId(manifestation: Source, index: number) {
    return manifestation?.handle || `manifestation-${index}`;
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

