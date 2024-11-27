//import { defineNuxtRouteMiddleware } from '#app';

export default defineNuxtRouteMiddleware(async (to) => {
    if (to.path.startsWith('/protected')) {
        //const debug = await useAuth();
        //console.log(debug);
    }
});