<template>
  <div>
    <Slider 
      v-model="valueArray.value"
      v-bind="valueArray" 
      :min="min"
      :max="max"
      @update="sliderUpdateHandler"
    />
    <div class="flex flex-row justify-around mt-2">
      <FormKit
        v-model="valueLow"
        type="number"
        outer-class="!w-8"
        :min="min"
        :max="max"
        :placeholder="String(min)"
        :disabled="false"
        number="integer"
      />
      <div class="w-1/3 flex flex-col justify-center h-100 mb-3.5 justify-items-center">
        <Icon
          class="align-self-center mx-auto dark:text-white"
          name="formkit:arrowright"
        />
      </div>
      <FormKit
        v-model="valueHigh"
        type="number"
        outer-class="!w-8"
        :min="min"
        :max="max"
        :placeholder="String(max)"
        :disabled="false"
        number="integer"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Slider from '@vueform/slider';


const props = defineProps({
    'min': {
        type: Number,
        default: 1850
    },
    'max': {
        type: Number,
        default: 2025
    }
});

const valueLow = ref(props.min??1850);
const valueHigh = ref(props.max??2025);

const valueArray = ref({
    value: [valueLow.value, valueHigh.value]
});

function sliderUpdateHandler(valuesArray:Array<number>) {
    try {
        console.log(valuesArray);
        if(valuesArray && valuesArray.length == 2){
            valueLow.value = valuesArray.at(0);
            valueHigh.value = valuesArray.at(1);
        }
    }
    catch(ex) {
        console.error(ex);
    }
}

watch(valueLow, (newValueLow) => {
    console.log(newValueLow);
    valueArray.value.value[0] = newValueLow;
});

watch(valueHigh, (newValueHigh) => {
    console.log(newValueHigh);
    valueArray.value.value[1] = newValueHigh;
});


</script>

<style lang="scss">
//  @import '../../node_modules/@vueform/slider/themes/tailwind.scss';
  @import '../../assets/scss/slider_tailwind.scss';

  .slider-primary {
  --slider-connect-bg: var(--primary-50)!important;
  --slider-tooltip-bg: var(--accenttwo)!important;
  --slider-handle-ring-color: var(--accent)!important;
}

</style>