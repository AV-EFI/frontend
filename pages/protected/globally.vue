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
        <p>{{ $t('debugPage.secretMessage') }}</p>
        <p>{{ $t('debugPage.statusLabel') }}: </p>
        <pre />
        <p>{{ $t('debugPage.dataLabel') }}: </p>
        <pre />
        <p>{{ $t('debugPage.tokenLabel') }}: </p>
        <pre />
    </div>  
</template>
