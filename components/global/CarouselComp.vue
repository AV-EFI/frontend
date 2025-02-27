<template>
  <div class="carousel carousel-center w-full relative overflow-hidden">
    <button
      class="lg:flex my-auto z-20 p-2 lg:bg-gray-800 lg:text-white text-black rounded-full bg-opacity-50 w-10 h-10 items-center justify-center lg:mr-4 dark:bg-gray-600 dark:text-gray-200 lg:absolute lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:left-[-3rem]"
      @click="prevSlide"
    >
      <Icon name="fa:chevron-left" />
    </button>
    <div
      class="carousel-inner flex items-center transition-transform duration-500 ease-in-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="carousel-item flex-shrink-0 w-full justify-center"
      >
        <a
          :href="item.link"
          target="_blank"
          rel="noopener noreferrer"
          :alt="'Link to ' + item.link"
        >
          <img
            class="w-full object-contain w-32 h-auto bg-white dark:bg-gray-200 p-2 rounded"
            :src="item.src"
            :alt="item.alt"
            :title="item.alt"
          >
        </a>
      </div>
    </div>
    <button
      class="z-20 my-auto lg:flex p-2 lg:bg-gray-800 text-black lg:text-white rounded-full bg-opacity-50 w-10 h-10 items-center justify-center lg:ml-4 dark:bg-gray-600 dark:text-gray-200 lg:absolute lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:right-[-3rem]"
      @click="nextSlide"
    >
      <Icon name="fa:chevron-right" />
    </button>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
    items: {
        type: Array,
        required: true
    }
});

const currentIndex = ref(0);

const prevSlide = () => {
    currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length;
};

const nextSlide = () => {
    currentIndex.value = (currentIndex.value + 1) % props.items.length;
};
</script>

<style scoped>
.carousel-inner {
  display: flex;
  transition: transform 0.5s ease-in-out;
}
.carousel-item {
  flex-shrink: 0;
  width: 100%;
}
</style>