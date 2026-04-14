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
                    <h2>{{ $t('institutionLabel') }} {{ authData?.user?.institution }}</h2>
                    <h2>{{ $t('userLabel') }} {{ authData?.user?.name }}</h2>
                </template>
                <template #cardBody>
                    <LazyDetailLogListComp />
                </template>
            </NuxtLayout>
        </div>
    </div>
</template>
