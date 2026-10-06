<template>
    <GlobalHeaderMenu
        v-model:open="open"
        icon="tabler:settings"
        :label="$t('navSettings')"
        :panel-label="$t('settingsMenuPanel')"
        panel-class="w-72"
        :inline="inline"
    >
        <ClientOnly>
            <li>
                <Suspense>
                    <GlobalThemeSwitch />
                </Suspense>
            </li>
            <li>
                <Suspense>
                    <GlobalLanguageSwitch />
                </Suspense>
            </li>
        </ClientOnly>
    </GlobalHeaderMenu>
</template>

<script lang="ts" setup>
defineProps<{ inline?: boolean }>();
const open = defineModel<boolean>('open', { default: false });
</script>
