<template>
    <!--
        Headless dropdown base component.
        Manages open state, aria-expanded, aria-controls, Escape-close, and
        click-outside-close in one place.

        Replaces the manual open/close patterns in:
          ExportDataComp, ActionContextComp, NavBar settings menu.

        Usage:
          <GlobalDropdownMenu align="right" width="w-48" :menu-label="$t('exportOptions')">
            <template #trigger="{ triggerAttrs, toggle }">
              <button class="btn btn-primary btn-sm" v-bind="triggerAttrs" @click="toggle">
                Export
              </button>
            </template>

            <template #content="{ close }">
              <ul role="menu">
                <li role="none">
                  <button role="menuitem" class="…" @click="doThing(); close()">CSV</button>
                </li>
              </ul>
            </template>
          </GlobalDropdownMenu>

        v-model support:
          <GlobalDropdownMenu v-model="isOpen" …>
    -->
    <div ref="containerRef" class="relative inline-block">
        <!-- Trigger slot: receives open state + control functions + aria attrs -->
        <slot
            name="trigger"
            :open="isOpen"
            :toggle="toggle"
            :close="close"
            :trigger-attrs="triggerAttrs"
        />

        <Transition
            enter-active-class="transition ease-out duration-100 origin-top-right"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75 origin-top-right"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
        >
            <div
                v-if="isOpen"
                :id="menuId"
                role="menu"
                :aria-label="menuLabel"
                class="absolute z-30 mt-1 bg-base-100 border border-base-200 rounded-lg shadow-lg"
                :class="[alignClass, widthClass]"
                @keydown.escape.prevent="close"
            >
                <!-- Content slot: receives close() so individual items can close the menu -->
                <slot name="content" :close="close" />
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        /** aria-label for the menu container element */
        menuLabel?: string
        /** Which side the menu opens from */
        align?: 'left' | 'right'
        /** Tailwind width class for the dropdown panel */
        width?: string
        /** Optional controlled open state (v-model) */
        modelValue?: boolean
    }>(),
    {
        align: 'right',
        width: 'w-48',
        modelValue: undefined,
    },
)

const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): void
    (e: 'open'): void
    (e: 'close'): void
}>()

// Unique id for aria-controls wiring.
const menuId = useId()

// Internal open state used when not controlled via v-model.
const internalOpen = ref(false)

const isOpen = computed({
    get: () => (props.modelValue !== undefined ? props.modelValue : internalOpen.value),
    set: (val: boolean) => {
        internalOpen.value = val
        emit('update:modelValue', val)
        val ? emit('open') : emit('close')
    },
})

const toggle = () => {
    isOpen.value = !isOpen.value
}
const close = () => {
    isOpen.value = false
}
const openMenu = () => {
    isOpen.value = true
}

const alignClass = computed(() => (props.align === 'right' ? 'right-0' : 'left-0'))
const widthClass = computed(() => props.width)

/**
 * Slot prop object to spread onto the trigger button:
 *   <button v-bind="triggerAttrs" @click="toggle">…</button>
 */
const triggerAttrs = computed(() => ({
    'aria-haspopup': 'menu' as const,
    'aria-expanded': isOpen.value ? ('true' as const) : ('false' as const),
    'aria-controls': menuId,
}))

// Click-outside: close when a click lands outside the container.
const containerRef = ref<HTMLElement | null>(null)

function onDocumentClick(e: MouseEvent) {
    if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
        close()
    }
}

onMounted(() => document.addEventListener('click', onDocumentClick, true))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick, true))

// Expose imperative controls to parent if needed.
defineExpose({ open: openMenu, close, toggle, isOpen })
</script>
