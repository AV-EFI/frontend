<template>
  <div class="min-w-96 min-h-24">
    <FormKit
      id="searchComp"
      v-model="searchDataStore.formData"
      type="form"
      :actions="false"
      name="searchComp"
    >
      <FormKit 
        id="searchToggle"
        type="toggle"
        name="searchToggle"
        label="Erweiterte Suche"
        :delay="300"
      />
      <FormKit 
        v-if="!searchDataStore.formData.searchToggle"
        id="regularSearch"
        type="group"
        name="regularSearch"
        preserve="true"
      >
        <FormKit
          v-if="!searchDataStore.formData.searchToggle"
          type="AVefiAutocomplete"
          name="searchTerm"
          placeholder="Titelsuche"
        />
      </FormKit>
      <FormKit 
        v-if="searchDataStore.formData.searchToggle"
        type="group"
        name="extendedSearch"
        preserve="true"
      >
        <FormKit
          type="select"
          name="fieldOperator"
          :options="operatorTypeOptions"
        />
        <FormKit
          type="text"
          placeholder="Suchbegriff"
          name="searchTermExtended"
        />
        <FormKit 
          type="repeater"
          label="Bedingungen"
          min="1"
          max="2"
          name="operators"
          :remove-control="true"
          :insert-control="true"
          :up-control="false"
          :down-control="false"
          :add-button="false"
          :classes="{
            items: 'flex flex-row flex-wrap'
          }"
        >
          <div class="flex flex-row">
            <FormKit
              label="Verkn"
              name="booleanOperator"
              type="select"
              :options="[
                'and',
                'or',
                'not'
              ]"
            />
            <FormKit
              label="Feld"
              name="fieldOperator"
              type="select"
              :options="operatorTypeOptions"
            />
            <FormKit
              label="Wert"
              name="searchTerm"
              placeholder="Suchbegriff"
              type="text"
            />
          </div>
        </FormKit>
        <FormKit
          type="button"
          label="Suchen"
          title="Search"
          suffix-icon="search"
          class="btn-primary"
          @click="redirectToSearchScreen"
        />
      </FormKit>
    </FormKit>
    <div class="mt-5">
      <GlobalRawDataCollapse :api-data="searchDataStore.formData" />
    </div>
  </div>
</template>
<script setup lang="ts">
const searchDataStore = useSearchParamsStore();



//searchDataStore.$persist();

/*
const searchData = ref({
    searchToggle: false,
    searchTerm: null,
    hasEmail: false,
    regularSearch: {
        searchTerm: null
    },
    extendedSearch: {
        searchTerm: null,
        operators: [
        ]
    },
});
*/

function redirectToSearchScreen () {
    navigateTo('/search');
}

const operatorTypeOptions = ref(
    ['Title', 'Regie', 'Schlagwort']
);

</script>