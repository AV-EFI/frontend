<template>
    <div>
        <FormKit
            id="work-view-editor-result"
            v-model="dataJson"
            :classes="{ form: 'merge-editor-result bg-base-100 dark:bg-gray-900 border-base-300 border-2 p-2 rounded-xl' }"
            type="form"
            :actions="false"
            @submit="customSubmitHandler"
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

            <FormKit type="text" name="handle" label="efi:" validation="required" />

            <FormKit type="group" name="has_record">
                <FormKit type="hidden" name="category" />
                <FormKit type="text" name="type" label="type:" validation="required" />

                <FormKit type="group" name="has_primary_title">
                    <FormKit type="hidden" name="type" />
                    <FormKit type="text" name="has_name" :label="$t('title')" validation="required" />
                </FormKit>

                <label class="merge-section-label">{{ $t('AlternativeTitle') }}:</label>
                <FormKit type="repeater" name="has_alternative_title" :add-label="$t('AlternativeTitle')" min="0">
                    <FormKit type="hidden" name="type" value="AlternativeTitle" />
                    <FormKit type="text" name="has_name" :label="$t('AlternativeTitle')" />
                </FormKit>

                <label class="merge-section-label">{{ $t('production') }}:</label>
                <FormKit type="repeater" name="has_event" :add-label="$t('addNewProductionYear')" min="0">
                    <FormKit type="hidden" name="category" value="avefi:ProductionEvent" />
                    <FormKit type="hidden" name="type" value="Production" />
                    <FormKit type="text" name="has_date" :label="$t('productionyear')" />

                    <label class="merge-section-label">{{ $t('location') }}:</label>
                    <FormKit type="repeater" name="located_in" :add-label="$t('addNewLocation')" min="0">
                        <FormKit type="hidden" name="category" value="avefi:GeographicName" />
                        <FormKit type="text" name="has_name" :label="$t('location')" />

                        <label class="merge-section-label">same_as:</label>
                        <FormKit type="repeater" name="same_as" :add-label="$t('addNewOtherId')" min="0">
                            <FormKit type="text" name="id" label="id:" />
                            <FormKit type="text" name="category" label="category:" />
                        </FormKit>
                    </FormKit>

                    <label class="merge-section-label">has_activity:</label>
                    <FormKit type="repeater" name="has_activity" :add-label="$t('addNewCastMember')" min="0">
                        <FormKit type="hidden" name="category" value="avefi:Activity" />
                        <FormKit type="text" name="type" label="type:" />

                        <label class="merge-section-label">has_agent:</label>
                        <FormKit type="repeater" name="has_agent" :add-label="$t('addNewCastMember')" min="0">
                            <FormKit type="hidden" name="category" value="avefi:Agent" />
                            <FormKit type="text" name="has_name" :label="$t('castmembers')" />
                            <FormKit type="text" name="type" label="type:" />

                            <label class="merge-section-label">same_as:</label>
                            <FormKit type="repeater" name="same_as" :add-label="$t('addNewOtherId')" min="0">
                                <FormKit type="text" name="id" label="id:" />
                                <FormKit type="text" name="category" label="category:" />
                            </FormKit>
                        </FormKit>
                    </FormKit>
                </FormKit>

                <label class="merge-section-label">{{ $t('has_genre_has_name') }}:</label>
                <FormKit type="repeater" name="has_genre" :add-label="$t('addNewGenre')" min="0">
                    <FormKit type="text" name="has_name" :label="$t('has_genre_has_name')" />

                    <label class="merge-section-label">same_as:</label>
                    <FormKit type="repeater" name="same_as" :add-label="$t('addNewOtherId')" min="0">
                        <FormKit type="text" name="id" label="id:" />
                        <FormKit type="text" name="category" label="category:" />
                    </FormKit>
                </FormKit>

                <label class="merge-section-label">{{ $t('subject') }}:</label>
                <FormKit type="repeater" name="has_subject" :add-label="$t('addNewSubject')" min="0">
                    <FormKit type="hidden" name="category" value="avefi:Subject" />
                    <FormKit type="text" name="has_name" :label="$t('subject')" />

                    <label class="merge-section-label">same_as:</label>
                    <FormKit type="repeater" name="same_as" :add-label="$t('addNewOtherId')" min="0">
                        <FormKit type="text" name="id" label="id:" />
                        <FormKit type="text" name="category" label="category:" />
                    </FormKit>
                </FormKit>

                <label class="merge-section-label">{{ $t('other_ids') }}:</label>
                <FormKit type="repeater" name="same_as" :add-label="$t('addNewOtherId')" min="0">
                    <FormKit type="text" name="id" label="id:" validation="required" />
                    <FormKit type="text" name="category" label="category:" validation="required" />
                </FormKit>

                <FormKit type="group" name="described_by">
                    <FormKit type="text" name="has_issuer_id" label="has_issuer_id:" />
                    <FormKit type="text" name="has_issuer_name" :readonly="true" :label="$t('lastedit')" validation="required" />
                </FormKit>
            </FormKit>

            <div class="col-span-full">
                <FormKit type="submit" label="Merge" :disabled="false" suffix-icon="group" :classes="{
                    outer: '!w-full max-w-[600px]',
                    input: 'w-full text-center justify-center'
                }" />
            </div>
            <div class="hidden">
                <pre>{{ dataJson }}</pre>
            </div>
        </FormKit>
    </div>
</template>

<script setup lang="ts">
import type { IAVefiWorkVariant } from '~/models/interfaces/generated';
import { useFormKitLoader } from '~/composables/useFormKitLoader';

const { ensureFormKitReady } = useFormKitLoader();
const { $toast } = useNuxtApp();
const { t: $t } = useI18n();

await ensureFormKitReady();

type WorkVariantFormValue = IAVefiWorkVariant & Record<string, unknown>;

const initialState = {
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
} as unknown as WorkVariantFormValue;

const dataJson = defineModel<WorkVariantFormValue>({ required: true });

function cloneInitialState() {
    return JSON.parse(JSON.stringify(initialState)) as WorkVariantFormValue;
}

function customReset() {
    dataJson.value = cloneInitialState();
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

.merge-editor-result :deep(.formkit-label),
.merge-section-label {
    display: block;
    margin-bottom: 0.25rem;
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1.25rem;
}

.merge-editor-result :deep(.formkit-input) {
    font-size: 0.875rem;
}
</style>
