"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getAuditLogs(params: {
    entityType?: string;
    action?: string;
    userId?: string;
    limit?: number;
    offset?: number;
}) {
    const session = await auth();
    if (session?.user?.role !== "OWNER") throw new Error("Unauthorized");

    const { entityType, action, userId, limit = 50, offset = 0 } = params;

    const where: any = {};
    if (entityType) where.entityType = entityType;
    if (action) where.action = action;
    if (userId) where.userId = userId;

    const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
            where,
            include: {
                user: { select: { name: true, role: true } }
            },
            orderBy: { timestamp: "desc" },
            take: limit,
            skip: offset
        }),
        prisma.auditLog.count({ where })
    ]);

    return { logs: logs as any[], total }; // Casting for simplicity in UI
}

export async function getAuditMetadata() {
    const session = await auth();
    if (session?.user?.role !== "OWNER") throw new Error("Unauthorized");

    const [entityTypes, actions, users] = await Promise.all([
        prisma.auditLog.groupBy({ by: ["entityType"] }),
        prisma.auditLog.groupBy({ by: ["action"] }),
        prisma.user.findMany({
            where: { auditLogs: { some: {} } },
            select: { id: true, name: true }
        })
    ]);

    return {
        entityTypes: entityTypes.map(e => e.entityType),
        actions: actions.map(a => a.action),
        users
    };
}
