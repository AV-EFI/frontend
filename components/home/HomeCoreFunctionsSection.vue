<template>
    <section role="region" :aria-label="t('coreFunctionsSection')" class="relative border-t border-base-200 py-10">
        <div class="container mx-auto px-4 min-h-[400px] flex items-center">
            <HomeSectionTextBlock
                :title="t('openAndExtendable.title')"
                :paragraphs="[t('openAndExtendable.content[0]'), t('openAndExtendable.content[1]')]"
                :cta-label="t('openAndExtendable.cta')"
                :cta-href="t('openAndExtendable.content[2]')"
                cta-target="_blank"
                wrapper-class="mx-auto w-full lg:w-2xl"
                cta-class="btn btn-outline max-md:btn-block"
            />
        </div>
    </section>
</template>

<script setup>
import HomeSectionTextBlock from '~/components/home/HomeSectionTextBlock.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
