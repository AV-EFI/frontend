<template>
  <div class="container">
    <!-- Three emojis (filmstrip, filmreel, movie video camera) -->
    <div
      v-if="showEmojis"
      class="emojis"
    >
      <span
        v-for="(emoji, index) in emojis"
        :key="index"
        class="emoji text-2xl h-8"
      >{{ emoji }}</span>
    </div>

    <!-- Crying emoji appears after animation is complete -->
    <div
      v-if="showNothing"
      class="nothing text-2xl h-8"
    >
      😢
    </div>

    <!-- Magnifying glass animates over the emojis -->
    <div
      v-if="showMagnifyingGlass"
      class="magnifying-glass text-2xl h-8"
    >
      🔍
    </div>
    <div
      v-if="showNothing"
      class="no-results text-xl text-primary-900 dark:text-neutral-200"
    >
      <p>{{ $t('noResults') }}</p>
      <p>{{ $t('tryClearingFiltersOrQuery') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const showMagnifyingGlass = ref(false);
const showEmojis = ref(false);
const showNothing = ref(false);
const emojis = ref(['📽️', '🎬', '📹']); // Emojis to display: filmstrip, film reel, movie video camera

onMounted(() => {
    // Show magnifying glass after 1.5s
    setTimeout(() => showMagnifyingGlass.value = true, 600);

    // Show emojis after 2s
    setTimeout(() => showEmojis.value = true, 300);

    // Animate magnifying glass from left to right and back after 2.5s
    setTimeout(() => {
    // Move right and left, and then show the crying emoji after completion
        setTimeout(() => {
            showEmojis.value = false; // Hide emojis after magnifying glass animation
            showMagnifyingGlass.value = false; // Hide magnifying glass before crying emoji
            showNothing.value = true; // Show crying emoji
        }, 1800); // After 3 seconds, show crying emoji
    }, 900); // Delay start after 2.5 seconds
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.emojis {
  display: flex;
  justify-content: space-evenly; /* Make emojis closer */
  width: 320px; /* Adjust width to fit closer together */
  margin-top: 20px;
}

.magnifying-glass {
  position: absolute;
  animation: moveOverEmojis 2s ease-in-out forwards; /* Full cycle of moving left-to-right and right-to-left */
  margin-top: 20px;
}

.no-results {
  margin-top: 20px;
}

.nothing {
  margin-top: 20px;
  opacity: 0;
  animation: popIn 0.5s ease-in forwards;
}

/* Movement of magnifying glass */
@keyframes moveOverEmojis {
  0% { transform: translateX(-150px); } /* Start to the left of the first emoji */
  33% { transform: translateX(-50px); } /* Move to the left of the first emoji */
  66% { transform: translateX(50px); } /* Move to the left of the second emoji */
  100% { transform: translateX(150px); } /* Move back to the second emoji */
}

@keyframes popIn {
  0% { opacity: 0; transform: scale(0.5); }
  100% { opacity: 1; transform: scale(1); }
}
</style>
