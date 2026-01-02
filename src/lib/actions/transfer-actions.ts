"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { TransferStatus } from "@prisma/client";
import { DayService } from "@/lib/services/day-service";
import { AuditService } from "@/lib/services/audit-service";
import { z } from "zod";
import { TransferLogSchema } from "@/lib/validation/schemas";
import { validateAction } from "@/lib/validation";

// --- Transfer Logging ---

export async function getPendingTransfers() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Staff sees all? Or just today's? Usually transfers are relevant until matched.
    // Fetch all pending transfers.
    return await prisma.transferLog.findMany({
        where: { status: "PENDING" },
        orderBy: { claimedAt: 'desc' },
        include: {
            day: { select: { date: true } },
            driverDay: { include: { driverProfile: true } },
            officeSale: { select: { customerName: true } },
            dispenserDelivery: { include: { customer: true } }
        }
    });
}

export async function logTransfer(raw: z.infer<typeof TransferLogSchema>) {
    return validateAction(TransferLogSchema, raw, async (data, context) => {
        // If linking to a specific day, ensure day is open/valid? 
        // Transfers can be logged anytime, but linking to a closed day might be weird.
        // For now, allow logging freely.

        const transfer = await prisma.transferLog.create({
            data: {
                amountNaira: data.amount,
                senderName: data.senderName,
                bankAccountLabel: data.bankLabel || "Manual",
                status: "PENDING",
                driverDayId: data.driverDayId,
                officeSaleId: data.officeSaleId,
                dispenserDeliveryId: data.dispenserDeliveryId,
                // If logged without context, it's just a loose transfer
            }
        });

        await AuditService.logAction(
            { userId: context.userId, role: context.role },
            {
                entityType: "TRANSFER",
                entityId: transfer.id,
                action: "LOG",
                newJson: transfer
            }
        );

        revalidatePath("/app/transfers");
    });
}

// --- Bank Statement & Matching ---

// Mock PDF/CSV parsing for Phase 1
// In reality, we'd use 'pdf-parse' or 'csv-parse'.
export async function uploadStatement(formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== "OWNER") throw new Error("Unauthorized");

    const file = formData.get("file") as File;
    if (!file) throw new Error("No file uploaded");

    // Create StatementUpload record
    const upload = await prisma.statementUpload.create({
        data: {
            uploadedByUserId: session.user.id!,
            fromDate: new Date(), // Placeholder
            toDate: new Date(),   // Placeholder
            fileUrl: "placeholder_url", // In real app, upload to S3/Blob
        }
    });

    // Parse Content (Basic CSV Stub)
    const text = await file.text();
    const rows = text.split("\n").slice(1); // Skip header

    const newRows = [];
    for (const row of rows) {
        if (!row.trim()) continue;
        const cols = row.split(",");
        // Expected CSV: Date,Description,Amount,Reference
        // 2024-01-01,Transfer from John,5000,REF123
        if (cols.length < 3) continue;

        const dateStr = cols[0].trim();
        const desc = cols[1].trim();
        const amountStr = cols[2].trim();
        const ref = cols[3]?.trim() || "";

        const amount = parseFloat(amountStr);
        if (isNaN(amount)) continue;

        newRows.push({
            statementUploadId: upload.id,
            postedAt: new Date(dateStr) || new Date(),
            senderName: desc, // Naive extraction
            amountNaira: Math.abs(Math.round(amount)), // Handle negatives if debit/credit? Assuming credit only for now or filtered
            reference: ref
        });
    }

    if (newRows.length > 0) {
        await prisma.statementRow.createMany({ data: newRows });
    }

    revalidatePath("/app/transfers/matching");
    return { success: true, count: newRows.length };
}

export async function getUnmatchedItems() {
    const session = await auth();
    if (session?.user?.role !== "OWNER") throw new Error("Unauthorized");

    const transfers = await prisma.transferLog.findMany({
        where: { status: { in: ["PENDING", "NOT_FOUND"] } }, // PENDING or marked as not found previously
        orderBy: { claimedAt: 'desc' },
        take: 50
    });

    const statementRows = await prisma.statementRow.findMany({
        where: {
            transfers: { none: {} } // Not linked to ANY transfer
        },
        orderBy: { postedAt: 'desc' },
        take: 50
    });

    // Compute Matching Suggestions
    // Simple algorithm: Match Amount exactly. Fuzzy Name.
    const pairs = [];

    for (const t of transfers) {
        const exactAmountMatches = statementRows.filter(r => r.amountNaira === t.amountNaira);

        for (const r of exactAmountMatches) {
            // Calculate simple confidence
            let confidence = 0.5; // Base for amount match

            // Name match?
            const tName = t.senderName.toLowerCase();
            const rName = r.senderName.toLowerCase();

            if (rName.includes(tName) || tName.includes(rName)) {
                confidence += 0.4;
            }

            // Date proximity? (Within 2 days)
            const daysDiff = Math.abs(t.claimedAt.getTime() - r.postedAt.getTime()) / (1000 * 60 * 60 * 24);
            if (daysDiff <= 2) {
                confidence += 0.1;
            }

            if (confidence > 0.6) {
                pairs.push({
                    transfer: t,
                    statementRow: r,
                    confidence: Math.min(confidence, 1)
                });
            }
        }
    }

    // Sort pairs by confidence
    pairs.sort((a, b) => b.confidence - a.confidence);

    return { transfers, statementRows, suggestions: pairs };
}


export async function confirmMatch(transferId: string, statementRowId: string) {
    const session = await auth();
    if (session?.user?.role !== "OWNER") throw new Error("Unauthorized");

    const oldTransfer = await prisma.transferLog.findUnique({ where: { id: transferId } });

    await prisma.$transaction([
        prisma.transferLog.update({
            where: { id: transferId },
            data: {
                status: "MATCHED_MANUAL",
                matchedStatementRowId: statementRowId
            }
        })
        // StatementRow doesn't have a status field, just the relation check
    ]);

    const updatedTransfer = await prisma.transferLog.findUnique({ where: { id: transferId } });

    await AuditService.logAction(
        { userId: session.user.id!, role: "OWNER" },
        {
            entityType: "TRANSFER",
            entityId: transferId,
            action: "MATCH_CONFIRM",
            oldJson: oldTransfer,
            newJson: updatedTransfer,
            reason: `Matched with statement row ${statementRowId}`
        }
    );

    revalidatePath("/app/transfers/matching");
}
