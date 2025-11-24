<template>
  <div>
    <GlobalBreadcrumbsComp
      :breadcrumbs="[
        ['Home', '/'],
        [$t('filmresearch'), `/${useRuntimeConfig().public.SEARCH_URL}/index?${useRuntimeConfig().public.SEARCH_INIT_URL_PARAMS}`], 
        ['Serial', '/serial/' + params.id]
      ]"
    />

    <NuxtLayout name="partial-layout-1-center">
      <template #title>
        <h2
          class="text-primary-900 dark:text-white col-span-full text-ellipsis text-wrap overflow-hidden max-w-full content-center"
          v-html="$t('workVariantIsPartOf', {name: route.params.id})"
        />
      </template>
      <template #cardBody>
        <div class="p-4">
          <ul class="space-y-4">
            <li
              v-for="work in dataJson"
              :key="work._id"
              class="bg-base-100 shadow-md rounded-lg p-4"
            >
              <h2
                class="font-bold text-lg my-1 text-primary-900 dark:text-white"
                :alt="$t('title')"
                :title="$t('title')"
              >
                <a
                  :href="`/res/${work?._id}`"
                  :title="$t('detailviewlink')"
                  target="_blank"
                  class="link dark:link-white no-underline hover:underline"
                >
                  <span>
                    {{ work?._source?.has_record?.has_primary_title?.has_name }}
                  </span>
                </a>
              </h2>        
              <div class="flex flex-col md:flex-row text-sm text-primary-700 dark:text-gray-200 mt-2">
                <span
                  v-if="work?._source?.has_record?.has_event?.map((loc) => loc)"
                  class="flex items-center"
                >
                  <Icon
                    name="mdi:map-marker-outline"
                    class="mr-1"
                    :alt="$t('country')"
                    :title="$t('country')"
                  />
                  {{ work?._source?.has_record?.has_event?.flatMap(ev => ev.located_in?.map(location => location.has_name) || null).join(', ') }}
                </span>
                <span
                  v-if="work?._source?.years"
                  class="flex items-center"
                >
                  <template v-if="work?._source?.has_record?.has_event"><span class="flex items-center">&nbsp;&nbsp;</span></template>
                  <Icon
                    name="fa:calendar"
                    class="mr-1"
                  />
                  {{ work?._source?.years.join(', ') }}
                </span>
                <span
                  v-if="work?._source?.has_record?.has_form"
                  class="flex items-center"
                >
                  <template v-if="work?._source?.has_record?.has_event || item.years">
                    <span class="flex items-center">&nbsp;&nbsp;</span>
                  </template>
                  <Icon
                    name="fa:film"
                    class="mr-1"
                  />
                  {{ work?._source?.has_record?.has_form?.flatMap((f) => $t(f)).join(', ') }}
                </span>
                <span
                  v-if="work?._source?.has_record?.is_part_of"
                  class="flex items-center"
                >
                  <template v-if="work?._source?.has_record?.has_event || work?._source?.years || work?._source?.has_record?.has_form">
                    <span class="flex items">
                &nbsp;&nbsp;
                    </span>
                    <Icon
                      name="tabler:layout"
                      class="mr-1"
                    />
                    {{ $t('Episode/Part') }}
                  </template>
                </span>
              </div>
              <div class="text-sm text-gray-500 w-full mt-2">
                <MicroLabelComp label-text="AlternativeTitle" />
                <ul>
                  <li
                    v-for="alt in work?._source.has_record?.has_alternative_title"
                    :key="alt.id"
                  >
                    {{ alt.has_name }}
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>


        <div class="collapse">
          <input type="checkbox"> 
          <div class="collapse-title font-medium">
            Raw data
          </div>
          <div class="collapse-content"> 
            <pre>{{ dataJson }}</pre>
          </div>      
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { IAVefiListResponse } from '../../models/interfaces/IAVefiWork';

definePageMeta({
    auth: false,
});

const route = useRoute();
const params = ref(route.params);
console.log('Route params on load:', route.params);

const { data: dataJson } = await useAsyncData<IAVefiListResponse>('dataJson', async () => {
    const id = route.params.id; // <-- live reactive access
    console.log('Params:', id);
    const { data } = await useFetch<IAVefiListResponse>(`/api/elastic/get_work_by_is_part_of`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: {
            documentId: id,
        },
    });
    console.log('Data:', data.value);
    return data.value;
}, {
    immediate: true
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
         content: url('https://api.iconify.design/tabler:share.svg');
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
