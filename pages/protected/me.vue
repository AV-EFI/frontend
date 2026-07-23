<template>
    <div class="container mx-auto p-4">
        <GlobalBreadcrumbsComp
            :breadcrumbs="[
                [$t('home.breadcrumbs'), '/'],
                [$t('profile'), '/protected/me'],
            ]"
            class="mb-4"
        />

        <NuxtLayout name="partial-layout-1-center">
            <template #title>
                <h2 class="font-semibold">
                    {{ $t('profile') }}
                </h2>
            </template>

            <template #cardBody>
                <ClientOnly>
                    <template #fallback>
                        <div class="py-8 flex justify-center">
                            <span class="loading loading-spinner loading-lg text-primary" />
                        </div>
                    </template>

                    <div v-if="fatalError" class="p-6 text-center text-error">
                        <p>{{ $t('errorOccurred') }}: {{ fatalError }}</p>
                    </div>

                    <div v-else-if="profile.user" class="space-y-4">
                        <dl class="grid gap-3 text-sm sm:grid-cols-[max-content_1fr]">
                            <dt class="font-semibold">
                                {{ $t('profileName') }}
                            </dt>
                            <dd>{{ profile.user.name }}</dd>

                            <dt class="font-semibold">
                                {{ $t('profileEmail') }}
                            </dt>
                            <dd>{{ profile.user.email }}</dd>

                            <dt class="font-semibold">
                                {{ $t('profileInstitution') }}
                            </dt>
                            <dd>{{ profile.user.institution }}</dd>

                            <dt class="font-semibold">
                                {{ $t('profileExpires') }}
                            </dt>
                            <dd>{{ profile.expires }}</dd>
                        </dl>

                        <div class="pt-2">
                            <GlobalRawDataCollapse :api-data="rawProfileTokenData" />
                        </div>

                        <div class="pt-2">
                            <button type="button" class="btn btn-outline" :aria-label="$t('logout')" @click="auth.signOut()">
                                {{ $t('logout') }}
                            </button>
                        </div>
                    </div>

                    <div v-else class="p-6 text-center space-y-4">
                        <p>{{ $t('notLoggedIn') }}</p>
                        <button type="button" class="btn btn-primary" :aria-label="$t('login')" @click="auth.signIn()">
                            {{ $t('login') }}
                        </button>
                    </div>
                </ClientOnly>
            </template>
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';

const { t } = useI18n();
const auth = useAuth();
const fatalError = ref<string | null>(null);

const profile = computed(() => {
    const session = auth.data.value;
    const user = session?.user;

    if (!user) {
        return {
            user: null,
            expires: '',
        };
    }

    const expiresAt = session.timestamp && session.timeout
        ? new Date((session.timestamp + session.timeout) * 1000).toLocaleString()
        : '';

    return {
        user: {
            name: user.name || '',
            email: user.email || '',
            institution: user.orgid || user.institution || '',
        },
        expires: expiresAt,
    };
});

const rawProfileTokenData = computed(() => JSON.stringify(auth.data.value || {}, null, 2));

onMounted(async () => {
    try {
        if (!auth.data.value?.user) {
            await auth.getSession();
        }
    } catch (error) {
        fatalError.value = (error as Error)?.message || t('sessionFetchFailed');
    }
});
</script>
