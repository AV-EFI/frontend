<template>
    <button
        class="btn min-h-6 h-auto home-mail-button"
        :title="$t('openForm')"
        :aria-label="$t('openForm')"
        @click="toggleContactDrawer"
    >
        <Icon class="w-4 h-4 shrink-0" name="tabler:send" />
    </button>
</template>

<script setup lang="ts">
const toggleContactDrawer = () => {
    window.dispatchEvent(new Event('toggle-contact-drawer'));
};
</script>

<style scoped>
</style>