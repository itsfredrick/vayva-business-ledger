import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';
import { prisma } from './lib/prisma';
import type { User } from '@prisma/client';

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ username: z.string().min(2), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { username, password } = parsedCredentials.data;

                    // 1. Rate Limiting Check (Simplified: Check last 15 mins for > 5 failures)
                    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
                    const recentFailures = await prisma.loginAttempt.count({
                        where: {
                            username,
                            success: false,
                            timestamp: { gte: fifteenMinsAgo }
                        }
                    });

                    if (recentFailures >= 5) {
                        console.warn(`Rate limit triggered for ${username}`);
                        throw new Error("Too many failed attempts. Try again in 15 minutes.");
                    }

                    const user = await prisma.user.findUnique({ where: { username } });

                    if (!user || user.isActive === false) {
                        await prisma.loginAttempt.create({ data: { username, success: false } });
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) {
                        await prisma.loginAttempt.create({ data: { username, success: true } });
                        return user;
                    } else {
                        await prisma.loginAttempt.create({ data: { username, success: false } });
                    }
                }
                return null;
            },
        }),
    ],
});
