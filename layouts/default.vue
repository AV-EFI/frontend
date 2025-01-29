<template>
  <div class="flex flex-col min-h-screen">
    <header class="dark:bg-slate-800">
      <GlobalNavBar />
    </header>
    <main class="main grow bg-neutral dark:bg-slate-950 2xl:px-6">
      <ClientOnly>
        <GlobalIndicatorComp />
      </ClientOnly>
      <slot />
      <GlobalComparisonDrawer />
    </main>
    <footer class="dark:bg-slate-800">
      <LazyGlobalFooter />
    </footer>
  </div>
</template>