<template>
  <section
    class="w-full mx-auto rounded-xl shadow-xl overflow-hidden"
    :class="isFullWidth ? 'lg:!w-full' : 'lg:!w-4/5'"
  >
    <!-- Blauer Titelbereich -->
    <div class="bg-primary-500 dark:bg-primary-900 text-white px-1 py-3 flex items-center justify-between">
      <div class="w-full flex flex-col ">
        <slot name="actions" />
        <slot name="title" />
        <!-- Actions-Slot -->
      </div>
    </div>

    <!-- Card Body -->
    <div
      class="card card-side bg-white dark:bg-gray-900"
    >
      <div
        class="card-body max-w-full max-md:p-2"
        :class="paddingClass"
      >
        <slot name="cardBody">
          Card content
        </slot>

        <!-- Toggle nur wenn aktiv -->
        <div
          v-if="showExpandToggle"
          class="form-control w-full flex flex-col justify-end mt-4"
        >
          <label class="label cursor-pointer w-40 ml-auto">
            <span class="label-text">
              {{ `${$t('regular')} / ${$t('wide')}` }}&nbsp;
            </span>
            <input
              v-model="isFullWidth"
              type="checkbox"
              class="toggle"
            >
          </label>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps({
    showExpandToggle: { type: Boolean, default: false },
    paddingClass: { type: String, default: 'p-4' },
});

const isFullWidth = ref(false);
</script>
