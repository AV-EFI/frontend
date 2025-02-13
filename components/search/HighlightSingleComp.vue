<template>
  <div v-if="item">
    <p
      :class="{ 'bg-secondary font-bold dark:text-secondary-900': ishiliteed(item), [fontSize]: true }"
    >
      {{ $t(item) }}
    </p>
  </div>
  <div v-else>
    -
  </div>
</template>
<script setup>
const props = defineProps({
    item: {
        type: String,
        required: true,
    },
    hilite: {
        type: [String, Array],
        required: false,
        default: null,
    },
    fontSize: {
        type: String,
        required: false,
        default: "text-base",
    }
});

function ishiliteed(item) {
    if (!props.hilite) return false;
    // Ensure hilite is an array for consistency
    const hilites = Array.isArray(props.hilite) ? props.hilite : [props.hilite];
    return hilites.includes(item);
}
</script>
