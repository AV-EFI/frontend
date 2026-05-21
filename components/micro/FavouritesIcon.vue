<script setup lang="ts">
defineProps({
    alt: {
        type: String,
        default: 'Favourites',
    },
});
</script>

<template>
    <Icon
        :alt="alt"
        :aria-label="alt"
        name="tabler:heart"
    />
</template>
