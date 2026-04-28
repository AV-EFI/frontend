<script setup lang="ts">
import { computed } from 'vue';

type ThemeMode = 'avefi_light' | 'avefi_dark';

const theme = useCookie<ThemeMode>('avefi-color-mode', {
    default: () => 'avefi_light',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
});

const isLight = computed({
    get: () => theme.value === 'avefi_light',
    set: (value: boolean) => {
        const nextTheme: ThemeMode = value ? 'avefi_light' : 'avefi_dark';
        theme.value = nextTheme;

        if (import.meta.client) {
            const root = document.documentElement;
            root.setAttribute('data-theme', nextTheme);
            root.classList.toggle('dark', nextTheme === 'avefi_dark');
            localStorage.setItem('avefi-color-mode', nextTheme);
            document.cookie = `avefi-color-mode=${nextTheme}; path=/; max-age=31536000; SameSite=Lax`;
        }
    },
});
</script>

<template>
    <ClientOnly>
        <div class="lg:mx-auto">
            <label class="swap swap-flip">
                <input
                    v-model="isLight"
                    type="checkbox"
                    class="checkbox theme-controller hidden"
                    :aria-label="isLight ? $t('switchToDarkMode') : $t('switchToLightMode')"
                    :title="isLight ? $t('switchToDarkMode') : $t('switchToLightMode')"
                />
                <div class="swap-off animated" alt="Switch to dark mode" title="Switch to dark mode">
                    <div class="avatar placeholder">
                        <div class="bg-base-100 dark:bg-gray-600 dark:text-white text-neutral w-8 h-8 rounded-full flex items-center justify-center">
                            <span class="flex flex-row items-center justify-center w-full h-full">
                                <Icon class="text-lg" name="tabler:moon" :title="$t('switchToDarkMode')" />
                            </span>
                        </div>
                    </div>
                </div>
                <div class="swap-on animated circle" alt="Switch to light mode" title="Switch to light mode"></div>
                <div class="avatar placeholder">
                    <div class="bg-base-100 dark:bg-gray-600 dark:text-white text-neutral w-8 h-8 rounded-full flex items-center justify-center">
                        <span class="flex flex-row items-center justify-center w-full h-full">
                            <Icon class="text-lg" name="tabler:sun" :title="$t('switchToLightMode')" />
                        </span>
                    </div>
                </div>
            </label>
        </div>
    </ClientOnly>
</template>