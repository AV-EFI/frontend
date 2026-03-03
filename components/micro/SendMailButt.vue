<template>
    <!-- Desktop -->
    <div class="relative hidden md:block" ref="deskRef">
        <button class="btn min-h-6 h-auto home-mail-button home-mail-button-desktop" :title="showForm ? $t('closeForm') : $t('openForm')"
                :aria-label="showForm ? $t('closeForm') : $t('openForm')" :aria-expanded="showForm" @click="toggleForm">
            <Icon class="w-4 h-4 shrink-0" name="tabler:send" />
        </button>
        <div v-if="showForm"
             class="absolute right-0 mt-2 p-4 border-base-100 rounded-lg shadow-lg w-96 dropdown-content menu z-999 bg-base-100"
             role="form" aria-labelledby="contact-form-heading" @click.stop>
            <MicroContactForm @ContactFormClose="toggleForm" />
        </div>
    </div>

    <!-- Mobile modal (unchanged) -->
    <div class="block md:hidden">
        <button class="btn home-mail-button home-mail-button-mobile" :aria-label="$t('openForm')" @click="openMobileModal">
            <Icon name="tabler:send " />
        </button>
        <dialog id="mobileMailModal" ref="modalRef" class="modal">
            <div class="modal-box w-full max-w-none p-4">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeMobileModal">
                        ✕
                    </button>
                </form>
                <MicroContactForm @ContactFormClose="closeMobileModal" />
            </div>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const showForm = ref(false);
const deskRef = ref<HTMLElement | null>(null);
const modalRef = ref<HTMLDialogElement | null>(null);
let ignoreNextOutsideClick = false;

const toggleForm = () => { showForm.value = !showForm.value; };

// close on outside click
const onDocClick = (e: MouseEvent) => {
    if (ignoreNextOutsideClick) {
        ignoreNextOutsideClick = false;
        return;
    }
    if (!deskRef.value) return;
    if (!deskRef.value.contains(e.target as Node)) showForm.value = false;
};

// mobile modal
const openMobileModal = () => { modalRef.value?.showModal(); };
const closeMobileModal = () => { modalRef.value?.close(); };

const openFromExternalTrigger = () => {
    ignoreNextOutsideClick = true;
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (isDesktop) {
        showForm.value = true;
        closeMobileModal();
        return;
    }

    showForm.value = false;
    openMobileModal();
};

const onOpenContactForm = () => {
    openFromExternalTrigger();
};

onMounted(() => {
    document.addEventListener('click', onDocClick);
    window.addEventListener('open-contact-form', onOpenContactForm);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocClick);
    window.removeEventListener('open-contact-form', onOpenContactForm);
});
</script>
<style scoped>
</style>