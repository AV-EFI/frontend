<template>
    <button
        class="min-h-6 h-auto"
        :title="$t('openForm')"
        :aria-label="$t('openForm')"
        @click="toggleContactDrawer"
    >
        <Icon class="icon-action" name="tabler:send" />
    </button>
</template>

<script setup lang="ts">
const toggleContactDrawer = () => {
    window.dispatchEvent(new Event('toggle-contact-drawer'));
};
</script>

<style scoped>
</style>