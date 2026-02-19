<template>
    <div class="relative w-full" @mousedown.stop>
        <div class="relative">
            <FormKit v-model="displayValue" type="text" :name="name" :placeholder="placeholder"
                :autofocus="autofocus ?? false" autocomplete="off" outer-class="!max-w-none w-full"
                wrapper-class="flex flex-row"
                inner-class="!rounded-xl !h-12 w-full dark:!bg-gray-950 dark:!text-white !rounded-r-none"
                input-class="!text-lg border-none !focus:border-none px-4 pr-10 w-full dark:!text-white !h-12"
                aria-haspopup="listbox" :aria-owns="listboxId" :aria-expanded="showDropdown ? 'true' : 'false'"
                :aria-activedescendant="activeDescId" @input="onInput" @focus="onFocus" @blur="onBlur"
                @keydown="onKeydown">
                <!--
               <template v-if="showInfoTooltip && infoTooltipText" #prefixIcon>
                    <span class="formkit-icon relative group cursor-help my-auto flex justify-center"
                        :title="infoTooltipText">
                        <Icon name="tabler:info-circle" class="text-gray-500 dark:text-gray-300 text-xl" />
                    </span>
                </template>
-->
            </FormKit>

            <!-- Clear button inside input -->
            <button v-if="displayValue" type="button"
                class="absolute w-8 h-8 right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                :title="clearTitle" :aria-label="clearTitle" @mousedown.stop.prevent="onClear">
                <Icon class="text-lg text-gray-500 dark:text-gray-400" name="tabler:x" aria-hidden="true" />
            </button>
        </div>

        <!-- Suggestions dropdown -->
        <div v-show="showDropdown" :id="listboxId"
            class="absolute z-[1100] w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-96 overflow-auto"
            role="listbox" :aria-label="ariaLabel">
            <!-- Accessible headings for screen readers -->
            <span v-if="visibleSuggestions.some(s => s.type === 'recent')" class="sr-only" id="recent-searches-heading">
                {{ $t('recentSearches') }}
            </span>
            <span v-if="visibleSuggestions.some(s => s.type !== 'recent')" class="sr-only"
                id="autocomplete-suggestions-heading">
                {{ $t('suggestions') }}
            </span>

            <!-- Recent searches header (only when input is empty) -->
            <div v-if="props.recentSearches && props.recentSearches.length > 0"
                class="flex justify-between items-center px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <span class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    {{ $t('recentSearches') }} / {{ $t('suggestions') }}
                </span>
                <button type="button"
                    class="text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    @mousedown.stop.prevent="emit('clear-history')">
                    {{ $t('clearSearchHistory') }}
                </button>
            </div>
            <div v-else-if="props.recentSearches && props.recentSearches.length > 0"
                class="flex justify-between items-center px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <span class="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    {{ $t('suggestions') }}
                </span>
                <button type="button"
                    class="text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    @mousedown.stop.prevent="emit('clear-history')">
                    {{ $t('clearSearchHistory') }}
                </button>

            </div>


            <template v-if="visibleSuggestions.length">
                <!-- Visually hidden headings for screen readers only, do not affect structure -->
                <span v-if="visibleSuggestions.some(s => s.type === 'recent')" class="sr-only"
                    id="recent-searches-heading">
                    {{ $t('recentSearches') }}
                </span>
                <span v-if="visibleSuggestions.some(s => s.type !== 'recent')" class="sr-only"
                    id="autocomplete-suggestions-heading">
                    {{ $t('suggestions') }}
                </span>
                <!-- Original flat rendering -->
                <button v-for="(s, i) in visibleSuggestions" :id="optionId(i)" :key="s.type + '::' + s.text + '::' + i"
                    type="button" :class="[
                        'w-full text-left px-3 py-2 flex items-center gap-2 group',
                        'hover:bg-gray-100 dark:hover:bg-gray-700',
                        i === highlighted ? 'bg-gray-100 dark:bg-gray-700' : ''
                    ]" role="option" :aria-selected="i === highlighted" :aria-label="`${typeLabel(s.type)}: ${s.text}`"
                    @mousedown.stop.prevent="onSelect(s)">
                    <Icon v-if="s.type === 'recent'" class="shrink-0 text-base leading-none" name="tabler:history"
                        :title="typeLabel(s.type)" aria-hidden="true" />
                    <Icon v-else-if="s.type === 'saved'" class="shrink-0 text-base leading-none" name="tabler:star"
                        :title="typeLabel(s.type)" aria-hidden="true" />
                    <Icon v-else class="shrink-0 text-base leading-none" :name="iconClassFor(s.type, s.text)"
                        :title="typeLabel(s.type)" aria-hidden="true" />
                    <span class="sr-only">{{ typeLabel(s.type) }}: </span>
                    <span class="text-base truncate">{{ s.text }}</span>
                    <span v-if="s.count && s.count > 1"
                        class="ml-auto text-xs text-gray-500 dark:text-gray-400 shrink-0">
                        ({{ s.count }})
                    </span>
                    <!-- Remove button for recent searches -->
                    <span v-if="s.type === 'recent'" type="button"
                        class="ml-auto opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 dark:hover:text-red-400 shrink-0"
                        @mousedown.stop.prevent="emit('remove-recent', s.text)">
                        <Icon name="tabler:x" class="text-sm" />
                    </span>
                </button>
            </template>

            <div v-else class="px-3 py-2 text-sm text-gray-500 dark:text-gray-300 select-none">
                {{ noResultsMessage }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFormKitLoader } from '~/composables/useFormKitLoader';
