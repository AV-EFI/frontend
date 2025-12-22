<template>
  <div class="relative w-full" @mousedown.stop>
    <div class="relative">
      <FormKit v-model="displayValue" type="text" :name="name" :placeholder="placeholder"
        :autofocus="autofocus ?? false" autocomplete="off" outer-class="!max-w-none w-full"
        inner-class="!rounded-xl !h-[56px] w-full dark:!bg-slate-950 dark:!text-white !rounded-r-none"
        input-class="!text-lg px-4 pr-10 w-full dark:!text-white !h-12"
        :prefix-icon="showInfoTooltip ? 'info' : undefined" :aria-label="ariaLabel" aria-autocomplete="list"
        aria-haspopup="listbox" :aria-owns="listboxId" :aria-expanded="showDropdown ? 'true' : 'false'"
        :aria-activedescendant="activeDescId" @input="onInput" @focus="onFocus" @blur="onBlur" @keydown="onKeydown">
        <template v-if="showInfoTooltip && infoTooltipText" #prefixIcon>
          <span class="formkit-icon relative group cursor-help my-auto flex justify-center" :title="infoTooltipText">
            <Icon name="tabler:info-circle" class="text-gray-500 dark:text-gray-300 text-xl" />
          </span>
        </template>
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
            <span v-if="visibleSuggestions.some(s => s.type !== 'recent')" class="sr-only" id="autocomplete-suggestions-heading">
                {{ $t('suggestions') }}
            </span>

            <!-- Recent searches header (only when input is empty) -->
            <div
                v-if="props.recentSearches && props.recentSearches.length > 0"
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
                <span v-if="visibleSuggestions.some(s => s.type === 'recent')" class="sr-only" id="recent-searches-heading">
                    {{ $t('recentSearches') }}
                </span>
                <span v-if="visibleSuggestions.some(s => s.type !== 'recent')" class="sr-only" id="autocomplete-suggestions-heading">
                    {{ $t('suggestions') }}
                </span>
                <!-- Original flat rendering -->
                <button v-for="(s, i) in visibleSuggestions" :id="optionId(i)" :key="s.type + '::' + s.text + '::' + i"
                    type="button" :class="[
                        'w-full text-left px-3 py-2 flex items-center gap-2 group',
                        'hover:bg-gray-100 dark:hover:bg-gray-700',
                        i === highlighted ? 'bg-gray-100 dark:bg-gray-700' : ''
                    ]"
                    role="option"
                    :aria-selected="i === highlighted"
                    :aria-label="`${typeLabel(s.type)}: ${s.text}`"
                    @mousedown.stop.prevent="onSelect(s)">
                    <Icon
                        v-if="s.type === 'recent'"
                        class="shrink-0 text-base leading-none"
                        name="tabler:history"
                        :title="typeLabel(s.type)"
                        aria-hidden="true"
                    />
                    <Icon
                        v-else-if="s.type === 'saved'"
                        class="shrink-0 text-base leading-none"
                        name="tabler:star"
                        :title="typeLabel(s.type)"
                        aria-hidden="true"
                    />
                    <Icon
                        v-else
                        class="shrink-0 text-base leading-none"
                        :name="iconClassFor(s.type, s.text)"
                        :title="typeLabel(s.type)"
                        aria-hidden="true"
                    />
                    <span class="sr-only">{{ typeLabel(s.type) }}: </span>
                    <span class="text-base truncate">{{ s.text }}</span>
                    <span v-if="s.count && s.count > 1" class="ml-auto text-xs text-gray-500 dark:text-gray-400 shrink-0">
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
const t = useI18n().t;
import defaultQuerySuggestions from '~/assets/data/default-query-suggestions.json';

type Suggestion = { text: string; type: string; count?: number }
type IconMap = Record<string, string>

const props = defineProps<{
  modelValue?: string
  name?: string
  placeholder?: string
  ariaLabel?: string
  clearTitle?: string
  showInfoTooltip?: boolean
  infoTooltipText?: string
  noResultsText?: string
  facetAttr?: string
  size?: number
  iconMap?: IconMap
  enforceList?: boolean
  recentSearches?: Array<{ query: string; url: string; timestamp: number }>
  autofocus?: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'select', v: string): void
  (e: 'submit', v: string): void
  (e: 'clear'): void
  (e: 'focus'): void
  (e: 'blur'): void
  (e: 'recent-search-click', item: any): void
  (e: 'remove-recent', query: string): void
  (e: 'clear-history'): void
}>();

// ======= State =======
const displayValue = ref(props.modelValue ?? '');
const lastSelected = ref<string>(props.modelValue ?? '');
const suggestions = ref<Suggestion[]>([]);
const showDropdown = ref(false);
const highlighted = ref(-1);
const fetching = ref(false);

