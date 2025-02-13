<template>
  <div
    class="grid gap-1 row-span-full grid-rows-subgrid grid-cols-2 col-span-2"
  >
    <div class="col-span-full">
      <h2>{{ title }}</h2>
    </div>
    <div class="col-span-full">
      <button
        class="btn btn-primary btn-sm"
        @click="updateAllProperties"
      >
        {{ $t('updateallproperties') }}
        <Icon
          name="fa-solid:arrow-circle-right"
          class="text-white"
        />
      </button>
    </div>
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
        class="text-sm font-normal dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        :alt="data.has_record.has_primary_title.has_name"
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
    </div>
    <div class="col-span-full ">
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">
        {{ $t('countries') }}:
      </label>
      <ul>
        <li
          v-for="(countries_item, countries_index) in cont.fields?.countries"
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
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">
        {{ $t('directors') }}:
      </label>
      <ul>
        <li
          v-for="(directors_item, directors_index) in cont.fields?.directors"
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
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">
        {{ $t('productionyears') }}:
      </label>
      <ul>
        <li
          v-for="(years_item, years_index) in cont.fields?.productionyears"
          :key="years_index"
          class="text-sm dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        >
          <GlobalSendValueComp
            :target-property-value="years_item"
            target-property-name="productionyears"
            @update-target-model="onUpdateTargetModel"
          />
        </li>
      </ul>
    </div>
    <div class="col-span-full ">
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">
        {{ $t('producers') }}:
      </label>
      <ul v-if="cont.fields?.producers">
        <li
          v-for="(producers_item, producers_index) in cont.fields?.producers"
          :key="producers_index"
          class="text-sm dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        >
          <GlobalSendValueComp
            :target-property-value="producers_item"
            target-property-name="producers"
            @update-target-model="onUpdateTargetModel"
          />
        </li>
      </ul>
    </div>
    <div class="col-span-full ">
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">
        {{ $t('castmembers') }}:
      </label>
      <ul v-if="cont.fields?.castmembers">
        <li
          v-for="(actors_item, actors_index) in cont?.fields.castmembers"
          :key="actors_index"
          class="text-sm mb-1 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        >
          <GlobalSendValueComp
            :target-property-value="actors_item"
            target-property-name="castmembers"
            @update-target-model="onUpdateTargetModel"
          />
        </li>
      </ul>
    </div>
    <div class="col-span-full">
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">
        {{ $t('subjects') }}:
      </label>
      <ul>
        <li
          v-for="(subjects_item, subjects_index) in cont?.fields?.subjects"
          :key="subjects_index"
          class="text-sm mb-1 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        >
          <GlobalSendValueComp
            :target-property-value="subjects_item"
            target-property-name="subjects"
            @update-target-model="onUpdateTargetModel"
          />
        </li>
      </ul>
    </div>
    <div class="col-span-full hidden">
      <pre>{{ cont }}</pre>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { MovingImageRecordContainer } from 'models/interfaces/av_efi_schema';
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
});
const dataJson = defineModel({type: String, required: true});
const cont = JSON.parse(dataJson.value);
const data = cont._source as MovingImageRecordContainer;

function onUpdateTargetModel (targetPropertyValue:string, targetPropertyName:string) {
    console.log("onUpdateTargetModel");
    console.log(targetPropertyValue);
    console.log(targetPropertyName);
    emit("updateTargetModelGP", targetPropertyValue, targetPropertyName);
}
function updateAllProperties() {
    const properties = [
        { value: data.has_record.has_primary_title.has_name, name: 'title' },
        { value: data?.handle, name: 'pid' },
        ...(cont.fields?.countries || []).map((item) => ({ value: item, name: 'countries' })),
        ...(cont.fields?.directors || []).map((item) => ({ value: item, name: 'directors' })),
        ...(cont.fields?.productionyears || []).map((item) => ({ value: item, name: 'productionyears' })),
        ...(cont.fields?.producers || []).map((item) => ({ value: item, name: 'producers' })),
        ...(cont.fields?.castmembers || []).map((item) => ({ value: item, name: 'castmembers' })),
        ...(cont.fields?.subjects || []).map((item) => ({ value: item, name: 'subjects' })),
    ];

    properties.forEach((property) => {
        emit('updateTargetModelGP', property.value, property.name);
    });
}

//event chaining :(
const emit = defineEmits<{
  (e: 'updateTargetModelGP', targetPropertyValue:string, targetPropertyName:string)
}>();

</script>
