"use client";

import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, SerializedMutation } from "@/lib/db";

import { NetworkStatus } from "./network-status";

import { addOfficeSale } from "@/lib/actions/sales-actions";
import { addDispenserDelivery } from "@/lib/actions/dispenser-actions";
import { addExpense } from "@/lib/actions/expense-actions";

export function SyncProvider({ children }: { children: React.ReactNode }) {
    const [isOnline, setIsOnline] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // Watch for pending items
    const pendingItems = useLiveQuery(
        () => db.offlineQueue.where('status').equals('PENDING').sortBy('createdAt')
    );

    useEffect(() => {
        setIsOnline(navigator.onLine);
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Sync Loop
    useEffect(() => {
        if (!isOnline || isProcessing || !pendingItems || pendingItems.length === 0) return;

        const processQueue = async () => {
            setIsProcessing(true);

            // Process one by one to ensure order
            for (const item of pendingItems) {
                // Double check status hasn't changed
                const current = await db.offlineQueue.get(item.id);
                if (!current || current.status !== "PENDING") continue;

                try {
                    // Update status to syncing
                    await db.offlineQueue.update(item.id, { status: "SYNCING" });

                    // Execute Action
                    await executeMutation(item);

                    // Success: Remove or mark success
                    await db.offlineQueue.delete(item.id); // Delete to keep DB clean
                } catch (error: any) {
                    console.error("Sync failed for item", item, error);
                    // Mark failed
                    await db.offlineQueue.update(item.id, {
                        status: "FAILED",
                        error: error.message || "Unknown error"
                    });
                }
            }
            setIsProcessing(false);
        };

        processQueue();
    }, [isOnline, pendingItems, isProcessing]);

    return (
        <>
            {children}
            <NetworkStatus />
        </>
    );
}

// ... (imports are correct at top)

async function executeMutation(item: SerializedMutation) {
    switch (item.type) {
        case "ADD_TRIP":
            const { addTrip } = await import("@/lib/actions/driver-detail-actions");
            await addTrip(item.payload);
            break;
        case "ADD_SALE":
            await addOfficeSale(item.payload);
            break;
        case "ADD_DELIVERY":
            await addDispenserDelivery(item.payload);
            break;
        case "ADD_EXPENSE":
            await addExpense(item.payload);
            break;
        default:
            throw new Error("Unknown mutation type: " + item.type);
    }
}

