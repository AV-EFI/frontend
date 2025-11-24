<template>
  <div
    class="relative w-full"
    @mousedown.stop
  >
    <FormKit
      v-model="displayValue"
      type="text"
      :name="name"
      :placeholder="placeholder"
      :autofocus="true"
      autocomplete="off"
      outer-class="!max-w-none w-full"
      inner-class="!rounded-xl !h-[56px] w-full dark:!bg-slate-950 dark:!text-white !rounded-r-none"
      input-class="!text-lg px-4 w-full dark:!text-white !h-12"
      :aria-label="ariaLabel"
      aria-autocomplete="list"
      aria-haspopup="listbox"
      :aria-owns="listboxId"
      :aria-expanded="showDropdown ? 'true' : 'false'"
      :aria-activedescendant="activeDescId"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeydown"
    />

    <!-- Suggestions dropdown -->
    <div
      v-show="showDropdown"
      :id="listboxId"
      class="absolute z-[1100] w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-64 overflow-auto"
      role="listbox"
      :aria-label="ariaLabel"
    >
      <template v-if="visibleSuggestions.length">
        <button
          v-for="(s, i) in visibleSuggestions"
          :id="optionId(i)"
          :key="s.type + '::' + s.text + '::' + i"
          type="button"
          :class="[
            'w-full text-left px-3 py-2 flex items-center gap-2',
            'hover:bg-gray-100 dark:hover:bg-gray-700',
            i === highlighted ? 'bg-gray-100 dark:bg-gray-700' : ''
          ]"
          role="option"
          :aria-selected="i === highlighted"
          @mousedown.stop.prevent="onSelect(s)"
        >
          <Icon
            class="shrink-0 text-base leading-none"
            :name="iconClassFor(s.type, s.text)"
            :title="typeLabel(s.type)"
            aria-hidden="true"
          />
          <span class="text-sm opacity-70 uppercase hidden">{{ typeLabel(s.type) }}</span>
          <span class="text-base truncate">{{ s.text }}</span>
        </button>
      </template>

      <div
        v-else
        class="px-3 py-2 text-sm text-gray-500 dark:text-gray-300 select-none"
      >
        {{ noResultsMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const t = useI18n().t;
import defaultQuerySuggestions from '~/assets/data/default-query-suggestions.json';

type Suggestion = { text: string; type: string }
type IconMap = Record<string, string>

const props = defineProps<{
  modelValue?: string
  name?: string
  placeholder?: string
  ariaLabel?: string
  noResultsText?: string
  facetAttr?: string
  size?: number
  iconMap?: IconMap
  enforceList?: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'select', v: string): void
  (e: 'submit', v: string): void
  (e: 'focus'): void
  (e: 'blur'): void
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
const visibleSuggestions = computed(() => suggestions.value);

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
    highlighted.value = visibleSuggestions.value.length ? 0 : -1;
  });
}

function onFocus() {
  // Do NOT immediately reopen if we just selected with mouse
  if (!canOpen()) return;
  // Open only if we have something to show (or we’ll fetch)
  if (!displayValue.value?.trim()) {
    fetchSuggestions('');
  }
  showDropdown.value = true;
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
      } else {
        displayValue.value = lastSelected.value || '';
      }
    }
    emit('blur');
  }, 120);
}

function onSelect(s: Suggestion) {
  // 1) Prevent any pending reopen
  blockReopen(400);
  cancelDebounce();
  fetchToken++;            // invalidate any in-flight fetch
  showDropdown.value = false;
  highlighted.value = -1;
  suggestions.value = [];  // optional: clear immediately

  // 2) Apply value + emit
  displayValue.value = s.text;
  lastSelected.value = s.text;
  emit('update:modelValue', s.text);
  emit('select', s.text);

  // 3) Make sure any immediate focus/keyup can't reopen
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
      highlighted.value = Math.min(highlighted.value + 1, visibleSuggestions.value.length - 1);
    }
  } else if (key === 'ArrowUp') {
    if (showDropdown.value) {
      highlighted.value = Math.max(highlighted.value - 1, 0);
    }
  } else if (key === 'Enter') {
    if (highlighted.value >= 0 && visibleSuggestions.value[highlighted.value]) {
      onSelect(visibleSuggestions.value[highlighted.value]);
      return;
    }
    if (enforced.value) {
      const exact = suggestions.value.find(s => s.text === displayValue.value);
      if (exact) onSelect(exact);
      return;
    }
    emit('submit', displayValue.value || '');
  } else if (key === 'Escape') {
    showDropdown.value = false;
    blockReopen(250); // avoid immediate reopen from stray focus
  }
}

// ======= Public submit() =======
function submit() {
  if (enforced.value) {
    if (lastSelected.value) emit('submit', lastSelected.value);
    return;
  }
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
