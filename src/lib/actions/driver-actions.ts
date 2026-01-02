"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { DayService } from "@/lib/services/day-service";
import { AuditService } from "@/lib/services/audit-service";

export async function getDriverProfiles() {
    return await prisma.driverProfile.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
    });
}

export async function getDriverStats(profileId: string) {
    // Find the most recent DriverDay for this profile
    const lastDay = await prisma.driverDay.findFirst({
        where: { driverProfileId: profileId },
        orderBy: { day: { date: "desc" } },
        select: { outstandingEndNaira: true },
    });

    return {
        lastOutstanding: lastDay?.outstandingEndNaira || 0,
    };
}

export async function addDriverToDay(
    data: {
        dayId: string;
        profileId?: string; // If existing
        newProfileName?: string; // If new
        motorBoyName?: string;
        outstandingStartNaira: number;
        phoneNumber?: string;
    }
) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const day = await prisma.dayRecord.findUnique({
        where: { id: data.dayId },
    });

    if (!day) throw new Error("Day not found");
    if (!DayService.isEditable(day)) throw new Error("Day is closed and locked.");

    let driverId = data.profileId;

    // Create new profile if needed
    if (!driverId && data.newProfileName) {
        const newProfile = await prisma.driverProfile.create({
            data: {
                name: data.newProfileName,
                // phoneNumber: data.phoneNumber, // Check if schema has this
            },
        });
        driverId = newProfile.id;
    }

    if (!driverId) throw new Error("Driver profile required");

    // Check if already added using findFirst since schema might lack unique constraint
    const existing = await prisma.driverDay.findFirst({
        where: {
            dayId: data.dayId,
            driverProfileId: driverId,
        },
    });

    if (existing) throw new Error("Driver already added to this day");

    // Create DriverDay
    const driverDay = await prisma.driverDay.create({
        data: {
            dayId: data.dayId,
            driverProfileId: driverId,
            motorBoyName: data.motorBoyName || "",
            outstandingStartNaira: data.outstandingStartNaira,
            totalLoadedBags: 0,
            totalSoldBags: 0,
            finalReturnBags: 0,
            normalBags: 0,
            supplierBags: 0,
            totalTrips: 0,
            expectedNaira: 0,
            receivedLoggedNaira: 0,
            expensesNaira: 0,
            outstandingEndNaira: data.outstandingStartNaira,
        },
    });

    await AuditService.logAction(
        { userId: session.user.id, role: session.user.role as any },
        {
            entityType: "DRIVER_DAY",
            entityId: driverDay.id,
            action: "ADD_TO_DAY",
            newJson: driverDay
        }
    );

    revalidatePath("/app/drivers");
    revalidatePath("/app/today");
}
