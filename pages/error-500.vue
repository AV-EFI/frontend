<template>
  <section class="min-h-75vh flex items-center justify-center px-4 py-8">
    <div class="max-w-2xl w-full">
      <!-- Error Alert -->
      <div class="alert shadow-2xl bg-base-100 dark:bg-base-200 mb-6">
        <div class="flex-1">
          <div class="flex items-start gap-4">
            <Icon name="tabler:alert-triangle" class="w-8 h-8 text-error flex-shrink-0 mt-1" />
            <div class="flex-1">
              <h3 class="text-2xl font-bold text-error mb-2">500</h3>
              <h4 class="font-semibold text-lg mb-2">{{ $t('error500.serverError') }}</h4>
              <p class="text-base-content/70 mb-4">{{ $t('error500.description') }}</p>
              <div class="flex flex-wrap gap-3">
                <NuxtLink to="/" class="btn btn-primary btn-sm">
                  <Icon name="tabler:home" class="w-4 h-4" />
                  {{ $t('error500.goHome') }}
                </NuxtLink>
                <button @click="reloadPage" class="btn btn-outline btn-sm">
                  <Icon name="tabler:refresh" class="w-4 h-4" />
                  {{ $t('error500.tryAgain') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Film Quote -->
      <div v-if="randomQuote" class="card bg-base-100/50 dark:bg-base-200/50 shadow-lg backdrop-blur-sm">
        <div class="card-body">
          <blockquote class="text-base text-base-content/80 mb-3 leading-relaxed" v-html="randomQuote.text" />
          <footer class="text-sm text-base-content/60">
            — <cite>{{ randomQuote.film }}</cite> ({{ randomQuote.year }})
          </footer>
          <div class="flex gap-3 mt-1">
            <NuxtLink 
              v-if="randomQuote.avefiUrl" 
              :to="randomQuote.avefiUrl" 
              class="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              <Icon name="tabler:film" class="w-3 h-3" />
              {{randomQuote.film}} @ AVefi
            </NuxtLink>
            <a 
              v-if="randomQuote.wikiquoteUrl" 
              :href="randomQuote.wikiquoteUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              <Icon name="tabler:external-link" class="w-3 h-3" />
              Wikiquote
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useNuxtApp } from 'nuxt/app';
import { setResponseStatus } from 'h3';
import filmQuotesData from '~/data/film-quotes.json';

const { locale, t } = useI18n();
const currentLocale = computed(() => locale.value);

// Set 500 status code on server-side
if (process.server) {
    const nuxtApp = useNuxtApp();
    if (nuxtApp.ssrContext?.event) {
        setResponseStatus(nuxtApp.ssrContext.event, 500);
    }
}

const reloadPage = () => {
    window.location.reload();
};

// Get random quote for error type 500
const randomQuote = computed(() => {
    const allQuotes = filmQuotesData.films.flatMap(film => 
        film.quotes
            .filter(q => q.errorType === '500')
            .map(q => ({
                text: q.text,
                film: film.film,
                year: film.year,
                avefiUrl: film.avefiUrl,
                wikiquoteUrl: film.wikiquoteUrl,
                license: film.license
            }))
    );
  
    if (allQuotes.length === 0) return null;
  
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    return allQuotes[randomIndex];
});
</script>
