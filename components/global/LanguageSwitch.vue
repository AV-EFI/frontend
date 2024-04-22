<template>
  <form>
    <select
      v-model="locale"
      class="px-4 py-1 w-32 text-sm text-primary-600 font-semibold rounded-full border focus:ring-offset-2"
    >
      <option value="en">
        English
      </option>
      <option value="de">
        Deutsch
      </option>
    </select>
    <p>{{ $t("welcome") }}</p>
  </form>
</template>
<script setup lang="ts">
const { locale } = useI18n();
</script>
