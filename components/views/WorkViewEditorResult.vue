<template>
  <div>
    <FormKit
      id="work-view-editor-result"
      v-model="dataJson"
      :classes="{form: 'bg-neutral-100 dark:bg-neutral-900 p-2 rounded-xl'}"
      type="form"
      :actions="false"
      @submit="customSubmitHandler"
    >
      <div class="col-span-full !h-16 flex flex-row justify-between items-center">
        <h2
          class="text-lg font-normal mb-2 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        >
          {{ $t('Result') }}
        </h2>
      </div>
      <div class="col-span-full">
        <button
          class="btn btn-warning text-white btn-sm mb-2"
          @click="customReset()"
        >
          {{ $t('resetFormData') }}
          <Icon name="formkit:close" />
        </button>
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
          label="EFI:"
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
            help="Leave blank for automatic GND"
          />
        </FormKit>
      </div>
      <div class="0 col-span-full">
        <label class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ $t('directors') }}:</label>
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
            help="Leave blank for automatic GND"
          />
        </FormKit>
      </div>
      <div class="3 col-span-full">
        <label class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ $t('productionyears') }}:</label>
        <FormKit
          type="repeater"
          name="productionyears"
          min="0"
        >
          <FormKit
            type="text"
            name="name"
            label="productionyears"
            validation="required"
          />
        </FormKit>
      </div>
      <div class="4 col-span-full">
        <label class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ $t('producers') }}:</label>
        <FormKit
          type="repeater"
          name="producers"
          min="0"
        >
          <FormKit
            type="text"
            name="name"
            label="Producers"
            validation="required"
          />
          <FormKit
            type="text"
            name="gnd"
            label="Producers GND"
            help="Leave blank for automatic GND"
          />
        </FormKit>
      </div>
      <div class="5 col-span-full">
        <label class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ $t('castmembers') }}:</label>
        <FormKit
          type="repeater"
          name="castmembers"
          min="0"
        >
          <FormKit
            type="text"
            name="name"
            label="castmembers"
            validation="required"
          />
          <FormKit
            type="text"
            name="gnd"
            label="castmembers GND"
            help="Leave blank for automatic GND"
          />
        </FormKit>
      </div>
      <div class="6 col-span-full">
        <label class="text-sm font-bold text-primary-900 dark:text-primary-100">Schlagwörter:</label>
        <FormKit
          type="repeater"
          name="subjects"
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
            help="Leave blank for automatic GND"
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
  </div>
</template>
<script setup lang="ts">
const initialState = {
    title: "",
    pid: "",
    other_ids: [],
    countries: [],
    directors: [],
    castmembers: [],
    producers: [],
    productionyears: [],
    subjects: []
};
import { toast } from "vue3-toastify";
const dataJson = defineModel({type: Object, required: true});

function customReset () {
    //deep copy of initialState
    dataJson.value = JSON.parse(JSON.stringify(initialState));
    console.log(dataJson.value);
    console.log(initialState);
}

function customSubmitHandler (e) 
{
    console.log(e);
    toast.success("Form submitted");
} 

</script>
