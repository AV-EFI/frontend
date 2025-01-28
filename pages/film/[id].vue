<template>
  <div>
    <GlobalBreadcrumbsComp
      :breadcrumbs="[
        ['Home', '/'],
        [$t('filmresearch'), `/${useRuntimeConfig().public.SEARCH_URL}/index?${useRuntimeConfig().public.SEARCH_INIT_URL_PARAMS}`], ['Detail', '/film/' + params.id]
      ]"
    />
    <NuxtLayout name="partial-layout-1-center">
      <template #navigation>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a :href="`/${useRuntimeConfig().public.SEARCH_URL}`">{{ $t('filmresearch') }}</a></li>
          <li>
            <span class="text-accent">
              {{ $t('detailview') }}
            </span>
          </li>
        </ul>
      </template>
      <template #title>
        <NuxtLayout name="partial-grid-2-1">
          <template #left>
            <h2
              class="text-lg text-primary-900 dark:text-white col-span-full text-ellipsis text-wrap overflow-hidden max-w-full content-center"
              :alt="dataJson?._source?.has_record?.has_primary_title.has_name"
            >
              {{ dataJson?._source?.has_record?.has_primary_title.has_name }}
            </h2>  
          </template>
          <template #right>
            <div class="flex flex-row flex-wrap">
              <AddToShoppingCartComp
                :film-id="params.id"
                :film-title="dataJson?._source?.has_record?.has_primary_title.has_name"
                class="ml-2"
              />
              <AddToComparisonComp
                :film-id="params.id"
                :film-title="dataJson?._source?.has_record?.has_primary_title.has_name"
                class="ml-2"
              />
              <GlobalExportDataComp
                :data-set-id="params.id"
                :data-set-json="JSON.stringify(dataJson,null,2)"
                class="ml-2"
              />
            </div>
          </template>
        </NuxtLayout>
      </template>
      <template #actions>
        <MicroBadgeCategoryComp
          class="col-span-6"
          :category="dataJson?._source?.has_record?.type"
        />
      </template>
      <template #cardBody>
        <div>
          <div
            v-if="category == 'avefi:WorkVariant'"
          >
            <ClientOnly
              fallback-tag="span"
              fallback="Loading data..."
            >
              <ViewsWorkViewCompAVefi
                :model-value="JSON.stringify(dataJson, null, 2)"
                @update:model-value="val => dataJson = JSON.parse(val)"
              />
            </ClientOnly>
          </div>
          <div
            v-else-if="category == 'avefi:Manifestation'"
          >
            <ClientOnly
              fallback-tag="span"
              fallback="Loading data..."
            >
              <ViewsManifestationViewCompAVefi
                :model-value="JSON.stringify(dataJson, null, 2)"
                @update:model-value="val => dataJson = JSON.parse(val)"
              />
            </ClientOnly>
          </div>
          <div
            v-else-if="category == 'avefi:Item'"
          >
            <ClientOnly
              fallback-tag="span"
              fallback="Loading data..."
            >
              <ViewsItemViewCompAVefi
                :model-value="JSON.stringify(dataJson, null, 2)"
                @update:model-value="val => dataJson = JSON.parse(val)"
              />
            </ClientOnly>
          </div>
          <div v-else>
            Unknown Category: {{ category }}
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
import type { IAVefiListResponse } from '../../models/interfaces/IAVefiWork';

const route = useRoute();
const params = ref(route.params);
const category = ref('avefi:WorkVariant');
const { data: dataJson } = await useAsyncData<IAVefiListResponse>('dataJson', async () => {
    const data = await getDataSet(params.value.id);
    console.log(data);
    if(data?.value?.has_record.category){
        category.value = data.value?.has_record.category;
    }
    return data[0] as IAVefiListResponse;
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
</style>
