<template>
  <div
    class="w-full md:w-fit center-content justify-center mx-auto my-2 text-slate-600 dark:text-slate-200"
  >
    <nav
      class="breadcrumbs ml-2 md:ml-auto text-sm dark:text-slate-400"
      role="navigation"
      :aria-label="$t('breadcrumb')"
    >
      <ul class="flex flex-wrap gap-2">
        <li
          v-for="(el, index) in breadcrumbs"
          :key="el[1]"
          class="dark:hover:text-slate2300"
        >
          <a
            :href="el[1]"
            class="hover:underline"
            :aria-current="index === breadcrumbs.length - 1 ? 'page' : null"
          >
            {{ el[0] }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
defineProps({
    "breadcrumbs": {
        type: Array as PropType<Array<[string, string]>>,
        required: false,
        default: () => [['Home', '/']]
    }
});
</script>
