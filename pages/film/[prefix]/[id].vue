<template>
  <div>
    <GlobalBreadcrumbsComp
      :breadcrumbs="[
        ['Home', '/'],
        [$t('filmresearch'), `/${useRuntimeConfig().public.SEARCH_URL}${currentUrlState}`], ['Detail', '/film/' + params.id]
      ]"
    />
    <NuxtLayout
      name="partial-layout-1-center"
      padding-class="p-0"
    >
      <template #navigation>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a :href="`/${useRuntimeConfig().public.SEARCH_URL}${currentUrlState}`">{{ $t('filmresearch') }}</a></li>
          <li>
            <span class="text-accent">
              {{ $t('detailview') }}
            </span>
          </li>
        </ul>
      </template>
      <template #title>
        <NuxtLayout
          name="partial-grid-2-1-flex"
          left-class="bg-primary dark:bg-primary-600 rounded-t-xl py-4"
        >
          <template
            #left
          >
            <div class="col-span-full p-4">
              <p class="text-white text-xs 2xl:text-base col-span-full">
                {{ dataJson?._source?.handle }}
              </p>
              <h2
                class="text-lg font-bold xl:text-2xl text-primary-50 dark:text-white col-span-full text-ellipsis text-wrap overflow-hidden max-w-full content-center"
                :alt="dataJson?._source?.has_record?.has_primary_title.has_name"
              >
                {{ dataJson?._source?.has_record?.has_primary_title.has_name }}
              </h2>
            </div>
          </template>
          <template #right>
            <div class="flex flex-row flex-wrap justify-end items-center">
              <MicroEfiCopyComp
                :handle="dataJson?._source?.handle"
                class="col-span-3 hidden"
              />
              <GlobalActionContextComp
                :id="dataJson?._source?.handle"
                :item="dataJson?._source"
                class="w-1/5 justify-center items-center my-auto"
              />
            </div>
          </template>
        </NuxtLayout>
      </template>
      <template #actions>
        <MicroBadgeCategoryComp
          class="col-span-3"
          :category="dataJson?._source?.has_record?.type"
        />
      </template>      
      <template #cardBody>
        <div class="px-4 pb-4">
          <div
            v-if="category == 'avefi:WorkVariant' && type == 'Monographic'"
          >
            <ClientOnly
              fallback-tag="span"
              fallback="Loading data..."
            >
              <LazyViewsWorkViewCompAVefi
v-if="dataJson"
                :model-value="dataJson ? JSON.stringify(dataJson, null, 2) : ''"
                @update:model-value="val => dataJson = JSON.parse(val)"
              />
              <pre v-else>{{ dataJson }}</pre>
              
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
import type { IAVefiListResponse } from '../../../models/interfaces/IAVefiWork';

import { useHash } from '../../../composables/useHash'; // auto-scroll is enabled by default
import { useCurrentUrlState } from '../../../composables/useCurrentUrlState';

definePageMeta({
    auth: false,
    middleware: ['check-category'],
});
const { hash } = useHash();
const { currentUrlState } = useCurrentUrlState();


const route = useRoute();
const params = ref(route.params);

if (!params.value.id && !params.value.prefix) {
    throw new Error('prefix AND ID parameter required');
}

const category = ref('avefi:WorkVariant');
const type = ref('Monographic');

//@TODO: refactor on larger scale
const { data: dataJson } = await useAsyncData<IAVefiListResponse>('dataJson', async () => {
  //we expect missing prefix to be 21.11155
  if(params.value.id.indexOf('.') < 0) {
    params.value.id = '21.11155/' + params.value.id;
  }
    const data = await getDataSet(params.value.id);
    console.log('Data:', data);

    if(data?.value?.has_record.category){
        category.value = data.value?.has_record.category;
    }

    if(data?.value?.has_record.type){
        type.value = data.value?.has_record.type;
        console.log('Type:', type.value);
    }

    return data as IAVefiListResponse;

});

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
