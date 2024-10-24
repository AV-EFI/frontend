/*
import { getServerSession } from '#auth';
export default eventHandler(async (event) => {
    const session = await getServerSession(event);
    if (!session) {
        console.log("no session");
        //throw createError({ statusMessage: 'Unauthenticated', statusCode: 403 });
    }
});
*/
//import { getServerSession, getToken } from '#auth';
import { H3Event } from 'h3';

export default eventHandler(async (event: H3Event) => {
    //console.log("### server middleware eventhandler called");
    //console.log(event);
    //const token = await getToken({ event });
    //console.log("###token++");
    //console.log(token);
    //const session = await getServerSession(event);
    //console.log(session);
    /*
    if (!token) {
        console.log("unauthenticated @middleware");
        throw createError({ statusMessage: 'Unauthenticated', statusCode: 403 });

    }
    */
    /*
    const session = await getServerSession(event);
    if (!session) {
        console.log("unauthenticated @middleware");
        throw createError({ statusMessage: 'Unauthenticated', statusCode: 403 });
    }
    */
});