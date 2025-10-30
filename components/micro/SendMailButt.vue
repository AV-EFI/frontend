<template>
  <!-- Desktop -->
  <details
    ref="deskRef"
    class="dropdown dropdown-bottom dropdown-end hidden md:block"
    :open="showForm"
  >
    <summary
      class="btn btn-sm btn-circle btn-outline list-none"
      :title="showForm ? $t('closeForm') : $t('openForm')"
      :aria-label="showForm ? $t('closeForm') : $t('openForm')"
      :aria-expanded="showForm"
      @click.prevent="toggleForm"
    >
      <LazyIcon name="tabler:send" />
    </summary>

    <div
      class="mt-2 p-4 border-base-100 rounded-lg shadow-lg bg-base-100 w-96 dropdown-content menu z-50"
      role="form"
      aria-labelledby="contact-form-heading"
      @click.stop
    >
      <MicroContactForm />
    </div>
  </details>

  <!-- Mobile modal (unchanged) -->
  <div class="block md:hidden">
    <button
      class="btn btn-sm btn-circle btn-outline"
      :aria-label="$t('openForm')"
      @click="openMobileModal"
    >
      <LazyIcon name="tabler:send" />
    </button>
    <dialog
      id="mobileMailModal"
      ref="modalRef"
      class="modal"
    >
      <div class="modal-box w-full max-w-none p-4">
        <form method="dialog">
          <button
            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            @click="closeMobileModal"
          >
            ✕
          </button>
        </form>
        <MicroContactForm />
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const showForm = ref(false);
const deskRef = ref<HTMLElement | null>(null);
const modalRef = ref<HTMLDialogElement | null>(null);

const toggleForm = () => { showForm.value = !showForm.value; };

// close on outside click
const onDocClick = (e: MouseEvent) => {
    if (!deskRef.value) return;
    if (!deskRef.value.contains(e.target as Node)) showForm.value = false;
};
onMounted(() => document.addEventListener('click', onDocClick));
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));

// mobile modal
const openMobileModal = () => { modalRef.value?.showModal(); };
const closeMobileModal = () => { modalRef.value?.close(); };
</script>
<style scoped>
summary::after {
  content: none;
}
</style>