// ======= Flags =======
const facetMode = computed(() => !!props.facetAttr);
const enforced = computed(() =>
    typeof props.enforceList === 'boolean' ? props.enforceList : facetMode.value
);

// ======= A11y =======
const uid = Math.random().toString(36).slice(2);
const listboxId = `qa-listbox-${props.name || uid}`;
const optionId = (i: number) => `qa-opt-${uid}-${i}`;
const activeDescId = computed(() =>
    highlighted.value >= 0 ? optionId(highlighted.value) : undefined
);

// ======= External model sync =======
watch(() => props.modelValue, (v) => {
    if (typeof v === 'string') {
        displayValue.value = v;
        lastSelected.value = v;
        // Fetch suggestions when modelValue changes externally
        if (v && v.trim() !== '') {
            fetchSuggestions(v);
        }
    }
});

// Fetch suggestions on mount if there's an initial value
onMounted(() => {
    if (displayValue.value && displayValue.value.trim() !== '') {
        fetchSuggestions(displayValue.value);
    }
});

// ======= Debounce (cancelable) =======
let timer: ReturnType<typeof setTimeout> | null = null;
function cancelDebounce() {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
}
function debounce(fn: () => void, ms = 150) {
    cancelDebounce();
    timer = setTimeout(() => {
        timer = null;
        fn();
    }, ms);
}

// ======= Freshness guards =======
const size = computed(() => Number(props.size ?? 10));
let fetchToken = 0;
const alive = ref(true);

onBeforeUnmount(() => {
    alive.value = false;
    cancelDebounce();
    fetchToken++; // invalidate any late responses
});

// ======= Reopen blocker (prevents pop-back) =======
const reopenBlockUntil = ref(0);
function blockReopen(ms = 350) {
    reopenBlockUntil.value = Date.now() + ms;
}
function canOpen() {
    return Date.now() >= reopenBlockUntil.value;
}

// ======= Fetch suggestions (token-guarded) =======
async function fetchSuggestions(q: string): Promise<number> {
    const myToken = ++fetchToken;
    fetching.value = true;

    if(q.length < 2) {
        if (alive.value && myToken === fetchToken) {
            suggestions.value = defaultQuerySuggestions;
            fetching.value = false;
        }
        return myToken;
    }

    try {
        const body: any = facetMode.value
            ? { mode: 'facet', facetAttr: props.facetAttr, query: q.trim(), size: size.value }
            : { mode: 'query', query: q.trim(), size: size.value };

        const res = await $fetch<{ success: boolean; suggestions: Suggestion[] }>(
            '/api/elastic/suggestions',
            { method: 'POST', body }
        );

        if (!alive.value || myToken !== fetchToken) return myToken;
        suggestions.value = res?.success && Array.isArray(res.suggestions) ? res.suggestions : [];
        return myToken;
    } catch {
        if (!alive.value || myToken !== fetchToken) return myToken;
        suggestions.value = [];
        return myToken;
    } finally {
        if (alive.value && myToken === fetchToken) fetching.value = false;
    }
}

// ======= Filtering =======
const visibleSuggestions = computed(() => {
    // Always show recent searches at the top if available
    if (props.recentSearches && props.recentSearches.length > 0) {
        const recentAsSuggestions = props.recentSearches.map(item => ({
            text: item.query,
            type: 'recent',
            url: item.url
        }));
        return [...recentAsSuggestions, ...suggestions.value];
    }
    return suggestions.value;
});

// ======= No results message =======
const noResultsMessage = computed(() => {
    if (props.noResultsText) return props.noResultsText;
    return displayValue.value?.trim() 
        ? t('noSuggestionsFound')
        : t('showSuggestions');
});

// ======= Input handlers =======
function onInput(v: any) {
    if (!v) {
        displayValue.value = '';
        if (enforced.value) lastSelected.value = '';
        emit('update:modelValue', '');
        debounce(async () => {
            const used = await fetchSuggestions('');
            if (!alive.value || used !== fetchToken || !canOpen()) return;
            showDropdown.value = true;
            highlighted.value = visibleSuggestions.value.length ? 0 : -1;
        });
        return;
    }

    const val = typeof v === 'string' ? v : String(v ?? '');
    displayValue.value = val;

    if (!enforced.value) emit('update:modelValue', val);

    debounce(async () => {
        const used = await fetchSuggestions(val);
        if (!alive.value || used !== fetchToken || !canOpen()) return;
        showDropdown.value = true;
        // Do NOT auto-highlight first item on input
        highlighted.value = -1;
    });
}

function onFocus() {
    // Don't automatically open dropdown on focus
    emit('focus');
}

