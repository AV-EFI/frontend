<template>
  <div class="w-full my-auto">
    <div class="flex flex-col sm:flex-row gap-0 items-stretch h-16">
      <SearchQueryAutocomplete
        ref="qaRef"
        v-model="term"
        name="search"
        :placeholder="$t('searchplaceholder')"
        :aria-label="ariaLabel"
        :icon-map="iconMap"
        @submit="onSubmit"
      />
      <button
        type="button"
        class="btn btn-primary btn-lg h-[56px] !rounded-l-none !rounded-r-xl"
        @click="submitFromButton"
      >
        {{ $t('search') }}
      </button>
    </div>

    <p v-if="hint" class="mt-2 text-sm text-base-content/70">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { FACET_ICON_MAP } from '~/models/interfaces/manual/IFacetIconMapping.js'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
  ariaLabel?: string
  buttonLabel?: string
  hint?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'search', payload: { q: string }): void
}>()

const router = useRouter()
const route = useRoute()

const term = ref(props.modelValue ?? '')
const qaRef = ref<{ submit: () => void } | null>(null)

const ariaLabel = computed(() => props.ariaLabel ?? 'Search input')
const buttonLabel = computed(() => props.buttonLabel ?? 'Search')
const hint = computed(() => props.hint ?? '')

const iconMap = FACET_ICON_MAP;

function pushRoute(q: string) {
  const query = { ...route.query, q }
  if (!q) delete query.q
  router.push({ path: route.path, query })
}

function onSubmit(v: string) {
  term.value = v
  emit('update:modelValue', term.value)
  emit('search', { q: term.value })
  redirectToSearchScreen(term.value);
//  pushRoute(term.value)
}

function redirectToSearchScreen(query: string) {
    const redirectLink =  '/' + useRuntimeConfig().public.SEARCH_URL + '/index?' + useRuntimeConfig().public.ELASTIC_INDEX + '[query]=' + encodeURIComponent(query);
    console.log('redirecting to search screen with term:', redirectLink);
    navigateTo(redirectLink);
}

function submitFromButton() {
  qaRef.value?.submit()
}
</script>
