"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// --- License Management ---

export async function getLicenses() {
    const session = await auth();
    if (!["STAFF", "OWNER"].includes(session?.user?.role || "")) throw new Error("Unauthorized");

    const licenses = await prisma.license.findMany({
        orderBy: { expiryDate: 'asc' }
    });

    const now = new Date();
    // Compute status in-memory for UI
    return licenses.map(l => {
        const daysRemaining = Math.ceil((l.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        let status: "OK" | "WARNING" | "CRITICAL" | "EXPIRED" = "OK";

        if (daysRemaining < 0) status = "EXPIRED";
        else if (daysRemaining <= 7) status = "CRITICAL";
        else if (daysRemaining <= 30) status = "WARNING";

        return {
            ...l,
            daysRemaining,
            status
        };
    });
}

export async function addLicense(data: {
    name: string;
    licenseNumber: string;
    expiryDate: Date;
    notes?: string;
    documentUrl?: string;
}) {
    const session = await auth();
    if (!["STAFF", "OWNER"].includes(session?.user?.role || "")) throw new Error("Unauthorized");

    await prisma.license.create({
        data: {
            name: data.name,
            licenseNumber: data.licenseNumber,
            expiryDate: data.expiryDate,
            notes: data.notes,
            documentUrl: data.documentUrl
        }
    });

    revalidatePath("/app/licenses");
}

// --- Automated Job Logic ---

export async function checkLicenseExpiry() {
    // Intended to be called by a cron job or manual trigger
    const licenses = await prisma.license.findMany();
    const now = new Date();

    const notifications = [];

    for (const l of licenses) {
        const daysRemaining = Math.ceil((l.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Thresholds: 30, 14, 7, 1
        if ([30, 14, 7, 1].includes(daysRemaining) || daysRemaining === 0) {
            // Avoid duplicate notifications for same license/day?
            // Schema: Notification has licenseId.
            // Check if one exists created TODAY for this license.
            const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
            const exists = await prisma.notification.findFirst({
                where: {
                    licenseId: l.id,
                    type: "LICENSE_EXPIRY",
                    createdAt: { gte: startOfDay }
                }
            });

            if (!exists) {
                notifications.push({
                    type: "LICENSE_EXPIRY",
                    severity: daysRemaining <= 7 ? "CRITICAL" : "WARNING",
                    licenseId: l.id,
                    message: `License '${l.name}' expires in ${daysRemaining} days.`,
                });
            }
        }
    }

    if (notifications.length > 0) {
        // Needs many create calls or loop since createMany doesn't support relation well in all providers?
        // SQLite supports createMany.
        await prisma.notification.createMany({
            data: notifications.map(n => ({
                type: "LICENSE_EXPIRY",
                severity: n.severity as any,
                licenseId: n.licenseId,
                message: n.message,
                createdAt: new Date()
            }))
        });
    }

    return { processed: licenses.length, notificationsSent: notifications.length };
}
