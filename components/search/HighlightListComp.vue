<template>
  <ul>
    <li
      v-for="(item, index) in items"
      :key="index"
      :class="{ 'bg-secondary font-bold': ishiliteed(item) }"
    >
      {{ item }}
    </li>
  </ul>
</template>

<script setup>
const props = defineProps({
    items: {
        type: Array,
        required: true,
        validator: (value) =>
            Array.isArray(value) && value.every((item) => typeof item === "string"),
    },
    hilite: {
        type: [String, Array],
        required: false,
        default: "",
    },
});

function ishiliteed(item) {
    if (!props.hilite) return false;

    // Ensure hilite is an array for consistency
    const hilites = Array.isArray(props.hilite) ? props.hilite : [props.hilite];
    console.log(item);
    console.log(hilites);
    return hilites.includes(item);
}
</script>
