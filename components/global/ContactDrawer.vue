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
                class="bg-base-100 min-h-screen h-screen w-screen md:w-[32rem] md:max-w-[32rem] p-4 relative overflow-y-auto"
                role="dialog"
                aria-modal="true"
                aria-labelledby="contact-drawer-heading"
            >
                <button
                    class="btn btn-sm btn-circle btn-ghost absolute right-5 top-5 sn:right-3 sm:top-3 z-10"
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
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const isOpen = ref(false);
const initialMessage = ref('');
const drawerToggle = ref<HTMLInputElement | null>(null);

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

const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        closeDrawer();
    }
};

watch(isOpen, (value) => {
    if (drawerToggle.value) {
        drawerToggle.value.checked = value;
    }

    if (typeof document !== 'undefined') {
        document.body.style.overflow = value ? 'hidden' : '';
    }

    if (!value) {
        initialMessage.value = '';
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