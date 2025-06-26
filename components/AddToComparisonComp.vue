<template>
  <button
    class="btn btn-compare-list btn-block"
    :class="[btnSize]"
    :alt="$t('addtocomparisonparam', { name: filmTitle })"
    :title="$t('addtocomparisonparam', { name: filmTitle })"
    :data-id="filmId"
    :data-title="filmTitle"
    :aria-label="$t('addtocomparisonparam', { name: filmTitle })"
    @click="$addToComparison(props.filmId, props.filmTitle)"
  >
    <MicroCompareIcon
      :alt="$t('addtocomparisonparam', { name: filmTitle })"
      class="text-xl w-4 h-4"
    />
    <span class="hidden md:inline-block w-24 ml-1 text-left">{{ $t('comparison') }}</span>
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