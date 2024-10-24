<template>
  <div>
    <NuxtLayout name="partial-layout-1-center">
      <template #actions>
        <div class="hidden">
          <div v-if="dataJson">
            <!--
            <AddToComparisonComp
              :film-id="dataJson.has_record.id"
              :film-title="dataJson.has_record.has_primary_title.has_name"
            />
            
            -->
          </div>
        </div>
      </template>
      <template #cardBody>
        <div>
          <ClientOnly>
            <ViewsWorkViewCompAVefi
              v-model="dataJson"
              class="border-solid border-l-2 border-work-variant pl-2"
            />
          </ClientOnly>
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

const route = useRoute();
const params = ref(route.params);

async function getCollectionType (routeParamsId:string):Promise<string> {  
    const { data } = await useApiFetchLocal<IAVefiListResponse>(
        `${useRuntimeConfig().public.ELASTIC_HOST_PUBLIC}/${useRuntimeConfig().public.ELASTIC_INDEX}/_doc/${routeParamsId}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `ApiKey ${useRuntimeConfig().public.ELASTIC_IMDB_APIKEY}`
            }
        }
    );
    
    if(data) {
        return JSON.stringify(data.value, null, 2);
    }
    return "";
}

const { data: dataJson } = await useAsyncData<string>('dataJson', () =>
    getCollectionType(params.value.id)
);


definePageMeta({
    //middleware: ["auth"]
    // or middleware: 'auth'
});

</script>
<style scoped>
  h2,h3 {
    color: var(--primary-500);
  }
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
