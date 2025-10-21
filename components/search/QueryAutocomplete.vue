<template>
  <div class="relative w-full" @mousedown.stop>
    <!-- Input only (button separated) -->
    <FormKit
      v-model="displayValue"
      type="text"
      :name="name"
      :placeholder="placeholder"
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
      v-if="showDropdown"
      class="absolute z-[1100] w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-64 overflow-auto"
      role="listbox"
      :id="listboxId"
      :aria-label="ariaLabel"
    >
      <template v-if="visibleSuggestions.length">
        <button
          v-for="(s, i) in visibleSuggestions"
          :id="optionId(i)"
          :key="s.type + '::' + s.text + '::' + i"
          type="button"
          class="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
          role="option"
          :aria-selected="i === highlighted"
          @mousedown.prevent="onSelect(s)"
        >
          <!-- Icon (from iconMap; falls back if missing) -->
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

      <div v-else class="px-3 py-2 text-sm text-gray-500 dark:text-gray-300 select-none">
        {{ noResultsText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const t = useI18n().t

/** A single suggestion returned by the backend */
type Suggestion = { text: string; type: string }
type IconMap = Record<string, string>

const props = defineProps<{
  modelValue?: string
  /** name/id for input */
  name?: string
  placeholder?: string
  ariaLabel?: string
  noResultsText?: string

  /**
   * If provided, component runs in FACET mode and restricts final selection to list values.
   * Example: facetAttr="has_form"
   */
  facetAttr?: string

  /** Max suggestions returned (default 10) */
  size?: number

  /**
   * Optional icon map (overrides default). Import from your IFacetIconMapping.ts and pass here.
   * Example: :icon-map="IFacetIconMapping"
   */
  iconMap?: IconMap

  /** Enforce dropdown-only selection. Defaults to true in facet mode, false otherwise. */
  enforceList?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  /** fired when a list item is chosen (always emitted for facets; for queries only when user picks an item) */
  (e: 'select', v: string): void
  /** fired when user presses Enter without picking (queries only, unless allowExactMatchOnEnter finds a match) */
  (e: 'submit', v: string): void
  (e: 'focus'): void
  (e: 'blur'): void
}>()

// ======= State =======
const displayValue = ref(props.modelValue ?? '')            // what user sees/edits
const lastSelected = ref<string>(props.modelValue ?? '')     // last confirmed selection (esp. in facet mode)
const suggestions = ref<Suggestion[]>([])
const showDropdown = ref(false)
const highlighted = ref(-1)
const fetching = ref(false)

// ======= Behavior flags =======
const facetMode = computed(() => !!props.facetAttr)
const enforced = computed(() =>
  typeof props.enforceList === 'boolean'
    ? props.enforceList
    : facetMode.value // default true for facets
)

// ======= Accessibility helpers =======
const uid = Math.random().toString(36).slice(2)
const listboxId = `qa-listbox-${props.name || uid}`
const optionId = (i: number) => `qa-opt-${uid}-${i}`
const activeDescId = computed(() => (highlighted.value >= 0 ? optionId(highlighted.value) : undefined))

// ======= Watch external model changes =======
watch(
  () => props.modelValue,
  (v) => {
    if (typeof v === 'string') {
      displayValue.value = v
      lastSelected.value = v
    }
  }
)

// ======= Debounce =======
let timer: any = null
function debounce(fn: () => void, ms = 150) {
  clearTimeout(timer)
  timer = setTimeout(fn, ms)
}

// ======= Fetch suggestions (unified endpoint) =======
async function fetchSuggestions(q: string) {
  fetching.value = true
  try {
    const body: any = facetMode.value
      ? { mode: 'facet', facetAttr: props.facetAttr, query: q.trim(), size: size.value }
      : { mode: 'query', query: q.trim(), size: size.value }

    const res = await $fetch<{ success: boolean; suggestions: Suggestion[] }>('/api/elastic/suggestions', {
      method: 'POST',
      body
    })
    suggestions.value = res?.success && Array.isArray(res.suggestions) ? res.suggestions : []
  } catch {
    suggestions.value = []
  } finally {
    fetching.value = false
  }
}

const size = computed(() => Number(props.size ?? 10))

// Allow client-side filtering as you type (cheap, responsive)
const visibleSuggestions = computed(() => {
  const q = displayValue.value?.trim().toLowerCase()
  if (!q) return suggestions.value
  return suggestions.value.filter(s => s.text.toLowerCase().includes(q))
})

// ======= Input handlers =======
function onInput(v: any) {
  const val = typeof v === 'string' ? v : String(v ?? '')
  displayValue.value = val

  // Only emit v-model updates immediately in QUERY mode or when not enforced
  if (!enforced.value) emit('update:modelValue', val)

  debounce(async () => {
    await fetchSuggestions(val)
    showDropdown.value = true
    highlighted.value = visibleSuggestions.value.length ? 0 : -1
  })
}

function onFocus() {
  showDropdown.value = true
  emit('focus')
  // Load top suggestions on empty
  if (!displayValue.value?.trim()) {
    fetchSuggestions('')
  }
}

function onBlur() {
  // Delay closing so click on option can register
  setTimeout(() => {
    showDropdown.value = false
    highlighted.value = -1

    // If enforced (facet mode): snap back to lastSelected if current is not a valid option
    if (enforced.value) {
      const hasExact = suggestions.value.some(s => s.text === displayValue.value)
      if (hasExact) {
        // accept typed exact match even if not clicked
        lastSelected.value = displayValue.value
        emit('update:modelValue', displayValue.value)
        emit('select', displayValue.value)
      } else {
        displayValue.value = lastSelected.value || ''
      }
    }
    emit('blur')
  }, 150)
}

function onSelect(s: Suggestion) {
  displayValue.value = s.text
  lastSelected.value = s.text
  emit('update:modelValue', s.text)
  emit('select', s.text)
  nextTick(() => {
    showDropdown.value = false
  });
  highlighted.value = -1
}

// ENTER / ESC / ARROWS
function onKeydown(e: KeyboardEvent) {
  const key = e.key
  if (!['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Tab'].includes(key)) return
  if (key !== 'Tab') e.preventDefault()

  if (key === 'ArrowDown') {
    if (!showDropdown.value) showDropdown.value = true
    highlighted.value = Math.min(highlighted.value + 1, visibleSuggestions.value.length - 1)
  } else if (key === 'ArrowUp') {
    highlighted.value = Math.max(highlighted.value - 1, 0)
  } else if (key === 'Enter') {
    if (highlighted.value >= 0 && visibleSuggestions.value[highlighted.value]) {
      onSelect(visibleSuggestions.value[highlighted.value])
      return
    }
    // If enforced, only allow submit when the current text matches an exact option
    if (enforced.value) {
      const exact = suggestions.value.find(s => s.text === displayValue.value)
      if (exact) {
        onSelect(exact)
      }
      // else ignore Enter
      return
    }
    // Query mode: submit raw text (no selection)
    emit('submit', displayValue.value || '')
  } else if (key === 'Escape') {
    showDropdown.value = false
  }
}

// ======= Public submit() for external button =======
function submit() {
  if (enforced.value) {
    // in facets: submit only when a valid selection exists
    if (lastSelected.value) {
      emit('submit', lastSelected.value)
    }
    return
    }
  emit('submit', displayValue.value || '')
}
defineExpose({ submit })

// ======= Icons =======
const iconMap = computed<IconMap>(() => ({
  ...(props.iconMap || {})
}))

function iconClassFor(typeOrFacet: string, text: string) {
  // 1) exact type/facet name
  console.log('iconClassFor', typeOrFacet, text , iconMap.value);
  if (iconMap.value[typeOrFacet]) return iconMap.value[typeOrFacet]

  // 2) simple heuristics on name

  const t = typeOrFacet.toLowerCase()
  if (t.includes('title')) return iconMap.value.title
  if (t.includes('subject')) return iconMap.value.subjects
  if (t.includes('language')) return iconMap.value.in_language_code
  if (t.includes('format')) return iconMap.value.has_format_type
  return 'tabler:search'
}

// labels
function typeLabel(type: string) {
  // You can wire i18n here if needed; keeping neutral and short:
  return facetMode.value ? t(type) : t(type)
}
</script>
