<template>
    <section class="rounded-box bg-base-200 p-4">
        <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold uppercase tracking-wide">{{ $t('pocContextTrayTitle') }}</h3>
            <button type="button" class="btn btn-ghost btn-xs" :disabled="chips.length === 0" @click="$emit('clear')">
                {{ $t('pocContextTrayClear') }}
            </button>
        </div>
        <p class="mt-2 text-xs text-base-content/70">
            {{ $t('pocContextTrayDescription') }}
        </p>
        <div v-if="chips.length" class="mt-3 flex flex-wrap gap-2">
            <span v-for="chip in chips" :key="chip.id" class="badge badge-outline gap-2">
                <span>{{ chip.label }}</span>
                <button type="button" class="btn btn-circle btn-ghost btn-xs" :aria-label="$t('pocContextTrayRemove', { label: chip.label })"
                        @click="$emit('remove', chip.id)">
                    x
                </button>
            </span>
        </div>
        <p v-else class="mt-3 text-sm text-base-content/70">
            {{ $t('pocContextTrayEmpty') }}
        </p>
    </section>
</template>

<script setup lang="ts">
import type { ChatChip } from '~/composables/poc/usePocApi';

defineProps<{
    chips: ChatChip[];
}>();

defineEmits<{
    (e: 'remove', id: string): void;
    (e: 'clear'): void;
}>();
</script>
