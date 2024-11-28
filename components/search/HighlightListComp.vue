<template>
  <ul>
    <li
      v-for="(item, index) in items"
      :key="index"
    >
      <span
        v-if="highlight && item.includes(highlight)"
        class="font-bold bg-secondary"
      >
        {{ highlight }}
        <span>{{ item.replace(highlight, '') }}</span>
      </span>
      <span v-else>
        {{ item }}
      </span>
    </li>
  </ul>
</template>

<script setup>
defineProps({
    items: {
        type: Array,
        required: true,
        validator: (value) => Array.isArray(value) && value.every(item => typeof item === "string")
    },
    highlight: {
        type: String,
        required: false,
        default: ""
    }
});
</script>