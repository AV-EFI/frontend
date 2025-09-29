<template>
  <!-- Desktop dropdown (unchanged) -->
  <div class="dropdown dropdown-bottom dropdown-end hidden md:block">
    <div
      tabindex="0"
      role="button"
      class="btn btn-sm btn-circle btn-outline"
      :title="showForm ? $t('closeForm') : $t('openForm')"
      :aria-label="showForm ? $t('closeForm') : $t('openForm')"
      :aria-expanded="Boolean(showForm.toString())"
      @click="toggleForm"
    >
      <LazyIcon name="tabler:message" />
    </div>
    <div
      v-if="showForm"
      class="mt-4 p-4 border rounded-lg shadow-lg bg-base-100 w-96 dropdown-content menu"
      role="form"
      aria-labelledby="contact-form-heading"
    >
      <!-- ORIGINAL FORM CONTENT GOES HERE -->
       <ClientOnly>
          <LazyMicroContactForm />
       </ClientOnly>
    </div>
  </div>

  <!-- Mobile modal -->
  <div class="block md:hidden">
    <button
      class="btn btn-sm btn-circle btn-outline"
      :aria-label="$t('openForm')"
      @click="openMobileModal"
    >
      <LazyIcon name="fa:paper-plane" />
    </button>

    <dialog
      id="mobileMailModal"
      ref="modalRef"
      class="modal"
    >
      <div class="modal-box w-full max-w-none p-4">
        <ClientOnly>
        <form method="dialog">
          <button
            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            @click="closeMobileModal"
          >
            ✕
          </button>
        </form>        
          <LazyMicroContactForm />
        </ClientOnly>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showForm = ref(false);
const modalRef = ref<HTMLDialogElement | null>(null);

const toggleForm = () => {
    showForm.value = !showForm.value;
};

const openMobileModal = () => {
    modalRef.value?.showModal();
};

const closeMobileModal = () => {
    modalRef.value?.close();
};
</script>
