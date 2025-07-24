<script setup lang="ts">

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    containerId: {
        type: Number,
        required: false,
        default: 1
    },
    index: {
        type: Number,
        required: false,
        default: 1
    }
});
const { id, question, answer, containerId, index} = props;
const iKey = ref(getCurrentInstance()?.vnode.key?.toString);

</script>

<template>
  <div class="collapse collapse-arrow border-1 border-base-200 dark:border-neutral-400">
    <input
      type="radio"
      :name="`faq-accordion-${containerId}`"
      :checked="index < 1"
    >
    <div
      class="
      collapse-title
      text-xl
      font-medium
      border-b-2"
    >
      {{ question }}
    </div>
    <div class="collapse-content"> 
      <p>{{ answer }}</p>
    </div>
  </div>
</template>