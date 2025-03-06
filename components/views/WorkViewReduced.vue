<template>
  <div class="row-span-1 flex flex-col items-start ml-0">
    <p class="text-primary-900 dark:text-primary-100 font-bold">
      {{ title }}
    </p>
    <h2
      class="font-normal dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
      :alt="data?._source?.has_record?.has_primary_title?.has_name"
    >
      {{ data?._source?.has_record?.has_primary_title?.has_name }}
    </h2>
  </div>      
  <div class="row-span-1 grid-container ">
    <div class="grid md:grid-cols-12 gap-2 grid-flow-dense xs:auto-cols-min grid-sub-container">
      <div class="md:col-span-12 col-span-12">
        <label class="font-bold text-primary-900 dark:text-primary-100">PID:</label>
        <p
          class="  dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
          :alt="data?._source?.handle"
        >
          {{ data?._source?.handle }}
        </p>
      </div>
    </div>
  </div>
  <div class="row-span-1 grid md:grid-cols-12 gap-2 grid-flow-dense xs:auto-cols-min grid-sub-container">
    <div class="md:col-span-12 col-span-12">
      <label class="font-bold text-primary-900 dark:text-primary-100 capitalize">{{ $t('country') }}:</label>
      <p class="dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full">
        {{ getProductionCountryFromWorkVariation(data?._source) }}
      </p>
    </div>
  </div>
  <div class="row-span-1 grid md:grid-cols-12 gap-2 grid-flow-dense xs:auto-cols-min grid-sub-container">
    <div class="md:col-span-12 col-span-12">
      <label class="font-bold text-primary-900 dark:text-primary-100 capitalize">{{ $t('directors') }}:</label>
      <p class="dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full">
        {{ getAgentNameFromWorkVariation(data?._source, 'avefi:DirectingActivity') }}
      </p>
    </div>
  </div>
  <div class="row-span-1 grid md:grid-cols-12 gap-2 grid-flow-dense xs:auto-cols-min grid-sub-container">
    <div class="md:col-span-8 col-span-12">
      <label class="font-bold text-primary-900 dark:text-primary-100 capitalize">{{ $t('year') }}:</label>
      <p
        class="dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        :alt="data?._source?.year"
      >
        {{ getProductionYearFromWorkVariation(data?._source) }}
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
const dataJson = defineModel({type: String, required: true});
const data = JSON.parse(dataJson.value);
const props = defineProps(
    {
        title: {
            type: String,
            required: true
        }
    }
);
</script>
