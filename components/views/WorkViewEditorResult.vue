<template>
  <FormKit
    v-model="dataJson"
    :classes="{form: 'bg-neutral-100 dark:bg-neutral-900 p-2 rounded-xl'}"
    type="form"
    :actions="false"
    @submit="customSubmitHandler"
  >
    <div class="col-span-full !h-12">
      <h2
        class="text-lg font-normal mb-2 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
      >
        Ergebnis
      </h2>
    </div>
    <div class="col-span-full">
      <FormKit
        type="text"
        name="title"
        label="Title:"
        validation="required"
      />
    </div>
    <div class="col-span-full">
      <FormKit
        type="text"
        name="pid"
        label="PID:"
        validation="required"
      />
    </div>
    <div class="col-span-full">
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">Andere IDs:</label>
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
    <div class="col-span-full">
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">Countries:</label>
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
    <div class="0 col-span-full">
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">Directors:</label>
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
    <div class="3 col-span-full">
      <FormKit
        type="text"
        name="year"
        label="Year:"
        validation="required"
      />
    </div>
    <div class="4 col-span-full">
      <FormKit
        type="text"
        name="productioncompany"
        label="Produktionsfirma:"
        validation="required"
        min="0"
      />
    </div>
    <div class="5 col-span-full">
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">Actors:</label>
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
    <div class="6 col-span-full">
      <label class="text-sm font-bold text-primary-900 dark:text-primary-100">Schlagwörter:</label>
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
    <div class="9 col-span-full">
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
    <div>
      <pre>{{ dataJson }}</pre>
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
