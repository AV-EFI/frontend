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
          <div class="md:col-span-8 col-span-12">
            <label class="text-md font-bold text-primary-900 dark:text-primary-100">PID:</label>
            <p
              class="text-lg mb-2 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
              :alt="data._id"
            >
              21.T11998/{{ data._id }}
            </p>
          </div>
        </div>
        <div class="grid md:grid-cols-12 gap-2 grid-flow-dense xs:auto-cols-min">
          <div class="md:col-span-8 col-span-12">
            <label class="text-md font-bold text-primary-900 dark:text-primary-100">Countries:</label>
            <p class="text-lg mb-2 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full">
              {{ data._source.countries.join(', ') }}
            </p>
          </div>
        </div>
        <div class="grid md:grid-cols-12 gap-2 grid-flow-dense xs:auto-cols-min">
          <div class="md:col-span-8 col-span-12">
            <label class="text-md font-bold text-primary-900 dark:text-primary-100">Directors:</label>
            <p class="text-lg mb-2 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full">
              {{ data._source.directors.join(', ') }}
            </p>
          </div>
        </div>
        <div class="grid md:grid-cols-12 gap-2 grid-flow-dense xs:auto-cols-min">
          <div class="md:col-span-8 col-span-12">
            <label class="text-md font-bold text-primary-900 dark:text-primary-100">Year:</label>
            <p
              class="text-lg mb-2 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
              :alt="data._source.year"
            >
              {{ data._source.year }}
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
</script>
