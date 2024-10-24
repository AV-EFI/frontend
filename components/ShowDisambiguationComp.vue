<template>
  <button
    class="btn btn-secondary"
    :class="[btnSize]"
    :alt="$t('gotodisamiguationparam', { name: filmId_prev })"
    :title="$t('gotodisamiguationparam', { name: filmId_prev })"
    :data-id="filmId_prev"
    :data-title="filmId_prev"
    @click="navigateToDisambiguation"
  >
    <DisambiguationIcon
      :alt="$t('gotodisamiguationparam', { name: filmId_prev })"
    />
  </button>
</template>
<script setup lang="ts">

async function navigateToDisambiguation() {
    return navigateTo(`/protected/disambiguation?prev=${props.filmId_prev}&next=${props.filmId_next}`);
}

const props = defineProps({
    'filmId_prev': {
        type: String,
        required:true
    },
    'filmId_next': {
        type: String,
        required:true,
    },
    'btnSize': {
        type: String,
        required: false,
        default: 'btn-sm'
    }
});

</script>