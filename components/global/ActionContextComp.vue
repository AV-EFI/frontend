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
            class="action-list p-2 shadow-md menu dropdown-content bg-base-100 rounded-box w-64 z-20 [li:hover]:bg-transparent"
            role="menu" :aria-label="$t('moreOptions')">
            <li role="none" class="action-list-item">
                <div class="action-row-wrap w-full p-0 my-0 mx-auto justify-center items-center">
                    <LazyCartAddToFavouritesComp :film-id="id ?? item?.handle"
                                                 :film-title="item?.has_record?.has_primary_title?.has_name" class="w-48 btn-block btn-sm flex items-start action-btn"
                                                 role="menuitem" />
                </div>
            </li>
            <li role="none" class="action-list-item">
                <div class="action-row-wrap w-full p-0 my-0 mx-auto justify-center items-center z-20">
                    <LazyCartAddToComparisonComp :film-id="id ?? item?.handle"
                                                 :film-title="item?.has_record?.has_primary_title?.has_name" class="btn-block btn-sm w-48 flex items-start action-btn"
                                                 role="menuitem" />
                </div>
            </li>
            <li role="none" class="action-list-item mx-auto">
                <GlobalExportDataComp :data-set-id="id ? [id] : [item.handle]" :data-set-json="JSON.stringify(item, null, 2)"
                                      class="w-full p-0 mx-auto justify-center items-start flex" btn-size="btn-sm !w-48 action-btn" role="menuitem"
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
.action-list {
    row-gap: 0.25rem;
}

.action-list-item {
    margin-top: 0 !important;
}

.action-row-wrap {
    display: flex;
}

.action-list :deep(.action-btn) {
    min-height: 2rem;
    height: 2rem;
    align-items: center;
}

.dropdown-content :deep(.icon-action) {
    font-size: 0.9rem;
}
</style>
