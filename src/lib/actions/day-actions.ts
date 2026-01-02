"use server";

import { DayService } from "@/lib/services/day-service";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { AuditService } from "@/lib/services/audit-service";

export async function closeDayAction(dayId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await DayService.closeDay(dayId, session.user.id);

    await AuditService.logAction(
        { userId: session.user.id, role: session.user.role as any },
        {
            entityType: "DAY",
            entityId: dayId,
            action: "CLOSE"
        }
    );

    revalidatePath("/app/today");
}

export async function requestUnlockAction(dayId: string, reason: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await DayService.requestUnlock(dayId, reason, session.user.id);

    await AuditService.logAction(
        { userId: session.user.id, role: session.user.role as any },
        {
            entityType: "DAY",
            entityId: dayId,
            action: "REQUEST_UNLOCK",
            reason
        }
    );

    revalidatePath("/app/today");
}

export async function approveUnlockAction(dayId: string, minutes: number) {
    const session = await auth();
    if (session?.user?.role !== "OWNER") throw new Error("Unauthorized");

    if (!session?.user?.id) throw new Error("User ID missing");

    await DayService.approveUnlock(dayId, minutes, session.user.id);

    await AuditService.logAction(
        { userId: session.user.id, role: "OWNER" },
        {
            entityType: "DAY",
            entityId: dayId,
            action: "APPROVE_UNLOCK",
            reason: `Unlock granted for ${minutes} minutes`
        }
    );

    revalidatePath("/app/unlock-requests");
}
