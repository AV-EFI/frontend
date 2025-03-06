<template>
  <div class="w-full min-w-48 lg:min-w-64 min-h-24 flex justify-center mx-auto">
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
        <div class="flex w-full mx-auto !max-w-none lg:w-96 xl:w-128 justify-center">
          <FormKit
            v-model="searchTerm"
            name="searchTerm"
            :placeholder="$t('searchplaceholder')"
            type="text"
            prefix-icon="search"
            outer-class="flex-grow !max-w-none w-full"
            inner-class="!rounded-l-3xl rounded-r-none dark:!bg-slate-950 dark:!text-white  !h-[56px] w-full"
            input-class="!text-lg p-2 w-full dark:!text-white"
            autofocus
          />
          <FormKit
            type="submit"
            :label="$t('search')"
            :title="$t('search')"
            outer-class="!rounded-l-none !mb-0 !rounded-r-3xl !h-full flex items-center justify-start"
            inner-class="!rounded-l-3xl !h-full"
            input-class="!text-lg !h-14 btn-secondary !rounded-l-none !rounded-r-3xl flex items-center justify-center border-3 border-primary !my-auto"
            @click="redirectToSearchScreen"
          />
        </div>
      </FormKit>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useSearchParamsStore } from '../../stores/searchParams';
const searchTerm = ref('');
const searchDataStore = useSearchParamsStore();
function redirectToSearchScreen() {
    navigateTo('/' + useRuntimeConfig().public.SEARCH_URL + '/index?' + useRuntimeConfig().public.ELASTIC_INDEX + '[query]=' + searchTerm.value);
}
</script>

<style scoped>
.btn-secondary {
  height: 100%;
}
</style>