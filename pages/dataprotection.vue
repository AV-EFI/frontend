<script setup lang="ts">

definePageMeta({
    auth: false
});

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
                            <iframe
                                src="https://datenschutz.gwdg.de/services/av-efi"
                                width="100%"
                                height="800"
                                style="border:none;"
                            />
                        </div>
                    </div>          
                </div>
            </article>
        </div>
    </div>
</template>
