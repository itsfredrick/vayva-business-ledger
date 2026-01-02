"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { DayService } from "@/lib/services/day-service";
import { ExpenseStatus } from "@prisma/client";
import { AuditService } from "@/lib/services/audit-service";
import { z } from "zod";
import { ExpenseSchema } from "@/lib/validation/schemas";
import { validateAction } from "@/lib/validation";

// --- Expense Management ---

export async function getDailyExpenses() {
    const day = await DayService.getCurrentDay();
    if (!day) return { expenses: [], dayStatus: "CLOSED", dayId: null, isEditable: false };

    const expenses = await prisma.expense.findMany({
        where: { dayId: day.id },
        include: { recordedBy: { select: { name: true } } },
        orderBy: { time: 'desc' }
    });

    return {
        expenses,
        dayStatus: day.status,
        dayId: day.id,
        isEditable: DayService.isEditable(day)
    };
}

export async function addExpense(raw: z.infer<typeof ExpenseSchema>) {
    return validateAction(ExpenseSchema, raw, async (data, context) => {
        const day = await DayService.getOrCreateToday();
        if (!day || !DayService.isEditable(day)) throw new Error("Day is closed or not available.");

        const expense = await prisma.expense.create({
            data: {
                dayId: day.id,
                whoTookMoney: data.whoTookMoney,
                category: data.category,
                amountNaira: data.amount,
                reason: data.reason,
                recordedByUserId: context.userId,
                receiptUrl: data.receiptUrl
            }
        });

        await AuditService.logAction(
            { userId: context.userId, role: context.role },
            {
                entityType: "EXPENSE",
                entityId: expense.id,
                action: "CREATE",
                newJson: expense
            }
        );

        revalidatePath("/app/expenses");
    });
}

// --- Petty Cash Logic ---

