<template>
  <EasyDataTable
    table-class-name="customize_table dark:bg-neutral-800"
    table-theme-color="#bada55"
    :headers="headers"
    :items="searchResultsStore.searchResults?.data"
    alternating
    buttons-pagination
  >
    <template
      #item-actions="{id, attributes}"
    >
      <div class="w-full h-full flex flex-row">
        <AddToComparisonComp
          :film-id="id"
          :film-title="attributes.Title"
          btn-size="btn-sm"
        />
        <a
          target="_blank"
          :href="`/films/works/${id}`"
          class="btn btn-primary btn-sm"
        >Details →</a>
      </div>
    </template>
    <template #empty-message>
      <span>nothing here</span>
    </template>
  </EasyDataTable>
</template>
<script setup lang="ts">
const searchResultsStore = useSearchResultsStore();

import type { Header } from "vue3-easy-data-table";

const headers: Header[] = [
    { text: "Title", value: "attributes.Title", sortable:true },
    { text: "RelatedIdentifier", value: "attributes.RelatedIdentifier", sortable:true },
    { text: "CountryOfReference", value: "attributes.CountryOfReference", sortable:true },
    { text: "CreatedAt", value: "attributes.createdAt", sortable:true },
    { text: "LastModified", value: "attributes.LastModified", sortable:true },
    { text: "Actions", value: "actions" }
];


/**
 * Sample response:
 * "id": 1,
            "attributes": {
                "Title": "Test Work Title",
                "createdAt": "2024-02-20T15:24:57.333Z",
                "updatedAt": "2024-03-21T16:43:27.663Z",
                "publishedAt": "2024-02-20T16:04:33.002Z",
                "locale": "de",
                "CountryOfReference": "DE",
                "RelatedIdentifier": "Test Related Identifier",
                "LastModified": "2024-02-21T00:00:00.000Z"
            }
 * 
 */

</script>