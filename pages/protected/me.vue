<script setup lang="ts">

import { FormKitSchema } from '@formkit/vue';

definePageMeta({
    middleware: 'auth'
});

import type IAVefiUser from '../../models/interfaces/IAVefiUser';
import schemaFk from '../../models/formkit-schemas/fk_me.json';
console.log(schemaFk);

async function getCollectionType ():Promise<IAVefiUser|null> {  
    const { data } = await useApiFetch<IAVefiUser>(`/api/users-permissions/meProfile`, {method: 'GET'});
    console.log(data.value);
    if(data) {
        return data.value;
    }
    return null;
}
const { data: apiData, pending } = await useAsyncData<IAVefiUser|null>('apiData', () =>
    getCollectionType()
);
const refresh = () => refreshNuxtData("apiData");

</script>

<template>
  <div>
    <pre :class="(pending)?'skeleton':''">{{ pending? "" : apiData }}</pre>
    <NuxtLayout name="partial-layout-1-center">
      <template #title>
        Profile
      </template>
      <template #cardBody>
        <Suspense>
          <FormKit
            v-model="apiData"
            type="form"
          >
            <FormKitSchema
              :data="apiData"
              :schema="schemaFk"
            />
          </FormKit>
        </Suspense>
        <button
          title="Refresh"
          class="btn btn-secondary btn-outline"
          @click="refresh"
        >
          Refresh
        </button>
      </template>
    </NuxtLayout>
  </div>
</template>