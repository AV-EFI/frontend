<template>
    <Transition name="fade">
        <div v-if="isLoading"
             :class="['splash-screen fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center overflow-hidden transition-opacity duration-500', splashThemeClass]"
             :aria-label="$t('pleaseWait')" role="status" aria-live="polite" inert>
            <div class="flex flex-col items-center gap-8">
                <img :src="logoSrc" alt="AVefi Logo" class="h-auto w-52 animate-pulse drop-shadow-lg" aria-hidden="true">
                <div class="loading loading-spinner loading-lg text-primary" aria-hidden="true"></div>
                <span class="sr-only">{{ $t('loadingApplication') }}</span>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';

type SplashTheme = 'avefi_light' | 'avefi_dark';

const themeCookie = useCookie<SplashTheme | 'dark'>('avefi-color-mode', {
    default: () => 'avefi_light',
});

const normalizeTheme = (theme?: string | null): SplashTheme =>
    theme === 'avefi_dark' || theme === 'dark' ? 'avefi_dark' : 'avefi_light';

const isLoading = ref(true);
const splashTheme = ref<SplashTheme>(normalizeTheme(themeCookie.value));

const splashThemeClass = computed(() =>
    splashTheme.value === 'avefi_dark' ? 'splash-screen--dark' : 'splash-screen--light'
);

const logoSrc = computed(() =>
    splashTheme.value === 'avefi_dark' ? '/img/AV-EFI-Logo-dark.svg' : '/img/AV-EFI-Logo.svg'
);

const applyThemeFromDom = () => {
    splashTheme.value = normalizeTheme(document.documentElement.getAttribute('data-theme'));
};

let observer: MutationObserver | null = null;

onMounted(() => {
    applyThemeFromDom();

    observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                applyThemeFromDom();
            }
        }
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
    });

    window.setTimeout(() => {
        isLoading.value = false;
    }, 500);
});

onBeforeUnmount(() => {
    observer?.disconnect();
});
</script>
<style>
.splash-screen {
  background: linear-gradient(135deg, #c3d5de 0%, #f8fafc 40%, #f8fafc 60%, #c3d5de 100%);
  color: #0f172a;
}

.splash-screen--dark {
  background: linear-gradient(135deg, #05060a 0%, #111827 50%, #1f2937 100%);
  color: #f8fafc;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
