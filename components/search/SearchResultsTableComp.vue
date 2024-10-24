<template>
  <EasyDataTable
    table-class-name="customize_table dark:bg-neutral-800"
    table-theme-color="#bada55"
    :headers="headers"
    :items="result"
    alternating
    buttons-pagination
  >
    <template
      #item-actions="{id}"
    >
      <div class="w-full h-full flex flex-row">
        <AddToComparisonComp
          :film-id="id.raw"
          :film-title="id.raw"
          btn-size="btn-sm"
        />
        <a
          target="_blank"
          :href="`/films/works/${id.raw}`"
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
const props = defineProps({
    'result': {
        type: Object,
        required: true
    }
});
import type { Header } from "vue3-easy-data-table";
/*
const headers: Header[] = [
    { text: "Title", value: "attributes.Title", sortable:true },
    { text: "RelatedIdentifier", value: "attributes.RelatedIdentifier", sortable:true },
    { text: "CountryOfReference", value: "attributes.CountryOfReference", sortable:true },
    { text: "CreatedAt", value: "attributes.createdAt", sortable:true },
    { text: "LastModified", value: "attributes.LastModified", sortable:true },
    { text: "Actions", value: "actions" }
];
*/
const headers: Header[] = [
    {text: 'Name', value: 'name.raw', sortable: true},
    { text: "Type", value: "type.raw", sortable:true },
    { text: "Race", value: "race.raw", sortable:true },
    { text: "Set", value: "set.raw", sortable:true },
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

<style>
html[data-theme="avefi_dark"] .customize_table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #445269;

  --easy-table-header-font-color: #c1cad4;
  --easy-table-header-background-color: #2d3a4f;

  --easy-table-body-even-row-font-color: #fff;
  --easy-table-body-even-row-background-color: #4c5d7a;

  --easy-table-body-row-font-color: #c0c7d2;
  --easy-table-body-row-background-color: #2d3a4f;

  --easy-table-body-row-hover-font-color: #2d3a4f;
  --easy-table-body-row-hover-background-color: #eee;

  --easy-table-footer-background-color: #2d3a4f;
  --easy-table-footer-font-color: #c0c7d2;

  --easy-table-rows-per-page-selector-width: 70px;
  --easy-table-rows-per-page-selector-option-padding: 10px;
  --easy-table-rows-per-page-selector-z-index: 1;

  --easy-table-scrollbar-track-color: #2d3a4f;
  --easy-table-scrollbar-color: #2d3a4f;
  --easy-table-scrollbar-thumb-color: #4c5d7a;;
  --easy-table-scrollbar-corner-color: #2d3a4f;

  --easy-table-loading-mask-background-color: #2d3a4f;
}
</style>
