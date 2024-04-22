import { getToken, getServerSession } from "#auth";

export default defineEventHandler(async (event) => {

    const token = await getToken({ event });
    console.log("###token###");
    console.log(token);

    /*
    const session = await getServerSession(event);
    if (!session) {
        console.error("unauthenticated @data.get.ts");
        return { status: 'unauthenticated' };
    }

    console.log("#data.get#session:");
    console.log(session);

    const token = await getToken({ event });

    const response: any = await $fetch(
        `${useRuntimeConfig().public.apiUrl}/api/users/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    }
    );
    return response;
    */
});