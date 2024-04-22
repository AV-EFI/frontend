<template>
  <section>
    <ContentDoc>
      <template #not-found>
        <div class="w-full sm:w-3/4 lg:w-1/2 mx-auto card card-side bg-neutral-50 dark:dark:bg-gray-800 shadow-xl">
          <div class="card-body">
            <h1 class="text-xl">
              Document not found
            </h1>
          </div>
        </div>
      </template>
    </ContentDoc>
  </section>
</template>