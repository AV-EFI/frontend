<template>
  <div>
    <ul
      v-if="items && items?.length > 0"
      class="max-w-full"
    >
      <li
        v-for="(item, index) in reorderItems(items)"
        v-show="showAll || index < 5"
        :key="index"
        :title="item"
        :class="{ 'bg-secondary font-bold': ishiliteed(item), [fontSize]: true }"
        class="w-full max-w-[200px] overflow-hidden text-ellipsis"
      >
        {{ item }}
      </li>
    </ul>
    <ul v-else>
      -
    </ul>
    <button
      v-if="items && items?.length > 5"
      class="mt-2 btn btn-outline btn-primary btn-sm md:w-48"
      @click="toggleShowAll"
    >
      {{ showAll ? $t('showLess') : $t('showMore') }}
    </button>
  </div>
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
        default: null,
    },
    fontSize: {
        type: String,
        required: false,
        default: "text-base",
    }
});

const showAll = ref(false);

function toggleShowAll() {
    showAll.value = !showAll.value;
}

function reorderItems(items) {
    if(!props.hilite) { 
        return items;
    }
    const hiliteedItems = items.filter(item => ishiliteed(item));
    const nonHiliteedItems = items.filter(item => !ishiliteed(item));
    return [...hiliteedItems, ...nonHiliteedItems];
}

//const reorderedItems = computed(() => reorderItems(props.items));

function ishiliteed(item) {
    if (!props.hilite) return false;
    // Ensure hilite is an array for consistency
    const hilites = Array.isArray(props.hilite) ? props.hilite : [props.hilite];
    return hilites.includes(item);
}
</script>
