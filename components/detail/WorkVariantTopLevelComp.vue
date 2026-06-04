<template>
    <NuxtLayout name="partial-grid-1">
        <template #center>
            <div
                v-if="Array.isArray(workVar?.has_alternative_title) && workVar.has_alternative_title.length"
                class="col-span-12 grid cols-12 space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
                <header class="flex flex-col gap-1">
                    <h3 id="alternative-titles" class="text-base font-medium leading-5 dark:text-white">
                        {{ $t('AlternativeTitles') }}
                    </h3>
                </header>

                <!-- 05 Alternative Titel -->
                <DetailKeyValueListComp
                    v-if="Array.isArray(workVar?.has_alternative_title) && workVar.has_alternative_title.length"
                    class="col-span-full mb-2"
                    :keytxt="null"
                    :valtxt="workVar.has_alternative_title"
                    :ul="true"
                    role="region"
                    :aria-label="$t('AlternativeTitle')"
                />
            </div>

            <!-- 03/04 GND, Filmportal, etc. (Same As) -->
            <div
                v-if="(Array.isArray(workVar?.same_as) && workVar.same_as.length) || (Array.isArray(workVar?.is_part_of) && workVar.is_part_of.length)"
                class="col-span-12 grid cols-12 space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
                <header class="flex flex-col gap-1">
                    <h3 id="references-work-relations" class="text-base font-medium leading-5 dark:text-white">
                        {{ $t('referencesAndWorkRelations')}}
                    </h3>
                </header>
                <div
                    v-if="Array.isArray(workVar?.same_as) && workVar.same_as.length"
                    class="w-full 2xl:w-[calc(50%-0.25rem)] rounded-md border border-gray-100 p-2 dark:border-gray-800"
                    role="region"
                    :aria-label="`${$t('same_as')}`"
                >
                    <div
                        v-for="sas in workVar.same_as"
                        :key="sas?.id"
                        class="col-span-full flex flex-col"
                        role="group"
                        :aria-label="`${$t('same_as')} ${$t(sas?.category)}`"
                    >
                        <div class="h-4 flex items-center">
                            <MicroLabelComp :label-text="sas?.category" />
                        </div>
                        <div class="mt-1 flex min-h-8 items-start gap-2 leading-5">
                            <span class="min-w-0 grow leading-5">
                                {{ sas?.id }}
                            </span>
                            <DetailSameAsComp
                                :same-as-data="[sas]"
                                class="shrink-0"
                            />
                        </div>
                    </div>
                </div>

                <!-- (Optional) Episode/Teil-Indikator? -> is_part_of -->
                <div
                    v-if="Array.isArray(workVar?.is_part_of) && workVar.is_part_of.length"
                    class="col-span-full"
                    role="region"
                    :aria-label="$t('isPartOf')"
                >
                    <MicroLabelComp
                        class="col-span-full"
                        label-text="isPartOf"
                    />
                    <ul>
                        <li
                            v-for="ipo in workVar.is_part_of"
                            :key="ipo?.id"
                        >
                            <router-link
                                target="_blank"
                                rel="noopener"
                                :to="`/res/${(ipo?.id || '')}`"
                                class="link link-primary"
                                :aria-label="`${ipo?.id} (${ $t(ipo?.category) })`"
                            >
                                {{ ipo?.id }}&nbsp;({{ $t(ipo?.category) }})
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>

        </template>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { WorkVariant } from '~/models/interfaces/schema/avefi_schema.js';

const workVar = defineModel({ type: Object as PropType<WorkVariant>, required: true });

const props = defineProps({
    handle: { type: String, required: true },
    esTimestamp: { type: String, required: true }
});
</script>
