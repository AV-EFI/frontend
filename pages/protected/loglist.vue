<template>
    <div>
        <GlobalBreadcrumbsComp
            :breadcrumbs="[
                [$t('home.breadcrumbs'), '/'],
                [$t('logList'), `/protected/loglist`],
            ]"
        />
        <div>
            <NuxtLayout name="partial-layout-1-center">
                <template #title>
                    <GlobalPageTitleComp variant="card">{{ $t('institutionLabel') }} {{ authData?.user?.institution }}</GlobalPageTitleComp>
                    <h2>{{ $t('userLabel') }} {{ authData?.user?.name }}</h2>
                </template>
                <template #cardBody>
                    <LazyDetailLogListComp />
                </template>
            </NuxtLayout>
        </div>
    </div>
</template>

<script setup lang="ts">
const { data: authData } = useAuth();
</script>
