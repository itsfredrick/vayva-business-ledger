import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnApp = nextUrl.pathname.startsWith('/app');
            if (isOnApp) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                // If user is logged in and tries to access login page, redirect to dashboard
                if (nextUrl.pathname.startsWith('/login')) {
                    return Response.redirect(new URL('/app/dashboard', nextUrl));
                }
            }
            return true;
        },
        session({ session, token }) {
            if (token.role && session.user) {
                session.user.role = token.role as any; // Type assertion needed until types are extended
            }
            return session;
        },
        jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
