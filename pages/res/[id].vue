<script setup lang="ts">
import { navigateTo } from 'nuxt/app';
import { useRoute } from 'vue-router';

definePageMeta({
    auth: false
});

const route = useRoute();

// Default prefix for IDs without prefix
const DEFAULT_PREFIX = '21.11155';

// Redirect to prefixed route
await navigateTo(`/res/${DEFAULT_PREFIX}/${route.params.id}${route.hash || ''}`, {
    redirectCode: 301,
    external: false
});
</script>
