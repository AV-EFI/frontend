<template>
    <div class="w-full min-h-75 flex flex-col items-start justify-between">
        <HomeSectionTextBlock
            :title="t('home.sections.openAndExtendable.title')"
            :paragraphs="[t('home.sections.openAndExtendable.content[0]'), t('home.sections.openAndExtendable.content[1]')]"
            cta-target="_blank"
            wrapper-class="w-full"
            inner-class="max-w-none"
        />
        <div class="ml-6 btn btn-primary" @click="toggleForm()">
            {{ $t('home.sections.openAndExtendable.cta') }}
        </div>
    </div>
</template>

<script setup>
import HomeSectionTextBlock from '~/components/home/HomeSectionTextBlock.vue';
import { useI18n } from 'vue-i18n';
const toggleForm = () => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('open-contact-form'));
};
const { t } = useI18n();
</script>
