<template>
    <div class="flex flex-col">
        <!-- LABEL (normalized height, space always reserved) -->
        <div class="h-4 flex items-center">
            <MicroLabelComp
                :label-text="keytxt"
                :translate-key="translateKey"
            />
        </div>

        <!-- CONTENT (single normalized margin) -->
        <div class="mt-1">
            <div class="flex min-h-8 items-start gap-2 leading-5">

                <!-- CLIPBOARD MODE -->
                <GlobalClipboardComp
                    v-if="clip && !(sameAs && showSameAsLink)"
                    class="flex items-start h-8 leading-5 max-sm:break-all"
                    :class="fontSize"
                    :display-text="valtxt"
                    :copy-text="clipText ? clipText : valtxt"
                    :key-text="keytxt"
                />

                <!-- TEXT MODE -->
                <span
                    v-else
                    class="min-w-0 grow leading-5"
                    :class="[narrow ? 'break-all w-3/4' : '']"
                >
                    {{ $t(valtxt) }}
                </span>

                <!-- SAME AS -->
                <DetailSameAsComp
                    v-if="sameAs && showSameAsLink"
                    :same-as-data="sameAsData"
                    class="shrink-0"
                    :class="fontSize"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
    keytxt: {
        type: String,
        required: true
    },
    valtxt: {
        type: String,
        required: false,
        default: '-'
    },
    sameAs: {
        type: Boolean,
        default: false
    },
    showSameAsLink: {
        type: Boolean,
        default: false
    },
    clip: {
        type: Boolean,
        default: true
    },
    clipText: {
        type: String,
        default: null
    },
    fontSize: {
        type: String,
        default: 'text-base'
    },
    narrow: {
        type: Boolean,
        default: false
    },
    translateKey: {
        type: Boolean,
        default: true
    }
});

const sameAsData = computed(() => [
    {
        id: props.valtxt,
        category: props.keytxt
    }
]);
</script>
