"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { DayService } from "@/lib/services/day-service";
import { z } from "zod";
import { DriverService } from "@/lib/services/driver-service";
import { AuditService } from "@/lib/services/audit-service";

// --- Fetching ---

export async function getDriverDay(id: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await requireStaffOrOwner();

    return await prisma.driverDay.findUnique({
        where: { id },
        include: {
            driverProfile: true,
            day: true,
            trips: { orderBy: { departTime: 'asc' } },
            supplierDeliveries: true,
            transferLogs: { orderBy: { claimedAt: 'desc' } }
        }
    });
}

// --- Mutations ---

import { TripSchema, SupplierDeliverySchema, TransferLogSchema, DriverDayUpdateSchema } from "@/lib/validation/schemas";
import { validateAction, requireDayEditable } from "@/lib/validation";

// ... existing code ...

export async function addTrip(raw: z.infer<typeof TripSchema>) {
    return validateAction(TripSchema, raw, async (data, context) => {
        const dd = await prisma.driverDay.findUnique({
            where: { id: data.driverDayId },
            include: { day: true }
        });
        if (!dd) throw new Error("Driver Day not found");

        // Guard: Day Editable
        if (!DayService.isEditable(dd.day)) throw new Error("Day is closed");

        // Guard: Gate Pass Unique
        const existing = await prisma.trip.findFirst({
            where: {
                driverDay: { dayId: dd.dayId },
                gatePassNumber: data.gatePass
            }
        });
        if (existing) throw new Error(`Gate pass '${data.gatePass}' already used today.`);

        const trip = await prisma.trip.create({
            data: {
                driverDayId: data.driverDayId,
                gatePassNumber: data.gatePass,
                loadedBags: data.bags,
                departTime: data.departTime,
                notes: data.notes
            }
        });

        await DriverService.recomputeDay(data.driverDayId);

        await AuditService.logAction(
            { userId: context.userId, role: context.role },
            {
                entityType: "TRIP",
                entityId: trip.id,
                action: "CREATE",
                newJson: trip
            }
        );

        revalidatePaths(data.driverDayId);
    });
}

export async function updateDriverDay(driverDayId: string, raw: z.infer<typeof DriverDayUpdateSchema>) {
    return validateAction(DriverDayUpdateSchema, raw, async (data, context) => {
        const dd = await prisma.driverDay.findUnique({
            where: { id: driverDayId },
            include: { day: true, trips: true, supplierDeliveries: true }
        });
        if (!dd) throw new Error("Driver Day not found");
        if (!DayService.isEditable(dd.day)) throw new Error("Day is closed");

        // Invariant: Final Return <= Total Loaded
        if (data.finalReturnBags !== undefined) {
            const totalLoaded = dd.trips.reduce((sum, t) => sum + t.loadedBags, 0);
            if (data.finalReturnBags > totalLoaded) {
                throw new Error(`Cannot return more bags (${data.finalReturnBags}) than loaded (${totalLoaded}).`);
            }
        }

        const updated = await prisma.driverDay.update({
            where: { id: driverDayId },
            data
        });

        await DriverService.recomputeDay(driverDayId);

        await AuditService.logAction(
            { userId: context.userId, role: context.role },
            {
                entityType: "DRIVER_DAY",
                entityId: driverDayId,
                action: "UPDATE",
                oldJson: dd,
                newJson: updated
            }
        );

        revalidatePaths(driverDayId);
    });
}

export async function addSupplierDelivery(raw: z.infer<typeof SupplierDeliverySchema>) {
    return validateAction(SupplierDeliverySchema, raw, async (data) => {
        const dd = await prisma.driverDay.findUnique({
            where: { id: data.driverDayId },
            include: { day: true }
        });
        if (!dd) throw new Error("Not found");
        if (!DayService.isEditable(dd.day)) throw new Error("Day closed");

        await prisma.supplierDelivery.create({
            data: {
                driverDayId: data.driverDayId,
                supplierName: data.supplierName,
                bags: data.bags,
                pricePerBag: data.price,
                amountNaira: data.bags * data.price,
                addressText: data.address
            }
        });

        await DriverService.recomputeDay(data.driverDayId);
        revalidatePaths(data.driverDayId);
    });
}

export async function addTransferLog(raw: z.infer<typeof TransferLogSchema>) {
    return validateAction(TransferLogSchema, raw, async (data, context) => {
        const dd = await prisma.driverDay.findUnique({ where: { id: data.driverDayId! }, include: { day: true } });
        if (!dd || !DayService.isEditable(dd.day)) throw new Error("Day closed or invalid");

        const transfer = await prisma.transferLog.create({
            data: {
                driverDayId: data.driverDayId,
                senderName: data.senderName,
                amountNaira: data.amount,
                bankAccountLabel: data.bankLabel || "Manual",
                proofImageUrl: data.proofUrl,
                status: "PENDING"
            }
        });

        await DriverService.recomputeDay(data.driverDayId!);

        await AuditService.logAction(
            { userId: context.userId, role: context.role },
            {
                entityType: "TRANSFER",
                entityId: transfer.id,
                action: "CREATE_DRIVER_TRANSFER",
                newJson: transfer
            }
        );

        revalidatePaths(data.driverDayId!);
    });
}


// --- Helpers ---

async function requireStaffOrOwner() {
    const session = await auth();
    if (!session || !["STAFF", "OWNER"].includes(session.user?.role || "")) {
        throw new Error("Unauthorized");
    }
}

async function getEditableDriverDay(id: string) {
    const dd = await prisma.driverDay.findUnique({
        where: { id },
        include: { day: true }
    });
    if (!dd) throw new Error("Driver Day not found");
    if (!DayService.isEditable(dd.day)) throw new Error("Day is closed");
    return dd;
}

function revalidatePaths(id: string) {
    revalidatePath(`/app/drivers/${id}`);
    revalidatePath("/app/drivers");
}
