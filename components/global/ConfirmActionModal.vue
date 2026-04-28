<template>
    <!--
        Generic confirmation modal for destructive or irreversible actions.
        Teleports to <body> and traps focus between Cancel and the primary action.

        Usage:
          <GlobalConfirmActionModal
            :open="showConfirm"
            :title="$t('clearComparisonList')"
            :description="$t('clearComparisonListDesc')"
            variant="danger"
            @confirm="doClear"
            @cancel="showConfirm = false"
          />
    -->
    <Teleport to="body">
        <Transition
            enter-active-class="transition ease-out duration-150"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <dialog
                v-if="open"
                class="modal modal-open"
                role="dialog"
                aria-modal="true"
                :aria-labelledby="titleId"
                :aria-describedby="description ? descId : undefined"
                @keydown.escape.prevent="emit('cancel')"
            >
                <div class="modal-box" @keydown.tab="trapFocus">
                    <!-- Icon -->
                    <div class="flex items-center gap-3 mb-4">
                        <Icon
                            :name="iconName"
                            class="h-6 w-6 shrink-0"
                            :class="iconClass"
                            aria-hidden="true"
                        />
                        <h3 :id="titleId" class="font-bold text-lg" :class="titleClass">
                            {{ title }}
                        </h3>
                    </div>

                    <p
                        v-if="description"
                        :id="descId"
                        class="text-sm text-base-content/70 mb-6"
                    >
                        {{ description }}
                    </p>

                    <div class="modal-action mt-0">
                        <button
                            ref="cancelRef"
                            class="btn btn-ghost"
                            @click="emit('cancel')"
                        >
                            {{ cancelLabel ?? $t('cancel') }}
                        </button>
                        <button
                            ref="confirmRef"
                            class="btn"
                            :class="confirmClass"
                            @click="emit('confirm')"
                        >
                            {{ confirmLabel ?? $t('confirm') }}
                        </button>
                    </div>
                </div>

                <!-- Click backdrop to cancel -->
                <form method="dialog" class="modal-backdrop" @click="emit('cancel')" />
            </dialog>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

const props = withDefaults(
    defineProps<{
        open: boolean
        title: string
        description?: string
        confirmLabel?: string
        cancelLabel?: string
        /** 'danger' = red confirm, 'warning' = yellow, 'info' = primary (default) */
        variant?: 'danger' | 'warning' | 'info'
    }>(),
    {
        variant: 'info',
    },
)

const emit = defineEmits<{
    (e: 'confirm'): void
    (e: 'cancel'): void
}>()

const titleId = useId()
const descId = useId()

const cancelRef = ref<HTMLButtonElement | null>(null)
const confirmRef = ref<HTMLButtonElement | null>(null)

// Move focus to the cancel button when the dialog opens.
watch(
    () => props.open,
    async (val) => {
        if (val) {
            await nextTick()
            cancelRef.value?.focus()
        }
    },
)

// Minimal focus trap: Tab cycles between Cancel and Confirm only.
function trapFocus(e: KeyboardEvent) {
    const focusable = [cancelRef.value, confirmRef.value].filter(Boolean) as HTMLElement[]
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
    }
}

const iconName = computed(
    () =>
        ({ danger: 'tabler:alert-triangle', warning: 'tabler:alert-circle', info: 'tabler:info-circle' })[
            props.variant
        ],
)

const iconClass = computed(() => ({
    'text-error': props.variant === 'danger',
    'text-warning': props.variant === 'warning',
    'text-info': props.variant === 'info',
}))

const titleClass = computed(() => ({
    'text-error': props.variant === 'danger',
    'text-warning': props.variant === 'warning',
}))

const confirmClass = computed(() => ({
    'btn-error': props.variant === 'danger',
    'btn-warning': props.variant === 'warning',
    'btn-primary': props.variant === 'info',
}))
</script>