import defaultQuerySuggestions from '~/assets/data/default-query-suggestions.json';

const { ensureFormKitReady } = useFormKitLoader();

await ensureFormKitReady();

const suppressNextInput = ref(false);

const t = useI18n().t;

type Suggestion = { text: string; type: string; count?: number; url?: string };
type IconMap = Record<string, string>;

const props = defineProps<{
  modelValue?: string;
  name?: string;
  placeholder?: string;
  ariaLabel?: string;
  clearTitle?: string;
  showInfoTooltip?: boolean;
  infoTooltipText?: string;
  noResultsText?: string;
  facetAttr?: string;
  size?: number;
  iconMap?: IconMap;
  enforceList?: boolean;
  recentSearches?: Array<{ query: string; url: string; timestamp: number }>;
  autofocus?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
  (e: 'select', v: string): void;
  (e: 'submit', v: string): void;
  (e: 'clear'): void;
  (e: 'focus'): void;
  (e: 'blur'): void;
  (e: 'recent-search-click', item: any): void;
  (e: 'remove-recent', query: string): void;
  (e: 'clear-history'): void;
}>();

/* ==========================================================================
   SINGLE SOURCE OF TRUTH (v-model proxy)
   ========================================================================== */

const displayValue = computed<string>({
    get: () => props.modelValue ?? '',
    set: v => emit('update:modelValue', v),
});

/* ==========================================================================
   State
   ========================================================================== */

const suggestions = ref<Suggestion[]>([]);
const showDropdown = ref(false);
const highlighted = ref(-1);
const fetching = ref(false);
const lastSelected = ref('');

/* User intent: should suggestions be allowed to open? */
const userInteracting = ref(false);

/* ==========================================================================
   Mode flags
   ========================================================================== */

const facetMode = computed(() => !!props.facetAttr);
const enforced = computed(() =>
    typeof props.enforceList === 'boolean' ? props.enforceList : facetMode.value
);

/* ==========================================================================
   A11y ids
   ========================================================================== */

const uid = Math.random().toString(36).slice(2);
const listboxId = `qa-listbox-${props.name || uid}`;
const optionId = (i: number) => `qa-opt-${uid}-${i}`;
const activeDescId = computed(() =>
    highlighted.value >= 0 ? optionId(highlighted.value) : undefined
);

/* ==========================================================================
   Debounce
   ========================================================================== */

let timer: ReturnType<typeof setTimeout> | null = null;

function debounce(fn: () => void, ms = 150) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
        timer = null;
        fn();
    }, ms);
}

function cancelDebounce() {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
}

/* ==========================================================================
   Fetching (token guarded)
   ========================================================================== */

const size = computed(() => Number(props.size ?? 10));
let fetchToken = 0;
const alive = ref(true);

onBeforeUnmount(() => {
    alive.value = false;
    fetchToken++;
    cancelDebounce();
});

async function fetchSuggestions(q: string): Promise<number> {
    const myToken = ++fetchToken;
    fetching.value = true;

    if (q.length < 2) {
        if (alive.value && myToken === fetchToken) {
            suggestions.value = defaultQuerySuggestions;
            fetching.value = false;
        }
        return myToken;
    }

    try {
        const body = facetMode.value
            ? { mode: 'facet', facetAttr: props.facetAttr, query: q.trim(), size: size.value }
            : { mode: 'query', query: q.trim(), size: size.value };

        const res = await $fetch<{ success: boolean; suggestions: Suggestion[] }>(
            '/api/elastic/suggestions',
            { method: 'POST', body }
        );

        if (!alive.value || myToken !== fetchToken) return myToken;
        suggestions.value = res?.success ? res.suggestions ?? [] : [];
        return myToken;
    } catch {
        if (!alive.value || myToken !== fetchToken) return myToken;
        suggestions.value = [];
        return myToken;
    } finally {
        if (alive.value && myToken === fetchToken) fetching.value = false;
    }
}

