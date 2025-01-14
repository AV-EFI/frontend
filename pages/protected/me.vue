<script setup lang="ts">

import { FormKitSchema } from '@formkit/vue';

definePageMeta({
    //middleware: 'auth'
});

import schemaFk from '../../models/formkit-schemas/fk_me.json';
const { data, getSession } = useAuth();

</script>

<template>
  <div>
    <NuxtLayout name="partial-layout-1-center">
      <template #title>
        <h2>{{ $t('profile') }}</h2>
      </template>
      <template #cardBody>
        <Suspense>
          <FormKit
            v-model="data"
            type="form"
            :actions="false"
          >
            <FormKitSchema
              :data="data"
              :schema="schemaFk"
            />
          </FormKit>
        </Suspense>
      </template>
    </NuxtLayout>
  </div>
</template>