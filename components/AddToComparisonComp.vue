<template>
  <button
    class="btn bg-compare-list hover:bg-compare-list-dark text-white"
    :class="[btnSize]"
    :alt="$t('addtocomparisonparam', { name: filmTitle })"
    :title="$t('addtocomparisonparam', { name: filmTitle })"
    :data-id="filmId"
    :data-title="filmTitle"
    :aria-label="$t('addtocomparisonparam', { name: filmTitle })"
    @click="$addToComparison(props.filmId, props.filmTitle)"
  >
    <span class="hidden md:block">{{ $t('comparison') }}</span>
    <MicroCompareIcon
      :alt="$t('addtocomparisonparam', { name: filmTitle })"
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