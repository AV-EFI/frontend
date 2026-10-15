<template>
    <div class="explorer-layout">
        <a
            :id="skipLinkId"
            href="#main-content"
            class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-40 btn btn-sm btn-primary"
        >
            {{ $t('skipToContent') }}
        </a>
        <slot />
    </div>
</template>

<script setup lang="ts">
import { SKIP_LINK_ID } from '~/utils/autoFocusGuard';

const skipLinkId = SKIP_LINK_ID;
</script>

<style scoped>
/* Full screen: the explorer brings its own navigation, so the site header and footer are left out. */
.explorer-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100dvh;
}

/* app.vue wraps every page in a padded, bordered column. The explorer uses the whole screen instead. */
.explorer-layout > :deep(div.grow) {
    flex: 1 1 auto;
    width: 100%;
    max-width: none;
    min-height: 0;
    padding: 0;
    margin: 0;
    border: 0;
}

@media (max-width: 760px) {
    .explorer-layout {
        height: auto;
        min-height: 100dvh;
    }
}
</style>
