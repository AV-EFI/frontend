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
      class="btn btn-primary btn-outline btn-circle"
      :class="['btn-' + compSize]"
    >
      <Icon
        :class="['text-' + compSize]"
        name="mdi:dots-horizontal"
      />
    </div>

    <ul
      tabindex="0"
      class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-64 z-[1]"
      role="menu"
      :aria-label="$t('moreOptions')"
    >
      <li role="none">
        <div class="w-full p-0 my-0 mx-auto justify-center items-center">
          <AddToShoppingCartComp
            :film-id="id ?? item?.objectID"
            :film-title="item?.has_record?.has_primary_title.has_name"
            class="w-48 btn-block btn-sm"
            role="menuitem"
          />
        </div>
      </li>
      <li role="none">
        <div class="w-full p-0 my-0 mx-auto justify-center items-center">
          <AddToComparisonComp
            :film-id="id ?? item?.objectID"
            :film-title="item?.has_record?.has_primary_title.has_name"
            class="btn-block btn-sm w-48"
            role="menuitem"
          />
        </div>
      </li>
      <li role="none">
        <GlobalExportDataComp
          :data-set-id="id ? [id] : [item.objectID]"
          :data-set-json="JSON.stringify(item, null, 2)"
          class="w-full p-0 mx-auto justify-center items-center flex"
          btn-size="btn-block btn-sm !w-48"
          role="menuitem"
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
