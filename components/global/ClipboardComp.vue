<template>
    <span
        :class="fontSize"
        class="flex flex-row items-center whitespace-break-spaces gap-1"
    >
        <button
            v-if="collapsible"
            type="button"
            class="inline-flex items-center gap-1 text-xs text-primary underline underline-offset-2 decoration-transparent hover:decoration-current focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-sm"
            :aria-expanded="revealed ? 'true' : 'false'"
            :aria-controls="valueId"
            @click="revealed = !revealed"
        >
            <Icon :name="revealed ? 'tabler:eye-off' : 'tabler:eye'" class="w-3.5 h-3.5" aria-hidden="true" />
            {{ revealed ? $t('hideIdentifier') : $t('showIdentifier') }}
        </button>
        <span v-if="!collapsible || revealed" :id="collapsible ? valueId : undefined">{{ displayText }}</span>
        <button
            type="button"
            class="inline-flex items-center text-primary-600 dark:hover:text-primary-100 dark:text-primary-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
            :class="[darkBg ? 'text-primary-200 hover:text-primary-300' : '']"
            :aria-label="collapsible && !revealed ? $t('copyToClipboard') : `${$t('copyToClipboard')}: ${displayText}`"
            :title="collapsible && !revealed ? $t('copyToClipboard') : `${$t('copyToClipboard')}: ${displayText}`"
            @click="useClipboardUtil()?.copyExtended(copyValue)"
        >
            <Icon
                class="min-w-4"
                :class="[fontSize]"
                name="tabler:copy"
                aria-hidden="true"
            />
        </button>
    </span>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useClipboardUtil } from '~/utils/clipboard';

const props = defineProps ({
    'displayText': {
        type: String,
        default: 'AVefi'
    },
    'fontSize': {
        type: String,
        default: 'text-sm'
    },
    'darkBg': {
        type: Boolean,
        default: false
    },
    'copyText': {
        type: String,
        default: null
    },
    keyText: {
        type: String,
        default: 'avefi:AVefiResource'
    },
    /**
     * Long, non-human-readable identifiers (EFI handles) shouldn't be read out by
     * screen readers unprompted. When true, the value stays hidden behind a
     * "show identifier" toggle; copying still works without revealing it.
     */
    collapsible: {
        type: Boolean,
        default: false
    }
});

const revealed = ref(!props.collapsible);
const valueId = `clipboard-value-${Math.random().toString(36).slice(2, 10)}`;

const { getNormdataUrl } = useNormdataUrl();

const copyValue = computed(() => {
    const rawValue = props.copyText ?? props.displayText;
    if (!rawValue) {
        return '';
    }

    const normalized = String(rawValue).trim();
    if (!normalized) {
        return '';
    }

    if (/^https?:\/\//i.test(normalized)) {
        return normalized;
    }

    if (props.keyText?.startsWith('avefi:')) {
        return getNormdataUrl(props.keyText, normalized);
    }

    return normalized;
});


</script>