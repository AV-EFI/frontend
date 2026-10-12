<script setup lang="ts">

definePageMeta({
    auth: false
});

const DATA_PROTECTION_URL = 'https://datenschutz.gwdg.de/services/av-efi';

</script>
<template>
    <div>
        <GlobalBreadcrumbsComp
            :breadcrumbs="[
                [$t('home.breadcrumbs'), '/'],
                [$t('dataprotection'), '/dataprotection'],
            ]"
        />

        <div class="container">
            <article class="container flex justify-center">
                <div
                    id="c7273"
                    class="frame frame-default frame-type-text frame-layout-0 w-full md:w-2/3 text-balance text-justify"
                >
                    <div class="card">
                        <div class="card-body">
                            <GlobalPageTitleComp variant="card" class="card-title">
                                {{ $t('dataprotection') }}
                            </GlobalPageTitleComp>
                            <!-- datenschutz.gwdg.de forbids embedding (CSP frame-ancestors 'self'), so the page links to it. -->
                            <a
                                :href="DATA_PROTECTION_URL"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="btn btn-primary self-start"
                            >
                                <Icon name="tabler:external-link" aria-hidden="true" />
                                {{ $t('vocab.openInNewTab') }}
                            </a>
                        </div>
                    </div>          
                </div>
            </article>
        </div>
    </div>
</template>
