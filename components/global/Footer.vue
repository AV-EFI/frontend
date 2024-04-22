<template>
  <client-only>
    <footer class="footer bg-primary-800 text-white dark:bg-gray-800 dark:text-white dark:border-gray-700">
      <div class="container mx-auto flex p-4">        
        <div class="flex flex-row w-full justify-between">
          <nav class="flex-1">
            <h6 class="footer-title">
              Info
            </h6> 
            <p class="text-light text-start">
              {{ $t("linkscollection") }}
            </p>
            <label class="swap swap-flip text-xl">
  
              <!-- this hidden checkbox controls the state -->
              <input type="checkbox">
  
              <div class="swap-on">😈</div>
              <div class="swap-off">😇</div>
            </label>
          </nav>
          <nav class="flex-1">
            <h6 class="footer-title">
              {{ $t("language") }}
            </h6>
            <GlobalLanguageSwitch />
          </nav>
          <nav class="flex-1">
            <h6 class="footer-title">
              {{ $t("theme") }}
            </h6>
            <GlobalThemeSwitch />
          </nav>
        </div>
      </div>
    </footer>
  </client-only>
</template>