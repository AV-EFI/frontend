<script setup lang="ts">

definePageMeta({
    middleware: 'auth'
});

const {
    status,
    data,
    token,
    lastRefreshedAt,
} = useAuth();

</script>
<template>
  <div>
    <p>
      I'm a secret! My protection works via the named `nuxt-auth` module middleware.
    </p>
    <p>{{ lastRefreshedAt }}</p>
    <p>Status: </p>
    <pre>
    {{ status }}
    </pre>
    <p>Data: </p>
    <pre>
    {{ data }}
  </pre>
    <p>Token: </p>
    <pre>
    {{ token }}
  </pre>
  </div>
</template>