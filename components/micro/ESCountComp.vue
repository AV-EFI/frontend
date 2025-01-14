<template>
  <span
    v-if="error"
    class="text-error"
  >
    Error: {{ error }}
  </span>
  <span v-else-if="isFetching">
    <span class="loading loading-spinner text-primary" />
  </span>
  <span v-else>
    {{ results }}
  </span>
</template>

<script setup>
// Props for the component
const props = defineProps({
    query_term: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        default: 'avefi:WorkVariant',
    },
});

// Reactive variables for results, error, and loading state
const results = ref(null);
const error = ref(null);
const isFetching = ref(false);

// Function to fetch data from the API
const fetchElasticSearchResults = async () => {
    isFetching.value = true;
    error.value = null;

    try {
        const response = await $fetch('/api/elastic/statscount', {
            method: 'POST',
            body: {
                query: {
                    term: props.query_term,
                    cat: props.category,
                }
            }
        });

        if (response.success) {
            results.value = response.data;
        } else {
            throw new Error(response.message || 'Failed to fetch ElasticSearch results.');
        }
    } catch (err) {
        error.value = err.message || 'An unexpected error occurred.';
    } finally {
        isFetching.value = false;
    }
};

// Fetch results when the component mounts
fetchElasticSearchResults();
</script>