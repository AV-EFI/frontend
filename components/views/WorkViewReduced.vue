<template>
  <div class="card shadow-lg">
    <div class="card-body">
      <div class="card-title">
        <h2
          class="text-lg font-normal mb-2 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
          :alt="data._source.title"
        >
          {{ data._source.title }}
        </h2>
      </div>      
      <div class="grid-container mb-2">
        <div class="grid md:grid-cols-12 gap-2 grid-flow-dense xs:auto-cols-min">
          <div class="md:col-span-12 col-span-12">
            <label class="text-md font-bold text-primary-900 dark:text-primary-100">PID:</label>
            <p
              class=" mb-2 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
              :alt="data._id"
            >
              {{ data._source.handle }}
            </p>
          </div>
        </div>
        <div class="grid md:grid-cols-12 gap-2 grid-flow-dense xs:auto-cols-min">
          <div class="md:col-span-8 col-span-12">
            <label class="text-md font-bold text-primary-900 dark:text-primary-100 capitalize">{{$t('country')}}:</label>
            <p class="text-lg mb-2 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full">
              {{ getProductionCountryFromWorkVariation(data?._source) }}
            </p>
          </div>
        </div>
        <div class="grid md:grid-cols-12 gap-2 grid-flow-dense xs:auto-cols-min">
          <div class="md:col-span-8 col-span-12">
            <label class="text-md font-bold text-primary-900 dark:text-primary-100 capitalize">{{$t('directors')}}:</label>
            <p class="text-lg mb-2 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full">
              {{ getAgentNameFromWorkVariation(data?._source, 'avefi:DirectingActivity') }}
            </p>
          </div>
        </div>
        <div class="grid md:grid-cols-12 gap-2 grid-flow-dense xs:auto-cols-min">
          <div class="md:col-span-8 col-span-12">
            <label class="text-md font-bold text-primary-900 dark:text-primary-100 capitalize">{{$t('year')}}:</label>
            <p
              class="text-lg mb-2 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
              :alt="data._source?.year"
            >
              {{ getProductionYearFromWorkVariation(data?._source) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  const dataJson = defineModel({type: String, required: true});
const data = JSON.parse(dataJson.value);
console.log(data);
console.log(getProductionCountryFromWorkVariation(data._source))
</script>
