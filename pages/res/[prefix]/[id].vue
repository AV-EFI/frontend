<template>
    <div>
        <NuxtLayout name="partial-layout-1-center" padding-class="p-0">
            <template #navigation>
                <GlobalBreadcrumbsComp :breadcrumbs="breadcrumbs" />
            </template>

            <template #title>
                <NuxtLayout name="partial-grid-2-1" left-class="dark:bg-primary-600 rounded-t-xl py-4">
                    <template #left>
                        <div class="col-span-full px-4">
                            <GlobalClipboardComp
                                :display-text="dataJson?.compound_record?._source?.handle"
                                :copy-text="`${useRuntimeConfig().public.AVEFI_COPY_PID_URL}${dataJson?.compound_record?._source?.handle}`"
                                class="mb-2 text-xs lg:text-sm text-base-content/90"
                            />
                            <div class="flex flex-row">
                                <h1
                                    class="text-lg font-bold xl:text-2xl dark:text-white col-span-full text-ellipsis text-wrap overflow-hidden max-w-full content-center"
                                >
                                    {{ dataJson?.compound_record?._source?.has_record?.has_primary_title?.has_name }}
                                </h1>
                                <MicroBadgeCategoryComp
                                    :category="dataJson?.compound_record?._source?.has_record?.category"
                                    :dense="false"
                                    class="ml-4 my-auto"
                                />
                            </div>
                        </div>
                    </template>

                    <template #right>
                        <GlobalActionContextComp
                            class="col-start-11 row-start-1 justify-self-end"
                            :id="dataJson?.compound_record?._source?.handle"
                            :item="dataJson?.compound_record?._source"
                            comp-size="xl"
                        />
                    </template>
                </NuxtLayout>
            </template>

            <template #actions>
                <MicroBadgeCategoryComp
                    class="col-span-3 mt-2 divider-primary"
                    :class="!dataJson?.compound_record?._source?.has_record?.type ? 'hidden' : ''"
                    :category="dataJson?.compound_record?._source?.has_record?.type"
                />
            </template>

            <template #cardBody>
                <div class="px-4 pb-4">
                    <div v-if="pending" class="text-center py-4">
                        <span class="loading loading-spinner loading-lg text-primary" />
                    </div>

                    <div v-else-if="error" class="text-center text-red-500 py-8">
                        {{ $t('errorLoadingData') }}: {{ error }}
                    </div>

                    <div v-else>
                        <ViewsWorkViewCompAVefi
                            v-if="dataJson && (resourceType === 'workVariant' || resourceType === 'compilation' || resourceType === 'manifestationOrItem')"
                            v-model="dataJson"
                            :handle="dataJson.handle"
                            :requested-handle="requestedHandle"
                        />
                        <ViewsCompilationViewCompAVefi
                            v-else-if="dataJson && resourceType === 'compilationManifestation'"
                            v-model="dataJson"
                            :handle="dataJson.handle"
                        />
                        <div v-else-if="dataJson && resourceType !== 'workVariant'" class="text-center text-gray-500">
                            {{ $t('resourceTypeNotSupported') }}: {{ resourceType }}
                        </div>
                        <div v-else class="text-center text-gray-500">
                            {{ $t('noDataAvailable') }}
                        </div>
                    </div>
                </div>
            </template>
        </NuxtLayout>

        <details class="collapse">
            <summary class="collapse-title cursor-pointer font-medium">Raw data</summary>
            <div class="collapse-content">
                <pre>{{ dataJson }}</pre>
            </div>
        </details>
    </div>
</template>

<script setup lang="ts">
import { useCurrentUrlState } from '~/composables/useCurrentUrlState.js';
import { useRoute } from 'vue-router';
import { computed, nextTick, watch } from 'vue';
import { useAsyncData, useRuntimeConfig } from 'nuxt/app';

definePageMeta({ auth: false });

const route = useRoute();
const { currentUrlState } = useCurrentUrlState();
const config = useRuntimeConfig();
const { t } = useI18n();

const prefix = computed(() => String(route.params.prefix ?? ''));
const id = computed(() => String(route.params.id ?? ''));

const { data: result, error, pending } = await useAsyncData(
    () => `resource-${prefix.value}-${id.value}`,
    async () => {
        let fullId = id.value;

        if (prefix.value && !fullId.includes('.')) {
            fullId = `${prefix.value}/${fullId}`;
        }

        const url = `${config.public.elasticApiBase}/${config.public.AVEFI_GET_WORK}/${fullId}`;
        const resourceData = await $fetch(url);

        let detectedResourceType = 'workVariant';
        if (resourceData?.compound_record?.resource_type) {
            detectedResourceType = resourceData.compound_record.resource_type;
        } else if (resourceData?.handle !== resourceData?.compound_record?._source?.handle) {
            if (
                resourceData?.compound_record?._source?.manifestations?.length > 0 ||
                resourceData?.compound_record?._source?.items?.length > 0
            ) {
                detectedResourceType = 'manifestationOrItem';
            }
        } else if (
            resourceData?.compound_record?._source?.parts &&
            resourceData?.compound_record?._source?.has_record?.type === 'Serial'
        ) {
            detectedResourceType = 'compilation';
        } else if (resourceData?.compound_record?._source?.has_record?.is_manifestation_of?.length > 1) {
            detectedResourceType = 'compilationManifestation';
        }

        return {
            data: resourceData,
            requestedHandle: fullId,
            resourceType: detectedResourceType,
        };
    }
);

const dataJson = computed(() => result.value?.data);
const resourceType = computed(() => result.value?.resourceType ?? 'workVariant');
const requestedHandle = computed(() => result.value?.requestedHandle ?? '');
let lastHashDispatch = '';

watch(
    [pending, () => route.hash, requestedHandle],
    async ([isPending, currentHash, currentRequestedHandle]) => {
        if (!import.meta.client || isPending || !currentHash || !currentRequestedHandle) return;

        const normalizedHash = currentHash.startsWith('#') ? currentHash.slice(1) : currentHash;
        const targetHash = decodeURIComponent(normalizedHash);
        if (lastHashDispatch === targetHash) return;

        await nextTick();
        window.setTimeout(() => {
            lastHashDispatch = targetHash;
            window.dispatchEvent(new Event('hashchange'));
        }, 0);
    },
    { immediate: true }
);

const breadcrumbs = computed(() => [
    ['Home', '/'],
    [t('filmresearch'), `/${config.public.SEARCH_URL}${currentUrlState.value}`],
    [t('detailview'), `/res/${prefix.value}/${id.value}`],
]);
</script>

<style scoped>
legend,
label {
  color: var(--primary-600) !important;
}

a.external-link {
  color: var(--primary-400) !important;
}

a.external-link:before {
  font-family: "Font Awesome 5 Free";
  content: url('https://api.iconify.design/fa-regular:share-square.svg');
  display: inline-block;
  padding-right: 3px;
  vertical-align: middle;
  font-weight: 400;
  color: var(--primary-400) !important;
}

.dark legend,
.dark label {
  color: var(--primary-300) !important;
}

.dark a.external-link {
  color: var(--primary-200) !important;
}

.dark a.external-link:before {
  color: var(--primary-200) !important;
}
</style>




