import { computed, onBeforeUnmount, ref, unref, watch } from 'vue';

type MaybeRef<T> = T | { value: T };

export function useDataLoadState(opts: {
  pending: MaybeRef<boolean>
  error?: MaybeRef<unknown>
  hasData: MaybeRef<boolean>
  minSkeletonMs?: number
}) {
  const minSkeletonMs = Math.max(0, Number(opts.minSkeletonMs ?? 0));
  const loadingVisible = ref(Boolean(unref(opts.pending)));
  const lastLoadingStart = ref<number | null>(loadingVisible.value ? Date.now() : null);
  let hideTimer: ReturnType<typeof setTimeout> | null = null;

  const clearHideTimer = () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  };

  watch(
    () => Boolean(unref(opts.pending)),
    (pending) => {
      clearHideTimer();

      if (pending) {
        loadingVisible.value = true;
        lastLoadingStart.value = Date.now();
        return;
      }

      if (!loadingVisible.value) return;

      const elapsed = lastLoadingStart.value ? Date.now() - lastLoadingStart.value : minSkeletonMs;
      const remaining = Math.max(0, minSkeletonMs - elapsed);

      if (remaining === 0) {
        loadingVisible.value = false;
      } else {
        hideTimer = setTimeout(() => {
          loadingVisible.value = false;
          hideTimer = null;
        }, remaining);
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    clearHideTimer();
  });

  const hasError = computed(() => Boolean(unref(opts.error)));
  const hasData = computed(() => Boolean(unref(opts.hasData)));

  const showLoading = computed(() => loadingVisible.value);
  const showError = computed(() => !showLoading.value && hasError.value);
  const showEmpty = computed(() => !showLoading.value && !showError.value && !hasData.value);
  const showSuccess = computed(() => !showLoading.value && !showError.value && hasData.value);

  return {
    showLoading,
    showError,
    showEmpty,
    showSuccess,
  };
}
