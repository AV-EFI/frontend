<template>
  <button
    class="btn btn-secondary"
    :class="[btnSize]"
    :alt="`Add ${filmTitle} to comp`"
    :data-id="filmId"
    :data-title="filmTitle"
    :title="`Add '${filmTitle}' to comparison`"
    @click="$addToComparison(filmId, filmTitle)"
  >
    <CompareIcon
      :alt="`Add ${filmTitle} to comp`"
    />
  </button>
</template>
<script setup lang="ts">

//const { $addToComparison } = useNuxtApp();


const props = defineProps({
    'filmId': {
        type: Number,
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
        default: 'btn-md'
    }
});

</script>