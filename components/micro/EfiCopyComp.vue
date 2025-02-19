<template>
  <button
    :class="['btn btn-accent btn-circle mr-2', compSize == 'sm'? 'btn-sm p-1' : 'p-2']"
    title="Copy EFI"
    alt="Copy EFI"
    @click="handleClick"
  >
    <img
      src="/public/img/efi_icon_xs.png"
      alt="EFI Icon"
      class="mb-1 invert"
      :class="[compSize == 'sm'? 'w-4 h-auto' : 'w-6 h-auto']"
    >
  </button>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
    handle: String,
    compSize: {
        type: String,
        default: 'w-6 h-auto'
    }
});

const isClicked = ref(false);

const handleClick = () => {
    useClipboardUtil()?.copyExtended(props.handle);
    isClicked.value = true;
    setTimeout(() => {
        isClicked.value = false;
    }, 300); // Duration of the animation
};
</script>

<style scoped>
.gradient-bg {
  background: linear-gradient(to right, var(--secondary) 10%, var(--primary) 90%);
  transition: background 0.3s ease;
}
</style>