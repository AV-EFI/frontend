<template>
  <div class="space-y-4">
    <!-- Comparison mode: two columns -->
    <div v-if="compareWith" class="grid grid-cols-2 gap-8">
      <!-- Left column -->
      <div class="space-y-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex-1">
            <p class="text-sm font-semibold text-primary-900 dark:text-primary-100">
              {{ title }}
            </p>
            <h2 class="text-lg font-normal dark:text-primary-100">
              <a
                class="link link-hover"
                :href="`/res/${data.handle}`"
                target="_blank"
              >
                {{ primaryTitle || '—' }}
              </a>
            </h2>
          </div>
        </div>
        
        <table class="table table-xs table-zebra w-full">
          <tbody>
            <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('handle') }">
              <td class="font-semibold w-1/3">efi</td>
              <td>{{ data?.handle || data?.compound_record?._source?.handle || '—' }}</td>
            </tr>
            
            <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('alternativeTitles') }">
              <td class="font-semibold">{{ $t('AlternativeTitle') }}</td>
              <td>
                <ul v-if="alternativeTitles.length" class="list-disc list-inside space-y-1">
                  <li v-for="(alt, i) in alternativeTitles" :key="i">{{ alt }}</li>
                </ul>
                <span v-else>—</span>
              </td>
            </tr>

            <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('directors') }">
              <td class="font-semibold">{{ $t('directors') }}</td>
              <td>{{ directors || '—' }}</td>
            </tr>

            <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('productionYear') }">
              <td class="font-semibold">{{ $t('year') }}</td>
              <td>{{ productionYear || '—' }}</td>
            </tr>

            <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('productionCountry') }">
              <td class="font-semibold">{{ $t('country') }}</td>
              <td>{{ productionCountry || '—' }}</td>
            </tr>

            <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('workType') }">
              <td class="font-semibold">{{ $t('facettype') }}</td>
              <td>{{ translateValue(workType) }}</td>
            </tr>

            <template v-if="showDetailed">
              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('producers') }">
                <td class="font-semibold">{{ $t('producers') }}</td>
                <td>{{ producers || '—' }}</td>
              </tr>

              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('castMembers') }">
                <td class="font-semibold">{{ $t('castmembers') }}</td>
                <td>{{ castMembers || '—' }}</td>
              </tr>

              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('subjects') }">
                <td class="font-semibold">{{ $t('subjects') }}</td>
                <td>
                  <div v-if="subjects.length" class="flex flex-wrap gap-1">
                    <span v-for="(subj, i) in subjects" :key="i" class="badge badge-sm">{{ translateValue(subj) }}</span>
                  </div>
                  <span v-else>—</span>
                </td>
              </tr>

              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('genres') }">
                <td class="font-semibold">{{ $t('has_genre_has_name') }}</td>
                <td>
                  <div v-if="genres.length" class="flex flex-wrap gap-1">
                    <span v-for="(genre, i) in genres" :key="i" class="badge badge-sm">{{ translateValue(genre) }}</span>
                  </div>
                  <span v-else>—</span>
                </td>
              </tr>

              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('languages') }">
                <td class="font-semibold">{{ $t('has_language') }}</td>
                <td>{{ languages.length ? translateArray(languages).join(', ') : '—' }}</td>
              </tr>

              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('duration') }">
                <td class="font-semibold">{{ $t('duration') }}</td>
                <td>{{ duration || '—' }}</td>
              </tr>

              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('workCategory') }">
                <td class="font-semibold">{{ $t('category') }}</td>
                <td>{{ translateValue(workCategory) }}</td>
              </tr>

              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('dataProvider') }">
                <td class="font-semibold">{{ $t('dataprovider') }}</td>
                <td>{{ dataProvider || '—' }}</td>
              </tr>

              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('manifestationCount') }">
                <td class="font-semibold">{{ $t('manifestations') }}</td>
                <td>{{ manifestationCount }}</td>
              </tr>

              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('itemCount') }">
                <td class="font-semibold">{{ $t('items') }}</td>
                <td>{{ itemCount }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Right column -->
      <div class="space-y-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex-1">
            <p class="text-sm font-semibold text-primary-900 dark:text-primary-100">
              {{ compareTitle }}
            </p>
            <h2 class="text-lg font-normal dark:text-primary-100">
              <a
                class="link link-hover"
                :href="`/res/${compareWith.handle}`"
                target="_blank"
              >
                {{ comparePrimaryTitle || '—' }}
              </a>
            </h2>
          </div>
        </div>
        
        <table class="table table-xs table-zebra w-full">
          <tbody>
            <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('handle') }">
              <td class="font-semibold w-1/3">efi</td>
              <td>{{ compareWith?.handle || compareWith?.compound_record?._source?.handle || '—' }}</td>
            </tr>
            
            <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('alternativeTitles') }">
              <td class="font-semibold">{{ $t('AlternativeTitle') }}</td>
              <td>
                <ul v-if="compareAlternativeTitles.length" class="list-disc list-inside space-y-1">
                  <li v-for="(alt, i) in compareAlternativeTitles" :key="i">{{ alt }}</li>
                </ul>
                <span v-else>—</span>
              </td>
            </tr>

            <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('directors') }">
              <td class="font-semibold">{{ $t('directors') }}</td>
              <td>{{ compareDirectors || '—' }}</td>
            </tr>

            <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('productionYear') }">
              <td class="font-semibold">{{ $t('year') }}</td>
              <td>{{ compareProductionYear || '—' }}</td>
            </tr>

            <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('productionCountry') }">
              <td class="font-semibold">{{ $t('country') }}</td>
              <td>{{ compareProductionCountry || '—' }}</td>
            </tr>

            <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('workType') }">
              <td class="font-semibold">{{ $t('facettype') }}</td>
              <td>{{ translateValue(compareWorkType) }}</td>
            </tr>

            <template v-if="showDetailed">
              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('producers') }">
                <td class="font-semibold">{{ $t('producers') }}</td>
                <td>{{ compareProducers || '—' }}</td>
              </tr>

              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('castMembers') }">
                <td class="font-semibold">{{ $t('castmembers') }}</td>
                <td>{{ compareCastMembers || '—' }}</td>
              </tr>

              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('subjects') }">
                <td class="font-semibold">{{ $t('subjects') }}</td>
                <td>
                  <div v-if="compareSubjects.length" class="flex flex-wrap gap-1">
                    <span v-for="(subj, i) in compareSubjects" :key="i" class="badge badge-sm">{{ translateValue(subj) }}</span>
                  </div>
                  <span v-else>—</span>
                </td>
              </tr>

              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('genres') }">
                <td class="font-semibold">{{ $t('has_genre_has_name') }}</td>
                <td>
                  <div v-if="compareGenres.length" class="flex flex-wrap gap-1">
                    <span v-for="(genre, i) in compareGenres" :key="i" class="badge badge-sm">{{ translateValue(genre) }}</span>
                  </div>
                  <span v-else>—</span>
                </td>
              </tr>

              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('languages') }">
                <td class="font-semibold">{{ $t('has_language') }}</td>
                <td>{{ compareLanguages.length ? translateArray(compareLanguages).join(', ') : '—' }}</td>
              </tr>

              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('duration') }">
                <td class="font-semibold">{{ $t('duration') }}</td>
                <td>{{ compareDuration || '—' }}</td>
              </tr>

              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('workCategory') }">
                <td class="font-semibold">{{ $t('category') }}</td>
                <td>{{ translateValue(compareWorkCategory) }}</td>
              </tr>

              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('dataProvider') }">
                <td class="font-semibold">{{ $t('dataprovider') }}</td>
                <td>{{ compareDataProvider || '—' }}</td>
              </tr>

              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('manifestationCount') }">
                <td class="font-semibold">{{ $t('manifestations') }}</td>
                <td>{{ compareManifestationCount }}</td>
              </tr>

              <tr :class="{ 'bg-warning/20': highlightDiffs && isDifferent('itemCount') }">
                <td class="font-semibold">{{ $t('items') }}</td>
                <td>{{ compareItemCount }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Single mode: normal view -->
    <div v-else class="space-y-4">
      <!-- Header with toggle -->
      <div class="flex items-center justify-between gap-4">
        <div class="flex-1">
          <p class="text-sm font-semibold text-primary-900 dark:text-primary-100">
            {{ title }}
          </p>
          <h2 class="text-lg font-normal dark:text-primary-100">
            <a
              class="link link-hover"
              :href="`/res/${data.handle}`"
              target="_blank"
            >
              {{ primaryTitle || '—' }}
            </a>
          </h2>
        </div>
        <button
          type="button"
          class="btn btn-sm btn-ghost"
          @click="showDetailed = !showDetailed"
        >
          <Icon :name="showDetailed ? 'tabler:chevron-up' : 'tabler:chevron-down'" class="w-4 h-4" />
          {{ showDetailed ? $t('showLess') : $t('showMore') }}
        </button>
      </div>

      <!-- Compact table -->
      <table class="table table-xs table-zebra w-full">
        <tbody>
          <!-- Essential properties (always visible) -->
          <tr>
            <td class="font-semibold w-1/3">efi</td>
            <td>{{ data?.handle || data?.compound_record?._source?.handle || '—' }}</td>
          </tr>
          
          <tr>
            <td class="font-semibold">{{ $t('AlternativeTitle') }}</td>
            <td>
              <ul v-if="alternativeTitles.length" class="list-disc list-inside space-y-1">
                <li v-for="(alt, i) in alternativeTitles" :key="i">{{ alt }}</li>
              </ul>
              <span v-else>—</span>
            </td>
          </tr>

          <tr>
            <td class="font-semibold">{{ $t('directors') }}</td>
            <td>{{ directors || '—' }}</td>
          </tr>

          <tr>
            <td class="font-semibold">{{ $t('year') }}</td>
            <td>{{ productionYear || '—' }}</td>
          </tr>

          <tr>
            <td class="font-semibold">{{ $t('country') }}</td>
            <td>{{ productionCountry || '—' }}</td>
          </tr>

          <tr>
            <td class="font-semibold">{{ $t('facettype') }}</td>
            <td>{{ translateValue(workType) }}</td>
          </tr>

          <!-- Detailed properties (shown when expanded) -->
          <template v-if="showDetailed">
            <tr>
              <td class="font-semibold">{{ $t('producers') }}</td>
              <td>{{ producers || '—' }}</td>
            </tr>

            <tr>
              <td class="font-semibold">{{ $t('castmembers') }}</td>
              <td>{{ castMembers || '—' }}</td>
            </tr>

            <tr>
              <td class="font-semibold">{{ $t('subjects') }}</td>
              <td>
                <div v-if="subjects.length" class="flex flex-wrap gap-1">
                  <span v-for="(subj, i) in subjects" :key="i" class="badge badge-sm">{{ translateValue(subj) }}</span>
                </div>
                <span v-else>—</span>
              </td>
            </tr>

            <tr>
              <td class="font-semibold">{{ $t('has_genre_has_name') }}</td>
              <td>
                <div v-if="genres.length" class="flex flex-wrap gap-1">
                  <span v-for="(genre, i) in genres" :key="i" class="badge badge-sm">{{ translateValue(genre) }}</span>
                </div>
                <span v-else>—</span>
              </td>
            </tr>

            <tr>
              <td class="font-semibold">{{ $t('has_language') }}</td>
              <td>{{ languages.length ? translateArray(languages).join(', ') : '—' }}</td>
            </tr>

            <tr>
              <td class="font-semibold">{{ $t('duration') }}</td>
              <td>{{ duration || '—' }}</td>
            </tr>

            <tr>
              <td class="font-semibold">{{ $t('category') }}</td>
              <td>{{ translateValue(workCategory) }}</td>
            </tr>

            <tr>
              <td class="font-semibold">{{ $t('dataprovider') }}</td>
              <td>{{ dataProvider || '—' }}</td>
            </tr>

            <tr>
              <td class="font-semibold">{{ $t('manifestations') }}</td>
              <td>{{ manifestationCount }}</td>
            </tr>

            <tr>
              <td class="font-semibold">{{ $t('items') }}</td>
              <td>{{ itemCount }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    
    <!-- Controls for comparison mode -->
    <div v-if="compareWith" class="flex items-center justify-between gap-4 mt-4">
      <button
        type="button"
        class="btn btn-sm btn-ghost"
        @click="showDetailed = !showDetailed"
      >
        <Icon :name="showDetailed ? 'tabler:chevron-up' : 'tabler:chevron-down'" class="w-4 h-4" />
        {{ showDetailed ? $t('showLess') : $t('showMore') }}
      </button>
      
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          v-model="highlightDiffs"
          type="checkbox"
          class="checkbox checkbox-sm"
        />
        <span class="text-sm">{{ $t('highlightDifferences') }}</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
const data = defineModel({ type: Object as PropType<ElasticGetByIdResponse>, required: true });
const props = defineProps<{
  title: string;
  compareWith?: ElasticGetByIdResponse;
  compareTitle?: string;
}>();

const showDetailed = ref(false);
const highlightDiffs = ref(true);

// Helper to get source data
const source = computed(() => {
    return data.value?.compound_record?._source || data.value?._source;
});

// Helper to get compare source data
const compareSource = computed(() => {
    if (!props.compareWith) return null;
    return props.compareWith?.compound_record?._source || props.compareWith?._source;
});

// Helper to translate values (tries to find translation key, falls back to original value)
const { t, te } = useI18n();
const translateValue = (value: string | null | undefined): string => {
    if (!value) return '—';
    // Check if translation key exists, if yes translate it, otherwise return original
    return te(value) ? t(value) : value;
};

const translateArray = (values: string[]): string[] => {
    return values.map(v => te(v) ? t(v) : v);
};

// Computed properties for essential data
const primaryTitle = computed(() => {
    return source.value?.has_record?.has_primary_title?.has_name || null;
});

const alternativeTitles = computed(() => {
    const titles = source.value?.has_record?.has_alternative_title;
    if (!titles || !Array.isArray(titles)) return [];
    return titles.map(t => t?.has_name).filter(Boolean);
});

const directors = computed(() => {
    const directorsList = source.value?.directors_or_editors;
    if (directorsList && Array.isArray(directorsList) && directorsList.length > 0) {
        return directorsList.join(', ');
    }
  
    // Fallback to extracting from events
    const events = source.value?.has_record?.has_event;
    if (!events || !Array.isArray(events)) return null;
  
    const directors: string[] = [];
    events.forEach(event => {
        const activities = event?.has_activity;
        if (activities && Array.isArray(activities)) {
            activities.forEach(activity => {
                if (activity?.category === 'avefi:DirectingActivity' && activity?.has_agent) {
                    activity.has_agent.forEach(agent => {
                        if (agent?.has_name) directors.push(agent.has_name);
                    });
                }
            });
        }
    });
  
    return directors.length > 0 ? directors.join(', ') : null;
});

const producers = computed(() => {
    const prodList = source.value?.production;
    if (prodList && Array.isArray(prodList) && prodList.length > 0) {
        return prodList.join(', ');
    }
  
    // Fallback to extracting from events
    const events = source.value?.has_record?.has_event;
    if (!events || !Array.isArray(events)) return null;
  
    const producers: string[] = [];
    events.forEach(event => {
        const activities = event?.has_activity;
        if (activities && Array.isArray(activities)) {
            activities.forEach(activity => {
                if (activity?.category === 'avefi:ProductionActivity' && activity?.has_agent) {
                    activity.has_agent.forEach(agent => {
                        if (agent?.has_name) producers.push(agent.has_name);
                    });
                }
            });
        }
    });
  
    return producers.length > 0 ? producers.join(', ') : null;
});

const castMembers = computed(() => {
    const cast = source.value?.castmembers;
    if (!cast || !Array.isArray(cast) || cast.length === 0) return null;
    return cast.join(', ');
});

const productionYear = computed(() => {
    const years = source.value?.years;
    if (years && Array.isArray(years) && years.length > 0) {
        return years.join(', ');
    }
  
    // Fallback to production_in_year
    const prodYear = source.value?.production_in_year;
    if (prodYear && Array.isArray(prodYear) && prodYear.length > 0) {
        const first = prodYear[0];
        if (first.gte === first.lte) return String(first.gte);
        return `${first.gte}–${first.lte}`;
    }
  
    // Fallback to event date
    const events = source.value?.has_record?.has_event;
    if (events && Array.isArray(events)) {
        const prodEvent = events.find(e => e?.category === 'avefi:ProductionEvent');
        if (prodEvent?.has_date) return prodEvent.has_date;
    }
  
    return null;
});

const productionCountry = computed(() => {
    const events = source.value?.has_record?.has_event;
    if (!events || !Array.isArray(events)) return null;
  
    const countries: string[] = [];
    events.forEach(event => {
        if (event?.category === 'avefi:ProductionEvent' && event?.located_in) {
            event.located_in.forEach(location => {
                if (location?.has_name) countries.push(location.has_name);
            });
        }
    });
  
    return countries.length > 0 ? countries.join(', ') : null;
});

const subjects = computed(() => {
    const subj = source.value?.subjects;
    if (!subj || !Array.isArray(subj)) return [];
    return subj;
});

const genres = computed(() => {
    const genreList = source.value?.has_record?.has_genre;
    if (!genreList || !Array.isArray(genreList)) return [];
    return genreList.map(g => g?.has_name).filter(Boolean);
});

const languages = computed(() => {
    // Try to get from manifestations > items
    const manifestations = source.value?.manifestations;
    if (manifestations && Array.isArray(manifestations)) {
        const langs = new Set<string>();
        manifestations.forEach(m => {
            const items = m?.items;
            if (items && Array.isArray(items)) {
                items.forEach(item => {
                    const itemLangs = item?.has_record?.in_language;
                    if (itemLangs && Array.isArray(itemLangs)) {
                        itemLangs.forEach(l => {
                            if (l?.code) langs.add(l.code);
                        });
                    }
                });
            }
        });
        if (langs.size > 0) return Array.from(langs);
    }
  
    // Fallback to work level
    const langList = source.value?.has_record?.in_language;
    if (!langList || !Array.isArray(langList)) return [];
    return langList.map(l => l?.code || l?.has_name).filter(Boolean);
});

const duration = computed(() => {
    const dur = source.value?.has_record?.has_duration;
    if (!dur || !Array.isArray(dur) || dur.length === 0) return null;
    const val = dur[0]?.has_value;
    return val ? `${val} ${dur[0]?.has_unit || 'min'}` : null;
});

const workCategory = computed(() => {
    return source.value?.has_record?.category || null;
});

const workType = computed(() => {
    return source.value?.has_record?.type || null;
});

const dataProvider = computed(() => {
    const described = source.value?.has_record?.described_by;
    if (!described) return null;
  
    if (Array.isArray(described) && described.length > 0) {
        return described[0]?.has_issuer_name || null;
    }
  
    return described?.has_issuer_name || null;
});

const manifestationCount = computed(() => {
    const manifestations = source.value?.manifestations;
    return manifestations && Array.isArray(manifestations) ? manifestations.length : 0;
});

const itemCount = computed(() => {
    const manifestations = source.value?.manifestations;
    if (!manifestations || !Array.isArray(manifestations)) return 0;
  
    let total = 0;
    manifestations.forEach(m => {
        const items = m?.items;
        if (items && Array.isArray(items)) {
            total += items.length;
        }
    });
    return total;
});

// Comparison computed properties
const comparePrimaryTitle = computed(() => {
    return compareSource.value?.has_record?.has_primary_title?.has_name || null;
});

const compareAlternativeTitles = computed(() => {
    const titles = compareSource.value?.has_record?.has_alternative_title;
    if (!titles || !Array.isArray(titles)) return [];
    return titles.map(t => t?.has_name).filter(Boolean);
});

const compareDirectors = computed(() => {
    const directorsList = compareSource.value?.directors_or_editors;
    if (directorsList && Array.isArray(directorsList) && directorsList.length > 0) {
        return directorsList.join(', ');
    }
  
    const events = compareSource.value?.has_record?.has_event;
    if (!events || !Array.isArray(events)) return null;
  
    const directors: string[] = [];
    events.forEach(event => {
        const activities = event?.has_activity;
        if (activities && Array.isArray(activities)) {
            activities.forEach(activity => {
                if (activity?.category === 'avefi:DirectingActivity' && activity?.has_agent) {
                    activity.has_agent.forEach(agent => {
                        if (agent?.has_name) directors.push(agent.has_name);
                    });
                }
            });
        }
    });
  
    return directors.length > 0 ? directors.join(', ') : null;
});

const compareProducers = computed(() => {
    const prodList = compareSource.value?.production;
    if (prodList && Array.isArray(prodList) && prodList.length > 0) {
        return prodList.join(', ');
    }
  
    const events = compareSource.value?.has_record?.has_event;
    if (!events || !Array.isArray(events)) return null;
  
    const producers: string[] = [];
    events.forEach(event => {
        const activities = event?.has_activity;
        if (activities && Array.isArray(activities)) {
            activities.forEach(activity => {
                if (activity?.category === 'avefi:ProductionActivity' && activity?.has_agent) {
                    activity.has_agent.forEach(agent => {
                        if (agent?.has_name) producers.push(agent.has_name);
                    });
                }
            });
        }
    });
  
    return producers.length > 0 ? producers.join(', ') : null;
});

const compareCastMembers = computed(() => {
    const cast = compareSource.value?.castmembers;
    if (!cast || !Array.isArray(cast) || cast.length === 0) return null;
    return cast.join(', ');
});

const compareProductionYear = computed(() => {
    const years = compareSource.value?.years;
    if (years && Array.isArray(years) && years.length > 0) {
        return years.join(', ');
    }
  
    const prodYear = compareSource.value?.production_in_year;
    if (prodYear && Array.isArray(prodYear) && prodYear.length > 0) {
        const first = prodYear[0];
        if (first.gte === first.lte) return String(first.gte);
        return `${first.gte}–${first.lte}`;
    }
  
    const events = compareSource.value?.has_record?.has_event;
    if (events && Array.isArray(events)) {
        const prodEvent = events.find(e => e?.category === 'avefi:ProductionEvent');
        if (prodEvent?.has_date) return prodEvent.has_date;
    }
  
    return null;
});

const compareProductionCountry = computed(() => {
    const events = compareSource.value?.has_record?.has_event;
    if (!events || !Array.isArray(events)) return null;
  
    const countries: string[] = [];
    events.forEach(event => {
        if (event?.category === 'avefi:ProductionEvent' && event?.located_in) {
            event.located_in.forEach(location => {
                if (location?.has_name) countries.push(location.has_name);
            });
        }
    });
  
    return countries.length > 0 ? countries.join(', ') : null;
});

const compareSubjects = computed(() => {
    const subj = compareSource.value?.subjects;
    if (!subj || !Array.isArray(subj)) return [];
    return subj;
});

const compareGenres = computed(() => {
    const genreList = compareSource.value?.has_record?.has_genre;
    if (!genreList || !Array.isArray(genreList)) return [];
    return genreList.map(g => g?.has_name).filter(Boolean);
});

const compareLanguages = computed(() => {
    const manifestations = compareSource.value?.manifestations;
    if (manifestations && Array.isArray(manifestations)) {
        const langs = new Set<string>();
        manifestations.forEach(m => {
            const items = m?.items;
            if (items && Array.isArray(items)) {
                items.forEach(item => {
                    const itemLangs = item?.has_record?.in_language;
                    if (itemLangs && Array.isArray(itemLangs)) {
                        itemLangs.forEach(l => {
                            if (l?.code) langs.add(l.code);
                        });
                    }
                });
            }
        });
        if (langs.size > 0) return Array.from(langs);
    }
  
    const langList = compareSource.value?.has_record?.in_language;
    if (!langList || !Array.isArray(langList)) return [];
    return langList.map(l => l?.code || l?.has_name).filter(Boolean);
});

const compareDuration = computed(() => {
    const dur = compareSource.value?.has_record?.has_duration;
    if (!dur || !Array.isArray(dur) || dur.length === 0) return null;
    const val = dur[0]?.has_value;
    return val ? `${val} ${dur[0]?.has_unit || 'min'}` : null;
});

const compareWorkCategory = computed(() => {
    return compareSource.value?.has_record?.category || null;
});

const compareWorkType = computed(() => {
    return compareSource.value?.has_record?.type || null;
});

const compareDataProvider = computed(() => {
    const described = compareSource.value?.has_record?.described_by;
    if (!described) return null;
  
    if (Array.isArray(described) && described.length > 0) {
        return described[0]?.has_issuer_name || null;
    }
  
    return described?.has_issuer_name || null;
});

const compareManifestationCount = computed(() => {
    const manifestations = compareSource.value?.manifestations;
    return manifestations && Array.isArray(manifestations) ? manifestations.length : 0;
});

const compareItemCount = computed(() => {
    const manifestations = compareSource.value?.manifestations;
    if (!manifestations || !Array.isArray(manifestations)) return 0;
  
    let total = 0;
    manifestations.forEach(m => {
        const items = m?.items;
        if (items && Array.isArray(items)) {
            total += items.length;
        }
    });
    return total;
});

// Function to check if a field is different between the two datasets
function isDifferent(field: string): boolean {
    if (!props.compareWith) return false;
    
    switch (field) {
    case 'handle':
        return (data.value?.handle || data.value?.compound_record?._source?.handle) !== 
                   (props.compareWith?.handle || props.compareWith?.compound_record?._source?.handle);
    case 'alternativeTitles':
        return JSON.stringify(alternativeTitles.value) !== JSON.stringify(compareAlternativeTitles.value);
    case 'directors':
        return directors.value !== compareDirectors.value;
    case 'producers':
        return producers.value !== compareProducers.value;
    case 'castMembers':
        return castMembers.value !== compareCastMembers.value;
    case 'productionYear':
        return productionYear.value !== compareProductionYear.value;
    case 'productionCountry':
        return productionCountry.value !== compareProductionCountry.value;
    case 'subjects':
        return JSON.stringify(subjects.value) !== JSON.stringify(compareSubjects.value);
    case 'genres':
        return JSON.stringify(genres.value) !== JSON.stringify(compareGenres.value);
    case 'languages':
        return JSON.stringify(languages.value) !== JSON.stringify(compareLanguages.value);
    case 'duration':
        return duration.value !== compareDuration.value;
    case 'workCategory':
        return workCategory.value !== compareWorkCategory.value;
    case 'workType':
        return workType.value !== compareWorkType.value;
    case 'dataProvider':
        return dataProvider.value !== compareDataProvider.value;
    case 'manifestationCount':
        return manifestationCount.value !== compareManifestationCount.value;
    case 'itemCount':
        return itemCount.value !== compareItemCount.value;
    default:
        return false;
    }
}
</script>
