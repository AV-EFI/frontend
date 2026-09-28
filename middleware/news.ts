import { isNewsEnabled } from '~/utils/newsEnabled';

export default defineNuxtRouteMiddleware(() => {
  if (!isNewsEnabled(useRuntimeConfig().public.newsEnabled)) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' });
  }
});
