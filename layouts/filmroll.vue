<template>
  <div class="flex flex-col min-h-screen">
    <header class="dark:bg-gray-800">
      <GlobalNavBar />
    </header>
    <div class="filmroll-container">
      <div class="sprocket-wrapper left-0">
        <div class="sprocket left-sprocket" />
      </div>
      <main class="main grow bg-base-100 dark:bg-gray-950 2xl:px-6">
        <ClientOnly>
          <GlobalIndicatorComp />
        </ClientOnly>
        <slot />
        <ClientOnly>
          <LazyGlobalComparisonDrawer />
        </ClientOnly>
      </main>
      <div class="sprocket-wrapper right-0">
        <div class="sprocket right-sprocket" />
      </div>
    </div>
    <footer class="dark:bg-gray-800">
      <LazyGlobalFooter />
    </footer>
  </div>
</template>

<style scoped>
.filmroll-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0px 20px;
}

.sprocket-wrapper {
  width: 30px;
  height: 100%;
  position: absolute;
  filter: blur(2px) brightness(0.9);
  background-color: rgba(0, 0, 0, 0.5);
}

.sprocket {
  width: 20px;
  /* Reduced width */
  height: 100%;
  background: repeating-linear-gradient(to bottom,
      rgba(1, 1, 1, .8),
      rgba(21, 21, 21, 0.5) 20px,
      /* Increased height */
      rgba(21, 21, 21, 0.05) 20px,
      rgba(21, 21, 21, 0.05) 50px);
  /* Semi-transparent and repeating */
  z-index: 1;
  pointer-events: none;
  padding-left: 10px;
  /* Added padding */
  padding-right: 10px;
  /* Added padding */
}

.left-sprocket {
  position: absolute;
  left: 5px;
}

.right-sprocket {
  position: absolute;
  right: 5px;
}
</style>