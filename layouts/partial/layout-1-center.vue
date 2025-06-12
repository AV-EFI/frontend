<template>
  <section>
    <div 
      :class="[
        'w-full mx-auto card card-side bg-white dark:bg-gray-900 rounded-xl shadow-xl',
        isFullWidth ? 'lg:!w-full' : 'lg:!w-4/5',
      ]"
    >
      <div
        class="card-body max-w-full"
        :class="paddingClass"
      >
        <div class="w-full flex flex-row items-center">
          <slot name="actions" />
          <div
            v-if="showExpandToggle"
            class="form-control w-full flex flex-col justify-end"
          >
            <label class="label cursor-pointer w-40 ml-auto">
              <span
                class="label-text"
              >{{ `${$t('regular')} / ${$t('wide')}` }}&nbsp;
              </span>
              <input
                v-model="isFullWidth"
                type="checkbox"
                class="toggle"
              >
            </label>
          </div>
        </div>        
        <slot name="title" />
        <slot name="cardBody">
          Card content
        </slot>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
const props = defineProps({
    showExpandToggle: {
        type: Boolean,
        default: false
    },
    paddingClass: {
        type: String,
        default: 'p-4'
    }
});

const isFullWidth = ref(false);
const toggleWidth = () => {
    isFullWidth.value = !isFullWidth.value;
};
</script>