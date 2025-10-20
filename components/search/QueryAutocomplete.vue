<template>
  <div class="relative w-full" @mousedown.stop>
    <FormKit
      v-model="innerValue"
      type="text"
      :name="name"
      :placeholder="placeholder"
      autocomplete="off"
      outer-class="!max-w-none w-full"
      inner-class="!rounded-l-xl rounded-r-none dark:!bg-slate-950 dark:!text-white !h-[56px] w-full"
      input-class="!text-lg p-2 w-full dark:!text-white"
      :aria-label="ariaLabel"
      aria-required="true"
      :aria-invalid="(innerValue || '').trim().length === 0 ? 'true' : 'false'"
      :help="showTooltip ? helpText : ''"
      :help-class="'absolute text-sm text-gray-800 bg-white p-2 rounded-md shadow dark:text-white dark:bg-gray-700'"
      @input="handleInput"
      @focus="onFocus"
      @blur="onBlur"
    >
      <template #prefix>
        <span
          class="ml-2 cursor-pointer select-none text-neutral-500 dark:text-neutral-300 text-sm"
          tabindex="0"
          role="button"
          aria-label="Info"
          @mouseenter="showTooltip = true"
          @mouseleave="showTooltip = false"
          @focus="showTooltip = true"
          @blur="showTooltip = false"
        >
          ⓘ
        </span>

        <!-- ▼ opens top suggestions even with empty text -->
        <button
          type="button"
          class="ml-2 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs hover:bg-gray-300 dark:hover:bg-gray-600"
          :aria-label="dropdownAriaLabel"
          @mousedown.prevent.stop="openTop"
        >
          ▼
        </button>
      </template>
    </FormKit>

    <!-- Dropdown -->
    <div
      v-if="showDropdown"
      class="absolute z-[1050] w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-56 overflow-y-auto"
      @mousedown.stop
    >
      <template v-if="suggestions && suggestions.length">
        <div
          v-for="(s, i) in suggestions.slice(0, 12)"
          :key="`qa-sugg-${i}-${s.type}-${s.text}`"
          class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm flex items-center justify-between"
          @mousedown.prevent.stop="select(s.text)"
        >
          <span class="text-gray-800 dark:text-gray-200 truncate">{{ s.text }}</span>
          <span class="ml-2 flex items-center gap-2 flex-shrink-0">
            <Icon
              :name="getFacetIcon(s.type)"
              size="16"
              class="text-neutral-500 dark:text-neutral-300"
              :aria-label="typeLabel(s.type)"
            />
          </span>
        </div>
      </template>
      <template v-else>
        <div class="px-3 py-2 text-sm text-neutral-600 dark:text-neutral-300 text-center">
          {{ noResultsText }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getFacetIcon } from '~/models/interfaces/manual/IFacetIconMapping'

const { t } = useI18n()

type Suggestion = { text: string; type: string }

const props = defineProps<{
  modelValue: string
  placeholder?: string
  name?: string
  ariaLabel?: string
  helpText?: string
  dropdownAriaLabel?: string
  noResultsText?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'select', v: string): void
  (e: 'focus'): void
  (e: 'blur'): void
}>()

const showTooltip = ref(false)
const showDropdown = ref(false)
const suggestions = ref<Suggestion[]>([])

// local v-model bridge (robust with FormKit)
const innerValue = ref(props.modelValue ?? '')

watch(() => props.modelValue, (nv) => {
  if (nv !== innerValue.value) innerValue.value = nv ?? ''
})

watch(innerValue, (nv) => {
  // propagate upward so parent (and store) updates instantly
  emit('update:modelValue', nv ?? '')
})

async function fetchMain(query: string) {
  try {
    const res = await $fetch<{ success: boolean; suggestions: Suggestion[] }>(
      '/api/elastic/suggestions',
      { method: 'POST', body: { mode: 'query', query, size: 10 } }
    )
    suggestions.value = (res?.success && res?.suggestions) ? res.suggestions : []
  } catch {
    suggestions.value = []
  }
}

async function openTop() {
  showDropdown.value = true
  await fetchMain('') // top suggestions
}

async function handleInput(v: any) {
  // FormKit emits the plain value; ensure string
  const val = typeof v === 'string' ? v : String(v ?? '')
  innerValue.value = val
  await fetchMain(val)
  showDropdown.value = true
}
async function onFocus() {
  showDropdown.value = true
  await fetchMain(innerValue.value || '')
  emit('focus')
}
function onBlur() {
  setTimeout(() => { showDropdown.value = false }, 150)
  emit('blur')
}
function select(v: string) {
  innerValue.value = v
  emit('select', v)
  showDropdown.value = false
}
function typeLabel(type: string) {
  try { return t(`searchFieldType.${type}`) } catch { return type }
}
</script>
