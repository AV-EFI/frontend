<template>
  <div class="flex flex-col min-h-screen">
    <header>
      <GlobalNavBar />
    </header>
    <main class="main grow">
      <slot />
      <GlobalComparisonDrawer />
    </main>
    <LazyGlobalFooter />
  </div>
</template>