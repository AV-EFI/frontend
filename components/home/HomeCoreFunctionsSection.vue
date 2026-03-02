<template>
    <div class="w-full min-h-100 flex items-center justify-between">
        <HomeSectionTextBlock
            :title="t('home.sections.openAndExtendable.title')"
            :paragraphs="[t('home.sections.openAndExtendable.content[0]'), t('home.sections.openAndExtendable.content[1]')]"
            :cta-label="t('home.sections.openAndExtendable.cta')"
            :cta-href="t('home.sections.openAndExtendable.content[2]')"
            cta-target="_blank"
            wrapper-class="w-full"
            inner-class="max-w-none"
            cta-class="btn btn-primary max-md:btn-block"
        />
    </div>
</template>

<script setup>
import HomeSectionTextBlock from '~/components/home/HomeSectionTextBlock.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
