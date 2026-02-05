<template>
    <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
        <label class="text-sm font-semibold" for="poc-explorer-search">
            Werk suchen
        </label>
        <div class="flex gap-2">
            <input id="poc-explorer-search" v-model="localValue" type="search" :disabled="loading"
                placeholder="Titel, Person, Thema" class="input input-bordered input-sm md:input-md w-full"
                @keyup.enter.prevent="onSubmit" />
            <button type="submit" class="btn btn-primary btn-sm md:btn-md" :disabled="loading || !localValue">
                <span v-if="loading" class="loading loading-spinner loading-xs" aria-hidden="true" />
                <span v-else>Suchen</span>
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
    modelValue: string;
    loading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'search', value: string): void;
}>();

const localValue = ref(props.modelValue ?? '');

watch(() => props.modelValue, (value) => {
    if (value !== localValue.value) {
        localValue.value = value ?? '';
    }
});

watch(localValue, (value) => {
    emit('update:modelValue', value);
});

const loading = computed(() => props.loading === true);

const onSubmit = () => {
    if (loading.value) {
        return;
    }
    emit('search', localValue.value.trim());
};
</script>
