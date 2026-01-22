<template>
  <!-- has_event -->
  <div class="grid col-span-full grid-cols-12 gap-2">
    <div class="col-span-full">
      <h5 class="text-sm font-bold text-primary-800 tracking-wide dark:text-primary-100">
        <slot name="heading" />
      </h5>
    </div>

    <!--right (mobile first)-->
    <div class="grid col-span-full md:col-span-4 gap-x-2 gap-y-1 order-1 md:order-2">
      <div class="col-span-full md:col-span-12">
        <div class="grid col-span-8 grid-cols-12  gap-x-2 gap-y-1">
          <slot name="right" />
        </div>
      </div>
    </div>

    <!--left (mobile second)-->
    <div class="grid col-span-full md:col-span-8 grid-cols-12 gap-2 order-2 md:order-1">
      <div class="col-span-full md:col-span-12">
        <div class="grid col-span-8 grid-cols-12  gap-x-2 gap-y-1">
          <slot name="left" />
        </div>
      </div>
    </div>
  </div>
</template>