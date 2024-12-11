<template>
  <div
    class="grid gap-1 row-span-full grid-rows-subgrid grid-cols-2 col-span-2"
  >
    <div class="col-span-full ">
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">Title:</label>
      <p
        class="text-sm font-normal dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        :alt="data.has_record.has_primary_title.has_name"
      >
        <GlobalSendValueComp
          :target-property-value="data.has_record.has_primary_title.has_name"
          target-property-name="title"
          @update-target-model="onUpdateTargetModel"
        />
      </p>
    </div>
    <div class="col-span-full ">
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">EFI:</label>
      <p
        class="text-sm dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        :alt="data.handle"
      >
        <GlobalSendValueComp
          :target-property-value="data?.handle"
          target-property-name="pid"
          @update-target-model="onUpdateTargetModel"
        />
      </p>
    </div>
    <div class="col-span-full ">
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">Andere IDs:</label>
      <p
        class="text-sm dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
      />
    </div>
    <div class="col-span-full ">
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">Countries:</label>
      <ul>
        <li
          v-for="(countries_item, countries_index) in data.countries"
          :key="countries_index"
          class="text-sm dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        >
          <GlobalSendValueComp
            :target-property-value="countries_item"
            target-property-name="countries"
            @update-target-model="onUpdateTargetModel"
          />
        </li>
      </ul>
    </div>
    <div class="col-span-full ">
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">Directors:</label>
      <ul>
        <li
          v-for="(directors_item, directors_index) in data.directors"
          :key="directors_index"
          class="text-sm dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        >
          <GlobalSendValueComp
            :target-property-value="directors_item"
            target-property-name="directors"
            @update-target-model="onUpdateTargetModel"
          />
        </li>
      </ul>
    </div>
    <div class="col-span-full ">
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">Year:</label>
      <p
        class="text-sm dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        :alt="data?.productionyears"
      >
        <GlobalSendValueComp
          :target-property-value="data?.productionyears"
          target-property-name="year"
          @update-target-model="onUpdateTargetModel"
        />
      </p>
    </div>
    <div class="col-span-full ">
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">Produktionsfirma:</label>
      <p
        class="text-sm dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
      />
    </div>
    <div class="col-span-full ">
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">Actors:</label>
      <ul>
        <li
          v-for="(actors_item, actors_index) in disam_getCastMembers(data, 'avefi:CastActivity')"
          :key="actors_index"
          class="text-sm mb-1 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        >
          <GlobalSendValueComp
            :target-property-value="actors_item.has_name"
            target-property-name="actors"
            @update-target-model="onUpdateTargetModel"
          />
        </li>
      </ul>
    </div>
    <div class="col-span-full 0">
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">
        Schlagwörter:
      </label>
      <p
        class="text-sm dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
      />
    </div>
    <div class="col-span-full ">
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { MovingImageRecordContainer } from 'models/interfaces/av_efi_schema';

const dataJson = defineModel({type: String, required: true});
const cont = JSON.parse(dataJson.value);
console.log(cont);
const data = cont._source as MovingImageRecordContainer;

function onUpdateTargetModel (targetPropertyValue:string, targetPropertyName:string) {
    console.log("onUpdateTargetModel");
    console.log(targetPropertyValue);
    console.log(targetPropertyName);
    emit("updateTargetModelGP", targetPropertyValue, targetPropertyName);
}

//event chaining :(
const emit = defineEmits<{
  (e: 'updateTargetModelGP', targetPropertyValue:string, targetPropertyName:string)
}>();

</script>
