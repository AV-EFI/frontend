<template>
  <FormKit
    v-model="dataJson"
    :classes="{form: 'grid gap-1 bg-neutral-100 dark:bg-neutral-900 p-2 rounded-xl grid-cols-2 col-span-3 xl:col-span-4 grid-rows-subgrid row-span-full auto-rows-auto'}"
    type="form"
    :actions="false"
    @submit="customSubmitHandler"
  >
    <div class="row-start-1 col-span-full !h-12">
      <h2
        class="text-lg font-normal mb-2 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
      >
        Ergebnis
      </h2>
    </div>
    <div class="row-start-2 col-span-full snap-start">
      <FormKit
        type="text"
        name="title"
        label="Title:"
        validation="required"
        :classes="{
          label: '$reset text-md font-bold text-primary-900 dark:text-primary-100'
        }"
      />
    </div>
    <div class="row-start-3 col-span-full snap-start">
      <FormKit
        type="text"
        name="pid"
        label="PID:"
        :classes="{
          label: '$reset text-md font-bold text-primary-900 dark:text-primary-100'
        }"
        validation="required"
      />
    </div>
    <div class="row-start-4 col-span-full snap-start">
      <label class="$text-md font-bold text-primary-900 dark:text-primary-100">Andere IDs:</label>
      <FormKit
        type="repeater"
        name="other_ids"
        min="0"
      >
        <FormKit
          type="text"
          name="id"
          label="ID:"
          validation="required"
        />
        <FormKit
          type="text"
          name="type"
          label="Type:"
          validation="required"
        />
      </FormKit>
    </div>
    <div class="row-start-5 col-span-full">
      <label class="text-md font-bold text-primary-900 dark:text-primary-100">Countries:</label>
      <FormKit
        type="repeater"
        name="countries"
        min="0"
      >
        <FormKit
          type="text"
          name="name"
          label="Country Name"
          validation="required"
        />
        <FormKit
          type="text"
          name="gnd"
          label="Country GND"
          validation="required"
        />
      </FormKit>
    </div>
    <div class="row-start-6 col-span-full">
      <label class="text-md font-bold text-primary-900 dark:text-primary-100">Directors:</label>
      <FormKit
        type="repeater"
        name="directors"
        min="0"
      >
        <FormKit
          type="text"
          name="name"
          label="Directors"
          validation="required"
        />
        <FormKit
          type="text"
          name="gnd"
          label="Directors GND"
          validation="required"
        />
      </FormKit>
    </div>
    <div class="row-start-7 col-span-full">
      <FormKit
        type="text"
        name="year"
        label="Year:"
        validation="required"
        :classes="{
          label: '$reset text-md font-bold text-primary-900 dark:text-primary-100'
        }"
      />
    </div>
    <div class="row-start-8 col-span-full">
      <FormKit
        type="text"
        name="productioncompany"
        label="Produktionsfirma:"
        validation="required"
        :classes="{
          label: '$reset text-md font-bold text-primary-900 dark:text-primary-100'
        }"
      />
    </div>
    <div class="row-start-9 col-span-full">
      <label class="text-md font-bold text-primary-900 dark:text-primary-100">Actors:</label>
      <FormKit
        type="repeater"
        name="actors"
        min="0"
      >
        <FormKit
          type="text"
          name="name"
          label="Actors"
          validation="required"
        />
        <FormKit
          type="text"
          name="gnd"
          label="Actors GND"
          validation="required"
        />
      </FormKit>
    </div>
    <div class="row-start-10 col-span-full">
      <label class="text-md font-bold text-primary-900 dark:text-primary-100">Schlagwörter:</label>
      <FormKit
        type="repeater"
        name="keywords"
        min="0"
      >
        <FormKit
          type="text"
          name="name"
          label="Schlagwort Name"
          validation="required"
        />
        <FormKit
          type="text"
          name="gnd"
          label="Schlagwort GND"
          validation=""
        />
      </FormKit>
    </div>
    <div class="row-start-11 col-span-full">
      <FormKit
        type="submit"
        label="Merge"
        :disabled="false"
        suffix-icon="group"
        :classes="{
          outer: '!w-full max-w-[600px]',
          input: 'w-full text-center justify-center'
        }"
      />
    </div>
  </FormKit>
</template>
<script setup lang="ts">
import { toast } from "vue3-toastify";

const dataJson = defineModel({type: Object, required: true});

function customSubmitHandler () {
    toast.success("Form submitted");
} 

</script>