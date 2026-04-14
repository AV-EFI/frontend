<template>
    <div class="container mx-auto p-4">
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
                    <h2 class="font-semibold">
                        {{ $t('mergeTool') }} {{ authData?.user?.name }} | {{ authData?.user?.institution }}
                    </h2>
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
