<template>
  <ClientOnly>
    <LazyGlobalBreadcrumbsComp
      :breadcrumbs="[
        ['Home', '/'],
        [$t('profile'), '/protected/me']
      ]"
      class="mb-4"
    />
    <div v-if="auth.data.value?.user">
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

// ✅ Nicht destrukturieren – kein const data!
const auth = useAuth();

// ✅ Reaktives Profil-Objekt, keine const-Zuweisungen
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
  // Session nur laden, wenn noch kein User da ist
  if (!auth.data.value?.user) {
    try {
      await auth.getSession();
      console.log('Session fetched:', auth.data.value);
    } catch (err) {
      console.error('Error fetching session:', err);
    }
  }

  const user = auth.data.value?.user;
  if (user) {
    try {
      profile.user.name = user.name || '';
      profile.user.email = user.email || '';
      profile.user.institution = user.orgid || '';

      if (auth.data.value.timestamp && auth.data.value.timeout) {
        const expiresAt = new Date((auth.data.value.timestamp + auth.data.value.timeout) * 1000);
        profile.expires = expiresAt.toLocaleString();
      }
    } catch (error) {
      console.error('Error mapping user data:', error);
    }
  }
});
</script>
