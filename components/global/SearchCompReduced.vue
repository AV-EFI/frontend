<template>
  <div class="w-full my-auto">
    <div class="flex flex-row gap-0 items-stretch h-16">
      <SearchQueryAutocomplete ref="qaRef" v-model="term" name="search" :placeholder="$t('searchplaceholder')"
        :aria-label="ariaLabel" aria-autocomplete="list" aria-haspopup="listbox" aria-owns="qa-listbox-search"
        aria-expanded="false" :icon-map="iconMap" :recent-searches="recentSearchesWithUrl" :autofocus="false"
        @submit="onSubmit" @clear="term = ''" @recent-search-click="handleRecentSearchClick"
        @remove-recent="handleRemoveRecentSearch" @clear-history="handleClearAllHistory"
        @keydown.enter="submitFromButton" />
      <button type="button" class="btn btn-primary lg:btn-lg h-12 !rounded-l-none !rounded-r-xl"
        @click="submitFromButton">
        {{ buttonText }}
      </button>
    </div>

    <p v-if="hint" class="mt-2 text-sm text-base-content/70">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { FACET_ICON_MAP } from '~/models/interfaces/manual/IFacetIconMapping.js';
import { useFormKitLoader } from '~/composables/useFormKitLoader';

const { ensureFormKitReady } = useFormKitLoader();

await ensureFormKitReady();

const props = defineProps<{
  modelValue?: string
  placeholder?: string
  ariaLabel?: string
  buttonLabel?: string
  hint?: string
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'search', payload: { q: string }): void
}>();

const router = useRouter();
const route = useRoute();

const term = ref(props.modelValue ?? '');
const qaRef = ref<{ submit: () => void } | null>(null);

// Search history
const { addToSearchHistory, getSearchHistory, removeFromHistory, clearSearchHistory } = useSearchHistory();
const historyTrigger = ref(0);
const recentSearchesWithUrl = computed(() => {
    historyTrigger.value; // Make reactive
    return getSearchHistory();
});

const ariaLabel = computed(() => props.ariaLabel ?? 'Search input');
const buttonLabel = computed(() => props.buttonLabel ?? 'Search');
const hint = computed(() => props.hint ?? '');

const { t } = useI18n();
const buttonText = computed(() => 
    term.value?.trim() ? t('Search') : t('showEntireCollection')
);

const iconMap = FACET_ICON_MAP;

function pushRoute(q: string) {
    const query = { ...route.query, q };
    if (!q) delete query.q;
    router.push({ path: route.path, query });
}

function handleRecentSearchClick(item: any) {
    if (item.url) {
        window.location.href = `/search/${item.url}`;
    }
}

function handleRemoveRecentSearch(query: string) {
    removeFromHistory(query);
    historyTrigger.value++;
}

function handleClearAllHistory() {
    clearSearchHistory();
    historyTrigger.value++;
}

function onSubmit(v: string) {
    term.value = v;
    if (v && v.trim() !== '') {
        addToSearchHistory(v);
        historyTrigger.value++;
    }
    emit('update:modelValue', term.value);
    emit('search', { q: term.value });
    redirectToSearchScreen(term.value);
//  pushRoute(term.value)
}

function redirectToSearchScreen(query: string) {
    const redirectLink =  '/' + useRuntimeConfig().public.SEARCH_URL + '/?query=' + encodeURIComponent(query);
    console.log('redirecting to search screen with term:', redirectLink);
    navigateTo(redirectLink);
}

function submitFromButton() {
    qaRef.value?.submit();
}
</script>
