<template>
  <div
    class="w-full md:w-fit center-content justify-center mx-auto text-slate-600 dark:text-slate-200"
  >
    <div class="breadcrumbs text-sm">
      <ul>
        <li
          v-for="el in breadcrumbs"
          :key="el[1]"
        >
          <a :href="el[1]">{{ el[0] }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
    "breadcrumbs": {
        type: Array as PropType<Array<[string, string]>>,
        required: false,
        default: () => [['Home', '/']]
    }
});
</script>