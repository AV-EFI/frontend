<template>
  <div class="w-full min-w-48 lg:min-w-64 min-h-24 flex justify-center">
    <ClientOnly>
      <FormKit
        v-if="searchDataStore && searchDataStore.formData"
        id="searchComp"
        v-model="searchDataStore.formData"
        type="form"
        :actions="false"
        name="searchComp"
        @submit="redirectToSearchScreen"
      >
        <FormKit
          v-model="searchTerm"
          name="searchTerm"
          :placeholder="$t('searchterm')"
          type="text"
          prefix-icon="search"
          outer-class="w-full !ml-0 md:ml-2 !max-w-none md:w-96 xl:w-128"
          inner-class="!rounded-3xl"
          input-class="!text-lg p-2"
          autofocus
        />
        <FormKit
          type="submit"
          :label="$t('search')"
          :title="$t('search')"
          class="btn-secondary"
          @click="redirectToSearchScreen"
        />
      </Formkit>
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import  {useSearchParamsStore} from '../../stores/searchParams';
const searchTerm = ref('');
const searchDataStore = useSearchParamsStore();
function redirectToSearchScreen () {
    navigateTo('/search_altern/index?q=' + searchTerm.value);
}

</script>