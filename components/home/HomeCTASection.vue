<template>
    <section role="region" :aria-label="t('callToAction.title')" class="relative border-t border-base-200 py-10">
        <div class="container mx-auto px-4 min-h-[400px] flex items-center">
            <div class="flex flex-col gap-8 lg:flex-row lg:items-center w-full">
                <div class="w-full lg:w-1/2 flex justify-center">
                    <div class="card-body w-full max-w-xl text-left">
                        <h2 class="text-3xl bree md:text-4xl font-extrabold leading-tight mb-2" tabindex="0">
                            {{ t('callToAction.title') }}
                        </h2>
                        <p class="text-base md:text-lg opacity-80" tabindex="0">
                            {{ t('callToAction.text') }}
                        </p>
                    </div>
                </div>
                <div class="card-body w-full max-w-xl text-left">
                    <div class="w-full max-w-xl text-left" role="region"
                        :aria-label="t('becomeAPartner.title') || 'Become a partner call to action'">
                        <h2 class="text-3xl bree md:text-4xl font-extrabold leading-tight mb-2" tabindex="0">
                            {{ t('becomeAPartner.title') }}
                        </h2>
                        <p>{{ t('becomeAPartner.text') }}</p>
                        <a :href="t('becomeAPartner.ctaLink')" target="_blank" class="btn btn-primary mt-4">
                            {{ t('becomeAPartner.cta') }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
