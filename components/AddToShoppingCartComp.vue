<template>
  <button
    class="btn bg-shopping-cart hover:bg-shopping-cart-dark text-white"
    :class="[btnSize]"
    :alt="$t('addtoshoppingcartparam', { name: props.filmTitle })"
    :title="$t('addtoshoppingcartparam', { name: props.filmTitle })"
    :data-id="filmId"
    :data-title="filmTitle"
    @click="$addToComparison(props.filmId, props.filmTitle, 'shoppingcart')"
  >
    <span class="hidden md:block">{{ $t('shoppingcart') }}</span>
    <MicroShoppingCartIcon
      :alt="$t('addtocomparisonparam', { name: filmTitle })"
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