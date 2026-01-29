<template>
  <button class="btn btn-favourites-list" :class="[btnSize]"
    :alt="$t('addtoshoppingcartparam', { name: props.filmTitle })"
    :title="$t('addtoshoppingcartparam', { name: props.filmTitle })" :data-id="filmId" :data-title="filmTitle"
    :aria-label="$t('addtoshoppingcartparam', { name: props.filmTitle })"
    @click="$addToComparison(props.filmId, props.filmTitle, 'shoppingcart')">
    <MicroShoppingCartIcon :alt="$t('addtoshoppingcartparam', { name: filmTitle })" class="text-xl w-4 h-4" />
    <span class="hidden md:inline-block w-24 ml-1 text-left">{{ $t('shoppingcart') }}</span>
  </button>
</template>
<script setup lang="ts">
const { $addToComparison } = useNuxtApp();
const props = defineProps({
    'filmId': {
        type: String,
        required:true
    },
    'filmTitle': {
        type: String,
        required:false,
        default: "No title"
    },
    'btnSize': {
        type: String,
        required: false,
        default: 'btn-sm'
    }
});

console.log('AddToShoppingCartComp props:', props);

</script>