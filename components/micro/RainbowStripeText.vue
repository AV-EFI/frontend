<template>
  <div class="relative flex leading-none bungee">
    <span
      v-for="(char, index) in text.split('')"
      :key="'char-' + index"
      :class="[$attrs.class, 'relative inline-block align-top']"
    >
      <!-- White Fill Base -->
      <span
        class="absolute inset-0 font-black tracking-tight"
        :class="$attrs.class"
        style="color: white; z-index: 0;"
        aria-hidden="true"
      >
        {{ char }}
      </span>

      <!-- Rainbow Gradient with Zigzag Scanlines -->
      <span
        class="absolute inset-0 font-black tracking-tight text-transparent"
        :style="getMaskStyle(index)"
        aria-hidden="true"
      >
        {{ char }}
      </span>

      <!-- Stroke Layer (on top) -->
      <span
        class="absolute inset-0 font-black tracking-tight text-transparent"
        style="pointer-events: none; z-index: 10;"
        :style="`
          -webkit-text-stroke: ${strokeWidth} ${strokeColor};
        `"
        aria-hidden="true"
      >
        {{ char }}
      </span>

      <!-- Visible Character (for spacing only) -->
      <span class="invisible">{{ char }}</span>
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
    text: {
        type: String,
        required: true,
    },
  
    strokeColor: {
        type: String,
        default: 'black'
    },
    strokeWidth: {
        type: String,
        default: '1.25px'
    },
    fillColor: {
        type: String,
        default: 'white'
    },
    maskSplit: {
        type: [String, Number],
        default: 50
    }
});

const gradientSubsets = [
    ['red', 'orange', 'yellow'],
    ['orange', 'yellow', 'green'],
    ['yellow', 'green', 'blue'],
    ['green', 'blue', 'indigo'],
    ['blue', 'indigo', 'violet'],
    ['indigo', 'violet', 'red']
];

const getGradientSubset = (index) => {
    const subset = gradientSubsets[index % gradientSubsets.length];
    return subset.join(', ');
};

const getRandomSplit = (index) => {
    const base = 40 + (index * 17) % 25;
    return `${base}%`;
};

const getMaskStyle = (index) => {
    const split = getRandomSplit(index);
    return {
        backgroundImage: `linear-gradient(90deg, ${getGradientSubset(index)})`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        WebkitMaskImage: `
      linear-gradient(to bottom, transparent 0%, transparent ${split}, black ${split}, black 100%),
      repeating-linear-gradient(${index % 2 === 0 ? 45 : 135}deg,
        black 0px,
        black 1px,
        transparent 1px,
        transparent 2.5px)
    `,
        WebkitMaskComposite: 'destination-in',
        maskComposite: 'intersect'
    };
};
</script>

<style scoped>
span {
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
/* Animation */
.fade-zoom-enter-active {
  transition: all 0.3s ease;
}
.fade-zoom-leave-active {
  transition: all 0.2s ease;
  opacity: 0;
  transform: scale(0.98);
}
.fade-zoom-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.fade-zoom-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