export async function getPettyCashStats() {
    const day = await DayService.getCurrentDay();
    // If no day, return empty stats
    if (!day) return null;

    // 1. Get Opening Cash (Yesterday's closing)
    // Find the DayRecord immediately before this one
    const prevDay = await prisma.dayRecord.findFirst({
        where: { date: { lt: day.date } },
        orderBy: { date: 'desc' },
        include: { cashLedger: true }
    });
    const openingCash = prevDay?.cashLedger?.closingCashNaira || 0;

    // 2. Compute Cash In (Drivers + Office + Dispenser)
    // a. Drivers
    const driverReceived = await prisma.driverDay.aggregate({
        where: { dayId: day.id },
        _sum: { cashReceivedNaira: true }
    });
    const cashFromDrivers = driverReceived._sum.cashReceivedNaira || 0;

    // b. Office Sales (CASH only)
    const officeSales = await prisma.koolJooOfficeSale.aggregate({
        where: { dayId: day.id, paymentType: "CASH" },
        _sum: { amountNaira: true }
    });
    const cashFromSales = officeSales._sum.amountNaira || 0;

    // c. Dispenser Payments (CASH only, paid TODAY)
    // Note: DispenserDelivery is not strictly tied to payment time, but DispenserPayment is.
    // We should sum DispenserPayment where paidAt is within today's range OR linked to dayId if we had it.
    // Schema `DispenserPayment` has `paidAt`. 
    // We can approximate "today" by using the day's date range (start of day to end of day).
    const startOfDay = new Date(day.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(day.date);
    endOfDay.setHours(23, 59, 59, 999);

    const dispenserCash = await prisma.dispenserPayment.aggregate({
        where: {
            method: "CASH",
            paidAt: { gte: startOfDay, lte: endOfDay }
        },
        _sum: { amountNaira: true }
    });
    const cashFromDispenser = dispenserCash._sum.amountNaira || 0;

    const totalCashIn = cashFromDrivers + cashFromSales + cashFromDispenser;

    // 3. Compute Cash Spent
    const expensesAgg = await prisma.expense.aggregate({
        where: { dayId: day.id },
        _sum: { amountNaira: true }
    });
    const totalSpent = expensesAgg._sum.amountNaira || 0;

    // 4. Get Current Ledger (if exists) for Closing/Variance
    const currentLedger = await prisma.cashLedger.findUnique({
        where: { dayId: day.id }
    });

    const closingCash = currentLedger?.closingCashNaira || 0;

    // Variance = (Opening + In - Spent) - Closing
    // Expected = Opening + In - Spent
    const expectedCash = openingCash + totalCashIn - totalSpent;
    const variance = closingCash - expectedCash;

    return {
        openingCash,
        cashInBreakdown: {
            drivers: cashFromDrivers,
            sales: cashFromSales,
            dispenser: cashFromDispenser,
            total: totalCashIn
        },
        spent: totalSpent,
        expectedCash,
        closingCash,
        variance,
        isClosed: !!currentLedger // If ledger exists, does it mean we 'submitted' closing? 
        // Maybe we UPSERT ledger entry as we go? 
        // Or we only create CashLedger when they hit "Submit Closing".
        // Let's assume effectively "submitted" if it exists, but allow updates if day open.
    };
}

export async function submitClosingCash(amount: number) {
    const session = await auth();
    if (!["STAFF", "OWNER"].includes(session?.user?.role || "")) throw new Error("Unauthorized");

    const day = await DayService.getCurrentDay();
    if (!day) throw new Error("No open day.");

    // Recompute stats to save snapshot values
    // Ideally we call getPettyCashStats logic again or extract it.
    // For simplicity, let's just create/update the ledger record with what we know + computed variance logic needs to happen.
    // Actually, CashLedger model has fields: opening, received, spent, closing, variance.
    // We should populate them all.

    // Copy-paste logic from getPettyCashStats to ensure atomic correctness inside transaction potentially?
    // Or just run it.

    // 1. Opening
    const prevDay = await prisma.dayRecord.findFirst({
        where: { date: { lt: day.date } },
        orderBy: { date: 'desc' },
        include: { cashLedger: true }
    });
    const openingCash = prevDay?.cashLedger?.closingCashNaira || 0;

    // 2. In
    const driverReceived = await prisma.driverDay.aggregate({ where: { dayId: day.id }, _sum: { cashReceivedNaira: true } });
    const officeSales = await prisma.koolJooOfficeSale.aggregate({ where: { dayId: day.id, paymentType: "CASH" }, _sum: { amountNaira: true } });

    const startOfDay = new Date(day.date); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(day.date); endOfDay.setHours(23, 59, 59, 999);
    const dispenserCash = await prisma.dispenserPayment.aggregate({ where: { method: "CASH", paidAt: { gte: startOfDay, lte: endOfDay } }, _sum: { amountNaira: true } });

    const totalIn = (driverReceived._sum.cashReceivedNaira || 0) + (officeSales._sum.amountNaira || 0) + (dispenserCash._sum.amountNaira || 0);

    // 3. Spent
    const expensesAgg = await prisma.expense.aggregate({ where: { dayId: day.id }, _sum: { amountNaira: true } });
    const totalSpent = expensesAgg._sum.amountNaira || 0;

    const expected = openingCash + totalIn - totalSpent;
    const variance = amount - expected;

    await prisma.cashLedger.upsert({
        where: { dayId: day.id },
        update: {
            openingCashNaira: openingCash,
            cashReceivedNaira: totalIn,
            cashSpentNaira: totalSpent,
            closingCashNaira: amount,
            varianceNaira: variance
        },
        create: {
            dayId: day.id,
            openingCashNaira: openingCash,
            cashReceivedNaira: totalIn,
            cashSpentNaira: totalSpent,
            closingCashNaira: amount,
            varianceNaira: variance
        }
    });

    revalidatePath("/app/expenses");
}

// --- Owner Review ---

export async function getExpensesForReview() {
    const session = await auth();
    if (session?.user?.role !== "OWNER") throw new Error("Unauthorized");

    return await prisma.expense.findMany({
        where: { ownerReviewedStatus: "PENDING" },
        include: { recordedBy: { select: { name: true } }, day: { select: { date: true } } },
        orderBy: { time: 'desc' }
    });
}

export async function reviewExpense(id: string, status: ExpenseStatus, note?: string) {
    const session = await auth();
    if (session?.user?.role !== "OWNER") throw new Error("Unauthorized");

    const oldExpense = await prisma.expense.findUnique({ where: { id } });
    if (!oldExpense) throw new Error("Expense not found");

    const expense = await prisma.expense.update({
        where: { id },
        data: {
            ownerReviewedStatus: status,
            ownerReviewNote: note,
            ownerReviewedByUserId: session.user.id!,
            ownerReviewedAt: new Date()
        }
    });

    await AuditService.logAction(
        { userId: session.user.id!, role: "OWNER" },
        {
            entityType: "EXPENSE",
            entityId: expense.id,
            action: `REVIEW_${status}`,
            oldJson: oldExpense,
            newJson: expense,
            reason: note
        }
    );

    revalidatePath("/app/expenses/review");
}
