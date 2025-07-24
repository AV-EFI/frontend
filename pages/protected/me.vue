<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { FormKitSchema } from '@formkit/vue';
import schemaFk from '../../models/formkit-schemas/fk_me.json';

// ⬇️ Get session composable
const { data, getSession } = useAuth();

// ⬇️ Create local editable profile object
const profile = reactive({
    name: '',
    email: '',
    institution: ''
});

// ⬇️ Fetch user session on mount
onMounted(async () => {
    await getSession();
    if (data.value?.user) {
        Object.assign(profile, data.value.user);
    }
});
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
            v-model="profile"
            type="form"
            :actions="false"
          >
            <FormKitSchema
              :data="profile"
              :schema="schemaFk"
            />
          </FormKit>
        </Suspense>
      </template>
    </NuxtLayout>
  </div>
</template>
