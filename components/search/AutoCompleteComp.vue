<template>
  <div ref="autocompleteContainer" />
</template>

<script lang="jsx">
import { createWidgetMixin } from 'vue-instantsearch/vue3/es';
import { connectSearchBox } from 'instantsearch.js/es/connectors';

export default {
    mixins: [createWidgetMixin({ connector: connectSearchBox })],
};
</script>