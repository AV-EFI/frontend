<template>
    <span
        :class="fontSize"
        class="flex flex-row items-center whitespace-break-spaces gap-1"
    >
        <span v-if="collapsible" class="sr-only">{{ $t('efiIdentifierLabel') }}</span>
        <span :aria-hidden="collapsible ? 'true' : undefined">{{ displayText }}</span>
        <button
            type="button"
            class="inline-flex items-center text-primary-600 dark:hover:text-primary-100 dark:text-primary-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
            :class="[darkBg ? 'text-primary-200 hover:text-primary-300' : '']"
            :aria-label="`${$t('copyToClipboard')}: ${displayText}`"
            :title="`${$t('copyToClipboard')}: ${displayText}`"
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
import { computed } from 'vue';
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
     * Long, non-human-readable identifiers (EFI handles) stay visible for sighted
     * users, but are hidden from the accessibility tree behind a short sr-only
     * label instead of being read out character-by-character. The full value is
     * still available to AT users via the copy button's aria-label.
     */
    collapsible: {
        type: Boolean,
        default: false
    }
});

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