/* ==========================================================================
   Derived suggestions
   ========================================================================== */

const visibleSuggestions = computed(() => {
    if (props.recentSearches?.length) {
        const recent = props.recentSearches.map(r => ({
            text: r.query,
            type: 'recent',
            url: r.url,
        }));
        return [...recent, ...suggestions.value];
    }
    return suggestions.value;
});

/* ==========================================================================
   Messages
   ========================================================================== */

const noResultsMessage = computed(() =>
    props.noResultsText ??
  (displayValue.value.trim() ? t('noSuggestionsFound') : t('showSuggestions'))
);

/* ==========================================================================
   Input handlers
   ========================================================================== */

function onInput(v: any) {
    if (suppressNextInput.value) {
        suppressNextInput.value = false;
        return;
    }

    const val = typeof v === 'string' ? v : String(v ?? '');
    userInteracting.value = true;
    displayValue.value = val;

    debounce(async () => {
        const used = await fetchSuggestions(val);
        if (!alive.value || used !== fetchToken) return;
        if (!userInteracting.value) return;
        showDropdown.value = true;
        highlighted.value = -1;
    });
}

function onFocus() {
    emit('focus');
}

function onBlur() {
    cancelDebounce();
    fetchToken++;
    userInteracting.value = false;

    setTimeout(() => {
        showDropdown.value = false;
        highlighted.value = -1;

        if (enforced.value) {
            const exact = suggestions.value.some(s => s.text === displayValue.value);
            if (!exact) {
                displayValue.value = lastSelected.value;
            }
        }

        emit('blur');
    }, 120);
}

function onClear() {
    suppressNextInput.value = true;
    userInteracting.value = false;

    displayValue.value = '';
    suggestions.value = [];
    showDropdown.value = false;
    highlighted.value = -1;

    emit('clear');
}

function onSelect(s: Suggestion) {
    cancelDebounce();
    fetchToken++;

    userInteracting.value = false;
    showDropdown.value = false;
    highlighted.value = -1;
    suggestions.value = [];

    if (s.type === 'recent' && s.url) {
        emit('recent-search-click', { query: s.text, url: s.url });
        return;
    }

    suppressNextInput.value = true;   // 👈 CRITICAL
    displayValue.value = s.text;

    lastSelected.value = s.text;
    emit('select', s.text);
}

/* ==========================================================================
   Keyboard
   ========================================================================== */

function onKeydown(e: KeyboardEvent) {
    if (!['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Tab'].includes(e.key)) return;

    if (e.key === 'Tab') {
        userInteracting.value = false;
        showDropdown.value = false;
        highlighted.value = -1;
        return;
    }

    e.preventDefault();

    if (e.key === 'ArrowDown') {
        userInteracting.value = true;

        if (!showDropdown.value) {
            fetchSuggestions(displayValue.value).then(() => {
                if (!alive.value) return;
                showDropdown.value = true;
                highlighted.value = visibleSuggestions.value.length ? 0 : -1;
            });
        } else {
            highlighted.value = Math.min(
                highlighted.value + 1,
                visibleSuggestions.value.length - 1
            );
        }
    }

    if (e.key === 'ArrowUp') {
        highlighted.value = Math.max(highlighted.value - 1, 0);
    }

    if (e.key === 'Enter') {
        if (showDropdown.value && highlighted.value >= 0) {
            onSelect(visibleSuggestions.value[highlighted.value]);
            return;
        }
        emit('submit', displayValue.value);
        showDropdown.value = false;
        userInteracting.value = false;
    }

    if (e.key === 'Escape') {
        userInteracting.value = false;
        showDropdown.value = false;
    }
}

/* ==========================================================================
   Public API
   ========================================================================== */

function submit() {
    emit('submit', displayValue.value);
}

defineExpose({ submit });

/* ==========================================================================
   Icons
   ========================================================================== */

const iconMap = computed<IconMap>(() => ({ ...(props.iconMap || {}) }));

function iconClassFor(type: string) {
    const im = iconMap.value;
    const tt = type.toLowerCase();

    if (im[type]) return im[type];
    if (tt === 'recent') return 'formkit:history';
    if (tt.includes('title')) return im.title || 'tabler:letter-t';
    if (tt.includes('subject')) return im.subjects || 'tabler:tags';
    if (tt.includes('language')) return im.in_language_code || 'tabler:language';
    if (tt.includes('format')) return im.has_format_type || 'tabler:category';
    return 'tabler:search';
}

function typeLabel(type: string) {
    return t(type);
}
</script>
