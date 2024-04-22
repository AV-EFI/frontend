<script setup lang="ts">
const headers = useRequestHeaders(["cookie"]);
const { pending, data: products } = await useFetch("api/products", {
    transform: (_products: any) => _products.data.products,
    headers: headers,
    lazy: true
});
//console.log(products);
</script>
<template>
  <section>
    <h2>About Page</h2>
    <p>This page will be displayed at the /about route.</p>
    <p>Product titles:</p>
    <p>{{ pending ? "Loading" : "done" }}</p>
    <template v-if="pending">
      <p>nah</p>
      <!-- here use a loaded you prefer -->
    </template>
    <template v-else>
      <ul>
        <li
          v-for="product in products"
          :key="product.id"
        >
          {{ product.title }}
        </li>
      </ul>
    </template>
  </section>
</template>
