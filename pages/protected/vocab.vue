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
                    <h1 class="text-2xl font-bold my-2 pl-2">
                        {{ $t('vocab.title') }}
                    </h1>
                </template>
                <template #cardBody>
                    <GlobalVocabViewer />
                </template>
            </NuxtLayout>
        </div>
    </div>
</template>
