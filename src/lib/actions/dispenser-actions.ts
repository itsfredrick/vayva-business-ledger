"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { DayService } from "@/lib/services/day-service";
import { BillingMode, PaymentType, DeliveryStatus } from "@prisma/client";

// --- Customers ---

export async function getDispenserCustomers() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    return await prisma.dispenserCustomer.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
    });
}

export async function saveDispenserCustomer(data: {
    id?: string;
    name: string;
    phone?: string;
    address?: string;
    billingMode: BillingMode;
    rate: number;
}) {
    const session = await auth();
    if (!["STAFF", "OWNER"].includes(session?.user?.role || "")) throw new Error("Unauthorized");

    if (data.id) {
        await prisma.dispenserCustomer.update({
            where: { id: data.id },
            data: {
                name: data.name,
                phone: data.phone,
                defaultAddress: data.address,
                billingMode: data.billingMode,
                defaultRatePerBottle: data.rate
            }
        });
    } else {
        await prisma.dispenserCustomer.create({
            data: {
                name: data.name,
                phone: data.phone,
                defaultAddress: data.address,
                billingMode: data.billingMode,
                defaultRatePerBottle: data.rate
            }
        });
    }
    revalidatePath("/app/dispenser/customers");
    revalidatePath("/app/dispenser");
}


// --- Daily Ledger ---

export async function getDispenserDay() {
    const day = await DayService.getCurrentDay();
    if (!day) return { deliveries: [], dayStatus: "CLOSED" as const, dayId: null, isEditable: false };

    const deliveries = await prisma.dispenserDelivery.findMany({
        where: { dayId: day.id },
        include: { customer: true },
        orderBy: { time: 'desc' }
    });

    return {
        deliveries,
        dayStatus: day.status,
        dayId: day.id,
        isEditable: DayService.isEditable(day)
    };
}

export async function addDispenserDelivery(data: {
    customerId: string;
    bottlesDelivered: number;
    bottlesReturned: number;
    rate: number;
    paymentType: PaymentType;
    amountPaid?: number; // Should equal expected if FULL payment
    notes?: string;
}) {
    const session = await auth();
    if (!["STAFF", "OWNER"].includes(session?.user?.role || "")) throw new Error("Unauthorized");

    const day = await DayService.getOrCreateToday();
    if (!day || !DayService.isEditable(day)) throw new Error("Day is closed or not available.");

    const owingDelta = data.bottlesDelivered - data.bottlesReturned;
    const amountExpected = data.bottlesDelivered * data.rate; // Assuming rate applies to delivered count

    // Transaction to update delivery and potentially customer balance
    await prisma.$transaction(async (tx) => {
        // 1. Create Delivery
        const delivery = await tx.dispenserDelivery.create({
            data: {
                dayId: day.id,
                customerId: data.customerId,
                bottlesDelivered: data.bottlesDelivered,
                bottlesReturned: data.bottlesReturned,
                owingBottles: owingDelta, // Snapshot of this transaction's effect
                ratePerBottle: data.rate,
                amountExpectedNaira: amountExpected,
                paymentType: data.paymentType,
                deliveryStatus: "DELIVERED",
                notes: data.notes
            }
        });

        // 2. Update Customer Bottle Balance
        await tx.dispenserCustomer.update({
            where: { id: data.customerId },
            data: {
                owingBottles: { increment: owingDelta }
            }
        });

        // 3. Handle Payment Logic
        if (data.paymentType === "CASH") {
            // Cash collected immediately? 
            // We should ideally have a DispenserPayment record or just trust the delivery record?
            // "CASH: record cash received immediately in the delivery record."
            // The schema has `DispenserPayment` separate from `DispenserDelivery`, linked via Invoice usually.
            // But for tracking "cash received today", we need to know.
            // PROMPT: "record cash received immediately in the delivery record"
            // The schema does NOT have `amountPaid` on `DispenserDelivery`. It has `amountExpectedNaira`.
            // It has `paymentType`.
            // If CASH, we assume they paid `amountExpected`.
            // We should PROBABLY create a `DispenserPayment` record linking to this delivery?
            // Schema: `DispenserPayment` has `allocatedInvoiceId`. Does not have `deliveryId`.
            // Schema has `payments` on `DispenserCustomer`.

            // DECISION: Create a `DispenserPayment` now for this customer.
            await tx.dispenserPayment.create({
                data: {
                    customerId: data.customerId,
                    amountNaira: amountExpected,
                    method: "CASH",
                    paidAt: new Date()
                    // No invoice ID yet
                }
            });
        }
        else if (data.paymentType === "TRANSFER") {
            // "TRANSFER: create linked TransferLog entry with proof."
            await tx.transferLog.create({
                data: {
                    dayId: day.id,
                    dispenserDeliveryId: delivery.id,
                    senderName: (await tx.dispenserCustomer.findUnique({ where: { id: data.customerId } }))?.name || "Unknown",
                    amountNaira: amountExpected,
                    bankAccountLabel: "Dispenser Transfer",
                    status: "PENDING"
                }
            });

            // Also record payment? Or wait for transfer confirmation?
            // Usually transfer is considered "Paid" pending confirmation.
            await tx.dispenserPayment.create({
                data: {
                    customerId: data.customerId,
                    amountNaira: amountExpected,
                    method: "TRANSFER",
                    paidAt: new Date()
                }
            });
        }
        // If MONTHLY, do nothing. It sits in `DispenserDelivery` to be swept into invoice later.
    });

    revalidatePath("/app/dispenser");
}

// --- Billing ---
export async function getUnbilledDeliveries(customerId: string) {
    // Deliveries not yet linked to an invoice line?
    // Schema: `DispenserInvoiceLine` links to `DispenserDelivery`.
    // So we find deliveries where `invoiceLines` is empty.
    return await prisma.dispenserDelivery.findMany({
        where: {
            customerId,
            invoiceLines: { none: {} },
            paymentType: "MONTHLY" // Only monthly ones need invoicing? Or all? Usually Monthly.
        },
        orderBy: { time: 'asc' }
    });
}

export async function generateInvoice(customerId: string, deliveries: string[]) {
    // Owner action
    const session = await auth();
    if (session?.user?.role !== "OWNER") throw new Error("Unauthorized");

    await prisma.$transaction(async (tx) => {
        const dels = await tx.dispenserDelivery.findMany({
            where: { id: { in: deliveries } }
        });

        if (dels.length === 0) return;

        const totalAmt = dels.reduce((sum, d) => sum + d.amountExpectedNaira, 0);
        const totalBottles = dels.reduce((sum, d) => sum + d.bottlesDelivered, 0);

        const invoice = await tx.dispenserInvoice.create({
            data: {
                customerId,
                invoiceMonth: new Date().toISOString().slice(0, 7), // "YYYY-MM"
                status: "ISSUED",
                totalBottles,
                totalAmountNaira: totalAmt,
                generatedByUserId: session.user.id!
            }
        });

        // Create Lines
        for (const d of dels) {
            await tx.dispenserInvoiceLine.create({
                data: {
                    invoiceId: invoice.id,
                    deliveryId: d.id,
                    deliveryDate: d.time,
                    bottlesDelivered: d.bottlesDelivered,
                    ratePerBottle: d.ratePerBottle, // Snapshot
                    lineAmountNaira: d.amountExpectedNaira
                }
            });
        }
    });
    revalidatePath("/app/dispenser/billing");
}
