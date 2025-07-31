<template>
  <ClientOnly>
    <LazyGlobalBreadcrumbsComp
      :breadcrumbs="[
        ['Home', '/'],
        [$t('profile'), '/protected/me']
      ]"
      class="mb-4"
    />
    <div v-if="fatalError" class="p-6 text-center text-error">
      <p>{{ $t('errorOccurred') }}: {{ fatalError }}</p>
    </div>
    <div v-else-if="auth.data.value?.user">
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
import { reactive, ref, onMounted } from 'vue';
import { FormKitSchema } from '@formkit/vue';
import schemaFk from '../../models/formkit-schemas/fk_me.json';

const log = (...args: unknown[]) => {
  console.log(`[ProfilePage ${new Date().toISOString()}]`, ...args);
};

const auth = useAuth();
const fatalError = ref<string | null>(null);

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
  try {
    log('Mounted: Starting session check');
    if (!auth.data.value?.user) {
      log('No user in session, fetching...');
      try {
        await auth.getSession();
        log('Session fetched successfully:', auth.data.value);
      } catch (err) {
        log('❌ Error fetching session:', err);
        fatalError.value = (err as Error)?.message || 'Session fetch failed';
        return;
      }
    }

    const user = auth.data.value?.user;
    if (user) {
      try {
        log('Mapping user data to profile');
        profile.user.name = user.name || '';
        profile.user.email = user.email || '';
        profile.user.institution = user.orgid || '';

        if (auth.data.value.timestamp && auth.data.value.timeout) {
          const expiresAt = new Date(
            (auth.data.value.timestamp + auth.data.value.timeout) * 1000
          );
          profile.expires = expiresAt.toLocaleString();
        }
        log('Profile mapped successfully:', JSON.stringify(profile));
      } catch (error) {
        log('❌ Error mapping user data:', error);
        fatalError.value = (error as Error)?.message || 'Mapping error';
      }
    } else {
      log('No user object found in auth data');
    }
  } catch (outerErr) {
    log('🔥 Fatal error during onMounted execution:', outerErr);
    fatalError.value = (outerErr as Error)?.message || 'Unexpected error';
  }
});
</script>
