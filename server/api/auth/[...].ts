import CredentialsProvider from "next-auth/providers/credentials";
import { NuxtAuthHandler } from "#auth";

export default NuxtAuthHandler({
    // secret needed to run nuxt-auth in production mode (used to encrypt data)
    secret: useRuntimeConfig().private.NUXT_SECRET,
    providers: [
        // @ts-ignore Import is exported on .default during SSR, so we need to call it this way. May be fixed via Vite at some point
        CredentialsProvider.default({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: "Credentials",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                identifier: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // NOTE: THE BELOW LOGIC IS NOT SAFE OR PROPER FOR AUTHENTICATION!

                try {
                    const payload = {
                        identifier: credentials.identifier,
                        password: credentials.password,
                    };

                    const userTokens = await $fetch<{
                        data: { access_token: string; expires: number; refresh_token: string };
                    } | null>(`${useRuntimeConfig().public.apiUrl}/api/auth/local/`, {
                        method: "POST",
                        body: payload,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    console.error("THE BELOW LOGIC IS NOT SAFE OR PROPER FOR AUTHENTICATION!");

                    const userDetails = await $fetch<{
                        user: {
                            id: string;
                            email: string;
                            role_name: string;
                            role_id: number;
                            confirmed: boolean;
                        };
                    } | null>(`${useRuntimeConfig().public.apiUrl}/api/users/me?populate=*`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept-Language": "en-US",
                            Authorization: `Bearer ${userTokens?.jwt}`,
                        },
                    });

                    if (!userTokens || !userTokens.data || !userDetails || !userDetails.user) {
                        throw createError({
                            statusCode: 500,
                            statusMessage: "Next auth failed",
                        });
                    }

                    const user = {
                        id: userDetails.user.id,
                        email: userDetails.user.email,
                        //firstName: userDetails.data.first_name,
                        //lastName: userDetails.data.last_name,
                        confirmed: userDetails.user.confirmed,
                        roleName: userDetails.user.role_name,
                        roleId: userDetails.user.role_id,
                        //accessToken: userTokens.data.access_token,
                        //accessTokenExpires: Date.now() + userTokens.data.expires,
                        //refreshToken: userTokens.data.refresh_token,
                    };

                    console.log(user);

                    const allowedRoles = [
                        "Public",
                        "Authenticated",
                        "Editor",
                    ];

                    // Only allow admins and sales
                    if (!allowedRoles.includes(user.roleName)) {
                        throw createError({
                            statusCode: 403,
                            statusMessage: "Not allowed",
                        });
                    }

                    return user;
                } catch (error) {
                    console.error("####", error);
                    console.error("Error logging in", error);
                    return null;
                }
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },
    /*
        callbacks: {
            async jwt({ token, user, account }) {
                if (account && user) {
                    console.warn("JWT callback", { token, user, account });
                    return {
                        ...token,
                        ...user,
                    };
                }
    
                // Handle token refresh before it expires of 15 minutes
                if (token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
                    console.warn("Token is expired. Getting a new");
                    return refreshAccessToken(token);
                }
    
                return token;
            },
            async session({ session, token }) {
                console.warn("Calling async session", session, token);
                session.user = {
                    ...session.user,
                    ...token,
                };
    
                return session;
            },
        },
        */
});