<template>
    <div>
        <form
            id="work-view-editor-result"
            class="merge-editor-result bg-base-100 dark:bg-gray-900 border-base-300 border-2 p-2 rounded-xl"
            @submit.prevent="customSubmitHandler"
        >
            <div class="col-span-full flex flex-row justify-between items-center">
                <h2 class="merge-editor-title">
                    {{ $t('result') }}
                </h2>
            </div>

            <div class="col-span-full">
                <button type="button" class="btn btn-error btn-sm mb-2" @click="customReset">
                    {{ $t('resetFormData') }}
                    <Icon class="icon-inline" name="tabler:x" aria-hidden="true" />
                </button>
            </div>

            <label class="form-control col-span-full mb-3">
                <span class="label-text">efi:</span>
                <input v-model="dataJson.efi" class="input input-bordered input-sm w-full" required>
            </label>

            <label class="form-control col-span-full mb-3">
                <span class="label-text">{{ $t('title') }}</span>
                <input v-model="dataJson.title" class="input input-bordered input-sm w-full" required>
            </label>

            <label class="form-control col-span-full mb-3">
                <span class="label-text">{{ $t('AlternativeTitle') }}</span>
                <input v-model="dataJson.alternative_title" class="input input-bordered input-sm w-full">
            </label>

            <section
                v-for="section in repeatableSections"
                :key="section.key"
                class="col-span-full mb-4 rounded border border-base-200 p-2"
            >
                <div class="mb-2 flex items-center justify-between gap-2">
                    <h3 class="merge-section-label">
                        {{ section.label }}
                    </h3>
                    <button type="button" class="btn btn-outline btn-xs" @click="addItem(section.key, section.extraKey)">
                        <Icon name="tabler:plus" aria-hidden="true" />
                        {{ section.addLabel }}
                    </button>
                </div>

                <div v-if="getItems(section.key).length" class="space-y-2">
                    <div
                        v-for="(item, index) in getItems(section.key)"
                        :key="index"
                        class="grid gap-2 rounded bg-base-200/50 p-2"
                    >
                        <label class="form-control">
                            <span class="label-text">{{ section.primaryLabel }}</span>
                            <input v-model="item.name" class="input input-bordered input-sm w-full">
                        </label>

                        <label v-if="section.extraKey" class="form-control">
                            <span class="label-text">{{ section.extraLabel }}</span>
                            <input v-model="item[section.extraKey]" class="input input-bordered input-sm w-full">
                        </label>

                        <button type="button" class="btn btn-ghost btn-xs justify-self-end" @click="removeItem(section.key, index)">
                            <Icon name="tabler:trash" aria-hidden="true" />
                            {{ $t('remove') }}
                        </button>
                    </div>
                </div>
                <p v-else class="text-sm text-base-content/60">
                    {{ $t('noData') }}
                </p>
            </section>

            <label class="form-control col-span-full mb-3">
                <span class="label-text">{{ $t('lastedit') }}</span>
                <input v-model="dataJson.last_edit" class="input input-bordered input-sm w-full" readonly>
            </label>

            <div class="col-span-full">
                <button type="submit" class="btn btn-primary w-full max-w-[600px]">
                    Merge
                    <Icon name="tabler:git-merge" aria-hidden="true" />
                </button>
            </div>

            <div class="hidden">
                <pre>{{ dataJson }}</pre>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
type MergeItem = {
    name?: string;
    same_as_id?: string;
    type?: string;
};

type MergedDataset = Record<string, MergeItem[] | string>;

const { $toast } = useNuxtApp();
const { t: $t } = useI18n();

const initialState: MergedDataset = {
    efi: '',
    title: '',
    alternative_title: '',
    location: [],
    productionyear: [],
    director: [],
    castmember: [],
    producer: [],
    genre: [],
    subject: [],
    other_id: [],
    last_edit: 'Deutsche Kinemathek - Museum fur Film und Fernsehen'
};

const dataJson = defineModel<MergedDataset>({ required: true });

const repeatableSections = computed(() => [
    {
        key: 'location',
        label: $t('location'),
        addLabel: $t('addNewLocation'),
        primaryLabel: $t('location'),
        extraKey: 'same_as_id',
        extraLabel: `${$t('location')} ID Extern`,
    },
    {
        key: 'productionyear',
        label: $t('productionyears'),
        addLabel: $t('addNewProductionYear'),
        primaryLabel: $t('productionyear'),
    },
    {
        key: 'director',
        label: $t('directors'),
        addLabel: $t('addNewDirector'),
        primaryLabel: `${$t('Director')} Name`,
        extraKey: 'same_as_id',
        extraLabel: `${$t('Director')} ID Extern`,
    },
    {
        key: 'producer',
        label: $t('producers'),
        addLabel: $t('addNewProducer'),
        primaryLabel: `${$t('production')} Name`,
        extraKey: 'same_as_id',
        extraLabel: `${$t('production')} ID Extern`,
    },
    {
        key: 'castmember',
        label: $t('castmembers'),
        addLabel: $t('addNewCastMember'),
        primaryLabel: `${$t('castmembers')} Name`,
        extraKey: 'same_as_id',
        extraLabel: `${$t('castmembers')} ID Extern`,
    },
    {
        key: 'genre',
        label: $t('has_genre_has_name'),
        addLabel: $t('addNewGenre'),
        primaryLabel: `${$t('has_genre_has_name')} Name`,
        extraKey: 'same_as_id',
        extraLabel: `${$t('has_genre_has_name')} ID Extern`,
    },
    {
        key: 'subject',
        label: $t('subject'),
        addLabel: $t('addNewSubject'),
        primaryLabel: `${$t('subject')} Name`,
        extraKey: 'same_as_id',
        extraLabel: `${$t('subject')} ID Extern`,
    },
    {
        key: 'other_id',
        label: $t('other_ids'),
        addLabel: $t('addNewOtherId'),
        primaryLabel: `${$t('other_ids')} ID`,
        extraKey: 'type',
        extraLabel: `${$t('other_ids')} Type`,
    },
] as const);

function getItems(key: string): MergeItem[] {
    const value = dataJson.value[key];
    if (Array.isArray(value)) {
        return value as MergeItem[];
    }

    dataJson.value[key] = [];
    return dataJson.value[key] as MergeItem[];
}

function addItem(key: string, extraKey?: 'same_as_id' | 'type') {
    getItems(key).push(extraKey ? { name: '', [extraKey]: '' } : { name: '' });
}

function removeItem(key: string, index: number) {
    getItems(key).splice(index, 1);
}

function customReset() {
    dataJson.value = JSON.parse(JSON.stringify(initialState));
}

function customSubmitHandler() {
    $toast?.success?.($t('formSubmitted'));
}
</script>

<style scoped>
.merge-editor-title {
    margin-bottom: 0.5rem;
    max-width: 100%;
    overflow: hidden;
    overflow-wrap: anywhere;
    text-overflow: ellipsis;
    font-size: 1.125rem;
    font-weight: 400;
    line-height: 1.75rem;
}

.merge-editor-result .label-text,
.merge-section-label {
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1.25rem;
}

.merge-editor-result input {
    font-size: 0.875rem;
}
</style>
