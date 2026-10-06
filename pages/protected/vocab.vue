<template>
    <div class="container mx-auto px-4 pb-4">
        <GlobalBreadcrumbsComp
            :breadcrumbs="[
                [$t('home.breadcrumbs'), '/'],
                [$t('helpAndGlossary'), `/protected/vocab`],
            ]"
        />
        <div class="mt-4">
            <NuxtLayout name="partial-layout-1-center">
                <template #title>
                    <GlobalPageTitleComp variant="card" class="my-2 pl-2">
                        {{ $t('vocab.title') }}
                    </GlobalPageTitleComp>
                </template>
                <template #cardBody>
                    <GlobalVocabViewer />
                </template>
            </NuxtLayout>
        </div>
    </div>
</template>
