<template>
    <div v-if="item?.has_record?.category === 'avefi:WorkVariant'" class="dropdown dropdown-end"
         @focusout="onFocusOut">
        <div tabindex="0" role="button" aria-haspopup="true" :aria-expanded="menuOpen.toString()"
             :aria-label="$t('moreOptionsFor') + ' ' + (item?.compound_record?._source?.has_record?.has_primary_title?.has_name || '')"
             class="btn btn-outline btn-circle" :class="['btn-' + compSize]"
             @click="menuOpen = !menuOpen"
             @keydown.enter.prevent="menuOpen = !menuOpen"
             @keydown.space.prevent="menuOpen = !menuOpen"
             @keydown.escape.prevent="menuOpen = false">
            <Icon :class="['text-' + compSize]" name="tabler:dots" />
        </div>

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

const menuOpen = ref(false);

function onFocusOut(e: FocusEvent) {
    const container = e.currentTarget as HTMLElement;
    if (!container.contains(e.relatedTarget as Node)) {
        menuOpen.value = false;
    }
}

const props = defineProps({
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

</script>
