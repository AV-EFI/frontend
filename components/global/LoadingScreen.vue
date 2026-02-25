<template>
  <Transition name="fade">
    <div v-if="isLoading"
      :class="['splash-screen fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center overflow-hidden transition-opacity duration-500', splashThemeClass]"
      aria-label="Please wait" role="status" aria-live="polite" inert>
      <div class="flex flex-col items-center gap-8">
        <img :src="logoSrc" alt="AVefi Logo" class="h-auto w-52 animate-pulse drop-shadow-lg" aria-hidden="true">
        <div class="loading loading-spinner loading-lg text-primary" aria-hidden="true"></div>
        <span class="sr-only">Loading application...</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
type SplashTheme = 'avefi_light' | 'avefi_dark';

const isLoading = ref(true);
const splashTheme = ref<SplashTheme>('avefi_light');
const splashThemeClass = computed(() => splashTheme.value === 'avefi_dark' ? 'splash-screen--dark' : 'splash-screen--light');
const logoSrc = computed(() => splashTheme.value === 'avefi_dark' ? '/img/AV-EFI-Logo-dark.svg' : '/img/AV-EFI-Logo.svg');
const colorModeCookie = useCookie<SplashTheme | 'dark'>('avefi-color-mode', {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    default: () => 'avefi_light',
});

const normalizeTheme = (theme?: string | null): SplashTheme => (theme === 'avefi_dark' || theme === 'dark' ? 'avefi_dark' : 'avefi_light');
const applyTheme = (theme?: string | null) => {
    const normalized = normalizeTheme(theme);
    splashTheme.value = normalized;
    colorModeCookie.value = normalized;
};

applyTheme(colorModeCookie.value);

useHead(() => ({
    htmlAttrs: {
        'data-theme': splashTheme.value,
    },
    script: [
        {
            hid: 'init-color-mode',
            tagPriority: 'critical',
            innerHTML: `(() => {
  try {
    const stored = localStorage.getItem('avefi-color-mode');
    if (stored) {
      document.documentElement.setAttribute('data-theme', stored);
      document.cookie = "avefi-color-mode=" + stored + "; path=/; max-age=31536000; SameSite=Lax";
      return;
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'avefi_dark');
      document.cookie = "avefi-color-mode=avefi_dark; path=/; max-age=31536000; SameSite=Lax";
    }
  } catch (error) {
    console.warn('Failed to read color mode before paint', error);
  }
})();`,
        },
    ],
    __dangerouslyDisableSanitizersByTagID: {
        'init-color-mode': ['innerHTML'],
    },
}));

if (import.meta.client) {
    const storedTheme = window.localStorage.getItem('avefi-color-mode')
    || document.documentElement.getAttribute('data-theme')
    || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'avefi_dark' : 'avefi_light');

    applyTheme(storedTheme);
}

onMounted(() => {
    // Hide loading screen after app is mounted and hydrated
    // Add small delay to ensure styles are loaded
    setTimeout(() => {
        isLoading.value = false;
    }, 500);

    if (import.meta.client) {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    applyTheme(document.documentElement.getAttribute('data-theme'));
                }
            }
        });

        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        onBeforeUnmount(() => {
            observer.disconnect();
        });
    }
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
