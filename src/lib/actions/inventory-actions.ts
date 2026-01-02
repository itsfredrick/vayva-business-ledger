"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { DayService } from "@/lib/services/day-service";
import { AuditService } from "@/lib/services/audit-service";
import { z } from "zod";
import { InventoryUpdateSchema } from "@/lib/validation/schemas";
import { validateAction } from "@/lib/validation";

export async function getInventoryDay() {
    const day = await DayService.getCurrentDay();
    // If no open day, return null-ish state but safe for UI
    if (!day) return { inventory: null, dayStatus: "CLOSED" as const, dayId: null, isEditable: false };

    // 1. Get Outgoing Drivers (Sum loaded bags from trips)
    const trips = await prisma.trip.aggregate({
        where: { driverDay: { dayId: day.id } },
        _sum: { loadedBags: true }
    });
    const outgoingDriverParams = trips._sum.loadedBags || 0;

    // 2. Get Outgoing Office Sales (Sum bags)
    const sales = await prisma.koolJooOfficeSale.aggregate({
        where: { dayId: day.id },
        _sum: { bags: true }
    });
    const outgoingSalesParams = sales._sum.bags || 0;

    // 3. Get Previous Day Closing for Opening
    // Find day before current
    const prevDay = await prisma.dayRecord.findFirst({
        where: { date: { lt: day.date } },
        orderBy: { date: 'desc' },
        include: { inventory: true }
    });
    const openingBagsLocked = prevDay?.inventory?.closingBagsConfirmed || 0;

    // 4. Find or Create InventoryDay
    let inventory = await prisma.inventoryDay.findUnique({
        where: { dayId: day.id }
    });

    if (!inventory) {
        inventory = await prisma.inventoryDay.create({
            data: {
                dayId: day.id,
                openingBags: openingBagsLocked,
                outgoingDriverLoadsBags: outgoingDriverParams,
                outgoingOfficeSalesBags: outgoingSalesParams
            }
        });
    } else {
        // Always refresh computed outgoing stats on load? Yes, keeps it accurate.
        // But only if day is editable or we want live stats.
        if (DayService.isEditable(day)) {
            inventory = await prisma.inventoryDay.update({
                where: { id: inventory.id },
                data: {
                    openingBags: openingBagsLocked, // Ensure it sticks
                    outgoingDriverLoadsBags: outgoingDriverParams,
                    outgoingOfficeSalesBags: outgoingSalesParams,
                    // Re-calc computed closing
                    closingBagsComputed: openingBagsLocked + inventory.producedBags - inventory.spoilageBags - outgoingDriverParams - outgoingSalesParams,
                    // Re-calc variance if confirmed is set
                    varianceBags: inventory.closingBagsConfirmed !== null
                        ? inventory.closingBagsConfirmed - (openingBagsLocked + inventory.producedBags - inventory.spoilageBags - outgoingDriverParams - outgoingSalesParams)
                        : 0
                }
            });
        }
    }

    return {
        inventory,
        dayStatus: day.status,
        dayId: day.id,
        isEditable: DayService.isEditable(day)
    };
}

export async function updateInventory(raw: z.infer<typeof InventoryUpdateSchema>) {
    return validateAction(InventoryUpdateSchema, raw, async (data, context) => {
        const day = await DayService.getCurrentDay();
        if (!day || !DayService.isEditable(day)) throw new Error("Day is closed or not available.");

        const inventory = await prisma.inventoryDay.findUnique({ where: { dayId: day.id } });
        if (!inventory) throw new Error("Inventory record not found. Refresh page.");

        // Recalculate everything
        const computed = inventory.openingBags + data.producedBags - data.spoilageBags - inventory.outgoingDriverLoadsBags - inventory.outgoingOfficeSalesBags;

        // Variance is Valid only if closingConfirmed is provided
        let variance = 0;
        let closingVal = inventory.closingBagsConfirmed;

        if (data.closingBagsConfirmed !== undefined) {
            closingVal = data.closingBagsConfirmed;
            variance = data.closingBagsConfirmed - computed;
        } else if (inventory.closingBagsConfirmed !== null) {
            variance = inventory.closingBagsConfirmed - computed;
        }

        const updated = await prisma.inventoryDay.update({
            where: { id: inventory.id },
            data: {
                producedBags: data.producedBags,
                spoilageBags: data.spoilageBags,
                closingBagsComputed: computed,
                closingBagsConfirmed: closingVal,
                varianceBags: variance,
                notes: data.notes
            }
        });

        // Audit Log
        await AuditService.logAction(
            { userId: context.userId, role: context.role },
            {
                entityType: "INVENTORY",
                entityId: inventory.id,
                action: "UPDATE",
                oldJson: inventory,
                newJson: updated
            }
        );

        // Notification Trigger
        if (Math.abs(variance) > 50) {
            const existing = await prisma.notification.findFirst({
                where: { dayId: day.id, type: "INVENTORY_VARIANCE" }
            });

            if (!existing) {
                await prisma.notification.create({
                    data: {
                        type: "INVENTORY_VARIANCE",
                        severity: "WARNING",
                        dayId: day.id,
                        message: `High Inventory Variance Detected: ${variance} bags.`
                    }
                });
            }
        }

        revalidatePath("/app/inventory");
    });
}

export async function getInventoryHistory() {
    const session = await auth();
    if (session?.user?.role !== "OWNER") throw new Error("Unauthorized");

    // Fetch last 30 days?
    return await prisma.inventoryDay.findMany({
        include: { day: true },
        orderBy: { day: { date: 'desc' } },
        take: 30
    });
}
