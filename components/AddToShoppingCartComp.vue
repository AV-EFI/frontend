<template>
  <button
    class="btn bg-favourites-list hover:bg-favourites-list-dark text-white"
    :class="[btnSize]"
    :alt="$t('addtoshoppingcartparam', { name: props.filmTitle })"
    :title="$t('addtoshoppingcartparam', { name: props.filmTitle })"
    :data-id="filmId"
    :data-title="filmTitle"
    :aria-label="$t('addtoshoppingcartparam', { name: props.filmTitle })"
    @click="$addToComparison(props.filmId, props.filmTitle, 'shoppingcart')"
  >
    <span class="hidden md:block">{{ $t('shoppingcart') }}</span>
    <MicroShoppingCartIcon
      :alt="$t('addtoshoppingcartparam', { name: filmTitle })"
      class="text-xl"
    />
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

</script>