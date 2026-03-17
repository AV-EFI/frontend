<template>
    <div role="region" :aria-label="t('home.sections.video.aria')" class="w-full min-h-75 md:min-h-100 flex items-center justify-between">
        <div class="mx-auto w-full">
            <div class="flex justify-center">
                <video controls preload="none" :poster="videoPosterSrc" width="1024" height="768"
                       class="w-full mx-auto md:max-w-3xl rounded-xl border border-base-300 shadow-lg"
                       :aria-describedby="'video-desc'">
                    <source type="video/mp4" src="/vid/avefi_project_wo.mp4" />
                    {{ t('home.sections.video.notSupported') }}
                </video>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const createMediaQuery = (query, defaultValue = false) =>
    useMediaQuery(query, {
        window: typeof window === 'undefined' ? undefined : window,
        defaultValue,
    });

const isXLViewport = createMediaQuery('(min-width: 1440px)');
const isLargeViewport = createMediaQuery('(min-width: 1200px)');
const isDesktopViewport = createMediaQuery('(min-width: 960px)');
const isTabletViewport = createMediaQuery('(min-width: 720px)');

const videoPosterSrc = computed(() => {
    if (isXLViewport.value) return '/img/avefi_vid_poster-1280.webp';
    if (isLargeViewport.value) return '/img/avefi_vid_poster-1024.webp';
    if (isDesktopViewport.value) return '/img/avefi_vid_poster-720.webp';
    if (isTabletViewport.value) return '/img/avefi_vid_poster-540.webp';
    return '/img/avefi_vid_poster-360.webp';
});
</script>
