<script setup lang="ts">
definePageMeta({
    //middleware: 'auth'
});
const route = useRoute();
const items: string[] = [
    String(route.query.prev ?? ''),
    String(route.query.next ?? ''),
];


</script>
<template>
    <div>
        <div class="container">
            <div class="breadcrumbs text-sm">
                <ul>
                    <li><a href="/">{{ $t('home.breadcrumbs') }}</a></li>
                    <li>
                        <span class="text-accent">
                            {{ $t('filmidentification') }}
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="container">
            <div v-if="items">
                <GlobalCompareViewRaw :items="items" />
            </div>
            <div v-else>
                {{ $t('noDataToCompare') }}
            </div>
        </div>
    </div>
</template>