function onBlur() {
    cancelDebounce();
    fetchToken++;       // invalidate in-flight requests
    // Delay closing so click on option can register
    setTimeout(() => {
        showDropdown.value = false;
        highlighted.value = -1;

        if (enforced.value) {
            const hasExact = suggestions.value.some(s => s.text === displayValue.value);
            if (hasExact) {
                lastSelected.value = displayValue.value;
                emit('update:modelValue', displayValue.value);
                emit('select', displayValue.value);
            } else if (lastSelected.value) {
                displayValue.value = lastSelected.value;
            }
        }
        // Don't update lastSelected in non-enforced mode - let the user clear the input
        emit('blur');
    }, 120);
}

function onClear() {
    displayValue.value = '';
    lastSelected.value = '';
    suggestions.value = [];
    showDropdown.value = false;
    highlighted.value = -1;
    emit('update:modelValue', '');
    emit('clear');
}

function onSelect(s: any) {
    // 1) Prevent any pending reopen
    blockReopen(400);
    cancelDebounce();
    fetchToken++;            // invalidate any in-flight fetch
    showDropdown.value = false;
    highlighted.value = -1;
    suggestions.value = [];  // optional: clear immediately

    // 2) If it's a recent search with URL, emit special event
    if (s.type === 'recent' && s.url) {
        // Only emit recent-search-click, do not update input value
        emit('recent-search-click', { query: s.text, url: s.url });
        return;
    }

    // 3) Apply value + emit for normal suggestions
    displayValue.value = s.text;
    lastSelected.value = s.text;
    emit('update:modelValue', s.text);
    emit('select', s.text);
    // (no-op; guarded by canOpen() in onFocus/onInput handlers)
}

// ======= Keys =======
function onKeydown(e: KeyboardEvent) {
    const key = e.key;
    if (!['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Tab'].includes(key)) return;
  
    // Handle Tab: close dropdown and allow default behavior (focus next element)
    if (key === 'Tab') {
        showDropdown.value = false;
        highlighted.value = -1;
        blockReopen(400); // prevent dropdown from reopening when focus moves
        cancelDebounce(); // cancel any pending fetch
        fetchToken++; // invalidate any in-flight requests
        return; // allow default Tab behavior
    }
  
    e.preventDefault();

    if (key === 'ArrowDown') {
        if (!showDropdown.value && canOpen()) {
            // Fetch suggestions if dropdown is closed and open it
            fetchSuggestions(displayValue.value || '').then(() => {
                if (alive.value) {
                    showDropdown.value = true;
                    highlighted.value = visibleSuggestions.value.length > 0 ? 0 : -1;
                }
            });
        } else if (showDropdown.value) {
            // Navigate down in the list
            if (highlighted.value < 0 && visibleSuggestions.value.length > 0) {
                highlighted.value = 0;
            } else {
                highlighted.value = Math.min(highlighted.value + 1, visibleSuggestions.value.length - 1);
            }
        }
    } else if (key === 'ArrowUp') {
        if (showDropdown.value) {
            highlighted.value = Math.max(highlighted.value - 1, 0);
        }
    } else if (key === 'Enter') {
        if (showDropdown.value && highlighted.value >= 0 && visibleSuggestions.value[highlighted.value]) {
            onSelect(visibleSuggestions.value[highlighted.value]);
            return;
        }
        if (enforced.value && showDropdown.value) {
            const exact = suggestions.value.find(s => s.text === displayValue.value);
            if (exact) {
                onSelect(exact);
                return;
            }
        }
        // Submit current display value regardless of dropdown state
        emit('submit', displayValue.value || '');
        showDropdown.value = false;
        blockReopen(400);
    } else if (key === 'Escape') {
        showDropdown.value = false;
        blockReopen(250); // avoid immediate reopen from stray focus
    }
}

// ======= Public submit() =======
function submit() {
    // Always submit current display value, not lastSelected
    emit('submit', displayValue.value || '');
}
defineExpose({ submit });

// ======= Icons =======
const iconMap = computed<IconMap>(() => ({
    ...(props.iconMap || {})
}));

function iconClassFor(typeOrFacet: string, _text: string) {
    const im = iconMap.value || {};
    if (im[typeOrFacet]) return im[typeOrFacet];

    const tt = (typeOrFacet || '').toLowerCase();
    if (tt === 'recent')          return 'formkit:history';
    if (tt.includes('title'))     return im.title            || 'tabler:letter-t';
    if (tt.includes('subject'))   return im.subjects         || 'tabler:tags';
    if (tt.includes('language'))  return im.in_language_code || 'tabler:language';
    if (tt.includes('format'))    return im.has_format_type  || 'tabler:category';
    return 'tabler:search';
}

function typeLabel(type: string) {
    return facetMode.value ? t(type) : t(type);
}
</script>
