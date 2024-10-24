<template>
  <div>
    <NuxtLayout name="partial-layout-1-center">
      <template #actions>
        <a
          class="link link-accent"
          href="/search_altern"
        >
          <Icon
            name="fa-regular:arrow-alt-circle-left"
            size="1em"
            alt="Referenz bei GND"
          />&nbsp;{{ $t('backtosearch') }}
        </a>

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
          <div
            v-if="category == 'avefi:WorkVariant'"
          >
            <ClientOnly
              fallback-tag="span"
              fallback="Loading data..."
            >
              <ViewsWorkViewCompAVefi
                v-model="dataJson"                
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
              <ViewsManifestationViewCompAVefi v-model="dataJson" />
            </ClientOnly>
          </div>
          <div
            v-else-if="category == 'avefi:Item'"
          >
            <ClientOnly
              fallback-tag="span"
              fallback="Loading data..."
            >
              <ViewsItemViewCompAVefi v-model="dataJson" />
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
const category = ref('');
console.log(useRuntimeConfig().public.AVEFI_DATA_API);
async function getCollectionType (routeParamsId:string):Promise<string> {  
    const { data } = await useApiFetchLocal<IAVefiListResponse>(
        `${useRuntimeConfig().public.AVEFI_DATA_API}/getdetailedview`,
        {
            method: 'POST',
            headers: {
                'Authorization': `ApiKey ${useRuntimeConfig().public.ELASTIC_IMDB_APIKEY}`
            },
            body: {
                documentId: routeParamsId
            }
        }
    );
    
    if(data.value && data.value.length == 1) {
        console.log(data.value);
        category.value = data?.value[0]?._source?.has_record.category.trim();
        console.log(category.value);
        return JSON.stringify(data?.value[0], null, 2);
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
