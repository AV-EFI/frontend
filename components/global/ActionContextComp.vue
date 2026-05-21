<template>
    <div
        v-if="item?.has_record?.category === 'avefi:WorkVariant'"
        ref="dropdownRef"
        class="dropdown dropdown-end"
        @focusin="menuOpen = true"
        @focusout="handleFocusOut"
    >
        <button
            type="button"
            aria-haspopup="true"
            :aria-expanded="menuOpen.toString()"
            :aria-label="$t('moreOptionsFor') + ' ' + (item?.compound_record?._source?.has_record?.has_primary_title?.has_name || item?.has_record?.has_primary_title?.has_name || '')"
            class="btn btn-outline btn-circle"
            :class="['btn-' + compSize]"
            @click="menuOpen = true"
            @keydown.escape.prevent="menuOpen = false"
        >
            <Icon :class="['text-' + compSize]" name="tabler:dots" />
        </button>

        <ul tabindex="0"
            class="p-2 shadow-md menu dropdown-content bg-base-100 rounded-box w-64 z-20 [li:hover]:bg-transparent"
            role="menu" :aria-label="$t('moreOptions')">
            <li role="none">
                <div class="w-full p-0 my-0 mx-auto justify-center items-center">
                    <LazyCartAddToFavouritesComp :film-id="id ?? item?.handle"
                                                 :film-title="item?.has_record?.has_primary_title?.has_name" class="w-48 btn-block btn-sm flex item-start"
                                                 role="menuitem" />
                </div>
            </li>
            <li role="none" class="mt-1">
                <div class="w-full p-0 my-0 mx-auto justify-center items-center z-20">
                    <LazyCartAddToComparisonComp :film-id="id ?? item?.handle"
                                                 :film-title="item?.has_record?.has_primary_title?.has_name" class="btn-block btn-sm w-48 flex item-start"
                                                 role="menuitem" />
                </div>
            </li>
            <li role="none" class="mt-1 mx-auto">
                <GlobalExportDataComp :data-set-id="id ? [id] : [item.handle]" :data-set-json="JSON.stringify(item, null, 2)"
                                      class="w-full p-0 mx-auto justify-center items-start flex" btn-size="btn-sm !w-48" role="menuitem"
                                      :show-label="true" :fixed-with="true" />
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

defineProps({
    item: {
        type: Object,
        required: false,
        default: undefined,
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

const menuOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

function handleFocusOut(event: FocusEvent) {
    const nextTarget = event.relatedTarget as Node | null;
    if (!nextTarget || !dropdownRef.value?.contains(nextTarget)) {
        menuOpen.value = false;
    }
}
</script>

<style scoped>
.dropdown-content :deep(.icon-action) {
    font-size: 0.9rem;
}
</style>
