<template>
    <div class="w-full min-h-75 flex flex-col items-start justify-between">
        <HomeSectionTextBlock
            :title="t('home.sections.callToAction.title')"
            :paragraphs="[t('home.sections.callToAction.content[0]'), t('home.sections.callToAction.content[1]')]"
            wrapper-class="w-full"
            inner-class="max-w-none"
            :cta-href="null"
        />
        <button class="ml-6 btn btn-primary" type="button" @click="openContactDrawer">
            {{ $t('home.sections.callToAction.cta') }}
        </button>

    </div>
</template>

<script setup>
import HomeSectionTextBlock from '~/components/home/HomeSectionTextBlock.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const openContactDrawer = () => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new Event('open-contact-drawer'));
};
</script>