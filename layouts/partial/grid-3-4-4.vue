<template>
  <!-- has_event -->
  <div class="grid col-span-full grid-cols-11">
    <div class="col-span-full">
      <h5 class="text-sm font-bold uppercase text-primary-500 tracking-wide dark:text-primary-100">
        <slot name="heading" />
      </h5>
    </div>
    <div        
      class="grid col-span-12 md:col-span-4 grid-cols-12 gap-2"
    >
      <div class="grid col-span-full md:col-span-12 gap-2">
        <slot name="left" />
      </div>
    </div>
    <div class="grid col-span-12 md:col-span-4 grid-cols-12 gap-2">
      <div class="grid col-span-full md:col-span-12 gap-2">
        <!-- has_activity -->
        <slot name="center" />
      </div>
    </div>
    <div class="grid col-span-12 md:col-span-3 grid-cols-12 gap-2">
      <div class="grid grid-rows-[36px_minmax(100px,_1fr)_100px] col-span-full md:col-span-12 gap-2">
        <!-- has_activity -->
        <slot name="right" />
      </div>
    </div>
  </div>
</template>