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
              <GlobalClipboardComp :display-text="dataJson?.compound_record?._source?.handle"
                :copy-text="`${useRuntimeConfig().public.AVEFI_COPY_PID_URL}${dataJson?.compound_record?._source?.handle}`"
                class="mb-2 text-sm text-base-content/90" />
              <div class="flex flex-row">
                <h2
                  class="text-lg font-bold xl:text-2xl dark:text-white col-span-full text-ellipsis text-wrap overflow-hidden max-w-full content-center"
                  :alt="dataJson?.compound_record?._source?.has_record?.has_primary_title?.has_name">
                  {{ dataJson?.compound_record?._source?.has_record?.has_primary_title?.has_name }}
                </h2>
                <MicroBadgeCategoryComp :category="dataJson?.compound_record?._source?.has_record?.category"
                  :dense="false" class="ml-4 my-auto" />
              </div>
            </div>
          </template>
          <template #right>
            <GlobalActionContextComp class="col-start-11 row-start-1 justify-self-end"
              :id="dataJson?.compound_record?._source?.handle" :item="dataJson?.compound_record?._source"
              comp-size="2xl" />
          </template>
        </NuxtLayout>
      </template>
      <template #actions>
        <MicroBadgeCategoryComp class="col-span-3 mt-2 divider-primary"
          :class="!dataJson?.compound_record?._source?.has_record?.type ? 'hidden' : ''"
          :category="dataJson?.compound_record?._source?.has_record?.type" />
      </template>
      <template #cardBody>
        <div class="px-4 pb-4">
          <div v-if="pending" class="text-center py-8">
            <span class="loading loading-spinner loading-lg text-primary" />
          </div>
          <div v-else-if="error" class="text-center text-red-500 py-8">
            {{ $t('errorLoadingData') }}: {{ error }}
          </div>
          <div v-else>
            <ViewsWorkViewCompAVefi
              v-if="dataJson && (resourceType === 'workVariant' || resourceType === 'compilation' || resourceType === 'manifestationOrItem')"
              v-model="dataJson" :handle="dataJson.handle" />
            <ViewsCompilationViewCompAVefi v-else-if="dataJson && resourceType === 'compilationManifestation'"
              v-model="dataJson" :handle="dataJson.handle" />
            <!-- Add other resource type components here when needed -->
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
    <div class="collapse">
      <input type="checkbox">
      <div class="collapse-title font-medium">
        Raw data
      </div>
      <div class="collapse-content">
        <pre>{{ dataJson }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentUrlState } from '~/composables/useCurrentUrlState.js';
import { useRoute } from 'vue-router';
import { ref, computed } from 'vue';
import { useAsyncData, useRuntimeConfig } from 'nuxt/app';

definePageMeta({ auth: false });

const route = useRoute();
const { currentUrlState } = useCurrentUrlState();
const config = useRuntimeConfig();

const prefix = route.params.prefix as string;
const id = route.params.id as string;

const { data: result, error, pending } = await useAsyncData(
    `resource-${prefix}-${id}`,
    async () => {
        let fullId = id;

        // Append prefix only when no dot present
        if (prefix && !fullId.includes('.')) {
            fullId = `${prefix}/${fullId}`;
        }

        const url = `${config.public.PUBLIC_AVEFI_ELASTIC_API}/${config.public.AVEFI_GET_WORK}/${fullId}`;
        console.log(`Fetching resource data from URL: ${url}`);
        const resourceData = await $fetch(url);
        console.log(resourceData);

        // Determine resource type
        let resourceType = 'workVariant';

        if (resourceData?.compound_record?.resource_type) {
            resourceType = resourceData.compound_record.resource_type;
        } else if (resourceData?.handle !== resourceData?.compound_record?._source?.handle) {
            if (
                resourceData?.compound_record?._source?.manifestations?.length > 0 ||
        resourceData?.compound_record?._source?.items?.length > 0
            ) {
                resourceType = 'manifestationOrItem';
            }
        } else {
            if (
                resourceData?.compound_record?._source?.parts &&
        resourceData?.compound_record?._source?.has_record?.type === 'Serial'
            ) {
                resourceType = 'compilation';
            } else if (
                resourceData?.compound_record?._source?.has_record?.is_manifestation_of?.length > 1
            ) {
                resourceType = 'compilationManifestation';
            }
        }

        // Compute effective handle
        let effectiveHandle = fullId;
        if (resourceType === 'manifestationOrItem' && resourceData) {
            effectiveHandle = `${resourceData.compound_record?._source?.handle}#${resourceData.handle}`;
        }

        return {
            data: resourceData,
            resourceType,
            effectiveHandle
        };
    }
);

// Computed accessors
const dataJson = computed(() => result.value?.data);
const resourceType = computed(
    () => result.value?.resourceType ?? 'workVariant'
);
const effectiveHandle = computed(() => result.value?.effectiveHandle || id);

const { t } = useI18n();

// SEO source record
const record = computed(() => dataJson.value?.compound_record?._source);

// SEO title
const title = computed(() =>
    record.value?.has_record?.has_primary_title?.has_name
        ? t('seo.resource.title', {
            title: record.value.has_record.has_primary_title.has_name
        })
        : t('seo.resource.title', { title: 'Filmwerk' })
);

// SEO description
const description = computed(() =>
    record.value?.has_record?.abstract || t('seo.resource.description')
);

// Canonical URL
const canonical = computed(() => `https://www.av-efi.net/res/${prefix}/${id}`);

// Apply SEO meta
useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: '/img/avefi-og-image.png',
    ogUrl: canonical,
    canonical
});

// Schema.org + Breadcrumbs
import { useSchemaOrg, defineBreadcrumb } from '#imports';

useSchemaOrg(() => [
    {
        '@id': canonical.value,
        '@type': 'CreativeWork',
        name: title.value,
        description: description.value,
        url: canonical.value,
        identifier: id,
        sameAs: record.value?.same_as ?? []
    },
    defineBreadcrumb({
        itemListElement: [
            { name: t('home'), item: 'https://www.av-efi.net/' },
            { name: t('research'), item: 'https://www.av-efi.net/search' },
            { name: title.value, item: canonical.value }
        ]
    })
]);

// Precomputed breadcrumbs for template (fix runtime calls)
const breadcrumbs = computed(() => [
    ['Home','/'],
    [t('filmresearch'), `/${config.public.SEARCH_URL}${currentUrlState.value}`],
    [t('detailview'), `/res/${prefix}/${id}`]
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
