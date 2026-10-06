<template>
    <div class="container mx-auto px-4 pb-4">
        <GlobalBreadcrumbsComp
            :breadcrumbs="[
                [$t('home.breadcrumbs'), '/'],
                [$t('mergeTool'), `/protected/mergetool`],
            ]"
        />
        <div class="mt-4">
            <NuxtLayout
                name="partial-layout-1-center"
                :show-expand-toggle="true"
            >
                <template #title>
                    <GlobalPageTitleComp variant="card">
                        {{ $t('mergeTool') }} {{ authData?.user?.name }} | {{ authData?.user?.institution }}
                    </GlobalPageTitleComp>
                </template>
                <template #cardBody>
                    <DetailMergeToolListComp />
                </template>
            </NuxtLayout>
        </div>
    </div>
</template>
<script lang="ts" setup>
const { data:authData } = useAuth();
</script>
