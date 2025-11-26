<template>
  <div>
    <NuxtLayout
      name="partial-layout-1-center"
      padding-class="p-0"
    >
      <template #navigation>
        <GlobalBreadcrumbsComp
          :breadcrumbs="[
            ['Home', '/'],
            [$t('filmresearch'), `/${useRuntimeConfig().public.SEARCH_URL}${currentUrlState}`],
            [$t('detailview'), '/res/' + params.prefix + '/' + params.id]
          ]"
        />
      </template>
      <template #title>
        <NuxtLayout
          name="partial-grid-2-1"
          left-class="dark:bg-primary-600 rounded-t-xl py-4"
        >
          <template
            #left
          >
            <div class="col-span-full px-4">
              <GlobalClipboardComp
                :display-text="dataJson?.compound_record?._source?.handle"
                :copy-text="`${useRuntimeConfig().public.AVEFI_COPY_PID_URL}${dataJson?.compound_record?._source?.handle}`"
                class="mb-2 text-sm text-base-content/90"
              />
              <div class="flex flex-row">
              <h2
                class="text-lg font-bold xl:text-2xl dark:text-white col-span-full text-ellipsis text-wrap overflow-hidden max-w-full content-center"
                :alt="dataJson?.compound_record?._source?.has_record?.has_primary_title?.has_name"
              >
                {{ dataJson?.compound_record?._source?.has_record?.has_primary_title?.has_name }}
              </h2>
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
                comp-size="2xl"
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
          <div
          >
            <ClientOnly
              fallback-tag="span"
              fallback="Loading data..."
            >
              <LazyViewsWorkViewCompAVefi
                  v-if="dataJson && (resourceType === 'workVariant' || resourceType === 'compilation' || resourceType === 'manifestationOrItem')"
                  v-model="dataJson"
                  :handle="dataJson.handle" 
               />
               <LazyViewsCompilationViewCompAVefi
                  v-else-if="dataJson && resourceType === 'compilationManifestation'"
                  v-model="dataJson"
                  :handle="dataJson.handle"
               />
               <!-- Add other resource type components here when needed -->
               <div v-else-if="dataJson && resourceType !== 'workVariant'" class="text-center text-gray-500">
                 {{ $t('resourceTypeNotSupported') }}: {{ resourceType }}
               </div>
               <div v-else class="text-center text-gray-500">
                 {{ $t('noDataAvailable') }}
                </div>
            </ClientOnly>
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
import { navigateTo, useAsyncData } from 'nuxt/app';
import { useResourceData } from '~/composables/useResourceData.js';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

definePageMeta({
    auth: false
});
const { currentUrlState } = useCurrentUrlState();
const route = useRoute();
const params = ref(route.params);
const category = ref('avefi:WorkVariant');
const type = ref('Monographic');

const result = await useResourceData(params.value.id as string, params.value.prefix as string);
const effectiveHandle = computed(() => result.effectiveHandle || params.value.id);
if(effectiveHandle.value !== params.value.id) {
  navigateTo(`/res/${effectiveHandle.value}${route.hash || ''}`, {
    redirectCode: 301,
    external: false
  });
}
console.log('Effective handle:', effectiveHandle.value);

const dataJson = computed(() => result.data);
const resourceType = computed(() => result.resourceType.value || 'workVariant');
</script>
<style scoped>
  legend, label {
    color: var(--primary-600)!important;
  }
  a.external-link {
    color: var(--primary-400)!important;
  }
  a.external-link:before {
        font-family: "Font Awesome 5 Free";
        content: url('https://api.iconify.design/fa-regular:share-square.svg');
        display: inline-block;
        padding-right: 3px;
        vertical-align: middle;
        font-weight: 400;
        color: var(--primary-400)!important;
  }
  .dark legend, .dark label {
    color: var(--primary-300)!important;
  }
  .dark a.external-link {
    color: var(--primary-200)!important;
  }
  .dark a.external-link:before {
    color: var(--primary-200)!important;
  }
</style>
