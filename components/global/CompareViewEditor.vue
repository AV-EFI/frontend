<template>
    <div class="mt-4 snap-y px-2">
        <section>
            <div class="p-2 flex w-lg mx-auto flex-row justify-between transition-all relative">
                <button
                    class="btn btn-info btn-outline btn-sm w-16"
                    :title="$t('info')"
                    @click="showInfo = !showInfo"
                >
                    <Icon
                        name="tabler:info-circle"
                        class="text-2xl"
                    />
                </button>
                <p
                    v-if="showInfo"
                    class="grow absolute top-4 left-16 right-16 bg-base-100 dark:bg-gray-900 rounded-lg p-2 text-md shadow-md alert alert-info text-primary-900 dark:text-primary-100 z-20"
                >
                    {{ $t('mergeResultHelpText') }}
                </p>
            </div>
            <div class="flex flex-col lg:flex-row min-h-[80vh]">
                <div class="w-full lg:w-2/3 overflow-auto min-h-screen flex flex-col lg:grid gap-1 lg:grid-cols-8 lg:grid-rows-[48px__48px_minmax(64px,max-content)_minmax(64px,max-content)_64px_minmax(64px,max-content)_64px_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_auto_auto_auto_auto] auto-rows-fr lg:pr-1">
                    <ViewsWorkViewEditor
                        v-model="prev"
                        :title="$t('dataset1')"
                        @update-target-model-g-p="onUpdateTargetModelGP"
                    />
                    <ViewsWorkViewEditor
                        v-model="current"
                        :title="$t('dataset2')"
                        @update-target-model-g-p="onUpdateTargetModelGP"
                    />
                </div>
                <div class="w-full lg:w-1/3 overflow-scroll">
                    <ViewsWorkViewEditorResult
                        v-model="mergedDataset"
                    />
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import type { IAVefiWorkVariant } from '~/models/interfaces/generated';
import type { ElasticGetByIdResponse } from '~/models/interfaces/generated/IElasticResponses';

const props = defineProps({
    items: {
        type: Array<string>,
        required: true,
        default: () => []
    }
});

type AuthorityReference = {
    id: string;
    category: string;
};

type MergeProductionEvent = NonNullable<IAVefiWorkVariant['has_record']['has_event']>[number] & {
    type?: string;
};

type MergeRecord = IAVefiWorkVariant & {
    has_record: Omit<IAVefiWorkVariant['has_record'], 'has_event' | 'has_subject'> & {
        has_event?: MergeProductionEvent[];
        has_subject?: Array<{ category: string; has_name?: string; same_as?: AuthorityReference[] }>;
    };
};

const createMergedDataset = (): MergeRecord => ({
    handle: '',
    has_record: {
        category: 'avefi:WorkVariant',
        type: 'Monographic',
        has_primary_title: {
            has_name: '',
            type: 'PreferredTitle',
        },
        has_alternative_title: [],
        has_event: [
            {
                category: 'avefi:ProductionEvent',
                type: 'Production',
                has_date: '',
                located_in: [],
                has_activity: [],
            },
        ],
        has_genre: [],
        has_subject: [],
        same_as: [],
        described_by: {
            has_issuer_id: '',
            has_issuer_name: 'Deutsche Kinemathek - Museum fuer Film und Fernsehen',
        },
    },
});

const mergedDataset = ref<MergeRecord>(createMergedDataset());

function parseAuthorityReferences(value = ''): AuthorityReference[] {
    return value
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
            const match = entry.match(/^(.*?)\s*\((.*?)\)$/);
            const id = match?.[1]?.trim() || entry;
            const category = match?.[2]?.trim() || '';

            return {
                id,
                category: category.startsWith('avefi:') ? category : `avefi:${category || 'AuthorityResource'}`,
            };
        });
}

function productionEvent() {
    const event = mergedDataset.value.has_record.has_event?.[0];
    if (event) {
        return event;
    }

    const nextEvent = {
        category: 'avefi:ProductionEvent',
        type: 'Production',
        has_date: '',
        located_in: [],
        has_activity: [],
    };
    mergedDataset.value.has_record.has_event = [nextEvent];
    return nextEvent;
}

