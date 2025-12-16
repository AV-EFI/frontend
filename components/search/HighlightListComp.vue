<template>
  <div v-if="items">
    <ul
      v-if="items && items?.length > 0"
      :id="`highlighted-list`"
      class="max-w-full"
      role="list"
      :aria-label="$t('listOfTerms')"
    >
      <li
        v-for="(item, index) in reorderItems(items)"
        v-show="showAll || index < 5"
        :key="index"
        :title="item"
        :aria-current="ishiliteed(item) ? 'true' : 'false'"
        role="listitem"
        :class="{
          'dark:text-secondary-900': ishiliteed(item),
          [fontSize]: true
        }"
        class="w-full overflow-hidden text-ellipsis"
      >
        {{ $t(item) }}
        <span
          v-if="ishiliteed(item)"
          class="badge badge-xs bg-highlight text-white"
          :title="$t('matchedField') + ': ' + item"
        />
      </li>
    </ul>
    <ul v-else>
      <li role="listitem">
        -
      </li>
    </ul>
    <button
      v-if="items && items?.length > 5"
      class="mt-2 btn btn-outline btn-primary btn-sm md:w-48"
      :aria-expanded="showAll.toString()"
      :aria-controls="`highlighted-list`"
      @click="toggleShowAll"
    >
      {{ showAll ? $t('showLess') : $t('showMore') }}
    </button>
  </div>
  <p v-else>
    -
  </p>
</template>

<script setup lang="ts">
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
        default: "text-sm",
    },
});

const showAll = ref(false);

function toggleShowAll() {
    showAll.value = !showAll.value;
}

function reorderItems(items) {
    if (!props.hilite) {
        return items;
    }
    const hiliteedItems = items.filter((item) => ishiliteed(item));
    const nonHiliteedItems = items.filter((item) => !ishiliteed(item));
    return [...hiliteedItems, ...nonHiliteedItems];
}

function ishiliteed(item) {
    if (!props.hilite) return false;
    const hilites = Array.isArray(props.hilite) ? props.hilite : [props.hilite];
    return hilites.some((hilite) => item.includes(hilite));
}
</script>
