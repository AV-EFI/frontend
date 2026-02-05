<template>
    <section class="rounded-box bg-base-200 p-4">
        <h3 class="text-sm font-semibold uppercase tracking-wide">Chat</h3>
        <div class="mt-3 flex flex-col gap-2 max-h-64 overflow-y-auto" aria-live="polite">
            <p v-if="messages.length === 0" class="text-sm text-base-content/70">
                Noch keine Unterhaltung. Ergänzen Sie den Kontext und stellen Sie eine Frage.
            </p>
            <div v-for="message in messages" :key="message.id" class="rounded-box bg-base-100 p-2 text-sm" :class="message.author === 'user' ? 'self-end bg-primary text-primary-content' : 'self-start'
                ">
                <p>{{ message.text }}</p>
                <ul v-if="message.sources?.length" class="mt-1 flex flex-wrap gap-1 text-xs">
                    <li v-for="source in message.sources" :key="source.id" class="badge badge-outline badge-xs">
                        {{ source.label }}
                    </li>
                </ul>
            </div>
        </div>
        <form class="mt-4 flex flex-col gap-2" @submit.prevent="submit">
            <label class="text-xs font-semibold uppercase tracking-wide" for="poc-chat-input">Nachricht</label>
            <textarea id="poc-chat-input" v-model="draft" rows="3" class="textarea textarea-bordered"
                :disabled="sending" placeholder="Kurze Frage zum ausgewählten Kontext" />
            <button type="submit" class="btn btn-secondary btn-sm self-end"
                :disabled="sending || draft.trim().length === 0">
                <span v-if="sending" class="loading loading-spinner loading-xs" aria-hidden="true" />
                <span v-else>Senden</span>
            </button>
        </form>
    </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { ChatMessage } from '~/stores/pocExplorerStore';

const props = defineProps<{
    messages: ChatMessage[];
    sending: boolean;
}>();

const emit = defineEmits<{
    (e: 'send', message: string): void;
}>();

const draft = ref('');

watch(
    () => props.sending,
    (isSending) => {
        if (!isSending) {
            draft.value = '';
        }
    },
);

const submit = () => {
    if (props.sending || draft.value.trim().length === 0) {
        return;
    }
    emit('send', draft.value.trim());
};
</script>
