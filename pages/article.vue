<script setup lang="ts">
interface ApiArticle {
  "data": {
        "id": number,
        "attributes": {
            "title": string,
            "slug": string,
            "createdAt": string,
            "updatedAt": string,
            "publishedAt": string,
            "locale": string
        }
    },
    "meta": {}
}
definePageMeta({
    auth: false
});

const response:ApiArticle = await $fetch<ApiArticle>(`${useRuntimeConfig().public.cmsUrl}/api/articles/1`);
//http://localhost:1337/api/articles/1?populate=*

</script>
<template>
  <div>
    <h1>FAQ, Help & Contact</h1>
    <div v-if="response">
      <p>{{ response.data.attributes.title }}</p>
    </div>
  </div>
</template>