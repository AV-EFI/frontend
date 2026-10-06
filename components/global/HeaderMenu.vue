<template>
    <div
        ref="rootRef"
        class="dropdown dropdown-end flex w-full items-center"
        :class="[inline ? 'flex-col items-stretch' : 'h-full', { 'dropdown-open': open }]"
        @focusout="onFocusOut"
        @keydown.esc="closeAndRefocus"
    >
        <!-- Disclosure: Enter/Space toggles, aria-expanded reflects the real state. -->
        <button
            ref="buttonRef"
            type="button"
            class="header-menu-trigger w-full"
            :aria-expanded="open"
            :aria-controls="panelId"
            @click.stop="open = !open"
        >
            <Icon :name="icon" class="icon-action" aria-hidden="true" />
            <span>{{ label }}</span>
            <Icon :name="open ? 'tabler:chevron-up' : 'tabler:chevron-down'" class="icon-inline" aria-hidden="true" />
        </button>
        <ul
            v-show="open"
            :id="panelId"
            class="menu"
            :class="inline ? 'w-full p-0' : ['dropdown-content top-full mt-2 bg-base-100 rounded-box z-10 shadow-sm', panelClass]"
            :aria-label="panelLabel"
        >
            <slot />
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue';

defineProps<{
    icon: string;
    label: string;
    panelLabel: string;
    panelClass?: string;
    /** Expand in the document flow instead of as a floating panel (used inside the mobile menu). */
    inline?: boolean;
}>();

const open = defineModel<boolean>('open', { default: false });

const panelId = `header-menu-${useId()}`;
const rootRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLButtonElement | null>(null);

const onFocusOut = (event: FocusEvent) => {
    const next = event.relatedTarget;
    if (open.value && next instanceof Node && !rootRef.value?.contains(next)) {
        open.value = false;
    }
};

const closeAndRefocus = async () => {
    if (!open.value) return;
    open.value = false;
    await nextTick();
    buttonRef.value?.focus();
};

const onDocumentClick = (event: MouseEvent) => {
    const target = event.target;
    if (open.value && target instanceof Node && !rootRef.value?.contains(target)) {
        open.value = false;
    }
};

onMounted(() => document.addEventListener('click', onDocumentClick, { capture: true }));
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick, { capture: true }));
</script>
