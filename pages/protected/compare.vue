<script setup lang="ts">
definePageMeta({
    //middleware: 'auth'
});
const route = useRoute();
const items = new Array();
items[0] = route.query.prev;
items[1] = route.query.next;


</script>
<template>
  <div>
    <div class="container">
      <div class="breadcrumbs text-sm">
        <ul>
          <li><a href="/">Home</a></li>
          <li>
            <span class="text-accent">
              {{ $t('filmidentification') }}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="container">
      <div v-if="items">
        <GlobalCompareViewRaw :items="items" />
      </div>
      <div v-else>
        no data to compare
      </div>
    </div>
  </div>
</template>