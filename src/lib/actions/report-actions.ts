"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export type DashboardRange = "TODAY" | "WEEK" | "MONTH";

export async function getDashboardStats(range: DashboardRange) {
    const session = await auth();
    if (session?.user?.role !== "OWNER") throw new Error("Unauthorized");

    const now = new Date();
    let from = startOfDay(now);
    let to = endOfDay(now);

    if (range === "WEEK") {
        from = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        to = endOfWeek(now, { weekStartsOn: 1 });
    } else if (range === "MONTH") {
        from = startOfMonth(now);
        to = endOfMonth(now);
    }

    // 1. Pure Water Stats
    // Drivers
    const driverStats = await prisma.driverDay.aggregate({
        where: {
            day: { date: { gte: from, lte: to } }
        },
        _sum: {
            totalSoldBags: true,
            expectedNaira: true,
            cashReceivedNaira: true,
            outstandingEndNaira: true
        }
    });

    // Office Sales
    const officeStats = await prisma.koolJooOfficeSale.aggregate({
        where: {
            day: { date: { gte: from, lte: to } }
        },
        _sum: {
            bags: true,
            amountNaira: true
        }
    });

    // 2. Dispenser Stats (Range Based)
    const dispenserDeliveries = await prisma.dispenserDelivery.aggregate({
        where: {
            day: { date: { gte: from, lte: to } }
        },
        _sum: {
            bottlesDelivered: true,
            amountExpectedNaira: true
        }
    });

    // Dispenser Billings (Invoices generated in this range? Or deliveries billed? Prompt says "monthly billed". 
    // Usually means invoices issued in this period.)
    const invoices = await prisma.dispenserInvoice.aggregate({
        where: {
            generatedAt: { gte: from, lte: to }
        },
        _sum: {
            totalAmountNaira: true
        }
    });

    // Dispenser Owing Totals (Global Snapshot, not date range dependent)
    const dispenserOwing = await prisma.dispenserCustomer.aggregate({
        where: { isActive: true },
        _sum: { owingBottles: true }
    });

    // 3. Expenses
    const expenses = await prisma.expense.aggregate({
        where: {
            day: { date: { gte: from, lte: to } }
        },
        _sum: { amountNaira: true }
    });

    return {
        koolJoo: {
            bagsSold: (driverStats._sum.totalSoldBags || 0) + (officeStats._sum.bags || 0),
            revenueExpected: (driverStats._sum.expectedNaira || 0) + (officeStats._sum.amountNaira || 0), // Office sales expected = amount
            cashReceived: (driverStats._sum.cashReceivedNaira || 0) + (officeStats._sum.amountNaira || 0), // Assuming office is paid
            outstanding: driverStats._sum.outstandingEndNaira || 0
        },
        dispenser: {
            bottlesDelivered: dispenserDeliveries._sum.bottlesDelivered || 0,
            revenue: dispenserDeliveries._sum.amountExpectedNaira || 0,
            billed: invoices._sum.totalAmountNaira || 0,
            totalOwingBottles: dispenserOwing._sum.owingBottles || 0
        },
        expenses: {
            total: expenses._sum.amountNaira || 0
        }
    };
}

export async function getSystemAlerts() {
    const session = await auth();
    if (session?.user?.role !== "OWNER") throw new Error("Unauthorized");

    const alerts = [];

    // 1. Licenses
    const now = new Date();
    const licenses = await prisma.license.findMany();
    let expiringCount = 0;
    for (const l of licenses) {
        const days = Math.ceil((l.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (days <= 30) expiringCount++;
    }
    if (expiringCount > 0) {
        alerts.push({
            type: "LICENSE",
            message: `${expiringCount} license(s) expiring soon or expired.`,
            link: "/app/licenses",
            severity: "CRITICAL"
        });
    }

    // 2. Driver Shortfalls (Outstanding > 0 from closed days in last 7 days)
    const sevenDaysAgo = subDays(now, 7);
    const shortfalls = await prisma.driverDay.findMany({
        where: {
            day: { date: { gte: sevenDaysAgo }, status: "CLOSED" },
            outstandingEndNaira: { gt: 0 }
        },
        include: { driverProfile: true, day: true },
        take: 5
    });

    if (shortfalls.length > 0) {
        const total = shortfalls.reduce((acc, curr) => acc + curr.outstandingEndNaira, 0);
        alerts.push({
            type: "DRIVER_DEBT",
            message: `${shortfalls.length} recent driver deductions totaling ₦${total.toLocaleString()}.`,
            link: "/app/drivers", // Or a specific dashboard view
            severity: "WARNING"
        });
    }

    // 3. Unmatched Transfers (> 3 days)
    const threeDaysAgo = subDays(now, 3);
    const unmatched = await prisma.transferLog.count({
        where: {
            status: "PENDING",
            claimedAt: { lt: threeDaysAgo }
        }
    });
    if (unmatched > 0) {
        alerts.push({
            type: "TRANSFER",
            message: `${unmatched} pending transfers older than 3 days.`,
            link: "/app/transfers/matching",
            severity: "WARNING"
        });
    }

    // 4. Inventory Variance (Last 7 days, > 50 bags)
    const inventoryIssues = await prisma.inventoryDay.count({
        where: {
            day: { date: { gte: sevenDaysAgo } },
            // Prisma doesn't support absolute value in where clause easily mostly, 
            // check variances > 50 or < -50
            OR: [
                { varianceBags: { gt: 50 } },
                { varianceBags: { lt: -50 } }
            ]
        }
    });

    if (inventoryIssues > 0) {
        alerts.push({
            type: "INVENTORY",
            message: `${inventoryIssues} days with high inventory variance detected.`,
            link: "/app/inventory/review",
            severity: "CRITICAL"
        });
    }

    return alerts;
}

// --- Reporting Exports ---

// Returns raw data for client-side CSV generation
export async function getExportData(type: "SALES" | "EXPENSES", from: Date, to: Date) {
    const session = await auth();
    if (session?.user?.role !== "OWNER") throw new Error("Unauthorized");

    if (type === "SALES") {
        // Fetch DriverSales and OfficeSales
        const days = await prisma.dayRecord.findMany({
            where: { date: { gte: from, lte: to } },
            include: {
                driverDays: { include: { driverProfile: true } },
                officeSales: true,
                expenses: true
            }
        });

        // Flatten the data for easier processing if needed, or return as is
        const driverDays = days.flatMap(day => day.driverDays.map(dd => ({ ...dd, day: day })));
        const officeSales = days.flatMap(day => day.officeSales.map(os => ({ ...os, day: day })));

        return { driverDays, officeSales };
    }
    else if (type === "EXPENSES") {
        return await prisma.expense.findMany({
            where: { day: { date: { gte: from, lte: to } } },
            include: { day: true, recordedBy: { select: { name: true } } }
        });
    }

    return null;
}
