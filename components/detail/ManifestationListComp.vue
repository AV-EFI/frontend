<template>
    <div role="list" :aria-label="$t('manifestations')">
        <section
            v-for="(manifestation, i) in manifestationList"
            :id="getManifestationAnchorId(manifestation, i)"
            :key="manifestation.handle || i"
            class="mt-2 border-base-200 border-2 rounded-lg overflow-hidden bg-base-100"
            role="listitem"
            :data-manifestation-index="i"
            :aria-labelledby="`manifestation-heading-${i}`"
        >
            <div
                class="w-full text-left px-4 py-3 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                role="button"
                tabindex="0"
                :aria-expanded="isManifestationOpen(i) ? 'true' : 'false'"
                :aria-controls="`manifestation-panel-${i}`"
                :title="$t('toggleManifestation', { manifestationId: manifestation.handle })"
                @click="toggleManifestation(i)"
                @keydown.enter.prevent="toggleManifestation(i)"
                @keydown.space.prevent="toggleManifestation(i)"
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
            </div>

            <div
                v-show="isManifestationOpen(i)"
                :id="`manifestation-panel-${i}`"
                class="bg-gray-50 dark:bg-gray-900 dark:text-white px-4 pb-4"
                role="region"
                :aria-labelledby="`manifestation-heading-${i}`"
            >
                <div
                    v-if="sameAsRefsFrom(manifestation?.has_record).length"
                    class="manifestation-reference-area mb-4 grid grid-cols-1 gap-2 rounded-lg border border-base-200 bg-base-100 p-3 dark:border-gray-800 dark:bg-gray-900"
                    role="region"
                    :aria-label="$t('same_as')"
                >
                    <div
                        v-for="sameAs in sameAsRefsFrom(manifestation?.has_record)"
                        :key="sameAsKey(sameAs)"
                        class="flex min-h-8 items-start gap-2"
                    >
                        <div class="min-w-0 grow">
                            <MicroLabelComp
                                label-text="same_as"
                            />
                            <p
                                class="mt-1 truncate text-sm leading-5 text-base-content"
                                :title="sameAsDisplayLabel(sameAs)"
                            >
                                {{ sameAsDisplayLabel(sameAs) }}
                            </p>
                        </div>
                        <DetailSameAsComp
                            :same-as-data="[sameAs]"
                            type="manifestation"
                            class="shrink-0 text-sm"
                        />
                    </div>
                </div>

                <!-- 16 Exemplare -->
                <div class="item-area level-stripe level-stripe--item pl-3 md:pl-4">
                    <h4 class="relative mb-4 inline-flex items-center gap-2 text-sm font-bold text-primary-700 dark:text-primary-200">
                        <Icon :name="itemLevelIcon" class="icon-inline" aria-hidden="true" />
                        {{ safeT('items') }}
                        <GlobalTooltipInfo :text="$t('tooltip.item')" class="ml-2" />
                    </h4>
                    <div class="bg-white dark:bg-gray-900 rounded-xl">
                        <DetailItemListNewComp
                            v-if="(manifestation?.items?.length ?? 0) > 0"
                            :items="manifestation?.items ?? []"
                            :manifestation-index="i"
                            :manifestation-handle="manifestation?.handle || ''"
                        />
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { MovingImageRecord } from '~/models/interfaces/schema/avefi_schema.js';
import type { IAVefiItem } from '~/models/interfaces/generated/IAVefiItem';
import { getFacetIcon } from '~/models/interfaces/manual/IFacetIconMapping';
const { t } = useI18n();
const itemLevelIcon = getFacetIcon('item');

const manifestationList = defineModel({
    type: Array as PropType<ManifestationListItem[]>,
    required: true
});

interface ManifestationListItem {
    handle: string;
    kip?: string;
    has_record: MovingImageRecord;
    items?: IAVefiItem[];
}

type SameAsRef = {
    category?: string;
    id?: string;
};

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

function getManifestationAnchorId(manifestation: ManifestationListItem, index: number) {
    return manifestation?.handle?.trim() || `manifestation-${index}`;
}

function sameAsRefsFrom(record: MovingImageRecord | undefined): Array<Required<SameAsRef>> {
    if (!Array.isArray(record?.same_as)) return [];

    const seen = new Set<string>();
    return record.same_as.filter((sameAs): sameAs is Required<SameAsRef> => {
        if (!sameAs?.category || !sameAs?.id) return false;

        const key = sameAsKey(sameAs);
        if (seen.has(key)) return false;

        seen.add(key);
        return true;
    });
}

function sameAsKey(sameAs: SameAsRef) {
    return `${sameAs?.category || ''}:${sameAs?.id || ''}`;
}

function sameAsDisplayLabel(sameAs: SameAsRef): string {
    const authority = safeT(sameAs?.category);
    return sameAs?.id ? `${authority}: ${sameAs.id}` : authority;
}

function safeT(input: unknown): string {
    if (typeof input !== 'string' || !input.trim()) return String(input ?? '');
    try { return t(input); } catch (err) {
        console.warn('Invalid translation key:', input, err);
        return String(input ?? '');
    }
}


</script>
