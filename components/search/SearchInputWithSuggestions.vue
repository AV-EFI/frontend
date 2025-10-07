<template>
  <div class="relative w-full">
    <!-- Search Input -->
    <input
      :id="inputId"
      ref="searchInputRef"
      v-model="localValue"
      type="search"
      :aria-label="ariaLabel"
      autocomplete="off"
      :class="inputClass"
      :placeholder="placeholder"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
      @keyup.enter="handleEnter"
    >

    <!-- Search Suggestions Dropdown -->
    <div
      v-if="showSearchSuggestions && searchSuggestions.length > 0"
      class="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto"
      role="listbox"
      :aria-label="$t('searchSuggestions')"
    >
      <ul class="py-1">
        <li
          v-for="(suggestion, index) in searchSuggestions"
          :key="`${suggestion.text}-${suggestion.type}-${index}`"
          class="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
          role="option"
          :class="{ 'bg-gray-100 dark:bg-gray-700': selectedIndex === index }"
          @mousedown.prevent="selectSuggestion(suggestion.text)"
          @mouseenter="selectedIndex = index"
        >
          <span class="text-gray-800 dark:text-gray-200">{{ suggestion.text }}</span>
          <span 
            class="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
          >
            {{ $t(`searchFieldType.${suggestion.type.toLowerCase()}`) }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSearchSuggestions } from '@/composables/useSearchSuggestions';

interface Props {
  modelValue?: string;
  placeholder?: string;
  ariaLabel?: string;
  inputClass?: string;
  inputId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  ariaLabel: 'Search',
  inputClass: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
  inputId: 'search-input'
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'input': [value: string];
  'enter': [value: string];
}>();

// Local reactive value
const localValue = ref(props.modelValue);
const searchInputRef = ref<HTMLInputElement>();
const selectedIndex = ref(-1);

// Use search suggestions composable
const {
  searchSuggestions,
  showSearchSuggestions,
  handleSearchFocus,
  handleSearchBlur,
  handleSearchInput,
  selectSearchSuggestion
} = useSearchSuggestions();

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue;
});

// Watch for local changes and emit them
watch(localValue, (newValue) => {
  emit('update:modelValue', newValue);
});

// Handle input events
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;
  localValue.value = value;
  selectedIndex.value = -1;
  
  // Handle search suggestions
  handleSearchInput(localValue);
  
  // Emit input event
  emit('input', value);
};

// Handle focus
const handleFocus = () => {
  handleSearchFocus(localValue);
};

// Handle blur
const handleBlur = () => {
  handleSearchBlur();
};

// Handle Enter key
const handleEnter = () => {
  if (selectedIndex.value >= 0 && searchSuggestions.value[selectedIndex.value]) {
    selectSuggestion(searchSuggestions.value[selectedIndex.value].text);
  } else {
    emit('enter', localValue.value);
  }
};

// Handle keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (!showSearchSuggestions.value || searchSuggestions.value.length === 0) return;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      selectedIndex.value = Math.min(selectedIndex.value + 1, searchSuggestions.value.length - 1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
      break;
    case 'Escape':
      event.preventDefault();
      showSearchSuggestions.value = false;
      selectedIndex.value = -1;
      searchInputRef.value?.blur();
      break;
    case 'Tab':
      showSearchSuggestions.value = false;
      selectedIndex.value = -1;
      break;
  }
};

// Select a suggestion
const selectSuggestion = (suggestionText: string) => {
  selectSearchSuggestion(suggestionText, localValue);
  showSearchSuggestions.value = false;
  selectedIndex.value = -1;
  
  // Emit the selection
  emit('enter', suggestionText);
};

// Expose focus method for external use
defineExpose({
  focus: () => searchInputRef.value?.focus(),
  blur: () => searchInputRef.value?.blur()
});
</script>

<style scoped>
/* Custom styles for the search input component */
.search-input-wrapper {
  position: relative;
}
</style>