function activityFor(type: string) {
    const event = productionEvent();
    event.has_activity ??= [];

    let activity = event.has_activity.find((item) => item.type === type);
    if (!activity) {
        activity = {
            category: 'avefi:Activity',
            type,
            has_agent: [],
        };
        event.has_activity.push(activity);
    }

    return activity;
}

function onUpdateTargetModelGP(targetPropertyValue: string, targetPropertyName: string, sameAsId = '') {
    if (!targetPropertyValue) {
        return;
    }

    if (targetPropertyName === 'efi') {
        mergedDataset.value.handle = targetPropertyValue;
        return;
    }

    if (targetPropertyName === 'title') {
        mergedDataset.value.has_record.has_primary_title = {
            ...(mergedDataset.value.has_record.has_primary_title ?? { type: 'PreferredTitle' }),
            has_name: targetPropertyValue,
        };
        return;
    }

    if (targetPropertyName === 'alternative_title') {
        mergedDataset.value.has_record.has_alternative_title ??= [];
        mergedDataset.value.has_record.has_alternative_title.push({
            has_name: targetPropertyValue,
            type: 'AlternativeTitle',
        });
        return;
    }

    if (targetPropertyName === 'location') {
        const event = productionEvent();
        event.located_in ??= [];
        event.located_in.push({
            category: 'avefi:GeographicName',
            has_name: targetPropertyValue,
            same_as: parseAuthorityReferences(sameAsId),
        });
        return;
    }

    if (targetPropertyName === 'productionyear') {
        productionEvent().has_date = targetPropertyValue;
        return;
    }

    if (['director', 'producer', 'castmember'].includes(targetPropertyName)) {
        const activityTypeMap: Record<string, string> = {
            director: 'Director',
            producer: 'Producer',
            castmember: 'CastMember',
        };
        const activityType = activityTypeMap[targetPropertyName];
        if (!activityType) {
            return;
        }
        const activity = activityFor(activityType);
        activity.has_agent.push({
            category: 'avefi:Agent',
            has_name: targetPropertyValue,
            same_as: parseAuthorityReferences(sameAsId),
        });
        return;
    }

    if (targetPropertyName === 'genre') {
        mergedDataset.value.has_record.has_genre ??= [];
        mergedDataset.value.has_record.has_genre.push({
            has_name: targetPropertyValue,
            same_as: parseAuthorityReferences(sameAsId),
        });
        return;
    }

    if (targetPropertyName === 'subject') {
        mergedDataset.value.has_record.has_subject ??= [];
        mergedDataset.value.has_record.has_subject.push({
            category: 'avefi:Subject',
            has_name: targetPropertyValue,
            same_as: parseAuthorityReferences(sameAsId),
        });
        return;
    }

    if (targetPropertyName === 'other_id') {
        mergedDataset.value.has_record.same_as ??= [];
        mergedDataset.value.has_record.same_as.push({
            id: targetPropertyValue,
            category: sameAsId?.startsWith('avefi:') ? sameAsId : `avefi:${sameAsId || 'AuthorityResource'}`,
        });
        return;
    }

    if (targetPropertyName === 'last_edit') {
        mergedDataset.value.has_record.described_by = {
            ...(mergedDataset.value.has_record.described_by ?? { has_issuer_id: '' }),
            has_issuer_name: targetPropertyValue,
        };
    }
}

const objectListStore = useObjectListStore();

async function getCollectionType(routeParamsId: string): Promise<ElasticGetByIdResponse | string> {
    if (!routeParamsId) {
        return '';
    }
    const data = await getDataSet(routeParamsId);

    return data as ElasticGetByIdResponse;
}

const { data: prev } = await useAsyncData('prev', () =>
    getCollectionType(props.items[0] ?? '')
);

const { data: current } = await useAsyncData('current', () =>
    getCollectionType(props.items[1] ?? '')
);

const showInfo = ref(false);

onMounted(() => {
    if (objectListStore.comparisonDrawerOpen) {
        objectListStore.comparisonDrawerOpen = false;
    }
});
</script>
