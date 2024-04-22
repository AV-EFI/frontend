<template>
  <div
    v-for="item in searchResultsStore.searchResults?.data"
    :key="item.id"
    class="card border-2 border-transparent border-opacity-0 dark:border-opacity-100 dark:border-zinc-200 min-w-48 w-[calc(25%-1rem)] m-1 bg-white dark:bg-base-200 hover:shadow-xl hover:border-primary dark:hover:border-primary shadow-lg"
  >
    <div class="card-body">
      <h3 class="card-title">
        {{ item.attributes.Title }}
      </h3>
      <p>{{ item.attributes.RelatedIdentifier }}</p>
      <p>{{ item.attributes.CountryOfReference }}</p>
      <p>{{ item.attributes.createdAt }}</p>
      <p>{{ item.attributes.LastModified }}</p>
      <div class="card-actions justify-end">
        <AddToComparisonComp
          :film-id="item.id"
          :film-title="item.attributes.Title"
        />
        <a
          :href="`/films/works/${item.id}`"
          target="_blank"
          class="btn btn-primary"
        >
          Details  →
        </a>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const searchResultsStore = useSearchResultsStore();
const objectListStore = useObjectListStore();

const addToComparison = ((filmId:number, filmTitle?:string) => {
    objectListStore.addObject({ filmId: filmId, filmTitle: filmTitle? filmTitle:undefined });
    console.log(objectListStore.objects);
    objectListStore.toggleDrawerState();
});

</script>