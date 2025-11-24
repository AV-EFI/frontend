<script setup lang="ts">
import type { NuxtError } from 'nuxt/app';

const props = defineProps({
    error: Object as () => NuxtError
});

// Route to specific error page based on status code
const errorPage = computed(() => {
  const statusCode = props.error?.statusCode;
  
  if (statusCode === 404) {
    return '404';
  } else if (statusCode === 500 || (statusCode && statusCode >= 500)) {
    return '500';
  }
  
  return null;
});
</script>

<template>
  <div>
    <!-- Render specific error pages for 404 and 500 -->
    <NuxtPage v-if="errorPage === '404'" name="slug" />
    <NuxtPage v-else-if="errorPage === '500'" name="error-500" />
    
    <!-- Fallback generic error display for other errors -->
    <section v-else>
      <div class="hero min-h-75vh">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <div class="card bg-base-100 dark:bg-base-200 shadow-2xl">
              <div class="card-body">
                <h2 class="card-title text-3xl md:text-4xl font-bold text-error justify-center">
                  {{ error?.statusCode || 'Error' }}
                </h2>
                <h3 class="text-xl md:text-2xl font-semibold text-base-content mb-4">
                  {{ error?.message || 'An error occurred' }}
                </h3>
                <p class="text-base-content/70 mb-6">
                  {{ error?.statusMessage || 'Something went wrong. Please try again.' }}
                </p>
                <div class="card-actions justify-center">
                  <NuxtLink 
                    to="/" 
                    class="btn btn-primary"
                    @click="clearError({ redirect: '/' })"
                  >
                    <Icon name="tabler:home" class="w-5 h-5" />
                    Go to Homepage
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>