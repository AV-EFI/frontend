<template>
  <section>
    <div class="w-full sm:w-3/4 lg:w-1/2 mx-auto card card-side bg-neutral-50 dark:bg-gray-800 shadow-xl">
      <slot name="figure">
        <figure class="hidden dark:bg-gray-700 h-60 lg:p-4 lg:inline-flex self-center">
          <img
            class="hidden object-contain h-4/5 w-4/5 lg:inline-flex"
            src="/img/AV-EFI-Logo.png"
            alt="Login Figure"
            title="🥳"
          >
        </figure>
      </slot>
      <div class="card-body">
        <h2 class="text-xl">
          <slot name="title" />
        </h2>
        <slot name="cardBody">
          Card content
        </slot>
      </div>
    </div>
  </section>
</template>