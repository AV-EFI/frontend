<template>
    <div class="container mx-auto p-4">
        <GlobalBreadcrumbsComp
            :breadcrumbs="[
                [$t('home.breadcrumbs'), '/'],
                [$t('helpAndGlossary'), `/protected/glossary`],
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
