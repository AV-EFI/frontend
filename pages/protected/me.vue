<template>
  <ClientOnly>
    <LazyGlobalBreadcrumbsComp
      :breadcrumbs="[
        ['Home', '/'],
        [$t('profile'), '/protected/me']
      ]"
      class="mb-4"
    />
    <div v-if="data.value?.user">
      <NuxtLayout name="partial-layout-1-center">
        <template #title>
          <div class="flex px-4">
          <h2 class="text-2xl">
            {{ $t('profile') }}
          </h2>
          </div>
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
    <div v-else class="p-6 text-center">
      <p>{{ $t('notLoggedIn') }}</p>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { FormKitSchema } from '@formkit/vue';
import schemaFk from '../../models/formkit-schemas/fk_me.json';

const { data, getSession } = useAuth();

// ✅ Match fk_me.json structure
const profile = reactive({
  user: {
    name: '',
    email: '',
    institution: ''
  },
  expires: '',
  role: null,
  blocked: false
});

onMounted(async () => {
  if (!data.value?.user) {
    await getSession();
  }
  if (data.value?.user) {
    try {
      profile.user.name = data.value.user.name || '';
      profile.user.email = data.value.user.email || '';
      profile.user.institution = data.value.user.orgid || '';

      // ✅ Populate session expiration
      if (data.value.timestamp && data.value.timeout) {
        const expiresAt = new Date((data.value.timestamp + data.value.timeout) * 1000);
        profile.expires = expiresAt.toLocaleString();
      }

      // ✅ Default role (no backend roles yet)
      //profile.role = 1; // "Authenticated"

      // ✅ Blocked status
      //profile.blocked = false;

    }
    catch (error) {
      console.error('Error fetching session:', error);
    }
  }
});
</script>
