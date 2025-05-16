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

          <!-- Your original FormKit button unchanged -->
          <FormKit
            type="submit"
            :label="$t('search')"
            :title="$t('search')"
            outer-class="!rounded-l-none !mb-0 !rounded-r-3xl !h-full flex items-center justify-start"
            inner-class="!rounded-l-3xl !h-full"
            input-class="!text-lg !h-14 btn-secondary !rounded-l-none !rounded-r-3xl flex items-center justify-center border-3 border-primary !my-auto"
            :disabled="searchTerm.trim().length === 0"
            @click="handleClick"
          />
        </div>

        <p
          v-if="showValidationWarning"
          class="slide-down text-center text-error-800 dark:text-error-200 bg-white dark:bg-slate-800 text-xs mt-2 p-2 rounded-lg"
        >
          {{ $t('enterSearchTermFirst') }}
        </p>
      </FormKit>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSearchParamsStore } from '../../stores/searchParams';

const searchTerm = ref('');
const showValidationWarning = ref(false);
const searchDataStore = useSearchParamsStore();

function redirectToSearchScreen() {
    navigateTo(
        '/' +
      useRuntimeConfig().public.SEARCH_URL +
      '/index?' +
      useRuntimeConfig().public.ELASTIC_INDEX +
      '[query]=' +
      encodeURIComponent(searchTerm.value)
    );
}

function handleClick(event: MouseEvent) {
    if (searchTerm.value.trim().length === 0) {
        event.preventDefault();
        showValidationWarning.value = true;

        setTimeout(() => {
            showValidationWarning.value = false;
        }, 2500);
    }
}
</script>

<style scoped>
.btn-secondary {
  height: 100%;
}
</style>
