<template>
  <div
    v-if="item.has_record?.category == 'avefi:WorkVariant'"
    class="dropdown dropdown-end"
  >
    <div
      tabindex="0"
      role="button"
      class="btn btn-primary btn-outline btn-circle"
      :class="['btn-'+compSize]"
      alt="more options"
    >
      <Icon
        :class="['text-'+compSize]"
        name="mdi:dots-horizontal"
      />
    </div>
    <ul
      tabindex="0"
      class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52 z-[1]"
    >
      <li
        class=""
      >
        <AddToShoppingCartComp
          :film-id="id?? item?.objectID"
          :film-title="item?.has_record?.has_primary_title.has_name"
          class="ml-2"
        />
      </li>
      <li
        class=""
      >
        <AddToComparisonComp
          :film-id="id?? item?.objectID"
          :film-title="item?.has_record?.has_primary_title.has_name"
          class="ml-2"
        />
      </li>
      <li
        class=""
      >
        <GlobalExportDataComp
          :data-set-id="id?? item.objectID"
          :data-set-json="JSON.stringify(item,null,2)"
          class="ml-2"
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