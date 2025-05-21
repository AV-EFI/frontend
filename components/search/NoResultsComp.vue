<template>
  <div
    class="container"
    role="status"
    aria-live="polite"
  >
    <!-- Three emojis (filmstrip, filmreel, movie video camera) -->
    <div
      v-if="showEmojis"
      class="emojis"
      aria-label="Searching for films"
    >
      <span
        v-for="(emoji, index) in emojis"
        :key="index"
        class="emoji text-2xl h-8"
        role="img"
        :aria-label="emojiLabels[index]"
      >{{ emoji }}</span>
    </div>

    <!-- Crying emoji appears after animation is complete -->
    <div
      v-if="showNothing"
      class="nothing text-2xl h-8"
      role="img"
      aria-label="No results found"
    >
      😢
    </div>

    <!-- Magnifying glass animates over the emojis -->
    <div
      v-if="showMagnifyingGlass"
      class="magnifying-glass text-2xl h-8"
      role="img"
      aria-label="Searching"
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
const emojis = ref(['📽️', '🎬', '📹']);
const emojiLabels = ref([
    'Film projector emoji',
    'Clapperboard emoji',
    'Video camera emoji'
]);

onMounted(() => {
    setTimeout(() => showMagnifyingGlass.value = true, 600);
    setTimeout(() => showEmojis.value = true, 300);
    setTimeout(() => {
        setTimeout(() => {
            showEmojis.value = false;
            showMagnifyingGlass.value = false;
            showNothing.value = true;
        }, 1800);
    }, 900);
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
  justify-content: space-evenly;
  width: 320px;
  margin-top: 20px;
}

.magnifying-glass {
  position: absolute;
  animation: moveOverEmojis 2s ease-in-out forwards;
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

@keyframes moveOverEmojis {
  0% { transform: translateX(-150px); }
  33% { transform: translateX(-50px); }
  66% { transform: translateX(50px); }
  100% { transform: translateX(150px); }
}

@keyframes popIn {
  0% { opacity: 0; transform: scale(0.5); }
  100% { opacity: 1; transform: scale(1); }
}
</style>
