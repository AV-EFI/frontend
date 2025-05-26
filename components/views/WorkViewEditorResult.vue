<template>
  <div>
    <div class="p-2 w-full flex flex-row justify-between">
      <button 
        class="btn btn-ghost btn-sm w-16"
        :title="$t('info')"
        @click="showInfo = !showInfo"
      >
        <Icon
          name="material-symbols:info-outline"
          class="text-lg"
        />
      </button>
      <p
        v-if="showInfo"
        class="flex-grow"
      >
        {{ $t('mergeResultHelpText') }}
      </p>
    </div>
    <FormKit
      id="work-view-editor-result"
      v-model="dataJson"
      :classes="{form: 'bg-neutral-100 dark:bg-slate-900 p-2 rounded-xl'}"
      type="form"
      :actions="false"
      @submit="customSubmitHandler"
    >
      <div class="col-span-full !h-16 flex flex-row justify-between items-center">
        <h2
          class="text-lg font-normal mb-2 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
        >
          {{ $t('result') }}
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
          name="efi"
          label="efi:"
          validation="required"
        />
      </div>
      <div class="col-span-full">
        <FormKit
          type="text"
          name="title"
          :label="`${$t('title')}`"
          validation="required"
        />
      </div>
      <div class="col-span-full">
        <FormKit
          type="text"
          name="alternative_title"
          :label="`${$t('AlternativeTitle')}`"
          validation="required"
        />
      </div>

      <div class="col-span-full">
        <label class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ $t('location') }}:</label>
        <FormKit
          type="repeater"
          name="location"
          min="0"
        >
          <FormKit
            type="text"
            name="name"
            :label="$t('location')"
            validation="required"
          />
          <FormKit
            type="text"
            name="same_as_id"
            :label="`${$t('location')} ID Extern`"
          />
        </FormKit>
      </div>
      <div class="3 col-span-full">
        <label class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ $t('productionyears') }}:</label>
        <FormKit
          type="repeater"
          name="productionyear"
          min="0"
        >
          <FormKit
            type="text"
            name="name"
            :label="`${$t('productionyear')}`"
            validation="required"
          />
        </FormKit>
      </div>
      <div class="0 col-span-full">
        <label class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ $t('directors') }}:</label>
        <FormKit
          type="repeater"
          name="director"
          min="0"
        >
          <FormKit
            type="text"
            name="name"
            :label="`${$t('Director')} Name`"
            validation="required"
          />
          <FormKit
            type="text"
            name="same_as_id"
            :label="`${$t('Director')} ID Extern`"
          />
        </FormKit>
      </div>
      <div class="4 col-span-full">
        <label class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ $t('producers') }}:</label>
        <FormKit
          type="repeater"
          name="producer"
          min="0"
        >
          <FormKit
            type="text"
            name="name"
            :label="`${$t('production')} Name`"
            validation="required"
          />
          <FormKit
            type="text"
            name="same_as_id"
            :label="`${$t('production')} ID Extern`"
          />
        </FormKit>
      </div>
      <div class="5 col-span-full">
        <label class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ $t('castmembers') }}:</label>
        <FormKit
          type="repeater"
          name="castmember"
          min="0"
        >
          <FormKit
            type="text"
            name="name"
            :label="`${$t('castmembers')} Name`"
            validation="required"
          />
          <FormKit
            type="text"
            name="same_as_id"
            :label="`${$t('castmembers')} ID Extern`"
          />
        </FormKit>
      </div>
      <div class="6 col-span-full">
        <label class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ $t('Genre') }}:</label>
        <FormKit
          type="repeater"
          name="genre"
          min="0"
        >
          <FormKit
            type="text"
            name="name"
            :label="`${$t('Genre')} Name`"
            validation="required"
          />
          <FormKit
            type="text"
            name="same_as_id"
            :label="`${$t('Genre')} ID Extern`"
          />
        </FormKit>
      </div>
      <div class="6 col-span-full">
        <label class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ $t('subject') }}:</label>
        <FormKit
          type="repeater"
          name="subject"
          min="0"
        >
          <FormKit
            type="text"
            name="name"
            :label="`${$t('subject')} Name`"
            validation="required"
          />
          <FormKit
            type="text"
            name="same_as_id"
            :label="`${$t('subject')} ID Extern`"
          />
        </FormKit>
      </div>
      <div class="col-span-full">
        <label class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ $t('other_ids') }}:</label>
        <FormKit
          type="repeater"
          name="other_id"
          min="0"
        >
          <FormKit
            type="text"
            name="name"
            :label="`${$t('other_ids')} ID`"
            validation="required"
          />
          <FormKit
            type="text"
            name="type"
            :label="`${$t('other_ids')} Type`"
            validation="required"
          />
        </FormKit>
      </div>
      <div class="col-span-full">
        <FormKit
          type="text"
          name="last_edit"
          :readonly="true"
          value="Deutsche Kinemathek - Museum für Film und Fernsehen"
          :label="$t('lastedit')"
          validation="required"
        />
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
      <div class="hidden">
        <pre>{{ dataJson }}</pre>
      </div>
    </FormKit>
  </div>
</template>
<script setup lang="ts">
const initialState = {
    efi: "",
    title: "",
    alternative_title: "",
    location: [],
    productionyear: [],
    director: [],
    castmember: [],
    producer: [],
    genre: [],
    subject: [],
    other_id: [],
    last_edit: "Deutsche Kinemathek - Museum für Film und Fernsehen"
};
import { toast } from "vue3-toastify";
const dataJson = defineModel({type: Object, required: true});

const showInfo = ref(false);

function customReset () {
    //deep copy of initialState
    dataJson.value = JSON.parse(JSON.stringify(initialState));
}

function customSubmitHandler (e) 
{
    console.log(e);
    toast.success("Form submitted");
} 

</script>
