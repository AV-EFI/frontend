<template>
  <div class="flex flex-col min-h-screen">
    <header
      :class="{'scrolled': isScrolled}"
      class="fixed top-0 left-0 w-full z-20"
    >
      <GlobalNavBar />
    </header>
    <main class="main grow bg-neutral dark:bg-slate-950 2xl:px-6 mt-[var(--header-height)]">
      <ClientOnly>
        <!--GlobalIndicatorComp /-->
      </ClientOnly>
      <slot />
      <GlobalComparisonDrawer />
    </main>
    <footer class="dark:bg-slate-800">
      <LazyGlobalFooter />
    </footer>
  </div>
</template>

<script>
export default {
    data() {
        return {
            isScrolled: false
        };
    },
    mounted() {
        const header = document.querySelector('header');
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

        window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        handleScroll() {
            this.isScrolled = window.scrollY > 50;
        }
    }
};
</script>
