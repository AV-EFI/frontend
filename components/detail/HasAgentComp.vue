<template>
  <div
    v-if="agentData"
    class="col-span-full md:col-span-5 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md"
    role="region"
    :aria-label="$t('has_agent_section')"
  >
    <div
      v-for="(has_agent_item, agent_index) in agentData"
      :key="agent_index"
      class="mb-4"
      role="group"
      :aria-label="$t('agent_item') + ' ' + (has_agent_item.has_name || agent_index + 1)"
    >
      <h4
        class="text-lg font-semibold text-gray-900 dark:text-gray-100"
        :aria-label="$t('agent_name') + ': ' + has_agent_item.has_name"
      >
        {{ has_agent_item.has_name }}
      </h4>

      <span
        class="text-gray-700 dark:text-gray-300"
        :aria-label="$t('agent_type') + ': ' + $t(has_agent_item.type)"
      >
        {{ $t(has_agent_item.type) }}
      </span><br>

      <span
        class="text-sm xl:text-base font-bold text-gray-700 dark:text-gray-300"
        :aria-label="$t('same_as_label')"
      >
        same_as:
      </span>
      <span v-if="has_agent_item.same_as">
        <DetailSameAsComp
          :same-as-data="has_agent_item?.same_as"
        />
      </span>

      <div>
        <span
          class="text-sm font-bold text-gray-700 dark:text-gray-300"
          :aria-label="$t('has_alternate_name_label')"
        >
          has_alternate_name:
        </span>
        <ul
          class="list-disc list-inside"
          role="list"
          :aria-label="$t('alternate_names_list')"
        >
          <li
            v-for="(alternate_name_item, alternate_name_index) in has_agent_item?.has_alternate_name"
            :key="alternate_name_index"
            class="text-gray-700 dark:text-gray-300"
            :aria-label="$t('alternate_name') + ': ' + alternate_name_item"
            role="listitem"
          >
            <span>
              {{ alternate_name_item }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div
    v-else
    class="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md"
    role="alert"
    :aria-label="$t('invalid_data_in_has_agent')"
  >
    <span class="text-gray-700 dark:text-gray-300">{{ $t('invalid_data_in_has_agent') }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps({
    agentData: {
        type: Object,
        default: null
    }
});
</script>