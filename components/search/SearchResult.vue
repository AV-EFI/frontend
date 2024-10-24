<template>
  <article class="search-result">
    <h2
      class="search-result__heading"
    />
    <div class="search-result__body">
      <div class="search-result__data">
        <pre>{{ result }}</pre>
      </div>
    </div>
  </article>
</template>

<script>
export default {
    props: {
        result: {
            type: Object,
            required: true
        }
    },
    methods: {
        imageSrc(id) {
            return `https://art.hearthstonejson.com/v1/render/latest/enUS/512x/${id}.png`;
        }
    }
};
</script>

<style>
.search-result {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  align-items: center;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-result__heading {
  text-align: center;
  margin: 0;
}

.search-result__heading em{
  background: var(--bali-hai-100);
}

.search-result__body {
  display: flex;
  justify-content: flex-start;
  align-self: flex-start;
}

.search-result__data {
  padding-top: 50px;
}

.search-result__flavor {
  margin: 0;
}

.search-result__image {
  flex: none;
  width: 256px;
  height: 387px;
}
</style>