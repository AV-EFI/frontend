<template>
    <div>
        <GlobalBreadcrumbsComp
            :breadcrumbs="[
                [$t('home.breadcrumbs'), '/'],
                [$t('favourites'), `/protected/favouriteslist`],
            ]"
        />
        <div>
            <NuxtLayout
                name="partial-layout-1-center"
                :show-expand-toggle="false"
            >
                <template #title>
                    <h2>{{ t('favouritesListOf', { name: authData?.user?.name || '' }) }}</h2>
                </template>
                <template
                    #cardBody
                >
                    <LazyDetailFavouritesListComp />
                </template>
            </NuxtLayout>
        </div>
    </div>
</template>
<script lang="ts" setup>
const { data:authData } = useAuth();
const { t } = useI18n();
</script>
