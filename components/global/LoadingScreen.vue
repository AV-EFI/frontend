<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="splash-screen"
      aria-label="Please wait"
      role="status"
      aria-live="polite"
      inert
    >
      <div class="splash-content">
        <!-- Logo -->
        <img
          src="/img/AV-EFI-Logo.svg"
          alt="AVefi Logo"
          class="logo"
          aria-hidden="true"
        >
        <!-- Animated spinner -->
        <div class="spinner" aria-hidden="true" />
        <span class="sr-only">Loading application...</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const isLoading = ref(true);

onMounted(() => {
    // Hide loading screen after app is mounted and hydrated
    // Add small delay to ensure styles are loaded
    setTimeout(() => {
        isLoading.value = false;
    }, 500);
});
</script>

<style>
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #c3d5de 0%, var(--color-white) 40%, var(--color-white) 60%, #c3d5de 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 0.5s ease-out;
  overflow: hidden;
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.logo {
  width: 200px;
  height: auto;
  animation: pulse 2s ease-in-out infinite;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(59, 130, 246, 0.2);
  border-top-color: rgb(59, 130, 246);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
