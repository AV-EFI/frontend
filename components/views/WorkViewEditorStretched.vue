<template>
  <div
    class="grid gap-2 row-span-full grid-cols-2 grid-rows-subgrid col-span-2 auto-rows-auto"
  >
    <div class="col-span-full row-span-1 row-start-1 !h-12" />
    <div class="col-span-full row-span-1 row-start-2">
      <label class="text-md font-bold text-primary-900 dark:text-primary-100">Title:</label>
      <p
        class="text-lg font-normal dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        :alt="data._source.title"
      >
        <GlobalSendValueComp
          :target-property-value="data._source.title"
          target-property-name="title"
          @update-target-model="onUpdateTargetModel"
        />
      </p>
    </div>
    <div class="col-span-full row-span-1 row-start-3">
      <label class="text-md font-bold text-primary-900 dark:text-primary-100">PID:</label>
      <p
        class="text-lg dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        :alt="data._id"
      >
        <GlobalSendValueComp
          :target-property-value="data._id"
          target-property-name="pid"
          @update-target-model="onUpdateTargetModel"
        />
      </p>
    </div>
    <div class="col-span-full row-span-1 row-start-4">
      <label class="text-md font-bold text-primary-900 dark:text-primary-100">Andere IDs:</label>
      <p
        class="text-lg dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
      >
      &nbsp;
      </p>
    </div>
    <div class="col-span-full row-span-1 row-start-5">
      <label class="text-md font-bold text-primary-900 dark:text-primary-100">Countries:</label>
      <ul>
        <li
          v-for="(countries_item, countries_index) in data._source.countries"
          :key="countries_index"
          class="text-lg dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        >
          <GlobalSendValueComp
            :target-property-value="countries_item"
            target-property-name="countries"
            @update-target-model="onUpdateTargetModel"
          />
        </li>
      </ul>
    </div>
    <div class="col-span-full row-span-1 row-start-6">
      <label class="text-md font-bold text-primary-900 dark:text-primary-100">Directors:</label>
      <ul>
        <li
          v-for="(directors_item, directors_index) in data._source.directors"
          :key="directors_index"
          class="text-lg dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        >
          <GlobalSendValueComp
            :target-property-value="directors_item"
            target-property-name="directors"
            @update-target-model="onUpdateTargetModel"
          />
        </li>
      </ul>
    </div>
    <div class="col-span-full row-span-1 row-start-7">
      <label class="text-md font-bold text-primary-900 dark:text-primary-100">Year:</label>
      <p
        class="text-lg dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        :alt="data._source.year"
      >
        <GlobalSendValueComp
          :target-property-value="data._source.year"
          target-property-name="year"
          @update-target-model="onUpdateTargetModel"
        />
      </p>
    </div>
    <div class="col-span-full row-span-1 row-start-8">
      <label class="text-md font-bold text-primary-900 dark:text-primary-100">Produktionsfirma:</label>
      <p
        class="text-lg dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
      >
      &nbsp;
      </p>
    </div>
    <div class="col-span-full row-span-1 row-start-9">
      <label class="text-md font-bold text-primary-900 dark:text-primary-100">Actors:</label>
      <ul>
        <li
          v-for="(actors_item, actors_index) in data._source.actors"
          :key="actors_index"
          class="text-lg mb-1 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        >
          <GlobalSendValueComp
            :target-property-value="actors_item"
            target-property-name="actors"
            @update-target-model="onUpdateTargetModel"
          />
        </li>
      </ul>
    </div>
    <div class="col-span-full row-span-1 row-start-10">
      <label class="text-md font-bold text-primary-900 dark:text-primary-100">Schlagwörter:</label>
      <p
        class="text-lg dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
      >
      &nbsp;
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
const dataJson = defineModel({type: String, required: true});
const data = JSON.parse(dataJson.value);

function onUpdateTargetModel (targetPropertyValue:string, targetPropertyName:string) {
    emit("updateTargetModelGP", targetPropertyValue, targetPropertyName);
}

//event chaining :(
const emit = defineEmits<{
  (e: 'updateTargetModelGP', targetPropertyValue:string, targetPropertyName:string)
}>();


</script>
