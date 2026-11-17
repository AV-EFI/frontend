<template>
    <div class="text-base flex items-center w-full py-1.5 px-2.5 rounded-md border border-slate-300 bg-white focus-within:ring-1 focus-within:!ring-bali-hai-400 focus-within:!border-bali-hai-400 shadow-none dark:bg-transparent dark:border-slate-500">
        <input
            ref="inputElement"
            v-bind="$attrs"
            type="number"
            :value="displayedText"
            class="appearance-none [color-scheme:light] dark:[color-scheme:dark] selection:text-slate-700 text-base text-slate-700 min-w-0 min-h-[1.5em] grow outline-hidden bg-transparent selection:bg-bali-hai-100 placeholder:text-slate-400 dark:placeholder-slate-400/50 dark:text-slate-300 border-none p-0 focus:ring-0"
            @input="handleInput"
        >
    </div>
</template>

<script setup lang="ts">
/*
 * Native replacement for the FormKit input `type="number" number="integer"` (FormKit 1.7) and its theme
 * classes. It reproduces that input's model behaviour so callers keep working unchanged:
 * - every entry is parsed with parseInt; an empty or non-numeric entry becomes undefined,
 * - after each keystroke the field shows the parsed value (e.g. "1950.7" becomes "1950"),
 * - the model updates 20 ms after typing stops, or immediately when the parsed value is unchanged,
 * - a model change from outside updates the field unless it is the value this field emitted last.
 */
import { onBeforeUnmount, ref, watch } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps<{ modelValue?: number }>();
const emit = defineEmits<{ 'update:modelValue': [value: number | undefined] }>();

const COMMIT_DELAY_MS = 20;

function toInteger(value: unknown): number | undefined {
    if (value === '') return undefined;
    const parsed = parseInt(String(value), 10);
    return Number.isFinite(parsed) ? parsed : undefined;
}

function toText(value: number | undefined): string {
    return value === undefined ? '' : String(value);
}

const inputElement = ref<HTMLInputElement | null>(null);
let committedValue = toInteger(props.modelValue);
let pendingValue = committedValue;
let lastEmittedValue: number | undefined;
let commitTimer: ReturnType<typeof setTimeout> | undefined;
const displayedText = ref(toText(committedValue));

function emitValue(value: number | undefined) {
    lastEmittedValue = value;
    emit('update:modelValue', value);
}

function commit() {
    committedValue = pendingValue;
    emitValue(committedValue);
}

function receive(value: number | undefined, debounce: boolean) {
    pendingValue = value;

    // Only replace the text when it differs, so an incomplete entry such as "19e" stays visible.
    const text = toText(value);
    displayedText.value = text;
    if (inputElement.value && inputElement.value.value !== text) inputElement.value.value = text;

    if (value === committedValue) {
        emitValue(committedValue);
        return;
    }
    if (!debounce) {
        commit();
        return;
    }
    clearTimeout(commitTimer);
    commitTimer = setTimeout(commit, COMMIT_DELAY_MS);
}

function handleInput(event: Event) {
    receive(toInteger((event.target as HTMLInputElement).value), true);
}

watch(() => props.modelValue, (value) => {
    if (value === lastEmittedValue) return;
    receive(toInteger(value), false);
});

if (committedValue !== props.modelValue) emitValue(committedValue);

onBeforeUnmount(() => clearTimeout(commitTimer));
</script>
