<template>
    <button class="btn btn-favourites-list" :class="[btnSize]"
            :alt="$t('addtofavouritesparam', { name: props.filmTitle })"
            :title="$t('addtofavouritesparam', { name: props.filmTitle })" :data-id="filmId" :data-title="filmTitle"
            :aria-label="$t('addtofavouritesparam', { name: props.filmTitle })"
            @click="$addToComparison(props.filmId, props.filmTitle, 'favourites')">
        <MicroFavouritesIcon :alt="$t('addtofavouritesparam', { name: filmTitle })" class="text-xl w-4 h-4" />
        <span class="hidden md:inline-block w-24 ml-1 text-left">{{ $t('favourites') }}</span>
    </button>
</template>
<script setup lang="ts">
const { $addToComparison } = useNuxtApp();
const props = defineProps({
    'filmId': {
        type: String,
        required: true
    },
    'filmTitle': {
        type: String,
        required: false
    },
    'btnSize': {
        type: String,
        required: false,
        default: ''
    }
});
</script>
