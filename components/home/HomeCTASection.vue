<template>
    <section role="region" :aria-label="t('callToAction.title')" class="relative border-t border-base-200 py-10">
        <div class="container mx-auto px-4 min-h-[400px] flex items-center">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                <HomeSectionTextBlock
                    :title="t('callToAction.title')"
                    :paragraphs="[t('callToAction.text')]"
                    wrapper-class="w-full"
                />
                <HomeSectionTextBlock
                    :title="t('becomeAPartner.title')"
                    :paragraphs="[t('becomeAPartner.text')]"
                    wrapper-class="w-full"
                    :cta-label="t('becomeAPartner.cta')"
                    :cta-href="t('becomeAPartner.ctaLink')"
                    cta-target="_blank"
                />
            </div>
        </div>
    </section>
</template>

<script setup>
import HomeSectionTextBlock from '~/components/home/HomeSectionTextBlock.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
