import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export type AuditContext = {
    userId: string;
    role: Role;
};

export type AuditParams = {
    entityType: string;
    entityId?: string;
    action: string;
    oldJson?: any;
    newJson?: any;
    reason?: string;
};

export class AuditService {
    /**
     * Records an action in the AuditLog.
     */
    static async logAction(context: AuditContext, params: AuditParams) {
        try {
            await prisma.auditLog.create({
                data: {
                    userId: context.userId,
                    entityType: params.entityType,
                    entityId: params.entityId,
                    action: params.action,
                    oldJson: params.oldJson ? JSON.stringify(params.oldJson) : null,
                    newJson: params.newJson ? JSON.stringify(params.newJson) : null,
                    reason: params.reason,
                    timestamp: new Date(),
                },
            });
        } catch (error) {
            // We don't want audit logging failures to crash the main transaction, 
            // but we should definitely log them to the console for monitoring.
            console.error("CRITICAL: Failed to write audit log", error, params);
        }
    }
}
