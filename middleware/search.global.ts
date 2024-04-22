//import { defineNuxtRouteMiddleware } from '#app';

export default defineNuxtRouteMiddleware(async (to) => {
    if (to.path == '/') {
        console.log("request to home");
    }
});