import { prisma } from "@/lib/prisma";
import { DayStatus, NotificationType, Severity } from "@prisma/client";

export class DayService {
    /**
     * Get today's DayRecord, creating it if it doesn't exist (Mon-Sat).
     * Sunday returns null unless force-created manually (not auto).
     */
    static async getOrCreateToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingDay = await prisma.dayRecord.findUnique({
            where: { date: today },
            include: {
                unlockRequestedBy: { select: { name: true } },
                openedBy: { select: { name: true } }
            }
        });

        if (existingDay) return existingDay;

        // Auto-create only Mon-Sat (1-6)
        const dayOfWeek = today.getDay();
        if (dayOfWeek === 0) { // Sunday
            return null;
        }

        // Create new day
        return await prisma.dayRecord.create({
            data: {
                date: today,
                status: "OPEN",
                // In a real app we might want to track who "triggered" this, 
                // but for auto-open on first visit, we can leave openedById null or use system bot.
            },
            include: {
                unlockRequestedBy: { select: { name: true } },
                openedBy: { select: { name: true } }
            }
        });
    }

    /**
     * Get the most recent day record (for current context).
     */
    static async getCurrentDay() {
        return await prisma.dayRecord.findFirst({
            orderBy: { date: 'desc' },
            include: {
                unlockRequestedBy: { select: { name: true } },
                openedBy: { select: { name: true } }
            }
        });
    }

    /**
     * Close the current day.
     */
    static async closeDay(dayId: string, userId: string) {
        const day = await prisma.dayRecord.update({
            where: { id: dayId },
            data: {
                status: "CLOSED",
                closedAt: new Date(),
                closedById: userId,
            },
        });

        await prisma.auditLog.create({
            data: {
                entityType: "DayRecord",
                entityId: dayId,
                action: "CLOSE_DAY",
                userId: userId,
                reason: "Staff manual close",
            },
        });

        return day;
    }

    /**
     * Request an unlock for a closed day.
     */
    static async requestUnlock(dayId: string, reason: string, userId: string) {
        const day = await prisma.dayRecord.update({
            where: { id: dayId },
            data: {
                unlockRequestReason: reason,
                unlockRequestedById: userId,
            },
        });

        // Create Notification for Owners
        await prisma.notification.create({
            data: {
                type: NotificationType.DAY_UNLOCK_REQUEST,
                severity: Severity.WARNING,
                message: `Unlock requested for day ${dayId.slice(-6)}: ${reason}`,
                dayId: dayId,
            },
        });

        await prisma.auditLog.create({
            data: {
                entityType: "DayRecord",
                entityId: dayId,
                action: "REQUEST_UNLOCK",
                userId: userId,
                reason: reason,
            },
        });

        return day;
    }

    /**
     * Owner approves unlock, setting a window.
     */
    static async approveUnlock(dayId: string, windowMinutes: number, ownerId: string) {
        const unlockUntil = new Date();
        unlockUntil.setMinutes(unlockUntil.getMinutes() + windowMinutes);

        const day = await prisma.dayRecord.update({
            where: { id: dayId },
            data: {
                unlockWindowUntil: unlockUntil,
                // Optional: clear the request fields so it's "resolved"
                // or keep them for history. Let's keep them but maybe add a status?
                // For now, setting the window implies approval.
            },
        });

        await prisma.auditLog.create({
            data: {
                entityType: "DayRecord",
                entityId: dayId,
                action: "APPROVE_UNLOCK",
                userId: ownerId,
                reason: `Unlocked for ${windowMinutes} minutes`,
            },
        });

        return day;
    }

    /**
   * Check if a day is editable (Open OR Unlocked Window Active)
   */
    static isEditable(day: any) {
        if (day.status === "OPEN") return true;

        if (day.unlockWindowUntil && new Date() < new Date(day.unlockWindowUntil)) {
            return true;
        }
        return false;
    }
}
