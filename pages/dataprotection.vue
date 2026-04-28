<script setup lang="ts">

definePageMeta({
    auth: false
});

const iframeError = ref(false);

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
                            <h2 class="card-title font-">
                                {{ $t('dataprotection') }}
                            </h2>
                            <!-- Fallback shown if the host blocks framing via X-Frame-Options -->
                            <p v-if="iframeError">
                                {{ $t('iframeNotSupported') }}
                                <a
                                    href="https://datenschutz.gwdg.de/services/av-efi"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="link"
                                >
                                    {{ $t('openPrivacyPolicy') }}
                                </a>
                            </p>
                            <iframe
                                v-else
                                src="https://datenschutz.gwdg.de/services/av-efi"
                                :title="$t('dataprotection')"
                                width="100%"
                                height="800"
                                style="border:none;"
                                @error="iframeError = true"
                            />
                        </div>
                    </div>          
                </div>
            </article>
        </div>
    </div>
</template>
