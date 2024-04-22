<script setup lang="ts">
definePageMeta({
    //middleware: 'auth'
});

const objectListStore = useObjectListStore();
const navigateToComparison = () => {
    const objectIds: number[] = objectListStore.getObjectIds;
    if(objectIds.length == 2) {
        navigateTo(`/protected/compare?compare=[${objectIds[0]},${objectIds[1]}]`);
    }
};


</script>
<template>
  <div>
    <h1>Filmident Alternative Ansicht</h1>
    <btn
      class="btn btn-primary btn-ghost"
      @click="navigateToComparison"
    >
      Alternativ
    </btn>
    <GlobalCompareView2 :items="objectListStore.getObjectIds" />
  </div>
</template>