<template>
  <div>
    <div class="collapse">
      <input type="checkbox"> 
      <div class="collapse-title font-medium">
        Raw data
      </div>
      <div class="collapse-content"> 
        <pre :class="(pending)?'skeleton':''">{{ pending? "" : apiData?.data }}</pre>
      </div>
    </div>

    <NuxtLayout name="partial-layout-1-center">
      <template #title>
        Werk
      </template>
      <template #actions>
        <div v-if="apiData?.data">
          <AddToComparisonComp
            :film-id="(apiData?.data as IAVefiData).id"
            :film-title="apiData?.data?.attributes?.Title"
          />
        </div>
      </template>
      <template #cardBody>
        <div v-if="apiData?.data">
          <Suspense>
            <FormKit
              v-model="apiData.data"
              type="form"
              :actions="false"
            >
              <FormKitSchema
                :data="apiData.data"
                :schema="schemaFk"
              />
            </FormKit>
          </Suspense>
        </div>
        <div v-else>
          <p>No data</p>
        </div>
        <button
          class="btn btn-secondary btn-outline"
          title="Refresh"
          @click="refresh"
        >
          Refresh
        </button>
      </template>
    </NuxtLayout>
    <hr>
  </div>
</template>

<script setup lang="ts">

import { FormKitSchema } from '@formkit/vue';
import { ref } from 'vue';
import type {IAVefiSingleResponse} from '../../../models/interfaces/IAVefiWork';
import type { IAVefiData } from '../../../models/interfaces/IAVefiWork';
import schemaFk from '../../../models/formkit-schemas/fk_work.json';

const route = useRoute();
const routeParamsId = ref(route.params.id);
const collectionName = 'work-levels';

definePageMeta({
    //middleware: ["auth"]
    // or middleware: 'auth'
});


const refresh = () => refreshNuxtData(collectionName);
refresh();

async function getCollectionType ():Promise<IAVefiSingleResponse|null> {  
    //const { data } = await useApiFetch<IAVefiResponse>(`/api/${collectionName}/${routeParamsId.value}?populate=*`, {method: 'GET'});
    const { data } = await useApiFetchLocal<IAVefiSingleResponse>(`/api/${collectionName}/${routeParamsId.value}`, {method: 'GET'});
    if(data) {
        return data.value;
    }

    return null;
}

const { data: apiData, pending } = await useAsyncData<IAVefiSingleResponse|null>(collectionName, () => {
    return getCollectionType();
}
);
</script>