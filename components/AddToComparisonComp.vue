<template>
  <button
    class="btn btn-secondary"
    :class="[btnSize]"
    :alt="$t('addtocomparisonparam', { name: filmTitle })"
    :title="$t('addtocomparisonparam', { name: filmTitle })"
    :data-id="filmId"
    :data-title="filmTitle"
    @click="$addToComparison(props.filmId, props.filmTitle)"
  >
    <CompareIcon
      :alt="$t('addtocomparisonparam', { name: filmTitle })"
    />
  </button>
</template>
<script setup lang="ts">

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