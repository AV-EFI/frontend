<template>
  <section>
    <div class="container flex justify-items flex-col xl:flex-row w-full mx-auto">
      <div class="flex flex-col">
        <div class="container p-2">
          <h1 class="text-xl">
            <slot name="title">
              Title will be overridden
            </slot>
          </h1>
        </div>
        <div class="container">
          <div class="flex flex-col xl:flex-row container mx-auto">
            <div class="xl:w-2/3 card m-2 p-4 bg-neutral-50 dark:bg-gray-800 shadow-xl">
              <slot name="containerLeft">
                ContentLeft
              </slot>
            </div>
            <div class="xl:w-1/3 m-2 p-4 bg-neutral-50 dark:bg-gray-800 card shadow-xl">
              <slot name="containerRight">
                ContentRight
              </slot>
            </div>
          </div>
        </div>        
      </div>
    </div>
  </section>
</template>