<script setup lang="ts">
/*
const {
    status,
    data,
    token,
    lastRefreshedAt,
} = useAuth();
*/
</script>

<template>
  <div>
    <p>I'm a secret! My protection works via a global middleware. If you turned off the global middleware, then I'll also be visible without authentication :(</p>
    <p>Status: </p>
    <pre />
    <p>Data: </p>
    <pre />
    <p>Token: </p>
    <pre />
  </div>  
</template>