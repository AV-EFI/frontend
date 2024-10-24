<script setup lang="ts">

useHead({
    title: "AV-efi",
    meta: [
        { name: "description", content: "AV-efi content description in meta" },
    ],
    bodyAttrs: {
    //class: 'test'
    },
    //script: [ { innerHTML: 'console.log(\'Hello world\')' } ]
});

useSeoMeta({
    title: "AVefi",
    ogTitle: "AVefi",
    description: "This is AV-efi, let me tell you all about it!",
    ogDescription: "This is AV-efi, let me tell you all about it!",
    ogImage: "https://example.com/image.png",
    twitterCard: "summary_large_image",
});
</script>

<template>
  <div class="">
    <NuxtLoadingIndicator />
    <NuxtLayout
      class="layouts"
    >
      <div class="container grow mx-auto dark:text-white dark:border-gray-700 p-4">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>