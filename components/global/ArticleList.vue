<template>
  <main>
    <ContentList
      v-slot="{ list }"
      path="/articles"
    >
      <div
        v-for="article in list"
        :key="article._path"
        class="p-2"
      >
        <h2>{{ article.title }}</h2>
        <p>{{ article.description }}</p>
      </div>
    </ContentList>
  </main>
</template>