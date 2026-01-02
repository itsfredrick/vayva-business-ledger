"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { DayService } from "@/lib/services/day-service";
import { AuditService } from "@/lib/services/audit-service";

export async function getOfficeSales() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Fetch *today's* open day or the most recent day context. 
    // Usually "Today" means the active open day.
    // If we are viewing a specific date (history), we might need date param.
    // prompt says "Table of today's office sales".
    // I will fetch based on the 'current open day' logic or just today's date?
    // Let's assume we want the day record that covers 'now', or the last opened day.
    // However, purely 'today' implies filtering by date.
    // To be safe and consistent with other modules (DayService), let's get the active day.

    // Actually, simpler: Get the latest day record.
    const day = await DayService.getCurrentDay();
    // If no day exists or it's not today? 
    // If no open day, maybe we return null or empty list?
    if (!day) return { sales: [], dayStatus: "CLOSED", dayId: null };

    const sales = await prisma.koolJooOfficeSale.findMany({
        where: { dayId: day.id },
        orderBy: { time: 'desc' },
        include: {
            transfers: true // In case we need to see transfer details
        }
    });

    return {
        sales,
        dayStatus: day.status,
        dayId: day.id,
        isEditable: DayService.isEditable(day)
    };
}

export async function getSalesSettings() {
    const settings = await prisma.companySettings.findFirst(); // Cache this in real app
    return {
        pricePerBag: settings?.sachetRetailPrice || 350
    };
}

import { OfficeSaleSchema } from "@/lib/validation/schemas";
import { validateAction, requireDayEditable } from "@/lib/validation";
import { z } from "zod";

// ... existing code ...

export async function addOfficeSale(raw: z.infer<typeof OfficeSaleSchema>) {
    return validateAction(OfficeSaleSchema, raw, async (data, context) => {
        const day = await DayService.getOrCreateToday();
        if (!day || !DayService.isEditable(day)) throw new Error("Day is closed or not available.");

        const settings = await prisma.companySettings.findFirst();
        const pricePerBag = settings?.sachetRetailPrice || 350;
        const amount = data.bags * pricePerBag;

        // Transaction to ensure atomic create
        await prisma.$transaction(async (tx) => {
            const sale = await tx.koolJooOfficeSale.create({
                data: {
                    dayId: day.id,
                    time: data.time || new Date(),
                    customerName: data.customerName,
                    bags: data.bags,
                    pricePerBag: data.pricePerBag,
                    amountNaira: data.bags * data.pricePerBag,
                    paymentType: data.paymentType,
                    gatePassNumber: data.gatePass,
                    notes: data.notes
                }
            });

            if (data.paymentType === "TRANSFER") {
                await tx.transferLog.create({
                    data: {
                        dayId: day.id,
                        officeSaleId: sale.id, // Link it
                        senderName: data.customerName, // Assume customer is sender
                        amountNaira: amount,
                        bankAccountLabel: "Office Sale",
                        status: "PENDING"
                    }
                });
            }

            // Audit Log inside transaction? Yes, better for consistency
            await AuditService.logAction(
                { userId: context.userId, role: context.role },
                {
                    entityType: "OFFICE_SALE",
                    entityId: sale.id,
                    action: "CREATE",
                    newJson: sale
                }
            );
        });

        revalidatePath("/app/sales");
    });
}
