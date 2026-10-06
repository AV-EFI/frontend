<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { patchUserPreferences } from '~/utils/userPreferences';

type ThemeMode = 'avefi_light' | 'avefi_dark';

const theme = useCookie<ThemeMode>('avefi-color-mode', {
    default: () => 'avefi_light',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
});

const activeTheme = ref<ThemeMode>(theme.value);
const isLight = computed(() => activeTheme.value === 'avefi_light');

const readDocumentTheme = () => {
    const attribute = document.documentElement.getAttribute('data-theme');
    if (attribute === 'avefi_light' || attribute === 'avefi_dark') {
        activeTheme.value = attribute;
    }
};

let themeObserver: MutationObserver | null = null;

onMounted(() => {
    readDocumentTheme();
    themeObserver = new MutationObserver(readDocumentTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
});

onBeforeUnmount(() => {
    themeObserver?.disconnect();
    themeObserver = null;
});

const toggleTheme = () => {
    const nextTheme: ThemeMode = isLight.value ? 'avefi_dark' : 'avefi_light';
    activeTheme.value = nextTheme;
    theme.value = nextTheme;

    const root = document.documentElement;
    root.setAttribute('data-theme', nextTheme);
    root.classList.toggle('dark', nextTheme === 'avefi_dark');
    patchUserPreferences({ appearance: { theme: nextTheme } });
    localStorage.setItem('avefi-color-mode', nextTheme);
    document.cookie = `avefi-color-mode=${nextTheme}; path=/; max-age=31536000; SameSite=Lax`;
};
</script>

<template>
    <ClientOnly>
        <!-- The visible text names the action and the icon shows the mode it switches to. -->
        <button type="button" @click="toggleTheme">
            <Icon class="icon-action" :name="isLight ? 'tabler:moon' : 'tabler:sun'" aria-hidden="true" />
            <span>{{ isLight ? $t('switchToDarkMode') : $t('switchToLightMode') }}</span>
        </button>
    </ClientOnly>
</template>
