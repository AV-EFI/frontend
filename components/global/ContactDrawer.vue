<template>
    <div class="drawer drawer-start z-[100]">
        <input
            id="global-contact-drawer"
            ref="drawerToggle"
            type="checkbox"
            class="drawer-toggle"
            :checked="isOpen"
            @change="onInputChange"
        >

        <div class="drawer-content"></div>

        <div class="drawer-side">
            <label
                for="global-contact-drawer"
                class="drawer-overlay"
                :aria-label="$t('closeForm')"
                @click="closeDrawer"
            />

            <aside
                ref="dialogRef"
                class="bg-base-100 min-h-[100dvh] h-[100dvh] w-screen md:w-[32rem] md:max-w-[32rem] px-4 pb-4 relative overflow-y-auto"
                style="padding-top: max(1rem, env(safe-area-inset-top)); padding-right: max(1rem, env(safe-area-inset-right));"
                role="dialog"
                aria-modal="true"
                aria-labelledby="contact-drawer-heading"
                tabindex="-1"
            >
                <button
                    ref="closeButtonRef"
                    class="btn btn-sm btn-circle btn-ghost absolute z-10 text-base-content"
                    style="top: max(1.25rem, env(safe-area-inset-top)); right: max(1.25rem, env(safe-area-inset-right));"
                    :aria-label="$t('closeForm')"
                    @click="closeDrawer"
                >
                    ✕
                </button>

                <div class="pr-10 pt-2">
                    <h2 id="contact-drawer-heading" class="sr-only">
                        {{ $t('openForm') }}
                    </h2>

                    <MicroContactForm
                        :initialMessage="initialMessage"
                        @ContactFormClose="closeDrawer"
                    />
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const isOpen = ref(false);
const initialMessage = ref('');
const drawerToggle = ref<HTMLInputElement | null>(null);
const dialogRef = ref<HTMLElement | null>(null);
const closeButtonRef = ref<HTMLButtonElement | null>(null);
const previouslyFocused = ref<HTMLElement | null>(null);

const openDrawer = (message = '') => {
    initialMessage.value = message;
    isOpen.value = true;
};

const closeDrawer = () => {
    isOpen.value = false;
};

const toggleDrawer = (message?: string) => {
    if (!isOpen.value && typeof message === 'string') {
        initialMessage.value = message;
    }
    isOpen.value = !isOpen.value;
};

const onInputChange = (e: Event) => {
    isOpen.value = (e.target as HTMLInputElement).checked;
};

const onToggleContactDrawer = (e: Event) => {
    const customEvent = e as CustomEvent<{ initialMessage?: string }>;
    toggleDrawer(customEvent.detail?.initialMessage);
};

const onOpenContactDrawer = (e: Event) => {
    const customEvent = e as CustomEvent<{ initialMessage?: string }>;
    openDrawer(customEvent.detail?.initialMessage || '');
};

const onCloseContactDrawer = () => {
    closeDrawer();
};

const onOpenLegacyContactForm = () => {
    openDrawer();
};

const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

const getFocusableElements = () => {
    const dialog = dialogRef.value;
    if (!dialog) return [] as HTMLElement[];
    return Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
};

const onKeydown = (e: KeyboardEvent) => {
    if (!isOpen.value) return;

    if (e.key === 'Escape') {
        closeDrawer();
    }

    if (e.key !== 'Tab') return;

    const focusable = getFocusableElements();
    if (!focusable.length) {
        e.preventDefault();
        dialogRef.value?.focus();
        return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
    }
};

watch(isOpen, async (value) => {
    if (drawerToggle.value) {
        drawerToggle.value.checked = value;
    }

    if (typeof document !== 'undefined') {
        document.body.style.overflow = value ? 'hidden' : '';
    }

    if (value) {
        previouslyFocused.value = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        await nextTick();
        closeButtonRef.value?.focus();
    } else {
        initialMessage.value = '';
        previouslyFocused.value?.focus?.();
        previouslyFocused.value = null;
    }
});

onMounted(() => {
    window.addEventListener('toggle-contact-drawer', onToggleContactDrawer as EventListener);
    window.addEventListener('open-contact-drawer', onOpenContactDrawer as EventListener);
    window.addEventListener('close-contact-drawer', onCloseContactDrawer);
    window.addEventListener('open-contact-form', onOpenLegacyContactForm);
    document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener('toggle-contact-drawer', onToggleContactDrawer as EventListener);
    window.removeEventListener('open-contact-drawer', onOpenContactDrawer as EventListener);
    window.removeEventListener('close-contact-drawer', onCloseContactDrawer);
    window.removeEventListener('open-contact-form', onOpenLegacyContactForm);
    document.removeEventListener('keydown', onKeydown);

    if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
    }
});
</script>
