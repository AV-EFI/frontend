<template>
  <div
    v-if="item.has_record?.category === 'avefi:WorkVariant'"
    class="dropdown dropdown-end"
  >
    <div
      tabindex="0"
      role="button"
      aria-haspopup="true"
      aria-expanded="false"
      :aria-label="$t('moreOptionsFor') + ' ' + (item?.has_record?.has_primary_title?.has_name || '')"
      class="btn btn-outline btn-circle text-white"
      :class="['btn-' + compSize]"
    >
      <Icon
        :class="['text-' + compSize]"
        name="mdi:dots-horizontal"
      />
    </div>

    <ul
      tabindex="0"
      class="p-2 shadow-md menu dropdown-content bg-base-100 rounded-box w-64 z-[1] [li:hover]:bg-transparent"
      role="menu"
      :aria-label="$t('moreOptions')"
    >
      <li
        role="none"
      >
        <div class="w-full p-0 my-0 mx-auto justify-center items-center">
          <LazyCartAddToShoppingCartComp
            :film-id="id ?? item?.objectID"
            :film-title="item?.has_record?.has_primary_title.has_name"
            class="w-48 btn-block btn-sm flex item-start"
            role="menuitem"
          />
        </div>
      </li>
      <li
        role="none"
        class="mt-1"
      >
        <div class="w-full p-0 my-0 mx-auto justify-center items-center z-20">
          <LazyCartAddToComparisonComp
            :film-id="id ?? item?.objectID"
            :film-title="item?.has_record?.has_primary_title.has_name"
            class="btn-block btn-sm w-48 flex item-start"
            role="menuitem"
          />
        </div>
      </li>
      <li
        role="none"
        class="mt-1"
      >
        <GlobalExportDataComp
          :data-set-id="id ? [id] : [item.objectID]"
          :data-set-json="JSON.stringify(item, null, 2)"
          class="w-full p-0 mx-auto justify-center items-start flex"
          btn-size="btn-block btn-sm !w-48"
          role="menuitem"
          :show-label="true"
          :fixed-with="true"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
defineProps({
    item: {
        type: Object,
        required: true,
    },
    compSize: {
        type: String,
        default: 'xl',
    },
    id: {
        type: String,
        required: false,
    }
});
</script>
