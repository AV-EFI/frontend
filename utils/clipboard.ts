import { useClipboard } from '@vueuse/core';
import { ref } from 'vue';

export function useClipboardUtil() {
  const source = ref('AVefi');
  const { copy, isSupported } = useClipboard({ source });
  const nuxtApp = useNuxtApp();
  const {$toast} = nuxtApp;
  const t = (key: string) => {
    const i18n = nuxtApp.$i18n as { t?: (key: string) => string } | undefined;
    return i18n?.t?.(key) ?? key;
  };

  function copyExtended(copyText: string) {
    try {
      if (typeof copyText === 'number') {
        copyText = String(copyText);
      }
      copy(copyText);
      $toast?.info?.(t('clipboardCopySuccess'));
    } catch (e) {
      $toast?.error?.(t('clipboardCopyError'));
      console.error('Copy to clipboard error:', e);
    }
  }

  return {
    copyExtended,
    isSupported
  };
}
