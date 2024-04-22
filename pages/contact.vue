<script setup lang="ts">
interface ApiPage {
  "data": {
        "id": number,
        "attributes": {
            "title": string,
            "createdAt": string,
            "updatedAt": string,
            "publishedAt": string,
            "locale": string,
            "FAQs": FAQ[]
            "DescriptionCK": string
        }
    },
    "meta": {}
}

interface FAQ {
  id: number,
  Question: string,
  Answer: string
}
definePageMeta({
    auth: false
});
const response:ApiPage = await $fetch<ApiPage>(`http://localhost:1337/api/pages/1?populate=*`);
//http://localhost:1337/api/articles/1?populate=*

</script>
<template>
  <div>
    <article class="prose">
      <h1>Garlic bread with cheese: What the science tells us</h1>
      <p>
        For years parents have espoused the health benefits of eating garlic bread with cheese to their
        children, with the food earning such an iconic status in our culture that kids will often dress
        up as warm, cheesy loaf for Halloween.
      </p>
      <p>
        But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
        springing up around the country.
      </p>
    </article>
    <NuxtLayout name="partial-layout-3-2">
      <template #title>
        FAQs
      </template>
      <template #containerLeft>
        <div v-if="response">
          <AccordionComp 
            v-for="(faqItem, index) in response.data.attributes.FAQs"
            :id="faqItem.id"
            :key="faqItem.id"
            :index="index"
            :container-id="response.data.id"
            :question="faqItem.Question"
            :answer="faqItem.Answer"
          />
        </div>
      </template>
      <template #containerRight>
        <div v-if="response.data.attributes.DescriptionCK">
          <span v-html="response.data.attributes.DescriptionCK" />
        </div>
      </template>
    </NuxtLayout>
  </div>
</template>