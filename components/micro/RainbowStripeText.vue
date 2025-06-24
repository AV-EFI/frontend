<template>
  <div class="relative flex leading-none bungee">
    <span
      v-for="(char, index) in animatedChars"
      :key="'char-' + index"
      :class="[$attrs.class, 'relative inline-block align-top']"
    >
      <label class="swap swap-flip text-2xl">
        <input
          type="checkbox"
          class="hidden"
          :checked="isFlipped[index]"
          readonly
        >
        <!-- Flipped (character) -->
        <div class="swap-on">
          <span
            class="absolute inset-0 font-black tracking-tight"
            :class="$attrs.class"
            style="color: white; z-index: 0;"
            aria-hidden="true"
          >{{ char }}</span>
          <span
            class="absolute inset-0 font-black tracking-tight text-transparent"
            :style="getMaskStyle(index)"
            aria-hidden="true"
          >{{ char }}</span>
          <span
            class="absolute inset-0 font-black tracking-tight text-transparent"
            style="pointer-events: none; z-index: 10;"
            :style="`
              -webkit-text-stroke: ${strokeWidth} ${strokeColor};
            `"
            aria-hidden="true"
          >{{ char }}</span>
          <span class="invisible">{{ char }}</span>
        </div>
        <!-- Not flipped (emoji, only once) -->
        <div class="swap-off">
          <span
            class="absolute inset-0 font-black tracking-tight emoji-flip"
            :class="$attrs.class"
            style="color: white; z-index: 0;"
            aria-hidden="true"
          >{{ emojiStart[index] }}</span>
          <span class="invisible">{{ emojiStart[index] }}</span>
        </div>
      </label>
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

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
        default: '1px'
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

const emojiStart = ['🐣', '🐰', '🐥', '🌈', '🥚'];
const targetChars = ref(props.text.split(''));
const animatedChars = ref([...emojiStart]);
const isFlipped = ref(Array(targetChars.value.length).fill(false));
const showPlain = ref(false);

// Only start animation if not in plain mode
function startAnimation() {
    if (showPlain.value) return;
    animatedChars.value = [...emojiStart];
    isFlipped.value = Array(targetChars.value.length).fill(false);
    targetChars.value.forEach((char, i) => {
        setTimeout(() => {
            animatedChars.value[i] = char;
            isFlipped.value[i] = true;
        }, 700 + i * 300);
    });
}

onMounted(() => {
    startAnimation();
});

/*
watch(() => props.text, (newText) => {
    targetChars.value = newText.split('');
    if (!showPlain.value) startAnimation();
});
*/

// Allow parent to control plain/animated mode
/*
watch(showPlain, (plain) => {
    if (!plain) startAnimation();
});
*/

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
    if (isFlipped.value[index]) {
        // ALPHA character: rainbow + scanline
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
    } 
    // Emoji: rainbow only, no scanline
    return {
        backgroundImage: `linear-gradient(90deg, ${getGradientSubset(index)})`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        WebkitMaskImage: `
                linear-gradient(to bottom, transparent 0%, transparent ${split}, black ${split}, black 100%)
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
  vertical-align: middle;
  /* Ensure all inline-blocks are vertically centered */
  display: inline-block;
}
.emoji-flip {
  display: inline-block !important;
  font-size: 0.8em !important;
  width: 1.5em !important;
  height: 1.5em !important;
  text-align: center !important;
  transform: scaleX(-1) scale(0.8) !important;
  vertical-align: middle !important;
  line-height: 1.5 !important;
}
</style>
