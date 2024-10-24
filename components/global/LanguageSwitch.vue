<template>
  <div>
    <pre class="hidden">{{ $i18n.locale }}</pre>
    <label class="swap swap-flip">
      <!-- this hidden checkbox controls the state -->
      <input
        v-model="$i18n.locale"
        type="checkbox"
        true-value="de"
        false-value="en"
        :value="$i18n.locale"
        class="checkbox theme-controller hidden"
      >

      <div
        class="swap-off"
        alt="Deutsche Sprache"
        title="Deutsche Sprache"
      >
        <Suspense>
          <Icon
            id="localeGerman"
            class="h-8 w-8"
            alt="Deutsche Sprache"
            title="Deutsche Sprache"
            name="emojione:flag-for-germany"
          />
        </Suspense>
      </div>
      <div
        class="swap-on"
        alt="English language"
        title="English language"
      >
        <Suspense>
          <Icon
            id="localeEnglish"
            name="emojione:flag-for-united-kingdom" 
            class="h-8 w-8"
            alt="English language"
            title="English language"
          />
        </Suspense>
      </div>
    </label>
  </div>
</template>