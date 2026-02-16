import { useClipboard } from '@vueuse/core';
import { ref } from 'vue';

export function useClipboardUtil() {
    const source = ref('AVefi');
    const { copy, isSupported } = useClipboard({ source });
    const {$toast} = useNuxtApp();

    function copyExtended(copyText: string) {
        try {
            if (typeof copyText === 'number') {
                copyText = String(copyText);
            }
            copy(copyText);
            $toast?.info?.(`'${copyText}' in Clipboard`);
        } catch (e) {
            $toast?.error?.('Copy to clipboard error');
            console.error('Copy to clipboard error:', e);
        }
    }

    return {
        copyExtended,
        isSupported
    };
}