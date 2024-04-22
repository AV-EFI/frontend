<template>
  <section>
    <div class="w-full sm:w-3/4 lg:w-1/2 mx-auto card card-side bg-neutral-50 dark:dark:bg-gray-800 shadow-xl">
      <div class="card-body">
        <div class="w-full flex flex-row">
          <slot name="actions">
            no actions available
          </slot>
        </div>        
        <h2 class="text-md">
          <slot name="title" />
        </h2>
        <slot name="cardBody">
          Card content
        </slot>
      </div>
    </div>
  </section>
</template>